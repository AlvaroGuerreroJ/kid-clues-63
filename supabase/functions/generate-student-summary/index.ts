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
    const { studentFeedback } = await req.json();

    if (!studentFeedback) {
      return new Response(JSON.stringify({ error: 'Student feedback data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate summary using Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analiza las siguientes respuestas de un estudiante sobre trabajo en equipo y colaboración:

Estudiante: ${studentFeedback.student_name}
Grupo: ${studentFeedback.student_group}

Respuestas:
1. ¿Cómo contribuiste al trabajo en equipo hoy?: ${studentFeedback.question1_response || 'Sin respuesta'}
2. ¿Cómo fue la comunicación con tus compañeros?: ${studentFeedback.question2_response || 'Sin respuesta'}
3. ¿Qué desafíos enfrentaron como equipo?: ${studentFeedback.question3_response || 'Sin respuesta'}
4. ¿Lograron cumplir los objetivos como equipo?: ${studentFeedback.question4_response || 'Sin respuesta'}
5. ¿Qué podrían mejorar en el trabajo en equipo?: ${studentFeedback.question5_response || 'Sin respuesta'}
6. ¿Cómo te sentiste trabajando en equipo?: ${studentFeedback.question6_response || 'Sin respuesta'}

Genera un resumen conciso de máximo 100 palabras que incluya:
- El nivel de participación y contribución del estudiante
- La calidad de la colaboración observada
- Puntos positivos destacables
- Áreas de mejora identificadas
- Recomendaciones específicas para el profesor

El resumen debe ser constructivo, profesional y enfocado en el desarrollo del trabajo en equipo.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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
          maxOutputTokens: 150,
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