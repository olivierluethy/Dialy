-- Dialy: hide advent calendars (not food) and duplicates whose names differ
-- by a single letter, mostly typos and singular/plural ("Adventskalender" /
-- "Adventkalender", "Jogurt" / "Joghurt", "Mozarella" / "Mozzarella",
-- "Zimsterne" / "Zimtsterne"). 0019/0021 only matched exact names and
-- spacing/punctuation/accent variants.
--
-- A pair counts as duplicate only if the carbs are close as well (within 3 g
-- or 15 %); names shorter than 7 letters or containing digits are skipped.
-- Pairs that are different products were removed by hand (Lardons/Cardons,
-- Plätzli/Spätzli, Classic/Classico, Amaretti/Amaretto, ...).
-- Which one stays: BLV, then BLS, then editor-created foods, then Open Food
-- Facts; then the one with portions.
--
-- 8 advent calendars and 423 duplicates (372 names) get
-- active = false; nothing is deleted. A row is only touched if its name is
-- still the listed one. The foods_touch_updated_at trigger (0010) bumps
-- updated_at, so the app drops them on its next sync.

update public.foods f
set active = false
from (values
  -- Advent calendars: not food
  ('off-3017627454106', 'Adventskalender'),
  ('off-3017627454809', 'Adventkalender'),
  ('off-4000539706745', 'Schokoladen-Adventskalender'),
  ('off-4006613002079', 'Adventskalender Minions'),
  ('off-4006613002932', 'Hello Kitty Adventskalender'),
  ('off-5202659587191', 'Adventskalender Choco Time Marvel Ultimate Spiderman'),
  ('off-7612562312977', 'Läderach Adventskalender Classic'),
  ('off-7613036473071', 'Adventskalender Smarties'),
  -- Activia Erdbeere (keeps off-4009700036988)
  ('off-4009700075833', 'Activia Erbeere'),
  -- Alicesalat (keeps off-7617027631594)
  ('off-7623186787096', 'Alice Salad'),
  -- Almond Macciato (keeps off-07500910)
  ('off-7610900238613', 'Almond Macchiato'),
  -- Ananasscheiben (keeps off-7613312488621)
  ('off-7610848025245', 'Ananas Schreiben'),
  -- Angus burguer (keeps off-7610162334146)
  ('off-7613312047590', 'Angus Burger'),
  -- Apfelmus (keeps bls-Y843143)
  ('off-4099200253565', 'Apfelmuus'),
  ('off-7610253006983', 'Apfelmuss'),
  -- Apfelsaft (keeps blv-568)
  ('off-7610029185928', 'Apflsaft'),
  ('off-24034296', 'Apfelsalft'),
  -- Apfelschorle (keeps off-4061462655708)
  ('off-7610057023100', 'Appelschorle'),
  -- Appenzeller kräftig (keeps off-2111727004559)
  ('off-2111727004801', 'Apenzeller kräftig'),
  -- Aprikose, getrocknet (keeps blv-469)
  ('off-7613312380666', 'Aprikosen getrocknet'),
  -- Aprikosen (keeps off-7613312007839)
  ('off-4106060015179', 'Aprikose'),
  -- Aprikosentorte (keeps off-7616700004670)
  ('off-7610800023760', 'Aprikosentorie'),
  -- Artischockenherzen (keeps off-7613269357803)
  ('off-8001060017689', 'Artischokenherzen'),
  -- Atlantische Lachsfilets mit Haut (keeps off-7613269178781)
  ('off-7623186767746', 'Atlantisches Lachsfilet Mit Haut'),
  -- Backoffen-Frites (keeps off-7610800005599)
  ('off-7610807000245', 'Backofen-Frites'),
  -- Balsamico bianco (keeps off-7611575006095)
  ('off-7640111970538', 'Balsamic Bianco'),
  -- Bananen Joghurt (keeps off-7640147281011)
  ('off-7613269466949', 'Banane Joghurt'),
  -- Basler Leckerli (keeps blv-1248)
  ('off-7610800969020', 'Basler leckerll'),
  ('off-28510239', 'Basler Läckerlli'),
  ('off-7610073951432', 'Basler Läckerli'),
  -- Basler Spätzli (keeps off-7623186777783)
  ('off-7613269871484', 'Basler Spätzlo'),
  -- Bauern-Saftschinken (keeps off-4099200426679)
  ('off-2164248004003', 'Bauern Saftschinkeb'),
  -- Bauernbratwurst (keeps off-0583600008008)
  ('off-7610092733606', 'Bauerbratwurst'),
  -- Baumnuss (keeps blv-271)
  ('off-7610198073385', 'Baumnüsse'),
  -- Bayrisch süßer Hausmachersenf (keeps off-41047231)
  ('off-41047248', 'Bayerisch süßer Hausmachersenf'),
  -- Becel ProActive (keeps off-8719200047556)
  ('off-8719200058613', 'Becel ProActiv'),
  -- Beef Momo (keeps off-7629999902541)
  ('off-7623186157080', 'Beef Momos'),
  -- Benecol Heidelbeere (keeps off-7610900052905)
  ('off-7610900101733', 'Benecol Heidelbeer'),
  -- Berg-Bünderfleisch (keeps off-2184825007456)
  ('off-7613404363027', 'Berg-Bündnerfleisch'),
  -- Bifidus Jogurt Nature (keeps off-7627534068226)
  ('off-4056489478263', 'Bifidus Joghurt Nature'),
  -- Bio Beerenmüesli (keeps off-7627537638907)
  ('off-7624841862738', 'Bio Beerenmüeslu'),
  -- Bio Himbeeren (keeps off-7613331639943)
  ('off-9020200014028', 'Bio Himbeere'),
  -- Bio Joghurt (keeps off-7640153230997)
  ('off-7627534003814', 'Bio-Jogurt'),
  -- Bio Joghurt Mango (keeps off-20812799)
  ('off-7627534084134', 'Bio Jogurt Mango'),
  -- Bio Jogurt Nature (keeps off-7627534105174)
  ('off-4056489312802', 'Bio Joghurt Nature'),
  ('off-7613404847022', 'Bio Yoghurt Nature'),
  -- Bio Jogurt Vanille (keeps off-7627534084110)
  ('off-20812775', 'Bio Joghurt Vanille'),
  -- Bio Tomaten (keeps off-7627534148058)
  ('off-7627534412746', 'Bio Tomate'),
  -- Birnenwegge (keeps off-7627536550910)
  ('off-7612812330348', 'Birnenweggen'),
  -- Birnwegge (keeps blv-862)
  ('off-7610809108727', 'Birnweggen'),
  -- Biscotti (keeps off-24066709)
  ('off-4000417214003', 'Biscotto'),
  -- Blütenhonig flüssig (keeps off-7613312302774)
  ('off-7613356187801', 'Blèutenhonig flüssig'),
  -- Blutorangen (keeps off-7613269260639)
  ('off-7613356126961', 'Blutorange'),
  -- Blutorangensaft (keeps off-28125877)
  ('off-7623186551161', 'Blutorangesaft'),
  -- Bohnen grüne (keeps off-4099200435404)
  ('off-20190385', 'Bohnen grün'),
  -- Brauner Rohrzucker (keeps off-3174660107465)
  ('off-4099200010687', 'Brauner Rohzucker'),
  -- Bresaola (keeps blv-705)
  ('off-20414245', 'Brasaola'),
  -- Bretzli (keeps off-7614800121242)
  ('off-7610032066009', 'Brätzeli'),
  ('off-7610058009790', 'Bretzeli'),
  ('off-7614800138004', 'Breteli'),
  -- Brezel gesalzen (keeps off-7617027016322)
  ('off-7611654051299', 'Bretzel Gesalzen'),
  -- Brioche Burger Buns (keeps off-3587220006106)
  ('off-4061462875960', 'Brioche Burger Bun'),
  -- Brownies (keeps bls-D4A2000)
  ('off-7613269437123', 'Brownie'),
  -- Bruno's Salatsauce Französich (keeps off-7640109670013)
  ('off-7640109670020', 'Bruno''s Salatsauce Französisch'),
  -- Buendnerfleisch (keeps off-20596354)
  ('off-4099200405858', 'Bündnerfleisch'),
  -- Buttergipfel (keeps off-7616700001174)
  ('off-7624841054485', 'Buttergipfeli'),
  -- Cashewkern (keeps bls-H170100)
  ('off-4316268639033', 'Cashew Kerne'),
  -- Cashewnuss (keeps blv-275)
  ('off-7613356198500', 'Cashew nüsse'),
  -- Cashews geröstet ungesalzen (keeps off-4099200046945)
  ('off-7613312517628', 'Cashew geröstet und gesalzen'),
  -- Cervelat (keeps blv-1081)
  ('off-7610029213492', 'Cervelats'),
  ('off-7613269782308', 'Cervelas'),
  -- Cevapcici (keeps off-4056489551539)
  ('off-7613379379863', 'Cevapcico'),
  -- Champignons Sauce (keeps off-7611100350402)
  ('off-7613269299097', 'Champignonsauce'),
  -- Chips Natur (keeps off-7616800817088)
  ('off-7610029196559', 'Chips Nature'),
  -- Choc Drink (keeps off-7610029005912)
  ('off-1227438738780', 'Choco Drink'),
  -- Choco Peanut (keeps off-7624841656535)
  ('off-7624841917278', 'Choco Peanuts'),
  -- Choco Rolls (keeps off-4061462491191)
  ('off-4061462491436', 'Choc rolls'),
  -- Chrustenkranz mit Mehrkornbestreuung (keeps off-7627534204037)
  ('off-7627536983763', 'Chrustenkranz mit Mehkornbestreuung'),
  -- Cini-Minis Knusper Müesli (keeps off-7613035778443)
  ('off-7613035789197', 'Cini minis knusper-musli'),
  -- Coconut Milk light (keeps off-5021047105195)
  ('off-7613312502174', 'Coconat, Milk Light'),
  -- Cole Slaw Salat (keeps off-7640141685389)
  ('off-7624841866170', 'Coleslow-Salat'),
  -- Cornets Glace mit Waffel (keeps off-7617027780117)
  ('off-7613312051467', 'Cornet Glace mit Waffel'),
  -- Cornichon (keeps off-7610029026757)
  ('off-7624841127974', 'Cornichons'),
  -- Cracker (keeps bls-D050000)
  ('off-7613312336601', 'Crackers'),
  -- Crackers gesalzen (keeps off-7617400030563)
  ('off-7613312258729', 'Cracker gesalzen'),
  -- Cranberry Chia Keks (keeps off-7613269639725)
  ('off-4104420172227', 'Cranberry Chia Kekse'),
  -- Crevetten (keeps off-7610200427175)
  ('off-7613312248928', 'Crevettes'),
  -- Crunchy Biscuits (keeps off-7612100908525)
  ('off-7612100039250', 'Crunchy Biscuit'),
  -- Crunchy Müesli (keeps off-4056489491125)
  ('off-5053827137089', 'Crunchy Müsli'),
  -- Crunchy Muesli Cacao & Hazelnut (keeps off-5053827199438)
  ('off-5053827213721', 'Crunchy müsli cacao & hazelnut'),
  -- Dattel, getrocknet (keeps blv-384)
  ('off-7610200010339', 'Datteln : getrocknet'),
  -- Delikates Nierstückbraten (keeps off-4099200406503)
  ('off-20811372', 'Delikatess Nierstück Braten'),
  -- Der scharfe Maxx (keeps off-2134271005001)
  ('off-7610900875276', 'Der Scharfe Max'),
  -- Dinkel eier waffein (keeps off-4104420209114)
  ('off-4104420240742', 'Dinkel Eierwaffeln'),
  -- Direkstaft (keeps off-5038862115506)
  ('off-5038862135016', 'Direktsaft'),
  -- Doppel-rahm (keeps off-7611654527992)
  ('off-277640104351375200000530', 'Doppelrahn'),
  -- Doppelkeks (keeps off-7610846923642)
  ('off-7613269311225', 'Doppelkekse'),
  -- Drink : Teilentrahmte Milch (keeps off-7610845787207)
  ('off-7617027737784', 'M Drink teilentrahmte Milch'),
  -- Dunkle Schokolade Mit Zuckerfondant-füllung (keeps off-7616500651609)
  ('off-7616500651616', 'Dunkle Scokolade mit Zuckerfondant-Füllung'),
  -- Eclair Fines vaudoises mit Zimt (keeps off-7610449002850)
  ('off-7610449007503', 'Eclair Fines Vaudoises mit Zimit'),
  -- Eisbergsalat (keeps off-7610807156485)
  ('off-7623186787058', 'Eisbersalat'),
  -- Ejer-Flädli (keeps off-7640120090494)
  ('off-7610801003068', 'Eier-Flädli'),
  -- Entrecote (keeps off-2817830001996)
  ('off-2220115021259', 'Entrecôtes'),
  -- Erbsen & Karotten (keeps off-20595531)
  ('off-7614200009096', 'Erbseu & Karotten'),
  -- Erdbeer Konfitüre (keeps off-3045320002546)
  ('off-7613312466452', 'Erdebeer-Konfitüre'),
  -- Erdbeere joghurt (keeps off-7613269540021)
  ('off-7613404906996', 'Erdbeerjoghurt'),
  ('off-7617027864275', 'Erdbeerjogurt'),
  -- Erdbeere Rahmglace (keeps off-7610848006534)
  ('off-7617400040012', 'Erdbeer Rahmglace'),
  -- Erdbeeren Confiture (keeps off-7610849096992)
  ('off-7613312340455', 'Erdbeeren Konfitüre'),
  -- Erdnuss geröstet (keeps bls-H110600)
  ('off-7613413840731', 'Erdnüsse geröstet'),
  -- Erdnüsse, geröstet & gesalzen (keeps off-4004980501607)
  ('off-7613312207277', 'Erdnüsse geröstet & gezsalzen'),
  -- Essiggurken (keeps off-7610161121471)
  ('off-7610198000589', 'Essig-Gurkem'),
  -- Extra feine Milchschokolade (keeps off-7616500063303)
  ('off-76165085', 'Extra feine Milchscokolade'),
  -- Fallafel (keeps off-4056489476955)
  ('off-7613379181794', 'Falafel'),
  -- Farm Chips Nature (keeps off-7613312014356)
  ('off-7613312141663', 'Farm chips natur'),
  -- Feige, getrocknet (keeps blv-387)
  ('off-7610200010346', 'Feigen : getrocknet'),
  -- Fleisch Käse Sanwich (keeps off-7630048378156)
  ('off-7630048382320', 'Fleischkäse Sandwich'),
  -- Fleischkäse (keeps blv-1084)
  ('off-20524098', 'Fkeischkäse'),
  -- Forellenfilet geräuchert (keeps off-2165506005701)
  ('off-7617027862707', 'Forellenfilets Geräuchert'),
  -- Frischkäse Nature (keeps off-7613331204806)
  ('off-4104420182080', 'Frischkäse Natur'),
  -- Fruchtaufstrich Erdbeeren (keeps off-3388600000062)
  ('off-4260498790029', 'Fruchtaufstrich Erdbeere'),
  -- Früchte-Müsli (keeps off-5902884461852)
  ('off-7613312013489', 'Früchtemüesli'),
  -- Früchtemischung (keeps off-7627537436398)
  ('off-7627538058940', 'Fruchtmischung'),
  -- Fusilli Aus Vollkornhartweizengries (keeps off-7613312499429)
  ('off-0623417414439', 'Fusili Aus Vollkornhartweizengriess'),
  ('off-7613312414439', 'Fusilli aus Vollkornhartweizengriess'),
  -- Gefügel cervelas (keeps off-7610200098641)
  ('off-7613269786962', 'Geflügel-Cervelas'),
  -- Gehacktes Mit Hörnly (keeps off-7610582686207)
  ('off-7613404764930', 'Gehacktes mit Hörnli'),
  -- Gemüsebouillon (keeps off-7613312042489)
  ('off-7613312419670', 'Gemüseboullion'),
  -- Gemüseplatte mit Eierschämmen (keeps off-7614200009874)
  ('off-7614200009898', 'Gemüseplatte mit Eierschwämmen'),
  -- Gemüseplatte Nach Jägerart (keeps off-7613269197607)
  ('off-7616800304151', 'Gemüseplatt nach Jägerart'),
  -- Gerstenflocken (keeps blv-739)
  ('bls-C143000', 'Gerste Flocken'),
  -- Ginger Shot (keeps off-7640127858400)
  ('off-4056489336136', 'Ingwer Shot'),
  -- Glassa noodles (keeps off-5060237282803)
  ('off-7613312434260', 'Glass Noodles'),
  -- Gojibeeren (keeps off-4104420174009)
  ('off-7613312115954', 'Gojl beeren'),
  -- Graved Lachs (keeps bls-T411800)
  ('off-01027006', 'Gravad-Lachs'),
  -- Grissini Torinessi (keeps off-7610845603934)
  ('off-7624841390118', 'Grissini torinesi'),
  -- Grüner Pfeffer (keeps off-7613035295391)
  ('off-7613269342168', 'Grüne Pfeffer'),
  -- Grüner Pfeffer Sauce (keeps off-7611100064477)
  ('off-7613269299134', 'Grüne Pfeffersauce'),
  -- Gut Laune Mix (keeps off-4104420025622)
  ('off-4104420219823', 'Gute Laune Mix'),
  -- H-Vollmilch (keeps off-4388840220236)
  ('off-7610900288861', 'Vollmilch'),
  -- Halbweissbrot (keeps blv-833)
  ('off-7610800169918', 'Halbweisbrot'),
  -- Haribo Pfirsiche (keeps off-9002975380973)
  ('off-9002975002110', 'Haribo Pfirsisch'),
  ('off-9002975380539', 'Haribot PFIRSICHE'),
  -- Hartweizen Grieß (keeps bls-C219300)
  ('off-7610027000414', 'Hartweizengries'),
  -- Haselnuss gemahlen (keeps bls-H130400)
  ('off-7610200319234', 'Haselnüsse gemahlen'),
  -- Haselnuss Joghurt (keeps off-7610029209136)
  ('off-7640152931062', 'Haselnuss Jogurt'),
  -- Heidelbeeren Konfiture extra (keeps off-27001134)
  ('off-3045320005271', 'Heidelbeeren Confiture Extra'),
  -- High Protein Drink Banana (keeps off-4335619106123)
  ('off-7613404550571', 'High Protein Drink Banane'),
  -- High Proteine Choco (keeps off-7613404015711)
  ('off-7613404573440', 'High protein choco'),
  -- High-Protein-Pudding - Vanilla (keeps off-4002971243802)
  ('off-62044820', 'High Protein Pudding Vanille'),
  -- Himbeer-Rollen (keeps off-7613269767886)
  ('off-7616700036329', 'Himber Rollen'),
  -- Himbeerjoghurt (keeps off-22016126)
  ('off-7610900005734', 'HimbeerJogurt'),
  ('off-7616600706285', 'Himbeere joghurt'),
  -- Himber-Roulade (keeps off-7616700001464)
  ('off-9002287000972', 'Himbeer-Roulade'),
  -- Hobelfleish (keeps off-2107741009601)
  ('off-7623186487446', 'Hobelfleisch'),
  -- Hohrückensteak (keeps off-2167960009752)
  ('off-2167960013209', 'Hochrückensteak'),
  -- Holunder-blüte (keeps off-9100000776026)
  ('off-7610700603949', 'Holunderblüten'),
  -- Holunderblütensirup (keeps off-20937805)
  ('off-2099424266169', 'Holunderbütensirup'),
  -- Honig (Blütenhonig) (keeps blv-472)
  ('off-7610184012466', 'Honig / bIütenhonig'),
  -- Hörnli Gross (keeps off-7613312033562)
  ('off-7613312314739', 'Hörnli grosse'),
  -- Hummus Natur (keeps off-4061458024068)
  ('off-4099200167213', 'Hummus Naturel'),
  ('off-7623186172861', 'Hummus Nature'),
  -- Hüttenköse (keeps off-4099200400440)
  ('off-7613404412930', 'Hüttenkase'),
  -- Jambon serrano (keeps off-2107667006555)
  ('off-2107667006609', 'Jamón Serrano'),
  -- Japonaise (keeps off-7610062000301)
  ('off-7613312259535', 'Japonais'),
  -- Jasmine Reis (keeps off-7627536249340)
  ('off-7610294750708', 'Jasminreis'),
  -- Joghurt (keeps off-7610100725265)
  ('off-76408236', 'P+ Joghurt'),
  -- Joghurt Aprikose (keeps off-28509646)
  ('off-7610845105117', 'Jogurt Apricose'),
  ('off-7613331248152', 'Jogurt : Aprikose'),
  -- Joghurt aus pasteurisierter Schafsmilch (keeps off-7613269144274)
  ('off-76237508', 'Joghurt aus pasteurisierter Schafmilch'),
  -- Joghurt Banane (keeps off-7610029117646)
  ('off-7610848619154', 'Jogurt : Banane'),
  -- Joghurt Beeren (keeps off-18248296)
  ('off-7617027117890', 'Jogurt Beeren'),
  -- Joghurt Kirsche (keeps off-7610029209181)
  ('off-7610800966128', 'Jogurt : Kirsche'),
  ('off-7613269371779', 'Joghurt Kirschen'),
  -- Joghurt lactosefrei (keeps off-7610707001663)
  ('off-7611613003062', 'Jogurt lactosefrei'),
  -- Joghurt Mokka stichfest (keeps off-7613404845806)
  ('off-7627534721275', 'Jogurt Mokka stichfest'),
  -- Joghurt nature (keeps food-joghurt-natur)
  ('off-4002566003118', 'Jogurt Natur'),
  ('off-7611654107422', 'Joghurt Natur'),
  ('off-7610029117448', 'Yoghurt nature'),
  ('off-7640121910029', 'Jogurt Nature'),
  ('off-76408298', 'Yoghourt Nature'),
  -- Joghurt waldbeeren (keeps off-7610848285618)
  ('off-7640152931093', 'Johurt Waldbeeren'),
  -- Joghurt-Dressing (keeps bls-X357340)
  ('off-7613331831866', 'Jogurt-Dressing'),
  -- Joghurt, Erdbeer (keeps blv-53)
  ('off-7610800966111', 'Jogurt : Erdbeere'),
  ('off-7610900126941', 'Jogurt Erdbeer'),
  ('off-7610029214680', 'Joghurt - Erdbeere'),
  -- Joghurt, Haselnuss (keeps blv-55)
  ('off-7610809012093', 'Jogurt : Haselnuss'),
  -- Joghurt, Mokka (keeps blv-57)
  ('off-7610800977445', 'Jogurt Mokka'),
  ('off-76408335', 'Joghurt Moka'),
  -- Joghurt, Schokolade (keeps blv-54)
  ('off-7610809103951', 'Jogurt Schokolade'),
  -- Joghurt, Vanille (keeps blv-56)
  ('off-7613331817990', 'Jogurt Vanille'),
  ('off-7613331819529', 'Jogurt Vanillle'),
  ('off-76408328', 'Yoghurt Vanille'),
  -- Jogurt : Brombeere (keeps off-7610846189345)
  ('off-7613269687603', 'Joghurt Brombeere'),
  -- Jogurt : Heidelbeere (keeps off-7610827600913)
  ('off-7640134521052', 'Joghurt Heidelbeer'),
  -- Jogurt : Himbeere (keeps off-7610809038734)
  ('off-7640134521076', 'Joghurt Himbeere'),
  ('off-7640157790114', 'Joghurt Himbeer'),
  -- Jogurt : Mango (keeps off-7610849968046)
  ('off-7613404394731', 'Joghurt Mango'),
  -- Jogurt Birchermüesli (keeps off-7610807063585)
  ('off-7617027566599', 'Joghurt Birchermüesli'),
  -- Jogurt Blutorange (keeps off-7613331084378)
  ('off-7613404394823', 'Joghurt Blutorange'),
  -- Jogurt Mocca (keeps off-7610900044061)
  ('off-7640134521106', 'Joghurt Mocca'),
  -- Jogurt nach griechischer Art (keeps off-7610034528680)
  ('off-7613404845844', 'Joghurt nach griechischer Art'),
  -- Jogurt Waldbeer (keeps off-76412363)
  ('off-7640134521069', 'Joghurt Waldbeer'),
  -- Jogurt Zitrone (keeps off-76108679)
  ('off-76408311', 'Joghurt zitrone'),
  -- Jogurtpur Erdbeer (keeps off-7610900043149)
  ('off-7610900085323', 'Joghurtpur Erdbeer'),
  -- Jus d'orange (keeps off-28004134)
  ('off-7610057010674', 'Jus orange'),
  -- Kaffeerahm (keeps blv-69)
  ('off-22139733', 'Koffeerahm'),
  ('off-7610800992592', 'Kafeerahm'),
  -- Kakaobiscuit mit Shokoladencrème (keeps off-7613269626817)
  ('off-7613269673637', 'Kakaobiscuit mit Schokoladencrème'),
  -- Kartoffelbrot mit Nüssen (keeps off-7613331118226)
  ('off-7623186438295', 'Kartoffelbrot mit nüsse'),
  -- Kartoffelkroketten (keeps bls-X652912)
  ('off-7613312340233', 'Kartoffeln: Kroketten'),
  -- Kartoffeln (keeps off-7610632956038)
  ('off-7610632963241', 'Kartoffel'),
  -- Kartoffeln festkochend (keeps off-7610200318794)
  ('off-7610200318831', 'Kartoffel festkochend'),
  -- Kichererbse, getrocknet (keeps blv-439)
  ('off-7613312064092', 'Kichererbsen getrocknet'),
  -- Kinder Biscuit (keeps off-7613032310844)
  ('off-7614200116275', 'Kinder-Biscuits'),
  -- Kirschstengeli (keeps off-7610400061049)
  ('off-7616500627710', 'Kirsch stängeli'),
  -- Kirshe joghurt (keeps off-7613269461197)
  ('off-7616600703468', 'Kirsche Joghurt'),
  -- Klassisch Paprika (keeps off-5053990101511)
  ('off-5053990139552', 'Klassische Paprika'),
  -- Knäckebrot, Vollkorn (keeps blv-918)
  ('off-7617027056229', 'Knäckebrot Volkorn'),
  -- Kokosmakrone (keeps blv-14303)
  ('bls-D660300', 'Kokosmakronen'),
  -- Kokosraspel (keeps off-7610200010544)
  ('off-7627534352172', 'Kokosraspeln'),
  -- Konfitüre (keeps blv-696)
  ('off-7613312496718', 'Confitüre'),
  -- Konfitüre Aprikose (keeps off-7610849101801)
  ('off-7613331579386', 'Confiture Aprikose'),
  -- Konfitüre extra (keeps bls-S132000)
  ('off-7613312407240', 'Confiture extra'),
  -- Konfitüre extra Himbeeren (keeps off-7610253097585)
  ('off-4337185928406', 'Konfiture extra Himbeere'),
  -- Kräuter Baguette (keeps off-20348878)
  ('off-4061459593594', 'Kräuter Baquette'),
  -- Kräuterspeck (keeps off-2109493005306)
  ('off-2188547004151', 'Käuterspeck'),
  -- Krustenrranz (keeps off-7613404635834)
  ('off-7616700037661', 'Krustenkranz'),
  -- Kürbiskerne (keeps blv-276)
  ('bls-H310100', 'Kürbiskern'),
  -- Lachsfillet mit Haut (keeps off-7613404064566)
  ('off-7623186189623', 'Lachsfilet mit Haut'),
  -- Lasagna Bolognese (keeps off-7627537007185)
  ('off-7627534406554', 'Lasagne Bolognese'),
  -- Lasagne ala bolognese (keeps off-20211394)
  ('off-7616800833286', 'Lasagne Alla Bolognese'),
  -- Löffelbiscuit (keeps blv-852)
  ('bls-D710200', 'Löffelbiskuits'),
  ('off-4311501425527', 'Löffelbiskuit'),
  ('off-7613269458722', 'Löffel-biscuits'),
  -- Lütticher Waffeln (keeps off-5410126002003)
  ('off-5410495002000', 'Lütticher Waffel'),
  -- Macadamianuss (keeps bls-H190100)
  ('off-4056489498377', 'Macadamianüsse'),
  -- Madeleine (mit Butter) (keeps blv-878)
  ('off-7616700013474', 'Madeleines mit Butter'),
  -- Malbuner Landrauch Schinken (keeps off-2175319006352)
  ('off-7613292385026', 'Malbuner Landrauchschenken'),
  -- Marroni in Caramelsaucr (keeps off-7613269870777)
  ('off-7616800863030', 'Marron in Caramelsauce'),
  ('off-7627534862688', 'Marroni in Caramelsauce'),
  -- Mayonnaise (keeps blv-771)
  ('off-7610100034084', 'Mayonaise'),
  -- Medjoul Datteln (keeps off-6253806003025)
  ('off-7290002490692', 'Medjool Datteln'),
  -- Mikrowellen Popcorn (keeps off-05206334)
  ('off-7613312234402', 'Microwellen Popcorn'),
  -- Milchbrötl (keeps off-7616700143775)
  ('off-9005300010835', 'Milch Brötle'),
  -- Milchschokolade mint Ganzen Haselnüsse (keeps off-7613031085385)
  ('off-7613312085783', 'Milchschokolade mit ganzen Haselnüssen'),
  -- Mini Berliner mit Himbeerfullung (keeps off-7613269274117)
  ('off-4008577001020', 'Minis Berliner mit Himbeer-Füllung'),
  -- Minor Schokoladen-Confiserie mit gerösteten Haselnuss-Splittern (keeps off-7610041072206)
  ('off-7610041076006', 'Minor Schokolade-Confiserie mit gerösteten Haselnuss-Splittern'),
  -- Mondeln gehobelt (keeps off-4000521007126)
  ('off-7610818990474', 'Mandeln gehobelt'),
  -- Mortadella (keeps blv-819)
  ('off-2130260003409', 'Mortabella'),
  -- Mostbröckli (keeps blv-717)
  ('off-2276867006808', 'Mostbtöckli'),
  -- Mozzarella (keeps blv-82)
  ('off-0540177001658', 'Mozarella'),
  ('off-20631321', 'Morzarella'),
  -- Mozzarella Mini (keeps off-7610900114443)
  ('off-8000430133509', 'Mozzarella minis'),
  -- Mozzarellaperlen (keeps off-7613331265913)
  ('off-7610900018543', 'Mozzarella Perle'),
  -- Multifruchtsaft (keeps off-7610807048407)
  ('off-7613356490154', 'Multifruchtsaf'),
  -- Multivitamine (keeps off-3182280072179)
  ('off-7610235003252', 'Multi-Vitamin'),
  -- Münchner Weißwurst (keeps bls-W224000)
  ('off-4000930511054', 'Münchner Weißwürste'),
  -- Müscheli (keeps off-7610849860340)
  ('off-7616700015331', 'Müschell'),
  ('off-28403517', 'Muscheln'),
  -- Müsli-Riegel (keeps bls-S830000)
  ('off-28103615', 'Müesli Riegel'),
  -- Nature Jogourt (keeps off-20349783)
  ('off-7613404162507', 'Nature johurt'),
  ('off-7613404489970', 'Nature yogourt'),
  ('off-7613404845820', 'Nature Joghurt'),
  ('off-7640102942506', 'Nature jogurt'),
  -- Neapolitaner (keeps off-7616500656192)
  ('off-80001256', 'Napolitaner'),
  -- Nesquick (keeps off-7613034852335)
  ('off-3387390124118', 'Nesquik'),
  -- Nürnberger Rostbratwürste (keeps off-4061461517311)
  ('off-22114839', 'Nürnberger Rostbratwurst'),
  -- Nuss-Nougat-Creme (keeps bls-S145000)
  ('off-4000417080608', 'NussNugatCreme'),
  -- Nuss-Stängeli (keeps blv-14294)
  ('off-7617400030228', 'Nuss-Stengeli'),
  ('off-7610032066030', 'Nuss-Stängli'),
  ('off-7613312368824', 'Nussstängali'),
  ('off-7617400030235', 'Nuss-Stengli'),
  -- Nusskerne-Mischung (keeps off-7610818993390)
  ('off-4008258150016', 'Nusskernmischung'),
  -- Offen Fleischkäse (keeps off-2109978003704)
  ('off-20441197', 'Ofen Fleischkäse'),
  -- Orangensaft (keeps food-orangensaft)
  ('off-7627534825010', 'Orangesaft'),
  -- Pagnelbrot (keeps off-7610848073369)
  ('off-7613331010346', 'Pagnolbrot'),
  -- Panettone Nostrano a Meter (keeps off-0580896004004)
  ('off-0580896004400', 'Panettone Nostrano am Meter'),
  -- Pangasiusknusperlii (keeps off-08002570)
  ('off-7613269535485', 'Pangasiusknusperli'),
  ('off-0581595005958', 'Pagasius Knusperli'),
  -- Paranuss (keeps blv-279)
  ('off-4260042317467', 'Paranüsse'),
  -- Passata di pomodoro (keeps off-7610029162318)
  ('off-8000050109007', 'Passata di pomodori'),
  -- Pasta Fresca mit Ei (keeps off-7613269737209)
  ('off-7617027732987', 'Pasts fresca mit ei'),
  -- Pekannuss (keeps bls-H160100)
  ('off-7610200010513', 'Pecannüsse'),
  ('off-7613413839537', 'Pekannüsse'),
  -- Pesto all arrabbiata (keeps off-7613032622565)
  ('off-2099406138125', 'Pesto all''arrabiata'),
  -- Petit Beurre (keeps blv-14074)
  ('off-7617400032796', 'Petit berre'),
  ('off-7610029187281', 'Petite Beurre'),
  -- Pferdesteack (keeps off-4099200405629)
  ('off-7627534000806', 'Pferde Steak'),
  -- Pistazie (keeps blv-274)
  ('off-7613312394045', 'Pistazien'),
  -- Pizza Cracker (keeps off-7613312358733)
  ('off-7617400031942', 'Pizza Crackers'),
  -- Pizza margherita (keeps off-4104420112308)
  ('off-4056489279396', 'Pizza Magherita'),
  -- Poulet Brust Spiess Gewürzt (keeps off-2114459009304)
  ('off-2254033008153', 'Pouletbrustspiesse Gewürzt'),
  -- Poulet Geschbetzeltes (keeps off-2164855006254)
  ('off-7617100230836', 'Pouletgeschnetzeltes'),
  -- Pouletbrust Streifen (keeps off-2224584005352)
  ('off-2113905002708', 'Pulet Brust Streifen'),
  ('off-7611521780611', 'Pozletbruststreifen'),
  -- Pouletflügel (keeps off-7617023005146)
  ('off-2161739006706', 'Poulet Flügeli'),
  -- Pouletflügel gewürzt (keeps off-2114378007108)
  ('off-20240509', 'Pouletflügeli Gewürzt'),
  -- Pralinen (keeps bls-S610000)
  ('off-7610400096522', 'Pralines'),
  -- Prussien (keeps blv-874)
  ('off-7613404605257', 'Preussen'),
  -- Quark Spätzli (keeps off-7610227956948)
  ('off-4069365148419', 'Quark Späzli'),
  -- Quarkcreme (keeps bls-Y880160)
  ('off-4061459693096', 'Wuarkcreme'),
  -- Quick Soup - Tomate (keeps off-7611100089135)
  ('off-8720182367297', 'Quick Soup Tomato'),
  -- Quick Soup Erbs mit Croutons (keeps off-1658460088787)
  ('off-7611100088787', 'Quick Soup - Erbs mit Crûtons'),
  -- Quinoaflocken (keeps off-7613356136427)
  ('off-3380380060991', 'Quinoafloken'),
  -- Quorn Aufschnitt Peperoni (keeps off-7613269396123)
  ('off-7613404396483', 'Quorn Ausschnitt Peperoni'),
  -- Quorn Gehackets (keeps off-7610745672238)
  ('off-7613404099094', 'Quorn Gehacktes'),
  -- Raclette Suisse (keeps off-2135477012459)
  ('off-4056489313083', 'Racklette suisse'),
  -- Rahmquark nature (keeps off-7610029160635)
  ('off-7611654880523', 'Rahmquark natur'),
  -- Räuber Fleischkäe (keeps off-2189890005659)
  ('off-2189890004959', 'Räuber Fleischkäse'),
  -- Rauchlachs Rouladen (keeps off-7610200299499)
  ('off-7610200501059', 'Rauchlachs-Roulade'),
  -- Red Thai Curr Mit Jasminreis (keeps off-7624841765299)
  ('off-7613331818256', 'Red Thai Curry mit Jasmin-Reis'),
  -- Regenbogen-Forellenfilets (keeps off-5709505226162)
  ('off-2836861003205', 'Regenbogenforellenfilet'),
  -- Reh schintzel (keeps off-2186401008406)
  ('off-2186401012304', 'Reh-Schnitzel'),
  -- Reis S.Andrea (keeps off-20936327)
  ('off-8000633036218', 'Riso S. Andrea'),
  -- Reiswaffeln (keeps off-7610848358107)
  ('off-7611337500434', 'Reiswaffelh'),
  -- Riebeli Suppe (keeps off-7611100141123)
  ('off-7613269297093', 'Ribeli-Suppe'),
  -- Rindfleisch (keeps off-2182088015805)
  ('off-2822120002430', 'Rundfleisch'),
  -- Rindplätzli à la minute (keeps off-2160759015354)
  ('off-2823492002653', 'Rindsplätzli a la minute'),
  -- Rinds Bouillon (keeps off-7611100055086)
  ('off-7613312327661', 'Rindbouillon'),
  -- Rinds Burger (keeps off-7617027979726)
  ('off-7627538209793', 'Rind Burger'),
  -- Rinds-Saftplätzli (keeps off-2819363003331)
  ('off-2853263002940', 'Rinde-Saftplätzli'),
  -- Rindshackfleisch (keeps off-2153712005653)
  ('off-2185390007858', 'Rind Hackfleisch'),
  -- Rindshacksteak (keeps off-7617100053435)
  ('off-7617100217530', 'Rinds-hacksteaks'),
  ('off-7624841866644', 'Rinds Hackseteak'),
  ('off-7617100259219', 'Rinos hacksteak'),
  -- Rindsplätzli (keeps off-2161161010456)
  ('off-2185462007700', 'Rindspätzli'),
  -- Rindsplätzli vom Bio Weiderind (keeps off-2817840002006)
  ('off-2817840002358', 'Rindplätzli vom Bio Weiderind'),
  -- Rohrzucker (keeps off-3012996012001)
  ('off-7610029159264', 'Rohzucker'),
  -- Rohschinken (keeps blv-693)
  ('off-2130786005802', 'Rohschiken'),
  -- Rohschinken Anschnitte (keeps off-2114819004109)
  ('off-2249619002007', 'Rohachinken Anschnitte'),
  -- Rosa Thun (keeps off-7610846871851)
  ('off-7613269272366', 'Rosa thon'),
  -- Rösti Bratfertige Kartopffeln (keeps off-7616800101446)
  ('off-7616800460307', 'Rösti Bratfertige Kartoffeln'),
  -- Rum Rosinen (keeps off-4000521007423)
  ('off-4311501358719', 'Run rosinen'),
  -- Sacla Olive (keeps off-8001060001367)
  ('off-8001060004474', 'Sacla oliv'),
  -- Salametti (keeps blv-783)
  ('off-24016469', 'Salametis'),
  -- Salatsauce, italienisch (keeps blv-13502)
  ('off-7613404786444', 'Salatsauche Italienisch'),
  -- Samt Velours (keeps off-7614200101240)
  ('off-7614200088749', 'Sawt velours'),
  -- Sauce coktail (keeps off-7610800016045)
  ('off-7614200121880', 'Sauce Cocktail'),
  -- Saurer Halbrahm (keeps blv-575)
  ('off-7613269650492', 'Saurer Haibrahm'),
  -- Schafkäse (keeps off-3482010000473)
  ('off-04771555', 'Schafskäse'),
  -- Schafmilchjoghurt Nature (keeps off-2099460905404)
  ('off-7640102943244', 'Schafmilchjogurt nature'),
  -- Schmand (keeps off-4099200404714)
  ('off-4316268570831', 'H Schmand'),
  -- Schmelzkäse-Zubereitung (keeps off-7617027940832)
  ('off-7617027941570', 'Schelzkäsezubereitung'),
  -- Schocko Hafer Crunchy (keeps off-4104420019560)
  ('off-4104420238244', 'Schoko Hafer Crunchy'),
  -- Schoko-Krispies (keeps off-5053827116596)
  ('off-5059319023137', 'Choko Krispies'),
  ('off-5050083122811', 'Choco Krispies'),
  -- Schokolade Joghurt (keeps off-7623186001222)
  ('off-7640157790015', 'Schokoladenjoghurt'),
  -- Schokoladen-Späne (keeps off-7613312295816)
  ('off-7616500270978', 'Schokolade-Späne'),
  -- Schokoladenwürfel (keeps off-7610198032993)
  ('off-7613331257048', 'Schokolden-Würfeli'),
  -- Schokostreusel (keeps off-8710496976940)
  ('off-4311501358641', 'Schokostreußel'),
  -- Schorle (keeps off-7613331953933)
  ('off-7611889130257', 'Bschorle'),
  -- Schwarzkirschen Konfitüre (keeps off-4061459584028)
  ('off-7616800833132', 'Schwarze Kirschen Konfiture'),
  -- Schwarzwaelder Torte (keeps off-7616700036879)
  ('off-7616700165807', 'Schwarzwäldertorte'),
  -- Schwarzwälderschinken (keeps off-7610195059818)
  ('off-2113533006758', 'Schwarzeälder Schinken'),
  ('off-7623186319235', 'Schwaezwälder Schinken'),
  -- Schweine Koteletts Hals (keeps off-2186014006158)
  ('off-2186014006059', 'Schweinkoteletts Hals'),
  -- Schweine Nierstücksteak Mariniert (keeps off-2151969012608)
  ('off-2151969009950', 'Schweinsnierstücksteak Mariniert'),
  -- Schweinehalskoteletts (keeps off-2182853007653)
  ('off-7610339086205', 'Schweinshalskoteletts'),
  -- Schweineragout (keeps bls-Y344013)
  ('off-4335619256170', 'Schweinsragout'),
  -- Schweins Geschnerzeltes (keeps off-2184987007400)
  ('off-2185878005109', 'Schweinegeschnetzeltes'),
  ('off-4335619256163', 'Schweins geschnetzeltes'),
  -- Schweins halssteak (keeps off-2231913006508)
  ('off-2823440003985', 'Schweinehalssteak'),
  -- Schweins-Kotelett (keeps off-2166003012858)
  ('off-2182826007406', 'Schweinskoteletts'),
  -- Schweinshackfleisch (keeps off-0670783560352)
  ('off-7617027594240', 'Schweinehackfleisch'),
  -- Schweinshalssteak gewürzt (keeps off-2114386010701)
  ('off-2153340013600', 'Schweinshaltssteak gewürzt'),
  -- Schweinshohrücken (keeps off-2153825021656)
  ('off-2822460004033', 'Schweinehohrücken'),
  -- Senf mild (keeps off-7610145640905)
  ('off-7610145651246', 'Senf milf'),
  -- Sirup Himbeer (keeps off-7610029011661)
  ('off-7613312265246', 'Sirup Himbeere'),
  -- Soft cake (keeps off-7610029158076)
  ('off-7610029158083', 'Soft cakes'),
  -- Sojasauce (keeps blv-13456)
  ('off-8715035110809', 'Soyasauce'),
  ('off-7613312318034', 'Soy Sauce'),
  -- Sonnenblumenkerne (keeps blv-281)
  ('bls-H430100', 'Sonnenblumenkern'),
  -- Spanische Oliven gefüllt mit Peperonipasta (keeps off-22083029)
  ('off-7613312297148', 'Spanische Oliven gefüllt mit Peperonipaste'),
  -- Spätzli mit Eieren (keeps off-7613331444974)
  ('off-7613269259565', 'Spätzli mit Eiern'),
  -- Spécialité de Gruyères Pave mit Pfeiffer (keeps off-2139835003554)
  ('off-2139835003653', 'Spécialité de Gruyères Pave mit Pfeffer'),
  -- Speckwürfel Geräuchert (keeps off-2230314006407)
  ('off-7617027948777', 'SPECKWÜRFELI, geräuchert'),
  -- Speckwürfeli (keeps off-7613269021711)
  ('off-2230314006308', 'Speckwürfel'),
  -- Spicy Chicken Wings (keeps off-7610745582810)
  ('off-7613269181095', 'Spicy chiken wings'),
  -- Spiral-Nüdeli (keeps off-7616700014792)
  ('off-7613312314746', 'Spiralnudeln'),
  -- St. Galler Olma Bratwurst IGP (keeps off-7610200012579)
  ('off-7613269715399', 'St.Gallet OLMA-Bratwurst IGP'),
  -- Strawberry Cheesecake Muesli (keeps off-4251680800305)
  ('off-4251680807373', 'Strawberry Cheesecake Müsli'),
  -- Streichleberwurst (keeps off-20412708)
  ('off-7610807079654', 'Straichleberwurst'),
  -- Süessmost (keeps off-7610057000231)
  ('off-7610057002365', 'Süssmost'),
  -- Sugo alla Napoletana (keeps off-8001250219169)
  ('off-7627536821492', 'Sugo Alla Napolitana'),
  -- Sultanien (keeps off-7613331239600)
  ('off-4311501470138', 'Sultaninen'),
  -- Sweet Valley Apfelmus (keeps off-22114426)
  ('off-28134367', 'SweetValley Apfeluus'),
  -- Tante Anita Gurken (keeps off-7610161121181)
  ('off-7610161121204', 'Tante Anita''s Gurken'),
  -- Tatarensauce (keeps bls-X344360)
  ('off-7610827986246', 'Tartare-Sauce'),
  ('off-7640148354547', 'Tartar Sauce'),
  -- Thunfisch Filets (keeps off-4061459274950)
  ('off-4099200011103', 'Thunfischfilet'),
  -- Tofu geräuchert (keeps off-4099200179209)
  ('off-8002670021813', 'Tofu Geräuchter'),
  -- Tofu Natur (keeps off-4012359110107)
  ('off-7627537483552', 'Tofu Nature'),
  -- Tomaten püriert (keeps off-7613312059340)
  ('off-7613312440704', 'Tomsten püriert'),
  -- Tomaten-Mozzarella-Plätzli (keeps off-7613312240557)
  ('off-7617027046299', 'Tomaten-Mozzarella-Plätzil'),
  -- Tomatenketchup (keeps bls-R141100)
  ('off-87157116', 'Tomato Ketchup'),
  ('off-87157482', 'Tomate ketchup'),
  -- Tomatensauce (keeps blv-667)
  ('off-7616800909400', 'Tomatensace'),
  -- Tortellini Käse (keeps off-7613404029527)
  ('off-7613404435458', 'Tortelloni - Käse'),
  -- Tortelloni (keeps off-20351915)
  ('off-7627536656032', 'Tortellini'),
  -- Tortelloni mit Fleisch (keeps off-7610807061307)
  ('off-7613331547392', 'Tortellini, mit Fleisch'),
  -- Tortelloni mit Spinat und Ricotta (keeps off-7610807061895)
  ('off-7613331548801', 'Tortellini mit Spinat und Ricotta'),
  -- Tortelloni Ricotta & Spinat (keeps off-20284503)
  ('off-4056489009191', 'Tortellini Ricotta Spinat'),
  -- Tortelloni Ricotta E Spinaci (keeps off-7610227480573)
  ('off-7610961011996', 'Tortelloni Ricotta Spinaci'),
  ('off-8001665127561', 'Tortellini Ricotta & Spinaci'),
  -- Tortelloni Tomate-Mozzarella (keeps off-4735619059410)
  ('off-7613404435489', 'Tortelloni Tomaten-Mozzarella'),
  -- Tortillas (keeps off-5412514932473)
  ('off-8721122734285', 'Tortilla'),
  -- Trauben Nuss (keeps off-4000417022004)
  ('off-7610400010368', 'Traube-Nuss'),
  -- Trockenfleisch (keeps blv-709)
  ('off-7640165620496', 'Trockrnfleisch'),
  -- Trockenfleisch Anschnitte (keeps off-2172271006956)
  ('off-2119912006906', 'Trockenfleisch Abschnitte'),
  -- Trutensteak (keeps off-2276832005850)
  ('off-2276832006758', 'Trutensteaks'),
  -- Urkorn Müesli (keeps off-7613312259184)
  ('off-4104420131187', 'Urkorn Müsli'),
  -- Vanille Bourbon (keeps off-7627535212703)
  ('off-7613312309988', 'Vanilla Bourbon'),
  -- Vanille Joghurt (keeps off-7613404162439)
  ('off-7610900052608', 'Vanille Jogurt'),
  ('off-7627536572707', 'Vanille Yoghurt'),
  -- Vanille-Erdbeer (keeps off-7617400040173)
  ('off-7617400040296', 'Vanille Erdbeere'),
  -- Vollkorntoast (keeps off-20231637)
  ('off-7640117080316', 'Volkorn toast'),
  -- Weichkaramelle (keeps bls-S330000)
  ('off-7610845794526', 'Weiche Karamell'),
  -- Weisser Thonfisch (keeps off-7613269093787)
  ('off-7613269093800', 'Weisser Thunfisch'),
  -- Weisswurst (keeps blv-1273)
  ('off-7610200012715', 'Weisswürste'),
  -- Weizentortilla (keeps bls-B783012)
  ('off-4388860024012', 'Weizen Tortillas'),
  -- Wiener Waffel (keeps off-7610062001605)
  ('off-7617400037814', 'Wiener Waffeln'),
  -- Yogi Drink Himbeer (keeps off-7610900128877)
  ('off-7617027913836', 'Yogo Drink Himbeer'),
  -- Yogourt (keeps off-7610029209167)
  ('off-7610029209235', 'Yogourth'),
  -- Yogourt Mocca (keeps off-7640134520727)
  ('off-7640106020682', 'Yoghourt mocca'),
  -- Zimsterne (keeps off-7617400030211)
  ('off-7617400030204', 'Zimtsterne'),
  -- Zitronat (keeps blv-856)
  ('off-76405495', 'Citronat'),
  -- Zitronen Kekse (keeps off-4260311982976)
  ('off-4260402480411', 'Zitronenkeks'),
  -- Zitronensorbet (keeps bls-Y996440)
  ('off-7613331296597', 'Zitrone, sorbet'),
  -- Zittronen-Rollen (keeps off-7613269767862)
  ('off-7616700007466', 'Zitronen Rollen'),
  -- Zweibeln gehackt (keeps off-7610848667209)
  ('off-7616600240161', 'Zwiebeln gehackt')
) as v(id, name)
where f.id = v.id
  and f.name = v.name
  and f.active;
