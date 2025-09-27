import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon, TrendingUpIcon, AlertTriangleIcon, MessageSquareIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TeacherDashboard = () => {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedDate, setSelectedDate] = useState("today");
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailySummaries, setDailySummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [studentSummaries, setStudentSummaries] = useState<Record<string, string>>({});
  const [loadingStudentSummaries, setLoadingStudentSummaries] = useState<Record<string, boolean>>({});
  const [periodSummary, setPeriodSummary] = useState<string>('');
  const [loadingPeriodSummary, setLoadingPeriodSummary] = useState(false);

  useEffect(() => {
    fetchStudentFeedback();
  }, []);

  const fetchStudentFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('student_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        setLoading(false);
        return;
      }

      // Transform the data to match the expected format
      const transformedInsights = data?.map((feedback: any) => ({
        id: feedback.id,
        student: feedback.student_name,
        group: getGroupDisplayName(feedback.student_group),
        date: new Date(feedback.created_at).toISOString().split('T')[0],
        sentiment: analyzeSentiment(feedback),
        summary: generateSummary(feedback),
        keyWords: extractKeyWords(feedback),
        concerns: extractConcerns(feedback),
        // Include all original responses
        originalFeedback: {
          student_name: feedback.student_name,
          student_group: feedback.student_group,
          question1_response: feedback.question1_response,
          question2_response: feedback.question2_response,
          question3_response: feedback.question3_response,
          question4_response: feedback.question4_response,
          question5_response: feedback.question5_response,
          question6_response: feedback.question6_response,
        }
      })) || [];

      setInsights(transformedInsights);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGroupDisplayName = (groupId: string) => {
    const groupMap: Record<string, string> = {
      'group-a': 'Grupo A - Delfines',
      'group-b': 'Grupo B - Águilas', 
      'group-c': 'Grupo C - Leones',
      'group-d': 'Grupo D - Búhos',
    };
    return groupMap[groupId] || groupId;
  };

  const analyzeSentiment = (feedback: any) => {
    const positiveWords = ['emocionada', 'feliz', 'genial', 'excelente', 'increíble', 'fantástica', 'motivada', 'orgullosa', 'entusiasmado', 'confiada', 'bien', 'contento', 'sí', 'súper', 'divertido'];
    const negativeWords = ['confundido', 'difícil', 'nervioso', 'cansada', 'complicados', 'costó', 'mal', 'aburrido', 'dificultades', 'no'];
    
    const allText = `${feedback.question1_response || ''} ${feedback.question2_response || ''} ${feedback.question3_response || ''} ${feedback.question4_response || ''} ${feedback.question5_response || ''} ${feedback.question6_response || ''}`.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => allText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => allText.includes(word)).length;
    
    if (positiveCount > negativeCount && positiveCount > 0) return 'positive';
    if (negativeCount > positiveCount && negativeCount > 0) return 'attention';
    return 'neutral';
  };

  const generateSummary = (feedback: any) => {
    const responses = [feedback.question1_response, feedback.question2_response, feedback.question3_response, feedback.question4_response, feedback.question5_response, feedback.question6_response].filter(r => r);
    const mainResponse = responses.find(r => r && r.length > 50) || responses.find(r => r && r.length > 0) || '';
    return mainResponse.substring(0, 100) + (mainResponse.length > 100 ? '...' : '');
  };

  const extractKeyWords = (feedback: any) => {
    const allText = `${feedback.question1_response || ''} ${feedback.question2_response || ''} ${feedback.question3_response || ''} ${feedback.question4_response || ''} ${feedback.question5_response || ''} ${feedback.question6_response || ''}`.toLowerCase();
    const keywords = ['equipo', 'trabajo', 'colaborar', 'ayuda', 'compañeros', 'grupo', 'difícil', 'fácil', 'bien', 'mal'];
    return keywords.filter(word => allText.includes(word)).slice(0, 3);
  };

  const extractConcerns = (feedback: any) => {
    const allText = `${feedback.question1_response || ''} ${feedback.question2_response || ''} ${feedback.question3_response || ''} ${feedback.question4_response || ''} ${feedback.question5_response || ''} ${feedback.question6_response || ''}`.toLowerCase();
    const concerns = [];
    if (allText.includes('dificultades') || allText.includes('difícil') || allText.includes('problemas')) concerns.push('dificultades de colaboración');
    if (allText.includes('no') && (allText.includes('ayuda') || allText.includes('grupo'))) concerns.push('falta de comunicación');
    if (allText.includes('mal') || allText.includes('aburrido')) concerns.push('sentimiento negativo');
    return concerns;
  };

  const filteredInsights = insights.filter(insight => {
    if (selectedGroup === "all") return true;
    const groupDisplayName = getGroupDisplayName(selectedGroup);
    return insight.group === groupDisplayName;
  });

  const calculateStats = () => {
    const total = insights.length;
    const positive = insights.filter(i => i.sentiment === 'positive').length;
    const attention = insights.filter(i => i.sentiment === 'attention').length;
    const activeGroups = [...new Set(insights.map(i => i.group))].length;
    
    return {
      total,
      positivePercentage: total > 0 ? Math.round((positive / total) * 100) : 0,
      attention,
      activeGroups
    };
  };

  const stats = calculateStats();

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-insight-positive text-success";
      case "neutral": return "bg-insight-neutral text-muted-foreground";
      case "attention": return "bg-insight-attention text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "😊";
      case "neutral": return "😐";
      case "attention": return "😟";
      default: return "📝";
    }
  };

  const generateDailySummaries = () => {
    const dailyData: Record<string, any[]> = {};
    
    // Group insights by date
    filteredInsights.forEach(insight => {
      const date = insight.date;
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(insight);
    });

    // Generate summaries for each date
    return Object.entries(dailyData).map(([date, dayInsights]) => {
      const totalResponses = dayInsights.length;
      const sentimentCount = {
        positive: dayInsights.filter(i => i.sentiment === 'positive').length,
        neutral: dayInsights.filter(i => i.sentiment === 'neutral').length,
        attention: dayInsights.filter(i => i.sentiment === 'attention').length,
      };
      
      // Extract top keywords and concerns for the day
      const allKeywords = dayInsights.flatMap(i => i.keyWords);
      const keywordCount: Record<string, number> = {};
      allKeywords.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
      const topKeywords = Object.entries(keywordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([keyword]) => keyword);

      const allConcerns = dayInsights.flatMap(i => i.concerns);
      const concernCount: Record<string, number> = {};
      allConcerns.forEach(concern => {
        concernCount[concern] = (concernCount[concern] || 0) + 1;
      });
      const topConcerns = Object.entries(concernCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([concern, count]) => ({ concern, count }));

      const activeGroups = [...new Set(dayInsights.map(i => i.group))];

      return {
        date,
        totalResponses,
        sentimentCount,
        topKeywords,
        topConcerns,
        activeGroups,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const dailySummariesData = generateDailySummaries();

  const generateTextualSummary = async (date: string, group: string) => {
    if (loadingSummaries[date]) return;
    
    setLoadingSummaries(prev => ({ ...prev, [date]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-summary', {
        body: { date, group }
      });

      if (error) throw error;
      
      setDailySummaries(prev => ({
        ...prev,
        [date]: data.summary
      }));
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [date]: false }));
    }
  };

  const generateStudentSummary = async (insightId: string, studentFeedback: any) => {
    if (loadingStudentSummaries[insightId]) return;
    
    setLoadingStudentSummaries(prev => ({ ...prev, [insightId]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-student-summary', {
        body: { studentFeedback }
      });

      if (error) throw error;
      
      setStudentSummaries(prev => ({
        ...prev,
        [insightId]: data.summary
      }));
    } catch (error) {
      console.error('Error generating student summary:', error);
    } finally {
      setLoadingStudentSummaries(prev => ({ ...prev, [insightId]: false }));
    }
  };

  const generatePeriodSummary = async () => {
    if (loadingPeriodSummary) return;
    
    setLoadingPeriodSummary(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-period-summary', {
        body: { 
          group: selectedGroup, 
          dateRange: selectedDate 
        }
      });

      if (error) throw error;
      
      setPeriodSummary(data.summary);
    } catch (error) {
      console.error('Error generating period summary:', error);
    } finally {
      setLoadingPeriodSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-teacher-bg p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            🎓 Panel del Profesor
          </h1>
          <p className="text-muted-foreground">
            Perspectivas impulsadas por IA de las respuestas de los estudiantes
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Filtros y Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Grupo de Estudiantes</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Grupos</SelectItem>
                    <SelectItem value="group-a">Grupo A - Delfines</SelectItem>
                    <SelectItem value="group-b">Grupo B - Águilas</SelectItem>
                    <SelectItem value="group-c">Grupo C - Leones</SelectItem>
                    <SelectItem value="group-d">Grupo D - Búhos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rango de Fechas</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="teacher" className="w-full">
                  Generar Reporte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Respuestas Totales</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <CalendarIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sentimiento Positivo</p>
                  <p className="text-2xl font-bold text-success">{stats.positivePercentage}%</p>
                </div>
                <div className="rounded-full bg-success/10 p-3">
                  <TrendingUpIcon className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Necesitan Atención</p>
                  <p className="text-2xl font-bold text-warning">{stats.attention}</p>
                </div>
                <div className="rounded-full bg-warning/10 p-3">
                  <AlertTriangleIcon className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Grupos Activos</p>
                  <p className="text-2xl font-bold text-secondary">{stats.activeGroups}</p>
                </div>
                <div className="rounded-full bg-secondary/10 p-3">
                  <UsersIcon className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Summary */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <MessageSquareIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">🤖 Resumen Ejecutivo del Período</CardTitle>
                  <CardDescription>Análisis completo generado por IA de todos los datos disponibles</CardDescription>
                </div>
              </div>
              <Button
                onClick={generatePeriodSummary}
                disabled={loadingPeriodSummary}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loadingPeriodSummary ? 'Generando...' : 'Generar Resumen General'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {periodSummary ? (
              <div className="bg-white/50 dark:bg-gray-900/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="whitespace-pre-line text-foreground leading-relaxed">
                  {periodSummary}
                </div>
              </div>
            ) : (
              <div className="bg-white/30 dark:bg-gray-900/30 p-6 rounded-lg border border-dashed border-blue-300 dark:border-blue-700 text-center">
                <p className="text-muted-foreground italic">
                  Haz clic en "Generar Resumen General" para obtener un análisis ejecutivo completo del período seleccionado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Summaries */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5" />
            Resumen Diario de Feedbacks
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando resúmenes...</p>
            </div>
          ) : dailySummariesData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay datos suficientes para generar resúmenes diarios.</p>
            </div>
          ) : (
            dailySummariesData.map((summary) => (
              <Card key={summary.date} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        📅 {new Date(summary.date).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardTitle>
                      <CardDescription>
                        {summary.totalResponses} respuestas • {summary.activeGroups.length} grupos activos
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Distribución de Sentimientos</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-insight-positive text-success text-xs">
                          😊 {summary.sentimentCount.positive}
                        </Badge>
                        <Badge className="bg-insight-neutral text-muted-foreground text-xs">
                          😐 {summary.sentimentCount.neutral}
                        </Badge>
                        <Badge className="bg-insight-attention text-warning-foreground text-xs">
                          😟 {summary.sentimentCount.attention}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Groups */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Grupos Participantes:</p>
                      <div className="flex flex-wrap gap-1">
                        {summary.activeGroups.map((group, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Top Keywords */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Temas Principales:</p>
                      <div className="flex flex-wrap gap-1">
                        {summary.topKeywords.length > 0 ? (
                          summary.topKeywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">Sin temas identificados</p>
                        )}
                      </div>
                    </div>

                    {/* Top Concerns */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-warning">Preocupaciones del Día:</p>
                      <div className="space-y-1">
                        {summary.topConcerns.length > 0 ? (
                          summary.topConcerns.map((concern, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <Badge variant="destructive" className="text-xs">
                                {concern.concern}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {concern.count} estudiante{concern.count > 1 ? 's' : ''}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">Sin preocupaciones registradas</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Individual Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Perspectivas de Estudiantes</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando perspectivas...</p>
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay respuestas disponibles aún.</p>
            </div>
          ) : (
            filteredInsights.map((insight) => (
            <Card key={insight.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{insight.student}</CardTitle>
                    <CardDescription>{insight.group} • {insight.date}</CardDescription>
                  </div>
                  <Badge className={getSentimentColor(insight.sentiment)}>
                    {getSentimentIcon(insight.sentiment)} {insight.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resumen generado por IA */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        🤖 Resumen IA - Gemini
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateStudentSummary(insight.id, insight.originalFeedback)}
                        disabled={loadingStudentSummaries[insight.id]}
                      >
                        {loadingStudentSummaries[insight.id] ? 'Generando...' : 'Generar Resumen'}
                      </Button>
                    </div>
                    {studentSummaries[insight.id] ? (
                      <p className="text-sm leading-relaxed text-foreground">{studentSummaries[insight.id]}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Haz clic en "Generar Resumen" para obtener un análisis personalizado de las respuestas del estudiante.
                      </p>
                    )}
                  </div>

                  {/* Respuestas completas del estudiante */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">📝 Respuestas del Estudiante:</h4>
                    
                    {insight.originalFeedback.question1_response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          1. ¿Cómo contribuiste al trabajo en equipo hoy?
                        </p>
                        <p className="text-sm">{insight.originalFeedback.question1_response}</p>
                      </div>
                    )}
                    
                    {insight.originalFeedback.question2_response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          2. ¿Cómo fue la comunicación con tus compañeros?
                        </p>
                        <p className="text-sm">{insight.originalFeedback.question2_response}</p>
                      </div>
                    )}
                    
                    {insight.originalFeedback.question3_response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          3. ¿Qué desafíos enfrentaron como equipo?
                        </p>
                        <p className="text-sm">{insight.originalFeedback.question3_response}</p>
                      </div>
                    )}
                    
                    {insight.originalFeedback.question4_response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          4. ¿Lograron cumplir los objetivos como equipo?
                        </p>
                        <p className="text-sm">{insight.originalFeedback.question4_response}</p>
                      </div>
                    )}
                    
                    {insight.originalFeedback.question5_response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          5. ¿Qué podrían mejorar en el trabajo en equipo?
                        </p>
                        <p className="text-sm">{insight.originalFeedback.question5_response}</p>
                      </div>
                    )}
                    
                    {insight.originalFeedback.question6_response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          6. ¿Cómo te sentiste trabajando en equipo?
                        </p>
                        <p className="text-sm">{insight.originalFeedback.question6_response}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Palabras Clave:</p>
                    <div className="flex flex-wrap gap-2">
                       {insight.keyWords.map((word, index) => (
                         <Badge key={index} variant="secondary" className="text-xs">
                           {word}
                         </Badge>
                       ))}
                     </div>
                  </div>

                  {insight.concerns.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-warning">Áreas de Preocupación:</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.concerns.map((concern, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;