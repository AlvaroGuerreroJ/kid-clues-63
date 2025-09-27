import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FeedbackInsight {
  id: string;
  student_name: string;
  student_group: string;
  created_at: string;
  question1_response: string;
  question2_response: string;
  question3_response: string;
  question4_response: string;
  question5_response: string;
  question6_response: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { date, group } = await req.json();

    // Fetch feedback for the specific date and group
    let query = supabase
      .from('student_feedback')
      .select('*')
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`)
      .order('created_at', { ascending: false });

    if (group && group !== 'all') {
      query = query.eq('student_group', group);
    }

    const { data: feedback, error } = await query;

    if (error) {
      console.error('Error fetching feedback:', error);
      return new Response(JSON.stringify({ error: 'Error fetching feedback' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!feedback || feedback.length === 0) {
      return new Response(JSON.stringify({ summary: 'No hay datos de retroalimentación para este día.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare data for Gemini
    const feedbackData = feedback.map((item: FeedbackInsight) => ({
      student: item.student_name,
      group: item.student_group,
      responses: {
        teamwork_contribution: item.question1_response,
        communication: item.question2_response,
        collaboration_challenges: item.question3_response,
        goal_achievement: item.question4_response,
        improvement_areas: item.question5_response,
        team_dynamics: item.question6_response,
      }
    }));

    // Generate summary using Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analiza las siguientes respuestas de estudiantes sobre trabajo en equipo y colaboración del ${date} ${group !== 'all' ? `del grupo ${group}` : 'de todos los grupos'}:

${JSON.stringify(feedbackData, null, 2)}

Genera un resumen textual comprensivo de máximo 200 palabras que incluya:
1. Estado general del trabajo en equipo
2. Principales fortalezas observadas
3. Áreas de mejora identificadas
4. Patrones o tendencias relevantes
5. Recomendaciones breves para el profesor

El resumen debe ser profesional, constructivo y enfocado en aspectos pedagógicos.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', await geminiResponse.text());
      return new Response(JSON.stringify({ error: 'Error generating summary' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    const summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar el resumen.';

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});