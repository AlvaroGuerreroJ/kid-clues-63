-- Script para traducir los datos existentes a español
-- Ejecutar en el editor SQL de Supabase

-- Actualizar nombres de estudiantes y respuestas a español
UPDATE public.student_feedback SET 
  student_name = 'Emma González',
  question1_response = '¡Me sentí muy emocionada de aprender sobre el espacio hoy!',
  question2_response = 'Lo más interesante fue aprender sobre los agujeros negros y cómo funcionan.',
  question3_response = 'Me resultó difícil entender cómo funciona la gravedad en el espacio.',
  question4_response = 'Trabajé muy bien con mi equipo y nos ayudamos mutuamente.'
WHERE student_name = 'Emma Thompson';

UPDATE public.student_feedback SET 
  student_name = 'Liam Rodríguez',
  question1_response = 'Hoy estuvo bastante bien, disfruté la clase de matemáticas.',
  question2_response = 'Aprendí cómo resolver problemas de palabras paso a paso.',
  question3_response = 'La parte de multiplicación fue confusa al principio.',
  question4_response = 'Mi grupo fue genial, todos nos turnamos para explicar las cosas.'
WHERE student_name = 'Liam Rodriguez';

UPDATE public.student_feedback SET 
  student_name = 'Sofía Chen',
  question1_response = '¡Me encantó la clase de arte de hoy! Fue muy divertida.',
  question2_response = 'Aprender sobre diferentes técnicas de pintura fue increíble.',
  question3_response = 'Mezclar colores fue más difícil de lo que pensé.',
  question4_response = 'Compartimos materiales bien y nos dimos ideas unos a otros.'
WHERE student_name = 'Sophie Chen';

UPDATE public.student_feedback SET 
  student_name = 'Marco Johnson',
  question1_response = '¡El experimento de ciencias fue genial!',
  question2_response = 'Descubrí que las plantas necesitan luz solar para crecer correctamente.',
  question3_response = 'No entendí por qué algunas plantas crecen más rápido que otras.',
  question4_response = 'Todos en mi grupo ayudaron a preparar el experimento.'
WHERE student_name = 'Marcus Johnson';

UPDATE public.student_feedback SET 
  student_name = 'Isabella García',
  question1_response = 'El tiempo de lectura fue mi parte favorita del día.',
  question2_response = 'Descubrí una nueva serie de libros que realmente quiero continuar.',
  question3_response = 'Algunas de las palabras más grandes eran difíciles de pronunciar.',
  question4_response = 'Nos turnamos para leer en voz alta y todos fueron respetuosos.'
WHERE student_name = 'Isabella Garcia';

UPDATE public.student_feedback SET 
  student_name = 'Noah Williams',
  question1_response = 'La clase de historia fue interesante pero larga.',
  question2_response = 'Aprender sobre el antiguo Egipto y las pirámides fue genial.',
  question3_response = 'No pude recordar todos los nombres de faraones que aprendimos.',
  question4_response = 'Mi grupo trabajó junto para construir nuestro modelo de pirámide.'
WHERE student_name = 'Noah Williams';

UPDATE public.student_feedback SET 
  student_name = 'Ava Kumar',
  question1_response = 'Tuve un gran día aprendiendo sobre animales.',
  question2_response = 'El dato más interesante fue que los delfines tienen nombres entre ellos.',
  question3_response = 'Me resultó confuso cómo diferentes animales se adaptan a sus entornos.',
  question4_response = 'Colaboramos bien cuando investigamos nuestras presentaciones de animales.'
WHERE student_name = 'Ava Kumar';

UPDATE public.student_feedback SET 
  student_name = 'Ethan Brown',
  question1_response = '¡La clase de música fue fantástica hoy!',
  question2_response = 'Aprendí cómo tocar una melodía simple en el teclado.',
  question3_response = 'Leer notas musicales sigue siendo desafiante para mí.',
  question4_response = 'Todos en mi grupo me ayudaron cuando cometí errores.'
WHERE student_name = 'Ethan Brown';

UPDATE public.student_feedback SET 
  student_name = 'Mía Davis',
  question1_response = '¡La clase de educación física fue energética y divertida!',
  question2_response = 'Aprendí nuevas técnicas de fútbol y mejoré mis habilidades.',
  question3_response = 'Coordinarme con los compañeros de equipo fue a veces difícil.',
  question4_response = 'Nuestro equipo trabajó muy bien junto y nos alentamos mutuamente.'
WHERE student_name = 'Mia Davis';

UPDATE public.student_feedback SET 
  student_name = 'Oliver Wilson',
  question1_response = 'La lección de geografía sobre diferentes países fue emocionante.',
  question2_response = 'Me pareció fascinante cómo los diferentes climas afectan cómo vive la gente.',
  question3_response = 'Recordar todas las capitales de países fue abrumador.',
  question4_response = 'Mi grupo me ayudó a localizar países en el mapa.'
WHERE student_name = 'Oliver Wilson';

UPDATE public.student_feedback SET 
  student_name = 'Carlota Lee',
  question1_response = 'La clase de computación me enseñó tantas cosas nuevas.',
  question2_response = 'Aprender conceptos básicos de programación fue como resolver rompecabezas.',
  question3_response = 'Entender bucles y secuencias fue bastante difícil.',
  question4_response = 'Nos emparejamos y nos ayudamos a depurar el código de cada uno.'
WHERE student_name = 'Charlotte Lee';

UPDATE public.student_feedback SET 
  student_name = 'William Martínez',
  question1_response = 'El taller de escritura fue creativo e inspirador.',
  question2_response = 'Descubrí que disfruto escribir cuentos cortos sobre aventuras.',
  question3_response = 'Organizar mis pensamientos en párrafos fue desafiante.',
  question4_response = 'Compartimos nuestras historias y nos dimos comentarios positivos entre nosotros.'
WHERE student_name = 'William Martinez';