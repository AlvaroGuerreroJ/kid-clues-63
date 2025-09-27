import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, BarChart3Icon, UsersIcon, BrainIcon } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">🎓 Aula Autónoma</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Transforma la retroalimentación estudiantil en perspectivas accionables. Ayuda a los profesores a entender el comportamiento del aula y las tendencias de aprendizaje a través del análisis impulsado por IA.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/student-form">
              <Button variant="student" size="lg" className="w-full sm:w-auto">
                📝 Formulario Estudiante
              </Button>
            </Link>
            <Link to="/teacher-dashboard">
              <Button variant="teacher" size="lg" className="w-full sm:w-auto">
                📊 Panel del Profesor
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-primary/10 p-3 w-fit">
                <BookOpenIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Formularios Simples</CardTitle>
              <CardDescription>
                Formularios amigables para niños que fomentan la retroalimentación honesta
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-secondary/10 p-3 w-fit">
                <BrainIcon className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Análisis con IA</CardTitle>
              <CardDescription>
                Análisis avanzado de sentimientos y extracción de perspectivas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-accent/10 p-3 w-fit">
                <BarChart3Icon className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Panel Inteligente</CardTitle>
              <CardDescription>
                Perspectivas visuales con filtrado por fecha y grupos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-success/10 p-3 w-fit">
                <UsersIcon className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-lg">Mejor Comprensión</CardTitle>
              <CardDescription>
                Rastrea el comportamiento del aula y los patrones de aprendizaje
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Cómo Funciona
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">Los Estudiantes Comparten</h3>
              <p className="text-muted-foreground">
                Los estudiantes llenan formularios simples de reflexión sobre su experiencia de aprendizaje
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-lg">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">La IA Analiza</h3>
              <p className="text-muted-foreground">
                Nuestra IA procesa las respuestas para identificar sentimientos, temas clave y preocupaciones
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">Los Profesores Actúan</h3>
              <p className="text-muted-foreground">
                Los profesores obtienen perspectivas accionables para mejorar la experiencia del aula
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;