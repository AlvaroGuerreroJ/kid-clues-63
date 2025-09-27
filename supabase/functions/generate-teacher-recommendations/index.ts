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
    console.log('Teacher recommendations function called');
    const { periodSummary, group, dateRange } = await req.json();

    if (!periodSummary) {
      return new Response(JSON.stringify({ error: 'Period summary is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch recent feedback for additional context
    let query = supabase
      .from('student_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (group && group !== 'all') {
      query = query.eq('student_group', group);
    }

    const { data: recentFeedback, error } = await query;

    if (error) {
      console.error('Error fetching recent feedback:', error);
    }

    // Generate recommendations using Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Como experto en educación y trabajo en equipo, analiza el siguiente resumen ejecutivo del desempeño estudiantil y genera recomendaciones específicas y accionables para el profesor.

RESUMEN EJECUTIVO ANALIZADO:
${periodSummary}

CONTEXTO ADICIONAL:
- Filtro aplicado: ${group !== 'all' ? `Grupo ${group}` : 'Todos los grupos'}
- Período: ${dateRange}
- Datos recientes disponibles: ${recentFeedback ? `${recentFeedback.length} respuestas recientes` : 'No disponibles'}

GENERA RECOMENDACIONES PEDAGÓGICAS ESTRUCTURADAS:

## 🎯 ACCIONES INMEDIATAS (Próximos 1-3 días)
[3-4 acciones específicas que el profesor puede implementar de inmediato]

## 📚 ESTRATEGIAS A MEDIANO PLAZO (Próximas 1-2 semanas)  
[3-4 estrategias pedagógicas para implementar gradualmente]

## 🔄 MEJORAS SISTÉMICAS (Próximo mes)
[2-3 cambios estructurales en la metodología de enseñanza]

## 👥 INTERVENCIONES PERSONALIZADAS
[Recomendaciones específicas para estudiantes que requieren atención especial]

## 📊 MÉTRICAS DE SEGUIMIENTO
[Indicadores específicos para monitorear el progreso de las mejoras]

## 🛠️ RECURSOS RECOMENDADOS
[Herramientas, materiales o técnicas específicas que pueden ayudar]

REQUISITOS:
- Cada recomendación debe ser específica, measurable y accionable
- Incluir el "por qué" y "cómo" de cada recomendación
- Considerar diferentes estilos de aprendizaje
- Ser práctica para un entorno escolar real
- Máximo 350 palabras total`;

    console.log('Making request to Gemini API for teacher recommendations...');

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
          maxOutputTokens: 450,
        },
      }),
    });

    console.log('Gemini API response status:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'Error generating recommendations', details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiResponse.json();
    const recommendations = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudieron generar recomendaciones.';

    console.log('Teacher recommendations generated successfully');

    return new Response(JSON.stringify({ 
      recommendations,
      generatedAt: new Date().toISOString()
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