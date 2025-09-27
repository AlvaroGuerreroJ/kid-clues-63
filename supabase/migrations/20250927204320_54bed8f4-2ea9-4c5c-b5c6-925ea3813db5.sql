-- Add columns for the additional questions in the student feedback form
ALTER TABLE public.student_feedback 
ADD COLUMN question5_response text,
ADD COLUMN question6_response text;