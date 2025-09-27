-- Create table for student feedback responses
CREATE TABLE public.student_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_group TEXT NOT NULL,
  question1_response TEXT,
  question2_response TEXT,
  question3_response TEXT,
  question4_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for this educational app
CREATE POLICY "Anyone can view student feedback" 
ON public.student_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create student feedback" 
ON public.student_feedback 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_feedback_updated_at
  BEFORE UPDATE ON public.student_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Spanish mock data
INSERT INTO public.student_feedback (student_name, student_group, question1_response, question2_response, question3_response, question4_response) VALUES
('María González', 'group-a', 'Me sentí muy emocionada con la lección de matemáticas. Los números me parecen divertidos.', 'Lo más interesante fue aprender sobre las fracciones con pizza. ¡Fue genial!', 'Las divisiones largas me resultaron un poco difíciles, pero seguiré practicando.', 'Trabajé muy bien con Ana y Carlos. Nos ayudamos mucho.'),
('Diego Rodríguez', 'group-b', 'Hoy me sentí un poco confundido al principio, pero después entendí mejor.', 'Me gustó mucho el experimento de ciencias con volcanes.', 'El vocabulario en inglés fue difícil para mí.', 'Mi equipo trabajó bien juntos, todos participamos.'),
('Sofía Martínez', 'group-a', 'Me sentí feliz y motivada durante toda la clase.', 'Aprender sobre los animales del océano fue fascinante.', 'No hubo nada muy difícil hoy, todo estuvo claro.', 'Colaboré excelente con mis compañeros en el proyecto.'),
('Alejandro López', 'group-c', 'Estuve un poco nervioso durante la presentación, pero me fue bien.', 'Los mapas de geografía fueron muy interesantes de estudiar.', 'Me costó memorizar las capitales de los países.', 'Trabajamos en equipo de manera fantástica.'),
('Isabella Castro', 'group-b', 'Me sentí orgullosa de mis respuestas en la clase.', 'La historia sobre los dinosaurios me encantó muchísimo.', 'Los problemas de geometría fueron complicados.', 'Ayudé a mis compañeros y ellos me ayudaron también.'),
('Santiago Herrera', 'group-d', 'Hoy tuve un día excelente aprendiendo cosas nuevas.', 'El arte y las pinturas famosas fueron lo mejor.', 'Necesito más práctica con la lectura en voz alta.', 'Nuestro grupo hizo un trabajo increíble juntos.'),
('Valentina Ruiz', 'group-c', 'Me sentí un poco cansada, pero seguí prestando atención.', 'Las plantas y cómo crecen fue muy educativo.', 'Las ecuaciones matemáticas me parecieron difíciles.', 'Trabajamos todos juntos de forma colaborativa.'),
('Mateo Jiménez', 'group-a', 'Estuve muy entusiasmado con los experimentos de hoy.', 'Aprender sobre el sistema solar fue increíble.', 'La ortografía de algunas palabras me confundió.', 'Mi equipo y yo nos comunicamos muy bien.'),
('Camila Torres', 'group-d', 'Me sentí confiada y lista para aprender más.', 'Los cuentos que leímos fueron muy divertidos.', 'Algunos conceptos de ciencias fueron complejos.', 'Colaboramos perfectamente en todas las actividades.'),
('Lucas Vargas', 'group-b', 'Tuve sentimientos mixtos, pero terminé contento.', 'La música y los instrumentos fueron lo más emocionante.', 'Me costó concentrarme en algunas partes.', 'Trabajé muy bien con todos mis compañeros de clase.');