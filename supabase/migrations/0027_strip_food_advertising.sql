-- Dialy: remove advertising text from Open Food Facts food names so the
-- KH-Rechner shows what the food is, not how it is marketed:
--   superlatives and quality claims  "Feinste Butterwaffeln", "Premium Pekannüsse",
--                                    "Rewe Beste Wahl …", "Annas bestes …"
--   slogans and health claims        "… Für den täglichen Genuss", "reich an Omega 3",
--                                    "Pingummi mach dein leben trolliger!"
--   promotions and pack labels       "Limited/Winter/Summer Edition", "Vorteils Pack",
--                                    "Big Pack", "25g Protein 5100mg BCAAs"
--   "Das Original", "nach Original-Rezept", "wie hausgemacht", "ideal zum Braten"
--   shop prices                      "… 200g 2.40€ 1kg 36.40€"
-- Kept: words that describe the food (zartbitter, cremig, ungezuckert, ohne
-- Zuckerzusatz, flavour), product names that only sound like advertising
-- (Reis-fit, Pure Balance, Let's cook!, Happy Cola) and names that would
-- become too vague ("Das Original", "Premium Swiss Chocolate").
--
-- Step 1 renames 174 entries.
-- Step 2 hides 28 entries whose cleaned name already exists with carbs
-- within 3 g or 15 % (same rule as 0026), e.g. "Feinste Butterwaffeln" ->
-- "Butterwaffeln". Nothing is deleted.
--
-- Only off-* rows are affected; translations in `names` are left alone.
-- A row is only touched if its name is still the listed one, so later edits
-- in the Dialy-Editor are not overwritten. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app picks the changes up on its next sync.

update public.foods f
set name = v.new_name
from (values
  ('off-7610057010827', '100 % Obstsaft Premium Süessmost Naturrein', '100 % Obstsaft Süessmost'),
  ('off-7610900067275', 'Aktifit Sommer Edition Veggie & Fruit', 'Aktifit Veggie & Fruit'),
  ('off-4047247452731', 'ALDI ROI DE TREFLE Französische Käsespezialität Original französisch; Basses-Pyrénées, 150g Aus der Kühlung 2.99€ Packung 1kg = 19.93€', 'Roi de Trèfle Französische Käsespezialität'),
  ('off-4104420237414', 'Alnatura Kokosöl neutral im Geschmack 400mi 5.99€ 1l 14.58€', 'Alnatura Kokosöl neutral im Geschmack'),
  ('off-7610846437248', 'Amaretti nach Original-Rezept', 'Amaretti'),
  ('off-7613269461173', 'Anna''s beste Mazedonien-Frucht', 'Mazedonien-Frucht'),
  ('off-7613269351740', 'Anna''s bestes vegi hummus trio', 'Vegi Hummus Trio'),
  ('off-7613269260516', 'Annas beste frische Knoblauchsauce', 'Frische Knoblauchsauce'),
  ('off-7613269393108', 'Annas bestes französisches Dressing', 'Französisches Dressing'),
  ('off-7613269260554', 'Annas bestes Fres Dip al pepe', 'Dip al pepe'),
  ('off-7613269351764', 'Annas bestes Tapenadetrio', 'Tapenadetrio'),
  ('off-7613269550853', 'Annas bestes veggie salatschüssel-italienisches balsamico-dressing', 'Veggie Salatschüssel italienisches Balsamico-Dressing'),
  ('off-8410076482471', 'Authentic Mexican Tortilla Chips Blue Corn Mais-Chips aus blauem Mais mit Meersatz', 'Tortilla Chips Blue Corn'),
  ('off-8410076481726', 'Authentic Mexican Tortilla Chips Ranch Mais-Chips mit Barbecue-Geschmack', 'Tortilla Chips Ranch'),
  ('off-7613269508052', 'Best of Dim Sum with shrimps & vegetables', 'Dim Sum with shrimps & vegetables'),
  ('off-7613269416449', 'Bifidus Drink Multivitamin Für den täglichen Genuss', 'Bifidus Drink Multivitamin'),
  ('off-9001455025212', 'Bio-Genuss-Schinken', 'Bio-Schinken'),
  ('off-7613312205587', 'Black Angus beef smoked burger original recipe with sea salt and a smokey flavour', 'Black Angus beef smoked burger'),
  ('off-7610400070393', 'Blanc Amandes Feinste weisse Schweizer Chocolate', 'Blanc Amandes weisse Schweizer Chocolate'),
  ('off-8003495000786', 'Borlottibohnen von Orogel, die reich an Ballaststoffen und Proteinen sind', 'Borlottibohnen'),
  ('off-40875125', 'Bourbon Vanille Premium', 'Bourbon Vanille'),
  ('off-7649994899417', 'Brauner Zucker Premium Sirup', 'Brauner Zucker Sirup'),
  ('off-8411701070018', 'Cantábrico Premium Kantabrische Sardellenfilets in Olivenöl', 'Kantabrische Sardellenfilets in Olivenöl'),
  ('off-7610023001965', 'Champion Energy Plus : Vollwert Knuspermüesli : mit Vitaminen und Mineralstoffen', 'Champion Energy Plus Vollwert Knuspermüesli'),
  ('off-3331480000073', 'Chef dessert, citrons givrés - 4 Zitronensorbet in natürlicher zitronschale präsentiert', 'Citrons givrés - Zitronensorbet in Zitronenschale'),
  ('off-3331480000080', 'Chef dessert, oranges givrées - 4 Orangensorbet in natürlicher orangenschale präsentiert', 'Oranges givrées - Orangensorbet in Orangenschale'),
  ('off-7612100018767', 'Choco Neu', 'Choco'),
  ('off-7613356188839', 'Chocolatier suisse merry christmas! pralinés aus schweizer schokolade, assortiert', 'Chocolatier suisse Pralinés aus Schweizer Schokolade, assortiert'),
  ('off-7610400072878', 'Chocolettre Summer Edition Schweizer Milchschokolade mit Kokosnuss-Füllung', 'Chocolettre Schweizer Milchschokolade mit Kokosnuss-Füllung'),
  ('off-3700745000118', 'Collection Super aliments preiselbeeren cranberries Antioxidant Ohne Zuckerzusatz', 'Preiselbeeren Cranberries ohne Zuckerzusatz'),
  ('off-4009700073235', 'Danone Actimel Winter Edition Johannisbeere Hagebutte', 'Danone Actimel Johannisbeere Hagebutte'),
  ('off-4009700069146', 'Danone ACTIVIA (Vorteils Pack) Müsli / Dinkel & Walnuss / Quinoa & Sonnenblumenkerne / Cerealien 3,5%', 'Danone ACTIVIA Müsli / Dinkel & Walnuss / Quinoa & Sonnenblumenkerne / Cerealien 3,5%'),
  ('off-4009700069115', 'Danone ACTIVIA (Vorteils Pack) Pfirsich&Maracuja / Erdbeere / Himbeere / Vanille', 'Danone ACTIVIA Pfirsich&Maracuja / Erdbeere / Himbeere / Vanille'),
  ('off-4009700039842', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, doppelt Früchte Ananas, Kokosnuss', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Ananas, Kokosnuss'),
  ('off-4009700039866', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, doppelt Früchte Erdbeere, Dattel, Himbeere', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Erdbeere, Dattel, Himbeere'),
  ('off-4009700042842', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, doppelt Früchte Mango, Aprikose', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Mango, Aprikose'),
  ('off-4009700041128', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, wertvolle Cerealien Hafer, Chia, Dattel', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Hafer, Chia, Dattel'),
  ('off-4009700039835', 'Danone ACTIVIA Sommer Edition Kiwi/Aloe Vera 3,5%', 'Danone ACTIVIA Kiwi/Aloe Vera 3,5%'),
  ('off-4009700074317', 'Danone ACTIVIA Winter Edition Hafer, Apfel & Zimt', 'Danone ACTIVIA Hafer, Apfel & Zimt'),
  ('off-4009700042743', 'Danone ACTIVIA XXL ohne Zuckerzusatz & ohne Süßstoffe, doppelt Früchte Erdbeere, Himbeere, Dattel', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Erdbeere, Himbeere, Dattel'),
  ('off-4009700036261', 'Danone Danonino Vorratspack Erdbeer / Himbeere / Kirsche und Erdbeere / Banane / Aprikose', 'Danone Danonino Erdbeer / Himbeere / Kirsche und Erdbeere / Banane / Aprikose'),
  ('off-4009700036872', 'Danone Disney Mickey''s Vanille Joghurt mit Schoko Knusper Ohren Big Pack', 'Danone Disney Mickey''s Vanille Joghurt mit Schoko Knusper Ohren'),
  ('off-4009700036858', 'Danone Disney Minnie''s Erdbeer Joghurt mit Schoko Knusper Herzen Big Pack', 'Danone Disney Minnie''s Erdbeer Joghurt mit Schoko Knusper Herzen'),
  ('off-4009700042255', 'Danone MyPRO+ 20g Protein 4000mg BCAAs Protein Boost Schoko-Geschmack', 'Danone MyPRO+ Protein Boost Schoko-Geschmack'),
  ('off-4009700042378', 'Danone MyPRO+ 20g Protein 4000mg BCAAs Protein Boost Vanille-Geschmack', 'Danone MyPRO+ Protein Boost Vanille-Geschmack'),
  ('off-4009700042033', 'Danone MyPRO+ 25g Protein 5100mg BCAAs Erdbeer-Himbeer Geschmack', 'Danone MyPRO+ Erdbeer-Himbeer Geschmack'),
  ('off-4009700040534', 'Danone MyPRO+ 25g Protein 5100mg BCAAs Joghurtdrink Mango Geschmack', 'Danone MyPRO+ Joghurtdrink Mango Geschmack'),
  ('off-4009700041913', 'Danone MyPRO+ 25g Protein 5100mg BCAAs Vanille-Cookie Geschmack', 'Danone MyPRO+ Vanille-Cookie Geschmack'),
  ('off-4009700031709', 'Danone Weihnachtszwerge BIGPACK Erdbeere, Banane, Himbeere, Aprikose, Kirsche', 'Danone Weihnachtszwerge Erdbeere, Banane, Himbeere, Aprikose, Kirsche'),
  ('off-3700125800932', 'Das ausgezeichnete panettone aux aux pépites de chocolat', 'Panettone aux pépites de chocolat'),
  ('off-7613269260523', 'Das beste frische Curry von Anna Migros', 'Frisches Curry'),
  ('off-8713906061106', 'Délifrance 4 petits pains Céréales Französische Rezeptur', 'Délifrance 4 petits pains Céréales'),
  ('off-7610433839639', 'Delmaitre sandwich qualitäts-schinken', 'Delmaitre Sandwich Schinken'),
  ('off-3800740031503', 'Deroni Lutenitsa traditionell 520g - Традиционна лютеница', 'Deroni Lutenitsa'),
  ('off-28106340', 'Desira Premium Joghurt Vanille', 'Desira Joghurt Vanille'),
  ('off-7613269499312', 'Die beste Würze von tausend Inseln von Anna', 'Tausend-Inseln-Sauce'),
  ('off-7610449004212', 'Eclair Geschmack und Tradition Meringue Handwerk Rosine', 'Eclair Meringue Rosine'),
  ('off-4311501358481', 'EDEKA Haselnusskerne leicht geröstet und fein gehackt 200g 2.40€ 1kg 36.40€', 'EDEKA Haselnusskerne leicht geröstet und fein gehackt'),
  ('off-4061458252591', 'Eistee Premium - Mango-Maracuja', 'Eistee Mango-Maracuja'),
  ('off-7610900066995', 'Energy milk nouveau 26g high protein vanilla', 'Energy milk high protein vanilla'),
  ('off-8690103111318', 'ERDEN Market OBST Marmarabirlik Natürliche Schwarze Oliven 800g 4.39€ ATG 400g 4.39€ 1kg 5.49€', 'Marmarabirlik Schwarze Oliven'),
  ('off-5201054015124', 'Fage Total 2% Fettarmer Joghurt - griechisches Rezept', 'Fage Total 2% Fettarmer Joghurt'),
  ('off-5730800623059', 'Fairtrade DoubleShot Espresso Premium Coffee Drink', 'Fairtrade DoubleShot Espresso Coffee Drink'),
  ('off-8410076471918', 'Fajita kit extra mille super geschmack', 'Fajita Kit'),
  ('off-4099200032115', 'Feinste Butter Mandelblätter - Classic', 'Butter Mandelblätter - Classic'),
  ('off-22142573', 'Feinste Nuss-Variation (August Töpfer & Co. (GmbH & Co.) KG)', 'Nuss-Variation'),
  ('off-7613331258311', 'Feinster Zucker', 'Feinzucker'),
  ('off-24119092', 'Finest bakey feinste butter mandelblätter', 'Butter Mandelblätter'),
  ('off-7640164520216', 'Focuswater pink ribbon edition', 'Focuswater'),
  ('off-7610046250647', 'Fret Classic EINZELVERPACKTE MINIS Feinste Schweizer Schokoladewaffel', 'Fret Classic Minis Schweizer Schokoladewaffel'),
  ('off-7610046001676', 'Fret Feinste Schweizer Schokoladewaffel', 'Fret Schweizer Schokoladewaffel'),
  ('off-7616500658431', 'Frey Suprème Mandarin Zartbitterschocolade verfeinert mit einem Hauch Mandarine', 'Frey Suprème Mandarin Zartbitterschokolade'),
  ('off-8054188249685', 'Furchetta DOLOMITES LAMM RAGÙ AGNELLO Produkte vom Villnösser Brillenschaf', 'Lamm Ragù'),
  ('off-20059903', 'Glace Erdbeer Strawberry ice cream premium', 'Glace Erdbeer'),
  ('off-7610200067654', 'Gnocchi di patate al basilico : ideal zum Braten', 'Gnocchi di patate al basilico'),
  ('off-7610900008391', 'Griess töpfli rhabarber-erdbeere wie hausgemacht', 'Griess Töpfli Rhabarber-Erdbeere'),
  ('off-4311501367629', 'Gut & günstig Mandeln naturbelassen ganz 4311501367629 Mandeln naturbelassen ganz', 'Mandeln naturbelassen ganz'),
  ('off-4062300153615', 'Guten Morgen! Bircher-Müesli Bio-Getreidebrei', 'Bircher-Müesli Bio-Getreidebrei'),
  ('off-7613312020623', 'Guter Geschmack Lasagne Verdi', 'Lasagne Verdi'),
  ('off-5410976321019', 'Guylian Artisanal Belgian Chocolates Feine Belgische Pralinen mit Nuss-Nougat', 'Guylian Belgische Pralinen mit Nuss-Nougat'),
  ('off-7616700199154', 'Happy Hour Finest Gourmet Quiches', 'Happy Hour Quiches'),
  ('off-7616700193916', 'Happy Hour Finest Landrauchschinken Gipfel', 'Happy Hour Landrauchschinken Gipfel'),
  ('off-7640102850016', 'Haus-Sauce das Original', 'Haus-Sauce'),
  ('off-7611100323192', 'Herbmix French Ideal für ein feines Kräuterdressing', 'Herbmix French'),
  ('off-7610235003016', 'Hohes C reich an natürlichem Vitamin C ORANGE', 'Hohes C Orange'),
  ('off-4260126424470', 'Hot Mamas'' Premium Quality Sauces N 12 Chili Mix & Etwas Knoblauch', 'Hot Mamas'' Sauce N 12 Chili Mix & Knoblauch'),
  ('off-1200288900002', 'IKEA SÅS SENAP & DILL Soße zu Gravad Lachs. 200.288.90 1.99€ 0,2 kg 1kg 9.95€', 'Sås Senap & Dill Sauce zu Gravad Lachs'),
  ('off-7610200337566', 'JARIMBA HIMBO Mit natürlichen Aromen mit Himbeergeschmack', 'Jarimba Himbo mit Himbeergeschmack'),
  ('off-7613269878162', 'Joghurt limited edition Kaki Mandarine', 'Joghurt Kaki Mandarine'),
  ('off-7610057010506', 'Jus d''ananas premium', 'Jus d''ananas'),
  ('off-3273310123180', 'Kauffer''s Elsässer mini Flammkuchen Das Original', 'Kauffer''s Elsässer Mini Flammkuchen'),
  ('off-7610900068395', 'Klassiker gegrillter Käse', 'Gegrillter Käse'),
  ('off-7613269293569', 'Köstlicher Piadina-Schinken', 'Piadina-Schinken'),
  ('off-7616700176995', 'Köstlicher roher Schinken', 'Roher Schinken'),
  ('off-4002015532343', 'Krini Steinpilz Bruschetta Köstliche Steinpilzzubereitung', 'Krini Steinpilz Bruschetta'),
  ('off-7617400037456', 'L''amour nr. 22 schweizer qualität', 'L''amour Nr. 22'),
  ('off-4036554702462', 'Layenberger fit feelgood diät heidelbeer-cassis geschmack', 'Layenberger Diät Heidelbeer-Cassis Geschmack'),
  ('off-4056489524090', 'LIDL ITALIAMO Kirschtomaten-Sauce -Salsa di pomodoro ciliegino giallo 330g Flasche 1.29€ 1kg 3.91€', 'Italiamo Kirschtomaten-Sauce'),
  ('off-20034177', 'LIDL Realforno Cantuccini sweet biscuits with almonds 300g 1.69€ 1kg 5.63€', 'Realforno Cantuccini mit Mandeln'),
  ('off-10931271', 'Limited Edition Erdbeer Citron vert', 'Erdbeer Citron vert'),
  ('off-7613035524941', 'Limited Edition Plätzli Ratatouille', 'Plätzli Ratatouille'),
  ('off-8003340093475', 'Lindor Unendlich Zartschmelzend Erdbeere & Rahm', 'Lindor Erdbeere & Rahm'),
  ('off-7610400030632', 'Lindor Unendlich Zartschmelzend Weiss', 'Lindor Weiss'),
  ('off-5310005029971', 'Luna Premium Pistazien', 'Luna Pistazien'),
  ('off-7610449002270', 'MA REGION Fabrication artisanale Fluettes croustillantes mit butter Eclair Saveur & Tradition', 'Fluettes croustillantes mit Butter'),
  ('off-3083681005806', 'Mais-oliven-mix mit olivenöl mit original goldmaïs knackig & frisch im geschmack', 'Mais-Oliven-Mix mit Olivenöl'),
  ('off-4014400921243', 'Merci Limited Edition - Creme-Frucht Selection', 'Merci Creme-Frucht Selection'),
  ('off-4000446001315', 'Mestemacher Premium Vollkorn Brotkorb', 'Mestemacher Vollkorn Brotkorb'),
  ('off-7610200302847', 'Microc extra rustica die kräftige, knackige weizenscheibe', 'Microc extra rustica Weizenscheibe'),
  ('off-7610400079723', 'MILCH CRUNCHY Feinste Schweizer Milch-Chocolade Crunchy', 'Milch Crunchy Schweizer Milch-Chocolade'),
  ('off-7611100149617', 'Minestrone Mit 40% mehr Pasta', 'Minestrone mit Pasta'),
  ('off-7610041080201', 'Munz Swiss premium - 70% cacao', 'Munz 70% Cacao'),
  ('off-7613356475830', 'Napolitains PREMIUM', 'Napolitains'),
  ('off-7610829135604', 'Naturaplan - Power Mix - Sprossen Mischtung', 'Sprossen Mischung'),
  ('off-4099200022550', 'Nüsse-Feinste Nussvariation', 'Nussvariation'),
  ('off-7613312242582', 'Nüsse: Nuss-Sinfonie Premium Nuts', 'Nuss-Sinfonie'),
  ('off-7613034267764', 'Of Switzerlalnd Ambassador Abricotine du Valais Sauerkirschen in Walliser Aprikosenbrand mit feinster Schokolade überzogen', 'Of Switzerland Ambassador Abricotine du Valais Sauerkirschen in Walliser Aprikosenbrand mit Schokolade überzogen'),
  ('off-9120062240105', 'Omi''s Apfel Strudel Das Original', 'Omi''s Apfelstrudel'),
  ('off-7610582666407', 'Pastete nach Traditioneller Art', 'Pastete'),
  ('off-8001665706704', 'Pfannen-Gnocchi Kürbis, Winter Edition', 'Pfannen-Gnocchi Kürbis'),
  ('off-40225760', 'Pickerd aus liebe am backen vollmilchglasur', 'Pickerd Vollmilchglasur'),
  ('off-4000512364603', 'Pingummi mach dein leben trolliger!', 'Pingummi'),
  ('off-7640128538394', 'Pomme Chips 100% natürlich', 'Pomme Chips'),
  ('off-4029679900042', 'Powerbar Proteinplus Chocolate-Brownie - Eiweißriegel für Sportler, überzogen mit Milchschokolade, mit Süßungsmittel', 'Powerbar Proteinplus Chocolate-Brownie'),
  ('off-0798190119489', 'Premium American Peanut Butter - Crunchy', 'American Peanut Butter - Crunchy'),
  ('off-4099200035741', 'Premium Cookies Apple Pie', 'Cookies Apple Pie'),
  ('off-4099200035734', 'Premium cookies hazelnut creme et chocolate', 'Cookies hazelnut creme et chocolate'),
  ('off-8424465935578', 'Premium Filled Donuts', 'Filled Donuts'),
  ('off-4099200013541', 'Premium ketchup ohne Zuckerzusatz', 'Ketchup ohne Zuckerzusatz'),
  ('off-22144836', 'Premium Müsli Früchte und Nüsse', 'Müsli Früchte und Nüsse'),
  ('off-7613312069950', 'Premium Nuts Curry Nussmischung', 'Curry Nussmischung'),
  ('off-7613269288374', 'Premium Nuts Erdnüsse mit Wasabigeschmack', 'Erdnüsse mit Wasabigeschmack'),
  ('off-7613269235569', 'Premium Trüffelcrèmesauce', 'Trüffelcrèmesauce'),
  ('off-7616500913721', 'Prestige 14 köstliche pralinesorten', 'Prestige Pralinés'),
  ('off-5053990111312', 'Pringoooals : Pizza (Limited edition)', 'Pringoooals Pizza'),
  ('off-5022313270906', 'Pure premium 100% pure pressed oranges mit fruchtfleisch', 'Pure Premium Orangensaft mit Fruchtfleisch'),
  ('off-8719200233560', 'Rama sooo BUTTRIG!', 'Rama buttrig'),
  ('off-4388844075573', 'Rewe Beste Wahl Artischocken herzen in stücken in öl mit petersilie', 'Artischockenherzen in Stücken in Öl mit Petersilie'),
  ('off-4388844183797', 'Rewe Beste Wahl Butter Chicken Sauce nach indischer art', 'Butter Chicken Sauce nach indischer Art'),
  ('off-4388844152908', 'Rewe Beste Wahl Gefüllte Weinblätter mit reis', 'Gefüllte Weinblätter mit Reis'),
  ('off-4388844149946', 'Rewe Beste Wahl Grüne Oliven gefüllt mit knoblauch', 'Grüne Oliven gefüllt mit Knoblauch'),
  ('off-4388844113701', 'Rewe Beste Wahl Grüne Oliven gefüllt mit parmesan-mandel-creme', 'Grüne Oliven gefüllt mit Parmesan-Mandel-Creme'),
  ('off-4388860131017', 'Rewe Beste Wahl Jasmin Reis Duftreis', 'Jasmin Reis Duftreis'),
  ('off-42229094', 'Rewe Beste Wahl Mediterrane spezialität mit knoblauch und chili', 'Mediterrane Spezialität mit Knoblauch und Chili'),
  ('off-4388844238114', 'Rewe Beste Wahl Pfefferonen gefüllt mit frischkäsezubereitung in öl', 'Pfefferonen gefüllt mit Frischkäsezubereitung in Öl'),
  ('off-4388844203914', 'REWE Beste Wahl Snacktomaten mit Kräutern', 'Snacktomaten mit Kräutern'),
  ('off-7617100053404', 'Rindshacksteak gewürzt - premium', 'Rindshacksteak gewürzt'),
  ('off-7610807000689', 'Risotto Carnaroli : Bester Risottories', 'Risotto Carnaroli'),
  ('off-7613035567030', 'Sauce SWEET & SOUR NATUR SUSCH NÜÜT!', 'Sauce Sweet & Sour'),
  ('off-9004998900664', 'Schoko-kürbis Zartbitter Schokoladiger Snack, ideal für zwischendurch', 'Schoko-Kürbis Zartbitter'),
  ('off-4099200160559', 'Schokolade Premium Pudding', 'Schokoladen Pudding'),
  ('off-8410324710011', 'Shinzu Premium Sushi Rice', 'Shinzu Sushi Rice'),
  ('off-7613312066652', 'Small Butter Limited Edition Strawberry', 'Small Butter Strawberry'),
  ('off-7613269333098', 'SMAMS FUNNY FRUITS mit Fruchtsäften und natürlichen Farbstoffen', 'Smams Funny Fruits'),
  ('off-7613269333234', 'Smams Maxi Mix 6 aromen Kaubonbonmischung, mit natürlichen Farbstoffen', 'Smams Maxi Mix Kaubonbonmischung'),
  ('off-7613269605560', 'Special edition rote johannisbeere joghurt', 'Rote Johannisbeere Joghurt'),
  ('off-8715700208664', 'Steaksauce Honey BBQ Grillsauce mit süßlich rauchiger Geschmack 300g 3.99€ 1l 13.30€', 'Steaksauce Honey BBQ'),
  ('off-7616500646155', 'Suprême Noir authentique - Feine Zartbitterschokolade mit dunkler, cremiger Füllung', 'Suprême Noir - Zartbitterschokolade mit dunkler Füllung'),
  ('off-7613312034828', 'Swiss Premium Sirup mit Holunderblütenextrakt pasteurisiert', 'Sirup mit Holunderblütenextrakt'),
  ('off-4260284480127', 'TEE stick lembke die mit ohne Naturbelassener Bio-Früchtetee Apfel & Zimt', 'Bio-Früchtetee Apfel & Zimt'),
  ('off-3700363600882', 'Terre de Crau Früchte mit einem guten Geschmack von Nektarinenekten der Provence', 'Terre de Crau Nektarinen'),
  ('off-3700363600868', 'Terre de Crau Nektarpfirsich trägt den Geschmack der Provence', 'Terre de Crau Nektarpfirsich'),
  ('off-8854404000126', 'Thai Premium Ingredient Coconut Cream', 'Coconut Cream'),
  ('off-7613035356382', 'The Art Of Swiss Ice Cream Swiss Cantons Limited Edition Basler Rahmtäfeli & Öpfel', 'Glace Basler Rahmtäfeli & Öpfel'),
  ('off-4030387003741', 'Tiamo Feinste Trüffel marc de Champagne', 'Tiamo Trüffel Marc de Champagne'),
  ('off-8001665706575', 'Traditionelle gebratene Gnocchi', 'Gebratene Gnocchi'),
  ('off-7617027010184', 'Traubenzucker Mit Orangengeschmack, reich an Vitamin C', 'Traubenzucker mit Orangengeschmack'),
  ('off-3760122960558', 'Und Augustin Cow, um den unglaublichen Joghurt zu trinken;) Himbeer-Minze', 'Trinkjoghurt Himbeer-Minze'),
  ('off-3760122960466', 'Und Augustin die Unruhestifter des Geschmacks Petit Pot Joghurt mit Limette', 'Joghurt mit Limette'),
  ('off-20457594', 'Unsere Besten Bauernbrötchen', 'Bauernbrötchen'),
  ('off-0072457331082', 'Walden Farms Balsamic Vinaigrette Calorie Free Sugar Free Fat Free Carbohydrate Free Gluten Free Cholesterol Free', 'Walden Farms Balsamic Vinaigrette'),
  ('off-7617027919425', 'Werners Markt - Magenbrot Das Original', 'Magenbrot'),
  ('off-4008258416006', 'Wertvolle Snacks Ananas Ungezuckert', 'Ananas ungezuckert'),
  ('off-7616500663503', 'Yummy milch napolitains', 'Milch Napolitains')
) as v(id, name, new_name)
where f.id = v.id
  and f.name = v.name;

update public.foods f
set active = false
from (values
  -- -> Becel Classic (off-8719200261464)
  ('off-8719200235878', 'Becel Classic, reich an Omega 3'),
  -- -> Chocolat Stella Ohne Zuckerzusatz (off-7610148187063)
  ('off-7610202336017', 'Chocolat Stella SWISS PREMIUM QUALITY OHNE ZUCKERZUSATZ'),
  -- -> Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Mango, Aprikose (off-4009700042842)
  ('off-4009700040275', 'Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, doppelt Früchte Mango, Aprikose'),
  -- -> Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, Hafer, Chia, Dattel (off-4009700041128)
  ('off-4009700041074', 'Danone ACTIVIA XXL ohne Zuckerzusatz & ohne Süßstoffe, wertvolle Cerealien Hafer, Chia, Dattel'),
  -- -> Danone MyPRO+ Joghurtdrink Mango Geschmack (off-4009700040534)
  ('off-4009700040503', 'Danone MyPRO+ 25g Protein 5100mg BCAAs Joghurtdrink Mango Geschmack'),
  -- -> Danone MyPRO+ Vanille-Cookie Geschmack (off-4009700041913)
  ('off-4009700039446', 'Danone MyPRO+ 25g Protein 5100mg BCAAs Vanille-Cookie Geschmack'),
  -- -> Butterwaffeln (off-7613312261361)
  ('off-24119085', 'Feinste Butterwaffeln'),
  -- -> Leckerli (off-7616700246193)
  ('off-7616700020267', 'Feinste Leckerli'),
  -- -> Lebkuchen (blv-14287)
  ('off-7610200018298', 'Feinster Lebkuchen'),
  -- -> Flauder (off-7640106030933)
  ('off-7640106030827', 'Flauder das original'),
  -- -> Flauder (off-7640106030933)
  ('off-7617500192369', 'Flauder Das Original'),
  -- -> French Dressing mit Kräutern (off-7610809034880)
  ('off-7610161127398', 'French mit Kräutern Premium Dressing'),
  -- -> Himbeeren ungezuckert (off-7610200306906)
  ('off-7610200082121', 'Himbeeren - Beste Auslese, ungezuckert'),
  -- -> Bratensauce (off-7613312241981)
  ('off-7610703065072', 'Klassiker Bratensauce'),
  -- -> Lindor Caramel (off-7610400079556)
  ('off-7610400079716', 'Lindor caramel unendlich zartschmelzend'),
  -- -> LINDOR Assortiert (off-7610400083515)
  ('off-7610400084444', 'Lindor Unendlich Zartschmelzend Assortiert'),
  -- -> Lindor Extra Dunkel (off-8003340091273)
  ('off-7610400075718', 'Lindor unendlich zartschmelzend extra dunkel'),
  -- -> Lindor Milch (off-7610400073516)
  ('off-7610400030335', 'Lindor Unendlich Zartschmelzend Milch'),
  -- -> Bouillon : Gemüse (off-7613034958082)
  ('off-7613312034521', 'Premium bouillon gemüse'),
  -- -> Erdbeer joghurt (off-7610200379351)
  ('off-9004584007678', 'Premium Erdbeer Joghurt'),
  -- -> Pekannüsse (off-7613356586529)
  ('off-7613312073766', 'Premium Pekannüsse'),
  -- -> Quark Vanille (off-7640127050477)
  ('off-4061462262852', 'Quark Genuss Vanille'),
  -- -> Tom-Kha Suppe (off-7613269263173)
  ('off-8854404007019', 'Thai premium soup Tom Kha'),
  -- -> Ginger Ale (bls-N315000)
  ('off-7610238335169', 'The Original Ginger Ale Das einmalig pricklande Getränk mit einem angenehmen Ingwer-Geschmack'),
  -- -> Tomato Ketchup (off-7610029222081)
  ('off-8715700415468', 'Tomato Ketchup Unlimited Edition'),
  -- -> Basmati Reis (off-7624841520928)
  ('off-20817725', 'Traditioneller Basmati Reis'),
  -- -> Orangensaft mit Fruchtfleisch (off-4056489578260)
  ('off-5038862133838', 'Unschuldiger reiner Orangensaft mit Fruchtfleisch 100% Orangen gepresst'),
  -- -> Zopfmehl (off-20695163)
  ('off-7613312085370', 'Zopfmehl Aus der Region für die Region')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
