-- Dialy: hide duplicate foods whose names differ only in spelling: spaces,
-- hyphens, punctuation or accents ("Backofen Frites" / "Backofen-Frites",
-- "Rösti" / "Rosti", "Müesli" / "Muesli"). Follows 0019, which matched exact
-- names only. One food per name stays active, the others get active = false;
-- nothing is deleted.
--
-- Which one stays (same rule as 0019): BLV, then BLS, then editor-created
-- foods, then Open Food Facts; within that, the food whose carbs (then
-- sugar/fat) are closest to the median of its group. Ties go to foods with
-- portions, then translations.
--
-- 510 names, 568 foods hidden. The foods_touch_updated_at trigger (0010)
-- bumps updated_at, so the app drops them from the KH-Rechner on its next sync.

update public.foods f
set active = false
from (values
  -- 5-Kornflocken (keeps off-7610200074195)
  ('off-7610800975236'),
  -- Active Drink Erdbeere (keeps off-4056489861935)
  ('off-4061461962999'),
  -- Agavendicksaft (keeps off-4104420024564)
  ('off-4021851616840'),
  -- Agavendicksaft Dunkel (keeps off-4305615571508)
  ('off-4305615666907'),
  -- Ajvar - scharf (keeps off-4061459030877)
  ('off-4099200140681'),
  -- Akazienhönig (keeps off-7613312452158)
  ('off-4305615677422'),
  -- Alaska Seelachs-Filets (keeps off-7613269301974)
  ('off-7613404309766'),
  -- All in one (keeps off-7613312141120)
  ('off-7613312141786'),
  -- Älplermagronen (keeps off-7640346310154)
  ('off-7610029237665'),
  ('off-7613269182535'),
  -- Ananas Stücke (keeps off-7613404642887)
  ('off-7617027747646'),
  -- Ananas-Würfel (keeps off-7611654431732)
  ('off-7613269251569'),
  -- Ananasringe : Getrocknet (keeps off-7610200313270)
  ('off-7613331927750'),
  -- Ananasscheiben (keeps off-7613312488621)
  ('off-7613312318454'),
  ('off-7610800005780'),
  -- Ananasscheiben in Ananassaft (keeps off-7617027911771)
  ('off-7613312104873'),
  -- Apfel (keeps food-apfel)
  ('off-4061458243452'),
  -- Apfel & Mango (keeps off-5038862134415)
  ('off-7613269779957'),
  -- Apfel Chips (keeps off-4104420024625)
  ('off-7611654059547'),
  ('off-20763961'),
  -- Apfel Mango Saft (keeps off-4104420071803)
  ('off-4106060012277'),
  -- Apfel Mark (keeps off-4015637842837)
  ('off-4104420227408'),
  -- Apfel-Wähe (keeps off-7640146849953)
  ('off-7613413893867'),
  -- Äpfelkuchen (keeps off-7617027843584)
  ('off-7627534175047'),
  -- Apfelringe (keeps off-4000512364313)
  ('off-4104420024601'),
  -- Apfelschorle (keeps off-4061462655708)
  ('off-7624841129282'),
  -- Appenzeller Mostbrockli (keeps off-2114891005957)
  ('off-2115588006004'),
  -- Aprikose Joghurt (keeps off-7610029209150)
  ('off-7610434012222'),
  -- Aprikosen - Törtli (keeps off-7616700007732)
  ('off-7613269762669'),
  ('off-7616700169010'),
  -- Aprikosenhälften (keeps off-7610800005810)
  ('off-7617027051415'),
  -- Aprikosenkonfitüre (keeps off-3045320002621)
  ('off-3608580925484'),
  -- Artischockenherzen (keeps off-7613269357803)
  ('off-9100000070858'),
  -- Auberginensalat (keeps off-8714685902024)
  ('off-4030011350067'),
  -- Backfischstäbchen (keeps off-4019633172929)
  ('off-9008695969122'),
  -- Backofen-Frites (keeps off-7610807000245)
  ('off-7610807129502'),
  -- Baguette Artisano Schinken Käse (keeps off-0762756149138)
  ('off-7627536149138'),
  -- Bananen chips (keeps off-4104420024847)
  ('off-4008258274019'),
  ('off-9448429164810'),
  -- Bärlauch-Spätzli (keeps off-4069365147931)
  ('off-7610846032467'),
  -- Basmatireis (keeps off-7617027923842)
  ('off-5010034517004'),
  ('off-7624841520928'),
  -- Bauern-Saftschinken (keeps off-4099200426679)
  ('off-2171004002852'),
  -- Bauernschüblig (keeps blv-787)
  ('off-7613292316471'),
  -- Beefchips (keeps off-7627535074349)
  ('off-7623186229497'),
  -- Beeren Mischung (keeps off-5906974015475)
  ('off-7610078241026'),
  -- Beerenmuesli (keeps off-4099200426204)
  ('off-7611654750000'),
  -- Beerenmüsli (keeps off-4104420180369)
  ('off-4104420019584'),
  -- Beerensirup (keeps off-7613269355854)
  ('off-7624841521529'),
  -- Berner Rösti (keeps off-4056489425618)
  ('off-4099200402475'),
  -- Bio Apfel Schorle (keeps off-4104420132405)
  ('off-7640107817038'),
  -- Bio Blutenhonig (keeps off-7610184012442)
  ('off-7611654576754'),
  -- Bio Cashew-Kerne (keeps off-24031929)
  ('off-4099200022352'),
  ('off-4335619016743'),
  -- Bio chia samen (keeps off-7611337501837)
  ('off-17028899'),
  -- Bio Drink, teilentrahmte Milch (keeps off-7610809102213)
  ('off-8335912078536'),
  -- Bio Gazpacho (keeps off-7627534266981)
  ('off-8437026788698'),
  -- Bio Kokosnuss Milch (keeps off-4056489877301)
  ('off-4099200061870'),
  -- Bio Magerquark (keeps off-7623186259630)
  ('off-7640101094671'),
  -- Bio Milch Drink (keeps off-4061462771330)
  ('off-7610900293803'),
  -- Bio spaghetti (keeps off-7627536473462)
  ('off-8076809570657'),
  -- Bio Tessinerbrot (keeps off-7610829709164)
  ('off-7627536160386'),
  -- Bio-Jogurt (keeps off-7627534003814)
  ('off-7624841969185'),
  -- Bircher Müesli CLASSIC (keeps off-7613269420019)
  ('off-7613100001032'),
  ('off-7610818538782'),
  -- Birchermüesli (keeps food-mueesli)
  ('off-7610029140804'),
  ('off-01227185'),
  ('off-4104420138384'),
  -- Birchermuesli Joghurt (keeps off-22016157)
  ('off-7616600706315'),
  -- Birchermüsli (keeps off-2103100006700)
  ('off-4260188781115'),
  -- Birnendicksaft (keeps blv-13956)
  ('off-7613312073704'),
  -- Bitter Orangen Marmelade (keeps off-3045320002881)
  ('off-7613269372332'),
  -- Bouillon Gemüse (keeps off-7610827754340)
  ('off-7613034958082'),
  -- Bouillon Gemüse Würfel (keeps off-4673446108690)
  ('off-7611100314893'),
  -- Bourbon Vanille Zucker (keeps off-4000521122706)
  ('off-42382720'),
  -- Bratensauce (keeps off-7611100092333)
  ('off-7611100337120'),
  -- Brätkügeli (keeps off-2168151006352)
  ('off-2168302009454'),
  -- Brechbohnen fein (keeps off-4316268518093)
  ('off-4063367157578'),
  -- Bündner Rohschinken (keeps off-7623186208904)
  ('off-2227052025050'),
  -- Butter waffeln (keeps off-7613269705932)
  ('off-7627536779519'),
  -- Butterkuchenteig (keeps off-7610849563784)
  ('off-7613269198536'),
  -- Capri-Sonne - Multivitamin (keeps off-4000177032695)
  ('off-4000177605004'),
  -- Capri-Sun Monsteralarm (keeps off-4000177171912)
  ('off-4000177171929'),
  -- Caramelköpfli (keeps off-7610089004931)
  ('off-7617400020014'),
  -- Cashew Kerne (keeps off-4316268639033)
  ('off-4008407014305'),
  -- Cashew Mus (keeps off-4104420139862)
  ('off-7624841575881'),
  -- Cashew nüsse (keeps off-7613356198500)
  ('off-7613413839957'),
  -- Cashew-Cranberry-Mix (keeps off-4008258155004)
  ('off-4018077802218'),
  -- Cashews, Geröstet (keeps off-7618100033977)
  ('off-24072007'),
  -- Champignonsauce (keeps off-7613269299097)
  ('off-7613312430583'),
  -- Chäs Plätzli (keeps off-20230814)
  ('off-7613030013341'),
  -- Chäs-Chüechli (keeps off-7616700007633)
  ('off-7624841520232'),
  -- Chäs-Hörnli (keeps off-7613269296461)
  ('off-8010205020477'),
  -- Cheeseburger (keeps blv-14024)
  ('off-3181232138345'),
  -- Chicken Nuggets Poulet (keeps off-7613269296690)
  ('off-7617027081276'),
  -- Chicken-Nuggets (keeps off-0581582004957)
  ('off-7613312245613'),
  -- Choco Drink (keeps off-1227438738780)
  ('off-4099200190877'),
  -- Cocktail Crevetten (keeps off-4061463657435)
  ('off-7613312480106'),
  -- Cocktail Sauce (keeps off-7613039643938)
  ('off-7613312344026'),
  ('off-7610827986314'),
  -- Confitüre (keeps off-7613312496718)
  ('off-7640109231016'),
  -- Cornflakes (keeps blv-940)
  ('off-4061459814958'),
  ('off-7610491027054'),
  -- Crèmeschnitte (keeps blv-924)
  ('off-7613404119396'),
  ('off-7630048352286'),
  ('off-2640700128857'),
  -- Crunchy Müesli (keeps off-4056489491125)
  ('off-20419813'),
  -- Curry Paste (keeps off-5708209000870)
  ('off-7613312070994'),
  -- Currysauce (keeps off-7627536982483)
  ('off-7610800230106'),
  ('off-7640166842286'),
  -- Dar Vida (keeps off-7610032002571)
  ('off-7610032051784'),
  -- Dark & milk (keeps off-7613036852920)
  ('off-7622201813598'),
  -- Delikatess - Fleischkäse (keeps off-2170243004252)
  ('off-2168136003307'),
  -- Dinkel Doppelkeks (keeps off-4104420053922)
  ('off-7613413362912'),
  -- Dinkel Flocken (keeps bls-C236100)
  ('off-7612041100873'),
  -- Dinkel Grieß (keeps bls-C238000)
  ('off-4104420016521'),
  ('off-7610491068439'),
  -- Dinkel Mehl, Type 630 (keeps bls-C234000)
  ('off-4104420021884'),
  -- Dinkel Vollkornmehl (keeps bls-C235000)
  ('off-22162496'),
  -- Dinkel-Rosinen Biscuits (keeps off-7611654898597)
  ('off-7627537486430'),
  -- Dominosteine (keeps bls-D650100)
  ('off-4061461645953'),
  -- Doppel-rahm (keeps off-7611654527992)
  ('off-7623700002223'),
  -- Drei Königs Kuchen (keeps off-7611654883531)
  ('off-7623186207471'),
  -- Drink : Teilentrahmte Milch (keeps off-7610845787207)
  ('off-7627536196897'),
  -- Edelmarzipan (keeps off-24031790)
  ('off-4085200400436'),
  -- Eierschwämmli-Suppe (keeps off-7611100133128)
  ('off-7611100141512'),
  -- Eiweiss flüssig (keeps off-7610999503685)
  ('off-7640138979422'),
  -- Elisenlebkuchen (keeps bls-D650400)
  ('off-4006780076859'),
  -- Erbsen & Karotten (keeps off-20595531)
  ('off-7614200009171'),
  -- Erdbeer Konfitüre (keeps off-3045320002546)
  ('off-7613312373743'),
  -- Erdbeere joghurt (keeps off-7613269540021)
  ('off-7610434012130'),
  -- Erdbeerjoghurt (keeps off-7613404906996)
  ('off-7610200379351'),
  -- Erdbeerjogurt (keeps off-7617027864275)
  ('off-7640106021221'),
  -- Erdbeersirup (keeps off-7610845301793)
  ('off-3092718586775'),
  -- Erdnüsse - pikant gewürzt (keeps off-4004980511606)
  ('off-7613269296621'),
  -- Erdnüsse geröstet (keeps off-7613413840731)
  ('off-20595913'),
  -- Erdnüsse, geröstet & gesalzen (keeps off-4004980501607)
  ('off-7610845154641'),
  ('off-4099200046730'),
  ('off-4104420057340'),
  -- Erdnüsse, geröstet und gesalzen (keeps off-4004980506206)
  ('off-4006040031116'),
  -- Erdnussmus (keeps bls-H110800)
  ('off-4104420021228'),
  -- Erdnussmus Fein (keeps off-4006040000112)
  ('off-4104420181144'),
  -- Feigen : getrocknet (keeps off-7610200010346)
  ('off-7610849249145'),
  -- Feinkristall Zucker (keeps off-28103509)
  ('off-7610200340689'),
  -- Fleischvogel (keeps off-2173681016306)
  ('off-2153225011752'),
  -- Flüssiger Blütenhonig (keeps off-20940867)
  ('off-4056489467144'),
  -- Flutes (keeps off-7613312277386)
  ('off-7613312370377'),
  -- French (keeps off-7613312420560)
  ('off-7610072200951'),
  -- Frey lini (keeps off-7616500643178)
  ('off-7616500649477'),
  -- Frischback-Brötchen (keeps off-7616700100709)
  ('off-7627534505929'),
  -- Frischei-Waffeln (keeps off-4099200010960)
  ('off-7610029231908'),
  -- Frischkäse Nature (keeps off-7613331204806)
  ('off-7617027783552'),
  -- Früchte-Mix (keeps off-4008258419014)
  ('off-4061458138703'),
  ('off-7623186682230'),
  -- Früchte-Müsli (keeps off-5902884461852)
  ('off-4104420180420'),
  -- Früchtequark (keeps bls-Y880250)
  ('off-7610900129522'),
  -- Fruit Ice : Mango (keeps off-7613312033791)
  ('off-7613312482414'),
  -- Garten Erbsen (keeps off-3083681115222)
  ('off-7613269291107'),
  -- Geflügel-Aufschnitt (keeps off-7610271244855)
  ('off-2125415002857'),
  -- Geflügel-Fleischkäse (keeps off-4099200407418)
  ('off-7613404878286'),
  -- Geflügel-Wiener (keeps off-4311501074701)
  ('off-7610271784092'),
  -- Geflügelbratwurst (keeps bls-W223100)
  ('off-7617027959308'),
  ('off-7610271787789'),
  ('off-7610200044099'),
  -- Geflügelfond (keeps off-4009062800029)
  ('off-4009062801200'),
  -- Geflügellyoner (keeps blv-1092)
  ('off-2158497002453'),
  ('off-2249648002658'),
  -- Geflügelmortadella (keeps bls-W288100)
  ('off-20439125'),
  -- Gelbe Curry Paste (keeps off-8853662001043)
  ('off-4061462404283'),
  -- Gemüse: Erbsen extrafein (keeps off-7610200266569)
  ('off-7613312273326'),
  -- Gemüsebouillon (keeps off-7613312042489)
  ('off-76111488'),
  ('off-7613312021132'),
  -- Gemüsecremesuppe (keeps bls-X444143)
  ('off-7613269374480'),
  ('off-4062300260238'),
  -- Gemüsemischung (keeps off-7610029220346)
  ('off-7613379771667'),
  -- Gemüsepfanne (keeps off-4061458011389)
  ('off-4104420173088'),
  -- Gemüsespätzli (keeps off-4335619079786)
  ('off-7613331174109'),
  -- Gewürz Ketchup Curry delikat (keeps off-4027400070170)
  ('off-4027400100341'),
  -- Gewürz Spekulatius (keeps off-4099200065595)
  ('off-20166427'),
  ('off-20036126'),
  -- Ginger Ale (keeps bls-N315000)
  ('off-7290002793366'),
  -- Glace: Vanille Bourbon (keeps off-7613331211736)
  ('off-4099200072753'),
  -- Glücks Käfer (keeps off-7613312274903)
  ('off-7610041010246'),
  -- Gojibeeren (keeps off-4104420174009)
  ('off-7610491933348'),
  -- Grill Bratwurst (keeps off-2108205005504)
  ('off-7610029157369'),
  -- Grüne Currypaste (keeps off-8858826302189)
  ('off-5021047106062'),
  -- Hafer Grütze (keeps bls-C137000)
  ('off-7610027000735'),
  -- Hafercookies (keeps off-7617027876476)
  ('off-4305615780818'),
  -- Haferdrink (keeps off-7627538019064)
  ('off-7627536137326'),
  -- Haferdrink ungesüßt (keeps bls-C660000)
  ('off-4104420094925'),
  -- Haferflocken fein (keeps off-4061462266935)
  ('off-7627536162984'),
  -- Halbfett Quark (keeps off-7616600711609)
  ('off-4056489673538'),
  -- Halbfettbutter (keeps blv-191)
  ('off-7610200341778'),
  -- Halbweissmehl (keeps off-4099200405476)
  ('off-7610198075877'),
  -- Hartweizen Grieß (keeps bls-C219300)
  ('off-7613312078808'),
  -- Haselnussmakronen (keeps bls-D660700)
  ('off-7613269458838'),
  -- Haus Pastete (keeps off-7610582685545)
  ('off-7627538099516'),
  -- Himbeer sirup (keeps off-7613356165267)
  ('off-7627534344030'),
  ('off-7610463014273'),
  -- Himbeeren TK (keeps off-7610029173956)
  ('off-4104420112247'),
  -- Himbeerjoghurt (keeps off-22016126)
  ('off-42300403'),
  -- HimbeerJogurt (keeps off-7610900005734)
  ('off-7610900036134'),
  -- Hinterschinken &quot;Gourmet&quot; (keeps off-2183807004100)
  ('off-2183807005503'),
  -- Hirsch Geschnetzeltes (keeps off-4056489780380)
  ('off-7617027763165'),
  -- Hirsch Schnitzel (keeps off-0036270002017)
  ('off-2186299013100'),
  ('off-7617027797337'),
  -- Hirse Flocken (keeps bls-C333100)
  ('off-7610200074201'),
  -- Hirse Pfanne Orientalische Art (keeps off-4104420134140)
  ('off-4104420177826'),
  -- Hobelfleisch, hauchdünn (keeps off-2141111007453)
  ('off-2151504006956'),
  -- Hollandaisesauce (keeps blv-666)
  ('off-7611100052979'),
  -- Hühner Bouillon (keeps off-8717163813713)
  ('off-7610703057367'),
  -- Hühner Bouillon Granulat (keeps off-7611100325202)
  ('off-8720182095930'),
  -- Hüttenkase (keeps off-7613404412930)
  ('off-7627535668326'),
  -- ICE TEA Zitrone (keeps off-76168352)
  ('off-28127017'),
  -- Jägersauce (keeps blv-652)
  ('off-7611100059473'),
  -- Jasminreis (keeps off-7610294750708)
  ('off-4335619259553'),
  -- Joghurt - Erdbeere (keeps off-7610029214680)
  ('off-7610900044870'),
  -- Joghurt Apfel-Caramel (keeps off-7613269696308)
  ('off-7613404361276'),
  -- Joghurt Apfel/Mango (keeps off-22016287)
  ('off-7613404538975'),
  -- Joghurt Caramel (keeps off-4099200406756)
  ('off-7613404162330'),
  -- Joghurt Heidelbeere (keeps off-22138767)
  ('off-7613404539057'),
  -- Joghurt Mokka stichfest (keeps off-7613404845806)
  ('off-7613404162415'),
  -- Joghurt Reis Waffeln (keeps off-4104420053489)
  ('off-4104420232846'),
  -- Jogurt : Aprikose (keeps off-7613331248152)
  ('off-7627537177338'),
  -- Jogurt : Erdbeere (keeps off-7610800966111)
  ('off-7610807063721'),
  -- Jogurt : Himbeere (keeps off-7610809038734)
  ('off-7613356254596'),
  -- Jogurt : Kirsche (keeps off-7610800966128)
  ('off-7610848985464'),
  -- Kaffeerahm (keeps blv-69)
  ('off-7613269480600'),
  ('off-7613100026141'),
  -- Kalbscipollata (keeps off-7617027900638)
  ('off-4099200427249'),
  ('off-7617100214355'),
  -- Kamillen Tee (keeps off-4062300203778)
  ('off-7617027026116'),
  -- Karamell gebäck (keeps off-4100810236807)
  ('off-4099200034829'),
  -- Kartoffelgratin (keeps bls-X640053)
  ('off-7616800559063'),
  -- Kartoffelstock - Instant (keeps off-7613312016602)
  ('off-7616800823706'),
  -- Kartoffeltaschen (keeps off-28105374)
  ('off-4099200016535'),
  -- Käseaufschnitt (keeps off-22116727)
  ('off-4061459453553'),
  -- Käsekuchen Mischung (keeps off-7610200279934)
  ('off-7623186745126'),
  -- Käseplätzli (keeps off-4056489314417)
  ('off-7610200341389'),
  -- Kefirdrink (keeps off-7627538222259)
  ('off-7623186656057'),
  -- Kernen Nuss Mix (keeps off-7613331260963)
  ('off-7617014127901'),
  -- Kidney-Bohnen (keeps off-4056489458630)
  ('off-7624841826488'),
  -- Kinder Riegel (keeps off-4008400221021)
  ('off-40084701'),
  -- Kinder-Biscuits (keeps off-7614200116275)
  ('off-7614200131100'),
  -- Knäckebrot Sesam (keeps off-4099200010250)
  ('off-7300400255905'),
  -- Knoblauch-Paste (keeps off-7610849907632)
  ('off-7610405062119'),
  -- Knoblauchsauce (keeps off-7616600706773)
  ('off-7617027815642'),
  -- Knoblauchwurst (keeps off-7617027945783)
  ('off-7610034508941'),
  -- Knöpflimehl (keeps blv-1399)
  ('off-7610803009655'),
  -- Knusper-Müsli (keeps off-7613035771758)
  ('off-4337256398695'),
  ('off-7613413939060'),
  -- Koch-Schokolade (keeps off-7613269195566)
  ('off-7624841866453'),
  -- Kokoschips (keeps off-4006040074823)
  ('off-4104420024885'),
  -- Kokosnussmilch (keeps blv-13458)
  ('off-4099200011271'),
  -- Konfitüre Erdbeeren (keeps off-12116270)
  ('off-3608580006039'),
  -- Kräuter Rahm Poulet (keeps off-7613312136072)
  ('off-7613034638021'),
  -- Kräuterbutter (keeps bls-Y790160)
  ('off-7617027582179'),
  -- Kräuterzucker (keeps off-7610167616414)
  ('off-76107900'),
  -- Kroepoek Crevettenchips (keeps off-5060237280922)
  ('off-7610200085030'),
  -- Kuchen Glasur Hell (keeps off-4000521006884)
  ('off-7613331181275'),
  -- Kürbiscremesuppe (keeps bls-X445863)
  ('off-7611100439015'),
  -- Kürbiskerne (keeps blv-276)
  ('off-4104420026803'),
  -- Kuvertüre zartbitter (keeps off-4000521007027)
  ('off-4099200064574'),
  -- Lamm-Rack (keeps off-2815250003637)
  ('off-2815250004986'),
  -- Lammnierstück (keeps off-2290131015907)
  ('off-1814774701525'),
  -- Lammnierstück (mariniert) (keeps off-2186457008108)
  ('off-2186457010101'),
  ('off-2414409010559'),
  -- Landjäger (keeps blv-1090)
  ('off-7613292316464'),
  -- Landrauchschinken (keeps off-0581082006055)
  ('off-2175319006406'),
  -- Langkornreis (keeps off-7627536249760)
  ('off-4099200013350'),
  ('off-7627536690647'),
  -- Lasagne Fiorentina (keeps off-7613312020647)
  ('off-7623186296932'),
  -- Lasagneblätter (keeps off-8001200027950)
  ('off-7624841325226'),
  -- Latta (keeps off-8714100857809)
  ('off-8719200282612'),
  -- Laugen-Tessinerbrot (keeps off-7613404176900)
  ('off-7623186747885'),
  -- Laugenbuttergipfel (keeps off-7617027935753)
  ('off-7610198077420'),
  -- Linseneintopf (keeps off-7610809115732)
  ('off-22118035'),
  -- Linzer Törtli (keeps off-7613269762621)
  ('off-7616700004151'),
  ('off-7616700169058'),
  -- Linzertorte (keeps blv-14286)
  ('off-7613269762607'),
  -- Löffel-biscuits (keeps off-7613269458722)
  ('off-7617027960908'),
  ('off-7610807142143'),
  -- Lübecker Edel Marzipan (keeps off-4099200088471)
  ('off-4003754092006'),
  -- Mah Mee mit Poulet (keeps off-7613356147096)
  ('off-7627535394898'),
  -- Mais Körner (keeps off-7613312484913)
  ('off-7617027916011'),
  -- Mais Mehl (keeps bls-C443000)
  ('off-4104420016767'),
  -- Maiskölbchen (keeps off-7611300345321)
  ('off-4020943130356'),
  -- Maiswaffeln (keeps off-4104420054004)
  ('off-7613269003434'),
  -- Mandel Drink (keeps off-20050894)
  ('off-4061462462122'),
  -- Mandeldrink natur (keeps off-4058172455575)
  ('off-4104420186316'),
  -- Mandeldrink ungesüßt (keeps bls-H800000)
  ('off-4104420141803'),
  -- Mandeln (blanchiert & gehobelt) (keeps off-20003418)
  ('off-4311501367643'),
  -- Mandeln, gemahlen (keeps off-4000521007089)
  ('off-7610818993345'),
  -- Mango schnitzegetrocknet (keeps off-7613312129821)
  ('off-7613312143490'),
  -- Mango-Chutney (keeps off-4013200881504)
  ('off-7613312066065'),
  -- Manuka-Honig (keeps off-4023300817303)
  ('off-9421023628070'),
  -- Marronibrot (keeps off-7613413888474)
  ('off-7613269644187'),
  -- Meerrettich-Mousse (keeps off-7617027862028)
  ('off-5701295291870'),
  -- MEHL Zopfmehl (keeps off-4099200428079)
  ('off-7611330891409'),
  -- Mehrkorn Toast (keeps off-9005300009532)
  ('off-9032400019253'),
  -- MeringuesSchalen (keeps off-7610032006388)
  ('off-7613312015599'),
  -- Metzger Bratwurst (keeps off-7610162373831)
  ('off-7610162290275'),
  -- Microwave Popcorn - gesalzen (keeps off-7610029193442)
  ('off-7610809128312'),
  -- Milch | Lait | Latte (keeps off-7610848300632)
  ('off-4061461545406'),
  -- Milch Nuss : Milchschokolade mit ganzen Haselnüssen (keeps off-7613312014271)
  ('off-7616500010031'),
  -- Milchdrink (keeps off-7617027153584)
  ('off-7624841022415'),
  -- Milchgetränk mit Kaffeeextrakt (keeps off-22139320)
  ('off-7610244003052'),
  -- Milchreis (keeps off-7610807000641)
  ('off-7610900118175'),
  -- Milchreis Apfel-Zimt (keeps off-7610089006744)
  ('off-7627537426702'),
  -- Milchschokolade (keeps food-schokolade)
  ('off-7610849678525'),
  -- Mini Flûtes Butter (keeps off-7616700028805)
  ('off-7613312277393'),
  -- Mini Spring Rolls Gemüse (keeps off-4099200408866)
  ('off-7613033995569'),
  -- Mini-Marshmallows (keeps off-4061463312419)
  ('off-7610089351455'),
  -- Mini-Reis-Waffeln (keeps off-7610200104182)
  ('off-4104420083608'),
  ('off-7610846813059'),
  -- Mini-rösti (keeps off-4099200016412)
  ('off-7610819440572'),
  -- Minipic (keeps off-7610849654802)
  ('off-7610502646601'),
  -- Misch salat (keeps off-4056489078418)
  ('off-7610807077056'),
  -- Misosuppe (keeps bls-X4A8060)
  ('off-4902663012634'),
  -- Morchelsauce (keeps off-7613269299257)
  ('off-7611100373395'),
  -- Mozartkugeln (keeps off-4099200029535)
  ('off-9001508084609'),
  -- Mozzarellaperlen (keeps off-7613331265913)
  ('off-7640171280288'),
  -- Muesli (keeps off-7617027800600)
  ('off-7610027033658'),
  -- Müesli Riegel Apfel (keeps off-7610121611592)
  ('off-7613312520642'),
  -- Multi-Vitamin (keeps off-7610235003252)
  ('off-4000177619001'),
  -- Multifrucht-nektar (keeps off-7610848436201)
  ('off-7613312444986'),
  -- Natur reis (keeps off-5010034007550)
  ('off-5410673059000'),
  -- Nudeln extra breit (keeps off-7640120094096)
  ('off-7610849860647'),
  -- Nuss Mix (keeps off-7627535824098)
  ('off-7627534512231'),
  -- Nuss-Frucht-Mix (keeps off-20815394)
  ('off-4061462454301'),
  -- Nusskernmischung (keeps off-4008258150016)
  ('off-4104420025080'),
  -- Nüsslisalat (keeps off-7613356205024)
  ('off-7640183570742'),
  -- Nussmischung (keeps off-7613312261446)
  ('off-7613312528754'),
  -- Ofen Fleischkäse (keeps off-20441197)
  ('off-2155634005209'),
  -- Ofen-frites (keeps off-7610026121783)
  ('off-7613269319610'),
  -- Oh high protein (keeps off-7613312476161)
  ('off-7613404132371'),
  -- Orange passion (keeps off-7610097164252)
  ('off-7613269223351'),
  -- Orange-Mango (keeps off-7610235004884)
  ('off-3182280065799'),
  -- Orangen Marmelade (keeps off-0043647380012)
  ('off-7640109230316'),
  -- Orangen sirup (keeps off-7610198012018)
  ('off-7627535683992'),
  -- Orangen-Karotten Agaven-Zitronen (keeps off-7616800816159)
  ('off-7616800816166'),
  -- Orangenlimonade (keeps bls-N310300)
  ('off-7640168391911'),
  -- Ovo Coffee (keeps off-7612100921760)
  ('off-7612100914731'),
  -- Pagnolbrot (keeps off-7613331010346)
  ('off-8640104410484'),
  -- Pancakes Mischung (keeps off-7610089071384)
  ('off-4260593955071'),
  -- Pangasiusfilets (keeps off-7613269181118)
  ('off-7613312277775'),
  -- Pangasiusknusperli (keeps off-7613269535485)
  ('off-7613269180876'),
  ('off-7610848674658'),
  -- Paniermischung Fixfertig, gewürzt (keeps off-7613269192046)
  ('off-7613312085028'),
  -- Pannacotta (keeps bls-Y8A5020)
  ('off-7617400020380'),
  -- Paprika-Chili (keeps off-4099200034201)
  ('off-4104420038080'),
  -- Paprikarahm Sauce (keeps off-7611100171410)
  ('off-7610121400875'),
  -- Paranuss Kerne (keeps off-4010355321923)
  ('off-7610491926548'),
  -- Pariserbrot (keeps blv-845)
  ('off-7616700037227'),
  -- Party Mix (keeps off-4000522060519)
  ('off-7613356745865'),
  -- Pasta - Spaghetti (keeps off-4061459541380)
  ('off-8000139004261'),
  -- Pastateig (keeps off-7610827849121)
  ('off-7627535027635'),
  -- Pasteten Füllung (keeps off-7614200200110)
  ('off-7613312061602'),
  ('off-7616800823522'),
  -- Peanut butter creamy (keeps off-8710532471637)
  ('off-0798190119465'),
  -- Pfefferminz-Sirup (keeps off-7617500197029)
  ('off-7613269357537'),
  -- Pfirsichhälften (keeps off-7610800005926)
  ('off-7617027140485'),
  -- Pfirsichnektar (keeps bls-F203700)
  ('off-4036225660107'),
  -- Pilzmischung (keeps off-7613312015841)
  ('off-7613312111086'),
  -- Pirulo Watermelon (keeps off-3858890176025)
  ('off-4008211003304'),
  -- Pitabrot (keeps off-7611654257653)
  ('off-7640116361997'),
  -- Pizzateig (keeps off-7613331790958)
  ('off-7613404200599'),
  -- Polenta, Maisgriess fein (keeps off-7610818340323)
  ('off-7613269317296'),
  -- Pom-Bär Original (keeps off-4000522006890)
  ('off-9000159718703'),
  -- Popcorn-Mais (keeps off-4000286221737)
  ('off-7610809087206'),
  -- Potato-Wedges (keeps off-4099200034140)
  ('off-9002233011007'),
  -- Poulet Brust Spiess Gewürzt (keeps off-2114459009304)
  ('off-2414459004102'),
  ('off-2414459005802'),
  -- Poulet Brustschnitzel (keeps off-2137738010655)
  ('off-2137738009505'),
  -- Poulet Cordon-Bleu (keeps off-2108863007858)
  ('off-4061461949341'),
  ('off-4061463232441'),
  -- Poulet Flügeli (keeps off-2161739006706)
  ('off-4099200404776'),
  -- Poulet Mini Filet (keeps off-2140193010504)
  ('off-2149354009753'),
  ('off-7623186629617'),
  -- Poulet Schenkel (keeps off-2170171007509)
  ('off-7613312268773'),
  -- Poulet Schnitzel (keeps off-2127539011654)
  ('off-2222847009406'),
  -- Poulet Schnitzel (mariniert) (keeps off-2147280009656)
  ('off-2147280013059'),
  -- Poulet Sticks (keeps off-7613312047729)
  ('off-7610200391124'),
  -- Poulet-Meatballs (keeps off-7610162094293)
  ('off-7613269749196'),
  -- Pouletbrust (keeps food-poulet)
  ('off-2127539010305'),
  -- Pouletbrust Geschnetzeltes (keeps off-20240431)
  ('off-7617023007195'),
  -- Pouletbrust Hauchdünn (keeps off-2141573002706)
  ('off-2141573002751'),
  -- Pouletburger (keeps off-7610200199874)
  ('off-7613269731115'),
  -- Pouletfleischzubereitung (keeps off-2150528013001)
  ('off-2174283003800'),
  -- Pouletgeschnetzeltes (keeps off-7617100230836)
  ('off-4099200404691'),
  ('off-7623186787539'),
  -- Pouletschlegeli (keeps off-4099200404745)
  ('off-5503140763187'),
  ('off-4061463983909'),
  -- Pro.activ (keeps off-4000400037947)
  ('off-8719200179073'),
  -- Protein Mix (keeps off-7613312526460)
  ('off-4053776011721'),
  -- Protein-Müsli (keeps off-5902884462798)
  ('off-4104420217027'),
  -- Proteindrink (keeps off-7610900068630)
  ('off-5690845003141'),
  -- Pudding Küchlein (keeps off-7613404014998)
  ('off-7613404765579'),
  -- Puderzucker (keeps bls-S111100)
  ('off-7610846958217'),
  -- Quark Spätzli (keeps off-7610227956948)
  ('off-4056489974550'),
  -- Quarkcreme (keeps bls-Y880160)
  ('off-7623186371851'),
  -- Quarktraum (keeps off-4056489526643)
  ('off-4056489515982'),
  -- Rahm Sauce (keeps off-7611100064750)
  ('off-4005500331506'),
  ('off-7610100055621'),
  -- Rapsöl (keeps blv-600)
  ('off-4104420031883'),
  -- Ratatouille, Gemüsemischung (keeps off-7611654308331)
  ('off-7613269273899'),
  -- Rauchlachs (keeps off-7610271790024)
  ('off-8720289702991'),
  -- Reh-Schnitzel (keeps off-2186401012304)
  ('off-7617027817301'),
  -- Reine Butter Milch (keeps off-40255019)
  ('off-4056489108351'),
  -- Reis Basmati (keeps off-20073763)
  ('off-7613312339046'),
  -- Reis Langkorn (keeps off-5410673004208)
  ('off-5410673004383'),
  -- Reis Mehl (keeps bls-C453000)
  ('off-7613063002954'),
  -- Reis Nudeln (keeps off-4099200098494)
  ('off-8938505644080'),
  -- Reis Risotto (keeps off-4305615670171)
  ('off-5410673727299'),
  -- Reisdrink (keeps off-7613269274001)
  ('off-28508687'),
  -- Reisdrink Calcium (keeps off-4058172217418)
  ('off-4104420095083'),
  -- Reiswaffeln (keeps off-7610848358107)
  ('off-4104420052123'),
  ('off-4099200062945'),
  -- Rhabarber Nektar (keeps off-4388860547450)
  ('off-4003240925009'),
  -- Riesen-Cervelas (keeps off-20595753)
  ('off-7610029213478'),
  -- Riffelchips Salz (keeps off-4099200047072)
  ('off-4337185340734'),
  -- Rindbouillon (keeps off-7613312327661)
  ('off-7613312037485'),
  -- Rinderfrühstücksfleisch (keeps off-3850104020803)
  ('off-3856020214937'),
  -- Rindgeschnetzeltes (keeps off-2182090009601)
  ('off-2164740008103'),
  -- Rinds Bouillon (keeps off-7611100055086)
  ('off-7613269197140'),
  -- Rinds Entrecote (keeps off-2150372012908)
  ('off-2162094011152'),
  ('off-2166494010456'),
  -- Rinds-Schulterbraten (keeps off-2802216005699)
  ('off-2821492006732'),
  -- Rindshackfleisch (keeps off-2153712005653)
  ('off-2189890012558'),
  -- Rindshamburger (keeps off-7613269843122)
  ('off-7613404450055'),
  -- Rindshohrückensteak (keeps off-2150378009605)
  ('off-2265850010700'),
  -- Rindsplätzli a la minute (keeps off-2823492002653)
  ('off-2823497002375'),
  ('off-2160759012902'),
  -- Risotto Reis (keeps off-7610200010872)
  ('off-4311501451038'),
  -- Roggen Mehl (keeps off-7611654678304)
  ('off-7613269350149'),
  -- Roggen Vollkornmehl (keeps bls-C221000)
  ('off-7613312397152'),
  -- Roggenschrotbrot (keeps blv-846)
  ('off-7610169013327'),
  -- Roggenvollkornbrot (keeps bls-B121000)
  ('off-4104420224728'),
  -- Rohrohrzucker (keeps off-7610848669036)
  ('off-7610278033704'),
  -- Rohrzucker-Sticks (keeps off-7610302496710)
  ('off-7610302496727'),
  -- Rösti (keeps food-roesti)
  ('off-7616800460314'),
  -- Röstikroketten (keeps off-7613312232002)
  ('off-7613312246702'),
  -- Rote Kidneybohnen (keeps off-7616800800509)
  ('off-4099200011295'),
  -- Royal-Torte (keeps off-7616700196092)
  ('off-7616700196115'),
  -- Rüeblitorte (keeps blv-916)
  ('off-7616700201253'),
  -- Rump Steak (keeps off-2202972030254)
  ('off-2159765017209'),
  -- Sanddornsaft (keeps bls-F405600)
  ('off-7611916159046'),
  -- Saucen-halbrahm (keeps off-7610029156669)
  ('off-7627534970130'),
  -- Schafmilchjogurt nature (keeps off-7640102943244)
  ('off-7617027663236'),
  -- Schinken & Käse (keeps off-7623186791611)
  ('off-7610227955590'),
  -- Schmelzkäsescheiben (keeps off-4337185482250)
  ('off-7610029237306'),
  -- Schnitzel-Sandwich (keeps off-7610339091896)
  ('off-7613404621219'),
  -- Schoko Knusper Müsli (keeps off-4061458059213)
  ('off-4061462268281'),
  -- Schoko Müsli (keeps off-4104420017849)
  ('off-5902884461838'),
  -- Schokokugeln (keeps off-7610849671793)
  ('off-9100000893570'),
  -- Schokolade stichfest (keeps off-22016348)
  ('off-7610900044320'),
  -- Schokolade Weihnachtsmann (keeps off-7616500663596)
  ('off-4008400511528'),
  -- Schokoladen-Cake (keeps off-7610829352001)
  ('off-7616700174854'),
  -- Schokoladencrème (keeps blv-807)
  ('off-3608580003687'),
  ('off-7613269891031'),
  -- Schokoladenkuchen (keeps off-7613269908371)
  ('off-7613269217732'),
  -- Schokoladenstreusel (keeps bls-S660000)
  ('off-7613331366535'),
  ('off-4311501358658'),
  -- Schokoladenwürfel (keeps off-7610198032993)
  ('off-7627534586324'),
  -- Schokoreiswaffeln (keeps off-4058172814082)
  ('off-4068134199898'),
  ('off-11044204'),
  -- Schwarzwälderschinken (keeps off-7610195059818)
  ('off-2113533005805'),
  -- Schweden-Torte (keeps off-7616700025439)
  ('off-7616700083408'),
  -- Schwedenbecher (keeps off-7616700189476)
  ('off-7617400050455'),
  -- Schweineragout (keeps bls-Y344013)
  ('off-20290597'),
  -- Schweins geschnetzeltes (keeps off-4335619256163)
  ('off-2182614006000'),
  -- Schweins halssteak (keeps off-2231913006508)
  ('off-2231913007406'),
  -- Schweins-Kotelett (keeps off-2166003012858)
  ('off-2186009008303'),
  -- Schweinshals Steak mariniert (keeps off-2172166002551)
  ('off-2153334017300'),
  -- Schweinshalssteak gewürzt (keeps off-2114386010701)
  ('off-2415503009654'),
  -- Schweinsnierstuck (keeps off-2818720007647)
  ('off-4099200424736'),
  ('off-2151969012554'),
  -- Schweinsplätzli Nierstück (keeps off-2150368007406)
  ('off-2168069015453'),
  -- Schweizer Alpenmilchschokolade (keeps off-7613031084814)
  ('off-7610148200403'),
  -- Schweizer Milchschokolade (keeps off-7613331423139)
  ('off-7610036010305'),
  -- Sesam : ungeschält (keeps off-7610848693185)
  ('off-2099409900132'),
  -- Sesam Samen (keeps off-7610200099662)
  ('off-7615900002783'),
  -- Sesamöl (keeps blv-14107)
  ('off-4104420204546'),
  -- Shirataki Rice-Style (keeps off-7613312410202)
  ('off-7613312303108'),
  -- Silber-Zwiebeln (keeps off-20039981)
  ('off-4056489476894'),
  -- Sirup Pfirsich (keeps off-7613269356035)
  ('off-7613312265215'),
  -- Smoothie - Ananas, Banane, Kokos (keeps off-4099200056838)
  ('off-4061459528381'),
  -- Smoothie Mango & Maracuja (keeps off-5038862232937)
  ('off-4104420146563'),
  -- Snack-Gurken (keeps off-20507572)
  ('off-7617027717212'),
  -- Soft Waffeln (keeps off-7610200339430)
  ('off-7613312469644'),
  -- Soja drink calcium (keeps off-4104420095021)
  ('off-7613331094933'),
  -- Soja Drink Natur (keeps off-4061459426175)
  ('off-4061462919121'),
  -- Soja-Granulat (keeps off-4025174121135)
  ('off-7610491073242'),
  -- Sojasauce (keeps blv-13456)
  ('off-4099200025452'),
  -- Sonnenblumenkerne (keeps blv-281)
  ('off-4104420011670'),
  -- Spareribs (keeps off-2112537018453)
  ('off-2819750008253'),
  -- Spareribs mariniert (keeps off-2184940010157)
  ('off-2184940009205'),
  -- Spinatchüechli (keeps off-7610848241256)
  ('off-7613312025604'),
  -- Sprühsahne (keeps off-4388840216086)
  ('off-4311596460403'),
  -- St. Galler OLMA- Bratwurst (keeps off-7610607007307)
  ('off-20695873'),
  ('off-7610200277664'),
  -- Steinpilz Sauce (keeps off-4099200021959)
  ('off-7613312274736'),
  -- Sugar Cornflakes : mit Zuckerüberzug (keeps off-7610845113006)
  ('off-7613269333791'),
  -- Sugo all'arrabbiata (keeps off-7610848376613)
  ('off-80525424'),
  -- Sultaninen, ungeschwefelt, getrocknet (keeps off-28101673)
  ('off-4099200023328'),
  -- Süss-Sauer-Sauce (keeps off-4002359015229)
  ('off-4013200881597'),
  -- Susser murbeteig (keeps off-7613269211181)
  ('off-7613404201015'),
  -- Süßrahmbutter (keeps bls-Q630000)
  ('off-4311501313046'),
  ('off-22139559'),
  -- Tartare-Sauce (keeps off-7610827986246)
  ('off-7613036762779'),
  ('off-7616600706780'),
  -- Tessinerbrot (keeps blv-828)
  ('off-7611654340935'),
  -- Thai Mix (keeps off-7613035748736)
  ('off-4056489477693'),
  -- Thunfischsalat - Mexico (keeps off-4012839782527)
  ('off-28129592'),
  -- Tiramisu (keeps blv-14023)
  ('off-7613269547907'),
  -- Tirolercake (keeps blv-887)
  ('off-7616700001334'),
  -- Tomate Basilikum (keeps off-4305615677521)
  ('off-7617400035636'),
  -- Tomatenketchup (keeps bls-R141100)
  ('off-4006040292081'),
  -- Tomatenmark (keeps bls-R160000)
  ('off-24045469'),
  -- Tomatenpüree (keeps blv-636)
  ('off-8001250009869'),
  -- Tomatensauce (keeps blv-667)
  ('off-4002576120003'),
  -- Tomatensuppe (keeps blv-670)
  ('off-7613379519924'),
  -- Tomme a la creme Bio (keeps off-4335619078338)
  ('off-7617027917315'),
  -- Tortellini Ricotta Spinat (keeps off-4056489009191)
  ('off-20351922'),
  -- Tortelloni Ricotta Spinaci (keeps off-7610961011996)
  ('off-7610807061857'),
  -- Tortilla mit Zwiebeln (keeps off-20645366)
  ('off-7610849766598'),
  -- Truten Brustgeschnetzeltes (keeps off-2164310013155)
  ('off-7613404113387'),
  -- UrDinkel Älpler-Magronen (keeps off-7612360360255)
  ('off-7612360660270'),
  -- Urdinkel Mehl hell (keeps off-7611330051940)
  ('off-7617027049955'),
  -- Vanillekipferl (keeps off-7613404201381)
  ('off-7617400034998'),
  -- Vanillepaste (keeps off-7613312347447)
  ('off-9300641001062'),
  -- Vanillezucker (keeps bls-S114000)
  ('off-7610089362277'),
  -- Vanillinzucker (keeps bls-R452000)
  ('off-4311501676004'),
  ('off-7613312256664'),
  -- Vermicelles : Maronenzubereitung (keeps off-7616800812359)
  ('off-7614200006996'),
  -- Vital Gebäck (keeps off-4061459468670)
  ('off-4099200001906'),
  -- Vogel-Nestli (keeps off-7610846695495)
  ('off-7613269290025'),
  -- Vollkorn Landbrot (keeps off-7616700126808)
  ('off-7623186212918'),
  -- Vollkorn-Haferflocken (keeps off-7610200011428)
  ('off-7610800996866'),
  -- Vollkorntoast (keeps off-20231637)
  ('off-4056489123903'),
  -- Vollreiswaffeln (keeps off-0686414041497)
  ('off-8712700527504'),
  -- Vorder-Schinkenwürfeli (keeps off-7617027962728)
  ('off-7617027962827'),
  -- Vorderschinken & Käse Sandwich (keeps off-4335619079526)
  ('off-7627535912245'),
  -- Vorzugsbutter (keeps blv-49)
  ('off-7612300531219'),
  -- Walnusskerne (keeps off-4008258130018)
  ('off-4010355198068'),
  -- Wasabi-Paste (keeps off-7640147861114)
  ('off-4023900544258'),
  -- Weihnachts-mischung (keeps off-7616500641945)
  ('off-7617400030501'),
  -- Weißwein Essig (keeps off-4104420168930)
  ('off-4104420214422'),
  -- Weisswurst (keeps blv-1273)
  ('off-4006153116007'),
  -- Weizen Mehl, Type 405 (keeps bls-C214100)
  ('off-20003142'),
  -- Weizen Tortillas (keeps off-4388860024012)
  ('off-5010084909545'),
  -- Wildpreiselbeeren (keeps off-9001432002380)
  ('off-4008122012082'),
  -- Wildreis Mix (keeps off-20694418)
  ('off-7610849660506'),
  -- Wok-Sauce (keeps off-7610849910038)
  ('off-8715035230309'),
  -- Würfel-Zucker (keeps off-7610200010100)
  ('off-7610278041105'),
  ('off-7610818224197'),
  -- Wurst-käse-salat (keeps off-7610029224184)
  ('off-7627536962898'),
  -- XL Pizzateig (keeps off-7613404007471)
  ('off-7616700186963'),
  -- Zaziki Quark (keeps off-22139740)
  ('off-4337185467783'),
  -- Ziegen-Frischkäse (keeps off-4099200023885)
  ('off-4104420174917'),
  -- Ziegenkäse (keeps off-2316729002699)
  ('off-2115449006006'),
  -- Zitronen Cake (keeps off-7624841856911)
  ('off-7623186104046'),
  ('off-7616700174878'),
  ('off-2104707003406'),
  -- Zitronenlimonade (keeps bls-N310400)
  ('off-7617500194707'),
  -- Zuckersticks (keeps off-7610200270825)
  ('off-7610809082195'),
  ('off-7630030392467'),
  -- Züribieter-Eier (keeps off-7617027851411)
  ('off-7613269488996')
) as v(id)
where f.id = v.id
  and f.active;
