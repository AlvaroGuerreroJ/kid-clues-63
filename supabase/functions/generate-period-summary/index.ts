import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Period summary function called');
    const { group, dateRange } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch all feedback based on filters
    let query = supabase
      .from('student_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (group && group !== 'all') {
      query = query.eq('student_group', group);
    }

    // Apply date filtering if specified
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      query = query.gte('created_at', startDate.toISOString());
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
      return new Response(JSON.stringify({ 
        summary: 'No hay datos de retroalimentación disponibles para generar un resumen del período.' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing ${feedback.length} feedback entries`);

    // Process data for Gemini
    const feedbackSummary = {
      totalStudents: new Set(feedback.map(f => f.student_name)).size,
      totalResponses: feedback.length,
      dateRange: {
        from: feedback[feedback.length - 1]?.created_at,
        to: feedback[0]?.created_at
      },
      groups: [...new Set(feedback.map(f => f.student_group))],
      responses: feedback.map(f => ({
        student: f.student_name,
        group: f.student_group,
        date: f.created_at.split('T')[0],
        teamwork: f.question1_response,
        communication: f.question2_response,
        challenges: f.question3_response,
        goals: f.question4_response,
        improvements: f.question5_response,
        feelings: f.question6_response
      }))
    };

    // Generate summary using Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analiza el siguiente conjunto completo de datos de retroalimentación estudiantil sobre trabajo en equipo y colaboración:

RESUMEN DE DATOS:
- Período: Del ${feedbackSummary.dateRange.from} al ${feedbackSummary.dateRange.to}
- Total de estudiantes: ${feedbackSummary.totalStudents}
- Total de respuestas: ${feedbackSummary.totalResponses}
- Grupos participantes: ${feedbackSummary.groups.join(', ')}
- Filtro aplicado: ${group !== 'all' ? `Grupo ${group}` : 'Todos los grupos'}

DATOS COMPLETOS:
${JSON.stringify(feedbackSummary.responses, null, 2)}

Genera un RESUMEN EJECUTIVO COMPLETO de máximo 400 palabras que incluya:

1. **PANORAMA GENERAL**: Estado general del trabajo en equipo y colaboración
2. **TENDENCIAS PRINCIPALES**: Patrones identificados en las respuestas
3. **FORTALEZAS DESTACADAS**: Aspectos más positivos del trabajo colaborativo
4. **ÁREAS DE OPORTUNIDAD**: Desafíos y aspectos a mejorar
5. **DIFERENCIAS POR GRUPO**: Variaciones entre diferentes grupos (si aplica)
6. **EVOLUCIÓN TEMPORAL**: Cambios o mejoras observadas a lo largo del tiempo
7. **RECOMENDACIONES ESTRATÉGICAS**: 3-5 recomendaciones específicas para el profesor

El resumen debe ser profesional, analítico y orientado a la toma de decisiones pedagógicas. Enfócate en insights útiles para mejorar la experiencia educativa.`;

    console.log('Making request to Gemini API for period summary...');

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
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
          maxOutputTokens: 500,
        },
      }),
    });

    console.log('Gemini API response status:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'Error generating summary', details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    const summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar el resumen del período.';

    console.log('Period summary generated successfully');

    return new Response(JSON.stringify({ 
      summary,
      metadata: {
        totalStudents: feedbackSummary.totalStudents,
        totalResponses: feedbackSummary.totalResponses,
        dateRange: feedbackSummary.dateRange,
        groups: feedbackSummary.groups
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal server error', details: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});