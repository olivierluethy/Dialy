-- Dialy: collapse preparation variants. BLS lists many foods once per way of
-- cooking ("Alaska-Seelachs paniert, tiefgefroren" plus "…, frittiert",
-- "…, gebraten ohne Fett (Ofen)", "…, gebraten ohne Fett (Pfanne)").
-- Per food the base entry stays active (no preparation suffix, else "roh",
-- else "gekocht"). Another variant stays only if its carbs differ clearly
-- (more than 5 g and more than 20 %) from every entry already kept, so
-- "Reis, roh" and "Reis, gekocht" both remain. The rest get active = false;
-- nothing is deleted.
--
-- 704 foods, 1461 variants hidden. The foods_touch_updated_at trigger
-- (0010) bumps updated_at, so the app drops them on its next sync.

update public.foods f
set active = false
from (values
  -- Aal roh (keeps bls-T041100)
  ('bls-T041152'),
  ('bls-T041182'),
  -- Alaska-Pollack/Alaska-Seelachs, roh (keeps bls-T213100)
  ('bls-T213172'),
  ('bls-T213152'),
  ('bls-T213162'),
  ('bls-T213182'),
  -- Alaska-Pollack/Alaska-Seelachs, tiefgefroren (keeps bls-T213200)
  ('bls-T213272'),
  ('bls-T213252'),
  ('bls-T213262'),
  ('bls-T213282'),
  -- Alaska-Seelachs im Backteig, tiefgefroren (keeps bls-T930700)
  ('bls-T930792'),
  ('bls-T930762'),
  ('bls-T930782'),
  -- Alaska-Seelachs paniert, tiefgefroren (keeps bls-T934200)
  ('bls-T934292'),
  ('bls-T934262'),
  ('bls-T934282'),
  -- Amaranth (keeps off-4104420220607; also kept: Amaranth gekocht [19.9])
  ('bls-C335000'),
  -- Ananas (keeps off-7613269260707)
  ('blv-377'),
  ('bls-F501152'),
  -- Apfel (keeps food-apfel)
  ('blv-378'),
  ('bls-F110152'),
  -- Apfel geschält, roh (keeps bls-F120100)
  ('bls-F120152'),
  -- Aprikose (keeps off-4106060015179)
  ('blv-379'),
  ('bls-F201152'),
  -- Artischocke in Öl, Konserve, abgetropft (keeps bls-G410702)
  ('bls-G410732'),
  -- Artischocke roh (keeps bls-G410100)
  ('bls-G410132'),
  -- Artischocken (keeps off-7613269146759)
  ('bls-X5A6010'),
  -- Aubergine, roh (keeps blv-349)
  ('bls-G510132'),
  ('bls-G510162'),
  ('bls-G510172'),
  ('bls-G510182'),
  -- Auberginenscheiben gebraten (keeps bls-X551142)
  ('bls-X551162'),
  -- Austernpilz getrocknet (keeps bls-K740400)
  ('bls-K740432'),
  -- Austernpilz roh (keeps bls-K740100)
  ('bls-K740152'),
  ('bls-K740182'),
  -- Baby-Pute Fleisch, mit Haut, roh (keeps bls-V402100)
  ('bls-V402162'),
  ('bls-V402182'),
  -- Bachsaibling roh (keeps bls-T403100)
  ('bls-T403152'),
  ('bls-T403182'),
  -- Bambussprossen (keeps off-4099200121017)
  ('bls-H610100'),
  ('bls-H610132'),
  ('bls-H610182'),
  ('bls-X574012'),
  -- Banane (keeps food-banane)
  ('blv-381'),
  -- Bärlauch (keeps off-7640175280178)
  ('bls-G492100'),
  -- Barsch/Flussbarsch, roh (keeps bls-T601100)
  ('bls-T601152'),
  ('bls-T601162'),
  ('bls-T601182'),
  -- Barsch/Flussbarsch, tiefgefroren (keeps bls-T601200)
  ('bls-T601272'),
  ('bls-T601252'),
  ('bls-T601282'),
  -- Basilikum (keeps off-7610848066323)
  ('blv-464'),
  -- Batate/Süßkartoffel, roh (keeps bls-K420100; also kept: Batate/Süßkartoffel, gekocht [12.8], Batate/Süßkartoffel, gebacken [32.4])
  ('bls-K420182'),
  -- Beerenmischung mit Sauerkirschen, ungesüßt, roh (keeps bls-F092100)
  ('bls-F092152'),
  -- Berner Würstchen (keeps bls-W211400)
  ('bls-W211472'),
  ('bls-W211482'),
  -- Bierschinken (keeps bls-W271000)
  ('bls-Y022322'),
  -- Birkenpilz roh (keeps bls-K704100)
  ('bls-K704152'),
  ('bls-K704182'),
  -- Birne (keeps off-7613269303503; also kept: Birne, roh [10.9])
  ('bls-F130152'),
  -- Blattspinat (keeps off-4099200409399)
  ('bls-X522012'),
  -- Blei/Brachsen/Brasse, roh (keeps bls-T502100)
  ('bls-T502182'),
  -- Blei/Brachsen/Brasse, tiefgefroren (keeps bls-T502200)
  ('bls-T502252'),
  ('bls-T502282'),
  -- Bleichsellerie roh (keeps bls-G220100)
  ('bls-G220132'),
  ('bls-X573212'),
  ('bls-G220162'),
  ('bls-G220152'),
  ('bls-G221182'),
  -- Blumenkohl (keeps off-7613269172475; also kept: Blumenkohl gebraten ohne Fett (Pfanne) [10.7])
  ('blv-350'),
  ('bls-G311132'),
  ('bls-G311162'),
  ('bls-G311152'),
  ('bls-X531612'),
  -- Blumenkohl tiefgefroren (keeps bls-G311200; also kept: Blumenkohl tiefgefroren, gebraten ohne Fett (Pfanne) [11.2])
  ('bls-G311232'),
  ('bls-G311242'),
  ('bls-G311262'),
  ('bls-G311252'),
  -- Böhmische Knödel (keeps bls-X981662)
  ('bls-E608000'),
  ('bls-E608032'),
  ('bls-E608082'),
  -- Bohne grün, gekocht (keeps bls-G710132)
  ('bls-G710162'),
  ('bls-G710152'),
  ('bls-G710182'),
  -- Bohne grün, tiefgefroren (keeps bls-G710200)
  ('bls-G710232'),
  ('bls-G710262'),
  ('bls-G710252'),
  ('bls-G710282'),
  -- Bratwurst (keeps off-7617100217806)
  ('bls-Y021312'),
  -- Bratwurst mittelgrob (keeps bls-W222100)
  ('bls-W222172'),
  ('bls-W222182'),
  -- Brennnessel roh (keeps bls-G261100)
  ('bls-G261132'),
  ('bls-G261152'),
  -- Broccoli (keeps off-7613269172451)
  ('blv-351'),
  ('bls-G312132'),
  ('bls-G312162'),
  ('bls-G312152'),
  ('bls-G312182'),
  ('bls-X532512'),
  -- Broccoli tiefgefroren (keeps bls-G312200)
  ('bls-G312232'),
  ('bls-G312262'),
  ('bls-G312252'),
  ('bls-G312282'),
  -- Brombeere, roh (keeps blv-383)
  ('bls-F303152'),
  -- Brosme/Lumb, roh (keeps bls-T201100)
  ('bls-T201152'),
  ('bls-T201182'),
  -- Buchweizen (keeps off-7610200044495; also kept: Buchweizen gekocht [21], Buchweizen gekocht (mit Fett und Salz) [15.8])
  ('bls-C322000'),
  -- Buckellachs roh (keeps bls-T412100)
  ('bls-T412152'),
  ('bls-T412182'),
  -- Buckellachs tiefgefroren (keeps bls-T412200)
  ('bls-T412252'),
  ('bls-T412282'),
  -- Butterpilz roh (keeps bls-K706100)
  ('bls-K706152'),
  ('bls-K706182'),
  -- Champignon tiefgefroren (keeps bls-K701200)
  ('bls-K701262'),
  ('bls-K701242'),
  ('bls-K701282'),
  -- Champignon, roh (keeps blv-375)
  ('bls-K701132'),
  ('bls-K701162'),
  ('bls-K701172'),
  ('bls-K701182'),
  -- Chayote roh (keeps bls-G583100)
  ('bls-G583132'),
  ('bls-G583182'),
  -- Chicoree gebacken (keeps bls-G101162)
  ('bls-G101152'),
  ('bls-G101182'),
  ('bls-X526162'),
  -- Chinakohl, roh (keeps blv-437)
  ('bls-G321132'),
  ('bls-G321162'),
  ('bls-G321182'),
  -- Corned Beef (keeps bls-W520000)
  ('bls-W520032'),
  -- Crevetten Tail-on (keeps off-7613269304012)
  ('off-7613269164593'),
  -- Currybratwurst (keeps bls-W221300)
  ('bls-W221372'),
  ('bls-W221382'),
  -- Dicke Bohne unreif, roh (keeps bls-G730100)
  ('bls-G730132'),
  -- Dicke Bohne unreif, tiefgefroren (keeps bls-G730200)
  ('bls-G730232'),
  -- Dornhai roh (keeps bls-T033100)
  ('bls-T033152'),
  ('bls-T033182'),
  -- Dorsch/Kabeljau, roh (keeps bls-T204100)
  ('bls-T204172'),
  ('bls-T204152'),
  ('bls-T204162'),
  ('bls-T204182'),
  -- Dorsch/Kabeljau, tiefgefroren (keeps bls-T204200)
  ('bls-T204272'),
  ('bls-T204252'),
  ('bls-T204262'),
  ('bls-T204282'),
  -- Dorschleber roh (keeps bls-T045100)
  ('bls-T045182'),
  -- Edel-Reizker roh (keeps bls-K707100)
  ('bls-K707152'),
  ('bls-K707182'),
  -- Edelkastanie/Marone (keeps bls-H230100)
  ('bls-H230132'),
  ('bls-H230162'),
  ('bls-H230172'),
  ('bls-H230182'),
  -- Edelkrebs/Flusskrebs, roh (keeps bls-T710100)
  ('bls-T710132'),
  ('bls-T710172'),
  ('bls-T710182'),
  -- Edelkrebs/Flusskrebs, tiefgefroren (keeps bls-T710200)
  ('bls-T710232'),
  ('bls-T710282'),
  -- Eier (keeps off-7610809052419)
  ('off-7613269850052'),
  -- Eier-Frischteigwaren Ravioli (Fleischfüllung) roh (keeps bls-E603000; also kept: Eier-Frischteigwaren Ravioli (Fleischfüllung) gekocht [20])
  ('bls-E603062'),
  ('bls-E603082'),
  ('bls-E603022'),
  -- Eier-Frischteigwaren Ravioli (Gemüsefüllung) roh (keeps bls-E470000; also kept: Eier-Frischteigwaren Ravioli (Gemüsefüllung) gekocht [24.5])
  ('bls-E470162'),
  ('bls-E470082'),
  ('bls-E470042'),
  -- Eier-Frischteigwaren roh (keeps bls-E438000; also kept: Eier-Frischteigwaren gekocht [29.6])
  ('bls-E438062'),
  ('bls-E438082'),
  -- Eierteigwaren roh (keeps bls-E432000; also kept: Eierteigwaren gekocht [24.7])
  ('bls-E430062'),
  ('bls-E430082'),
  -- Eisbergsalat (keeps off-7610807156485)
  ('blv-459'),
  -- Ente Brust, mit Haut, gegrillt (keeps bls-V466172)
  ('bls-V466162'),
  ('bls-V466182'),
  -- Ente Fleisch, mit Haut, mariniert, roh (keeps bls-V469000)
  ('bls-V469072'),
  -- Ente Fleisch, mit Haut, roh (keeps bls-V464100)
  ('bls-V464132'),
  ('bls-V464172'),
  ('bls-V464162'),
  ('bls-V464182'),
  -- Ente Fleisch, mit Haut, tiefgefroren (keeps bls-V464200)
  ('bls-V464232'),
  ('bls-V464272'),
  ('bls-V464262'),
  ('bls-V464282'),
  -- Ente Fleisch, ohne Haut, roh (keeps bls-V463000)
  ('bls-V463132'),
  ('bls-V463172'),
  ('bls-V463162'),
  ('bls-V463182'),
  -- Ente Innereien, roh (keeps bls-V468100)
  ('bls-V468182'),
  -- Ente Innereien, tiefgefroren (keeps bls-V468200)
  ('bls-V468282'),
  -- Ente Leber, roh (keeps bls-V635100)
  ('bls-V635182'),
  -- Ente Leber, tiefgefroren (keeps bls-V635200)
  ('bls-V635282'),
  -- Ente Schenkel, mit Haut, roh (keeps bls-V465100)
  ('bls-V465172'),
  ('bls-V465162'),
  ('bls-V465182'),
  -- Ente Schenkel, mit Haut, tiefgefroren (keeps bls-V465200)
  ('bls-V465272'),
  ('bls-V465262'),
  ('bls-V465282'),
  -- Entenei roh (keeps bls-E131100)
  ('bls-E131132'),
  -- Erbse grün, gekocht (keeps bls-G760132)
  ('bls-G760162'),
  ('bls-G760152'),
  ('bls-G760182'),
  -- Erbse grün, tiefgefroren (keeps bls-G760200)
  ('bls-G760232'),
  ('bls-G760262'),
  ('bls-G760252'),
  ('bls-G760282'),
  -- Erdbeere (keeps off-7610200371034; also kept: Erdbeere, roh [6])
  ('bls-F301152'),
  -- Europäische Auster roh (keeps bls-T780100)
  ('bls-T780152'),
  ('bls-T780172'),
  ('bls-T780182'),
  -- Europäische Auster tiefgefroren (keeps bls-T780200)
  ('bls-T780252'),
  ('bls-T780272'),
  ('bls-T780282'),
  -- Fasan Fleisch, mit Haut, roh (keeps bls-V311100)
  ('bls-V311162'),
  -- Fasan Fleisch, mit Haut, tiefgefroren (keeps bls-V311200)
  ('bls-V311262'),
  -- Felchen/Maräne/Renke/Schnäpel, roh (keeps bls-T406100)
  ('bls-T406152'),
  ('bls-T406182'),
  -- Felchen/Maräne/Renke/Schnäpel, tiefgefroren (keeps bls-T406200)
  ('bls-T406252'),
  ('bls-T406282'),
  -- Fenchel, roh (keeps blv-352)
  ('bls-X572812'),
  -- Fischfrikadelle (Alaska-Seelachs) paniert, tiefgefroren (keeps bls-T930800)
  ('bls-T930892'),
  ('bls-T930862'),
  ('bls-T930882'),
  -- Fischstäbchen (Alaska-Seelachs) paniert, tiefgefroren (keeps bls-T930100)
  ('bls-T930162'),
  ('bls-T930182'),
  -- Flammkuchen (keeps off-4061464977877)
  ('blv-1504'),
  -- Flammkuchenteig (keeps off-7613404725023)
  ('blv-14208'),
  -- Fleischerzeugnis (keeps off-2280950004558)
  ('off-7623187036506'),
  -- Fleischkäse (keeps blv-1084)
  ('bls-Y025022'),
  -- Fleischkäse einfach, fein/Original Bayerischer Leberkäse fein (keeps bls-W233000)
  ('bls-W233032'),
  ('bls-W233062'),
  ('bls-W233082'),
  -- Fleischkäse fettreduziert (keeps bls-W237000)
  ('bls-W237032'),
  ('bls-W237062'),
  ('bls-W237082'),
  -- Fleischkäse grob (keeps bls-W256200)
  ('bls-W256232'),
  ('bls-W256262'),
  ('bls-W256282'),
  -- Fleischwurst (keeps bls-W234000)
  ('bls-W234032'),
  ('bls-W234062'),
  ('bls-W234082'),
  -- Flunder, roh (keeps blv-481)
  ('bls-T311152'),
  ('bls-T311182'),
  -- Forelle tiefgefroren (keeps bls-T422200)
  ('bls-T422272'),
  ('bls-T420252'),
  ('bls-T420262'),
  ('bls-T420282'),
  -- Forelle, roh (keeps blv-289)
  ('bls-T420172'),
  ('bls-T420152'),
  ('bls-T420162'),
  ('bls-T420182'),
  -- Frühlingszwiebel/Lauchzwiebel (ohne Laub) roh (keeps bls-G486100)
  ('bls-G486132'),
  ('bls-G486162'),
  ('bls-G486152'),
  ('bls-G486182'),
  -- Frühlingszwiebel/Lauchzwiebel, roh (keeps bls-G482100)
  ('bls-G482132'),
  ('bls-G482162'),
  ('bls-G482152'),
  ('bls-G482182'),
  -- Gans Fleisch, mit Haut, roh (keeps bls-V474100)
  ('bls-V474132'),
  ('bls-V474172'),
  ('bls-V474162'),
  ('bls-V474182'),
  -- Gans Fleisch, mit Haut, tiefgefroren (keeps bls-V474200)
  ('bls-V474232'),
  ('bls-V474272'),
  ('bls-V474262'),
  ('bls-V474282'),
  -- Gans Fleisch, ohne Haut, roh (keeps bls-V471100)
  ('bls-V476132'),
  ('bls-V476172'),
  ('bls-V476162'),
  ('bls-V476182'),
  -- Gans Innereien, roh (keeps bls-V478100)
  ('bls-V478182'),
  -- Gans Innereien, tiefgefroren (keeps bls-V478200)
  ('bls-V478282'),
  -- Gans Leber, roh (keeps bls-V636100)
  ('bls-V636182'),
  -- Gans Schenkel tiefgefroren, gebraten ohne Fett (Ofen) (keeps bls-V475262)
  ('bls-V475282'),
  -- Gans Schenkel, mit Haut, roh (keeps bls-V475100)
  ('bls-V475162'),
  ('bls-V475182'),
  -- Gänseei roh (keeps bls-E141100)
  ('bls-E141132'),
  -- Garnele/Granat/Krabbe, roh (keeps bls-T753100)
  ('bls-T753132'),
  ('bls-T753172'),
  ('bls-T753182'),
  -- Garnele/Granat/Krabbe, tiefgefroren (keeps bls-T753200)
  ('bls-T753232'),
  ('bls-T753272'),
  ('bls-T753252'),
  ('bls-T753282'),
  -- Geflügel Frikadelle, roh (keeps bls-V990100)
  ('bls-V990162'),
  ('bls-V990182'),
  -- Geflügelbratwurst (keeps bls-W223100)
  ('bls-W223172'),
  ('bls-W223182'),
  -- Geflügelfleischkäse mit Schweinefleisch (keeps bls-W238000)
  ('bls-W238032'),
  -- Geflügelmortadella (keeps bls-W288100)
  ('bls-W288132'),
  ('bls-W288162'),
  ('bls-W288182'),
  -- Gelbflossen-Thun roh (keeps bls-T124100)
  ('bls-T124152'),
  ('bls-T124182'),
  -- Gelbflossen-Thun tiefgefroren (keeps bls-T124200)
  ('bls-T124252'),
  ('bls-T124282'),
  -- Gemüse (keeps off-7613269296812)
  ('off-7613312163962'),
  -- Gemüseamaranth roh (keeps bls-G212100)
  ('bls-G212152'),
  ('bls-G212182'),
  -- Gemüseartischocke/Kardone, roh (keeps bls-G414100)
  ('bls-G414132'),
  -- Gemüsefenchel roh (keeps bls-G430100)
  ('bls-G430132'),
  ('bls-G430162'),
  ('bls-G430152'),
  ('bls-G430182'),
  -- Gemüsemischung (keeps off-7610029220346)
  ('bls-X518233'),
  -- Gemüsemischung asiatische Art, roh (keeps bls-G994100)
  ('bls-G994132'),
  ('bls-G994162'),
  ('bls-G994152'),
  ('bls-G994182'),
  -- Gemüsemischung asiatische Art, tiefgefroren (keeps bls-G994200)
  ('bls-G994232'),
  ('bls-G994262'),
  ('bls-G994252'),
  ('bls-G994282'),
  -- Gemüsemischung Erbsen-Karotten, roh (keeps bls-G992100)
  ('bls-G992132'),
  ('bls-G992162'),
  ('bls-G992152'),
  ('bls-G992182'),
  -- Gemüsemischung Erbsen-Karotten, tiefgefroren (keeps bls-G992200)
  ('bls-G992232'),
  ('bls-G992262'),
  ('bls-G992252'),
  ('bls-G992282'),
  -- Gemüsemischung Kaisergemüse, roh (keeps bls-G090100)
  ('bls-G090132'),
  ('bls-G090162'),
  ('bls-G090152'),
  ('bls-G090182'),
  -- Gemüsemischung Kaisergemüse, tiefgefroren (keeps bls-G090200)
  ('bls-G090232'),
  ('bls-G090262'),
  ('bls-G090252'),
  ('bls-G090282'),
  -- Gemüsemischung Leipziger Allerlei, tiefgefroren (keeps bls-G920200)
  ('bls-G920232'),
  ('bls-G920252'),
  -- Gemüsemischung mexikanische Art, roh (keeps bls-G993100)
  ('bls-G993132'),
  ('bls-G993152'),
  ('bls-G993182'),
  -- Gemüsemischung mexikanische Art, tiefgefroren (keeps bls-G993200)
  ('bls-G993232'),
  ('bls-G993252'),
  ('bls-G993282'),
  -- Gemüsepaprika gelb, roh (keeps bls-G542100)
  ('bls-G542132'),
  ('bls-G542162'),
  ('bls-G542172'),
  ('bls-G542152'),
  ('bls-G542182'),
  -- Gemüsepaprika grün, roh (keeps bls-G541100)
  ('bls-G541032'),
  ('bls-G541072'),
  ('bls-G541162'),
  ('bls-G541152'),
  ('bls-G541082'),
  -- Gemüsepaprika rot, roh (keeps bls-G543100)
  ('bls-G543032'),
  ('bls-G543072'),
  ('bls-G543162'),
  ('bls-G543152'),
  ('bls-G543082'),
  -- Gnocchi (keeps off-4061459583380; also kept: Gnocchi gekocht, gebacken [45.5])
  ('bls-K270000'),
  ('bls-K270032'),
  ('bls-K270082'),
  ('bls-K270022'),
  -- Gnocchi tiefgefroren (keeps bls-K271000)
  ('bls-K271032'),
  -- Goldbutt/Scholle, roh (keeps bls-T305100)
  ('bls-T305172'),
  ('bls-T305152'),
  ('bls-T305162'),
  ('bls-T305182'),
  -- Goldbutt/Scholle, tiefgefroren (keeps bls-T305200)
  ('bls-T305272'),
  ('bls-T305252'),
  ('bls-T305262'),
  ('bls-T305282'),
  -- Granatapfel (keeps off-7613269636427)
  ('blv-13882'),
  -- Grenadier roh (keeps bls-T200100)
  ('bls-T200152'),
  ('bls-T200182'),
  -- Grießklößchen getrocknet (keeps bls-E607100; also kept: Grießklößchen getrocknet, gekocht [12.1])
  ('bls-E607182'),
  -- Grießklößchen roh (keeps bls-E607000)
  ('bls-E607032'),
  -- Große Sandklaffmuschel roh (keeps bls-T791100)
  ('bls-T791132'),
  -- Große Sandklaffmuschel tiefgefroren (keeps bls-T791200)
  ('bls-T791232'),
  -- Grüne Bohnen (keeps off-7610200244598)
  ('bls-X5A8000'),
  ('bls-X571143'),
  -- Grünkern Vollkornschrot (keeps bls-C412000; also kept: Grünkern Vollkornschrot, gekocht [8.9])
  ('bls-C412182'),
  -- Grünkohl (keeps off-40804095)
  ('bls-G322100'),
  ('bls-G322132'),
  ('bls-G322142'),
  ('bls-G322152'),
  ('bls-G322182'),
  ('bls-X572712'),
  -- Grünkohl tiefgefroren (keeps bls-G322200)
  ('bls-G322232'),
  ('bls-G322242'),
  ('bls-G322252'),
  ('bls-G322282'),
  -- Gurke, roh (keeps blv-354)
  ('bls-G520132'),
  ('bls-G520062'),
  ('bls-G520152'),
  ('bls-G520182'),
  -- Gurken (keeps off-7617027852241)
  ('bls-X552043'),
  -- Hafer Grütze (keeps bls-C137000; also kept: Hafer Grütze, gekocht [10])
  ('bls-X987812'),
  -- Hähnchen Brust, ohne Haut, roh (keeps bls-V4A6100)
  ('bls-V4A6172'),
  ('bls-V4A6162'),
  ('bls-V4A6182'),
  -- Hähnchen Brustfilet, mariniert, roh (keeps bls-V421000)
  ('bls-V421072'),
  -- Hähnchen Brustfilet, roh (keeps bls-V416100)
  ('bls-V416132'),
  ('bls-V416172'),
  ('bls-V416162'),
  ('bls-V416182'),
  -- Hähnchen Brustfilet, tiefgefroren (keeps bls-V416200)
  ('bls-V416272'),
  ('bls-V416262'),
  ('bls-V416282'),
  -- Hähnchen Fleisch, ohne Haut, roh (keeps bls-V413000)
  ('bls-V413132'),
  ('bls-V413172'),
  ('bls-V413182'),
  -- Hähnchen Fleisch, ohne Haut, tiefgefroren (keeps bls-V413200)
  ('bls-V413232'),
  ('bls-V413272'),
  ('bls-V413282'),
  -- Hähnchen Flügel, mit Haut, mariniert, roh (keeps bls-V419000)
  ('bls-V419072'),
  ('bls-V419062'),
  -- Hähnchen Flügel, mit Haut, roh (keeps bls-V417100)
  ('bls-V417172'),
  ('bls-V417162'),
  ('bls-V417182'),
  -- Hähnchen Flügel, mit Haut, tiefgefroren (keeps bls-V417200)
  ('bls-V417272'),
  ('bls-V417262'),
  ('bls-V417282'),
  -- Hähnchen ganz, entbeint, mit Haut, roh (keeps bls-V414100)
  ('bls-V414172'),
  ('bls-V414162'),
  -- Hähnchen ganz, entbeint, mit Haut, tiefgefroren (keeps bls-V414200)
  ('bls-V414272'),
  ('bls-V414262'),
  -- Hähnchen Herz, roh (keeps bls-V614100)
  ('bls-V614182'),
  -- Hähnchen Herz, tiefgefroren (keeps bls-V614200)
  ('bls-V614282'),
  -- Hähnchen Innereien, roh (keeps bls-V604100)
  ('bls-V604182'),
  -- Hähnchen Leber, roh (keeps bls-V634100)
  ('bls-V634182'),
  -- Hähnchen Leber, tiefgefroren (keeps bls-V634200)
  ('bls-V634282'),
  -- Hähnchen Magen, roh (keeps bls-V654100)
  ('bls-V654182'),
  -- Hähnchen Magen, tiefgefroren (keeps bls-V654200)
  ('bls-V654282'),
  -- Hähnchen Oberschenkel, mit Haut, roh (keeps bls-V4A5100)
  ('bls-V4A5172'),
  ('bls-V4A5162'),
  ('bls-V4A5182'),
  -- Hähnchen Unterschenkel, mit Haut, mariniert, roh (keeps bls-V420000)
  ('bls-V420072'),
  -- Hähnchen Unterschenkel, mit Haut, roh (keeps bls-V4B5100)
  ('bls-V4B5172'),
  ('bls-V4B5162'),
  ('bls-V4B5182'),
  -- Hallimasch roh (keeps bls-K709100)
  ('bls-K709152'),
  ('bls-K709182'),
  -- Halloumi Grillkäse (keeps bls-M524500)
  ('bls-M524562'),
  ('bls-M524572'),
  ('bls-M524582'),
  -- Hammel Brust, roh (keeps bls-U856100)
  ('bls-U856132'),
  ('bls-U856162'),
  -- Hammel Bug/Schulter, roh (keeps bls-U866100)
  ('bls-U866132'),
  ('bls-U866162'),
  -- Hammel Filet/Lende, roh (keeps bls-U816100)
  ('bls-U816172'),
  ('bls-U816162'),
  -- Hammel Herz, roh (keeps bls-V516100)
  ('bls-V516182'),
  -- Hammel Hirn, roh (keeps bls-V526100)
  ('bls-V526132'),
  -- Hammel Keule, roh (keeps bls-U886100)
  ('bls-U886162'),
  -- Hammel Kotelett, roh (keeps bls-U726100)
  ('bls-U726172'),
  ('bls-U726162'),
  ('bls-U726182'),
  -- Hammel Leber, roh (keeps bls-V536100)
  ('bls-V536182'),
  -- Hammel Lunge, roh (keeps bls-V546100)
  ('bls-V546132'),
  -- Hammel Zunge, roh (keeps bls-V596100)
  ('bls-V596132'),
  -- Hase Fleisch, roh (keeps bls-V232100)
  ('bls-V232162'),
  -- Hase Fleisch, tiefgefroren (keeps bls-V232200)
  ('bls-V232262'),
  -- Hecht, roh (keeps blv-416)
  ('bls-T064152'),
  ('bls-T060182'),
  -- Heidelbeere (keeps off-3608580791577; also kept: Heidelbeere, roh [10.6])
  ('bls-F304152'),
  -- Heilbutt/Weißer Heilbutt, roh (keeps bls-T306100)
  ('bls-T306152'),
  ('bls-T306182'),
  -- Heilbutt/Weißer Heilbutt, tiefgefroren (keeps bls-T306200)
  ('bls-T306252'),
  ('bls-T306282'),
  -- Helle Zungenwurst (keeps bls-W275200)
  ('bls-W275232'),
  -- Hering roh (keeps bls-T102100)
  ('bls-T102162'),
  ('bls-T102182'),
  -- Himbeere (keeps off-7610849226757; also kept: Himbeere, roh [5.8])
  ('bls-F302152'),
  -- Hinterschinken (keeps blv-691)
  ('off-2171624004601'),
  -- Hirsch Fleisch, roh (keeps bls-V212100)
  ('bls-V212132'),
  ('bls-V212162'),
  ('bls-V212182'),
  -- Hirsch Rücken, roh (keeps bls-V217100)
  ('bls-V217162'),
  -- Hirsch Rücken, tiefgefroren (keeps bls-V217200)
  ('bls-V217262'),
  -- Hirse (keeps off-7613312389782; also kept: Hirse gekocht [26.8])
  ('bls-C332000'),
  ('bls-X951312'),
  -- Hornfisch/Hornhecht, roh (keeps bls-T061100)
  ('bls-T061152'),
  ('bls-T061182'),
  -- Hühnerei Eigelb, roh (keeps bls-E112100)
  ('bls-E112132'),
  ('bls-E112162'),
  ('bls-E112182'),
  -- Hühnerei Eiklar, roh (keeps bls-E113100)
  ('bls-E113132'),
  ('bls-E113162'),
  ('bls-E113182'),
  -- Hühnerei roh (keeps bls-E111100)
  ('bls-E111132'),
  ('bls-E111162'),
  ('bls-E111182'),
  -- Hummer roh (keeps bls-T730100)
  ('bls-T730132'),
  ('bls-T730172'),
  ('bls-T730182'),
  -- Hummer tiefgefroren (keeps bls-T730200)
  ('bls-T730232'),
  ('bls-T730272'),
  ('bls-T730282'),
  -- Jagdwurst/Schinkenwurst grob (keeps bls-W254000)
  ('bls-W254032'),
  ('bls-W254062'),
  ('bls-W254082'),
  -- Jakobsmuscheln (keeps off-7613312316627)
  ('off-7613269226604'),
  -- Kalb Bratenfleisch (Bug) roh (keeps bls-U371100)
  ('bls-U371162'),
  -- Kalb Bratenfleisch (Bug) tiefgefroren (keeps bls-U371200)
  ('bls-U371262'),
  -- Kalb Bries, roh (keeps bls-V582100)
  ('bls-V582132'),
  -- Kalb Brust, tiefgefroren (keeps bls-U452200)
  ('bls-U452262'),
  -- Kalb Bug/Schulter, roh (keeps bls-U461100)
  ('bls-U461132'),
  ('bls-U461162'),
  -- Kalb Bug/Schulter, tiefgefroren (keeps bls-U461200)
  ('bls-U461232'),
  ('bls-U461262'),
  -- Kalb Filet/Lende, tiefgefroren (keeps bls-U411200)
  ('bls-U411262'),
  -- Kalb Filetsteak, roh (keeps bls-U333100)
  ('bls-U333172'),
  ('bls-U333162'),
  ('bls-U333182'),
  -- Kalb Gulasch (Bug) roh (keeps bls-U351100)
  ('bls-U351182'),
  -- Kalb Hackfleisch, roh (keeps bls-U030100)
  ('bls-U030132'),
  ('bls-U030172'),
  ('bls-U030162'),
  ('bls-U030182'),
  -- Kalb Hals/Nacken/Kamm, roh (keeps bls-U432100)
  ('bls-U432132'),
  ('bls-U432162'),
  -- Kalb Hals/Nacken/Kamm, tiefgefroren (keeps bls-U432200)
  ('bls-U432232'),
  ('bls-U432262'),
  -- Kalb Haxe, gegrillt (keeps bls-U471172)
  ('bls-U471162'),
  -- Kalb Haxe, tiefgefroren (keeps bls-U471200)
  ('bls-U471272'),
  ('bls-U471262'),
  -- Kalb Herz, roh (keeps bls-V512100)
  ('bls-V512182'),
  -- Kalb Herz, tiefgefroren (keeps bls-V512200)
  ('bls-V512282'),
  -- Kalb Hirn, roh (keeps bls-V522100)
  ('bls-V522132'),
  -- Kalb Keule, roh (keeps bls-U482100)
  ('bls-U482162'),
  -- Kalb Keule, tiefgefroren (keeps bls-U482200)
  ('bls-U482262'),
  -- Kalb Kochfleisch (Brust) tiefgefroren (keeps bls-U382200)
  ('bls-U382232'),
  -- Kalb Kotelett (Rücken) gegrillt (keeps bls-U323172)
  ('bls-U323162'),
  ('bls-U323182'),
  -- Kalb Kugel/Nuss, roh (keeps bls-U485100)
  ('bls-U485162'),
  -- Kalb Leber, tiefgefroren (keeps bls-V532200)
  ('bls-V532282'),
  -- Kalb Lunge, roh (keeps bls-V542100)
  ('bls-V542132'),
  -- Kalb Magen/Gekröse, roh (keeps bls-V552100)
  ('bls-V552132'),
  -- Kalb Rücken, roh (keeps bls-U421100)
  ('bls-U421162'),
  -- Kalb Rücken, tiefgefroren (keeps bls-U421200)
  ('bls-U421262'),
  -- Kalb Schnitzel (Keule) roh (keeps bls-U342100)
  ('bls-U342172'),
  ('bls-U342162'),
  ('bls-U342182'),
  -- Kalb Schnitzel (Keule) tiefgefroren (keeps bls-U342200)
  ('bls-U342272'),
  ('bls-U342262'),
  ('bls-U342282'),
  -- Kalb Steak (Rücken) gegrillt (keeps bls-U331172)
  ('bls-U331162'),
  ('bls-U331182'),
  -- Kalb Steak (Rücken) tiefgefroren (keeps bls-U331200)
  ('bls-U331272'),
  ('bls-U331262'),
  ('bls-U331282'),
  -- Kalb Unterschale/Schwanzstück, roh (keeps bls-U486100)
  ('bls-U486162'),
  -- Kalbfleischkäse mit Schweinefleisch (keeps bls-W231800)
  ('bls-W231882'),
  -- Kalbskäsebrät mit Schweinefleisch, roh (keeps bls-U067100)
  ('bls-U067162'),
  -- Kaninchen Fleisch, roh (keeps bls-V132100)
  ('bls-V132162'),
  -- Kaninchen Fleisch, tiefgefroren (keeps bls-V132200)
  ('bls-V132262'),
  -- Karotte/Möhre, roh (keeps bls-G620100; also kept: Karotte/Möhre, gebraten ohne Fett (Pfanne) [12])
  ('bls-G620132'),
  ('bls-G620162'),
  ('bls-G620152'),
  -- Karotte/Möhre, tiefgefroren (keeps bls-G620200; also kept: Karotte/Möhre, tiefgefroren, gebraten ohne Fett (Pfanne) [12])
  ('bls-G620232'),
  ('bls-G620262'),
  ('bls-G620252'),
  -- Karotten (keeps off-7610632995594)
  ('off-7617027633468'),
  -- Karotten/Möhren, gekocht (keeps bls-X5A9000)
  ('bls-X562013'),
  ('bls-X562043'),
  -- Karpfen im Backteig, roh (keeps bls-T933100)
  ('bls-T933182'),
  -- Karpfen roh (keeps bls-T501100)
  ('bls-T501152'),
  ('bls-T501162'),
  ('bls-T501182'),
  -- Karpfen tiefgefroren (keeps bls-T501200)
  ('bls-T501252'),
  ('bls-T501262'),
  ('bls-T501282'),
  -- Kartoffel geschält, gekocht (keeps bls-K110132; also kept: Kartoffel geschält, gebacken [25.2])
  ('bls-K110182'),
  -- Kartoffel ungeschält, roh (keeps bls-K120100; also kept: Kartoffel ungeschält, gebraten ohne Fett (Pfanne) [24])
  ('bls-K120134'),
  ('bls-K120164'),
  -- Kartoffel-Schupfnudeln roh (keeps bls-E605000; also kept: Kartoffel-Schupfnudeln gekocht, gebacken [39.7])
  ('bls-E605032'),
  ('bls-E605082'),
  -- Kartoffel-Speck-Rösti tiefgefroren (keeps bls-K392200; also kept: Kartoffel-Speck-Rösti tiefgefroren, gebacken [36])
  ('bls-K392292'),
  ('bls-K392282'),
  -- Kartoffelgnocchi (keeps off-7617027626804)
  ('blv-14197'),
  -- Kartoffelkroketten tiefgefroren (keeps bls-K282200; also kept: Kartoffelkroketten tiefgefroren, gebacken [27.2])
  ('bls-K282292'),
  -- Kartoffelpuffer tiefgefroren (keeps bls-K260200; also kept: Kartoffelpuffer tiefgefroren, frittiert [38])
  ('bls-K260262'),
  ('bls-K260282'),
  -- Kartoffelrösti tiefgefroren (keeps bls-K391200; also kept: Kartoffelrösti tiefgefroren, gebacken [42.5])
  ('bls-K391292'),
  ('bls-K391282'),
  -- Kartoffeltaschen mit Frischkäsefüllung, tiefgefroren (keeps bls-K311200; also kept: Kartoffeltaschen mit Frischkäsefüllung, tiefgefroren, gebacken [32])
  ('bls-K311282'),
  -- Käsekrainer/Käsewürstchen (keeps bls-W255300)
  ('bls-W255372'),
  ('bls-W255382'),
  -- Kasseler, Rohpökelware, geräuchert (keeps bls-W510000)
  ('bls-W514032'),
  ('bls-W515072'),
  ('bls-W530052'),
  ('bls-W510062'),
  ('bls-W510082'),
  -- Kasseler, Rohpökelware, geräuchert, paniert (keeps bls-W531000)
  ('bls-W531082'),
  -- Katfisch/Steinbeißer, roh (keeps bls-T604100)
  ('bls-T604152'),
  ('bls-T604182'),
  -- Katfisch/Steinbeißer, tiefgefroren (keeps bls-T604200)
  ('bls-T604252'),
  ('bls-T604282'),
  -- Kichererbsen (keeps off-3083681003949)
  ('bls-X574212'),
  -- Kirsche (keeps off-4000177997000)
  ('blv-394'),
  -- Kiwi, roh (keeps blv-395)
  ('bls-F514152'),
  -- Knoblauch (keeps off-7613312015162; also kept: Knoblauch gekocht [3])
  ('blv-356'),
  ('bls-G490162'),
  ('bls-G490152'),
  ('bls-G490182'),
  -- Knoblauch tiefgefroren (keeps bls-G490200)
  ('bls-G490232'),
  ('bls-G490262'),
  ('bls-G490252'),
  ('bls-G490282'),
  -- Knoblauchwurst (keeps off-7617027945783)
  ('bls-W171100'),
  -- Knollensellerie, roh (keeps blv-357)
  ('bls-G660132'),
  ('bls-G660162'),
  ('bls-G660152'),
  ('bls-G660182'),
  ('bls-X573812'),
  -- Kochbanane roh (keeps bls-F545100; also kept: Kochbanane gebraten ohne Fett (Pfanne) [44])
  ('bls-F545132'),
  ('bls-F545162'),
  ('bls-F545152'),
  -- Köhler/Seelachs, roh (keeps bls-T207100)
  ('bls-T207172'),
  ('bls-T207152'),
  ('bls-T207162'),
  ('bls-T207182'),
  -- Köhler/Seelachs, tiefgefroren (keeps bls-T207200)
  ('bls-T207272'),
  ('bls-T207252'),
  ('bls-T207262'),
  ('bls-T207282'),
  -- Kohlrabi, roh (keeps blv-449)
  ('bls-G331132'),
  ('bls-G331162'),
  ('bls-G331152'),
  ('bls-G331182'),
  ('bls-X535312'),
  -- Kohlrübe/Steckrübe, roh (keeps bls-G611100)
  ('bls-G611132'),
  ('bls-G611152'),
  -- Königslachs (keeps off-7617027787925)
  ('bls-T415100'),
  ('bls-T415152'),
  ('bls-T415182'),
  -- Königslachs tiefgefroren (keeps bls-T415200)
  ('bls-T415252'),
  ('bls-T415282'),
  -- Kopfsalat (keeps off-7613269460718)
  ('blv-448'),
  -- Kürbis (keeps off-7610849266951)
  ('blv-480'),
  ('bls-X5A7010'),
  ('bls-X559312'),
  -- Kürbis Hokkaido (C. maxima) roh (keeps bls-G581000)
  ('bls-G581032'),
  ('bls-G581062'),
  ('bls-G581052'),
  ('bls-G581082'),
  -- Kürbis Pumpkin (C. pepo) roh (keeps bls-G581100; also kept: Kürbis Pumpkin (C. pepo) gebraten ohne Fett (Pfanne) [10.8])
  ('bls-G581132'),
  ('bls-G581162'),
  ('bls-G581152'),
  -- Lachs (keeps off-7613269672555; also kept: Lachs roh [0])
  ('bls-T410072'),
  ('bls-T410052'),
  ('bls-T410062'),
  ('bls-T410082'),
  -- Lachs tiefgefroren (keeps bls-T410200)
  ('bls-T410272'),
  ('bls-T410252'),
  ('bls-T410262'),
  ('bls-T410282'),
  -- Lamm Bries, roh (keeps bls-V585100)
  ('bls-V585132'),
  -- Lamm Brust, roh (keeps bls-U857100)
  ('bls-U857132'),
  ('bls-U857162'),
  -- Lamm Bug/Schulter, roh (keeps bls-U867100)
  ('bls-U867132'),
  ('bls-U867162'),
  -- Lamm Herz, roh (keeps bls-V515100)
  ('bls-V515182'),
  -- Lamm Kotelett, gegrillt (keeps bls-U727172)
  ('bls-U727162'),
  ('bls-U727182'),
  -- Lamm Leber, roh (keeps bls-V535100)
  ('bls-V535182'),
  -- Lamm Nuss, roh (keeps bls-U817100)
  ('bls-U817162'),
  -- Lamm Zunge, roh (keeps bls-V595100)
  ('bls-V595132'),
  -- Lammfilet (keeps off-2812610001944)
  ('bls-Y413032'),
  -- Languste roh (keeps bls-T720100)
  ('bls-T720132'),
  ('bls-T720172'),
  ('bls-T720182'),
  -- Languste tiefgefroren (keeps bls-T720200)
  ('bls-T720232'),
  ('bls-T720272'),
  ('bls-T720282'),
  -- Lattich (keeps off-7610845783377)
  ('blv-441'),
  -- Lauch (keeps off-7613269296935)
  ('blv-358'),
  -- Leberkäse (keeps bls-W256100)
  ('bls-Y026022'),
  ('bls-W256162'),
  -- Leng roh (keeps bls-T202100)
  ('bls-T202152'),
  ('bls-T202182'),
  -- Let's cook! Kartoffeln (keeps off-2109858003251)
  ('off-2110658001507'),
  -- Mais (keeps off-7613312308806; also kept: Mais gekocht [16.6])
  ('blv-432'),
  ('bls-C341162'),
  ('bls-X988212'),
  -- Makrele roh (keeps bls-T107100)
  ('bls-T107172'),
  ('bls-T107182'),
  -- Mandel süß (keeps bls-H210100)
  ('bls-H210200'),
  -- Mangold, roh (keeps blv-450)
  ('bls-G230132'),
  ('bls-G230162'),
  ('bls-G230152'),
  ('bls-G230182'),
  ('bls-X523512'),
  -- Maniok/Cassava, roh (keeps bls-K410100; also kept: Maniok/Cassava, gebacken [43])
  ('bls-K410432'),
  ('bls-K410182'),
  -- Meeräsche roh (keeps bls-T633100)
  ('bls-T633152'),
  ('bls-T633182'),
  -- Meeräsche tiefgefroren (keeps bls-T633200)
  ('bls-T633252'),
  ('bls-T633282'),
  -- Meerbarbe roh (keeps bls-T600100)
  ('bls-T600152'),
  ('bls-T600182'),
  -- Meeresfrüchtemischung (keeps off-7613312253236)
  ('bls-T900300'),
  ('off-7613269164579'),
  ('bls-T900352'),
  ('bls-T900382'),
  -- Meerforelle roh (keeps bls-T424100)
  ('bls-T424152'),
  ('bls-T424182'),
  -- Meerforelle tiefgefroren (keeps bls-T424200)
  ('bls-T424252'),
  ('bls-T424282'),
  -- Meerrettich (keeps off-3073780410984; also kept: Meerrettich roh [11.7])
  ('bls-G630132'),
  -- Mehrkornschrot (keeps bls-C492000; also kept: Mehrkornschrot gekocht [8.8])
  ('bls-C492062'),
  ('bls-C492082'),
  -- Merguez (keeps off-7610092801671)
  ('off-2126066006454'),
  -- Merlan/Wittling, roh (keeps bls-T208100)
  ('bls-T208152'),
  ('bls-T208182'),
  -- Mettwurst (keeps bls-W151000)
  ('bls-W331000'),
  ('bls-W151082'),
  -- Miesmuschel tiefgefroren (keeps bls-T792200)
  ('bls-T792232'),
  ('bls-T792282'),
  -- Miesmuschel, roh (keeps blv-761)
  ('bls-T792132'),
  ('bls-T792182'),
  -- Mirabelle, roh (keeps blv-403)
  ('bls-F224152'),
  -- Mischpilze (keeps off-7616800800073)
  ('bls-K750100'),
  ('bls-K750162'),
  ('bls-K750152'),
  ('bls-K750182'),
  -- Mischpilze tiefgefroren (keeps bls-K750200)
  ('bls-K750262'),
  ('bls-K750252'),
  ('bls-K750282'),
  -- Morchel getrocknet (keeps bls-K703400)
  ('bls-K703432'),
  -- Morchel, roh (keeps blv-457)
  ('bls-K703182'),
  -- Münchner Weißwurst (keeps bls-W224000)
  ('bls-W224082'),
  -- Nektarine, roh (keeps blv-404)
  ('bls-F202152'),
  -- Neuseeländer Spinat roh (keeps bls-G213100)
  ('bls-G213132'),
  ('bls-G213152'),
  ('bls-G213182'),
  -- Nüsslisalat (keeps off-7613356205024)
  ('blv-372'),
  -- Okra roh (keeps bls-G530100)
  ('bls-G530132'),
  ('bls-G530152'),
  ('bls-X573412'),
  -- Orange (keeps food-orange)
  ('blv-405'),
  -- Pak Choi roh (keeps bls-G324100)
  ('bls-G324132'),
  ('bls-G324152'),
  ('bls-G324182'),
  -- Palmenherz roh (keeps bls-G440100)
  ('bls-G440132'),
  -- Pangasius/Schlankwels, roh (keeps bls-T507100)
  ('bls-T507152'),
  ('bls-T507182'),
  -- Paprika (keeps off-7610095015006; also kept: Paprika gedünstet (mit Fett und Salz) [5.5])
  ('off-4099200162669'),
  -- Parmaschinken (keeps bls-W441000)
  ('bls-W441032'),
  ('bls-W441082'),
  -- Pastinake, roh (keeps blv-13439; also kept: Pastinake gebraten ohne Fett (Pfanne) [17.9])
  ('bls-G640162'),
  ('bls-G640152'),
  -- Pelamide roh (keeps bls-T120100)
  ('bls-T120152'),
  ('bls-T120182'),
  -- Perlhuhn Fleisch, mit Haut, roh (keeps bls-V454100)
  ('bls-V454162'),
  -- Perlhuhn Fleisch, mit Haut, tiefgefroren (keeps bls-V454200)
  ('bls-V454262'),
  -- Perlzwiebel roh (keeps bls-G484100)
  ('bls-G484132'),
  ('bls-G484162'),
  ('bls-G484152'),
  ('bls-G484182'),
  -- Petersilie (keeps off-8003495073827)
  ('blv-373'),
  -- Pfannkuchen/Eierkuchen, ungesüßt, mit Milch 1,5 % Fett, gebraten (keeps bls-X925012)
  ('bls-X924012'),
  -- Pfefferschote grün, roh (keeps bls-G553100)
  ('bls-G553132'),
  ('bls-G553152'),
  ('bls-G553182'),
  -- Pfefferschote rot, roh (keeps bls-G554100)
  ('bls-G554132'),
  ('bls-G554152'),
  ('bls-G554182'),
  -- Pferd Fleisch, roh (keeps bls-V112100)
  ('bls-V112162'),
  -- Pferd Fleisch, tiefgefroren (keeps bls-V111200)
  ('bls-V111262'),
  -- Pfifferling getrocknet (keeps bls-K713400)
  ('bls-K713432'),
  -- Pfifferling roh (keeps bls-K713100)
  ('bls-K713062'),
  ('bls-K713152'),
  ('bls-K713182'),
  -- Pfirsich (keeps off-76408571)
  ('bls-F203100'),
  ('bls-F203152'),
  -- Pflaume, roh (keeps blv-474)
  ('bls-F220152'),
  -- Pilgermuschel/Jakobsmuschel, roh (keeps bls-T793100)
  ('bls-T793172'),
  ('bls-T793182'),
  -- Pilgermuschel/Jakobsmuschel, tiefgefroren (keeps bls-T793200)
  ('bls-T793272'),
  ('bls-T793282'),
  -- Pizza Hawaii (keeps off-7613269420262)
  ('blv-1534'),
  -- Pizza margherita (keeps off-4104420112308)
  ('blv-1535'),
  -- Pizza Prosciutto (keeps off-0581655004600)
  ('blv-1538'),
  -- Pizza Prosciutto e Funghi (keeps off-7613312383469)
  ('blv-1537'),
  -- Polenta (Maisgrieß mit Wasser, Fett und Salz) gekocht (keeps bls-C526000)
  ('bls-C526062'),
  ('bls-C526082'),
  -- Pommes frites tiefgefroren (keeps bls-K130200; also kept: Pommes frites tiefgefroren, gebacken [27.4])
  ('bls-K130492'),
  -- Porree/Lauch, roh (keeps bls-G470100)
  ('bls-G470132'),
  ('bls-G470162'),
  ('bls-G470152'),
  ('bls-G470182'),
  -- Porree/Lauch, tiefgefroren (keeps bls-G470200)
  ('bls-G470232'),
  ('bls-G470262'),
  ('bls-G470252'),
  ('bls-G470282'),
  -- Portulak roh (keeps bls-G460100)
  ('bls-G460152'),
  -- Poularde Fleisch, mit Haut, roh (keeps bls-V444100)
  ('bls-V444162'),
  -- Poularde Fleisch, mit Haut, tiefgefroren (keeps bls-V444200)
  ('bls-V444262'),
  -- Pute Brust, ohne Haut, mariniert, roh (keeps bls-V489000)
  ('bls-V489082'),
  -- Pute Brust, ohne Haut, roh (keeps bls-V486100)
  ('bls-V486132'),
  ('bls-V486172'),
  ('bls-V486162'),
  ('bls-V486182'),
  -- Pute Brust, ohne Haut, tiefgefroren (keeps bls-V486200)
  ('bls-V486232'),
  ('bls-V486272'),
  ('bls-V486262'),
  ('bls-V486282'),
  -- Pute Fleisch, mit Haut, roh (keeps bls-V484100)
  ('bls-V484172'),
  ('bls-V484162'),
  ('bls-V484182'),
  -- Pute Fleisch, mit Haut, tiefgefroren (keeps bls-V484200)
  ('bls-V484272'),
  ('bls-V484262'),
  ('bls-V484282'),
  -- Pute Fleisch, ohne Haut, roh (keeps bls-V481000)
  ('bls-V481132'),
  ('bls-V481172'),
  ('bls-V481162'),
  ('bls-V481182'),
  -- Pute Fleisch, ohne Haut, tiefgefroren (keeps bls-V481200)
  ('bls-V481232'),
  ('bls-V481272'),
  ('bls-V481262'),
  ('bls-V481282'),
  -- Pute Flügel, mit Haut, roh (keeps bls-V487100)
  ('bls-V487132'),
  ('bls-V487172'),
  ('bls-V487162'),
  ('bls-V487182'),
  -- Pute Flügel, mit Haut, tiefgefroren (keeps bls-V487200)
  ('bls-V487232'),
  ('bls-V487272'),
  ('bls-V487262'),
  ('bls-V487282'),
  -- Pute Innereien, roh (keeps bls-V488100)
  ('bls-V488182'),
  -- Pute Innereien, tiefgefroren (keeps bls-V488200)
  ('bls-V488282'),
  -- Pute Keule, ohne Haut, roh (keeps bls-V485100)
  ('bls-V485172'),
  ('bls-V485162'),
  ('bls-V485182'),
  -- Pute Keule, ohne Haut, tiefgefroren (keeps bls-V485200)
  ('bls-V485272'),
  ('bls-V485262'),
  ('bls-V485282'),
  -- Putenei roh (keeps bls-E151100)
  ('bls-E151132'),
  -- Quinoa (keeps off-7611654616825)
  ('blv-13394'),
  -- Quinoa Tricolore (keeps off-7613312043158; also kept: Quinoa tricolore, gekocht [17.1])
  ('bls-C118100'),
  -- Quitte, roh (keeps blv-476)
  ('bls-F140132'),
  ('bls-F140152'),
  -- Radieschen, roh (keeps blv-456)
  ('bls-G691152'),
  -- Rahmspinat (keeps off-7616800810454)
  ('blv-14240'),
  -- Randen (keeps off-4056489778967)
  ('off-7627535023279'),
  ('off-2184235001402'),
  -- Randenwürfel (keeps off-7610632984116)
  ('off-7613404861011'),
  -- Rebhuhn Fleisch, roh (keeps bls-V320100)
  ('bls-V320162'),
  -- Rebhuhn Fleisch, tiefgefroren (keeps bls-V320200)
  ('bls-V320262'),
  -- Reh Keule, roh (keeps bls-V221100)
  ('bls-V221132'),
  ('bls-V221172'),
  ('bls-V221162'),
  -- Reh Rücken, roh (keeps bls-V222100)
  ('bls-V222162'),
  -- Reh Rücken, tiefgefroren (keeps bls-V222200)
  ('bls-V222262'),
  -- Reis parboiled, poliert, roh (keeps bls-C359000; also kept: Reis parboiled, poliert, gekocht [23.8])
  ('bls-C359082'),
  -- Reis poliert, roh (keeps bls-C352000; also kept: Reis poliert, gekocht [24.8], Reis poliert, gedünstet (mit Fett und Salz) [19])
  ('bls-C352082'),
  ('bls-C350222'),
  -- Reis unpoliert, roh (keeps bls-C351000; also kept: Reis unpoliert, gekocht [26.3])
  ('bls-C351082'),
  ('bls-X821112'),
  -- Reismischung mit Wildreis (keeps off-4006040106616; also kept: Reismischung mit Wildreis, gekocht [27.3])
  ('bls-C354100'),
  -- Reisnudeln (keeps off-8938505644080; also kept: Reisnudeln gekocht [20.4])
  ('bls-C559000'),
  -- Rentier Fleisch, roh (keeps bls-V272100)
  ('bls-V272162'),
  -- Rettich, roh (keeps blv-361)
  ('bls-G680152'),
  -- Rheinische Bratwurst (keeps bls-W221000)
  ('bls-W221072'),
  ('bls-W221082'),
  -- Rind Bratenfleisch (Bug) roh (keeps bls-U171100)
  ('bls-U171162'),
  -- Rind Bratenfleisch (Bug) tiefgefroren (keeps bls-U171200)
  ('bls-U171262'),
  -- Rind Brustkern/Mittelbrust, roh (keeps bls-U255100)
  ('bls-U255132'),
  ('bls-U255162'),
  -- Rind Bug/Schulter, roh (keeps bls-U261100)
  ('bls-U261162'),
  -- Rind Filet/Lende, tiefgefroren (keeps bls-U211200)
  ('bls-U211262'),
  -- Rind Filetsteak roh (keeps bls-U216100)
  ('bls-U216172'),
  ('bls-U216182'),
  -- Rind Frikadelle, roh (keeps bls-U013100)
  ('bls-U013172'),
  ('bls-U013162'),
  ('bls-U013182'),
  -- Rind Gulasch (Bug) roh (keeps bls-U151100)
  ('bls-U151182'),
  -- Rind Gulasch (Bug) tiefgefroren (keeps bls-U151200)
  ('bls-U151282'),
  -- Rind Hackfleisch (keeps off-2185390007858)
  ('bls-U010100'),
  ('bls-U010132'),
  ('bls-U011172'),
  ('bls-U010162'),
  ('bls-U010182'),
  -- Rind Hackfleisch, tiefgefroren (keeps bls-U010200)
  ('bls-U010232'),
  ('bls-U010272'),
  ('bls-U010262'),
  ('bls-U012282'),
  -- Rind Hals/Kamm/Nacken, roh (keeps bls-U231100)
  ('bls-U231132'),
  -- Rind Hals/Kamm/Nacken, tiefgefroren (keeps bls-U231200)
  ('bls-U231232'),
  -- Rind Herz, roh (keeps bls-V511100)
  ('bls-V511182'),
  -- Rind Herz, tiefgefroren (keeps bls-V511200)
  ('bls-V511282'),
  -- Rind Hinterhesse, roh (keeps bls-U291100)
  ('bls-U291132'),
  -- Rind Hinterhesse, tiefgefroren (keeps bls-U291200)
  ('bls-U291232'),
  -- Rind Hochrippe, roh (keeps bls-U235100)
  ('bls-U235132'),
  ('bls-U235162'),
  -- Rind Hüfte (keeps off-2833235002437)
  ('bls-U284100'),
  ('bls-U284132'),
  ('bls-U284162'),
  -- Rind Keule, roh (keeps bls-U281100)
  ('bls-U281132'),
  ('bls-U281162'),
  -- Rind Keule, tiefgefroren (keeps bls-U281200)
  ('bls-U281232'),
  ('bls-U281262'),
  -- Rind Kochfleisch (Bug) roh (keeps bls-U184100)
  ('bls-U184132'),
  -- Rind Kochfleisch (Hüfte) roh (keeps bls-U185100)
  ('bls-U185132'),
  -- Rind Kotelett (Rücken) roh (keeps bls-U121100)
  ('bls-U121172'),
  ('bls-U121182'),
  -- Rind Kotelett (Rücken) tiefgefroren (keeps bls-U121200)
  ('bls-U121272'),
  ('bls-U121282'),
  -- Rind Leber, tiefgefroren (keeps bls-V531200)
  ('bls-V531282'),
  -- Rind Leberhack, roh (keeps bls-U080100)
  ('bls-U080132'),
  ('bls-U080182'),
  -- Rind Leberhack, tiefgefroren (keeps bls-U080200)
  ('bls-U080232'),
  ('bls-U080282'),
  -- Rind Lunge, roh (keeps bls-V541100)
  ('bls-V541132'),
  -- Rind Magen/Kutteln, roh (keeps bls-V551100)
  ('bls-V551132'),
  -- Rind Oberschale, roh (keeps bls-U287100)
  ('bls-U287132'),
  ('bls-U287162'),
  -- Rind Ochsenschwanz, roh (keeps bls-U109100)
  ('bls-U109182'),
  -- Rind Roastbeef (Rücken) mariniert, roh (keeps bls-U223000)
  ('bls-U223072'),
  -- Rind Roastbeef (Rücken) roh (keeps bls-U221100)
  ('bls-U221162'),
  -- Rind Roastbeef (Rücken) tiefgefroren (keeps bls-U221200)
  ('bls-U221262'),
  -- Rind Rostbraten, roh (keeps bls-U175100)
  ('bls-U175162'),
  -- Rind Roulade (Oberschale) roh (keeps bls-U163100)
  ('bls-U163182'),
  -- Rind Steak (Rücken) mariniert, roh (keeps bls-U133100)
  ('bls-U133172'),
  ('bls-U133182'),
  -- Rind Steak (Rücken) roh (keeps bls-U131100)
  ('bls-U131172'),
  ('bls-U131162'),
  ('bls-U131182'),
  -- Rind Steak (Rücken) tiefgefroren (keeps bls-U131200)
  ('bls-U131272'),
  ('bls-U131262'),
  ('bls-U131282'),
  -- Rind Tatar/Schabefleisch, roh (keeps bls-U070100)
  ('bls-U070162'),
  ('bls-U070182'),
  -- Rind Tatar/Schabefleisch, tiefgefroren (keeps bls-U070200)
  ('bls-U070232'),
  -- Rind Vorderhesse, roh (keeps bls-U271100)
  ('bls-U271132'),
  -- Rind Vorderhesse, tiefgefroren (keeps bls-U271200)
  ('bls-U271232'),
  -- Rind/Schwein, Frikadelle, roh (keeps bls-U051100)
  ('bls-U051172'),
  ('bls-U051162'),
  ('bls-U051182'),
  -- Rind/Schwein, Hackfleisch gemischt, roh (keeps bls-U050100)
  ('bls-U050132'),
  ('bls-U050162'),
  ('bls-U050182'),
  -- Rind/Schwein, Hackfleisch gemischt, tiefgefroren (keeps bls-U050200)
  ('bls-U050282'),
  -- Rind/Schwein, Hacksteak, roh (keeps bls-U063100)
  ('bls-U063172'),
  ('bls-U063162'),
  ('bls-U063182'),
  -- Rind/Schwein, Hacksteak, tiefgefroren (keeps bls-U063200)
  ('bls-U063272'),
  ('bls-U063262'),
  ('bls-U063282'),
  -- Rindersteak gegrillt (keeps bls-Y135432)
  ('bls-Y184512'),
  -- Rindfleisch (keeps off-2182088015805)
  ('bls-Y180512'),
  ('bls-Y184212'),
  -- Rindfleisch gewürzt (keeps off-2825658003009)
  ('off-2156197005750'),
  -- Rindsbratwurst (keeps bls-W222700)
  ('bls-W222772'),
  ('bls-W222782'),
  -- Roastbeef (keeps off-2115388005207)
  ('off-2151097007255'),
  -- Romanesco (keeps off-7624841830133; also kept: Romanesco gebacken [7.5])
  ('bls-G350100'),
  ('bls-G350132'),
  ('bls-G350152'),
  ('bls-G350182'),
  ('bls-X573312'),
  -- Rosenkohl (keeps off-7613269273912)
  ('blv-363'),
  ('bls-G332132'),
  ('bls-G332162'),
  ('bls-G332152'),
  ('bls-G332182'),
  ('bls-X536053'),
  -- Rosenkohl tiefgefroren (keeps bls-G332200)
  ('bls-G332232'),
  ('bls-G332262'),
  ('bls-G332252'),
  -- Rostbratwurst (keeps bls-W222600)
  ('bls-W222672'),
  ('bls-W222682'),
  -- Rotbarsch/Goldbarsch, roh (keeps bls-T615100)
  ('bls-T615142'),
  ('bls-T615172'),
  ('bls-T615152'),
  ('bls-T615162'),
  ('bls-T615182'),
  -- Rotbarsch/Goldbarsch, tiefgefroren (keeps bls-T615200)
  ('bls-T615252'),
  ('bls-T615262'),
  ('bls-T615282'),
  -- Rotbarschfilet gegrillt (keeps bls-Y693842)
  ('bls-Y660912'),
  -- Rote Rübe/Rote Bete, roh (keeps bls-G613100)
  ('bls-G613132'),
  ('bls-G613152'),
  -- Rotkappe roh (keeps bls-K717100)
  ('bls-K717152'),
  ('bls-K717182'),
  -- Rotkohl (keeps off-20004408; also kept: Rotkohl, roh [4.3])
  ('bls-G341132'),
  ('bls-G341162'),
  ('bls-G341182'),
  -- Rotkraut (keeps off-7610818158850)
  ('off-7613379690814'),
  -- Rotzunge roh (keeps bls-T313100)
  ('bls-T313152'),
  ('bls-T313182'),
  -- Rotzunge tiefgefroren (keeps bls-T313200)
  ('bls-T313252'),
  ('bls-T313282'),
  -- Rucola (keeps off-7610846434841)
  ('blv-468'),
  -- Samosa, gebacken (keeps blv-10561)
  ('blv-10562'),
  -- Sardelle roh (keeps bls-T104100)
  ('bls-T104172'),
  ('bls-T104162'),
  ('bls-T104182'),
  -- Sardine, roh (keeps blv-757)
  ('bls-T105172'),
  ('bls-T105182'),
  -- Sauerampfer roh (keeps bls-G263100)
  ('bls-G263132'),
  ('bls-G263152'),
  -- Sauerkirsche roh (keeps bls-F212100)
  ('bls-F212152'),
  -- Sauerkraut (keeps off-4061461606886)
  ('off-7613404860915'),
  ('off-7617027633567'),
  ('bls-X530353'),
  -- Sauerkraut abgetropft, roh (keeps bls-G345100)
  ('bls-G345032'),
  ('bls-G345062'),
  ('bls-G345152'),
  ('bls-G345082'),
  -- Schaf Bratenfleisch (Bug, fett) roh (keeps bls-U773100)
  ('bls-U773162'),
  -- Schaf Bratenfleisch (Bug, mager) roh (keeps bls-U771100)
  ('bls-U771162'),
  -- Schaf Bries, roh (keeps bls-V584100)
  ('bls-V584132'),
  -- Schaf Brust, fett, roh (keeps bls-U853100)
  ('bls-U853132'),
  ('bls-U853162'),
  -- Schaf Brust, mittelfett, roh (keeps bls-U852100)
  ('bls-U852132'),
  ('bls-U852162'),
  -- Schaf Brust, mittelfett, tiefgefroren (keeps bls-U852200)
  ('bls-U852232'),
  ('bls-U852262'),
  -- Schaf Bug/Schulter, fett, roh (keeps bls-U863100)
  ('bls-U863132'),
  ('bls-U863162'),
  -- Schaf Bug/Schulter, fett, tiefgefroren (keeps bls-U863200)
  ('bls-U863232'),
  ('bls-U863262'),
  -- Schaf Bug/Schulter, mager, roh (keeps bls-U861100)
  ('bls-U861132'),
  ('bls-U861162'),
  -- Schaf Bug/Schulter, mager, tiefgefroren (keeps bls-U861200)
  ('bls-U861232'),
  ('bls-U861262'),
  -- Schaf Filet/Lende, roh (keeps bls-U811100)
  ('bls-U811172'),
  ('bls-U811162'),
  -- Schaf Filet/Lende, tiefgefroren (keeps bls-U811200)
  ('bls-U811272'),
  ('bls-U811262'),
  -- Schaf Filetmedaillon, roh (keeps bls-U711100)
  ('bls-U711172'),
  ('bls-U711162'),
  ('bls-U711182'),
  -- Schaf Filetmedaillon, tiefgefroren (keeps bls-U711200)
  ('bls-U711272'),
  ('bls-U711262'),
  ('bls-U711282'),
  -- Schaf Filetsteak, roh (keeps bls-U733100)
  ('bls-U733172'),
  ('bls-U733162'),
  ('bls-U733182'),
  -- Schaf Filetsteak, tiefgefroren (keeps bls-U733200)
  ('bls-U733272'),
  ('bls-U733262'),
  ('bls-U733282'),
  -- Schaf Gulasch (Bug, fett) roh (keeps bls-U753100)
  ('bls-U753182'),
  -- Schaf Gulasch (Bug, mager) roh (keeps bls-U751100)
  ('bls-U751182'),
  -- Schaf Gulasch (Hals/Kamm/Nacken) roh (keeps bls-U754100)
  ('bls-U754182'),
  -- Schaf Hals/Kamm/Nacken, roh (keeps bls-U831100)
  ('bls-U831172'),
  ('bls-U831162'),
  ('bls-U831182'),
  -- Schaf Herz, roh (keeps bls-V514100)
  ('bls-V514182'),
  -- Schaf Hinterhaxe, mager, roh (keeps bls-U891100)
  ('bls-U891132'),
  ('bls-U891172'),
  ('bls-U891162'),
  -- Schaf Hinterhaxe, mager, tiefgefroren (keeps bls-U891200)
  ('bls-U891232'),
  ('bls-U891272'),
  ('bls-U891262'),
  -- Schaf Hinterhaxe, mittelfett, roh (keeps bls-U892100)
  ('bls-U892132'),
  ('bls-U892172'),
  ('bls-U892162'),
  -- Schaf Hinterhaxe, mittelfett, tiefgefroren (keeps bls-U892200)
  ('bls-U892232'),
  ('bls-U892272'),
  ('bls-U892262'),
  -- Schaf Hirn, roh (keeps bls-V524100)
  ('bls-V524132'),
  -- Schaf Keule, fett, roh (keeps bls-U883100)
  ('bls-U883162'),
  -- Schaf Keule, fett, tiefgefroren (keeps bls-U883200)
  ('bls-U883262'),
  -- Schaf Keule, mager, roh (keeps bls-U881100)
  ('bls-U881162'),
  -- Schaf Keule, mager, tiefgefroren (keeps bls-U881200)
  ('bls-U881262'),
  -- Schaf Keule, mittelfett, roh (keeps bls-U882100)
  ('bls-U882162'),
  -- Schaf Keule, mittelfett, tiefgefroren (keeps bls-U882200)
  ('bls-U882262'),
  -- Schaf Kochfleisch (Brust, fett) roh (keeps bls-U783100)
  ('bls-U783132'),
  -- Schaf Kotelett, mariniert, roh (keeps bls-U724000)
  ('bls-U724072'),
  ('bls-U724082'),
  -- Schaf Kotelett, roh (keeps bls-U721100)
  ('bls-U721172'),
  ('bls-U721182'),
  -- Schaf Kotelett, tiefgefroren (keeps bls-U721200)
  ('bls-U721272'),
  ('bls-U721282'),
  -- Schaf Leber, roh (keeps bls-V534100)
  ('bls-V534182'),
  -- Schaf Lunge, roh (keeps bls-V544100)
  ('bls-V544132'),
  -- Schaf Rücken, roh (keeps bls-U821100)
  ('bls-U821172'),
  ('bls-U821162'),
  -- Schaf Schnitzel (Keule, mager) roh (keeps bls-U741100)
  ('bls-U741172'),
  ('bls-U741162'),
  ('bls-U741182'),
  -- Schaf Schnitzel (Keule, mager) tiefgefroren (keeps bls-U741200)
  ('bls-U741272'),
  ('bls-U741262'),
  ('bls-U741282'),
  -- Schaf Schnitzel (Keule, mittelfett) roh (keeps bls-U742100)
  ('bls-U742172'),
  ('bls-U742162'),
  ('bls-U742182'),
  -- Schaf Vorderhaxe, mager, roh (keeps bls-U871100)
  ('bls-U871132'),
  ('bls-U871172'),
  ('bls-U871162'),
  -- Schaf Vorderhaxe, mittelfett, roh (keeps bls-U872100)
  ('bls-U872132'),
  ('bls-U872172'),
  ('bls-U872162'),
  -- Schaf Vorderhaxe, mittelfett, tiefgefroren (keeps bls-U872200)
  ('bls-U872232'),
  ('bls-U872272'),
  ('bls-U872262'),
  -- Schaf Zunge, roh (keeps bls-V594100)
  ('bls-V594132'),
  -- Schafskopf (Meerbrasse) roh (keeps bls-T617100)
  ('bls-T617152'),
  ('bls-T617182'),
  -- Schafskopf (Meerbrasse) tiefgefroren (keeps bls-T617200)
  ('bls-T617252'),
  ('bls-T617282'),
  -- Schalotte, roh (keeps blv-14281; also kept: Schalotte gekocht [3.2])
  ('bls-G485152'),
  ('bls-G485082'),
  -- Schellfisch roh (keeps bls-T206100)
  ('bls-T206172'),
  ('bls-T206152'),
  ('bls-T206182'),
  -- Schildmakrele/Stöcker, roh (keeps bls-T118100)
  ('bls-T118152'),
  ('bls-T118182'),
  -- Schleie roh (keeps bls-T512100)
  ('bls-T512182'),
  -- Schlemmerfilet Bordelaise (Alaska-Seelachs) tiefgefroren (keeps bls-T935200)
  ('bls-T935262'),
  -- Schnecken roh (keeps bls-V050100)
  ('bls-V050132'),
  ('bls-V050182'),
  -- Schnecken tiefgefroren (keeps bls-V050200)
  ('bls-V050232'),
  ('bls-V050282'),
  -- Schnittlauch (keeps off-7617027632867)
  ('blv-374'),
  -- Schupfnudeln eifrei, roh (keeps bls-E605300)
  ('bls-E605332'),
  -- Schupfnudeln gegart (keeps bls-X659012)
  ('bls-X659112'),
  -- Schupfnudeln schwäbisch, roh (keeps bls-E605200)
  ('bls-E605232'),
  -- Schwarzer Heilbutt roh (keeps bls-T307100)
  ('bls-T307152'),
  ('bls-T307182'),
  -- Schwarzer Heilbutt tiefgefroren (keeps bls-T307200)
  ('bls-T307252'),
  ('bls-T307282'),
  -- Schwarzwurzel tiefgefroren (keeps bls-G650200)
  ('bls-G650232'),
  ('bls-G650252'),
  -- Schwarzwurzel, roh (keeps blv-452; also kept: Schwarzwurzel gedünstet [8.6])
  ('bls-G650132'),
  -- Schwein Bauch (wie gewachsen) mariniert, roh (keeps bls-U642300)
  ('bls-U642372'),
  -- Schwein Bauch (wie gewachsen) roh (keeps bls-U642100)
  ('bls-U642132'),
  ('bls-U642172'),
  ('bls-U642162'),
  -- Schwein Bauch (wie gewachsen) tiefgefroren (keeps bls-U642200)
  ('bls-U642232'),
  ('bls-U642272'),
  ('bls-U642262'),
  -- Schwein Bauchspeck, Rohpökelware, geräuchert (keeps bls-W411300)
  ('bls-W411332'),
  -- Schwein Brät, roh (keeps bls-U065100)
  ('bls-U065132'),
  -- Schwein Bratenfleisch (Bug mit Fett und Schwarte) roh (keeps bls-U571100)
  ('bls-U571162'),
  -- Schwein Bratenfleisch (Bug ohne Fett und Schwarte) roh (keeps bls-U574100)
  ('bls-U574162'),
  -- Schwein Bratenfleisch (Hüfte/Schinkenspeck) roh (keeps bls-U576100)
  ('bls-U576162'),
  -- Schwein Bratenfleisch (Nuss) roh (keeps bls-U575100)
  ('bls-U575162'),
  -- Schwein Brustspitze, roh (keeps bls-U651100)
  ('bls-U651132'),
  ('bls-U651162'),
  -- Schwein Dicke Rippe roh (keeps bls-U564100)
  ('bls-U564132'),
  ('bls-U564162'),
  -- Schwein Dicker Bug (mit Fett und Schwarte) roh (keeps bls-U664100)
  ('bls-U664162'),
  -- Schwein Dünner Bug (ohne Fett und Schwarte) roh (keeps bls-U665100)
  ('bls-U665162'),
  -- Schwein Filet/Lende, gegrillt (keeps bls-U611172)
  ('bls-U611162'),
  -- Schwein Filet/Lende, tiefgefroren (keeps bls-U611200)
  ('bls-U611272'),
  ('bls-U611262'),
  -- Schwein Filetmedaillon, mariniert, roh (keeps bls-U512100)
  ('bls-U512172'),
  ('bls-U510082'),
  -- Schwein Filetmedaillon, roh (keeps bls-U511100)
  ('bls-U511172'),
  ('bls-U511162'),
  ('bls-U511182'),
  -- Schwein Filetmedaillon, tiefgefroren (keeps bls-U511200)
  ('bls-U511272'),
  ('bls-U511262'),
  ('bls-U511282'),
  -- Schwein Frikadelle, roh (keeps bls-U025100)
  ('bls-U025172'),
  ('bls-U025162'),
  ('bls-U025182'),
  -- Schwein Frühstücksspeck, Rohpökelware, geräuchert (keeps bls-W415000)
  ('bls-W415032'),
  ('bls-W415072'),
  ('bls-W415062'),
  ('bls-W415082'),
  -- Schwein Grillbauch, roh (keeps bls-U57A100)
  ('bls-U57A172'),
  -- Schwein Gulasch (Restbug) roh (keeps bls-U554100)
  ('bls-U554182'),
  -- Schwein Hackfleisch, roh (keeps bls-U020100)
  ('bls-U020132'),
  ('bls-U024172'),
  ('bls-U020162'),
  ('bls-U020182'),
  -- Schwein Hackfleisch, tiefgefroren (keeps bls-U020200)
  ('bls-U022232'),
  ('bls-U020272'),
  ('bls-U023262'),
  -- Schwein Herz, roh (keeps bls-V513100)
  ('bls-V513182'),
  -- Schwein Herz, tiefgefroren (keeps bls-V513200)
  ('bls-V513282'),
  -- Schwein Hintereisbein/Hinterhaxe, roh (keeps bls-U693100)
  ('bls-U693132'),
  ('bls-U693172'),
  ('bls-U693162'),
  -- Schwein Hintereisbein/Hinterhaxe, tiefgefroren (keeps bls-U693200)
  ('bls-U693232'),
  ('bls-U693272'),
  ('bls-U693262'),
  -- Schwein Hirn, roh (keeps bls-V523100)
  ('bls-V523132'),
  -- Schwein Hüfte/Schinkenspeck, roh (keeps bls-U685100)
  ('bls-U685162'),
  -- Schwein Kamm, roh (keeps bls-U632100)
  ('bls-U632172'),
  ('bls-U632162'),
  -- Schwein Kamm, tiefgefroren (keeps bls-U632200)
  ('bls-U632272'),
  ('bls-U632262'),
  -- Schwein Kammsteak, roh (keeps bls-U532100)
  ('bls-U532172'),
  ('bls-U532162'),
  ('bls-U532182'),
  -- Schwein Kammsteak, tiefgefroren (keeps bls-U532200)
  ('bls-U532272'),
  ('bls-U532262'),
  ('bls-U532282'),
  -- Schwein Kochfleisch (Bauch) roh (keeps bls-U583100)
  ('bls-U583132'),
  -- Schwein Kochfleisch (Bauch) tiefgefroren (keeps bls-U583200)
  ('bls-U583232'),
  -- Schwein Kochschinken, Kochpökelware (keeps bls-W424000)
  ('bls-W424032'),
  ('bls-W424082'),
  -- Schwein Kotelett (Rücken/caudal) gegrillt (keeps bls-U624172)
  ('bls-U624162'),
  -- Schwein Kotelett (Rücken/cranial) gegrillt (keeps bls-U622172)
  ('bls-U622162'),
  -- Schwein Kotelett (Rücken/cranial) tiefgefroren (keeps bls-U622200)
  ('bls-U622272'),
  ('bls-U622262'),
  -- Schwein Ladenbauch, roh (keeps bls-U57B100)
  ('bls-U57B162'),
  -- Schwein Leber, tiefgefroren (keeps bls-V533200)
  ('bls-V533282'),
  -- Schwein Lunge, roh (keeps bls-V543100)
  ('bls-V543132'),
  -- Schwein Magen, roh (keeps bls-V553100)
  ('bls-V553132'),
  -- Schwein Nuss, roh (keeps bls-U684100)
  ('bls-U684162'),
  -- Schwein Oberschale (ohne Deckel) roh (keeps bls-U687000)
  ('bls-U687032'),
  ('bls-U687062'),
  -- Schwein Roulade (Oberschale) roh (keeps bls-U563100)
  ('bls-U563162'),
  -- Schwein Schinkenspeck, Rohpökelware, geräuchert (keeps bls-W410400)
  ('bls-W410432'),
  ('bls-W410472'),
  ('bls-W410462'),
  ('bls-W410482'),
  -- Schwein Schmetterlingssteak, roh (keeps bls-U533100)
  ('bls-U533172'),
  ('bls-U533162'),
  ('bls-U533182'),
  -- Schwein Schnitzel (Nuss) roh (keeps bls-U543100)
  ('bls-U543172'),
  ('bls-U543162'),
  ('bls-U543182'),
  -- Schwein Schnitzel (Oberschale) roh (keeps bls-U541100)
  ('bls-U541172'),
  ('bls-U541062'),
  ('bls-U541082'),
  -- Schwein Schnitzel (Oberschale) tiefgefroren (keeps bls-U541200)
  ('bls-U541272'),
  ('bls-U541262'),
  ('bls-U541282'),
  -- Schwein Stielkotelett, roh (keeps bls-U522100)
  ('bls-U522172'),
  ('bls-U522162'),
  ('bls-U522182'),
  -- Schwein Stielkotelett, tiefgefroren (keeps bls-U522200)
  ('bls-U522272'),
  ('bls-U522262'),
  ('bls-U522282'),
  -- Schwein Unterschale (mit Rolle) roh (keeps bls-U686100)
  ('bls-U686162'),
  -- Schwein Vordereisbein/Vorderhaxe, roh (keeps bls-U672100)
  ('bls-U672132'),
  ('bls-U672172'),
  ('bls-U672162'),
  -- Schwein Vordereisbein/Vorderhaxe, tiefgefroren (keeps bls-U672200)
  ('bls-U672232'),
  ('bls-U672272'),
  ('bls-U672262'),
  -- Schwein Zunge, roh (keeps bls-V593100)
  ('bls-V593132'),
  -- Schwein/Rind, Hackfleisch gemischt, roh (keeps bls-U040100)
  ('bls-U040132'),
  ('bls-U045172'),
  ('bls-U040162'),
  ('bls-U040182'),
  -- Schwein/Rind, Hackfleisch gemischt, tiefgefroren (keeps bls-U047200)
  ('bls-U042232'),
  ('bls-U043262'),
  ('bls-U044262'),
  -- Schwertfisch roh (keeps bls-T612100)
  ('bls-T612152'),
  ('bls-T612182'),
  ('bls-Y662233'),
  -- Schwertfisch tiefgefroren (keeps bls-T612200)
  ('bls-T612252'),
  ('bls-T612282'),
  -- Seehecht tiefgefroren (keeps bls-T209200)
  ('bls-T209252'),
  ('bls-T209282'),
  -- Seehecht, roh (keeps blv-760)
  ('bls-T209152'),
  ('bls-T209182'),
  -- Seelachs im Backteig, tiefgefroren (keeps bls-T932200)
  ('bls-T932262'),
  ('bls-T932282'),
  -- Seelachs paniert, tiefgefroren (keeps bls-T931200)
  ('bls-T931292'),
  ('bls-T931262'),
  ('bls-T931282'),
  -- Seeteufel roh (keeps bls-T070100)
  ('bls-T070152'),
  ('bls-T070182'),
  ('bls-Y697612'),
  -- Seezunge tiefgefroren (keeps bls-T309200)
  ('bls-T309252'),
  ('bls-T309282'),
  -- Seezunge, roh (keeps blv-755)
  ('bls-T309152'),
  ('bls-T309182'),
  -- Seezungenfilet gebraten (keeps bls-Y633212)
  ('bls-Y634732'),
  -- Semmelknödel (keeps bls-X980112)
  ('bls-E606000'),
  ('bls-E606032'),
  ('bls-E606062'),
  ('bls-E606082'),
  ('bls-E606022'),
  -- Semmelknödel getrocknet (keeps bls-E606200; also kept: Semmelknödel getrocknet, gekocht [20.6])
  ('bls-E606282'),
  -- Shiitakepilz roh (keeps bls-K724100)
  ('bls-K724152'),
  ('bls-K724182'),
  -- Sojabohne reif (keeps bls-G750400)
  ('bls-G750432'),
  -- Sojasprossen, roh (keeps blv-466)
  ('bls-X574112'),
  -- Spargel (keeps off-7611100179515)
  ('bls-G450132'),
  ('bls-X545612'),
  ('bls-G450162'),
  ('bls-G450152'),
  ('bls-G451082'),
  -- Spargel tiefgefroren (keeps bls-G450200)
  ('bls-G450232'),
  ('bls-G450242'),
  ('bls-G450262'),
  ('bls-G450252'),
  ('bls-G450282'),
  -- Speisezwiebel roh (keeps bls-G480100)
  ('bls-G480132'),
  ('bls-G480072'),
  ('bls-G480162'),
  ('bls-G480152'),
  ('bls-G480182'),
  -- Speisezwiebel tiefgefroren (keeps bls-G480200)
  ('bls-G480232'),
  ('bls-G480262'),
  ('bls-G480252'),
  ('bls-G480282'),
  -- Spinat (keeps off-7613030006152)
  ('blv-365'),
  ('bls-G210132'),
  ('bls-G211162'),
  ('bls-G211152'),
  ('bls-G211182'),
  -- Spinat tiefgefroren (keeps bls-G211200)
  ('bls-G210232'),
  ('bls-G210262'),
  ('bls-G210252'),
  ('bls-G210282'),
  -- Spitzkohl roh (keeps bls-G344100)
  ('bls-G344132'),
  ('bls-G344162'),
  ('bls-G344152'),
  ('bls-G344182'),
  ('bls-X538853'),
  -- Sprotte roh (keeps bls-T106100)
  ('bls-T106152'),
  ('bls-T106182'),
  -- Stachelbeere, roh (keeps blv-400)
  ('bls-F305152'),
  -- Steinbutt roh (keeps bls-T302100)
  ('bls-T302152'),
  ('bls-T302182'),
  -- Steinbutt tiefgefroren (keeps bls-T302200)
  ('bls-T302252'),
  ('bls-T302282'),
  -- Steinpilz (keeps off-7613331601384; also kept: Steinpilz, roh [0.5])
  ('bls-K718162'),
  ('bls-K718182'),
  -- Stielmus/Rübstiel, roh (keeps bls-G420100)
  ('bls-G420132'),
  ('bls-G420152'),
  ('bls-G420182'),
  -- Stint roh (keeps bls-T402100)
  ('bls-T402152'),
  ('bls-T402182'),
  -- Stint tiefgefroren (keeps bls-T402200)
  ('bls-T402252'),
  ('bls-T402282'),
  -- Suppengrün/Suppenkraut, roh (keeps bls-G093100)
  ('bls-G093132'),
  -- Suppengrün/Suppenkraut, tiefgefroren (keeps bls-G093200)
  ('bls-G093232'),
  -- Suppenhuhn Fleisch, mit Haut, roh (keeps bls-V434100)
  ('bls-V432132'),
  -- Suppenhuhn Fleisch, mit Haut, tiefgefroren (keeps bls-V432200)
  ('bls-V432232'),
  -- Suppenhuhn Innereien, roh (keeps bls-V438100)
  ('bls-V438132'),
  ('bls-V438182'),
  -- Suppenhuhn Innereien, tiefgefroren (keeps bls-V438200)
  ('bls-V438232'),
  ('bls-V438282'),
  -- Suppenhuhn Schenkel, mit Haut, roh (keeps bls-V435100)
  ('bls-V435132'),
  -- Suppenhuhn Schenkel, mit Haut, tiefgefroren (keeps bls-V435200)
  ('bls-V435232'),
  -- Süßkirsche roh (keeps bls-F211100)
  ('bls-F211152'),
  -- Taube Fleisch, mit Haut, roh (keeps bls-V494100)
  ('bls-V494162'),
  -- Taube Fleisch, mit Haut, tiefgefroren (keeps bls-V494200)
  ('bls-V494262'),
  -- Teigwaren eifrei, roh (keeps bls-E401000; also kept: Teigwaren eifrei, gekocht [28.7])
  ('bls-E401062'),
  ('bls-E401082'),
  -- Thunfisch (keeps off-3838471026208)
  ('blv-756'),
  ('bls-T121172'),
  ('bls-T121162'),
  ('bls-T121182'),
  -- Thunfisch tiefgefroren (keeps bls-T121200)
  ('bls-T121272'),
  ('bls-T121262'),
  ('bls-T121282'),
  -- Tintenfisch (keeps off-7617027876414)
  ('bls-T020100'),
  ('bls-T020132'),
  ('bls-T020172'),
  ('bls-T020182'),
  -- Tintenfisch tiefgefroren (keeps bls-T020200)
  ('bls-T020232'),
  ('bls-T020272'),
  ('bls-T020252'),
  ('bls-T020262'),
  ('bls-T020282'),
  -- Tofu (keeps bls-H861000)
  ('bls-H861062'),
  ('bls-H861082'),
  ('bls-X572412'),
  -- Tomate, roh (keeps blv-348)
  ('bls-G561132'),
  ('bls-G561072'),
  ('bls-G561162'),
  ('bls-G561082'),
  -- Topinambur, roh (keeps blv-13441)
  ('bls-X572512'),
  -- Topinambur/Erdartischocke, roh (keeps bls-K430100)
  ('bls-K430132'),
  ('bls-K430162'),
  ('bls-K430182'),
  -- Trüffel getrocknet (keeps bls-K702400)
  ('bls-K702432'),
  -- Trüffel roh (keeps bls-K702100)
  ('bls-K702152'),
  ('bls-K702182'),
  -- Venusmuschel roh (keeps bls-T797100)
  ('bls-T797132'),
  ('bls-T797182'),
  -- Venusmuschel tiefgefroren (keeps bls-T797200)
  ('bls-T797232'),
  ('bls-T797282'),
  -- Vollkorneierteigwaren roh (keeps bls-E530000; also kept: Vollkorneierteigwaren gekocht [21.6])
  ('bls-E530062'),
  ('bls-E530082'),
  -- Vollkornhefeteig süß roh (keeps bls-D9A2000)
  ('bls-D9A2100'),
  -- Vollkornmürbeteig süß roh (keeps bls-D9A3000)
  ('bls-D9A3100'),
  -- Vollkornplunderteig roh (keeps bls-D9A4000)
  ('bls-D9A4100'),
  -- Vollkornteigwaren eifrei, roh (keeps bls-E510000; also kept: Vollkornteigwaren eifrei, gekocht [22.6])
  ('bls-E500062'),
  ('bls-E500082'),
  -- Wachsbohne roh (keeps bls-G720100)
  ('bls-G720132'),
  ('bls-G720152'),
  -- Wachsbohne tiefgefroren (keeps bls-G720200)
  ('bls-G720232'),
  ('bls-G720252'),
  -- Wachtel Fleisch, ohne Haut, roh (keeps bls-V354100)
  ('bls-V354162'),
  ('bls-V351182'),
  -- Wachtel Fleisch, ohne Haut, tiefgefroren (keeps bls-V351200)
  ('bls-V351262'),
  ('bls-V351282'),
  -- Wachtelei roh (keeps bls-E106100)
  ('bls-E101132'),
  ('bls-E105182'),
  -- Weinsauerkraut roh (keeps bls-G346100)
  ('bls-G346132'),
  ('bls-G346152'),
  -- Weiße Rübe/Wasserrübe/Herbstrübe, roh (keeps bls-G614100)
  ('bls-G614132'),
  ('bls-G614152'),
  -- Weißer Thun roh (keeps bls-T122100)
  ('bls-T122152'),
  ('bls-T122182'),
  -- Weißer Thun tiefgefroren (keeps bls-T122200)
  ('bls-T122252'),
  ('bls-T122282'),
  -- Weisskohl (keeps off-7610807077353)
  ('blv-453'),
  -- Weißkohl gekocht (keeps bls-G342132)
  ('bls-G342162'),
  ('bls-G342182'),
  -- Weizen ganzes Korn, gekocht (keeps bls-C111032; also kept: Weizen ganzes Korn, gekocht, gebacken [40.5])
  ('bls-C111082'),
  -- Wels roh (keeps bls-T506100)
  ('bls-T506152'),
  ('bls-T506182'),
  -- Wels tiefgefroren (keeps bls-T506200)
  ('bls-T506252'),
  ('bls-T506282'),
  -- Westfälische grobe Mettwurst (keeps bls-W115200)
  ('bls-W115282'),
  -- Wienerli (keeps blv-1082)
  ('blv-1589'),
  -- Wildente Fleisch, mit Haut, roh (keeps bls-V334100)
  ('bls-V334162'),
  -- Wildente Fleisch, mit Haut, tiefgefroren (keeps bls-V330200)
  ('bls-V330262'),
  -- Wildente Schenkel, mit Haut, roh (keeps bls-V335100)
  ('bls-V335162'),
  ('bls-V335182'),
  -- Wildkaninchen Fleisch, roh (keeps bls-V242100)
  ('bls-V242162'),
  -- Wildlachs (keeps off-7623186753633)
  ('bls-T417100'),
  ('bls-T417152'),
  ('bls-T417182'),
  -- Wildlachs tiefgefroren (keeps bls-T417200)
  ('bls-T417252'),
  ('bls-T417282'),
  -- Wildreis (keeps off-5410673004284; also kept: Wildreis roh [73.4])
  ('bls-C353132'),
  ('bls-C353182'),
  -- Wildschwein Fleisch, roh (keeps bls-V250100)
  ('bls-V250132'),
  ('bls-V250172'),
  ('bls-V250162'),
  ('bls-V250182'),
  -- Wildschwein Fleisch, tiefgefroren (keeps bls-V250200)
  ('bls-V250232'),
  ('bls-V250272'),
  ('bls-V250262'),
  ('bls-V250282'),
  -- Wirsing roh (keeps bls-G343100)
  ('bls-G343132'),
  ('bls-G343162'),
  ('bls-G343152'),
  ('bls-G343182'),
  ('bls-X539063'),
  -- Wurzelpetersilie roh (keeps bls-G670100; also kept: Wurzelpetersilie gebraten ohne Fett (Pfanne) [25.5])
  ('bls-G670132'),
  ('bls-G670162'),
  ('bls-G670152'),
  -- Yamswurzel roh (keeps bls-K440100; also kept: Yamswurzel gebacken [33])
  ('bls-K440132'),
  ('bls-K440182'),
  -- Zander roh (keeps bls-T603100)
  ('bls-T603172'),
  ('bls-T603152'),
  ('bls-T603182'),
  -- Zander tiefgefroren (keeps bls-T603200)
  ('bls-T603252'),
  ('bls-T603282'),
  -- Ziege Fleisch, roh (keeps bls-V122100)
  ('bls-V122162'),
  -- Zitrone (keeps off-7617027041973)
  ('blv-398'),
  -- Zucchini roh (keeps bls-G582100)
  ('bls-G582132'),
  ('bls-G582162'),
  ('bls-G582172'),
  ('bls-G582152'),
  ('bls-G582182'),
  ('bls-X558143'),
  -- Zuckererbse roh (keeps bls-G761100)
  ('bls-G761032'),
  ('bls-G761152'),
  -- Zuckererbse tiefgefroren (keeps bls-G761200)
  ('bls-G761232'),
  ('bls-G761252'),
  -- Zuckerhutsalat (keeps off-7617027631297)
  ('blv-465'),
  -- Zuckermais (keeps off-2151117004301; also kept: Zuckermais roh [9.4])
  ('bls-G570132'),
  ('bls-G570162'),
  ('bls-G570172'),
  ('bls-G570182'),
  -- Zuckermais tiefgefroren (keeps bls-G570200)
  ('bls-G570232'),
  ('bls-G570262'),
  ('bls-G570272'),
  ('bls-G570282'),
  -- Zwetschge, roh (keeps blv-479)
  ('bls-F223152'),
  -- Zwiebeln (keeps off-7610632963227)
  ('bls-X548163'),
  ('bls-X548443')
) as v(id)
where f.id = v.id
  and f.active;
