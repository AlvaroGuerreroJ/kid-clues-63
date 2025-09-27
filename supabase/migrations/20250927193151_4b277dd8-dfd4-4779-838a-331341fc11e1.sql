-- Create table for student feedback responses
CREATE TABLE public.student_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_group TEXT NOT NULL CHECK (student_group IN ('group-a', 'group-b', 'group-c', 'group-d')),
  question1_response TEXT,
  question2_response TEXT,
  question3_response TEXT,
  question4_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is implemented yet)
CREATE POLICY "Allow public read access to student feedback" 
ON public.student_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to student feedback" 
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

-- Insert synthetic data
INSERT INTO public.student_feedback (student_name, student_group, question1_response, question2_response, question3_response, question4_response, created_at) VALUES
('Emma Thompson', 'group-a', 'I felt really excited about learning about space today!', 'The most interesting thing was learning about black holes and how they work.', 'I found it hard to understand how gravity works in space.', 'I worked really well with my team and we helped each other.', '2024-01-15 09:30:00+00'),
('Liam Rodriguez', 'group-a', 'Today was pretty good, I enjoyed the math lesson.', 'I learned how to solve word problems step by step.', 'The multiplication part was confusing at first.', 'My group was great, we all took turns explaining things.', '2024-01-15 10:15:00+00'),
('Sophie Chen', 'group-b', 'I loved today''s art class! It was so much fun.', 'Learning about different painting techniques was amazing.', 'Mixing colors was harder than I thought it would be.', 'We shared materials nicely and gave each other ideas.', '2024-01-15 11:00:00+00'),
('Marcus Johnson', 'group-b', 'The science experiment was awesome!', 'I found out that plants need sunlight to grow properly.', 'I didn''t understand why some plants grow faster than others.', 'Everyone in my group helped set up the experiment.', '2024-01-15 14:20:00+00'),
('Isabella Garcia', 'group-c', 'Reading time was my favorite part of today.', 'I discovered a new book series that I really want to continue.', 'Some of the bigger words were difficult to pronounce.', 'We took turns reading aloud and everyone was respectful.', '2024-01-16 09:45:00+00'),
('Noah Williams', 'group-c', 'History class was interesting but long.', 'Learning about ancient Egypt and the pyramids was cool.', 'I couldn''t remember all the pharaoh names we learned.', 'My group worked together to build our pyramid model.', '2024-01-16 13:30:00+00'),
('Ava Kumar', 'group-d', 'I had a great day learning about animals.', 'The most interesting fact was that dolphins have names for each other.', 'I found it confusing how different animals adapt to their environments.', 'We collaborated well when researching our animal presentations.', '2024-01-16 15:10:00+00'),
('Ethan Brown', 'group-d', 'Music class was fantastic today!', 'I learned how to play a simple melody on the keyboard.', 'Reading musical notes is still challenging for me.', 'Everyone in my group helped me when I made mistakes.', '2024-01-17 10:00:00+00'),
('Mia Davis', 'group-a', 'PE class was energetic and fun!', 'I learned new soccer techniques and improved my skills.', 'Coordinating with teammates was sometimes difficult.', 'Our team worked together really well and encouraged each other.', '2024-01-17 11:30:00+00'),
('Oliver Wilson', 'group-b', 'Geography lesson about different countries was exciting.', 'I found it fascinating how different climates affect how people live.', 'Remembering all the country capitals was overwhelming.', 'My group helped me locate countries on the map.', '2024-01-17 14:45:00+00'),
('Charlotte Lee', 'group-c', 'Computer class taught me so many new things.', 'Learning basic coding concepts was like solving puzzles.', 'Understanding loops and sequences was pretty hard.', 'We paired up and helped debug each other''s code.', '2024-01-18 09:15:00+00'),
('William Martinez', 'group-d', 'Writing workshop was creative and inspiring.', 'I discovered I enjoy writing short stories about adventures.', 'Organizing my thoughts into paragraphs was challenging.', 'We shared our stories and gave positive feedback to each other.', '2024-01-18 13:00:00+00');