-- Dialy: hide duplicate foods. After 0016/0018 shortened the names, many
-- Open Food Facts products share one name (e.g. 9x "Eier", 13x "Fischstäbchen").
-- Per name (case-insensitive) one food stays active; the others get
-- active = false. Nothing is deleted, so diary entries that point to a hidden
-- food keep working and a food can be re-activated in the Dialy-Editor.
--
-- Which one stays: BLV, then BLS, then editor-created foods, then Open Food
-- Facts; within that, the food whose carbs (then sugar/fat) are closest to the
-- median of its group, so outliers such as "Milch" with 51.5 g KH (powder) are
-- hidden. Ties go to foods with portions, then translations.
--
-- 1238 names, 2339 foods hidden. The foods_touch_updated_at trigger (0010)
-- bumps updated_at, so the app drops them from the KH-Rechner on its next sync.

update public.foods f
set active = false
from (values
  -- Aceto Balsamico (keeps off-4099200067285)
  ('off-4104420030923'),
  ('off-7613312330487'),
  ('off-8015352304258'),
  -- Aceto Balsamico di Modena (keeps off-4010355334015)
  ('off-80228509'),
  ('off-4099200023762'),
  ('off-8007178101234'),
  -- Aceto balsamico di Modena IGP (keeps off-7613312407806)
  ('off-7624841680134'),
  -- Actimel Erdbeer (keeps off-4009700079947)
  ('off-4009700085184'),
  -- Actimel Granatapfel (keeps off-4009700036810)
  ('off-4009700075055'),
  -- Actimel Multifrucht (keeps off-4009700016751)
  ('off-4009700085207'),
  -- Activia Erdbeere (keeps off-4009700036988)
  ('off-4009700085016'),
  -- Activia himbeere (keeps off-4009700084996)
  ('off-4009700037015'),
  -- Adventskalender (keeps off-3017627454106)
  ('off-7616500063709'),
  -- Ajvar (keeps off-7613331497734)
  ('off-4388844252264'),
  ('off-9006889003119'),
  -- Ajvar mild (keeps off-4099200140650)
  ('off-3850104051012'),
  ('off-7640116362000'),
  -- Alkoholfrei (keeps off-7640163291582)
  ('off-76129261'),
  -- All I Want Cottage Cheese Natur mit einem Hauch von Alpensalz (keeps off-4009700032683)
  ('off-4009700033420'),
  -- Alpenbrot (keeps off-7616700071054)
  ('off-7616700168891'),
  -- Älpler Magronen (keeps off-7610029237665)
  ('off-7640120090425'),
  ('off-7610849860302'),
  ('off-7613356059566'),
  -- Älplermagronen (keeps off-7640346310154)
  ('off-7610227940602'),
  ('off-7627535172144'),
  -- American XL-Toast (keeps off-7613404016541)
  ('off-7613404016732'),
  -- Ananas (keeps off-7613269260707)
  ('off-7613312273685'),
  ('off-7610235006581'),
  ('off-7613312312209'),
  ('off-7615900140102'),
  ('off-7613269260769'),
  -- Ananas Scheiben (keeps off-7613312318454)
  ('off-7617027101356'),
  ('off-7613413952007'),
  ('off-4300175162869'),
  -- Ananas Stücke (keeps off-7613404642887)
  ('off-4104420024823'),
  -- Ananas-Scheiben (keeps off-7610800005780)
  ('off-7610800005797'),
  -- Ananasscheiben (keeps off-7613312488621)
  ('off-7617027101578'),
  ('off-7610029001631'),
  ('off-7610200100030'),
  ('off-7613269267225'),
  -- Ananasstücke (keeps off-7617027747646)
  ('off-7613312312827'),
  ('off-4053776011523'),
  -- Angus Burger (keeps off-7613312047590)
  ('off-7613312248973'),
  -- Antioxidant (keeps off-5038862230285)
  ('off-7618500942756'),
  -- Aop Walliser Roggenbrot (keeps off-7616700241204)
  ('off-7611654363712'),
  -- Apero Mix (keeps off-7610900235650)
  ('off-7610058211995'),
  -- Äpfel (keeps off-4061458243452)
  ('off-7610200295361'),
  -- Apfel Banane (keeps off-4062300199385)
  ('off-4005500073628'),
  -- Apfel Kuchen (keeps off-7627534175047)
  ('off-4044146005273'),
  -- Apfelchips (keeps off-20763961)
  ('off-4099200142791'),
  ('off-9100000710020'),
  -- Apfelmus (keeps bls-Y843143)
  ('off-7613331043221'),
  -- Apfelringe (keeps off-4000512364313)
  ('off-4008258403020'),
  -- Apfelsaft naturtrüb (keeps off-4066447343021)
  ('off-4104420071728'),
  -- Apfelschorle (keeps off-4061462655708)
  ('off-7611330294446'),
  ('off-7613269283744'),
  ('off-7617500197647'),
  ('off-7610469174636'),
  ('off-7610029134506'),
  ('off-7624841872904'),
  -- Apfelsprudel (keeps off-7617500197524)
  ('off-7613312230244'),
  -- Apfelstrudel (keeps off-7611687091408)
  ('off-7613269180791'),
  -- Appenzeller Fondue (keeps off-7610200107626)
  ('off-7624841119375'),
  -- Appenzeller Gewürzschinken (keeps off-2153370004753)
  ('off-2153370004807'),
  ('off-2153370005101'),
  -- Appenzeller Mild-Würzig (keeps off-2181450004102)
  ('off-1895966002804'),
  -- Appenzeller Mostbröckli (keeps off-2115588006004)
  ('off-2189890003501'),
  ('off-2174076006551'),
  ('off-2140794007200'),
  -- Aprikose (keeps off-4106060015179)
  ('off-7610900044245'),
  ('off-7610097155267'),
  ('off-7610200371003'),
  -- Aprikosen (keeps off-7613312007839)
  ('off-4008258359013'),
  -- Aprikosen getrocknet (keeps off-7613312380666)
  ('off-7613413835348'),
  ('off-7610029159189'),
  -- Aprikosen Konfitüre (keeps off-3608580925484)
  ('off-7616800833101'),
  -- Aprikosen Konfitüre extra (keeps off-27003053)
  ('off-4061459584004'),
  -- Arrabbiata (keeps off-7613312377086)
  ('off-4000400138545'),
  ('off-20300623'),
  -- Artischocken (keeps off-7613269146759)
  ('off-80482475'),
  ('off-8053323641803'),
  -- Artischockenherzen (keeps off-7613269357803)
  ('off-7610809020982'),
  -- Aufschnitt (keeps off-7610829256743)
  ('off-7610849938322'),
  ('off-2974804004886'),
  -- Ayran (keeps off-4002566003194)
  ('off-4037454001006'),
  ('off-4061461000950'),
  ('off-8682214708105'),
  -- Back-Camembert (keeps off-7613404661031)
  ('off-7627536077066'),
  -- Backmehl (keeps off-7610803009273)
  ('off-7610827336669'),
  -- Backofen-Frites (keeps off-7610807000245)
  ('off-7610807082203'),
  -- Bake Rolls Knoblauch (keeps off-5201360660223)
  ('off-5201360601264'),
  -- Balance (keeps off-7610900205165)
  ('off-7622400896170'),
  -- Balsamico bianco (keeps off-7611575006095)
  ('off-7640111970408'),
  ('off-20087579'),
  -- Balsamico Dressing (keeps off-7611654660484)
  ('off-4262409550098'),
  -- Bambussprossen (keeps off-4099200121017)
  ('off-7613312304020'),
  -- Bananen (keeps off-7613269131274)
  ('off-7613900003960'),
  ('off-7610632946305'),
  -- Bananen getrocknet (keeps off-7613312316863)
  ('off-7613331596550'),
  -- Bananenchips (keeps off-4008258274019)
  ('off-7640157671734'),
  -- Barbecue Sauce (keeps off-4104420146891)
  ('off-7610323039309'),
  -- Bärentatzen (keeps off-7613331366467)
  ('off-7617400032703'),
  ('off-7617400030020'),
  ('off-7624841032018'),
  -- Bärlauch Fleischkäse (keeps off-2156801004650)
  ('off-4061462753442'),
  -- Basilico (keeps off-4000400138552)
  ('off-7613312377123'),
  -- Basilikum (keeps off-7610848066323)
  ('off-3272770097406'),
  ('off-8076809523561'),
  -- Basler Läckerli (keeps off-7610073951432)
  ('off-4061464743847'),
  -- Basler Mehlsuppe (keeps off-7611100088435)
  ('off-7610121300243'),
  -- Basler original (keeps off-7610073957298)
  ('off-7610073957335'),
  -- Basmati (keeps off-5410673000958)
  ('off-7613331668363'),
  -- Basmati Reis (keeps off-7624841520928)
  ('off-7627536249326'),
  ('off-4311596479634'),
  ('off-7610200059222'),
  ('off-4099200013343'),
  ('off-3487400006424'),
  ('off-8964002216000'),
  -- Basmati Rice (keeps off-7627536249869)
  ('off-7610294750432'),
  ('off-7627536690661'),
  -- Basmatireis (keeps off-7617027923842)
  ('off-4099200169699'),
  -- Bauernbratwurst (keeps off-0583600008008)
  ('off-7610011610049'),
  -- Bauernmehl (keeps off-7611330513035)
  ('off-7611330891300'),
  ('off-7610800997894'),
  -- Bauernschinken (keeps off-7613404588239)
  ('off-2153313004550'),
  ('off-7617027723220'),
  ('off-7623186504471'),
  -- Bauernspeck (keeps off-2130040003803)
  ('off-2114897003858'),
  ('off-4335619254831'),
  ('off-4099200429076'),
  ('off-7617027943901'),
  ('off-2111652005102'),
  -- Baumnüsse (keeps off-7610198073385)
  ('off-7613312320259'),
  ('off-7610848675358'),
  ('off-7610848077046'),
  -- Baumschmuck (keeps off-4000539708107)
  ('off-4000539708206'),
  -- Becel Classic (keeps off-8719200261464)
  ('off-8719200300316'),
  -- Beef Burger (keeps off-7613312320884)
  ('off-7610162216015'),
  ('off-2167817007658'),
  ('off-7610162206122'),
  -- Beerenmischung (keeps off-7610078241026)
  ('off-7627536466921'),
  ('off-7610029226577'),
  ('off-7623186246920'),
  ('off-7613312435946'),
  ('off-9310135028253'),
  ('off-7613312228234'),
  -- Beerenmischung ungezuckert (keeps off-7610200095046)
  ('off-7610200301628'),
  ('off-7610200337160'),
  -- Beerensirup (keeps off-7613269355854)
  ('off-7613269366638'),
  ('off-7610198022369'),
  -- Berner Rösti (keeps off-4056489425618)
  ('off-7614200013727'),
  ('off-7610800017912'),
  ('off-7616800460147'),
  ('off-20236403'),
  -- Bienenstich (keeps off-4311596470280)
  ('off-7616700175455'),
  -- Bifidus Joghurt Nature (keeps off-4056489478263)
  ('off-7616600711395'),
  -- Bio Apfelmus (keeps off-7627536189622)
  ('off-7627536242723'),
  -- Bio black beans (keeps off-7613356789975)
  ('off-7627534471989'),
  -- Bio Butter (keeps off-7611613000160)
  ('off-7610900861361'),
  ('off-7610900060900'),
  -- Bio Gnocchi Di Patate (keeps off-7627537676084)
  ('off-7610848553304'),
  -- Bio Joghurt (keeps off-7640153230997)
  ('off-4002970001236'),
  -- Bio Ketchup (keeps off-7627534164843)
  ('off-7627536135940'),
  ('off-8715700125817'),
  -- Bio Kokosblütensirup (keeps off-4099200059204)
  ('off-4104420145122'),
  -- Bio Mais (keeps off-7611337500939)
  ('off-7627534181055'),
  -- Bio Mandelmus braun (keeps off-4260289448672)
  ('off-7624841915335'),
  -- Bio Milch Drink (keeps off-4061462771330)
  ('off-4061462771958'),
  -- Bio Pastrami (keeps off-2115427005854)
  ('off-2115427005953'),
  ('off-2115427006004'),
  -- Bio Randensalat (keeps off-7610807076745)
  ('off-7624841884037'),
  -- Bio Räucherlachs (keeps off-4260630710359)
  ('off-4260630710472'),
  -- Bio Tofu Geräuchert (keeps off-20853600)
  ('off-7611090051006'),
  -- Bio Tofu Nature (keeps off-7649988732218)
  ('off-7627538083119'),
  -- Bio Tortelloni Ricotta & Spinat (keeps off-20759650)
  ('off-4099200414591'),
  -- Bio Vollmilch (keeps off-7610900293650)
  ('off-7611613001105'),
  ('off-4061462730115'),
  -- Bio Weide Beef Burger (keeps off-2163191006850)
  ('off-2163191007208'),
  -- Bio-Eier (keeps off-7613404859124)
  ('off-7613404859117'),
  ('off-7610253079789'),
  -- Bircher müesli (keeps off-7610029140804)
  ('off-7611471004270'),
  ('off-7624841569989'),
  -- Bircher Müesli Beeren (keeps off-7613100001049)
  ('off-7613269420200'),
  -- Bircher Müesli CLASSIC (keeps off-7613269420019)
  ('off-7610900002184'),
  -- Birchermüesli Classic (keeps off-7610818538782)
  ('off-7613269305248'),
  -- Birchermüesli Joghurt (keeps off-7616600706315)
  ('off-7613404449394'),
  -- Birchermüsli (keeps off-2103100006700)
  ('off-7623186379673'),
  -- Birnen (keeps off-7617027953146)
  ('off-7613312327968'),
  -- Birnenhälften (keeps off-7610827846854)
  ('off-7617027051491'),
  -- Birnweggen (keeps off-7610809108727)
  ('off-7616700151435'),
  -- Bitter (keeps off-7610327027364)
  ('off-7627535701191'),
  -- Bitter Lemon (keeps off-4061462510984)
  ('off-7610238300921'),
  ('off-4099200026190'),
  ('off-7617027009485'),
  -- Bizzl Mix (keeps off-4003084168006)
  ('off-4000512364450'),
  -- Blätterteig (keeps off-7613035309043)
  ('off-7616700034783'),
  ('off-4099200160504'),
  ('off-7613269207689'),
  ('off-7616700165135'),
  ('off-7623186247811'),
  ('off-7616700186352'),
  ('off-7610807057225'),
  ('off-7613404201107'),
  ('off-7610846879062'),
  ('off-4337185499937'),
  -- Blätterteig ausgewallt (keeps off-7613269207849)
  ('off-7610829071971'),
  -- Blätterteig eckig (keeps off-7613404202265)
  ('off-7627534588007'),
  -- Blattspinat (keeps off-4099200409399)
  ('off-7613312382752'),
  ('off-7610809116753'),
  ('off-7613030006138'),
  ('off-7610029011418'),
  ('off-7616800810492'),
  -- Blumenkohl (keeps off-7613269172475)
  ('off-7613331588777'),
  -- Blütenhonig (keeps off-7610200018205)
  ('off-7613269356219'),
  ('off-7617027068710'),
  ('off-7613356186798'),
  ('off-4305615571485'),
  ('off-7610029155471'),
  -- Blütenhonig BIO (keeps off-7610848657460)
  ('off-7613356186774'),
  -- Blütenhonig flüssig (keeps off-7613312302774)
  ('off-7617027068734'),
  -- Blütenhonig Kristallin (keeps off-7613269323020)
  ('off-7613312313817'),
  ('off-7610200326423'),
  -- Blutorangen (keeps off-7613269260639)
  ('off-7616800894911'),
  -- Blutorangensaft (keeps off-28125877)
  ('off-3608580002697'),
  -- Bohnen (keeps off-4099200428734)
  ('off-7616800823423'),
  ('off-4099200434315'),
  ('off-7610827338243'),
  ('off-8053323642305'),
  -- Bohnen fein (keeps off-7610800001171)
  ('off-7610807008739'),
  ('off-7610247589119'),
  ('off-7610849558414'),
  -- Bohnensalat (keeps off-4003274000239)
  ('off-7613269284321'),
  -- Bolognese (keeps off-20003937)
  ('off-8076809545266'),
  ('off-7613312014011'),
  -- Bordelaise (keeps off-7613356683785)
  ('off-7613031652945'),
  -- Borlotti Bohnen (keeps off-7610200048066)
  ('off-8000320030109'),
  ('off-4061459602203'),
  -- Bouillon (keeps off-7614200115186)
  ('off-7613312021057'),
  -- Bouillon Gemüse (keeps off-7610827754340)
  ('off-7624841052689'),
  -- Bratensauce (keeps off-7611100092333)
  ('off-7613312241981'),
  ('off-8721201914911'),
  ('off-7610703200602'),
  ('off-7610845803402'),
  ('off-7610829706057'),
  ('off-20620523'),
  -- Brätkügeli (keeps off-2168151006352)
  ('off-7610011005074'),
  -- Bratspeck (keeps off-2155075003253)
  ('off-2184737003058'),
  ('off-2183817002455'),
  ('off-4056489188773'),
  -- Bratwurst (keeps off-7617100217806)
  ('off-7610845467833'),
  ('off-7610200428059'),
  ('off-7610827963902'),
  -- Bretzeli (keeps off-7610058009790)
  ('off-7614800120009'),
  -- Broccoli (keeps off-7613269172451)
  ('off-7613269270805'),
  ('off-7613356570054'),
  -- Brokkoli (keeps off-20108908)
  ('off-7613356570030'),
  -- Brötchen-Mix (keeps off-7613404827406)
  ('off-7616700229417'),
  -- Brownie (keeps off-7613269437123)
  ('off-7613356575905'),
  -- Buchstaben Suppe (keeps off-7611100149600)
  ('off-4099200425344'),
  -- Buchweizen (keeps off-7610200044495)
  ('off-7613312371336'),
  ('off-4061459235678'),
  -- Bulgur (keeps off-4104420174696)
  ('off-7627537076792'),
  ('off-4099200014760'),
  -- Bulgur Pfanne Mediterrane Art (keeps off-4104420134164)
  ('off-4104420177789'),
  -- Bündner Gersten (keeps off-7613032572440)
  ('off-7613269297413'),
  -- Bündner Nusstorte (keeps off-7616700001341)
  ('off-7640165032145'),
  ('off-7623186106477'),
  -- Bündner Nusstörtli (keeps off-7623186103766)
  ('off-7616700285680'),
  ('off-7640165030028'),
  -- Bündner Rohschinken (keeps off-7623186208904)
  ('off-7623186154072'),
  ('off-7610029157826'),
  -- Bündnerfleisch (keeps off-4099200405858)
  ('off-7610502121139'),
  ('off-7617027815925'),
  ('off-2246338006903'),
  ('off-4056489781646'),
  ('off-7610195049819'),
  ('off-7610271889711'),
  ('off-2150234010202'),
  ('off-2151503010404'),
  ('off-7610271889728'),
  ('off-7610195616714'),
  ('off-7623186107481'),
  ('off-8020999000333'),
  -- Burger (keeps off-4260237453604)
  ('off-7613269476818'),
  ('off-4003084014884'),
  -- Burger Buns (keeps off-7613269223375)
  ('off-9005300010736'),
  -- Burger sauce (keeps off-8715700208640)
  ('off-7613287248770'),
  -- Burrata (keeps off-7610253592141)
  ('off-7610848252436'),
  ('off-7613269973973'),
  ('off-20499617'),
  -- Butter (keeps off-7610128737165)
  ('off-7610434013892'),
  ('off-7610800996279'),
  ('off-7610845600551'),
  ('off-7612300010165'),
  ('off-7617300725231'),
  ('off-7617300727761'),
  ('off-7610900041442'),
  ('off-7613404311257'),
  ('off-7617027889728'),
  ('off-7612300010653'),
  ('off-7610829588332'),
  -- Buttergipfel (keeps off-7616700001174)
  ('off-7623186151415'),
  ('off-7627537665019'),
  ('off-7613269573067'),
  -- Butterkeks (keeps off-7610029229400)
  ('off-4099200026763'),
  -- Buttermilch Himbeer (keeps off-7610200384959)
  ('off-7610554046787'),
  -- Buttertoast (keeps off-22115928)
  ('off-4009249022503'),
  ('off-7627538243049'),
  -- Butterwaffeln (keeps off-7627536779519)
  ('off-7613312261361'),
  -- Cacao pur (keeps off-7610400095310)
  ('off-7610400097208'),
  -- Caesar Salat (keeps off-7627538177733)
  ('off-7613404874523'),
  -- Cafino Cereal (keeps off-61018266)
  ('off-02151069'),
  -- Camembert (keeps off-7617027964456)
  ('off-3228023920090'),
  ('off-7610818252541'),
  ('off-3161910238710'),
  -- Cannelloni Fiorentina (keeps off-7610026007698)
  ('off-7613312020661'),
  -- Caotina (keeps off-7612100801307)
  ('off-7612100801383'),
  ('off-7612100906026'),
  -- Caotina Blanc (keeps off-7612100906163)
  ('off-7612100921999'),
  -- Caotina Original (keeps off-7612100906125)
  ('off-7612100801314'),
  -- Cappuccino (keeps off-7610100010903)
  ('off-8000300209761'),
  ('off-7610046001706'),
  ('off-7610900041640'),
  -- Caramel (keeps off-7613269779766)
  ('off-7616600708623'),
  ('off-7610900198924'),
  -- Caramelköpfli (keeps off-7610089004931)
  ('off-7613269159162'),
  -- Casareccia (keeps off-8001250120885)
  ('off-8008857400587'),
  -- Cashewkerne (keeps off-4008407014305)
  ('off-4099200423746'),
  ('off-20267605'),
  ('off-7613312022856'),
  ('off-4104420026704'),
  -- Cashewkerne geröstet & gesalzen (keeps off-20051013)
  ('off-4008258038000'),
  -- Cashewmus (keeps off-7624841575881)
  ('off-4061462113871'),
  ('off-3267110005555'),
  -- Cashewnüsse (keeps off-7613413839957)
  ('off-7627536606914'),
  ('off-7613312305935'),
  ('off-7613331960931'),
  ('off-7613269193975'),
  ('off-7613312281215'),
  -- Cashews (keeps off-7613356744974)
  ('off-7627534328481'),
  ('off-4004980539501'),
  -- Cashews geröstet & gesalzen (keeps off-4099200046921)
  ('off-4104420057364'),
  -- Cervelas (keeps off-7613269782308)
  ('off-7610200012937'),
  ('off-7617100222718'),
  ('off-7610200370457'),
  ('off-7610809035856'),
  ('off-7610029006926'),
  ('off-20812195'),
  ('off-2105000007955'),
  ('off-4099200407463'),
  -- Cevapcici (keeps off-4056489551539)
  ('off-7623187008435'),
  ('off-4099200408767'),
  ('off-7613312015780'),
  ('off-4260322212635'),
  -- Chai latte (keeps off-7613312031698)
  ('off-4099200028040'),
  -- Champignons (keeps off-7627534384715)
  ('off-7616800800059'),
  ('off-7627534384708'),
  ('off-4099200011622'),
  -- Champignons Bio (keeps off-3083681093551)
  ('off-8710609412082'),
  -- Chäs-Chüechli (keeps off-7616700007633)
  ('off-7616700008104'),
  ('off-7610026003607'),
  ('off-7616700131468'),
  ('off-7613269331988'),
  -- Chäschüechli (keeps off-7624841520232)
  ('off-7610848436843'),
  ('off-7610848588337'),
  ('off-7613312247273'),
  -- Cherrytomaten (keeps off-7610632986721)
  ('off-7613269583707'),
  -- Chicken Nuggets (keeps off-7613312245613)
  ('off-4335619254756'),
  ('off-7613312454824'),
  ('off-4335619080294'),
  ('off-11110019'),
  ('off-7627536984586'),
  ('off-7627538135627'),
  ('off-7610029151749'),
  ('off-20233976'),
  ('off-3838977020748'),
  -- Chicken Nuggets Poulet (keeps off-7613269296690)
  ('off-7624841027526'),
  -- Chicken Sandwich (keeps off-7623186088797)
  ('off-7640143480067'),
  -- Chicken Schnitzel (keeps off-2185039005658)
  ('off-2228738012753'),
  -- Chicken sticks (keeps off-7623186029875)
  ('off-7610849874439'),
  -- Chili Cheese Nuggets (keeps off-7613312467350)
  ('off-7627535732768'),
  ('off-4260191280957'),
  -- Chili con carne (keeps off-7613413870851)
  ('off-4001139000370'),
  ('off-4056489217299'),
  -- Chinese Noodles (keeps off-7613312434161)
  ('off-5060237280410'),
  -- Chinotto (keeps off-8002270756627)
  ('off-8002270666797'),
  -- Chips (keeps off-7613269193838)
  ('off-7624841726979'),
  -- Chips Nature (keeps off-7610029196559)
  ('off-7610095004000'),
  -- Chips Paprika (keeps off-7611654221609)
  ('off-7616800816326'),
  ('off-7611654399766'),
  ('off-7613312015476'),
  ('off-7610829851573'),
  ('off-4099200409245'),
  ('off-7610029201963'),
  ('off-7614800229016'),
  -- Choco Drink (keeps off-1227438738780)
  ('off-7610900157020'),
  ('off-4056489975243'),
  ('off-7613269349822'),
  ('off-7640143482641'),
  ('off-7613269880561'),
  -- Chorizo pikant (keeps off-7623186685484)
  ('off-7610845790115'),
  -- Chräbeli (keeps off-7617400030488)
  ('off-7617400033359'),
  -- Chutney Mango (keeps off-4260266394534)
  ('off-5021185041058'),
  -- Cini Minis (keeps off-3387390124101)
  ('off-3387390330045'),
  -- Cipollata (keeps off-7610029156164)
  ('off-7624841099387'),
  ('off-7613269132271'),
  -- Classic (keeps off-7610046016014)
  ('off-7610008711902'),
  -- Club Sandwich (keeps off-7611546028811)
  ('off-7613269250944'),
  -- Cocktail Sauce (keeps off-7613039643938)
  ('off-8715700411231'),
  -- Cocktailsauce (keeps off-7613312344026)
  ('off-7616600706766'),
  ('off-7610161138677'),
  -- Coconut Milk (keeps off-8851613106588)
  ('off-5021047105027'),
  ('off-8850367100026'),
  -- Coconut Water (keeps off-0898999000022)
  ('off-0016229914561'),
  ('off-5038862136174'),
  -- Coffee Espresso (keeps off-7623186271434)
  ('off-7623186684289'),
  -- Collagen Peptides (keeps off-4250519651149)
  ('off-4260422111425'),
  -- Colomba (keeps off-8002630010130)
  ('off-4099200180250'),
  -- Cookie (keeps off-7613269263937)
  ('off-7613312461952'),
  -- Cookie Dough (keeps off-0076840600021)
  ('off-20396176'),
  -- Cookies (keeps off-20080211)
  ('off-7610809116487'),
  -- Cookies & Cream (keeps off-7613312362105)
  ('off-3415581152111'),
  ('off-4061462759741'),
  -- Cordon bleu (keeps off-7617027888677)
  ('off-2184994006403'),
  ('off-2155198015409'),
  ('off-7610745622240'),
  ('off-7610227958737'),
  ('off-2113433005554'),
  ('off-7627536299215'),
  ('off-2414956007804'),
  -- Corn Flakes (keeps off-4061459814958)
  ('off-5059319014739'),
  -- Cornatur (keeps off-7623186343674)
  ('off-7623186683688'),
  -- Cornets (keeps off-7610029114089)
  ('off-7610807029680'),
  -- Cornichons (keeps off-7624841127974)
  ('off-7613269303039'),
  ('off-7611300027005'),
  ('off-20196301'),
  -- Cottage cheese (keeps off-7623186259456)
  ('off-7610029156188'),
  ('off-11953138'),
  ('off-7640101092172'),
  ('off-4099200019987'),
  ('off-7613269453000'),
  ('off-7613356330238'),
  ('off-7613413935352'),
  -- Cottage Cheese Nature (keeps off-7610029230277)
  ('off-7613404831168'),
  ('off-7610198092805'),
  ('off-7623186746055'),
  ('off-7613404831113'),
  -- Cottage Cheese Schnittlauch (keeps off-4009700032829)
  ('off-7613269771586'),
  -- Couscous (keeps off-7613379692115)
  ('off-7627536158512'),
  ('off-7613269349341'),
  ('off-7613312324158'),
  ('off-7611654070092'),
  ('off-3165440007082'),
  ('off-3223920720125'),
  ('off-8710671153302'),
  -- Couscous Salat (keeps off-4061458026840)
  ('off-4000915100570'),
  ('off-4061458026857'),
  -- Cranberries (keeps off-4099200023335)
  ('off-7613312261767'),
  ('off-7627534569365'),
  ('off-4008258296004'),
  ('off-7610184001224'),
  -- Cranberries getrocknet (keeps off-7613413839513)
  ('off-4009790008506'),
  -- Cranberry (keeps off-7613031085293)
  ('off-7613269688594'),
  -- Creamy Peanut Butter (keeps off-4004817000600)
  ('off-7906951310379'),
  -- Crémant Dunkle Schokolade (keeps off-7613312014295)
  ('off-7613312085769'),
  -- Creme fraiche (keeps off-7611654452126)
  ('off-7627536136060'),
  ('off-4099200423760'),
  ('off-7613404845097'),
  ('off-7627534970277'),
  ('off-4056489673613'),
  -- Creme Vanille (keeps off-7624841036566)
  ('off-7627537710269'),
  -- Cremiger Blüten Honig (keeps off-20276515)
  ('off-20940874'),
  -- Crevetten (keeps off-7610200427175)
  ('off-7613269359579'),
  ('off-7617027890632'),
  ('off-4019633157100'),
  ('off-2168135007009'),
  -- Crevetten Tail-on roh (keeps off-7613269164593)
  ('off-7613269304050'),
  -- Crispy (keeps off-5000159472029)
  ('off-4000281306507'),
  -- Crispy Backfisch (keeps off-7613312267479)
  ('off-7613269291381'),
  -- Crispy Poulet (keeps off-7610200074515)
  ('off-7613269302513'),
  -- Crispy Sticks (keeps off-7627534003746)
  ('off-7613036506854'),
  -- Crodino (keeps off-8000845005149)
  ('off-8000845800072'),
  -- Croissants (keeps off-3256540011526)
  ('off-4099200010397'),
  -- Croque Monsieur (keeps blv-14056)
  ('off-7613031535477'),
  -- Crunchy (keeps off-7612100907313)
  ('off-0016000502642'),
  -- Crunchy Honig (keeps off-7613269186014)
  ('off-7610121601319'),
  -- Crunchy Peanut Butter (keeps off-0722252387530)
  ('off-4004817003168'),
  -- Curry Balls (keeps off-7610845655803)
  ('off-7613312291085'),
  -- Curry Mango Sauce (keeps off-20524135)
  ('off-8715700411224'),
  -- Curry mild (keeps off-7610071221056)
  ('off-7624841336499'),
  -- Curry Paste grün (keeps off-4013200881405)
  ('off-7610848467212'),
  -- Curry Paste rot (keeps off-5021047101319)
  ('off-7610848467045'),
  -- Curry Sauce (keeps off-7610800230106)
  ('off-7613039643273'),
  ('off-7614200121958'),
  ('off-7611100064743'),
  ('off-4013320131893'),
  -- Currypaste (keeps off-7613312070994)
  ('off-8854404001055'),
  -- Currysauce (keeps off-7627536982483)
  ('off-7613269298953'),
  ('off-7616600706759'),
  -- Danke (keeps off-7613345867752)
  ('off-7613345867776'),
  -- Danone Actimel CLASSIC (keeps off-4009700074720)
  ('off-4009700074744'),
  -- Danone Actimel Erdbeere (keeps off-4009700074683)
  ('off-4009700074768'),
  -- Danone ACTIVIA ohne Zuckerzusatz & ohne Süßstoffe, doppelt Früchte Mango, Aprikose (keeps off-4009700040275)
  ('off-4009700042842'),
  -- Danone MyPRO+ 25g Protein 5100mg BCAAs Joghurtdrink Mango Geschmack (keeps off-4009700040503)
  ('off-4009700040534'),
  -- Danone MyPRO+ 25g Protein 5100mg BCAAs Vanille-Cookie Geschmack (keeps off-4009700039446)
  ('off-4009700041913'),
  -- Darkmilk (keeps off-7622201813598)
  ('off-7622201814038'),
  -- Datteln (keeps off-7610200040732)
  ('off-7640110721568'),
  ('off-7290002488316'),
  ('off-7610849249169'),
  ('off-7613312049174'),
  ('off-4008258293003'),
  -- Datteln entsteint (keeps off-7610200269270)
  ('off-4008258252017'),
  -- Dattelsirup (keeps off-4104420182844)
  ('off-7613356654655'),
  ('off-2200281320288'),
  -- Dattes (keeps off-7610815080154)
  ('off-7613269488330'),
  -- Delikatess Fleischkäse (keeps off-2168136003307)
  ('off-7610029027358'),
  ('off-2114415003100'),
  -- Delta-Jet (keeps off-7617400040531)
  ('off-76174315'),
  -- Demi-creme acidulee (keeps off-7613404008041)
  ('off-4099200418995'),
  -- Der scharfe Maxx (keeps off-2134271005001)
  ('off-2181236004753'),
  -- Der Schweizer Schokoladen Flan (keeps off-7612464723024)
  ('off-7612464723123'),
  -- Dessert preussen (keeps off-7613404007655)
  ('off-7616700002010'),
  -- Die Butter (keeps off-7610128737172)
  ('off-7610128739091'),
  -- Dijon Senf (keeps off-3036810201464)
  ('off-4020943230261'),
  -- Dinkel (keeps off-7610200058508)
  ('off-7610032056505'),
  -- Dinkel Kuchenteig (keeps off-4056489130178)
  ('off-7610846660769'),
  -- Dinkelflocken (keeps off-7612041100873)
  ('off-7610809017333'),
  -- Dinkelmehl (keeps off-4000742463022)
  ('off-7610846044149'),
  -- Dinkelmehl hell (keeps off-7610827598166)
  ('off-7610803010125'),
  -- Dinkelmehl Type 630 (keeps off-4104420021884)
  ('off-4388844160026'),
  -- Dinkelpops (keeps off-7613379578891)
  ('off-7617027867627'),
  ('off-7613312492611'),
  -- Dinkelvollkornmehl (keeps off-22162496)
  ('off-4104420140684'),
  -- Direktsaft Orange (keeps off-7610057010919)
  ('off-3045320104820'),
  -- Doppelrahm (keeps off-7623700002223)
  ('off-7623700002230'),
  ('off-7610411000334'),
  ('off-22139795'),
  -- Dörrbohnen (keeps off-7640128539353)
  ('off-7610800016540'),
  ('off-7640111750659'),
  ('off-7610200026729'),
  -- Dreikönigskuchen (keeps off-7623186207471)
  ('off-7613269479048'),
  ('off-4056489674931'),
  ('off-7613356123946'),
  -- Drink teilentrahmte Milch (keeps off-7627536196897)
  ('off-7610818285310'),
  ('off-7612300001811'),
  ('off-22129598'),
  -- Dunkle Schokolade (keeps off-7613287075253)
  ('off-7613269195504'),
  ('off-7613312420508'),
  -- Dunkle Schokolade 80% (keeps off-7613287034007)
  ('off-4260485630499'),
  -- Dürüm (keeps off-7640116361201)
  ('off-9002859053566'),
  -- Edamame (keeps off-7613312371190)
  ('off-7613312384589'),
  ('off-7613312125557'),
  -- Edel-Marzipan (keeps off-4085200400436)
  ('off-4001743024403'),
  -- Edelnussmischung (keeps off-4099200046723)
  ('off-7613269193999'),
  -- Egli Knusperli (keeps off-4061459675375)
  ('off-7613036506199'),
  -- Eier (keeps off-7610809052419)
  ('off-7610846944043'),
  ('off-7610849287727'),
  ('off-22125118'),
  ('off-4099200401355'),
  ('off-7610800047674'),
  ('off-4056489674467'),
  ('off-7613269008569'),
  ('off-7613269850038'),
  -- Eier Gekocht (keeps off-7613269850052)
  ('off-4056489781158'),
  ('off-7610999100280'),
  -- Eier-Ravioli (keeps off-7616800811291)
  ('off-7610198002491'),
  -- Eierschwämme (keeps off-7616800894218)
  ('off-7610800001003'),
  ('off-7613312051559'),
  -- Eierspätzli (keeps off-4099200422756)
  ('off-4056489313250'),
  ('off-7616800810409'),
  -- Eimalzin (keeps off-7613269299837)
  ('off-7613269299851'),
  ('off-7613312028797'),
  -- Eisbergsalat (keeps off-7610807156485)
  ('off-7627535890086'),
  ('off-7623186726118'),
  ('off-7613269227595'),
  ('off-7613404723968'),
  ('off-7610807076806'),
  ('off-7623186029677'),
  -- Emmentaler (keeps off-7617067038537)
  ('off-4061463957184'),
  ('off-4056489123767'),
  -- Emmentaler Mild (keeps off-2110013006000)
  ('off-4056489673927'),
  -- Energy Drink (keeps off-7613312376072)
  ('off-7640146940414'),
  ('off-7610029228519'),
  ('off-7610827887079'),
  -- Entrecote (keeps off-2817830001996)
  ('off-2817830001903'),
  -- Erbsen (keeps off-7613269197522)
  ('off-7613312371497'),
  ('off-7616800301259'),
  ('off-7614200008877'),
  ('off-7613312075630'),
  ('off-8711823194778'),
  ('off-5271128540470'),
  -- Erbsen & Karotten (keeps off-20595531)
  ('off-7614200009089'),
  -- Erbsen fein (keeps off-7613312111062)
  ('off-7613312249253'),
  ('off-7610800001119'),
  -- Erbsen mit Karotten (keeps off-7613269197447)
  ('off-7610827338250'),
  ('off-7613312093382'),
  -- Erbsen sehr fein (keeps off-7610849682034)
  ('off-4388860016871'),
  -- Erbsen und Karotten (keeps off-7610029025651)
  ('off-7613035802193'),
  ('off-4104420034181'),
  -- Erdbeer joghurt (keeps off-7610200379351)
  ('off-02072098'),
  ('off-76413445'),
  -- Erdbeer-Cranberry Fruchtaufstrich (keeps off-4099200160887)
  ('off-4061458047357'),
  -- Erdbeere (keeps off-7610200371034)
  ('off-7649993461011'),
  -- Erdbeere joghurt (keeps off-7613269540021)
  ('off-7610029117561'),
  ('off-4001743022676'),
  -- Erdbeeren (keeps off-7613312254615)
  ('off-7624841569217'),
  ('off-20130619'),
  ('off-7623186818530'),
  ('off-7614200115469'),
  ('off-4099200415444'),
  ('off-7613269293736'),
  -- Erdbeeren Konfitüre (keeps off-7613312340455)
  ('off-7613312509692'),
  -- Erdbeeren Konfitüre extra (keeps off-7613312029619)
  ('off-7613312406670'),
  -- Erdbeerjoghurt (keeps off-7613404906996)
  ('off-7640157790077'),
  -- Erdbeerkonfitüre (keeps off-7613312373743)
  ('off-7627536577122'),
  -- Erdbeersirup (keeps off-7610845301793)
  ('off-3052910056261'),
  -- ERDINGER Alkoholfrei (keeps off-4002103217275)
  ('off-4002103282020'),
  -- Erdnussbutter Crunchy (keeps off-4104420021242)
  ('off-7613312468203'),
  -- Erdnüsse (keeps off-7610200389725)
  ('off-7613269405344'),
  ('off-7617027775939'),
  ('off-7613269296522'),
  ('off-7627536138712'),
  ('off-4004980509009'),
  ('off-7613312145692'),
  ('off-4337185671739'),
  ('off-7627536694966'),
  ('off-7627535931383'),
  ('off-7610846922829'),
  -- Erdnussmus cremig (keeps off-4061461314286)
  ('off-4260744956087'),
  -- Essiggurken (keeps off-7610161121471)
  ('off-7610161121549'),
  ('off-40081427'),
  -- Falafel (keeps off-7613379181794)
  ('off-7613269476412'),
  ('off-4104420228184'),
  ('off-7613331210180'),
  ('off-4305615183336'),
  -- Falafelburger (keeps off-277624841865784500000145)
  ('off-7624841865784'),
  -- Farfalle (keeps off-20035716)
  ('off-8000139911132'),
  ('off-8076808060654'),
  ('off-4021851546642'),
  -- Farmer (keeps off-0383410285954)
  ('off-7613312285978'),
  -- Fasnachtschüechli (keeps blv-14060)
  ('off-7623186209123'),
  -- Feigen (keeps off-7627537959125)
  ('off-7610632050217'),
  ('off-4008258235003'),
  ('off-8697422390059'),
  -- Feigen getrocknet (keeps off-7610849249145)
  ('off-7613312024065'),
  -- Feigensenf (keeps off-4018462161401)
  ('off-7611631317356'),
  -- Feine Bitter Schokolade (keeps off-4305615677125)
  ('off-4104420222472'),
  -- Feinkristallzucker (keeps off-7610200340689)
  ('off-7610800010050'),
  ('off-7610302300604'),
  -- Feinste leckerli (keeps off-7613269979340)
  ('off-7616700020267'),
  -- Ferrero Rocher (keeps off-4008400163826)
  ('off-8000500032237'),
  -- Feta (keeps off-5202258226156)
  ('off-4100620076907'),
  ('off-7617027981729'),
  ('off-5201704054145'),
  ('off-7613269252597'),
  ('off-7623186463235'),
  ('off-3482015035470'),
  -- Fiori Spinaci e Ricotta (keeps off-3176132693463810002452)
  ('off-7613269346388'),
  -- Fischfond (keeps off-4009062800203)
  ('off-7613312063699'),
  -- Fischstäbchen (keeps off-7613312333464)
  ('off-24091169'),
  ('off-4019633172936'),
  ('off-9100000717722'),
  ('off-20155087'),
  ('off-4061459599787'),
  ('off-7613331362551'),
  ('off-7613312438701'),
  ('off-7613312241936'),
  ('off-7610026014542'),
  ('off-7613269178729'),
  ('off-7613331362704'),
  ('off-7613312265079'),
  -- Fish and Chips (keeps off-7630537402751)
  ('off-7630537402416'),
  -- Fladenbrot (keeps off-20686192)
  ('off-4012263032335'),
  ('off-7627536984425'),
  -- Flammkuchen (keeps off-4061464977877)
  ('off-3267060041030'),
  -- Flammkuchenteig (keeps off-7613404725023)
  ('off-7613269835868'),
  ('off-7627534393274'),
  ('off-7613331683038'),
  -- Flan Caramel (keeps off-7610200371133)
  ('off-7613331586926'),
  -- Flauder das original (keeps off-7640106030827)
  ('off-7617500192369'),
  -- Fleischerzeugnis (keeps off-2280950004558)
  ('off-7649993425976'),
  -- Fleischkäse Cordon-Bleu (keeps off-2111068008353)
  ('off-2172493008301'),
  -- Fleischkäse hauchdünn (keeps off-4099200410814)
  ('off-2167547003104'),
  -- Fleischkäse Sandwich (keeps off-7630048382320)
  ('off-7613269250821'),
  ('off-7610227897401'),
  -- Fleischkäse zum Backen (keeps off-0320005441081)
  ('off-2168293006050'),
  -- Fleischvögel (keeps off-2153225011752)
  ('off-2153225011400'),
  -- Flips (keeps off-7613312322048)
  ('off-20343132'),
  -- Florentin (keeps off-7617400034868)
  ('off-7610062088057'),
  -- Flûtes gesalzen (keeps off-7610029160666)
  ('off-7610200225986'),
  ('off-7616700128536'),
  -- Fondue (keeps off-7610200027535)
  ('off-7610200027542'),
  -- Forellenfilets Geräuchert (keeps off-7617027862707)
  ('off-7617027861465'),
  ('off-7613312031339'),
  -- Französische Salatsauce (keeps off-7616600751537)
  ('off-7640175280130'),
  ('off-4061459039764'),
  -- Französischer Weichkäse (keeps off-4337185788789)
  ('off-4099200019581'),
  -- Frelitta (keeps off-7613312242063)
  ('off-7613312496237'),
  -- French Dressing mit Kräutern (keeps off-7610809034880)
  ('off-20417918'),
  ('off-7613269268154'),
  ('off-7624841037518'),
  -- French fries (keeps off-7610800009641)
  ('off-7610849782925'),
  -- Frischback Butterweggli (keeps off-7613331139900)
  ('off-7616700027112'),
  -- Frischkäse (keeps off-4099200026251)
  ('off-22136961'),
  ('off-7627535653599'),
  ('off-7610200402400'),
  ('off-4000339335626'),
  -- Frischkäse Meerrettich (keeps off-4061458056199)
  ('off-7623186134852'),
  -- Frischkäse Natur (keeps off-4104420182080)
  ('off-7613269741398'),
  -- Frischkäse Nature (keeps off-7613331204806)
  ('off-7610845007107'),
  ('off-7613269252467'),
  -- Frohes fest (keeps off-4000539718823)
  ('off-4000539770203'),
  -- Fruchtcocktail (keeps off-7613312210994)
  ('off-7624841845199'),
  ('off-7610800005841'),
  ('off-7610029193961'),
  ('off-7615900143004'),
  ('off-7610827516849'),
  ('off-7610235004815'),
  ('off-7611471003822'),
  ('off-7610846832562'),
  -- Fruchtcocktail in Sirup (keeps off-7610200100146)
  ('off-7617027140591'),
  -- Früchtemischung (keeps off-7627537436398)
  ('off-7627537906365'),
  -- Fruchtsalat (keeps off-7613312383087)
  ('off-7613269429838'),
  -- Frühlingsrollen Mit Gemüse (keeps off-7613269301615)
  ('off-7613312077863'),
  -- Fusilli (keeps off-9100000715681)
  ('off-4021851549827'),
  ('off-8076800105988'),
  ('off-7613331580481'),
  ('off-7616700190618'),
  -- Gärtnersalat (keeps off-7610029163889)
  ('off-7623186787669'),
  -- Gebäck mit Mandeln (keeps off-7617027788717)
  ('off-8003170051317'),
  -- Gebäckmischung (keeps off-24044585)
  ('off-7610029228458'),
  ('off-7617400035834'),
  ('off-7613312451755'),
  -- Gebrannte Mandeln (keeps off-7629999011779)
  ('off-4008258067000'),
  ('off-4260654781694'),
  ('off-76174766'),
  -- Geflügel Bratwurst (keeps off-7610271787789)
  ('off-4056489781028'),
  -- Geflügel Lyoner (keeps off-2158497002453)
  ('off-4099200407609'),
  -- Geflügel-Bratwurst (keeps off-7610200044099)
  ('off-4099200404011'),
  -- Geflügel-Lyoner (keeps off-2249648002658)
  ('off-7627536405609'),
  -- Geflügelsalami (keeps off-7613269009252)
  ('off-2145406003557'),
  -- Gehackte Tomaten (keeps off-8004325600671)
  ('off-7610253034900'),
  -- Gehacktes mit Hörnli (keeps off-7613404764930)
  ('off-8720182985040'),
  ('off-7610582671418'),
  ('off-7610200383051'),
  -- Gelierzucker (keeps off-7610029117400)
  ('off-7624841886802'),
  ('off-7610278033605'),
  -- Gemischte Brötchen (keeps off-4311501630129)
  ('off-4099200009865'),
  -- Gemüse (keeps off-7613269296812)
  ('off-7613269297154'),
  ('off-7613269296485'),
  -- Gemüse Bouillon (keeps off-76111488)
  ('off-7613312037362'),
  -- Gemüsebällchen (keeps off-7610849069873)
  ('off-4056489313892'),
  ('off-7613404877968'),
  -- Gemüsebouillon (keeps off-7613312042489)
  ('off-8717163813706'),
  ('off-4104420137264'),
  ('off-7613312212295'),
  ('off-7613269197102'),
  ('off-7629999051089'),
  ('off-7610848390329'),
  -- Gemüsemischung (keeps off-7610029220346)
  ('off-7613312056028'),
  ('off-7613269273837'),
  ('off-7613312454947'),
  ('off-7610198078731'),
  ('off-7610807129380'),
  ('off-7613312058503'),
  ('off-7610845846720'),
  -- Gemüseplatte mit Eierschwämmen (keeps off-7614200009898)
  ('off-7610800001225'),
  -- Gemüseplatte Nach Jägerart (keeps off-7613269197607)
  ('off-7616800304175'),
  -- Gemüsesaft (keeps off-4104420072862)
  ('off-7627536607676'),
  -- Gemüsespätzli (keeps off-4335619079786)
  ('off-7613269259534'),
  -- Geschälte Tomaten (keeps off-7613269007234)
  ('off-7610800004967'),
  -- Geschnetzeltes (keeps off-7611889430616)
  ('off-4099200417172'),
  ('off-7640342963774'),
  ('off-2185927005852'),
  -- Getrocknete Feigen (keeps off-7613413823437)
  ('off-8681949676109'),
  -- Getrocknete Tomaten (keeps off-7613269197966)
  ('off-7613312378908'),
  ('off-8001010039303'),
  ('off-7611654924036'),
  -- Gewürzgurken (keeps off-7613269303114)
  ('off-4104420033863'),
  ('off-4021851590508'),
  ('off-7613269106418'),
  ('off-7610200301291'),
  ('off-20237479'),
  -- Gewürzschinken (keeps off-2111971006057)
  ('off-2111971006552'),
  ('off-2262816005350'),
  ('off-7623186296536'),
  -- Ginger Shot (keeps off-7640127858400)
  ('off-4056489028109'),
  -- Giotto Haselnuss (keeps off-4008400121925)
  ('off-4008400122625'),
  -- Glace Vanille (keeps off-7613030871811)
  ('off-7617400040203'),
  -- Glasnudeln (keeps off-4061463186027)
  ('off-7613312304044'),
  ('off-4020943132459'),
  ('off-5060237280458'),
  ('off-7613312434147'),
  -- Gnocchi (keeps off-4061459583380)
  ('off-4099200015484'),
  ('off-8008343201179'),
  ('off-24053471'),
  ('off-7613269848370'),
  ('off-7627536316462'),
  ('off-7613269259503'),
  -- Gnocchi mit Kartoffeln (keeps off-7613331452191)
  ('off-7617027747684'),
  -- Goji Beeren (keeps off-7610491933348)
  ('off-7640101980615'),
  -- Gojibeeren (keeps off-4104420174009)
  ('off-4250038940397'),
  -- Goldbären (keeps off-9002975301268)
  ('off-9002975302838'),
  -- Goldhase (keeps off-4000539625923)
  ('off-4000539671005'),
  ('off-4000539671203'),
  -- Goldhirse (keeps off-7610809003558)
  ('off-4061459235517'),
  -- Gouda (keeps off-7613404572160)
  ('off-4099200177465'),
  ('off-4056489012801'),
  ('off-4061459801491'),
  -- Granatapfel (keeps off-7613269636427)
  ('off-4016249010836'),
  -- Grapefruit (keeps off-7610057023247)
  ('off-76137655'),
  -- Greek Salad (keeps off-7624841862042)
  ('off-4335619079649'),
  -- Green Thai Chicken Curry mit Basmatireis (keeps off-7613379126672)
  ('off-7613356265998'),
  -- Griechische Oliven (keeps off-7610200317513)
  ('off-7612188001804'),
  ('off-7610807100709'),
  ('off-7613312015940'),
  -- Griessbrei (keeps off-7627535391064)
  ('off-7627536572783'),
  ('off-7611471003532'),
  -- Grillbratwurst (keeps off-7610029157369)
  ('off-20020101'),
  -- Grillschnecken mix (keeps off-2161588008753)
  ('off-7610162360718'),
  -- Grüne Bohnen (keeps off-7610200244598)
  ('off-4056489673316'),
  ('off-7610849682010'),
  ('off-7617027915915'),
  ('off-7610200098450'),
  -- Grüne Bohnenkerne (keeps off-7610200066947)
  ('off-7610800972105'),
  ('off-7627534327088'),
  -- Grüne Linsen (keeps off-7613413850280)
  ('off-7617027945356'),
  ('off-7613269317319'),
  -- Grüne Oliven (keeps off-4002015526700)
  ('off-4099200011592'),
  ('off-9100000078762'),
  ('off-7610200206701'),
  ('off-7613379116864'),
  -- Guacamole Avocado Dip (keeps off-7613413748167)
  ('off-7610849111770'),
  -- Guacamole Dip (keeps off-7613312425688)
  ('off-7624841053747'),
  -- Gulasch (keeps off-7611100065283)
  ('off-7613312337585'),
  -- Gummibärli (keeps off-7613312036143)
  ('off-7610167640242'),
  ('off-7617027956819'),
  -- Gurken (keeps off-7617027852241)
  ('off-8711200389742'),
  ('off-7611300033006'),
  ('off-8711200369164'),
  ('off-7610029026559'),
  ('off-7610198000541'),
  ('off-7610809035467'),
  -- Gurkentopf (keeps off-20004354)
  ('off-4061462898488'),
  -- Gyoza (keeps off-7627534900045)
  ('off-7627535872648'),
  -- Hackbraten (keeps off-7627536987419)
  ('off-7627536986399'),
  ('off-2186370010059'),
  ('off-7616800213019'),
  ('off-7610475646998'),
  -- Hackfleisch (keeps off-2172298006304)
  ('off-2171278007355'),
  ('off-7617100217752'),
  ('off-4056489553915'),
  -- Hackfleisch Gemischt (keeps off-2156114006556)
  ('off-2185333006306'),
  ('off-4056489553946'),
  ('off-2185353007505'),
  ('off-7610271658348'),
  -- Hackspinat (keeps off-7613269270997)
  ('off-7616800810508'),
  -- Hacktätschli (keeps off-7623186461750)
  ('off-7610227963014'),
  ('off-4061464675032'),
  -- Hafer Cuisine (keeps off-4015533048821)
  ('off-4104420241176'),
  ('off-7394376616952'),
  ('off-4016249207007'),
  ('off-4038375025065'),
  -- Hafer Drink (keeps off-7627536137326)
  ('off-4305615719634'),
  ('off-7611654495772'),
  -- Hafer Drink Calcium (keeps off-4104420094949)
  ('off-7613404725481'),
  -- Hafer Drink Natur (keeps off-4104420186279)
  ('off-4104420260139'),
  -- Haferdrink (keeps off-7627538019064)
  ('off-4311501642146'),
  -- Haferflakes (keeps off-7613312271339)
  ('off-7624841051361'),
  -- Haferflocken fein (keeps off-4061462266935)
  ('off-7612041101092'),
  ('off-7610027015661'),
  -- Haferflocken Großblatt (keeps off-4021851430729)
  ('off-4058172307423'),
  -- Haferflöckli (keeps off-7610803008719)
  ('off-7611100055949'),
  -- Hafernüssli (keeps off-7617027053440)
  ('off-7613312407004'),
  ('off-7610809017524'),
  -- Hafervollkornflocken fein (keeps off-7613312044094)
  ('off-7613312418277'),
  -- Hagelzucker (keeps off-7610827499722)
  ('off-7613331622549'),
  ('off-7617027869157'),
  -- Halbfettquark (keeps off-4056489673538)
  ('off-7630018676527'),
  ('off-2099460050012'),
  -- Halbhartkäse (keeps off-4335619231689)
  ('off-7623186153662'),
  -- Halbrahm (keeps off-76108143)
  ('off-7613269402299'),
  ('off-7610900287529'),
  ('off-7627534345655'),
  ('off-4099200407227'),
  ('off-7613269880622'),
  ('off-7612300012732'),
  ('off-7616600702539'),
  -- Halbweissmehl (keeps off-4099200405476)
  ('off-7610809018910'),
  -- Hamburger (keeps bls-Y911060)
  ('off-7610200058560'),
  ('off-7613269166191'),
  -- Hamburger Buns (keeps off-7613379965561)
  ('off-7627536364364'),
  -- Hanfsamen (keeps off-7613312519653)
  ('off-4019581800721'),
  ('off-4019339431054'),
  -- Haribo Tropifrutti (keeps off-4001686322963)
  ('off-4001686367346'),
  -- Hartbonbons (keeps off-7610846667522)
  ('off-7613269332640'),
  -- Hartweizengriess (keeps off-7613312078808)
  ('off-7610200047106'),
  ('off-7610800019695'),
  -- Haselnuss Joghurt (keeps off-7610029209136)
  ('off-22016102'),
  ('off-7610900869954'),
  ('off-7640134521328'),
  -- Haselnüsse (keeps off-7610200010414)
  ('off-7610029159165'),
  ('off-7613269193067'),
  ('off-7613312143452'),
  ('off-7610184036806'),
  ('off-7613312423004'),
  ('off-7610198073408'),
  ('off-4061462389535'),
  ('off-4099200433189'),
  ('off-7613312132029'),
  ('off-7613312303573'),
  -- Haselnüsse ganz (keeps off-7610807015850)
  ('off-7610800018513'),
  -- Haselnüsse gemahlen (keeps off-7610200319234)
  ('off-7613312016176'),
  ('off-7610029177916'),
  ('off-7610184037506'),
  ('off-01434781'),
  ('off-7610818970292'),
  ('off-7613356855328'),
  ('off-7610845460636'),
  -- Haselnusskerne (keeps off-4388840215713)
  ('off-4008258100011'),
  ('off-4104420024984'),
  ('off-4311501367599'),
  ('off-7610200254252'),
  -- Haus-Dressing (keeps off-7610848865209)
  ('off-7627534512262'),
  -- Hefe-Nussgipfel (keeps off-7611075003211)
  ('off-7613269291022'),
  -- Heidelbeere (keeps off-3608580791577)
  ('off-3273227483261'),
  -- Heidelbeeren (keeps off-7610807039566)
  ('off-7623186826061'),
  ('off-3388600000314'),
  -- Herbstchüechli (keeps off-7617400038460)
  ('off-7627537001343'),
  -- Herzkirschen (keeps off-7610200086341)
  ('off-7610848329077'),
  -- High protein (keeps off-7610029206418)
  ('off-7627534916824'),
  ('off-7610900237654'),
  -- High Protein Mix (keeps off-4099200435459)
  ('off-7624841841856'),
  -- High Protein Mousse Choco (keeps off-7623186169304)
  ('off-7623186685668'),
  ('off-7627535655869'),
  -- High Protein Mozzarella (keeps off-4056489551973)
  ('off-7613404517970'),
  -- High Protein Pudding Macchiato (keeps off-7623186154454)
  ('off-7623186682940'),
  -- Himbeer sirup (keeps off-7613356165267)
  ('off-7640107813283'),
  ('off-7624841521567'),
  -- Himbeere (keeps off-7610849226757)
  ('off-7611471004027'),
  ('off-7617027140744'),
  ('off-3608580791560'),
  ('off-7613312373729'),
  -- Himbeeren (keeps off-7613269184966)
  ('off-7613312483336'),
  ('off-7623186818479'),
  ('off-20130626'),
  ('off-5906974015437'),
  ('off-7610800997856'),
  ('off-7610849101818'),
  -- Himbeersirup (keeps off-7627534344030)
  ('off-7613312265123'),
  ('off-7613269366614'),
  ('off-7617500197043'),
  ('off-4056489477396'),
  ('off-7624841521581'),
  ('off-7613331206138'),
  -- Hinterschinken gekocht, geräuchert (keeps off-2153370004050)
  ('off-2170531004452'),
  -- Hirsch Schnitzel (keeps off-0036270002017)
  ('off-2186299011458'),
  -- Hirseflocken (keeps off-7610200074201)
  ('off-7613312074671'),
  ('off-7613331111388'),
  -- Hirtenkäse (keeps off-4061463936608)
  ('off-4104420231498'),
  -- Hirz brombeer vanille (keeps off-7613196005068)
  ('off-7613196005273'),
  -- Hirz Hüttenkäse (keeps off-7613196008755)
  ('off-7610100504686'),
  -- Hobelfleisch (keeps off-7623186487446)
  ('off-7627536196354'),
  ('off-0640595024281'),
  ('off-7623186192708'),
  ('off-2107741009052'),
  -- Holunderblütensirup (keeps off-20937805)
  ('off-7640107810206'),
  -- Holzfällerbrot (keeps off-7616700242980)
  ('off-7613331560940'),
  -- Holzfällersteak Gewürzt (keeps off-2153326004356)
  ('off-2276945006805'),
  -- Honig (keeps off-7624841548021)
  ('off-7627538302548'),
  ('off-7610827900426'),
  ('off-4061461286132'),
  ('off-4099200177984'),
  ('off-4061462236952'),
  ('off-7610184050604'),
  -- Hörnli (keeps off-7610849859788)
  ('off-7613269182085'),
  ('off-7610029031058'),
  ('off-7610849861200'),
  ('off-28000266'),
  ('off-8076809574334'),
  ('off-7624841314183'),
  ('off-7610029223378'),
  -- Hörnli glutenfrei (keeps off-8076809545488)
  ('off-7613312208700'),
  -- Hörnli Gross (keeps off-7613312033562)
  ('off-7613312074749'),
  -- Hörnli mit Gehacktem (keeps off-7613331818294)
  ('off-7610227892314'),
  ('off-7627535659577'),
  -- Hühnernuggets (keeps off-7613331107824)
  ('off-7613331424952'),
  -- Hummus Chips (keeps off-4099200198934)
  ('off-9002859111839'),
  -- Hummus Natur (keeps off-4061458024068)
  ('off-4104420229761'),
  -- Hummus Nature (keeps off-7623186172861)
  ('off-7623186172953'),
  -- Hüttenkäse (keeps off-7627535668326)
  ('off-7613196007451'),
  ('off-7640134523087'),
  ('off-7623186581588'),
  -- Hüttensuppe (keeps off-7613269375456)
  ('off-7613032572280'),
  -- Huusbrot (keeps off-7616700240146)
  ('off-7616700275087'),
  -- Ice Sandwich (keeps off-7613312451526)
  ('off-7617027779593'),
  -- Ice Tea Alpenkräuter (keeps off-7640107812866)
  ('off-28509042'),
  -- Ice tea lemon (keeps off-7610029145861)
  ('off-7627535684333'),
  ('off-7610338924157'),
  -- Ice tea pfirsich (keeps off-7613312031391)
  ('off-7613312302248'),
  ('off-7610848065050'),
  -- ICE TEA Zitrone (keeps off-76168352)
  ('off-7616800204086'),
  ('off-7617400050295'),
  -- Ingwer Shot (keeps off-4056489336136)
  ('off-4015533041044'),
  -- JASMIN Parfümreis (keeps off-7610200059239)
  ('off-7613312064139'),
  -- Jasmin Reis (keeps off-4335619259553)
  ('off-12145188'),
  ('off-4013847600018'),
  ('off-5021047101227'),
  -- Joghurt (keeps off-7610100725265)
  ('off-20550271'),
  ('off-7613379916624'),
  ('off-5603722517570'),
  ('off-4313920014559'),
  ('off-7622300220938'),
  ('off-7616500936133'),
  -- Joghurt - Erdbeere (keeps off-7610029214680)
  ('off-7613404539064'),
  -- Joghurt Aprikose (keeps off-28509646)
  ('off-0640157790084'),
  ('off-7613404394809'),
  ('off-4099200406992'),
  -- Joghurt Erdbeere (keeps off-7610900044870)
  ('off-7616600708937'),
  ('off-7613269779582'),
  -- Joghurt Heidelbeer (keeps off-7640134521052)
  ('off-20436933'),
  -- Joghurt Heidelbeere (keeps off-22138767)
  ('off-7613404065044'),
  ('off-28509622'),
  -- Joghurt Himbeer (keeps off-7640157790114)
  ('off-7610900045099'),
  -- Joghurt Himbeere (keeps off-7640134521076)
  ('off-7613404381526'),
  -- Joghurt Kirsche (keeps off-7610029209181)
  ('off-7640157790121'),
  -- Joghurt Kirschen (keeps off-7613269371779)
  ('off-7610900036097'),
  -- Joghurt Mandarine (keeps off-4099200406893)
  ('off-7613404538913'),
  -- Joghurt mit Vanille (keeps off-22016386)
  ('off-7613269539957'),
  -- Joghurt Mocca (keeps off-7640134521106)
  ('off-4305250007103'),
  ('off-76406232'),
  -- Joghurt Mokka stichfest (keeps off-7613404845806)
  ('off-4099200406725'),
  -- Joghurt Natur (keeps off-7611654107422)
  ('off-76406225'),
  -- Joghurt waldbeeren (keeps off-7610848285618)
  ('off-7613404038420'),
  -- Jogurt (keeps off-22016133)
  ('off-7613379762597'),
  ('off-76232763'),
  -- Jogurt Aprikose (keeps off-7627537177338)
  ('off-76413414'),
  -- Jogurt Birchermüesli (keeps off-7610807063585)
  ('off-7613331923646'),
  -- Jogurt Erdbeer (keeps off-7610900126941)
  ('off-20245634'),
  -- Jogurt Erdbeere (keeps off-7610807063721)
  ('off-7613356254022'),
  -- Jogurt Himbeere (keeps off-7613356254596)
  ('off-7610900042937'),
  -- Jogurt Mango-Passionsfrucht (keeps off-7613379760791)
  ('off-7613331590008'),
  -- Jogurt Mokka (keeps off-7610800977445)
  ('off-7627534721299'),
  -- Jogurt Natur (keeps off-4002566003118)
  ('off-7627537257504'),
  -- Jogurt Nature (keeps off-7640121910029)
  ('off-7610253392406'),
  ('off-7610800095408'),
  -- Jogurt Schokolade (keeps off-7610809103951)
  ('off-22136909'),
  -- Jogurt Vanille (keeps off-7613331817990)
  ('off-7613331818454'),
  -- Jogurtpur Himbeer (keeps off-7610900045976)
  ('off-7610900085309'),
  -- Johannisbeeren (keeps off-7613312032510)
  ('off-7640109230415'),
  -- Junge Erbsen (keeps off-9003740096792)
  ('off-3083680037303'),
  ('off-4099200011363'),
  ('off-20324957'),
  -- Jungsalat (keeps off-7610807076967)
  ('off-7613331275288'),
  -- Jus d'orange (keeps off-28004134)
  ('off-7613379769046'),
  -- Kaffee (keeps off-8480010254174)
  ('off-3273227485241'),
  -- Kaffeerahm UHT (keeps off-4099200417158)
  ('off-7610900113743'),
  -- Kakao (keeps off-4061462826504)
  ('off-4099200097473'),
  ('off-7617400049152'),
  ('off-7610807015010'),
  -- Kakaogetränk (keeps off-7610846863221)
  ('off-7613269188193'),
  ('off-7613312092552'),
  -- Kakaopulver (keeps off-7613269262107)
  ('off-7613331180537'),
  -- Kalbfleischerzeugnis gekocht mit Thonsauce (keeps off-2112710009650)
  ('off-2160550007756'),
  -- Kalbsgeschnetzeltes (keeps off-2171922011707)
  ('off-2165611012700'),
  ('off-2840914002602'),
  ('off-7616800213033'),
  -- Kapern (keeps off-4388844104600)
  ('off-7610849660216'),
  ('off-4061461681326'),
  ('off-7611300022901'),
  -- Kapernäpfel (keeps off-7610849660254)
  ('off-7613379714039'),
  ('off-4388844017320'),
  -- Karotte Orange Ingwer Smoothie (keeps off-7610463006230)
  ('off-7610463008203'),
  -- Karotten (keeps off-7610632995594)
  ('off-7627538398510'),
  ('off-7610029140507'),
  -- Karotten geraffelt (keeps off-7617027855389)
  ('off-7617027632690'),
  ('off-7623186787577'),
  -- Karottensalat (keeps off-7613269284444)
  ('off-4056489078388'),
  -- Kartoffelbrot mit Nüssen (keeps off-7613331118226)
  ('off-7616700037692'),
  ('off-7616700116595'),
  -- Kartoffeln (keeps off-7610632956038)
  ('off-7640109175020'),
  ('off-7610200318800'),
  ('off-7613269053132'),
  ('off-7610632991886'),
  ('off-7610632991909'),
  -- Kartoffeln festkochend (keeps off-7610200318794)
  ('off-7613269055341'),
  -- Kartoffeln Raclette (keeps off-7613269084884)
  ('off-7627534319748'),
  -- Kartoffelpüree (keeps off-7616800822532)
  ('off-4099200014753'),
  -- Kartoffelsalat (keeps off-7610227929782)
  ('off-7624841866125'),
  ('off-7624841867986'),
  ('off-7613269763604'),
  -- Kartoffelstock (keeps off-7616800814674)
  ('off-7613356140332'),
  ('off-7616800430324'),
  ('off-7615200021682'),
  ('off-4099200402826'),
  -- Kartoffelstock - Instant (keeps off-7613312016602)
  ('off-7616800430379'),
  -- Käse-Plätzli (keeps off-7610200341389)
  ('off-7613269184560'),
  -- Käseaufschnitt (keeps off-22116727)
  ('off-4099200177519'),
  -- Käsekuchenmischung (keeps off-7623186745126)
  ('off-7610029161311'),
  -- Katzenzüngli (keeps off-7610849682515)
  ('off-7616500654747'),
  -- Kefen (keeps off-7610849098002)
  ('off-7613269313915'),
  -- Kerne & Nüsse (keeps off-7613312427842)
  ('off-7617027923712'),
  -- Kichererbsen (keeps off-3083681003949)
  ('off-4104420034167'),
  ('off-20468583'),
  ('off-4002015002891'),
  ('off-8717496900142'),
  ('off-4006040552499'),
  ('off-4099200012018'),
  ('off-9002859041242'),
  ('off-8000320030093'),
  ('off-8001440001376'),
  ('off-7613312048467'),
  ('off-7613331017925'),
  ('off-7610200042804'),
  ('off-7610027001275'),
  ('off-7610809035559'),
  -- Kichererbsen getrocknet (keeps off-7613312064092)
  ('off-4104420022683'),
  -- Kidney Bohnen (keeps off-7624841826488)
  ('off-3083680009508'),
  ('off-4006040176367'),
  -- Kinder Riegel (keeps off-4008400221021)
  ('off-4008400221823'),
  ('off-8000500245156'),
  -- Kinder Überraschung Maxi (keeps off-4008400230726)
  ('off-4008400231327'),
  -- Kirsche mit Rahm (keeps off-7613269878186)
  ('off-7613404555910'),
  -- Kirschen (keeps off-7613312451304)
  ('off-7617027631174'),
  ('off-7640109230309'),
  -- Kirschstengeli (keeps off-7610400061049)
  ('off-7610400061063'),
  -- KitKat Chunky (keeps off-3800020420003)
  ('off-3800020488652'),
  -- Knäckebrot (keeps off-7617027056267)
  ('off-7617027056243'),
  ('off-4260487725100'),
  -- Knoblauch & Kräuter der Provence (keeps off-3073780410830)
  ('off-3073781091106'),
  -- Knoblauch Sauce (keeps off-7617027815642)
  ('off-7640154480032'),
  ('off-8715700115801'),
  -- Knoblauchgurken (keeps off-40804279)
  ('off-7617027853095'),
  -- Knoblauchwurst (keeps off-7617027945783)
  ('off-2126819004508'),
  -- Knoppers (keeps off-4035800488808)
  ('off-40358802'),
  -- Knusperbrot Buchweizen (keeps off-4260012974416)
  ('off-3380380100802'),
  -- Knuspermüesli Nature (keeps off-7611654638476)
  ('off-7613356153639'),
  -- Koffeerahm (keeps off-22139733)
  ('off-22140920'),
  -- Kokos geraspelt (keeps off-4104420015289)
  ('off-7613413794300'),
  -- Kokosblütenzucker (keeps off-2200216125964)
  ('off-4104420214118'),
  ('off-7627537981294'),
  ('off-7640184690074'),
  -- Kokosmilch (keeps off-8851613101378)
  ('off-8851613101385'),
  ('off-4260541683889'),
  ('off-5035139217604'),
  ('off-8850813507010'),
  ('off-4056489367611'),
  ('off-4104420034327'),
  ('off-4044019390017'),
  ('off-5021047105300'),
  ('off-4006040538196'),
  -- Kokosnuss Milch (keeps off-4099200011271)
  ('off-5021047000087'),
  -- Kokosraspel (keeps off-7610200010544)
  ('off-7610184082209'),
  ('off-4061459445213'),
  -- Kokosraspeln (keeps off-7627534352172)
  ('off-7613312262924'),
  -- Kokosschnitze (keeps off-7613312053133)
  ('off-7613413840779'),
  -- Konfitüre Erdbeeren (keeps off-12116270)
  ('off-7613331578747'),
  -- Kong Strong Wild Power (keeps off-4056489099932)
  ('off-20917647'),
  -- Kopfsalat (keeps off-7613269460718)
  ('off-7613269138006'),
  ('off-7627534612115'),
  -- Krausnudeln (keeps off-7616700014815)
  ('off-7613312314692'),
  -- Kräuterzucker (keeps off-7610167616414)
  ('off-76107986'),
  -- Kristallzucker (keeps off-7610807026566)
  ('off-7613379673077'),
  ('off-7624841601368'),
  ('off-7610029184143'),
  -- Kroketten (keeps off-7616800909103)
  ('off-20694524'),
  -- Krustenkranz (keeps off-7616700037661)
  ('off-7616700010312'),
  ('off-7627536160348'),
  -- Kuchenglasur dunkel (keeps off-7613312295793)
  ('off-7613331182319'),
  ('off-4000521010041'),
  -- Kuchenglasur hell (keeps off-7613331181275)
  ('off-7616500270947'),
  -- Kuchenteig (keeps off-7613404201626)
  ('off-7610807057287'),
  ('off-7613404201206'),
  ('off-4056489418429'),
  ('off-7613404053683'),
  ('off-7623186247880'),
  ('off-7613035308107'),
  ('off-76167966'),
  ('off-7613331960979'),
  ('off-7613269684282'),
  -- Kürbis (keeps off-7610849266951)
  ('off-7613269296997'),
  ('off-7613331142009'),
  -- Kürbisspätzli (keeps off-7610846387338)
  ('off-4056489313274'),
  ('off-7610849933792'),
  -- Kürbissuppe (keeps off-7611100428439)
  ('off-7613312052013'),
  ('off-7623186169182'),
  ('off-7640105564804'),
  -- Kuvertüre zartbitter (keeps off-4000521007027)
  ('off-4104420221918'),
  -- Lachgummi (keeps off-4014400901818)
  ('off-4014400927214'),
  -- Lachgummi Sauer (keeps off-4014400915778)
  ('off-4014400926910'),
  -- Lachs (keeps off-7613269672555)
  ('off-7610807001549'),
  ('off-4260372060736'),
  -- Lachsfilet mit Haut (keeps off-7623186189623)
  ('off-7627534906658'),
  -- Lamm Minispiess mariniert (keeps off-2111008010651)
  ('off-2114345010650'),
  -- Lammfilet (keeps off-2812610001944)
  ('off-2812610002385'),
  ('off-2157991018700'),
  ('off-2802067003349'),
  -- Lammnierstück (keeps off-2290131015907)
  ('off-2150382011007'),
  ('off-2081459002355'),
  ('off-2240170013655'),
  -- Lammnierstück mariniert (keeps off-2186457010101)
  ('off-2186457012150'),
  -- Landrauchschinken (keeps off-0581082006055)
  ('off-2110944008555'),
  ('off-4335619254404'),
  ('off-7613292370718'),
  ('off-7627536550484'),
  ('off-7617027944021'),
  ('off-2108013008650'),
  -- Landschinken (keeps off-4270004636222)
  ('off-7610849646890'),
  -- Langkornreis (keeps off-7627536249760)
  ('off-7624841519885'),
  ('off-7610200010902'),
  ('off-7611654653769'),
  ('off-7613269116523'),
  ('off-7613312524695'),
  ('off-5410673727947'),
  ('off-7617027923828'),
  ('off-3487400006301'),
  -- Lasagne (keeps off-7613312270844)
  ('off-4061458073134'),
  ('off-8076809523738'),
  ('off-8008343201780'),
  ('off-7613312066522'),
  ('off-7623186175794'),
  -- Lasagne Alla Bolognese (keeps off-7616800833286)
  ('off-7610809022856'),
  ('off-8001665117036'),
  -- Lasagne Bolognese (keeps off-7627534406554)
  ('off-4061461691547'),
  ('off-7610029211597'),
  ('off-7613404859179'),
  ('off-7610026121219'),
  ('off-4099200163659'),
  ('off-7610029209259'),
  ('off-20324919'),
  -- Lasagne mit friches Teig (keeps off-7610695000525)
  ('off-7610695003489'),
  -- Lassi mango (keeps off-7613331647160)
  ('off-4038678020538'),
  ('off-7617027983570'),
  -- Latte espresso (keeps off-22133267)
  ('off-4061459897586'),
  -- Lauch (keeps off-7613269296935)
  ('off-7613269297116'),
  -- Lebkuchen Herzli (keeps off-7617400030808)
  ('off-7617400039016'),
  -- Lebkuchengebäck mit Mandelfüllung (keeps off-7616700013504)
  ('off-7616700026627'),
  -- Lemon Soda (keeps off-8050327350038)
  ('off-8057192001430'),
  -- Lindor (keeps off-7610400113175)
  ('off-8003340098678'),
  -- Lindor Extra Dunkel (keeps off-7610400074513)
  ('off-8003340091273'),
  -- Linguine (keeps off-7613413576036)
  ('off-8000139929717'),
  -- Linsen (keeps off-3083680002752)
  ('off-4099200012247'),
  ('off-7616800800189'),
  ('off-7613312404614'),
  ('off-7623186156564'),
  ('off-7610027000544'),
  -- Linsen an Tomatensauce (keeps off-7613312404638)
  ('off-7616800823485'),
  -- Linsen Mit Gemüse (keeps off-7613312064818)
  ('off-7613312162446'),
  -- Linsen mit Speck (keeps off-7616800800165)
  ('off-7616800800172'),
  ('off-7627535159336'),
  -- Linsen rot (keeps off-7613312432334)
  ('off-7613379938725'),
  ('off-7610807022230'),
  -- Linsensalat (keeps off-7613404179505)
  ('off-7611654749981'),
  ('off-7613269372158'),
  ('off-4061458026819'),
  -- Linzer Torte (keeps off-7613269762607)
  ('off-7616700005196'),
  ('off-28104209'),
  -- Linzer Törtli (keeps off-7613269762621)
  ('off-7616700128451'),
  ('off-7610800014249'),
  -- Linzertörtli (keeps off-7616700169058)
  ('off-7616700143737'),
  ('off-7611075002412'),
  -- Lütticher Waffel (keeps off-5410495002000)
  ('off-5412794957524'),
  -- Lütticher Waffeln (keeps off-5410126002003)
  ('off-7613413877423'),
  -- Luzerner Birnenweggen (keeps off-7613269591733)
  ('off-7613269592358'),
  -- Lychees (keeps off-7610200017536)
  ('off-7613356113770'),
  -- Macadamia (keeps off-7613312316887)
  ('off-7613413835706'),
  -- Macadamia creme (keeps off-4039057404178)
  ('off-4104420055667'),
  -- Macadamianüsse (keeps off-4056489498377)
  ('off-7613312280287'),
  ('off-7613269194033'),
  ('off-7613413839551'),
  -- Madeleines mit Schokoladenstückchen (keeps off-3178530407938)
  ('off-7616700012811'),
  -- Magermilch (keeps off-7613404536094)
  ('off-7610848361206'),
  ('off-7610900259007'),
  ('off-7610029156607'),
  ('off-7616600708272'),
  ('off-20227586'),
  -- Magerquark (keeps off-7624841549578)
  ('off-4056489478379'),
  ('off-16788446'),
  ('off-4061463946980'),
  ('off-7610100507151'),
  ('off-7623186272264'),
  ('off-7623186571138'),
  ('off-7613356136199'),
  ('off-7610029141528'),
  ('off-7623186258404'),
  ('off-7613404013465'),
  ('off-7613100171759'),
  ('off-7616600709873'),
  -- Magerquark laktosefrei (keeps off-7613404892411)
  ('off-7640106981082'),
  -- Magerquark nature (keeps off-7617027977692)
  ('off-7627534995591'),
  ('off-7623186652806'),
  -- Mailänderli (keeps off-7617400033007)
  ('off-7610062032128'),
  ('off-7617400030297'),
  ('off-7617400038767'),
  -- Mais (keeps off-7613312308806)
  ('off-3083680041706'),
  ('off-7613312509012'),
  ('off-0024000014430'),
  ('off-4099200011202'),
  ('off-7627534181079'),
  ('off-7610800993629'),
  ('off-7610845545951'),
  -- Maiskölbchen (keeps off-7611300345321)
  ('off-23230286'),
  ('off-20004262'),
  ('off-4007415006906'),
  ('off-7610200340207'),
  ('off-7613269132295'),
  ('off-7613356467521'),
  -- Maiskörner (keeps off-7617027916011)
  ('off-7617027934671'),
  ('off-7613312305690'),
  ('off-7610029028652'),
  ('off-7610200012081'),
  -- Maismehl (keeps off-4104420016767)
  ('off-7624841351003'),
  -- Maissalat (keeps off-7613269284383)
  ('off-7610339081415'),
  -- Maiswaffeln (keeps off-4104420054004)
  ('off-4061458066167'),
  ('off-7613312252994'),
  ('off-7624841917384'),
  ('off-9310140282534'),
  -- Maltesers (keeps off-5000159031103)
  ('off-5000159555500'),
  -- Maltesers Maxi Pack (keeps off-5000159555524)
  ('off-5000159437967'),
  -- Maltodextrin (keeps off-4260374999645)
  ('off-7640153565013'),
  -- Mandel Drink (keeps off-20050894)
  ('off-4104420221253'),
  -- Mandeldrink (keeps off-4061462462122)
  ('off-4061462462344'),
  -- Mandelkerne (keeps off-4251032600652)
  ('off-7613312022771'),
  -- Mandeln (keeps off-4260042317047)
  ('off-7613413835737'),
  ('off-7624841036849'),
  ('off-4305615352770'),
  ('off-4305615678320'),
  ('off-4008258065013'),
  ('off-7627535315220'),
  ('off-7610818990504'),
  ('off-20145316'),
  ('off-7613312403587'),
  ('off-7613312156957'),
  ('off-7610029146547'),
  ('off-7640147651036'),
  ('off-7610200010445'),
  ('off-7640175010195'),
  ('off-7613269193142'),
  -- Mandeln ganz (keeps off-7610800018544)
  ('off-7610198031132'),
  ('off-4099200022000'),
  -- Mandeln ganze Kerne (keeps off-4388840215218)
  ('off-24004992'),
  -- Mandeln gehackt (keeps off-4311501358504)
  ('off-4000521007102'),
  -- Mandeln gehobelt (keeps off-7610818990474)
  ('off-7627535934629'),
  -- Mandeln gemahlen (keeps off-7610818993345)
  ('off-7610845458800'),
  ('off-7610200319241'),
  ('off-7613269193043'),
  ('off-7613312016152'),
  -- Mandeln geröstet (keeps off-7613312381328)
  ('off-4099200420622'),
  -- Mandeln karamellisiert (keeps off-7613331819444)
  ('off-7616500130319'),
  -- Mango (keeps off-7649993461042)
  ('off-4061461620868'),
  ('off-7610849567966'),
  ('off-4106060049372'),
  ('off-7613269303640'),
  ('off-7624841297523'),
  ('off-4008258276006'),
  ('off-7613331269140'),
  -- Mango Joghurt (keeps off-7610707000581)
  ('off-7623186246296'),
  -- Margherita (keeps off-7613035384361)
  ('off-7613269490456'),
  -- Maronen (keeps off-4099200023304)
  ('off-4104420177123'),
  -- Marroni (keeps off-24726139)
  ('off-7610184009060'),
  -- Marshmallows (keeps off-4099200177809)
  ('off-7613312378168'),
  -- Marzipankartoffeln (keeps off-4023800912805)
  ('off-4335619062665'),
  -- Matcha Latte (keeps off-4104420146464)
  ('off-7610900884940'),
  ('off-4251953200467'),
  -- Mate (keeps off-7627537999022)
  ('off-4335619078024'),
  ('off-7610463037456'),
  ('off-7611546031958'),
  ('off-7611331039770'),
  ('off-42254300'),
  ('off-7640341610150'),
  -- Mayonaise (keeps off-7610100034084)
  ('off-7610029145434'),
  -- Mayonnaise mit Senf (keeps off-7613032968366)
  ('off-7616600380201'),
  -- Medjool Datteln (keeps off-7290002490692)
  ('off-7613413946754'),
  -- Mehl (keeps off-7627534822019)
  ('off-5450086125312'),
  ('off-8008698005118'),
  -- Merguez (keeps off-7610092801671)
  ('off-7613404636084'),
  -- Mexican Wedges (keeps off-7613269301578)
  ('off-7613312321782'),
  -- Microwave Popcorn - gesalzen (keeps off-7610029193442)
  ('off-7627535075575'),
  -- Mie Noodles (keeps off-5060237280984)
  ('off-7613312434284'),
  -- Mikado (keeps off-7622300476175)
  ('off-7622300299286'),
  -- Milch (keeps off-7624841865425)
  ('off-7627534814199'),
  ('off-4099200403601'),
  ('off-7610434012512'),
  ('off-7610556500713'),
  ('off-7623186274336'),
  ('off-7613269779858'),
  ('off-7613269780021'),
  ('off-7617027171571'),
  ('off-4046700027042'),
  ('off-7610900286737'),
  ('off-7640167260546'),
  ('off-7613031080847'),
  ('off-7616500646315'),
  -- Milch Drink (keeps off-7624841022415)
  ('off-7610200390981'),
  ('off-7627535393686'),
  ('off-7610029141047'),
  ('off-7613404535301'),
  -- Milch Extra (keeps off-7610400010016)
  ('off-7616500012455'),
  -- Milch UHT (keeps off-7613404535318)
  ('off-7627534826734'),
  -- Milch-Nuss (keeps off-7610400084826)
  ('off-7616500011007'),
  ('off-7627534622831'),
  -- Milchbrötchen (keeps off-4012263031642)
  ('off-3256540009295'),
  ('off-3256540011335'),
  ('off-20227289'),
  -- Milchdrink (keeps off-7617027153584)
  ('off-7610029002492'),
  ('off-7610900286546'),
  ('off-4056489551843'),
  -- Milchreis (keeps off-7610807000641)
  ('off-4104420215856'),
  -- Milchreis mit Heidelbeeren (keeps off-7627537895591)
  ('off-7613379653864'),
  -- Mini (keeps off-3073780400862)
  ('off-5000159409179'),
  -- Mini mix (keeps off-7617400043839)
  ('off-7613312278345'),
  ('off-7627534960605'),
  ('off-7613312437346'),
  -- Mini spring rolls POULET (keeps off-7611350300035)
  ('off-7613037602470'),
  -- Mini Willisauer Ringli (keeps off-7610032006562)
  ('off-7610032066832'),
  -- Mini-rösti (keeps off-4099200016412)
  ('off-7610807157796'),
  -- Mischobst (keeps off-7613331680679)
  ('off-4021851649305'),
  -- Mischsalat (keeps off-7610807077056)
  ('off-7613413555611'),
  ('off-7610807077025'),
  ('off-7610514437570'),
  ('off-7617027631419'),
  ('off-7623186787683'),
  ('off-7610632970591'),
  ('off-7617027898072'),
  -- Mixed Pickles (keeps off-4311501491980)
  ('off-7613379750372'),
  -- Möckli Rindfleisch (keeps off-2153391005302)
  ('off-2153391005708'),
  -- Mokka (keeps off-22112385)
  ('off-7610029214628'),
  ('off-22119759'),
  -- Molke-Drink Mango-Passionsfrucht (keeps off-4061459487961)
  ('off-7617027957274'),
  -- Morcheln (keeps off-7610800991663)
  ('off-7627534152604'),
  -- Mostmöckli (keeps off-7617027168113)
  ('off-4617617168113'),
  -- Mostmöckli Anschnitte (keeps off-2168912005358)
  ('off-2168912007253'),
  ('off-2168912005907'),
  -- Moussaka (keeps off-7610026014191)
  ('off-20353001'),
  -- MOZZARELLA di Bufala (keeps off-4099200019345)
  ('off-7640121910760'),
  -- Mozzarella gerieben (keeps off-7613404862841)
  ('off-7627536596611'),
  -- Mozzarelline (keeps off-07627538)
  ('off-7610200044433'),
  -- Muesli (keeps off-7617027800600)
  ('off-7627534588021'),
  -- Müesli (keeps off-7610027033658)
  ('off-7613312509975'),
  -- Müesli mit Früchten (keeps off-7611471003679)
  ('off-7281320873410'),
  -- Muffins (keeps off-5413049021038)
  ('off-4056489436478'),
  ('off-7610089366923'),
  ('off-7611654375951'),
  -- Multi-Vitamin (keeps off-7610235003252)
  ('off-4000177033708'),
  ('off-7616800835983'),
  -- Multifrucht (keeps off-7616800833170)
  ('off-7613269260738'),
  -- Multivitamin (keeps off-7640119725734)
  ('off-7613312363799'),
  ('off-7613312415924'),
  -- Multivitaminsaft (keeps off-7610029135862)
  ('off-7613312403198'),
  ('off-7613312418291'),
  ('off-7610848693246'),
  -- Müscheli (keeps off-7610849860340)
  ('off-7613312314616'),
  -- Müsli (keeps off-24052191)
  ('off-4056489694120'),
  ('off-5059319025650'),
  -- Nasi Goreng (keeps off-4099200170749)
  ('off-7624841765275'),
  -- Nature Joghurt (keeps off-7613404845820)
  ('off-7624841917735'),
  ('off-7640116820777'),
  -- Nesquik (keeps off-3387390124118)
  ('off-7613038105079'),
  -- Noisette (keeps off-7613331808110)
  ('off-4001743021372'),
  -- Nudeln (keeps off-7610849861286)
  ('off-8008343200516'),
  ('off-7616700175233'),
  -- Nuggets (keeps off-7613269265597)
  ('off-7610745212380'),
  ('off-7610745612128'),
  ('off-7630294506204'),
  -- Nuggets Poulet (keeps off-7613356698819)
  ('off-7624841913577'),
  -- Nürnberger Rostbratwurst (keeps off-22114839)
  ('off-4002960100055'),
  -- Nuss-Frucht-Mix (keeps off-20815394)
  ('off-4061458056632'),
  -- Nussbrot (keeps off-7610846856667)
  ('off-7627537726727'),
  ('off-7616700037784'),
  -- Nusskernmischung (keeps off-4008258150016)
  ('off-4311501627167'),
  ('off-7610184016969'),
  ('off-4056489203810'),
  -- Nüsslisalat (keeps off-7613356205024)
  ('off-7613356271678'),
  ('off-7613269978756'),
  ('off-7610029197273'),
  -- Nussmischung (keeps off-7613312261446)
  ('off-4335619080867'),
  ('off-7627534485535'),
  ('off-7610029140996'),
  ('off-7613312237540'),
  ('off-7613312236246'),
  ('off-7627537710405'),
  ('off-7613312022832'),
  ('off-7624841297509'),
  ('off-7627535700514'),
  ('off-7617400010084'),
  -- Nussmischung BIO (keeps off-7610829437883)
  ('off-7613312431993'),
  -- Nussmix (keeps off-7627534512231)
  ('off-7627535125607'),
  ('off-20047238'),
  -- Nussrollen (keeps off-7623186103711)
  ('off-7616700004205'),
  -- Nutella B-ready (keeps off-8000500142035)
  ('off-8000500217078'),
  -- Nuts (keeps off-5000159498746)
  ('off-7613312462775'),
  -- Of Switzerland Pralinensortiment (keeps off-7613034779175)
  ('off-7613034260628'),
  -- Ofen Frites (keeps off-7613269319610)
  ('off-7613312383148'),
  ('off-7610029146691'),
  ('off-7613269180128'),
  ('off-7613269179528'),
  -- Ofenfleischkäse (keeps off-2155634005209)
  ('off-2113731004457'),
  -- Ofenschinken (keeps off-2134915004704)
  ('off-7623186106057'),
  ('off-7610029197020'),
  -- Oliven (keeps off-9100000078731)
  ('off-5202423600194'),
  ('off-7640109648630'),
  -- Oliven mit Knoblauch (keeps off-7613269446606)
  ('off-7617027633789'),
  -- Olivenöl-Dressing (keeps off-7613356092402)
  ('off-7613356092518'),
  -- Olma Bratwurst (keeps off-4099200407906)
  ('off-7610011787499'),
  -- Omega 3 (keeps off-7613312445075)
  ('off-7616800810607'),
  -- Orange juice (keeps off-7611546012063)
  ('off-7623186360077'),
  -- Orange zero (keeps off-7610029155679)
  ('off-7613312292266'),
  -- Original (keeps off-7300400118118)
  ('off-7612100001769'),
  ('off-7612100016121'),
  ('off-76129810'),
  -- Original Rösti (keeps off-7616800460291)
  ('off-7614200023832'),
  -- Osterchüechli (keeps off-7610807123609)
  ('off-7610849446414'),
  -- Ovo rocks (keeps off-7612100921388)
  ('off-7612100023884'),
  -- Ovo sport (keeps off-7612100908693)
  ('off-76121036'),
  -- Ovomaltine (keeps off-7612100907344)
  ('off-7612100001813'),
  ('off-7612100054826'),
  -- Ovomaltine Original (keeps off-7612100010464)
  ('off-7612100907382'),
  -- Palmherzen (keeps off-7613269357865)
  ('off-7615900007528'),
  -- Pancakes Mischung (keeps off-7610089071384)
  ('off-20149918'),
  -- Pancroc (keeps off-7610058205185)
  ('off-7610058215399'),
  -- Pandoro (keeps off-7613413943241)
  ('off-8000961003265'),
  -- Pangasius Knusperli (keeps off-7610848674658)
  ('off-7613312285442'),
  ('off-7610818427925'),
  -- Pangasiusfilets (keeps off-7613269181118)
  ('off-7613269303954'),
  ('off-7613312085868'),
  -- Pangasiusknusperli (keeps off-7613269535485)
  ('off-7630017609786'),
  -- Panko (keeps off-7640147861275)
  ('off-5060194792414'),
  -- Paprika (keeps off-7610095015006)
  ('off-7610032002038'),
  -- Paprika Chips (keeps off-4056489719762)
  ('off-7613312261712'),
  ('off-7613312261668'),
  ('off-7616800400419'),
  -- Paranüsse (keeps off-4260042317467)
  ('off-7640147650077'),
  ('off-4061462389122'),
  ('off-7624841286527'),
  ('off-9120013233248'),
  ('off-7613413573363'),
  ('off-7613269217954'),
  -- Paranusskerne (keeps off-7610491926548)
  ('off-4099200122762'),
  ('off-4009790008155'),
  ('off-4104420025103'),
  ('off-2000239614632'),
  -- Passata (keeps off-40045122)
  ('off-7613312254516'),
  -- Passata di pomodoro (keeps off-7610029162318)
  ('off-8016013000991'),
  -- Passierte Tomaten (keeps off-4388840218455)
  ('off-7610809036303'),
  ('off-7610034524729'),
  ('off-9100000827377'),
  ('off-8018759003786'),
  ('off-4056489983545'),
  -- Pasta Spaghetti (keeps off-8000139004261)
  ('off-7627537423862'),
  ('off-7640120093969'),
  -- Pastateig (keeps off-7610827849121)
  ('off-7613269211129'),
  -- Pastetenfüllung (keeps off-7616800823522)
  ('off-7616800906294'),
  ('off-7610800018223'),
  -- Pastetli (keeps off-7613404827666)
  ('off-7613404827772'),
  ('off-7613404827796'),
  ('off-7616700010275'),
  ('off-7616700004236'),
  -- Pastrami (keeps off-2115428004955)
  ('off-2980966005173'),
  -- Peanut butter (keeps off-4260363480512)
  ('off-7627534471620'),
  -- Peanut butter creamy (keeps off-8710532471637)
  ('off-1240000016505'),
  -- Peanut butter crunchy (keeps off-8710532471651)
  ('off-4099200256818'),
  ('off-4260744956063'),
  -- Peanut Delight (keeps off-5060088706848)
  ('off-5060088706862'),
  -- Pecankerne (keeps off-4008407014329)
  ('off-4099200122731'),
  -- Pekannüsse (keeps off-7613413839537)
  ('off-7613356586529'),
  ('off-7610184017720'),
  -- Pelati - geschälte Tomaten (keeps off-7610829715790)
  ('off-8000320010026'),
  -- Penne (keeps off-7610029118513)
  ('off-7610145410164'),
  ('off-7616700190595'),
  ('off-4104420236943'),
  ('off-8001200039670'),
  ('off-7613312074763'),
  ('off-4260546671201'),
  -- Penne arrabiata (keeps off-4099200146447)
  ('off-4056489225737'),
  -- Penne mit Quinoa (keeps off-7613312026601)
  ('off-7613312414477'),
  -- Penne Rigate (keeps off-20012151)
  ('off-7613413576043'),
  ('off-8001200111192'),
  ('off-7627535172823'),
  ('off-8018338004005'),
  -- Peperoni (keeps off-7617027953467)
  ('off-4099200405605'),
  ('off-4104420140288'),
  -- Pesto alla Calabrese (keeps off-8076809517751)
  ('off-4061459759020'),
  -- Pesto alla genovese (keeps off-80525448)
  ('off-7613312452813'),
  ('off-20694678'),
  ('off-4099200168890'),
  -- Pesto Genovese (keeps off-4061459758986)
  ('off-8076809513746'),
  ('off-8032595172147'),
  -- Pesto mit Pistazien (keeps off-7610818111473)
  ('off-7624841537766'),
  -- Pfeffersalami (keeps off-2124994003651)
  ('off-2166431004203'),
  -- Pfeffersauce (keeps off-8711200365418)
  ('off-8445290990471'),
  -- Pfirsich (keeps off-76408571)
  ('off-7610097156257'),
  ('off-7613269303602'),
  ('off-7616800204116'),
  ('off-87126655'),
  ('off-3608580046301'),
  -- Pfirsich Hälften (keeps off-7617027140485)
  ('off-7617027140829'),
  -- Pfirsiche (keeps off-4311501302385)
  ('off-7613324104779'),
  ('off-8018759000914'),
  -- Pfirsichhälften (keeps off-7610800005926)
  ('off-7610846832586'),
  -- Philadelphia Original (keeps off-4000339035229)
  ('off-7622300441937'),
  -- Piccata milanese (keeps off-7613413047338)
  ('off-7610582686412'),
  -- Pilzmischung (keeps off-7613312015841)
  ('off-7617027911054'),
  -- Pink Grapefruit (keeps off-7610235006604)
  ('off-7613331014542'),
  ('off-7613269260646'),
  ('off-7613269260752'),
  ('off-7610097161268'),
  -- Pink Grapefruitsaft (keeps off-7610807048360)
  ('off-7613312036020'),
  ('off-3045320104806'),
  -- Pistaches (keeps off-7624841868495)
  ('off-3179142054817'),
  -- Pistazien (keeps off-7613312394045)
  ('off-7617027058216'),
  ('off-7613312206812'),
  ('off-4104420218055'),
  ('off-4008258055014'),
  ('off-4004980535503'),
  ('off-4056546351027'),
  ('off-7627534893439'),
  -- Pita (keeps off-7623186344114)
  ('off-7623186230233'),
  -- Pizza (keeps off-7623186313486)
  ('off-4061459179286'),
  ('off-24045711'),
  -- Pizza margherita (keeps off-4104420112308)
  ('off-7611654693369'),
  ('off-8001665701587'),
  ('off-7613269972761'),
  ('off-7613312175958'),
  -- Pizzateig (keeps off-7613331790958)
  ('off-7613404200865'),
  ('off-7610818137381'),
  ('off-7616700186949'),
  ('off-7613331629623'),
  ('off-7613269207726'),
  ('off-7613331790934'),
  ('off-7613312239056'),
  -- Plant-Based Delicious Pieces (keeps off-7613404727690)
  ('off-7613404431108'),
  ('off-7623186594069'),
  -- Plant-Based Gehacktes (keeps off-7613404363171)
  ('off-7610227935639'),
  -- Plant-Based sausage (keeps off-7613404493304)
  ('off-7613404677032'),
  -- Plätzli (keeps off-7613030013723)
  ('off-4056489314431'),
  -- Polenta (keeps off-7610100010316)
  ('off-4104420016569'),
  -- Polenta Maisgriess fein (keeps off-7613269317296)
  ('off-7613312065273'),
  -- Pom-Bär Original (keeps off-4000522006890)
  ('off-9000159744900'),
  -- Pommes Duchesse (keeps off-7613312246726)
  ('off-7610807126136'),
  ('off-4061461679996'),
  -- Pommes noisettes (keeps off-20000066)
  ('off-4056489553106'),
  -- Pomodori Pelati (keeps off-7610294810389)
  ('off-8002510003009'),
  -- Pomodori Secchi (keeps off-7610845752502)
  ('off-8029513104540'),
  -- Popcorn Mais (keeps off-7610809087206)
  ('off-4104420232198'),
  -- Popcorn-Mais (keeps off-4000286221737)
  ('off-7613269194217'),
  -- Porridge (keeps off-4104420136564)
  ('off-24075527'),
  ('off-4015637826424'),
  ('off-4061459209297'),
  -- Poulet (keeps off-2224584005000)
  ('off-2224584005109'),
  ('off-2224584005505'),
  ('off-0828064003894'),
  ('off-2158233015105'),
  ('off-2817990004530'),
  ('off-2412038009401'),
  ('off-0580159006950'),
  -- Poulet Burger (keeps off-7613269731115)
  ('off-7613312320907'),
  ('off-7610162093098'),
  ('off-7613331621986'),
  -- Poulet Chorizo (keeps off-4335619079267)
  ('off-7623186786150'),
  -- Poulet Cordon-Bleu (keeps off-2108863007858)
  ('off-7610162094279'),
  -- Poulet Geschnetzeltes (keeps off-4099200404691)
  ('off-2164855006650'),
  ('off-2164855006858'),
  ('off-2189890013203'),
  -- Poulet Grillsteak (keeps off-2305991002551)
  ('off-2823250002543'),
  ('off-2305995002311'),
  -- Poulet Minifilet (keeps off-2149354009753)
  ('off-4099200404790'),
  -- Poulet nuggets (keeps off-7610162094262)
  ('off-0581587006505'),
  ('off-7610200308092'),
  ('off-7613269181033'),
  -- Poulet Piccata (keeps off-7627537994188)
  ('off-7613312093443'),
  -- Poulet Satay-Spiessli gewürzt (keeps off-2993352002243)
  ('off-2993352002373'),
  -- Poulet Schenkel (keeps off-2170171007509)
  ('off-2148701009156'),
  ('off-2070591006305'),
  -- Poulet Schnitzel (keeps off-2127539011654)
  ('off-2137908011550'),
  -- Pouletbrust (keeps food-poulet)
  ('off-20240417'),
  -- Pouletbrust geräuchert (keeps off-2111963004108)
  ('off-2111963004351'),
  ('off-2111963004450'),
  -- Pouletbrust gewürzt (keeps off-2114460007009)
  ('off-7623186569210'),
  -- Pouletbrust-Geschnetzeltes (keeps off-7617023007195)
  ('off-2211750009207'),
  -- Pouletflügel gewürzt (keeps off-2114378007108)
  ('off-7617023005108'),
  -- Pouletgeschnetzeltes (keeps off-7617100230836)
  ('off-7627536892768'),
  -- Pouletschenkel (keeps off-7613312268773)
  ('off-20523114'),
  ('off-2130624005957'),
  ('off-7617100230843'),
  -- Pouletschenkel Gewürzt (keeps off-20811884)
  ('off-2114458007608'),
  -- Pouletschnitzel (keeps off-2222847009406)
  ('off-7610200052742'),
  -- Preussen (keeps off-7613404605257)
  ('off-7613404200193'),
  -- Pringles Original (keeps off-5053990167807)
  ('off-5053990138722'),
  -- ProActiv (keeps off-8719200179073)
  ('off-8719200058187'),
  -- Prosciutto hauchdünn (keeps off-2159931004651)
  ('off-7623186106019'),
  -- Protein (keeps off-64190747)
  ('off-5712840020081'),
  -- Protein bar (keeps off-7640182220129)
  ('off-4061461816384'),
  -- Protein Coffee (keeps off-7610900876969)
  ('off-4260752812818'),
  -- Protein Drink (keeps off-5690845003141)
  ('off-7611174015399'),
  -- Protein Mix (keeps off-7613312526460)
  ('off-7613312260494'),
  -- Proteinbrot (keeps off-7613269886327)
  ('off-7613269478669'),
  ('off-7610849263578'),
  -- Puderzucker (keeps bls-S111100)
  ('off-7610800009634'),
  -- Pure Butter Shortbread (keeps off-0039047001152)
  ('off-0039047001107'),
  -- Qualité&Prix : Milch : Standardisierte Vollmilch 3.5% Milchfett (keeps off-7610800019121)
  ('off-7610800019138'),
  -- Quark (keeps off-7640127050491)
  ('off-7610809036846'),
  -- Quark Himbeere (keeps off-7623186178047)
  ('off-7610200371027'),
  -- Quarkspätzli (keeps off-4056489974550)
  ('off-4061462959899'),
  -- Quinoa (keeps off-7611654616825)
  ('off-4005009104762'),
  ('off-7613312132715'),
  ('off-4104420018389'),
  ('off-4006237641418'),
  ('off-7613312442548'),
  -- Quinoa Gepufft (keeps off-4104420139282)
  ('off-7613312456187'),
  -- Quinoaflocken (keeps off-7613356136427)
  ('off-7613312044117'),
  ('off-4019339263068'),
  -- Quorn Pfeffer Grill Steak (keeps off-7610745682619)
  ('off-7613356460782'),
  -- Raclette (keeps off-4056489780663)
  ('off-7610900042098'),
  ('off-4099200406305'),
  ('off-7610071277503'),
  -- Rahmblutwurst (keeps off-2121179003659)
  ('off-7610162308888'),
  -- Rahmglace Vanille (keeps off-7610829052383)
  ('off-7613312171097'),
  -- Rahmquark (keeps off-7623186106354)
  ('off-20411152'),
  ('off-7624841552493'),
  -- Rahmsauce (keeps off-7610100055621)
  ('off-7613312430811'),
  ('off-7613269298359'),
  -- Rahmspinat (keeps off-7616800810454)
  ('off-4099200410340'),
  ('off-7610848052609'),
  ('off-7613036164405'),
  ('off-7613312382714'),
  ('off-7624841546140'),
  ('off-7610849537655'),
  ('off-7624841112802'),
  -- Rama (keeps off-8719200252745)
  ('off-8719200313927'),
  -- Ramen noodles (keeps off-7640147861282)
  ('off-7613312439265'),
  ('off-4061463765994'),
  -- Randen-Stäbli (keeps off-7610849252381)
  ('off-7613331582560'),
  -- Randenwürfel (keeps off-7610632984116)
  ('off-7617027656849'),
  -- Rauchbröckli (keeps off-7613331336910)
  ('off-7627537243811'),
  -- Rauchlachs (keeps off-7610271790024)
  ('off-7613269464471'),
  ('off-7613269481560'),
  -- Rauchmöckli (keeps off-4099200407722)
  ('off-4335619255678'),
  -- Ravioli (keeps off-7614200011648)
  ('off-7627535707728'),
  ('off-7627535070167'),
  ('off-7614200018661'),
  ('off-7627534182373'),
  -- Ravioli Napoli (keeps off-7616800823492)
  ('off-4056489426189'),
  -- Reis (keeps off-7616800213101)
  ('off-7610029012231'),
  -- Reis Basmati (keeps off-20073763)
  ('off-4104420115781'),
  -- Reis-Waffeln (keeps off-4099200062945)
  ('off-4099200062976'),
  -- Reisdrink (keeps off-7613269274001)
  ('off-7627534862626'),
  -- Reisnudeln (keeps off-8938505644080)
  ('off-7613312440575'),
  ('off-7613312304051'),
  -- Reiswaffeln (keeps off-7610848358107)
  ('off-4260541688150'),
  ('off-7610029205435'),
  ('off-7613356127753'),
  -- Ricotta (keeps off-4000915101126)
  ('off-7610253592127'),
  ('off-7627535323751'),
  ('off-4104420213432'),
  -- Rigatoni (keeps off-64313757)
  ('off-8000139911187'),
  -- Rindergulasch (keeps off-3850104020087)
  ('off-4388844190528'),
  -- Rindfleisch (keeps off-2182088015805)
  ('off-2823496002598'),
  ('off-2414429007409'),
  -- Rindfleisch-Zubereitung (keeps off-4104420138506)
  ('off-4062300274709'),
  -- Rindgeschnetzeltes (keeps off-2182090009601)
  ('off-2162096011556'),
  -- Rinds Tatar Picante (keeps off-0580287007300)
  ('off-0580287006754'),
  -- Rinds-Saftplätzli (keeps off-2819363003331)
  ('off-2822606003050'),
  ('off-2853264002925'),
  ('off-2853267002908'),
  -- Rindsentrecôte (keeps off-2162094011152)
  ('off-2202989031954'),
  -- Rindshackfleisch (keeps off-2153712005653)
  ('off-2167137008052'),
  -- Rindshuftsteak (keeps off-2166516015957)
  ('off-2167626012607'),
  -- Rindsleber geschnetzelt (keeps off-2185286003858)
  ('off-2185352002600'),
  -- Rindsleberplätzli (keeps off-13750060)
  ('off-2185282001902'),
  -- Rindsplätzli à la minute (keeps off-2160759012902)
  ('off-2161161023258'),
  -- Rindsplätzli Mariniert (keeps off-2414609013701)
  ('off-2414609014005'),
  -- Rindsplätzli Minute (keeps off-2160759009902)
  ('off-2160759013909'),
  -- Rindstatar (keeps off-2173530008254)
  ('off-4335619079915'),
  -- Risotto (keeps off-7613331668349)
  ('off-4006237641241'),
  ('off-7627536249388'),
  ('off-7627535793929'),
  ('off-5410673004420'),
  -- Risotto ai Funghi (keeps off-7611100373319)
  ('off-7613404175293'),
  -- Risotto alla Milanese (keeps off-40877464)
  ('off-7610029161885'),
  -- Risotto Milanese (keeps off-7613312341063)
  ('off-7611100350891'),
  ('off-7613269301141'),
  -- Risotto Reis (keeps off-7610200010872)
  ('off-7610198000633'),
  ('off-7610029004335'),
  ('off-7624841520904'),
  ('off-4104420029583'),
  ('off-4388860132885'),
  -- Risotto Tomato (keeps off-7611100350877)
  ('off-7613269300861'),
  -- Riz casimir (keeps off-7613269301202)
  ('off-7613404622858'),
  -- Roastbeef (keeps off-2115388005207)
  ('off-2156197006306'),
  -- Roggenmehl (keeps off-7613269350149)
  ('off-7611330891607'),
  -- Rohrzucker (keeps off-3012996012001)
  ('off-7613312394380'),
  -- Rohrzucker-Sticks (keeps off-7610302496710)
  ('off-7610827558184'),
  -- Rohschinken Anschnitte (keeps off-2114819004109)
  ('off-4099200428284'),
  -- Rohzucker (keeps off-7610029159264)
  ('off-7610200010117'),
  ('off-7610302010121'),
  -- Rohzucker aus Zuckerrohr, gemahlen (keeps off-7610302442625)
  ('off-7610200010216'),
  -- Rohzucker grob (keeps off-7610302441628)
  ('off-7613312518588'),
  -- Rollschinkli Schulter (keeps off-2128808012006)
  ('off-2413846012454'),
  -- Rosa thon (keeps off-7613269272366)
  ('off-7613312212776'),
  -- Rosenkohl (keeps off-7613269273912)
  ('off-7613035802216'),
  ('off-7613331336521'),
  -- Rosmarin (keeps off-00204903)
  ('off-7613312042540'),
  -- Rösti Bratfertige Kartoffeln (keeps off-7616800460307)
  ('off-7616800905884'),
  -- Rösti fixfertig (keeps off-7610827737688)
  ('off-7610809111093'),
  ('off-7610800009436'),
  -- Rösti Kroketten (keeps off-7613312246702)
  ('off-7616800214078'),
  ('off-7624841128056'),
  -- Rösti original (keeps off-4056489425601)
  ('off-7613312252093'),
  ('off-7614200011938'),
  ('off-20236397'),
  -- Röstzwiebel (keeps off-24633543)
  ('off-1302371760002'),
  -- Rote Bohnen (keeps off-7616800823508)
  ('off-8001440127021'),
  ('off-7614200011549'),
  -- Rote Curry Paste (keeps off-4099200423975)
  ('off-8853662001036'),
  -- Rote Kidney Bohnen (keeps off-4099200011295)
  ('off-7613312371213'),
  -- Rote Kidneybohnen (keeps off-7616800800509)
  ('off-7613312371350'),
  -- Rote Linsen (keeps off-4099200193281)
  ('off-7613312016886'),
  ('off-4104420010642'),
  ('off-4006040177616'),
  ('off-7613269296447'),
  -- Roter Kopfsalat (keeps off-7613404180020)
  ('off-7617027869836'),
  -- Rotkohl (keeps off-20004408)
  ('off-4002471072001'),
  -- Rotkraut (keeps off-7610818158850)
  ('off-7610798072603'),
  ('off-7617027762564'),
  ('off-7610200335159'),
  -- Rotkraut gekocht (keeps off-7613379690814)
  ('off-7610029210156'),
  ('off-7613269552550'),
  -- Ruchmehl (keeps off-20695170)
  ('off-7610803007750'),
  ('off-7617027015134'),
  ('off-7610800019336'),
  -- Rucola (keeps off-7610846434841)
  ('off-10245118'),
  -- Rüebli (keeps off-7610848580539)
  ('off-7610807077018'),
  -- Rüebli & Erbsli (keeps off-7627537070684)
  ('off-7610849907731'),
  -- Russischer Salat (keeps off-7614200010061)
  ('off-7610800001270'),
  ('off-7613269197621'),
  ('off-7610848249535'),
  ('off-7613269284406'),
  -- Salade (keeps off-7627535125157)
  ('off-7610029177459'),
  -- Salade russe (keeps off-7610034522695)
  ('off-7613269197485'),
  ('off-7610029206234'),
  -- Salami Milano (keeps off-2126903003257)
  ('off-7617027881173'),
  -- Salat (keeps off-7613116005215)
  ('off-7623186373121'),
  -- Salatkäse (keeps off-7617027161152)
  ('off-7613269407560'),
  -- Salatsauce (keeps off-7613312081990)
  ('off-7610405067961'),
  ('off-17832274'),
  ('off-7616600711807'),
  ('off-7613312010617'),
  ('off-7640109670488'),
  -- Salsa Dip mild (keeps off-7613312425725)
  ('off-7624841053457'),
  -- Salzstangen (keeps off-7613312047828)
  ('off-7613269194156'),
  ('off-7610058212800'),
  -- Salzsticks (keeps off-4104420052529)
  ('off-7617400030549'),
  -- Sambal Oelek (keeps off-7613312434208)
  ('off-7613269027423'),
  ('off-7610948070107'),
  ('off-4030917005405'),
  -- San Antonio Il Panettone (keeps off-7616700030976)
  ('off-7616700026993'),
  -- Sanbitter (keeps off-8002270866531)
  ('off-8002270020018'),
  -- Sandwich (keeps off-7610026426109)
  ('off-7610032065170'),
  ('off-7610029204353'),
  -- Sandwich belegt mit Thunfischerzeugnis (keeps off-7624841700177)
  ('off-7610227965261'),
  -- Sauce Bolognese (keeps off-80525271)
  ('off-7613312377147'),
  -- Sauce Hollandaise (keeps off-7613269298991)
  ('off-40056463'),
  -- Sauerkirschen (keeps off-7617027071420)
  ('off-4104420137042'),
  ('off-4067796168402'),
  -- Sauerkraut (keeps off-4061461606886)
  ('off-40081939'),
  ('off-7613404861004'),
  -- Sauerkraut roh (keeps off-7613404860915)
  ('off-7613269552994'),
  ('off-7610596001003'),
  -- Sauerkrautsaft (keeps off-4066447855647)
  ('off-4104420072800'),
  -- Sauermilch (keeps off-7613331266040)
  ('off-7613404327685'),
  -- Schinken (keeps off-2244405005507)
  ('off-2177425007001'),
  ('off-2137965005608'),
  ('off-7613269250357'),
  -- Schinkenwürfeli (keeps off-4056489312635)
  ('off-7613404160558'),
  -- Schlagrahm (keeps off-7616600704519)
  ('off-22136169'),
  -- Schlangenbrot (keeps off-7623186174193)
  ('off-7623186344534'),
  -- Schmand (keeps off-4099200404714)
  ('off-7640166799481'),
  ('off-4337185472619'),
  -- Schnäggli (keeps off-7616700014914)
  ('off-7613312314654'),
  -- Schnitzel (keeps off-277613356460799500000295)
  ('off-7630294506211'),
  ('off-7610848390312'),
  ('off-7623186505010'),
  ('off-7613269914396'),
  ('off-2113321005000'),
  -- Schnitzel Poulet (keeps off-2137738008256)
  ('off-2185039005252'),
  -- Schoko Reiswaffeln (keeps off-4068134199898)
  ('off-4104420053762'),
  -- Schokoaufstrich (keeps off-7613312453797)
  ('off-7624841330992'),
  -- Schokobrötchen (keeps off-3256540011304)
  ('off-7613331305152'),
  -- Schokoladen-Späne (keeps off-7613312295816)
  ('off-7613331206190'),
  -- Schokoladencreme (keeps off-3608580003687)
  ('off-7613312366844'),
  -- Schorle (keeps off-7613331953933)
  ('off-7610057022356'),
  ('off-7640127855539'),
  ('off-7617500197869'),
  -- Schupfnudeln (keeps off-7613404571323)
  ('off-7613404237885'),
  ('off-20809669'),
  ('off-7616800596730'),
  ('off-7610848553281'),
  ('off-4099200422763'),
  -- Schüttelbrot (keeps off-8032618341178)
  ('off-8023401099017'),
  -- Schwäbische Spätzle (keeps off-20809676)
  ('off-7613312513828'),
  -- Schwarzwälder (keeps off-7617400049909)
  ('off-7617400050189'),
  -- Schwarzwälder Schinken (keeps off-2113533005805)
  ('off-2113533006109'),
  ('off-4099200407852'),
  ('off-4314124337741'),
  -- Schweinefilet mit Speck (keeps off-2818377002637)
  ('off-2818378002612'),
  -- Schweins halssteak (keeps off-2231913006508)
  ('off-2415483012309'),
  -- Schweins Nierstück (keeps off-2151969012554)
  ('off-2186195007906'),
  -- Schweins Stotzenplätzli (keeps off-2113321005406)
  ('off-2150374004956'),
  -- Schweinsbratwurst (keeps blv-1085)
  ('off-7613269564041'),
  -- Schweinsgeschnetzeltes (keeps off-2182614006000)
  ('off-2182614010656'),
  -- Schweinshalssteak (keeps off-2231913007406)
  ('off-4069365858936'),
  -- Schweinshalssteak Mariniert (keeps off-2153334017300)
  ('off-2172166005705'),
  -- Schweinshuftsteak (keeps off-2845418003186)
  ('off-2845416003249'),
  -- Schweinskotelett Mariniert (keeps off-2182840005051)
  ('off-2115304005854'),
  -- Schweinskoteletts (keeps off-2182826007406)
  ('off-2182826007956'),
  -- Schweinsnierstück (keeps off-4099200424736)
  ('off-2186195009559'),
  ('off-2296967013254'),
  ('off-2223656012908'),
  ('off-2816330012075'),
  ('off-2816330014567'),
  -- Schweinsschnitzel (keeps off-2114149004756)
  ('off-2115203009953'),
  -- Schweinswürstchen (keeps off-7610200068590)
  ('off-7613404081907'),
  ('off-4099200402741'),
  -- Schweizer Bio-Eier (keeps off-7613404858561)
  ('off-7613404859063'),
  ('off-7610200313737'),
  ('off-7610200312075'),
  -- Schweizer Eier (keeps off-7610200307729)
  ('off-4056489313557'),
  ('off-7610029176438'),
  ('off-7627534163594'),
  ('off-7613269485155'),
  ('off-7610200016959'),
  -- Schweizer Gemüsemischung (keeps off-7613269273851)
  ('off-73662167'),
  ('off-20458997'),
  -- Schweizer Hackspinat (keeps off-7613312361351)
  ('off-7613312382776'),
  -- Schweizer Milchschokolade (keeps off-7613331423139)
  ('off-7610198012735'),
  ('off-4061459103168'),
  -- Schweizer Reibkäse (keeps off-4056489078142)
  ('off-7610198012636'),
  -- Schwingerhörnli (keeps off-7613312499481)
  ('off-7613312414514'),
  -- Seeländer Krustenschinken (keeps off-7623186520433)
  ('off-2171885006802'),
  -- Sellerie geraffelt (keeps off-7610514437273)
  ('off-7623186726132'),
  -- Senf Dijon (keeps off-7610848450276)
  ('off-76406713'),
  -- Senf mild (keeps off-7610145640905)
  ('off-7610145651017'),
  ('off-7616700201512'),
  ('off-7610100031403'),
  ('off-76101083'),
  -- Senf mit Honig (keeps off-3036810204014)
  ('off-7613035367623'),
  -- Sesam Ungeschält (keeps off-2099409900132)
  ('off-4104420225015'),
  -- Shirataki Rice-Style (keeps off-7613312410202)
  ('off-7613312422021'),
  -- Silberzwiebeln (keeps off-4056489476894)
  ('off-28105077'),
  ('off-7613269303176'),
  ('off-7610161124144'),
  ('off-7611300334042'),
  -- Silser Schinken (keeps off-7612812410002)
  ('off-0584094004507'),
  -- Silserkranz (keeps off-7613404635872)
  ('off-7613404635896'),
  ('off-12119815'),
  ('off-7627536160362'),
  -- Simmenthal (keeps off-8001070057507)
  ('off-8004030905092'),
  -- Sinalco Original (keeps off-7610057026316)
  ('off-7610057026514'),
  -- Sinalco Passionsfrucht (keeps off-7610057026095)
  ('off-7610057026101'),
  -- Sirup Erdbeer (keeps off-7610173829167)
  ('off-7613413571864'),
  ('off-7613269355878'),
  -- Sirup Himbeer (keeps off-7610029011661)
  ('off-7613269353591'),
  ('off-20937812'),
  -- Skyr Choco (keeps off-7624841842242)
  ('off-5690845000744'),
  -- Skyr Heidelbeere (keeps off-7623186757082)
  ('off-5690527900003'),
  -- Skyr Natur (keeps off-4061462615481)
  ('off-4061458011884'),
  -- Skyr Natural (keeps off-20692285)
  ('off-12918287'),
  -- Skyr Stracciatella (keeps off-7627537429666)
  ('off-7623186752247'),
  -- Skyr Vanille (keeps off-20692278)
  ('off-7613269879398'),
  -- Slurpy (keeps off-7613312278369)
  ('off-2184312278369'),
  -- Smarties mini (keeps off-59944560)
  ('off-7613032195953'),
  -- Smoothie (keeps off-7613404086544)
  ('off-7610198092409'),
  -- Snickers (keeps off-5000159560061)
  ('off-5900951311505'),
  ('off-5000159404259'),
  ('off-5000159429115'),
  -- Soft Apfel (keeps off-7613269185758)
  ('off-7610121601340'),
  -- Soft Himbeer (keeps off-7613269187233)
  ('off-7610121601272'),
  -- Soft-Datteln (keeps off-24070393)
  ('off-4099200023342'),
  -- Soja Cuisine (keeps off-5411188124320)
  ('off-4016249162450'),
  ('off-4104420095205'),
  ('off-7616600702546'),
  -- Soja Drink Natur (keeps off-4061459426175)
  ('off-4104420094987'),
  -- Soja-Granulat (keeps off-4025174121135)
  ('off-4260402480947'),
  -- Sojaflocken (keeps off-7610200074188)
  ('off-7613331111395'),
  -- Sojagurt (keeps off-4061458194136)
  ('off-4061459525960'),
  -- Sorbet Himbeer (keeps off-7613312067505)
  ('off-7617400046427'),
  -- Soy Sauce (keeps off-7613312318034)
  ('off-7613312434246'),
  -- Spaghetti (keeps off-7613413576074)
  ('off-8000139935466'),
  ('off-20063757'),
  ('off-7613312418512'),
  ('off-4104420237001'),
  ('off-8009940000035'),
  ('off-7610198000206'),
  ('off-7616700102017'),
  ('off-7613312314722'),
  ('off-7627535173448'),
  ('off-8022903000286'),
  ('off-7624841870252'),
  ('off-8001772000030'),
  ('off-4061458036702'),
  -- Spaghetti bolognese (keeps off-4062300230842)
  ('off-7613035074941'),
  ('off-7627535338076'),
  -- Spaghetti Carbonara (keeps off-7627535411069)
  ('off-4099200146393'),
  -- Spanische Nüssli (keeps off-7617027790918)
  ('off-7640154440227'),
  -- Spargel (keeps off-7611100179515)
  ('off-7613269296775'),
  -- Spargelspitzen (keeps off-7610807030068)
  ('off-7613269357728'),
  -- Spätzli (keeps off-7613331268990)
  ('off-7616800833552'),
  ('off-7613404017722'),
  ('off-7624841620079'),
  ('off-7610848549673'),
  ('off-7610807061635'),
  ('off-7640120090265'),
  -- Special K Red Berries (keeps off-5000127527027)
  ('off-5059319024318'),
  -- Speckwürfel (keeps off-2230314006308)
  ('off-4099200407883'),
  ('off-7610029225044'),
  -- Speckwürfeli (keeps off-7613269021711)
  ('off-7613269590040'),
  ('off-7613269477556'),
  ('off-4056489188780'),
  -- Spinat (keeps off-7613030006152)
  ('off-7616800810447'),
  -- Spinat-Plätzli (keeps off-7613312036877)
  ('off-7613312240489'),
  -- Spinatchüechli (keeps off-7610848241256)
  ('off-7616700008777'),
  -- Spinatwähe (keeps off-2100509004702)
  ('off-7623186483929'),
  -- Spiralen (keeps off-7610849859764)
  ('off-7640120090029'),
  ('off-7610849861262'),
  ('off-7616700184716'),
  ('off-7613269373438'),
  -- Spitzbuben (keeps off-7613312378410)
  ('off-7613269458449'),
  ('off-7613269290001'),
  ('off-7613312015438'),
  ('off-7617400037562'),
  ('off-4056489558293'),
  -- St. Galler Kalbsbratwurst (keeps off-7610827658198)
  ('off-7623186611711'),
  ('off-7610029002324'),
  -- Steinofen Knusperbrot (keeps off-7613269856030)
  ('off-7623186697609'),
  -- Steinpilze (keeps off-7610029138597)
  ('off-7610845355666'),
  ('off-7613312015865'),
  -- Steinpilze getrocknet (keeps off-7610200026446)
  ('off-7613269346760'),
  -- Steinpilzsauce (keeps off-7613312274736)
  ('off-7611100071109'),
  ('off-7610703038366'),
  -- Sticks (keeps off-5000159492317)
  ('off-4099200027852'),
  -- Stracciatella (keeps off-7613312402269)
  ('off-7613030864004'),
  ('off-7613312278741'),
  -- Streichcreme Aubergine (keeps off-4058172321023)
  ('off-4104420238893'),
  -- Streichcreme Toskana (keeps off-4019738103347)
  ('off-4104420238855'),
  -- Streichfrischkäse (keeps off-7613404639160)
  ('off-7613404862810'),
  ('off-7623186312847'),
  -- Streuselkuchen Apfel (keeps off-07130397)
  ('off-7611654783923'),
  -- Streuwürze (keeps off-7610121100010)
  ('off-7613269300380'),
  -- Stroganoff (keeps off-7611100450478)
  ('off-7613034347299'),
  ('off-2173503009004'),
  -- Studentenfutter (keeps bls-H810000)
  ('off-4000206327211'),
  -- Suchard express (keeps off-3664346307734)
  ('off-7614500281710'),
  -- Süessmost (keeps off-7610057000231)
  ('off-7610057000170'),
  -- Sugo al Basilico (keeps off-8008343299671)
  ('off-80525264'),
  -- Sugo Arrabbiata (keeps off-4061464440357)
  ('off-8000139930294'),
  ('off-7610029162332'),
  -- Sultaninen (keeps off-4311501470138)
  ('off-7613269193081'),
  ('off-7624841278683'),
  ('off-7610198002996'),
  ('off-4388844100985'),
  -- Sultaninen dunkel (keeps off-7627534352110)
  ('off-7613356685376'),
  -- Sultaninen hell (keeps off-7610184033904)
  ('off-7627534562472'),
  -- Super Soft Sandwich (keeps off-9005300019005)
  ('off-9005300019012'),
  -- Suppen-perlen (keeps off-7617400035032)
  ('off-7613312208786'),
  -- Sushi (keeps off-4088500754988)
  ('off-7613404756577'),
  -- Sushi Snack (keeps off-7624841142151)
  ('off-7624841319553'),
  -- Sushi Wrap Salmon (keeps off-7630048335524)
  ('off-7613404756850'),
  -- Süssmais (keeps off-7610265014082)
  ('off-7610807242300'),
  ('off-7610849273270'),
  ('off-7610800004998'),
  -- Sweet Chili (keeps off-0724754246797)
  ('off-5900259135704'),
  -- Sweet Chili Sauce (keeps off-0044738072311)
  ('off-5021047104976'),
  -- Tagliatelle (keeps off-20066086)
  ('off-4104420063242'),
  ('off-8076809523714'),
  ('off-4061464609112'),
  ('off-7613312414378'),
  -- Tagliatelle UrDinkel (keeps off-7616700115512)
  ('off-7612360405390'),
  -- Tartare (keeps off-7613312287866)
  ('off-7613036989800'),
  ('off-7610352800871'),
  -- Tartare Sauce (keeps off-7613036762779)
  ('off-7616600380508'),
  ('off-7613379117274'),
  -- Teigwaren, Hörnli (keeps off-7616700014884)
  ('off-7616700184693'),
  -- Teilentrahmte Milch (keeps off-7610848361237)
  ('off-20244378'),
  -- Tempeh (keeps off-7627537661202)
  ('off-4010238580003'),
  -- Tessinerbrot dunkel (keeps off-7613379186379)
  ('off-7627536160508'),
  -- Thon Mayo (keeps off-7610100011023)
  ('off-20630843'),
  -- Thunfischfilet (keeps off-4099200011103)
  ('off-20095949'),
  -- Tilsiter (keeps off-4337185474590)
  ('off-4388860402162'),
  -- Toast (keeps off-7610829588202)
  ('off-9005300801532'),
  ('off-7613404176436'),
  ('off-7613404902967'),
  ('off-7617027851176'),
  -- Toast & Sandwich (keeps off-7610829588226)
  ('off-7613404017012'),
  -- Toast dunkel (keeps off-7613404902981)
  ('off-7610849853328'),
  ('off-7623186244032'),
  -- Toast Schmelzkäse (keeps off-4056489129578)
  ('off-7611700004217'),
  -- Toast Vollkorn (keeps off-4099200009803)
  ('off-7613404249895'),
  -- Tofu geräuchert (keeps off-4099200179209)
  ('off-7623186569234'),
  -- Tofu Natur (keeps off-4012359110107)
  ('off-4104420135888'),
  -- Tofu Nature (keeps off-7627537483552)
  ('off-7613356351356'),
  ('off-9999941860884'),
  ('off-4104420240223'),
  ('off-7623186029332'),
  -- Tomaten (keeps off-7613269296751)
  ('off-7610632984833'),
  ('off-7610029005356'),
  ('off-7617027953429'),
  -- Tomaten gehackt (keeps off-8002510014005)
  ('off-7613312334188'),
  ('off-7610800030447'),
  ('off-4061459487305'),
  -- Tomaten Ketchup (keeps off-4006040292081)
  ('off-87157277'),
  ('off-8715700115900'),
  ('off-4104420031500'),
  ('off-4056489139393'),
  ('off-4018462157008'),
  -- Tomaten Mark (keeps off-24045469)
  ('off-4104420031920'),
  -- Tomaten passiert (keeps off-8000320990113)
  ('off-4069365252758'),
  ('off-7627535915710'),
  ('off-7611654232995'),
  ('off-20163402'),
  ('off-7613331617972'),
  ('off-22114235'),
  -- Tomaten Sauce (keeps off-4002576120003)
  ('off-4005500331407'),
  -- Tomatencremesuppe (keeps off-4037300107326)
  ('off-8712100758379'),
  -- Tomatensauce Basilikum (keeps off-80418870)
  ('off-7613413555505'),
  -- Tomatensauce mit Basilikum (keeps off-7613312323670)
  ('off-7613331631961'),
  ('off-8076809574150'),
  ('off-7610827903328'),
  ('off-8002510200002'),
  ('off-7610029162295'),
  -- Tomatensauce Toscana (keeps off-20431464)
  ('off-4104420031081'),
  -- Tomatensuppe mit Basilikum (keeps off-8710908992742)
  ('off-7610846209029'),
  -- Tomato Ketchup (keeps off-87157116)
  ('off-7610029222081'),
  ('off-8715700407760'),
  -- Tomato Ketchup light (keeps off-8715700423869)
  ('off-7613312429822'),
  -- Tonic Water (keeps off-7617500044101)
  ('off-7617500044118'),
  ('off-4000140072178'),
  ('off-4260310554976'),
  ('off-7611330745856'),
  -- Tonno (keeps off-7613269490807)
  ('off-7613404435526'),
  -- Torino (keeps off-76416262)
  ('off-7610008010692'),
  ('off-7610008071853'),
  -- Tortellini (keeps off-7627536656032)
  ('off-7613404863954'),
  -- Tortelloni (keeps off-20351915)
  ('off-7623186580970'),
  -- Tortelloni Fleisch (keeps off-7613404435472)
  ('off-4061459583397'),
  -- Tortelloni ricotta & spinaci (keeps off-7610807061857)
  ('off-16170353'),
  -- Tortiglioni (keeps off-9100000715667)
  ('off-8001250120236'),
  -- Tortilla (keeps off-8721122734285)
  ('off-7613404564912'),
  -- Tortilla Chips (keeps off-4099200020778)
  ('off-7627534004620'),
  ('off-7613312245743'),
  ('off-8410076481757'),
  ('off-7640102302300'),
  ('off-8410076482617'),
  -- Tortilla Wraps (keeps off-4099200010243)
  ('off-4007552308826'),
  -- Tortillas (keeps off-5412514932473)
  ('off-8410076474209'),
  ('off-7613312425459'),
  ('off-8410076474766'),
  ('off-7613312426265'),
  ('off-7627538232074'),
  ('off-7627538232319'),
  -- Trockenfleisch Anschnitte (keeps off-2172271006956)
  ('off-2172271005300'),
  ('off-2211190004404'),
  ('off-7623186680694'),
  -- Trofie (keeps off-8000139929113)
  ('off-8022903000712'),
  -- Truten Schnitzel (keeps off-2164319006103)
  ('off-2164319009203'),
  ('off-2170986013856'),
  ('off-2111676007854'),
  -- Trutenbrust (keeps off-4056489973355)
  ('off-7617100213310'),
  ('off-7610846331638'),
  ('off-7610029221244'),
  ('off-20230623'),
  ('off-2107659002800'),
  ('off-2115233002153'),
  -- Trutenbrust Geräuchert, Gekocht (keeps off-7610271607766)
  ('off-7610271274098'),
  -- Trutenfleisch (keeps off-4056489675037)
  ('off-7623186629778'),
  ('off-2114746009550'),
  -- Trutenmöckli getrocknet (keeps off-2129091004402)
  ('off-7623186312748'),
  -- Tuna Bowl (keeps off-7627535726361)
  ('off-7613269908937'),
  -- Überraschung (keeps off-4008400510125)
  ('off-5413548020549'),
  -- Udon noodles (keeps off-4061461140540)
  ('off-5060237282766'),
  ('off-7613312434086'),
  -- Ungarische Gulaschsuppe (keeps off-4037300107517)
  ('off-8712100759758'),
  -- Vanille (keeps off-3273227485289)
  ('off-7613269779650'),
  ('off-7617400049145'),
  -- Vanille Bourbon (keeps off-7627535212703)
  ('off-7610029217230'),
  ('off-7617400041590'),
  -- Vanille glace (keeps off-7613312472057)
  ('off-7613312475546'),
  -- Vanille Joghurt (keeps off-7613404162439)
  ('off-7640157790091'),
  ('off-7613269604877'),
  -- Vanille Zucker (keeps off-7610089362277)
  ('off-7613413585182'),
  -- Vanillekipferl (keeps off-7613404201381)
  ('off-42104520'),
  -- Vanillepaste (keeps off-7613312347447)
  ('off-7613312455630'),
  -- Vanillin-Zucker (keeps off-7613312256664)
  ('off-76174506'),
  ('off-4388844112902'),
  -- Veganaise (keeps off-7613312312643)
  ('off-7624841833448'),
  -- Vermicelles (keeps off-7610188155343)
  ('off-7610807061321'),
  ('off-7623186212710'),
  ('off-7613312307816'),
  ('off-76168734'),
  -- Vita 7 (keeps off-7618500948345)
  ('off-7618500949335'),
  -- Vital Gebäck (keeps off-4061459468670)
  ('off-4061459468809'),
  -- Vital-Brötchen (keeps off-7616700129236)
  ('off-7613404016848'),
  -- Vitalgebäck (keeps off-4099200001906)
  ('off-7617400037579'),
  -- Vitamin Rice (keeps off-7627536250063)
  ('off-7627534532529'),
  -- Vogelnestli (keeps off-7613269290025)
  ('off-7610807166347'),
  -- Vollkorn Soft Sandwich (keeps off-9005300019142)
  ('off-9005300019159'),
  -- Vollkorn Toast (keeps off-4056489123903)
  ('off-7610357001662'),
  -- Vollkorn-Haferflocken (keeps off-7610200011428)
  ('off-7610200011435'),
  -- Vollkorn-Haferflöckli (keeps off-7610200020826)
  ('off-7610200246745'),
  ('off-7610827335921'),
  -- Vollkorn-Haferflöckli fein (keeps off-7610029164626)
  ('off-7613312403860'),
  -- Vollkornmehl (keeps off-7610200104267)
  ('off-7613312489727'),
  ('off-7610800017806'),
  -- Vollkornreis (keeps off-20620387)
  ('off-7610809039694'),
  -- Vollkornreiswaffeln (keeps off-7610200284426)
  ('off-7613312426685'),
  ('off-7617027200332'),
  -- Vollmilch (keeps off-7610900288861)
  ('off-7627534811433'),
  ('off-7610848360643'),
  ('off-7610200390998'),
  ('off-7610029004410'),
  ('off-7610200243430'),
  ('off-20244385'),
  ('off-7610198075693'),
  ('off-7610200313980'),
  ('off-7623186091162'),
  ('off-4061462630392'),
  -- Vollmilch 3.5% Fett (keeps off-7640148580014)
  ('off-7610900129966'),
  -- Vollmilch PAST (keeps off-7624841865470)
  ('off-7610200035172'),
  -- Vollrahm (keeps off-7613269880585)
  ('off-7627534547196'),
  ('off-4099200407142'),
  ('off-76123559'),
  ('off-7610200380180'),
  ('off-7624841701013'),
  ('off-7613269780113'),
  ('off-7612300013494'),
  ('off-7610800021056'),
  ('off-7617027885157'),
  ('off-7610900130207'),
  ('off-7627534202521'),
  ('off-7610807242263'),
  -- Vollreis (keeps off-5410673000309)
  ('off-7610200010919'),
  -- Vollreiswaffeln (keeps off-0686414041497)
  ('off-7613413041497'),
  ('off-0055742503425'),
  -- Vorzugs Butter (keeps off-7612300531219)
  ('off-7610029180909'),
  -- Vorzugsbutter (keeps blv-49)
  ('off-7617027159111'),
  -- Wähenguss süss (keeps off-7617400020441)
  ('off-7613331257062'),
  -- Waldfrucht Konfitüre Extra (keeps off-4311501457207)
  ('off-22112538'),
  -- Waldhonig (keeps off-7610029155464)
  ('off-7613269356257'),
  ('off-7613356187061'),
  -- Walliser Rohschinken (keeps off-2153815007554)
  ('off-2153815008803'),
  -- Walnüsse (keeps off-7624841286589)
  ('off-20764081'),
  -- Walnusskerne (keeps off-4008258130018)
  ('off-4099200022208'),
  ('off-7613269193128'),
  ('off-7613312423127'),
  ('off-7613269273127'),
  ('off-4311596458097'),
  ('off-4104420025066'),
  -- Wasabi-Paste (keeps off-7640147861114)
  ('off-7615900010702'),
  ('off-4013200885007'),
  -- Wedges (keeps off-7610200335609)
  ('off-7613312384565'),
  ('off-7613312342145'),
  -- Weggli (keeps off-7627537984226)
  ('off-2066151560006'),
  ('off-7613404017005'),
  -- Weggli mit Schinken (keeps off-2102506004600)
  ('off-0792649585191'),
  -- Weichkäse (keeps off-7610200401366)
  ('off-2164904008352'),
  ('off-3161712000171'),
  -- Weihnachtsguetzli (keeps off-7610032004513)
  ('off-7616500946835'),
  -- Weinländerbrot (keeps off-7610807008241)
  ('off-4627546982858'),
  -- Weisse Bohnen (keeps off-7616800800455)
  ('off-7616800823546'),
  ('off-7616800800400'),
  ('off-7610800016618'),
  -- Weisse Schokolade (keeps off-4001743023406)
  ('off-7610034517554'),
  ('off-7613287037787'),
  -- Weisse Spargeln (keeps off-4099200012131)
  ('off-7613312035771'),
  -- Weisse Spargelspitzen (keeps off-7617027558075)
  ('off-7613312261729'),
  -- Weissmehl (keeps off-4099200400112)
  ('off-4099200400129'),
  ('off-7610177003174'),
  ('off-7610029004533'),
  ('off-7610809112571'),
  ('off-7610803012020'),
  ('off-7610803012068'),
  ('off-7610803008863'),
  ('off-7617027015011'),
  ('off-7617027015035'),
  -- Weizenbrot (keeps off-7613379510129)
  ('off-7613404892657'),
  -- Wellenspätzli (keeps off-7610849838943)
  ('off-7613312314715'),
  -- Whey Proteinpulver Vanillearoma (keeps off-7613312213131)
  ('off-7613312320747'),
  -- Wiener Waffeln (keeps off-7617400037814)
  ('off-7613269457886'),
  -- Wild Rice Mix (keeps off-7613312524732)
  ('off-7627536249708'),
  -- Wildlachs (keeps off-7623186753633)
  ('off-7613312030400'),
  -- Wildreis Mix (keeps off-20694418)
  ('off-5410673000972'),
  -- Wyländer Bauernschinken (keeps off-2160151007308)
  ('off-2160151006301'),
  ('off-2160151006752'),
  -- Yogos Feige (keeps off-22138026)
  ('off-7613404568385'),
  -- Yogourt (keeps off-7610029209167)
  ('off-7610900127115'),
  -- Yogourt marrons (keeps off-7610029196917)
  ('off-7613404179727'),
  -- Yogurt (keeps off-7649997198012)
  ('off-7611654395027'),
  -- Yogurt Greek Style Erdbeere (keeps off-7613269501305)
  ('off-7613404291979'),
  -- Yucatan Mischsalad (keeps off-7617027631693)
  ('off-7613404657928'),
  -- Ziegenkäse (keeps off-2316729002699)
  ('off-4335619042568'),
  ('off-4061461204754'),
  ('off-4061463790293'),
  ('off-19823287'),
  ('off-2822401002555'),
  -- Zimtsterne (keeps off-7617400030204)
  ('off-7617400034103'),
  ('off-7617400038750'),
  -- Zitrone (keeps off-7617027041973)
  ('off-7616800835266'),
  ('off-7610338888053'),
  -- Zitrone Joghurt (keeps off-22016201)
  ('off-7616600708906'),
  -- Zitronen-Cake (keeps off-7616700174878)
  ('off-7613331518446'),
  -- Zitronensirup (keeps off-7610809034897)
  ('off-7627534343965'),
  -- Zitronentee (keeps off-8055732940096)
  ('off-8001120876867'),
  -- Zöpfli Vorderschinken (keeps off-7617027974790)
  ('off-7623186088841'),
  -- Zopfmehl (keeps off-7610172100748)
  ('off-20695163'),
  ('off-7617027015172'),
  ('off-20220235'),
  ('off-7610809112588'),
  ('off-7610803010149'),
  ('off-7611330786743'),
  ('off-7610800037194'),
  -- Zucker (keeps off-20379407)
  ('off-7610200010148'),
  ('off-7610278001413'),
  ('off-7624841601337'),
  ('off-7610278033100'),
  -- Zuckermais (keeps off-2151117004301)
  ('off-2151117005001'),
  ('off-2184242004007'),
  ('off-7613356084476'),
  -- Zuckersticks (keeps off-7610200270825)
  ('off-7624841665681'),
  -- Zuckerstreusel (keeps off-4311501358665)
  ('off-7613312295762'),
  -- Zürcher Geschnetzeltes (keeps off-7640346310161)
  ('off-7613269685692'),
  ('off-7640342961916'),
  ('off-7611100034890'),
  ('off-7613034352477'),
  ('off-7613031224074'),
  -- Zwetschgen (keeps off-7613312112083)
  ('off-3045320003604'),
  ('off-7610200069016'),
  -- Zwetschgenwähe (keeps off-7610807087291)
  ('off-7623186343056'),
  -- Zwieback Original (keeps off-7617400030723)
  ('off-7610032000010'),
  -- Zwiebeln (keeps off-7610632963227)
  ('off-7610632993224'),
  -- Zwiebelschmelz (keeps off-4311501467992)
  ('off-4019736005056')
) as v(id)
where f.id = v.id
  and f.active;
