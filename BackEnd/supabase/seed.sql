-- Datos iniciales para la tabla recipes
insert into public.recipes
(title, description, tags, ingredients, notes, rating, photo_url, instructions, prep_time_minutes, servings)
values
-- 1
('Ensalada César','Clásica ensalada con pollo y aderezo',ARRAY['ensalada','pollo','rapido'],
 '[{"qty":200,"name":"lechuga","unit":"g"},{"qty":150,"name":"pollo","unit":"g"},{"qty":50,"name":"queso parmesano","unit":"g"}]'::jsonb,
 'Aderezo César al gusto',5,null,
 ARRAY['Lava y corta la lechuga','Dora el pollo en sartén','Mezcla con aderezo','Agrega crutones y parmesano'],15,2),

-- 2
('Pasta al pesto','Rápida y sabrosa',ARRAY['pasta','italiana','rapido'],
 '[{"qty":180,"name":"pasta","unit":"g"},{"qty":3,"name":"pesto","unit":"cda"}]'::jsonb,
 'Usa pesto fresco',5,null,
 ARRAY['Cuece la pasta en agua con sal','Tuesta piñones','Tritura albahaca, ajo, queso y piñones','Mezcla pasta con pesto'],20,2),

-- 3
('Tortilla de patatas','Clásico español',ARRAY['huevo','patata','tradicional'],
 '[{"qty":500,"name":"patata","unit":"g"},{"qty":4,"name":"huevo","unit":"ud"},{"qty":1,"name":"cebolla","unit":"ud"}]'::jsonb,
 'Mejor jugosa',5,null,
 ARRAY['Pela y corta patatas','Fríe con cebolla','Bate huevos','Mezcla todo','Cuaja en sartén'],40,4),

-- 4
('Gazpacho','Frío y refrescante',ARRAY['sopa','vegano','verano'],
 '[{"qty":700,"name":"tomate","unit":"g"},{"qty":1,"name":"pepino","unit":"ud"},{"qty":50,"name":"aceite","unit":"ml"}]'::jsonb,
 'Servir muy frío',5,null,
 ARRAY['Lava los vegetales','Tritura todo con pan y aceite','Ajusta sal y vinagre','Enfría en nevera'],20,4),

-- 5
('Paella mixta','Con pollo y mariscos',ARRAY['arroz','española','marisco'],
 '[{"qty":200,"name":"arroz","unit":"g"},{"qty":300,"name":"pollo","unit":"g"},{"qty":200,"name":"gambas","unit":"g"}]'::jsonb,
 'Usar caldo casero',5,null,
 ARRAY['Sofríe carne en paellera','Agrega verduras','Añade arroz y rehoga','Vierte caldo con azafrán','Agrega mariscos','Reposar 5 min'],60,6),

-- 6
('Croquetas de jamón','Cremosas',ARRAY['aperitivo','jamon','fritura'],
 '[{"qty":100,"name":"jamón","unit":"g"},{"qty":500,"name":"leche","unit":"ml"},{"qty":60,"name":"harina","unit":"g"}]'::jsonb,
 'Deja enfriar la masa',4,null,
 ARRAY['Prepara bechamel con jamón','Enfría masa 2h','Forma croquetas','Reboza','Fríe en aceite caliente'],90,6),

-- 7
('Lentejas estofadas','Tradicional',ARRAY['legumbre','guiso','invierno'],
 '[{"qty":250,"name":"lentejas","unit":"g"},{"qty":100,"name":"chorizo","unit":"g"},{"qty":1,"name":"zanahoria","unit":"ud"}]'::jsonb,
 'Dejar reposar antes de servir',5,null,
 ARRAY['Sofríe verduras','Añade lentejas y caldo','Agrega chorizo','Cocina 45 min a fuego lento'],60,4),

-- 8
('Pollo al curry','Con leche de coco',ARRAY['pollo','curry','india'],
 '[{"qty":300,"name":"pollo","unit":"g"},{"qty":200,"name":"leche coco","unit":"ml"},{"qty":1,"name":"curry","unit":"cda"}]'::jsonb,
 'Acompaña con arroz',5,null,
 ARRAY['Corta pollo en dados','Sofríe cebolla y especias','Añade pollo y dora','Agrega leche de coco','Cuece 20 min'],35,4),

-- 9
('Pizza margarita','Clásica italiana',ARRAY['pizza','horno','italiana'],
 '[{"qty":250,"name":"masa","unit":"g"},{"qty":150,"name":"queso","unit":"g"},{"qty":100,"name":"tomate","unit":"g"}]'::jsonb,
 'Hornear en piedra',4,null,
 ARRAY['Prepara masa y reposa','Extiende y añade salsa','Agrega mozzarella','Hornea 12 min a 220C'],90,2),

-- 10
('Canelones','Rellenos de carne',ARRAY['pasta','horno','italiana'],
 '[{"qty":12,"name":"placas","unit":"ud"},{"qty":200,"name":"carne","unit":"g"},{"qty":200,"name":"bechamel","unit":"ml"}]'::jsonb,
 'Congela bien',5,null,
 ARRAY['Prepara relleno','Cuece placas','Rellena con carne','Cubre con bechamel y queso','Hornea 20 min'],70,4),

-- 11
('Crema de calabaza','Suave',ARRAY['sopa','invierno','vegetariano'],
 '[{"qty":600,"name":"calabaza","unit":"g"},{"qty":1,"name":"zanahoria","unit":"ud"},{"qty":500,"name":"caldo","unit":"ml"}]'::jsonb,
 'Decora con pipas',4,null,
 ARRAY['Pela y corta calabaza','Sofríe cebolla','Añade caldo','Cuece 20 min','Tritura y sirve'],30,4),

-- 12
('Arroz a la cubana','Con plátano',ARRAY['arroz','huevo','rapido'],
 '[{"qty":150,"name":"arroz","unit":"g"},{"qty":1,"name":"huevo","unit":"ud"},{"qty":1,"name":"plátano","unit":"ud"}]'::jsonb,
 'Sirve con tomate frito',4,null,
 ARRAY['Cuece arroz','Fríe huevo','Fríe plátano','Monta el plato'],25,2),

-- 13
('Fideuá','Con marisco',ARRAY['marisco','valenciana','fideos'],
 '[{"qty":200,"name":"fideos","unit":"g"},{"qty":150,"name":"sepia","unit":"g"},{"qty":200,"name":"caldo pescado","unit":"ml"}]'::jsonb,
 'Servir con alioli',5,null,
 ARRAY['Sofríe sepia y gambas','Agrega fideos y rehoga','Añade caldo caliente','Cuece 10 min','Reposar 5 min'],40,4),

-- 14
('Empanada gallega','De atún',ARRAY['empanada','horno','gallega'],
 '[{"qty":300,"name":"masa","unit":"g"},{"qty":2,"name":"latas atún","unit":"ud"},{"qty":100,"name":"pimiento","unit":"g"}]'::jsonb,
 'Reposa antes de cortar',5,null,
 ARRAY['Prepara masa','Sofríe verduras y atún','Rellena y cubre','Hornea 40 min'],120,6),

-- 15
('Fabada','Asturiana',ARRAY['legumbre','guiso','tradicional'],
 '[{"qty":300,"name":"fabes","unit":"g"},{"qty":1,"name":"chorizo","unit":"ud"},{"qty":1,"name":"morcilla","unit":"ud"}]'::jsonb,
 'Deja reposar 15 min',5,null,
 ARRAY['Remoja fabes la noche anterior','Cuece fabes con agua fría','Agrega embutidos','Cuece 2h a fuego lento'],180,6),

-- 16
('Huevos rotos','Con jamón',ARRAY['huevo','patata','rapido'],
 '[{"qty":300,"name":"patatas","unit":"g"},{"qty":2,"name":"huevos","unit":"ud"},{"qty":50,"name":"jamón","unit":"g"}]'::jsonb,
 'Romper justo al servir',4,null,
 ARRAY['Fríe patatas','Fríe huevos','Coloca huevos sobre patatas','Rompe y añade jamón'],25,2),

-- 17
('Ratatouille','Francés',ARRAY['verduras','horno','francia'],
 '[{"qty":1,"name":"calabacín","unit":"ud"},{"qty":1,"name":"berenjena","unit":"ud"},{"qty":1,"name":"pimiento","unit":"ud"}]'::jsonb,
 'Usa salsa de tomate',4,null,
 ARRAY['Corta verduras en rodajas','Sofríe cebolla y ajo','Coloca en fuente con salsa','Hornea 40 min'],60,4),

-- 18
('Chili con carne','Tex-Mex',ARRAY['carne','picante','mexico'],
 '[{"qty":200,"name":"carne picada","unit":"g"},{"qty":200,"name":"alubias","unit":"g"},{"qty":100,"name":"tomate","unit":"g"}]'::jsonb,
 'Ajusta picante',5,null,
 ARRAY['Sofríe cebolla y pimiento','Agrega carne','Añade tomate y especias','Incorpora alubias','Cuece 30 min'],50,4),

-- 19
('Tacos de pollo','Mexicanos',ARRAY['pollo','mexico','rapido'],
 '[{"qty":200,"name":"pollo","unit":"g"},{"qty":6,"name":"tortillas","unit":"ud"},{"qty":50,"name":"salsa","unit":"g"}]'::jsonb,
 'Calienta tortillas',4,null,
 ARRAY['Cocina pollo y desmenúzalo','Calienta tortillas','Rellena con pollo y salsa','Sirve con cilantro'],25,3),

-- 20
('Couscous marroquí','Con verduras',ARRAY['couscous','vegano','legumbre'],
 '[{"qty":200,"name":"couscous","unit":"g"},{"qty":100,"name":"zanahoria","unit":"g"},{"qty":100,"name":"calabacín","unit":"g"}]'::jsonb,
 'Deja reposar 5 min tras hidratar',4,null,
 ARRAY['Hidrata el couscous con caldo','Sofríe verduras','Mezcla todo','Sirve caliente'],30,4),

-- 21
('Hamburguesa casera','Clásica',ARRAY['carne','pan','fastfood'],
 '[{"qty":200,"name":"ternera","unit":"g"},{"qty":1,"name":"pan","unit":"ud"},{"qty":30,"name":"queso","unit":"g"}]'::jsonb,
 'Tuesta el pan',4,null,
 ARRAY['Forma hamburguesa','Cocina a la plancha','Tuesta pan','Monta la hamburguesa'],25,2),

-- 22
('Sushi rolls','Japoneses',ARRAY['arroz','pescado','japon'],
 '[{"qty":200,"name":"arroz sushi","unit":"g"},{"qty":2,"name":"alga nori","unit":"ud"},{"qty":100,"name":"salmon","unit":"g"}]'::jsonb,
 'Moja cuchillo para cortar',5,null,
 ARRAY['Cuece arroz con vinagre','Coloca alga y arroz','Agrega relleno','Enrolla y corta'],60,4),

-- 23
('Pollo asado','Al horno',ARRAY['pollo','horno','tradicional'],
 '[{"qty":1,"name":"pollo","unit":"ud"},{"qty":2,"name":"patata","unit":"ud"},{"qty":1,"name":"limón","unit":"ud"}]'::jsonb,
 'Deja reposar antes de cortar',5,null,
 ARRAY['Limpia el pollo','Sazona con especias','Coloca en bandeja con patatas','Hornea 90 min'],100,5),

-- 24
('Quiche Lorraine','Tarta salada',ARRAY['huevo','horno','francia'],
 '[{"qty":200,"name":"masa brisa","unit":"g"},{"qty":100,"name":"bacon","unit":"g"},{"qty":100,"name":"queso","unit":"g"}]'::jsonb,
 'Servir tibia',5,null,
 ARRAY['Forra molde con masa','Bate huevos con nata','Agrega bacon y queso','Hornea 30 min'],50,6),

-- 25
('Pad Thai','Tailandés',ARRAY['noodles','tailandia','salteado'],
 '[{"qty":200,"name":"noodles arroz","unit":"g"},{"qty":100,"name":"camarones","unit":"g"},{"qty":50,"name":"brotes soja","unit":"g"}]'::jsonb,
 'Sirve con lima',5,null,
 ARRAY['Hidrata noodles','Sofríe camarones y huevo','Añade noodles y salsa','Agrega brotes y cacahuetes'],35,2),

-- 26
('Ravioli de ricotta','Pasta fresca',ARRAY['pasta','italiana','queso'],
 '[{"qty":200,"name":"harina","unit":"g"},{"qty":100,"name":"ricotta","unit":"g"},{"qty":50,"name":"espinaca","unit":"g"}]'::jsonb,
 'Sellar bien los bordes',5,null,
 ARRAY['Prepara masa','Haz relleno','Forma raviolis','Cuece 3 min','Sirve con salsa'],70,4),

-- 27
('Brownie','De chocolate',ARRAY['postre','chocolate','horno'],
 '[{"qty":200,"name":"chocolate","unit":"g"},{"qty":120,"name":"mantequilla","unit":"g"},{"qty":3,"name":"huevos","unit":"ud"}]'::jsonb,
 'No sobrehornear',5,null,
 ARRAY['Funde mantequilla y chocolate','Mezcla con azúcar y huevos','Agrega harina','Hornea 25 min','Enfría y corta'],45,8),

-- 28
('Tarta de queso','Cremosa',ARRAY['postre','queso','horno'],
 '[{"qty":300,"name":"queso crema","unit":"g"},{"qty":2,"name":"huevos","unit":"ud"},{"qty":100,"name":"azúcar","unit":"g"}]'::jsonb,
 'Enfriar antes de cortar',5,null,
 ARRAY['Tritura galletas y mantequilla','Bate queso con huevos y azúcar','Hornea 50 min','Enfría 4h en nevera'],70,10),

-- 29
('Crepes salados','Versátiles',ARRAY['crepes','brunch','rapido'],
 '[{"qty":120,"name":"harina","unit":"g"},{"qty":250,"name":"leche","unit":"ml"},{"qty":2,"name":"huevos","unit":"ud"}]'::jsonb,
 'Rellenar al gusto',4,null,
 ARRAY['Mezcla ingredientes','Calienta sartén','Cocina crepes','Rellena y sirve'],25,3),

-- 30
('Shakshuka','Huevos en tomate',ARRAY['huevo','tomate','brunch'],
 '[{"qty":3,"name":"huevos","unit":"ud"},{"qty":300,"name":"tomate triturado","unit":"g"},{"qty":1,"name":"pimiento","unit":"ud"}]'::jsonb,
 'Sirve con pan',5,null,
 ARRAY['Sofríe verduras','Agrega tomate','Haz huecos y casca huevos','Cocina a fuego lento','Sirve caliente'],35,3);
