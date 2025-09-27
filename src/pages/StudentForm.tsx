import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StudentForm = () => {
  const [studentName, setStudentName] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [responses, setResponses] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
  });
  const { toast } = useToast();

  const questions = [
    "¿Cómo te sentiste con la lección de hoy?",
    "¿Qué fue lo más interesante que aprendiste?",
    "¿Hubo algo que te resultó difícil de entender?",
    "¿Qué tan bien trabajaste con tus compañeros de clase hoy?",
  ];

  const handleResponseChange = (questionKey: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !studentGroup) {
      toast({
        title: "Información Faltante",
        description: "Por favor ingresa tu nombre y selecciona tu grupo.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('student_feedback')
        .insert({
          student_name: studentName,
          student_group: studentGroup,
          question1_response: responses.question1,
          question2_response: responses.question2,
          question3_response: responses.question3,
          question4_response: responses.question4,
        });

      if (error) {
        toast({
          title: "Error",
          description: "Hubo un problema al enviar tus respuestas. Intenta de nuevo.",
          variant: "destructive",
        });
        console.error('Error saving feedback:', error);
        return;
      }

      toast({
        title: "¡Respuestas Enviadas!",
        description: "Gracias por compartir tus pensamientos con nosotros.",
      });

      // Reset form
      setStudentName("");
      setStudentGroup("");
      setResponses({
        question1: "",
        question2: "",
        question3: "",
        question4: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tus respuestas. Intenta de nuevo.",
        variant: "destructive",
      });
      console.error('Error saving feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-student-bg p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            📝 Reflexión Diaria
          </h1>
          <p className="text-muted-foreground">
            Comparte tus pensamientos sobre la experiencia de aprendizaje de hoy
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Cuéntanos sobre ti</CardTitle>
            <CardDescription>
              Primero, dinos quién eres
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tu Nombre</Label>
                <Input
                  id="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="transition-all duration-200 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Tu Grupo</Label>
                <Select value={studentGroup} onValueChange={setStudentGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group-a">Grupo A - Delfines</SelectItem>
                    <SelectItem value="group-b">Grupo B - Águilas</SelectItem>
                    <SelectItem value="group-c">Grupo C - Leones</SelectItem>
                    <SelectItem value="group-d">Grupo D - Búhos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {questions.map((question, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg text-secondary">
                  Pregunta {index + 1}
                </CardTitle>
                <CardDescription className="text-base">
                  {question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={responses[`question${index + 1}` as keyof typeof responses]}
                  onChange={(e) => handleResponseChange(`question${index + 1}`, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="min-h-[100px] transition-all duration-200 focus:ring-secondary/20"
                  rows={4}
                />
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button 
              type="submit" 
              variant="student"
              className="w-full sm:w-auto"
            >
              Enviar Mis Respuestas ✨
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;