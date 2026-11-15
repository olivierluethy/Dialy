-- Dialy: merge product variants that differ only by descriptors which do
-- not change the food: "Apfelsaft klar", "Apfelsaft naturtrüb", "Apfelsaft
-- vegan", "Qualité & Prix Apfelsaft" -> "Apfelsaft".
--
-- Ignored when comparing names: klar, naturtrüb, vegan, Bio, Natur/Nature,
-- Original, Classic, Premium, Direktsaft, frisch, fein, extra, pasteurisiert,
-- Schweizer/IP-Suisse, store brands (M-Classic, Qualité & Prix, Prix Garantie,
-- Naturaplan, Alnatura, ...), and for Open Food Facts rows the brand in
-- parentheses. Not ignored: descriptions after " - " / " : ", parentheses in
-- BLS/BLV names, and "vegan" on meat, fish and dairy (vegane Bratwurst is not
-- Bratwurst). A variant is merged only if its carbs are within 3 g or 15 % of
-- the entry that stays.
--
-- Which one stays: the entry already named plainly, then BLV, BLS,
-- editor-created foods, Open Food Facts, then the shortest name.
--
-- Step 1 renames 20 kept Open Food Facts entries to the plain name where
-- only words at the start or end were dropped ("Bio Kefir" -> "Kefir").
-- Step 2 hides 565 variants (460 foods) with active = false; nothing is
-- deleted. Rows are only touched if their name is still the listed one.
-- The foods_touch_updated_at trigger (0010) bumps updated_at, so the app
-- picks the changes up on its next sync.

update public.foods f
set name = v.new_name
from (values
  ('off-7610849680313', 'Schweizer Alpenkräuter', 'Alpenkräuter'),
  ('off-7617300720786', 'Gourmet Bratbutter', 'Bratbutter'),
  ('off-7613413835386', 'Bio Cashewnüsse', 'Cashewnüsse'),
  ('off-5614169462682', 'Cervelas Bio', 'Cervelas'),
  ('off-7613312406618', 'Confiture Abricot bio', 'Confiture Abricot'),
  ('off-7613312044094', 'Hafervollkornflocken fein', 'Hafervollkornflocken'),
  ('off-7624841946766', 'Bio Jogurt Erdbeere', 'Jogurt Erdbeere'),
  ('off-7627537718661', 'Bio Kefir', 'Kefir'),
  ('off-7627534542047', 'Bio Knuspermüesli', 'Knuspermüesli'),
  ('off-08322661', 'Coop Macadamianüsse', 'Macadamianüsse'),
  ('off-4104420239340', 'Mais Chips natur', 'Mais Chips'),
  ('off-28100065', 'Orangesaft 100%', 'Orangesaft'),
  ('off-7627537385702', 'Bio Reibkäse', 'Reibkäse'),
  ('off-7611201001951', 'Saft vom Fass ohne (20)', 'Saft vom Fass ohne'),
  ('off-7610807077254', 'Sauerkraut gekocht bio', 'Sauerkraut gekocht'),
  ('off-2099460905404', 'Schafmilchjoghurt Nature', 'Schafmilchjoghurt'),
  ('off-8029513210869', 'Sorbet Erdbeer (850ml)', 'Sorbet Erdbeer'),
  ('off-4305615678368', 'Bio Sultaninen', 'Sultaninen'),
  ('off-4012359110107', 'Tofu Natur', 'Tofu'),
  ('off-22135926', 'Yogos Nature', 'Yogos')
) as v(id, old_name, new_name)
where f.id = v.id
  and f.name = v.old_name;

update public.foods f
set active = false
from (values
  -- 7-Korn (keeps off-7613269352853)
  ('off-7611471003716', 'Bio 7 Korn'),
  -- Agavensirup (keeps blv-10536)
  ('off-7610849679010', 'AGAVENSIRUP bio'),
  -- Akazienhönig (keeps off-7613312452158)
  ('off-7613356188778', 'Akazienhonig BIO'),
  ('off-7627535697357', 'Bio Akazienhonig'),
  -- Alpenkräuter (keeps off-7610849680313)
  ('off-7616800816203', 'BIO : Schweizer Alpenkräuter'),
  -- Älplerbrot (keeps off-7610848345916)
  ('off-7975848345916', 'Bio Älplerbrot'),
  -- Amaranth (keeps off-4104420220607)
  ('off-4104420018402', 'Amaranth bio'),
  -- Ananas (keeps off-7613269260707)
  ('off-7610807068924', 'Qualité & Prix - Ananas (würfel)'),
  -- Ananas in Scheiben (keeps off-4311501624258)
  ('off-7627534372767', 'Bio Ananas in Scheiben'),
  -- Ananassaft (keeps blv-13880)
  ('off-7610848353065', 'Qualité & Prix Ananassaft'),
  -- Anis-Chräbeli (keeps off-7611654261070)
  ('off-7614800010058', 'Anis Chräbeli (Fabrikladen-Beutel)'),
  -- Apfel (keeps food-apfel)
  ('off-7640104956211', 'Apfel Pur (Pomme pure)'),
  -- Apfelkuchen (Rührmasse) (keeps bls-D131200)
  ('bls-D1A4000', 'Apfelkuchen vegan (Rührmasse)'),
  -- Apfelmus (keeps bls-Y843143)
  ('off-7627536189622', 'Bio Apfelmus'),
  -- Apfelsaft (keeps blv-568)
  ('off-7617500197562', 'Apfelsaft klar'),
  ('off-7613312042748', 'Apfelsaft vegan'),
  ('off-7613356198159', 'Apfelsaft (JaMaDu)'),
  ('off-4066447343021', 'Apfelsaft naturtrüb'),
  ('off-7613356070370', 'Qualité & Prix Apfelsaft'),
  ('off-7613356061989', 'Qualité & prix apfelsaft klar'),
  -- Apfelschorle (keeps off-4061462655708)
  ('off-4104420132405', 'Bio Apfel Schorle'),
  -- Appenzeller Mild-Würzig (keeps off-2181450004102)
  ('off-2111728003056', 'Appenzeller Classic Mild-würzig'),
  -- Appenzeller Mostbröckli IGP (keeps off-2174076005158)
  ('off-2115589009400', 'Bio Appenzeller Mostbröckli IGP'),
  -- Aprikosen süss getrocknet (keeps off-7610818970223)
  ('off-7610845592122', 'Qualité & Prix Aprikosen süss getrocknet'),
  -- Aprikosenkonfitüre (keeps off-3045320002621)
  ('off-7616800831985', 'Extra Aprikosenkonfitüre'),
  -- Aufschnitt (keeps off-7610829256743)
  ('off-2160547003501', 'Gourmet Aufschnitt'),
  -- Bananen chips (keeps off-4104420024847)
  ('off-4099200022475', 'BIO Bananen Chips'),
  -- Bärentatzen (keeps off-7613331366467)
  ('off-7610807120264', 'Qualité & Prix BÄREN TATZEN'),
  ('off-7613312379943', 'Bärentatzen (Limited Edition)'),
  -- BBQ Sauce rauchig (keeps off-8715700208602)
  ('off-7622300689070', 'Original BBQ Sauce rauchig'),
  -- Beef Burger (keeps off-7613312320884)
  ('off-7613331630025', 'PR!X Garantie Schweizer Beefburger'),
  -- Beeren Mischung (keeps off-5906974015475)
  ('off-7613331639981', 'Beerenmischung Bio'),
  ('off-4104420112483', 'Beerenmischung (TK)'),
  ('off-7613312483329', 'M-Budget Beerenmischung'),
  -- Beerenmuesli (keeps off-4099200426204)
  ('off-7627537638907', 'Bio Beerenmüesli'),
  -- Bio-Eier (keeps off-7613404859124)
  ('off-7613404858561', 'Schweizer Bio-Eier'),
  -- Birchermüesli (keeps food-mueesli)
  ('off-7613269420019', 'Bircher Müesli CLASSIC'),
  -- Birnensaft (keeps blv-562)
  ('off-4104420070226', 'Birnen Saft klar'),
  ('off-9100000764412', 'Birnensaft naturtrüb'),
  ('off-7613356070615', 'Qualité & Prix Birnensaft'),
  -- Biscuit-tortenboden (keeps off-7613269767848)
  ('off-7616700001563', 'Biscuit Nature Tortenboden'),
  ('off-7616700006414', 'Biscuit Classic Tortenboden'),
  -- Bitter Lemon (keeps off-4061462510984)
  ('off-20723538', 'Bitter Lemon original'),
  -- Bitterschokolade (keeps bls-S570000)
  ('off-4305615677125', 'Feine Bitter Schokolade'),
  -- Blätterteig (keeps off-7613035309043)
  ('off-7624841851480', 'Bio Blätterteig'),
  ('off-7613269207825', 'Classic - Blätterteig'),
  -- Blattspinat (keeps off-4099200409399)
  ('off-4250241207331', 'Blattspinat Natur'),
  -- Blütenhonig (keeps off-7610200018205)
  ('off-7610184012442', 'Bio Blutenhonig'),
  ('off-7610848657460', 'Blütenhonig BIO'),
  ('off-7610848981541', 'Schweizer Blütenhonig'),
  ('off-7610800013747', 'Qualité & Prix BLÜTENHONIG'),
  -- Blütenhonig Cremig (keeps off-7610029005455)
  ('off-7610807241792', 'Qualité & Prix Blütenhonig cremig'),
  -- Bohnen (keeps off-4099200428734)
  ('off-7610800001171', 'Bohnen fein'),
  -- Bordelaise Schlemmerfilet (keeps off-7613331640871)
  ('off-7610849540587', 'Bordelaise Schlemmerfilet bio'),
  -- Bouillon Huhn (keeps off-3033710036899)
  ('off-7613312037423', 'Bouillon - Huhn (10g)'),
  -- BOUILLON Rind (keeps off-7613034958051)
  ('off-8722700769316', 'Bouillon pur Rind'),
  ('off-7613312034545', 'Premium Bouillon Rind'),
  -- Bourbon Vanille Zucker (keeps off-4000521122706)
  ('off-40045498', 'Alnatura Bourbon Vanillezucker'),
  -- Branche Classic Milchschokolade (keeps off-7613331345530)
  ('off-7613331344984', 'Qualité & prix branche classic milchschokolade'),
  -- Branches (keeps off-7616500646407)
  ('off-7616500636743', 'Classic Branches'),
  -- Bratbutter (keeps off-7617300720786)
  ('off-7613312021422', 'Schweizer Bratbutter'),
  -- Bratensauce (keeps off-7611100092333)
  ('blv-651', 'Bratensauce, klar'),
  ('off-8720182175151', 'Vegane Bratensauce'),
  -- Bratwurst (keeps off-7617100217806)
  ('off-7623186551765', 'Bratwurst Bio'),
  ('off-7630294500585', 'Original Bratwurst'),
  ('off-7613331946270', 'Qualité & Prix BRATWURST'),
  -- Broccoli (keeps off-7613269172451)
  ('off-7613312381533', 'Schweizer Broccoli'),
  -- Brombeeren (keeps off-7610200306913)
  ('off-4104420217072', 'Brombeeren (TK)'),
  -- Brot (keeps off-7623186766718)
  ('off-29962921', 'Gourmet Brot'),
  -- Brötchen mit Vollkornmehl (keeps off-7613404086940)
  ('off-7616700001204', 'Classic - Brötchen mit Vollkornmehl'),
  -- Bulgur (keeps off-4104420174696)
  ('off-4013847905526', 'Bulgur fein'),
  -- Bündner Nusstorte (keeps off-7616700001341)
  ('off-7610900023622', 'Coop Bündner Nusstorte'),
  ('off-7610809056202', 'Qualité & Prix Bündner Nusstorte'),
  -- Burrata (keeps off-7610253592141)
  ('off-7624841993388', 'Bio Burrata'),
  -- Butter (keeps off-7610128737165)
  ('off-7611613000160', 'Bio Butter'),
  -- Butterbrezel (keeps off-2100505003402)
  ('off-7612297012081', 'Premium Butter-Brezel'),
  -- Buttergemüse (keeps off-7613312163986)
  ('off-4104420112209', 'Buttergemüse (TK)'),
  -- Buttermilch (keeps blv-529)
  ('off-7627537342651', 'Buttermilch Nature'),
  -- Buttertoast (keeps off-22115928)
  ('off-9005300019203', 'Premium Butter Toast'),
  -- Butterzopf (keeps blv-820)
  ('off-7623186244179', 'Bio Butterzopf'),
  -- Camembert (keeps off-7617027964456)
  ('off-7610028001212', 'Camembert Suisse'),
  -- Caotina (keeps off-7612100801307)
  ('off-7612100906125', 'Caotina Original'),
  -- Cashewnüsse (keeps off-7613413835386)
  ('off-7610200010438', 'Cashew-Nüsse natur'),
  -- Centerbrot (keeps off-7616700142112)
  ('off-7616700269116', 'Centerbrot (Variiert von Filiale zu Filiale)'),
  -- Cervelas (keeps off-5614169462682)
  ('off-20234751', 'Cervelas Lidl'),
  ('off-7610807022322', 'Bio : Cervelas'),
  ('off-7610829347397', 'Prix Garantie - CerveLas'),
  -- Champignons (keeps off-7627534384715)
  ('off-3083681093551', 'Champignons Bio'),
  -- Chia-Samen (keeps blv-13457)
  ('off-7611337501837', 'Bio chia samen'),
  ('off-7613200170140', 'Naturaplan : Chiasamen Bio'),
  -- Chinesische Nüdeli (keeps off-7610849861088)
  ('off-7610849808267', 'Qualité & Prix Chinesische Nüdeli'),
  -- Chips Paprika (keeps off-7611654221609)
  ('off-7610095014009', 'Original Chips Paprika'),
  -- Chrustenkranz mit Mehrkornbestreuung (keeps off-7627534204037)
  ('off-7627534204068', 'Bio Chrustenkranz Mit Mehrkorn-Bestreuung'),
  -- Cocktail Sauce (keeps off-7613039643938)
  ('off-7613312449547', 'M-Budget Cocktail Sauce'),
  -- Coconut Milk (keeps off-8851613106588)
  ('off-7627537227545', 'Bio Coconut Milk'),
  -- Coconut Water (keeps off-0898999000022)
  ('off-7627535646164', 'Bio Coconut Water'),
  -- Cold Coffee Macchiato (keeps off-7622037357204)
  ('off-5625537353204', 'Prix Garantie Cold Coffee Macchiato'),
  -- Condimento Bianco Italiano (keeps off-4099200052250)
  ('off-9002804010118', 'Condimento Bianco Italiano Bio'),
  -- Confiture Abricot (keeps off-7613312406618)
  ('off-7610491036728', 'Confiture extra Abricot'),
  -- Cookies (keeps off-20080211)
  ('off-7610198076393', 'Classic Cookies'),
  -- Corned Beef (keeps bls-W520000)
  ('off-5707196131185', 'Corned Beef Classic'),
  -- Cottage cheese (keeps off-7623186259456)
  ('off-7640101096682', 'Bio Cottage Cheese'),
  ('off-7610029230277', 'Cottage Cheese Nature'),
  -- Cotto (keeps off-7617027948494)
  ('off-7627536551665', 'Prix garantie Cotto'),
  -- Couscous (keeps off-7613379692115)
  ('off-4099200014814', 'Bio Couscous'),
  ('off-3223920730124', 'Couscous Fein'),
  -- Cracker (keeps bls-D050000)
  ('off-4099200420837', 'Nature Cracker'),
  -- Crunchy (keeps off-7612100907313)
  ('off-7613379088178', 'Crunchy Nature'),
  -- Crunchy Müesli (keeps off-4056489491125)
  ('off-7613312477403', 'Crunchy muesli m-budget'),
  -- Dinkel Flocken (keeps bls-C236100)
  ('off-7611337243751', 'Bio Dinkel Flocken'),
  -- Dinkel-Spätzli (keeps off-7613404000106)
  ('off-7624841876933', 'Bio dinkel spätzli'),
  -- Dinkelbrot (keeps bls-B710500)
  ('off-7624841314503', 'Bio Dinkelbrot'),
  -- Dinkelwaffeln (keeps off-7613331578686)
  ('off-4058172893117', 'Dinkel Waffeln Natur'),
  -- Doppel-rahm (keeps off-7611654527992)
  ('blv-798', 'Doppelrahm, pasteurisiert'),
  -- Doppelkeks (keeps off-7610846923642)
  ('off-4260402486819', 'Doppelkeks Original'),
  -- Drink : Teilentrahmte Milch (keeps off-7610845787207)
  ('off-7610809102213', 'Bio Drink, teilentrahmte Milch'),
  -- Edamame - geschält (keeps off-7624841230032)
  ('off-68727345', 'Edamame Bio, geschält'),
  -- Eier (keeps off-7610809052419)
  ('off-7610200307729', 'Schweizer Eier'),
  -- Eier aus Freilandhaltung (keeps off-20369125)
  ('off-9096204401355', 'Schweizer Eier aus Freilandhaltung'),
  -- Eingelegtes Gemüse (keeps off-7613269303053)
  ('off-4099200403250', 'Gourmet eingelegtes gemüse'),
  -- Eisbergsalat (keeps off-7610807156485)
  ('off-7623186016905', 'Bio Eisbergsalat'),
  -- Eistee (keeps off-7610827334443)
  ('off-7618500941032', 'Bio Eistee'),
  -- Elsässer Flammkuchen (keeps off-7624841884853)
  ('off-7613269497431', 'Original Elsässer Flammkuchen'),
  -- Erbsen (keeps off-7613269197522)
  ('off-7613312111062', 'Erbsen fein'),
  ('off-7613312382653', 'Schweizer Erbsen'),
  -- Erbsen mit Karotten (keeps off-7613269197447)
  ('off-7610800001089', 'Erbsen mit Karotten fein'),
  ('off-7610818165018', 'Qualité & Prix Erbsen mit Karotten fein'),
  -- Erbsen und Karotten (keeps off-7610029025651)
  ('off-7613312018521', 'Erbsen und Karotten fein'),
  -- Erdnüsse (keeps off-7610200389725)
  ('off-7613269918905', 'Extra Erdnüsse'),
  ('off-4099200033198', 'Premium Erdnüsse'),
  ('off-7610829518964', 'Qualité & Prix Erdnüsse'),
  -- Erdnussmus (keeps bls-H110800)
  ('off-7624841540155', 'Erdnussmus bio'),
  ('off-4006040000112', 'Erdnussmus Fein'),
  -- Filet bordelaise (keeps off-7613312241929)
  ('off-7613312272145', 'Filet gourmet bordelaise'),
  -- Filona (keeps off-7640166799115)
  ('off-7624841733175', 'Filona Nature'),
  -- Fischstäbchen (keeps off-7613312333464)
  ('off-4104420217188', 'Fischstäbchen (TK)'),
  -- Fit & Well Himbeeren (keeps off-7613312436769)
  ('off-7613312036228', 'Extra Fit & Well Himbeeren'),
  -- Fitness (keeps off-3387390324037)
  ('off-8445290348012', 'Original Fitness'),
  -- Fitwell Heidelbeeren (keeps off-7613312436783)
  ('off-7613312039144', 'Extra Fit & Well Heidelbeeren'),
  -- Fizzy Cola (keeps off-4260402484488)
  ('off-4260402481883', 'Fizzy Cola : vegan'),
  -- Flakes (keeps off-7612100028209)
  ('off-7613269319900', 'Flakes Nature'),
  -- Flauder (keeps off-7640106030933)
  ('off-7617500192345', 'Flauder original'),
  -- Fleischkäse (keeps blv-1084)
  ('off-7611654569695', 'Qualité & Prix Fleischkäse'),
  -- Fleischzubereitung (keeps off-2188060017355)
  ('off-2186386013754', 'M-Classic Fleischzubereitung'),
  -- Flutes (keeps off-7613312277386)
  ('off-7627535717642', 'Flûtes Bio'),
  -- Fondue (keeps off-7610200027535)
  ('off-7611700006204', 'Fondue Original'),
  -- Fontal (keeps off-2173401002503)
  ('off-2138218002252', 'M-budget fontal'),
  -- Fret (keeps off-7610046000501)
  ('off-7610046003502', 'Fret classic'),
  -- Frischback-Brötchen (keeps off-7616700100709)
  ('off-7610848128359', 'PR!X Garantie Frischback Brötchen'),
  -- Frischkäse (keeps off-4099200026251)
  ('off-4099200426457', 'Bio Frischkäse'),
  ('off-7613331204806', 'Frischkäse Nature'),
  ('off-7640166796787', 'Bio Frischkäse Nature'),
  -- Fruchtaufstrich Himbeeren (keeps off-7613312481493)
  ('off-7627536469205', 'Bio Fruchtaufstrich Himbeeren'),
  -- Fruit Toffee Mix Bonbons mit Fruchtgeschmack (keeps off-7610829693326)
  ('off-7610807143928', 'Qualité & Prix Fruit Toffee Mix Bonbons mit Fruchtgeschmack'),
  -- Fusilli (keeps off-9100000715681)
  ('off-7610849679218', 'Fusilli Bio'),
  ('off-7610029226256', 'Denner Fusilli'),
  -- Gala Der Schweizer Frischkäse (keeps off-7610900058297)
  ('off-7610900021994', 'Gala Der Schweizer Frischkäse Nature'),
  -- Garten Erbsen (keeps off-3083681115222)
  ('off-7613035802148', 'Gartenerbsen fein'),
  -- Gazpacho (keeps blv-14002)
  ('off-7627534266981', 'Bio Gazpacho'),
  ('off-7617027889964', 'Premium Gazpacho'),
  ('off-8710398528322', 'Gazpacho Original'),
  -- Geflügel Wienerli (keeps off-7610271704595)
  ('off-28126607', 'Geflügel Wienerli (Alpina)'),
  -- Geflügel-Aufschnitt (keeps off-7610271244855)
  ('off-7610846320762', 'Qualité & Prix Geflügelaufschnitt'),
  -- Gehackte Tomaten (keeps off-8004325600671)
  ('off-7613312439814', 'Gehackte Tomaten bio'),
  ('off-8002510018003', 'Gehackte Tomaten (Pelati)'),
  ('off-7617027934381', 'Gehackte Tomaten BIO (Pelati)'),
  -- Gelee-Früchte (keeps bls-S440000)
  ('off-9100000743325', 'Vegane Gelee-Früchte'),
  ('off-7613269199243', 'M-Classic Gelée-Früchte'),
  -- Gemüse-Bouillon Instant fettfrei (keeps off-7610491033628)
  ('off-7610491054289', 'Bio gemüse bouillon instant - fettfrei'),
  -- Gemüse-Cocktail (keeps off-7610809103609)
  ('off-7618500940998', 'Gemüsecocktail BIO'),
  -- Gemüsebouillon (keeps off-7613312042489)
  ('off-4260160141128', 'Bio Gemüsebouillon'),
  ('off-4061461453169', 'Gemüse Bouillon Bio'),
  -- Gemüsemischung (keeps off-7610029220346)
  ('off-7613269273851', 'Schweizer Gemüsemischung'),
  -- Gemüsenuggets (keeps off-4061461599362)
  ('off-7610849918478', 'Qualité&Prix : Gemüse Nuggets'),
  -- Gemüsespätzli (keeps off-4335619079786)
  ('off-7610848552895', 'Bio Gemüse-Spätzli'),
  -- Gemüsesuppe (keeps bls-X416713)
  ('off-7627536088741', 'Bio Gemüsesuppe'),
  -- Geschälte Tomaten (keeps off-7613269007234)
  ('off-8002510005027', 'Bio geschälte tomaten'),
  -- Geschnetzeltes (keeps off-7611889430616)
  ('off-7627534978983', 'Bio Geschnetzeltes'),
  -- Gewürzgurken (keeps off-7613269303114)
  ('off-7613269333647', 'Schweizer Gewürzgurken'),
  -- Gnocchi (keeps off-4061459583380)
  ('off-11353287', 'Gnocchi M-Budget'),
  -- Gnocchi di patate (keeps off-7610827510892)
  ('off-7627537676084', 'Bio Gnocchi Di Patate'),
  -- Gnocchi mit Basilikum (keeps off-7617027734097)
  ('off-7613331042347', 'Bio Gnocchi mit Basilikum'),
  -- Goldhirse (keeps off-7610809003558)
  ('off-7613413307821', 'Bio Goldhirse'),
  -- Granata pfelsaft (keeps off-8437012327900)
  ('off-4270003482912', 'Bio Granatapfelsaft'),
  -- Granatapfel (keeps off-7613269636427)
  ('off-7610849567713', 'Granatapfel (Betty Bossi)'),
  -- Granatapfelkerne (keeps off-7640116012141)
  ('off-4104420233959', 'Granatapfelkerne (TK)'),
  -- Griess Töpfli (keeps off-7610900048168)
  ('off-7610900008384', 'Griess Töpfli Nature'),
  -- Griessbrei (keeps off-7627535391064)
  ('off-7610089006768', 'Griessbrei klassisch'),
  -- Grissini (keeps blv-14213)
  ('off-4104420055902', 'Alnatura Grissini'),
  -- Grittibänz (keeps blv-1272)
  ('off-7627536991690', 'Bio Grittibänz'),
  -- Grundsauce hell/weiß (keeps bls-X320053)
  ('bls-X320063', 'Grundsauce hell/weiß, vegan'),
  -- Grüne Oliven (keeps off-4002015526700)
  ('off-4061459422832', 'Grüne Oliven Bio'),
  -- Guacamole (keeps off-4063367146978)
  ('blv-14292', 'Guacamole, hausgemacht'),
  -- Gulaschsuppe (keeps blv-684)
  ('off-4281008878006', 'Gulaschsuppe (Bio)'),
  -- Gummibärchen (keeps off-4001686386613)
  ('off-4260402481845', 'Gummibärchen : vegan'),
  -- Gurken (keeps off-7617027852241)
  ('off-7610161121600', 'Schweizer Gurken'),
  ('off-7610827985287', 'PR!X Garantie Gurken'),
  -- Hackspinat (keeps off-7613269270997)
  ('off-7613312361351', 'Schweizer Hackspinat'),
  -- Hafercookies (keeps off-7617027876476)
  ('off-4056489554974', 'Bio Hafercookies'),
  -- Haferdrink (keeps off-7627538019064)
  ('off-4104420186279', 'Hafer Drink Natur'),
  -- Haferdrink Kakao (keeps off-4061462240140)
  ('off-4056489687610', 'Bio Hafer Drink - Kakao'),
  -- Haferflocken (keeps food-haferflocken)
  ('off-4061462266935', 'Haferflocken fein'),
  -- Haferflöckli (keeps off-7610803008719)
  ('off-7610803009600', 'Bio Haferflöckli'),
  ('off-7613269195207', 'Schweizer Haferflöckli'),
  -- Hafervollkornflocken (keeps off-7613312044094)
  ('off-7613312403600', 'Schweizer Hafervollkornflocken'),
  -- Halbfett Quark (keeps off-7616600711609)
  ('off-7610800092469', 'Halbfettquark nature'),
  -- Halbrahm (keeps off-76108143)
  ('blv-67', 'Halbrahm, pasteurisiert'),
  ('off-7627535573293', 'Halbrahm (free from)'),
  -- Halloumi (keeps off-5701638113821)
  ('off-7627534157449', 'Bio Halloumi'),
  -- Harissa (keeps off-4027468000041)
  ('off-7627536610461', 'Bio Harissa'),
  -- Haselnuss Joghurt (keeps off-7610029209136)
  ('off-7610200379368', 'Haselnuss Joghurt BIO'),
  -- Haselnuss-Brotaufstrich (keeps off-7610818918591)
  ('off-7610848654681', 'Qualité & Prix Haselnuss-Brotaufstrich'),
  -- Heidelbeeren (keeps off-7610807039566)
  ('off-7627536466990', 'Heidelbeeren (Gefroren)'),
  -- Herbamare (keeps off-7610313012114)
  ('off-7610313015405', 'Herbamare Original'),
  -- High protein (keeps off-7610029206418)
  ('off-7627538017886', 'HighProtein Nature Vegan'),
  -- High Protein Pudding Choco (keeps off-7623186304002)
  ('off-7627534824327', 'Coop High Protein Pudding Choco'),
  -- High Protein, Schmelzkäse (keeps off-7613404569245)
  ('off-7623186730016', 'Migros High Protein Schmelzkäse'),
  -- Himbeeren (keeps off-7613269184966)
  ('off-7613331639943', 'Bio Himbeeren'),
  -- Hinterschinken (keeps blv-691)
  ('off-2183807004100', 'Hinterschinken &quot;Gourmet&quot;'),
  -- Hirtenkäse (keeps off-4061463936608)
  ('off-4056489527350', 'Bio Hirten Käse'),
  ('off-4002566006119', 'Hirtenkäse traditionell'),
  -- Hochstamm Süssmost (keeps off-7610809122211)
  ('off-7610848889977', 'Qualité & Prix Hochstamm Süssmost'),
  -- Holunderblütensirup (keeps off-20937805)
  ('off-7610848029342', 'Qualité & Prix Holunderblütensirup'),
  -- Honey Bsss Pops (keeps off-5050083574122)
  ('off-5050083509605', 'Honey Bsss Pops (Miel Pops)'),
  -- Honig (keeps off-7624841548021)
  ('off-7610200018236', 'Schweizer Honig'),
  -- Honig, flüssig (keeps off-7624841603157)
  ('off-28127239', 'Natur bio Honig flüssig'),
  -- Honigkuchen (keeps bls-D401400)
  ('bls-D655100', 'Feiner Honigkuchen'),
  -- Hörnli (keeps off-7610849859788)
  ('off-7616700032567', 'Hörnli fein'),
  ('off-20275846', 'Hörnli (Cornetti)'),
  -- Hörnli Dinkel (keeps off-7627534045203)
  ('off-7610849679256', 'Hörnli bio - Dinkel'),
  -- Hörnli mit Gehacktem (keeps off-7613331818294)
  ('off-7613331883810', 'Qualité & Prix HÖRNLI MIT GEHACKTEM'),
  -- Hummus (keeps blv-14055)
  ('off-4337185468384', 'Hummus Classic'),
  ('off-4099200072760', 'Hummus Klassisch'),
  ('off-7613413464616', 'Bio hummus nature'),
  -- Hummus Pikant (keeps off-4099200167220)
  ('off-4335619353497', 'Bio Hummus Pikant'),
  -- Joghurt 0.1 % Fett (keeps off-4337185531873)
  ('off-4335619078116', 'Nature Joghurt 0,1% Fett'),
  -- Joghurt Aprikose (keeps off-28509646)
  ('off-7613269484660', 'Natürlich Joghurt Aprikose'),
  -- Joghurt Banane (keeps off-7610029117646)
  ('off-7627535314216', 'Bio Joghurt Banane'),
  -- Joghurt Bifidus, nature (keeps blv-58)
  ('off-4056489478270', 'Bio Joghurt Bifidus Nature'),
  -- Joghurt, Mokka (keeps blv-57)
  ('blv-99', 'Joghurt, Mokka, Bio'),
  ('off-4061464627819', 'Bio Joghurt Mokka'),
  ('off-7613269397083', 'Natürlich Joghurt Mokka'),
  -- Joghurt, Vanille (keeps blv-56)
  ('off-4099200008370', 'Premium Joghurt Vanille'),
  -- Jogurt (keeps off-22016133)
  ('off-7613331671127', 'Jogurt naturaplan'),
  -- Jogurt : Himbeere (keeps off-7610809038734)
  ('off-7627534091712', 'Bio Jogurt Himbeere'),
  -- Jogurt Erdbeere (keeps off-7624841946766)
  ('off-7610845376609', 'PR!X Garantie Jogurt Erdbeere'),
  -- Jogurt Kokos (keeps off-7613379631152)
  ('off-7627534106898', 'Bio Jogurt Kokos'),
  -- JOGURT Stracciatella (keeps off-7613100028855)
  ('off-7627534107970', 'Bio Jogurt Stracciatella'),
  -- Jus d'orange (keeps off-28004134)
  ('off-7613312163467', 'Jus d''orange Migros Bio'),
  -- Kaffeerahm (keeps blv-69)
  ('off-7616600709170', 'Migros Bio Kaffeerahm'),
  ('off-7610827462870', 'Bio naturaplan Kaffeerahm'),
  -- Kakaopulver (keeps off-7613269262107)
  ('off-7610849955626', 'KAKAOPULVER bio'),
  -- Kamillen Tee (keeps off-4062300203778)
  ('off-7610807051476', 'Kamillentee bio'),
  -- Kapern (keeps off-4388844104600)
  ('off-7613413729579', 'Kapern Bio'),
  -- Kapernäpfel (keeps off-7610849660254)
  ('off-7613312059210', 'Kapernäpfel fein'),
  -- Karotten (keeps off-7610632995594)
  ('off-7610632990971', 'Karotten Schweizer'),
  -- Karotten mit Erbsen (keeps off-7616800302379)
  ('off-7613269197423', 'M-Budget Karotten mit erbsen'),
  -- Karotten mit Kartoffeln und Rind (keeps off-4104420171015)
  ('off-4104420138544', 'Alnatura Karotten mit Kartoffeln und Rind'),
  -- Kartoffeln Mehligkochend (keeps off-7610200318787)
  ('off-7610200318879', 'Schweizer Kartoffeln mehligkochend'),
  -- Katzenzüngli (keeps off-7610849682515)
  ('off-7610849623716', 'Qualité & Prix Katzenzüngli'),
  -- Kefir (keeps off-7627537718661)
  ('off-7623186004346', 'Kefir Nature'),
  ('off-7610849886029', 'Bio Kefir Nature'),
  -- Kefirdrink (keeps off-7627538222259)
  ('off-7627534392888', 'Bio Kefir Drink Natur'),
  -- Kichererbsen (keeps off-3083681003949)
  ('off-4010355247285', 'Kichererbsen Bio'),
  -- Kichererbsenmehl (keeps bls-H720400)
  ('off-7627534169596', 'Kichererbsenmehl Bio'),
  -- Kimchi (keeps off-7627534544508)
  ('off-7623186272868', 'Kimchi (roh, mit Fischsauce)'),
  -- Kiri (keeps off-3073781095135)
  ('off-3073781160741', 'Kiri Natur'),
  -- Knöpfli (keeps off-7610848046455)
  ('off-7610848004028', 'Bio Knöpfli'),
  -- Knusper-Müsli (keeps off-7613035771758)
  ('off-5053827116190', 'Knusper Müsli Classic'),
  -- Knuspermüesli (keeps off-7627534542047)
  ('off-7611654638476', 'Knuspermüesli Nature'),
  -- Kochbutter (keeps blv-51)
  ('off-7610848080961', 'Bio Kochbutter'),
  -- Kokos Makrönli (keeps off-7617400030105)
  ('off-7610846697239', 'Qualité & Prix Kokos-Makrönli'),
  -- Kokosblütensirup (keeps off-4006040168843)
  ('off-4099200059204', 'Bio Kokosblütensirup'),
  -- Kokosblütenzucker (keeps off-2200216125964)
  ('off-4260402480862', 'Kokosblüten-zucker : vegan'),
  -- Kokosmus (keeps off-4260213390596)
  ('off-4104420174580', 'EDEKA Alnatura Bio Kokosmus'),
  -- Kokosnussmilch (keeps blv-13458)
  ('off-4056489877301', 'Bio Kokosnuss Milch'),
  ('off-7613356330634', 'Qualité & Prix Kokosnussmilch'),
  -- Konfitüre (keeps blv-696)
  ('bls-S132000', 'Konfitüre extra'),
  -- Konfitûre extra Aprikosen (keeps off-3608580006046)
  ('off-7616800101019', 'Extra : Konfitüre, Aprikosen'),
  -- Konfitüre Extra Brombeeren (keeps off-7627536500601)
  ('off-7616800101040', 'Extra : Konfitüre, Brombeeren'),
  -- Konfitüre Erdbeeren (keeps off-12116270)
  ('off-7616800101088', 'Extra Konfitüre Erdbeeren'),
  -- Konfitüre Himbeeren (keeps off-7613356138513)
  ('off-7616800101262', 'Extra : Konfitüre, Himbeeren'),
  -- Kräuterspeck (keeps off-2109493005306)
  ('off-2150226006558', 'Kräuterspeck Bio'),
  -- Kräuterzucker (keeps off-7610167616414)
  ('off-7610700945001', 'Original Kräuterzucker'),
  -- Krustenschinken (keeps off-4335619254589)
  ('off-2246647004850', 'Krustenschinken Migros'),
  -- Kürbis (keeps off-7610849266951)
  ('off-4104420138445', 'Kürbis pur'),
  ('off-7627534412753', 'Bio Kürbis'),
  ('off-7613312421581', 'Schweizer Kürbis'),
  -- Kürbiscremesuppe (keeps bls-X445863)
  ('off-7613269309161', 'Premium Kürbiscrèmesuppe'),
  -- Kürbiskernenbrot (keeps off-7610827940132)
  ('off-7627536289162', 'Bio Kürbiskernenbrot'),
  -- Kürbissuppe (keeps off-7611100428439)
  ('off-7624841829533', 'Bio Kürbissuppe'),
  -- Lammnierstück (keeps off-2290131015907)
  ('off-2186457008108', 'Lammnierstück (mariniert)'),
  ('off-2836380002581', 'Lammnierstück (Deluxe (Lidl))'),
  -- Langkornreis (keeps off-7627536249760)
  ('off-7611654535430', 'Bio Langkornreis'),
  -- Lassi mango (keeps off-7613331647160)
  ('off-7611613000672', 'Bio Lassi Mango'),
  -- Latta (keeps off-8714100857809)
  ('off-8719200222946', 'Lätta Vegan'),
  ('off-8719200038059', 'Lätta Original'),
  -- Laugen-Tessinerbrot (keeps off-7613404176900)
  ('off-7627536160522', 'Bio Laugen Tessiner Brot'),
  -- Laugenbrezel mit Butter (keeps bls-X061410)
  ('off-7616700134360', 'Laugenbrezel mit Schweizer Butter'),
  -- Leberwurst (keeps blv-776)
  ('off-4099200219516', 'Bio Leberwurst'),
  -- Leckerli (keeps off-7616700246193)
  ('off-7613269979340', 'Feinste leckerli'),
  -- Linsen an Sauce (keeps off-7610800016601)
  ('off-7610800017066', 'Qualité & Prix Linsen an Sauce'),
  -- LUZERNER Rahmkäse (keeps off-2410097006157)
  ('off-2168445006952', 'Luzerner Rahmkäse Bio'),
  -- Lyoner (keeps blv-1083)
  ('off-4099200402765', 'Gourmet lyoner'),
  -- M Drink (keeps off-7613269780076)
  ('off-7610200040824', 'MDrink (Past)'),
  -- Macadamianüsse (keeps off-08322661)
  ('off-7613312022795', 'Macadamianüsse (zum Backen)'),
  -- Magermilchgetränk mit Schokolade (keeps off-22129321)
  ('off-76102639', 'Magermilchgetränk mit Schokolade M-Classic'),
  -- Magerquark (keeps off-7624841549578)
  ('off-7623186259630', 'Bio Magerquark'),
  ('off-7617027977692', 'Magerquark nature'),
  -- Mais Chips (keeps off-4104420239340)
  ('off-8727200299509', 'Original Mais-Chips'),
  -- Maiskölbchen im Essigaufguss (keeps off-7610800017288)
  ('off-7610800977070', 'Qualité & Prix Maiskölbchen im Essigaufguss'),
  -- Maltodextrin (keeps off-4260374999645)
  ('off-7640153565556', 'Bio Maltodextrin'),
  -- Mandel (keeps blv-273)
  ('off-4104420207400', 'Mandel Natur vegan'),
  -- Mandel Drink (keeps off-20050894)
  ('off-7613356374577', 'Bio Mandeldrink Natur'),
  -- Mandelkerne (keeps off-4251032600652)
  ('off-20052713', 'Mandelkerne Natur'),
  -- Mandelmus braun (keeps off-4104420179721)
  ('off-4260289448672', 'Bio Mandelmus braun'),
  -- Mandelmus weiß (keeps off-4104420258433)
  ('off-4104420034624', 'Mandel Mus weiß bio'),
  -- Mandeln (keeps off-4260042317047)
  ('off-7627536606976', 'Bio Mandeln'),
  ('off-20003418', 'Mandeln (blanchiert & gehobelt)'),
  -- Mandeln ganz (keeps off-7610800018544)
  ('off-7610818970506', 'Mandeln ganz Bio'),
  -- Mango, getrocknet (keeps blv-13884)
  ('off-7613356163034', 'Naturaplan : Mango getrocknet Bio'),
  -- Mangonektar (keeps bls-F516700)
  ('off-4056489318323', 'Selection Mango-Nektar'),
  -- Marmorkeks (keeps off-4260402486772)
  ('off-4260402480435', 'Marmorkeks : vegan'),
  -- Marroni (keeps off-24726139)
  ('off-4061459451948', 'Marroni bio'),
  -- Marroni geschält (keeps off-7610846395197)
  ('off-7610807018134', 'Marroni geschält Bio'),
  -- Marshmallows (keeps off-4099200177809)
  ('off-0054300090018', 'Marshmallows classic'),
  -- Mascarpone (keeps blv-485)
  ('off-7611654007135', 'Mascarpone Bio'),
  ('off-7613331098856', 'Pr!x garantie mascarpone'),
  -- Mayonnaise (keeps blv-771)
  ('off-7616600380058', 'Mayonnaise Classic'),
  -- Meerrettich-Mousse (keeps off-7617027862028)
  ('off-7617027862820', 'Premium Meerrettich-Mousse'),
  -- Mehrkorn Brot (keeps off-4071800055770)
  ('off-7610848057451', 'Bio Mehrkornbrot'),
  -- Milch (keeps off-7624841865425)
  ('off-7610900027644', 'Suisse Milch'),
  ('off-7610809127124', 'Qualité & prix Milch'),
  -- Milch extra – Extra feine Milchschokolade (keeps off-7616500013117)
  ('off-7610849554331', 'Qualité & Prix Milch Schweizer Milchschokolade'),
  -- Milch PAST (keeps off-7623186684586)
  ('off-7610845188974', 'Qualité & Prix Milch Past'),
  -- Milch UHT (keeps off-7613404535318)
  ('off-7613404845196', 'Bio Milch UHT'),
  -- Milchdrink (keeps off-7617027153584)
  ('off-4061462771330', 'Bio Milch Drink'),
  ('off-7610900017416', 'Schweizer Milch Drink'),
  -- Milchreis Vanille (keeps off-7613404416792)
  ('off-7610845813029', 'Qualité & Prix Milchreis Vanille'),
  -- Milchschokolade (keeps food-schokolade)
  ('off-7616500946491', 'Swiss Milchschokolade'),
  ('off-7613331423139', 'Schweizer Milchschokolade'),
  ('off-7616500063303', 'Extra feine Milchschokolade'),
  ('off-7610849623778', 'Qualité & Prix Schweizer Milchschokolade'),
  -- Mini-Reis-Waffeln (keeps off-7610200104182)
  ('off-2200261645400', 'Bio Mini Reiswaffeln'),
  -- Mini-Reiswaffeln mit Bitterschokolade (keeps off-7610846813073)
  ('off-7627536249616', 'Bio Mini Reiswaffeln mit Bitterschokolade'),
  -- Minis (keeps off-5000159473996)
  ('off-7610400077736', 'Swiss Premium minis'),
  -- Minor Schokoladen-Confiserie mit gerösteten Haselnuss-Splittern (keeps off-7610041072206)
  ('off-7610041071803', 'Original Minor Schokoladen-Confiserie mit gerösteten Hasel-nuss-Splittern'),
  -- Mint Green Tea (keeps off-7610849679898)
  ('off-7624841336284', 'MINT Bio Green Tea'),
  -- Misch salat (keeps off-4056489078418)
  ('off-7613331275301', 'Mischsalat BIO'),
  ('off-7610848666899', 'Betty Bossi Mischsalat'),
  -- Mokka stichfest (keeps off-22016355)
  ('off-4056489974918', 'Mokka stichfest (Milbona (Lidl))'),
  -- Mozzarella (keeps blv-82)
  ('off-20631727', 'Schweizer Mozzarella'),
  -- Mozzarelline (keeps off-07627538)
  ('off-4061462765353', 'Bio Mozzarelline'),
  -- Muesli (keeps off-7617027800600)
  ('off-4056489238379', 'Bio muesli'),
  ('off-7610807165197', 'Müesli : Nature'),
  -- Muesli Dinkel Schoko (keeps off-4061462577697)
  ('off-4099200203195', 'Bio Müesli Dinkel-Schoko'),
  -- Müesli Honig Nuss gebacken (keeps off-7610023002771)
  ('off-7610023000142', 'Bio Müesli Honig Nuss Gebacken'),
  -- Multifrucht (keeps off-7616800833170)
  ('off-4627544887629', 'Bio Multifrucht'),
  -- Multisaft (keeps off-7613312416952)
  ('off-4104420071902', 'Multi Saft 100% DIREKTSAFT'),
  -- Müsli (keeps off-24052191)
  ('off-7300400481458', 'Müsli Gourmet'),
  -- Nudeln (keeps off-7610849861286)
  ('off-7613269373537', 'Nudeln fein'),
  -- Nudeln breit (keeps off-7640120090197)
  ('off-7640120094096', 'Nudeln extra breit'),
  -- Nuss Mix (keeps off-7627535824098)
  ('off-7640175010560', 'Nuss-Mix Deluxe'),
  -- Nuss-Stängeli (keeps blv-14294)
  ('off-7610827793356', 'Qualité & Prix Nuss Stängeli'),
  -- Nussmischung (keeps off-7613312261446)
  ('off-7610829437883', 'Nussmischung BIO'),
  ('off-7627535708084', 'Bio Nussmischung'),
  -- Oliven (keeps off-9100000078731)
  ('off-7623186726491', 'Oliven (mariniert)'),
  -- Orange (keeps food-orange)
  ('off-7630017630704', 'Orange bio'),
  ('off-7610097152259', 'Orange Premium'),
  ('off-24034319', '100% Bio orange'),
  ('off-7610057010919', 'Direktsaft Orange'),
  -- Orange mild (keeps off-7613331596536)
  ('off-7627534953591', 'Bio Orange mild'),
  -- Orangensaft (keeps food-orangensaft)
  ('off-7610057010681', 'Orangensaft Naturrein'),
  ('off-7610848713920', 'Qualité & Prix Orangensaft'),
  ('off-7610094181764', 'Premium Orangensaft Naturrein'),
  ('off-2551777067669', 'Orangensaft Premium Direktsaft'),
  -- Orangesaft (keeps off-28100065)
  ('off-4099200038810', '100% Orange Saft'),
  ('off-7613035933286', 'Orange 100% Saft'),
  -- Oreo (keeps off-7622201726829)
  ('off-8410000810004', 'Original Oreo'),
  ('off-84100733', 'Oreo Original'),
  -- Ovomaltine (keeps off-7612100907344)
  ('off-7612100010464', 'Ovomaltine Original'),
  -- Panettone (keeps blv-202)
  ('off-4061459459333', 'Panettone Classic'),
  -- Paniermehl (keeps blv-750)
  ('off-7627534338480', 'Paniermehl bio'),
  -- Panzerotti (keeps off-4056489161806)
  ('off-8014294301073', 'Bio Panzerotti'),
  -- Paprika (keeps off-7610095015006)
  ('off-5053990167883', 'Classic paprika'),
  ('off-5053990101511', 'Klassisch Paprika'),
  -- Paprika Chips (keeps off-4056489719762)
  ('off-7610095013002', 'Paprika Original Chips'),
  -- Passata al Basilico (keeps off-7627535912559)
  ('off-7627536061959', 'Bio Passata Al Basilico'),
  -- Passata di pomodoro (keeps off-7610029162318)
  ('off-7627535954382', 'Bio Passata di Pomodoro'),
  ('off-7610029116397', 'Denner Passata di pomodoro'),
  -- Passierte Tomaten (keeps off-4388840218455)
  ('off-4388844009844', 'Passierte Tomaten (Bio)'),
  -- Pasteten Füllung (keeps off-7614200200110)
  ('off-7610800975533', 'Qualité & Prix Pastetenfüllung'),
  -- Pastrami (keeps off-2115428004955)
  ('off-2115427005854', 'Bio Pastrami'),
  -- Peanut butter creamy (keeps off-8710532471637)
  ('off-4006040424802', 'Original Peanutbutter Creamy'),
  -- Penne (keeps off-7610029118513)
  ('off-7627536473424', 'Bio Penne'),
  -- Penne Rigate (keeps off-20012151)
  ('off-8076800105735', 'Penne Rigate (Nudeln)'),
  ('off-09467484', 'Prix Garantie Penne Rigate'),
  ('off-20058012', 'Penne rigate (Baresa (Lidl))'),
  -- Philadelphia (keeps off-7622300318109)
  ('off-4000339035229', 'Philadelphia Original'),
  -- Physalis (keeps off-7613356563667)
  ('off-7627536447326', 'Bio Physalis'),
  -- Picknick Eier (keeps off-7613404195246)
  ('off-7613404236925', 'Schweizer Picknickeier'),
  -- Pink Grapefruit (keeps off-7610235006604)
  ('off-3608580851684', 'Pink Grapefruit Natürlich Frisch'),
  -- Pink Grapefruitsaft (keeps off-7610807048360)
  ('off-7613331364128', 'Qualité & Prix Pink Grapefruitsaft'),
  -- Pommes Chips (keeps blv-12982)
  ('off-7616800823133', 'Pommes Chips Nature'),
  -- Popcorn gesalzen (keeps bls-C518000)
  ('off-7611654646211', 'Bio Popcorn : gesalzen'),
  -- Porridge (keeps off-4104420136564)
  ('off-7627534530310', 'Bio Porridge Natur'),
  -- Potato-Wedges (keeps off-4099200034140)
  ('off-7613331592675', 'Betty Bossi Potato Wedges'),
  -- Poulet Möckli (keeps off-7640108650856)
  ('off-7613331962942', 'Qualité & Prix Pouletmöckli'),
  -- Poulet nuggets (keeps off-7610162094262)
  ('off-7610162094330', 'Poulet-Nuggets Premium'),
  -- Poulet Schnitzel (keeps off-2127539011654)
  ('off-2147280009656', 'Poulet Schnitzel (mariniert)'),
  -- Poulet Stroganoff mit Reis (keeps off-7613356059573)
  ('off-7613331883872', 'Qualité & Prix Poulet-Stroganoff mit Reis'),
  -- Pouletfleischerzeugnis geräuchert (keeps off-7627537091986)
  ('off-7610846202327', 'Qualité & Prix Pouletfleischerzeugnis geräuchert'),
  -- Pouletflügel gewürzt (keeps off-2114378007108)
  ('off-7610807159059', 'Qualité & Prix Poulet Flügel Gewürzt'),
  -- Pouletflügeli mariniert (keeps off-2130486005201)
  ('off-2147664006400', 'Poulet Flügeli Migros Mariniert'),
  -- Protein bar (keeps off-7640182220129)
  ('off-4255719311305', 'Vegan Protein Bar'),
  -- Putenbrust (keeps off-4056489115250)
  ('off-4003171002992', 'Putenbrust, Natur'),
  ('off-4335896764405', 'Classic putenbrust'),
  -- Quark (keeps off-7640127050491)
  ('off-7640153230300', 'Bio Quark'),
  -- Quinoa (keeps off-7611654616825)
  ('off-24737357', 'Bio Quinoa'),
  -- Quinoa Tricolore (keeps off-7613312043158)
  ('off-4061458097987', 'Quinoa tricolore, bio'),
  -- Raclette (keeps off-4056489780663)
  ('off-2135477012459', 'Raclette Suisse'),
  -- Ragusa (keeps off-7610008709008)
  ('off-7610008705000', 'Ragusa Classique'),
  -- Rahm halbrahm (keeps off-28106142)
  ('off-7610900017720', 'Schweizer Rahm Halbrahm'),
  -- Rahmquark (keeps off-7623186106354)
  ('off-7627537554559', 'Bio Rahmquark'),
  ('off-7610029160635', 'Rahmquark nature'),
  -- Randen (keeps off-4056489778967)
  ('off-2185093001900', 'Anna''s Best Randen'),
  -- Randensalat (keeps off-7613269372134)
  ('off-7610807076745', 'Bio Randensalat'),
  -- Randenwürfel (keeps off-7610632984116)
  ('off-7627535097041', 'Bio Randenwürfel'),
  ('off-7610848702610', 'Betty Bossi Randenwürfel'),
  -- Räucherlachs (keeps off-7617100319852)
  ('off-4260630710359', 'Bio Räucherlachs'),
  ('off-7617027784504', 'Räucherlachs(scotland)'),
  -- Rauchlachs (keeps off-7610271790024)
  ('off-7611521752502', 'Rauchlachs Bio'),
  -- Raw Coconut Water (keeps off-7640107601538)
  ('off-7629999052697', '100% Raw Coconut Water'),
  -- Reibkäse (keeps off-7627537385702)
  ('off-4056489078142', 'Schweizer Reibkäse'),
  -- Reis (keeps off-7616800213101)
  ('off-5010034007550', 'Natur reis'),
  -- Reisdrink (keeps off-7613269274001)
  ('off-4104420095007', 'Reis Drink Natur'),
  -- Reisflocken (keeps off-4104420081468)
  ('off-4260335839447', 'Bio Reisflocken'),
  -- Rind (keeps off-7613312259047)
  ('off-2412613006603', 'Bio Rind'),
  -- Rindfleisch Geschnetzelt (keeps off-2182088011708)
  ('off-2182088009255', 'Rindfleisch geschnetzelt IP-Suisse'),
  -- Rinds Farmersteak (keeps off-2114414007659)
  ('off-2114734013057', 'Bio Rinds Farmersteak'),
  -- Rindshackfleisch (keeps off-2153712005653)
  ('off-2167137006904', 'IP-Suisse Rindshackfleisch'),
  -- Rindshacksteak (keeps off-7617100053435)
  ('off-7617100206541', 'Rindshacksteak Bio'),
  -- Risotto Reis (keeps off-7610200010872)
  ('off-7610809058121', 'Risottoreis Bio'),
  -- Roggenvollkornbrot (keeps bls-B121000)
  ('off-4099200009926', 'Roggenvollkornbrot - Natur'),
  -- Roggenvollkornbrot mit Kürbiskernen (keeps bls-B121100)
  ('off-4099200009933', 'Bio Roggen Vollkornbrot mit Kürbiskernen'),
  -- Rohschinken (keeps blv-693)
  ('off-2111823009151', 'Rohschinken BIO'),
  -- Röschen Trio (keeps off-7613312488850)
  ('off-7613312400807', 'Schweizer Röschen Trio'),
  -- Rösti (keeps food-roesti)
  ('off-7616800460291', 'Original Rösti'),
  -- Rösti fixfertig (keeps off-7610827737688)
  ('off-7610800988748', 'Qualité & Prix Rösti fixfertig'),
  -- Rotkraut (keeps off-7610818158850)
  ('off-7624841887939', 'Bio Rotkraut'),
  -- Rustica (keeps off-7610703051693)
  ('off-7610703065034', 'Rustica Classic'),
  -- Saft vom Fass ohne (keeps off-7611201001951)
  ('off-7611201001920', 'Saft vom Fass - trüb ohne'),
  -- Salakis (keeps off-3482015036293)
  ('off-3023260005100', 'Salakis Natur'),
  -- Salame (keeps off-2114712002851)
  ('off-7610352400200', 'Salame Classico'),
  -- Sardellen (keeps off-7613312033371)
  ('off-7613312417225', 'Sardellen (Anchovies)'),
  -- Saucen-halbrahm (keeps off-7610029156669)
  ('off-7611654457336', 'Qualité & Prix Saucen-Halbrahm'),
  -- Sauerkraut gekocht (keeps off-7610807077254)
  ('off-7610596040101', 'Sauerkraut gekocht (Schoni)'),
  -- Sauerrahm (keeps blv-574)
  ('off-7610900141050', 'Schweizer Sauerrahm'),
  -- Saurer Halbrahm (keeps blv-575)
  ('off-7627535048784', 'Bio Saurer Halbrahm'),
  -- Schafmilchjoghurt (keeps off-2099460905404)
  ('off-7617027140362', 'Nature Schafmilchjoghurt'),
  -- Schmelzkäsescheiben (keeps off-4337185482250)
  ('off-7613356281677', 'Qualité & Prix Schmelzkäse Scheiben'),
  -- Schokoladencrème (keeps blv-807)
  ('off-7610849965502', 'Qualité & Prix Schokoladencreme'),
  -- Schokoladenmousse, hausgemacht (keeps blv-14302)
  ('off-7613331583048', 'Qualité & Prix Schokoladenmousse'),
  -- Schorle Apfel (keeps off-7610057012562)
  ('off-7610057012593', 'Schorle Apfel Bio'),
  ('off-7640107814501', 'Bio Schorle Apfel'),
  -- Schorle Rhabarber (keeps off-7613331285812)
  ('off-7640107813153', 'Bio Schorle Rhabarber'),
  -- Seitan (keeps blv-14118)
  ('off-2110540008201', 'Seitan Bio'),
  -- Senf (keeps blv-13464)
  ('off-7610818098552', 'PR!X Garantie Senf'),
  -- Senf mild (keeps off-7610145640905)
  ('off-7613039325377', 'Senf mild Bio'),
  -- Senf scharf (keeps bls-R133000)
  ('bls-R134000', 'Senf extra scharf'),
  -- Sesam : ungeschält (keeps off-7610848693185)
  ('off-7611337259806', 'Bio Sesam ungeschält'),
  -- Sesam Riegel (keeps off-9002859092350)
  ('off-9002859071768', 'Sesam riegel(helena)'),
  -- Silserkranz (keeps off-7613404635872)
  ('off-7611654179900', 'Bio Silserkranz'),
  -- Skyr (keeps off-4056489035381)
  ('off-4061462615481', 'Skyr Natur'),
  ('off-5690527904001', 'Skyr Original'),
  ('off-7623186152580', 'Bio Skyr Nature'),
  -- Smoothie (keeps off-7613404086544)
  ('off-4061459528343', 'Premium smoothie'),
  -- Soja-Schnetzel (keeps off-4260402480909)
  ('off-4104420247543', 'Soja Schnetzel fein'),
  -- Sojadrink (keeps off-7613331092885)
  ('off-7610029230703', 'Soja Drink Bio'),
  ('off-4061459426175', 'Soja Drink Natur'),
  -- Sommergemüse (keeps off-7613312051535)
  ('off-4104420112186', 'Sommergemüse (TK)'),
  -- Sorbet Erdbeer (keeps off-8029513210869)
  ('off-8029513211538', 'Sorbet Erdbeer (175ml)'),
  -- Spargel Stangen (keeps off-7613269324638)
  ('off-7610800006886', 'Qualite & Prix Spargelstangen'),
  -- Spargeln grün (keeps off-7613331038777)
  ('off-7613331038715', 'Qualité & Prix Spargeln grün'),
  -- Spätzli (keeps off-7613331268990)
  ('off-7610849896837', 'Spätzli, bio'),
  -- Special k (keeps off-5059319024349)
  ('off-5053827153935', 'Special K - Classic'),
  -- Speisestärke (keeps off-4104420021945)
  ('off-4316268448475', 'Feine Speisestärke'),
  -- Spinat gehackt (keeps off-7613269271512)
  ('off-7610849346288', 'Spinat gehackt bio'),
  -- Spiralen (keeps off-7610849859764)
  ('off-7627536473523', 'Bio Spiralen'),
  -- Süessmost (keeps off-7610057000231)
  ('off-7610057010537', 'Süessmost Naturrein'),
  -- Sugo (keeps off-7627536275080)
  ('off-4099200033747', 'Bio sugo'),
  -- Sugo al Basilico (keeps off-8008343299671)
  ('off-7624841882569', 'Sugo al basilico bio'),
  -- Sultaninen (keeps off-4305615678368)
  ('off-7610200254245', 'Sultaninen Bio'),
  -- Sulze (keeps off-7610807026504)
  ('off-7613269181682', 'Sulze (getrocknet)'),
  -- Sushi (keeps off-4088500754988)
  ('off-7627538251945', 'Bio Sushi'),
  -- Suurchabis roh (keeps off-7610596010111)
  ('off-7610596040095', 'Bio suurchabis roh'),
  -- Taboulé mit Poulet & Jogurt (keeps off-7624841866101)
  ('off-7613356166899', 'Taboulé mit Poulet & Jogurt (Betty Bossi (COOP))'),
  -- Teilentrahmte Milch (keeps off-7610848361237)
  ('blv-59', 'Teilentrahmte Milch, pasteurisiert'),
  -- Thai Curry Style Kartoffelchips (keeps off-4099200047164)
  ('off-22138187', 'Gourmet thai curry style kartoffelchips'),
  -- Thüringer Rostbratwurst (keeps off-4034167106493)
  ('off-4016623492050', 'Original Thüringer Rostbratwurst'),
  -- Tic Tac mint (keeps off-40084633)
  ('off-8000500166697', 'Tic Tac Fresh Mint'),
  -- Tic Tac Orange (keeps off-8000500164976)
  ('off-8000500153475', 'Tic tac fresh orange'),
  -- Toast (keeps off-7610829588202)
  ('off-7610029212464', 'Toast Denner'),
  -- Tofu (keeps off-4012359110107)
  ('off-7610029213973', 'Denner Tofu bio'),
  ('off-20853594', 'Bio Organic Tofu Nature'),
  -- Tofu geräuchert (keeps off-4099200179209)
  ('off-20853600', 'Bio Tofu Geräuchert'),
  -- Tomaten gehackt (keeps off-8002510014005)
  ('off-7627535961731', 'Bio Tomaten gehackt'),
  ('off-7627535961748', 'Tomaten gehackt naturaplan Bio'),
  -- Tomaten geschält (keeps off-7627536760470)
  ('off-4099200171920', 'Bio Tomaten geschält'),
  ('off-7627534148072', 'Tomaten Bio - geschält'),
  -- Tomaten passiert (keeps off-8000320990113)
  ('off-7613312521410', 'Bio Tomaten passiert'),
  -- Tomatenpüree (keeps blv-636)
  ('off-7610807144956', 'Tomatenpüree bio'),
  -- Tomatensaft (keeps blv-564)
  ('off-4056489957270', 'Bio Tomatensaft'),
  -- Tomatensauce (keeps blv-667)
  ('off-4104420213593', 'Tomatensauce Klassik'),
  -- Tomatensuppe (keeps blv-670)
  ('off-4281003878001', 'Tomatensuppe Bio'),
  ('off-7624841710398', 'Bio Tomatensuppe'),
  ('off-7627534574352', 'Prix Garantie Tomatensuppe'),
  -- Tonic Water (keeps off-7617500044101)
  ('off-28003342', 'Tonic water Premium'),
  -- Tortilla Chips (keeps off-4099200020778)
  ('off-7624841036764', 'Tortilla chips nature'),
  -- Tortilla Wraps (keeps off-4099200010243)
  ('off-4061459438284', 'Tortilla Wraps Classic'),
  -- Traubensaft (keeps blv-573)
  ('off-4104420071667', 'Traubensaft naturtrüb'),
  ('off-7610094145315', 'Traubensaft naturrein'),
  ('off-7610818104680', 'Qualité & Prix Traubensaft'),
  -- Trutenmöckli getrocknet (keeps off-2129091004402)
  ('off-2129091004303', 'Trutenmöckli getrocknet(Migro)'),
  -- Tzatziki (keeps blv-14003)
  ('off-7624841549233', 'Bio Tzatziki'),
  -- Urchiges Steinofenbrot (keeps off-7613269850861)
  ('off-7613269850649', 'Bio Urchiges Steinofen Brot'),
  -- Urdinkel Vollkornmehl (keeps off-7610177003228)
  ('off-7613413111961', 'Bio Urdinkel Vollkornmehl'),
  -- Vegetable Spring Rolls mit Gemüse (keeps off-7613356112766)
  ('off-7613331169785', 'Qualité & Prix Vegetable Spring Rolls mit Gemüse'),
  -- Vital Gebäck (keeps off-4061459468670)
  ('off-20816759', 'Bio Vital Gebäck'),
  -- Vollkorn Landbrot (keeps off-7616700126808)
  ('off-7613269914402', 'Bio Vollkorn Landbrot'),
  -- Vollkorn-Haferflocken (keeps off-7610200011428)
  ('off-7613312093856', 'Schweizer Vollkorn Haferflocken'),
  -- Vollkorn-Haferflocken · grob (keeps off-0104202100000)
  ('off-7610809016770', 'BIO Vollkorn Haferflocken Grob'),
  -- Vollkorn-Haferflöckli (keeps off-7610200020826)
  ('off-7610029164626', 'Vollkorn-Haferflöckli fein'),
  ('off-7610172233064', 'Schweizer Vollkorn-Haferflöckli'),
  -- Vollkorntoast (keeps off-20231637)
  ('off-7610848829362', 'Bio Vollkorntoast'),
  -- Vollmilch, pasteurisiert (keeps blv-62)
  ('off-2099460040501', 'Vollmilch Bio'),
  ('off-7610900293650', 'Bio Vollmilch'),
  ('off-7610900286645', 'IP-SUISSE Vollmilch'),
  ('off-7610827659157', 'Naturaplan Bio Vollmilch'),
  -- Vollmilch 3.5% Fett (keeps off-7640148580014)
  ('bls-M111300', 'Vollmilch frisch, 3,5 % Fett, pasteurisiert'),
  -- Vollmilchschokolade (keeps bls-S539900)
  ('off-4281797723112', 'Feine Vollmilchschokolade'),
  -- Vollrahm (keeps off-7613269880585)
  ('blv-65', 'Vollrahm, pasteurisiert'),
  ('off-7627535128660', 'Bio Vollrahm'),
  ('off-76102653', 'Vollrahm (35% Fett)'),
  -- Vollreiswaffeln (keeps off-0686414041497)
  ('off-7627537436343', 'Bio vollreiswaffeln Coop'),
  -- Vorderschinken (keeps blv-692)
  ('off-7617100213341', 'Vorderschinken (auslaufhaltung)'),
  -- Waldhonig (keeps off-7610029155464)
  ('off-7627537413559', 'Bio Waldhonig'),
  ('off-7613312208496', 'Schweizer Waldhonig'),
  ('off-7610800016885', 'Qualite & Prix Waldhonig'),
  -- Weide Beef (keeps off-2163191007109)
  ('off-2154307015101', 'Bio Weide Beef'),
  -- Weissmehl (keeps off-4099200400112)
  ('off-7627535565328', 'Bio Weissmehl'),
  -- Wienerli (keeps blv-1082)
  ('off-7613269054269', 'Wienerli Migros'),
  ('off-7610807022339', 'Naturaplan - Wienerli Bio'),
  -- Yogos (keeps off-22135926)
  ('off-7613269872290', 'Yogos Classic'),
  -- Ziegen-Frischkäse (keeps off-4099200023885)
  ('off-7613331595591', 'Ziegenfrischkäse Natur'),
  ('off-3272770095495', 'Qualité & Prix - Ziegenfrischkäse'),
  -- Ziegenkäse (keeps off-2316729002699)
  ('off-4099200012988', 'Ziegenkäse Natur'),
  -- Zitronenkuchen (Rührmasse) (keeps bls-D4A8700)
  ('bls-D4A8800', 'Zitronenkuchen vegan (Rührmasse)'),
  -- Zitronensaft (keeps blv-605)
  ('off-8031301886347', 'Bio Zitronensaft'),
  ('off-28140955', 'Zitronensaft aus Konzentrat'),
  -- Zopf (keeps off-7616700103731)
  ('off-7616700167573', 'Zopf (Zürcher Butterzopf)'),
  -- Zucker (keeps off-20379407)
  ('off-20148027', 'Zucker (Brauner Rohr-Rohzucker)'),
  -- Zuckermais (keeps off-2151117004301)
  ('off-2151117005650', 'Zuckermais Bio'),
  -- Zwetschgen (keeps off-7613312112083)
  ('off-10465613', 'Schweizer Zwetschgen'),
  -- Zwieback (keeps blv-930)
  ('off-7617400030723', 'Zwieback Original')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
