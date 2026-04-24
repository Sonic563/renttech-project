-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 24. 15:31
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `renttech`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `assets`
--

CREATE TABLE `assets` (
  `id` bigint(20) NOT NULL,
  `availability_status` enum('ELÉRHETŐ','KÖLCSÖNZÖTT','NEM_ELÉRHETŐ') DEFAULT NULL,
  `daily_price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `extra_description` text DEFAULT NULL,
  `image_id` bigint(20) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `assets`
--

INSERT INTO `assets` (`id`, `availability_status`, `daily_price`, `description`, `extra_description`, `image_id`, `image_url`, `name`, `category_id`) VALUES
(1, 'ELÉRHETŐ', 2000.00, 'Az **Apple iPad Air 2**(2. generáció) egy 2014-ben megjelent, vékony és könnyű tablet, amely 9,7 hüvelykes Retina kijelzővel és erős A8X processzorral rendelkezik. Jó teljesítményt és akár 10 órás üzemidőt kínál, valamint ez volt az első iPad, amely Touch ID ujjlenyomat-azonosítót kapott.', 'Mindössze 6,1 mm, ami megjelenésekor a világ legvékonyabb tabletje volt.\n**-Súly:** Kb. 437 gramm, rendkívül könnyen hordozható.\n**-Kijelző:** 9,7 hüvelykes Retina kijelző (2048 × 1536 felbontás).\n**-Laminált panel:** Ez volt az első iPad, ahol a kijelző és az üveg között nincs légrés, így a kép sokkal közelebbinek és élesebbnek tűnik.\n**-Tükröződésmentes bevonat:** Speciális réteg a jobb kültéri olvashatóságért.\n', 15, '/uploads/f19c0e37-a964-4052-ae90-3a6d2cd1b57a.png', 'Apple IPad Air 2nd Gen.', 6),
(2, 'ELÉRHETŐ', 1750.00, 'Az **Apple iPad mini 6 (8,3\")** egy kompakt, modern tablet kávamentes kialakítással és éles Liquid Retina kijelzővel. Kis mérete ellenére erős teljesítményt és prémium felhasználói élményt kínál.\n', '\n**-Kijelző:** 8,3 hüvelykes Liquid Retina panel.\n**-Design:** Teljesen új, szögletes alumínium ház, nincsenek vastag keretek és nincs fizikai Home gomb az előlapon.\n**-Felbontás:** 2266 × 1488 pixel, 326 ppi képsűrűség (nagyon éles kép).\n**-Technológia:** P3 széles színtartomány, True Tone (alkalmazkodik a környezeti fényekhez) és 500 nit fényerő.\n', 16, '/uploads/1f0fdf75-3a55-4add-8dbf-333c090e007e.png', 'Apple iPad mini 6 8.3', 6),
(3, 'ELÉRHETŐ', 1550.00, 'A **Lenovo Tab M11** egy kedvező árú, 11 hüvelykes tablet, amely 90 Hz-es kijelzőjével simább megjelenítést kínál a hétköznapi használathoz. IPS panelje és szemkímélő technológiája miatt kényelmes választás hosszabb tartalomfogyasztáshoz is.', '**-Kijelző:** 11 hüvelykes IPS LCD panel.\n**-Felbontás:** 1920 × 1200 pixel (WUXGA).\n**-Képfrissítés:** 90 Hz, ami simább görgetést és jobb vizuális élményt nyújt, mint a hagyományos 60 Hz-es panelek.\n**-Fényerő:** 400 nit, ami beltéren és árnyékban kiválóan látható.\n**-Tanúsítvány:** TÜV Rheinland alacsony kékfény-kibocsátási tanúsítvány a szem kímélése érdekében.\n', 17, '/uploads/a742004b-75d5-4172-a22b-cdf786f3efa0.png', 'Lenovo Tab M11', 6),
(4, 'ELÉRHETŐ', 2050.00, 'A **Samsung Galaxy Tab S9 FE** egy prémium középkategóriás tablet, amely 90 Hz-es kijelzőt és strapabíró, víz- és porálló kialakítást kínál. Fémháza és megbízható teljesítménye miatt tartós és sokoldalú választás.', 'Samsung Galaxy Tab S9 FE\n\n**-Kijelző:** 10,9 hüvelykes IPS LCD panel (nem AMOLED, mint a sima S9).\n**-Képfrissítés:** 90 Hz-es adaptív frissítés, amely simább mozgást biztosít.\n**-Felbontás:** 2304 × 1440 pixel.\n**-Strapabírás:** IP68-as minősítés, ami azt jelenti, hogy por- és vízálló (akár 1,5 méter mélyen is bírja 30 percig). Ez ritkaság a tabletek között.\n**-Ház:** Elegáns, teljes fém burkolat.', 19, '/uploads/63f48343-d66f-4dcc-aa87-34a00b901c5b.png', 'Samsung Galaxy Tab S9 FE', 6),
(5, 'ELÉRHETŐ', 2550.00, 'A **Reflex Sat300 hangfal** egy időjárásálló kültéri hangszóró, amely egész évben használható esőben és napsütésben is. Kompakt mérete ellenére tiszta, dinamikus hangzást nyújt, és rugalmasan elhelyezhető kertben vagy teraszon.', '**-Időjárásállóság:** Úgy tervezték, hogy egész évben kint maradhasson. Ellenáll az esőnek, UV-sugárzásnak és a szélsőséges hőmérsékletnek (IPX66 minősítés).\n**-Sokoldalú elhelyezés:** Leszúrható a földbe (mint egy kerti lámpa), felfüggeszthető a tető alá, vagy falra szerelhető.\n**-Hangzás:** A kompakt mérete ellenére (3,5 hüvelykes középmeghajtó) tiszta és dinamikus hangot ad, de az igazán telt hangzáshoz érdemes egy hozzá passzoló mélynyomóval (pl. Sub100) párosítani.\n\n', 20, '/uploads/19074bc3-67c8-4739-98fd-889d09f4d644.png', 'Reflex Sat300 hangfal', 4),
(6, 'ELÉRHETŐ', 2050.00, 'A **Marshall Code 100** egy 100 wattos modellező gitárerősítő, amely számos klasszikus Marshall hangzást képes visszaadni modern technológiával. Beépített presetjeinek köszönhetően könnyen testre szabható, így ideális gyakorláshoz és színpadi használatra is.', '**-Modellező technológia:** A Softube-bal közösen fejlesztett MST (Marshall-Softube) technológia, amely ikonikus Marshall erősítők, ládák és effektek hangját szimulálja.\n**-Teljesítmény:** 100 Watt, ami bőven elég próbaterembe, klubkoncertekre vagy akár nagyobb színpadokra is.\n**-Kialakítás:** Kapható Combo változatban (2x12\" hangszórókkal) vagy Fej (Head) kivitelben.\n**-Beépített memória:** 100 szerkeszthető preset, így elmentheted a saját hangzásaidat.\n', 21, '/uploads/25fc3a52-0bdb-4e09-8ea6-8a3d0ba615e0.png', 'Marshall Code 100', 4),
(7, 'ELÉRHETŐ', 1950.00, 'A **JBL PartyBox Encore Essential** egy 100 wattos, hordozható party hangszóró, amely erőteljes hangzást és látványos fényshow-t kínál. Akkumulátoros működésének és fröccsenésálló kialakításának köszönhetően ideális bulikhoz akár kültéren is.', '**-Teljesítmény:** 100 Watt (RMS).\n**-Hangszórók:** 1 db 5,25\" mélynyomó és 2 db 1,75\" magassugárzó.\n**-Akkumulátor:** Akár 6 óra játékidő (hangerőtől és fényektől függően).\n**-Töltési idő:** Kb. 3,5 óra a teljes feltöltésig.\n**-Vízállóság:** IPX4 minősítés (fröccsenésálló, így medence mellett vagy szemerkélő esőben is bírja).\n', 22, '/uploads/97ac129a-31eb-45a2-b206-5b0228a2a918.png', 'Jbl Partybox Encore Essential', 4),
(8, 'ELÉRHETŐ', 2350.00, 'A **JBL PartyBox Encore Essential** egy 100 wattos, hordozható party hangszóró, amely erőteljes hangzást és látványos fényshow-t kínál. Akkumulátoros működésének és fröccsenésálló kialakításának köszönhetően ideális bulikhoz akár kültéren is.', '**-Teljesítmény:** 240 Watt (RMS).\n**-Hangszórók:** 2 db 6,5 hüvelykes (165 mm) nagy érzékenységű mélynyomó és 2 db 1 hüvelykes (25 mm) dóm magassugárzó.\n**-AI Sound Boost:** Valós időben elemzi a bejövő jelet és egy algoritmus segítségével optimalizálja a hangszórók kitérését, így nagyobb hangerőn is torzításmentes, tiszta és erőteljesebb marad a hangzás.\n**-Frekvenciaátvitel:** 40 Hz – 20 kHz.\n\n', 23, '/uploads/00f46042-894c-4d95-9a4d-be9de3d66171.png', 'JBL Stage 320', 4),
(9, 'ELÉRHETŐ', 2450.00, 'A **PlayStation VR2** egy fejlett virtuális valóság szemüveg PS5-höz, amely 4K HDR OLED kijelzőjével és 120 Hz-es frissítésével rendkívül éles és folyamatos képet biztosít. A szemkövetés, haptikus visszajelzés és az egykábeles csatlakozás még valósághűbb és kényelmesebb játékélményt nyújt.', '**-4K HDR OLED kijelző:** Szemenként 2000 x 2040 pixeles felbontás, amely lenyűgözően éles és élénk képi világot biztosít.\n**-110 fokos látószög:** Széles látótér a mélyebb elmerülésért, Fresnel lencsékkel és állítható lencsetávolsággal.\n**-Akár 120 Hz-es frissítés:** Rendkívül sima mozgásmegjelenítés, ami csökkenti a VR-betegség (szédülés) esélyét.\n**-Tekintetkövetés (Eye Tracking):** A szemüveg érzékeli, hova nézel, és ott teszi a legélesebbé a képet (foveated rendering), ahol éppen tartózkodik a tekinteted.\n **-Szemüveg-visszacsatolás:** Egy beépített motor finom rezgésekkel jelzi a fejeden a játékbeli eseményeket (pl. egy elsuhanó tárgyat).\n**-PS VR2 Sense vezérlők:** Ergonomikus kontrollerek adaptív ravaszokkal és haptikus visszajelzéssel, pont mint a DualSense irányítóknál.\n**-Egykábeles csatlakozás:** Nem kell többé elosztódobozokkal bajlódni, egyetlen USB-C kábellel csatlakozik a PS5 előlapjához.\n**-Beépített kamerák:** Négy belső kamera követi a mozgásodat és a vezérlőket, így nincs szükség külső kamerára a szobában.\n**-Átlátszó nézet:** Egy gombnyomással megnézheted a valódi környezetedet anélkül, hogy le kellene venned a szemüveget.\n\n', 24, '/uploads/849923c8-cd19-4ed6-a8a9-334bf6c99db2.png', 'PlayStation 5 VR szemüveg', 7),
(10, 'ELÉRHETŐ', 2350.00, 'A **Meta Quest 3S** egy erős, önálló VR headset, amely a modern hardvernek köszönhetően zökkenőmentes játékélményt és vegyes valóság funkciókat kínál. Kábelmentes használata és kézkövetése miatt kényelmes és sokoldalú választás VR-élményekhez.\n', '**-Snapdragon XR2 Gen 2 lapkakészlet:** Ugyanaz az erős processzor dolgozik benne, mint a drágább Quest 3-ban, így minden legújabb játék és alkalmazás zökkenőmentesen fut rajta.\n**-Vegyes valóság (Mixed Reality):** Színes, nagy felbontású „passthrough” funkció, amivel a virtuális tárgyakat rávetítheted a valódi szobádra.\n**-Fresnel lencsék:** A költségcsökkentés érdekében a Quest 2-nél megismert lencséket használja (szemben a Quest 3 pancake lencséivel).\n**-Kontroller nélküli vezérlés:** Fejlett kézkövetés, így sok alkalmazást puszta kézzel, irányítók nélkül is kezelhetsz.\n**-Touch Plus vezérlők:** Gyűrű nélküli, ergonomikus kontrollerek precíz haptikus visszajelzéssel.\n**-Kábelmentes szabadság:** Teljesen önálló (standalone) eszköz, nem kell hozzá PC vagy konzol, de igény esetén számítógépre is köthető (Air Link vagy kábel segítségével).\n**-Fizikai Action Button:** Egy új gomb a készülék alján, amivel gyorsan válthatsz a teljes VR és a külvilágot mutató nézet között.\n**-Hatalmas tartalomkönyvtár:** Hozzáférés a Meta Quest Store több ezer játékához és alkalmazásához, beleértve az exkluzív címeket is.\n\n', 25, '/uploads/3f1cddda-3b3b-4a70-ad7b-eaea99295c69.png', 'Meta Oculos Quest 3S VR', 7),
(11, 'ELÉRHETŐ', 2400.00, 'Az **Oculus Quest 2** egy önálló VR szemüveg, amely PC nélkül is használható, mégis erős hardverének köszönhetően élvezetes és gördülékeny élményt nyújt. Nagy felbontású kijelzője és pontos mozgáskövetése miatt ideális játékra és virtuális élményekhez is.\n', '**-Önálló működés:** Nincs szükség PC-re vagy kábelekre, a szemüveg beépített processzorral (Snapdragon XR2) és akkumulátorral rendelkezik.\n**-Nagy felbontású kijelző:** Szemenként 1832 x 1920 pixeles felbontás, ami éles képet és minimális „szúnyogháló-effektust” biztosít.\n**-90 Hz / 120 Hz frissítési gyakoriság:** Sima mozgásmegjelenítés, ami segít megelőzni a szédülést és valósághűbbé teszi a játékokat.\n**-6DoF (Six Degrees of Freedom) követés:** A belső kamerák pontosan érzékelik a fejed és a kezed mozgását a térben, külső szenzorok nélkül.\n**-Touch kontrollerek:** Ergonomikus irányítók precíz követéssel és hosszú akkumulátor-üzemidővel (AA elemmel működnek).\n**-PC VR lehetőség:** Egy USB-C kábellel (Oculus Link) vagy vezeték nélkül (Air Link) számítógépre köthető, így a komolyabb PC-s VR játékok (pl. Half-Life: Alyx) is játszhatók vele.\n**-Beépített térhatású hang:** A fejpántba épített hangszórók közvetlenül a füledhez sugározzák a hangot, de van 3,5 mm-es jack csatlakozó is saját fülhallgatóhoz.\n**-Kéz követés:** Bizonyos alkalmazásoknál kontroller nélkül, a puszta kezeddel is irányíthatod a menüket vagy játszhatsz.', NULL, NULL, 'Oculus Quest 2 VR szemüveg', 7),
(12, 'ELÉRHETŐ', 2100.00, 'A **Samsung Gear VR** egy okostelefonra épülő virtuális valóság szemüveg, amely a telefon kijelzőjét és teljesítményét használja a VR élményhez. Egyszerű és megfizethető megoldás volt, azonban mára elavult, és a hivatalos támogatása megszűnt.', '**-Okostelefon-függőség:** A szemüveg önmagában nem működik, egy kompatibilis Samsung Galaxy telefont kell az előlapjába pattintani, amely kijelzőként és processzorként szolgál.\n**-Kompatibilitás:** Csak régebbi modellekkel működik (kb. a Galaxy S6-tól a Galaxy S10-ig). Az újabb telefonok (S20 és felette) már fizikailag vagy szoftveresen nem támogatják.\n**-Vezérlés:** A szemüveg oldalán található egy érintőfelület (touchpad) és gombok, de a későbbi kiadásokhoz egy különálló, kézi Bluetooth-kontroller is járt.\n**-Optika:** Kiváló minőségű lencsékkel rendelkezik, a tetején pedig egy tárcsával állítható a fókusz, így szemüveg nélkül is sokan élesen látják a képet.\n**-Tartalom:** Az Oculus Store-on keresztül volt elérhető hozzá rengeteg játék, 360 fokos videó és virtuális moziélmény (azonban a szoftveres támogatás már hivatalosan megszűnt).\n**Szenzorok:** Beépített gyorsulásmérővel és gyroszkóppal rendelkezik, ami pontosabb fejkövetést tesz lehetővé, mint az egyszerűbb \"Cardboard\" típusú szemüvegek.\n **-Kényelem:** Párnázott belső rész és állítható pántok gondoskodnak arról, hogy hosszabb ideig is kényelmes maradjon.\n', 26, '/uploads/4944960a-3a0e-4577-80be-e096f52c65bd.png', 'Samsung gear VR szemüveg', 7),
(13, 'ELÉRHETŐ', 1250.00, 'Az **Overmax 3.5 projektor** egy kompakt, könnyen hordozható eszköz, amely akár 150 colos képet is képes vetíteni otthoni moziélményhez. Wi-Fi kapcsolata és sokoldalú csatlakozói miatt egyszerűen használható különböző eszközökkel is.', '**-150 colos maximális képátló:** Akár 3,8 méteres méretben is vetíthetsz vele, így valódi moziélményt nyújt otthon.\n**-Native 720p felbontás:** HD minőségű vetítést tesz lehetővé, de támogatja az 1080p (Full HD) tartalmak lejátszását is.\n**-Wi-Fi csatlakozás:** Lehetővé teszi az okostelefon vagy tabletta képének vezeték nélküli tükrözését (Mirror Screen).\n**-Hosszú élettartamú LED lámpa:** Akár 50 000 óra üzemidőt ígér, ami napi több órás használat mellett is hosszú évekig kitart.\n**-Beépített hangszórók:** Sztereó hangrendszerrel rendelkezik, így külön hangfalak nélkül is használható kisebb helyiségekben.\n**-Sokoldalú csatlakozók:** HDMI, USB, VGA és AV bemenetekkel rendelkezik, így laptopot, konzolt vagy pendrive-ot is ráköthetsz.\n**-Manuális trapézkorrekció:** Segít a kép torzításának kijavításában, ha a projektor nem pont a fal közepével szemben áll.\n**-Kompakt méret:** Könnyen hordozható, így akár baráti összejövetelekre vagy kerti mozizáshoz is elvihető.', 27, '/uploads/a6f75611-fe87-45d9-9a12-54bcc5c8a8af.png', 'Overmax 3.5', 3),
(14, 'ELÉRHETŐ', 1350.00, 'Az **Elephas mini projektor** egy rendkívül kompakt és hordozható vetítő, amely könnyen használható otthon vagy utazás közben is. Vezeték nélküli tükrözésének és széles csatlakozási lehetőségeinek köszönhetően egyszerűen csatlakoztatható különböző eszközökhöz.\n', '**-Ultra-hordozható méret:** Akár egy tenyérben is elfér, így könnyen mozgatható a szobák között vagy elvihető utazásokhoz.\n**-Full HD (1080p) támogatás:** Bár a natív felbontása általában alacsonyabb, képes fogadni és lejátszani a nagy felbontású tartalmakat.\n**-Vezeték nélküli tükrözés:** A legtöbb modell rendelkezik Wi-Fi funkcióval, így közvetlenül streamelhetsz képet iOS vagy Android telefonról.\n**-Diffúz reflexiós technológia:** Kíméli a szemet, mivel nem közvetlen fényt sugároz, mint a TV-k, így kevésbé fárasztó a nézése.\n**-Széleskörű kompatibilitás:** Található rajta HDMI, USB, AV és audio kimenet, így játékkonzolt, laptopot vagy TV-okosítót is ráköthetsz.\n**-Halk hűtőrendszer:** Fejlett zajcsökkentő technológiával rendelkezik, hogy a ventilátor zúgása ne zavarja a filmélményt.\n**-Beépített Hi-Fi hangszóró:** Alapszintű hangzást biztosít, de külső hangfal is csatlakoztatható hozzá a mozihatás érdekében.\n**-Akár 200 colos képátló:** Megfelelő távolságból hatalmas vetített felületet képes létrehozni (bár a legjobb minőséget 60-100 col között adja).\n\n', 28, '/uploads/f262b7a9-fb05-49dc-90c8-165859cbb745.png', 'Elephas mini projektor', 3),
(15, 'ELÉRHETŐ', 2000.00, 'A **Samsung The Premiere LSP7T** egy prémium ultra rövid vetítési távolságú 4K projektor, amely már kis távolságból is hatalmas, éles képet biztosít. Beépített hangrendszere és okosfunkciói révén komplett házimozi megoldást kínál egyetlen eszközben.\n', '**-Ultra rövid hatótáv:** Akár 30 cm-ről is képes 120 colos (kb. 3 méteres) képátlót vetíteni, így nincs szükség mennyezeti konzolra vagy kábelezésre a szoba túloldalán.\n**-4K UHD felbontás:** Kristálytiszta képminőség lézeres fényforrással, amely 2200 ANSI lumen fényerőt biztosít.\n**-Lézer technológia:** Hosszú élettartam (akár 20 000 óra) és kiváló színpontosság, amely lefedi a DCI-P3 színtartomány 83%-át.\n**-Filmmaker Mode:** A világon az első projektor, amely tartalmazza ezt a módot, így a filmeket úgy nézheted, ahogy azt a rendező eredetileg megálmodta.\n**-Beépített 2.2 csatornás hangrendszer:** 30W teljesítményű hangszórók mélynyomóval, így külön hangrendszer nélkül is erőteljes hangzást nyújt.\n**-Smart TV funkciók:** A Samsung Tizen operációs rendszere fut rajta, tehát közvetlenül elérhető a Netflix, YouTube, HBO Max és a Disney+ is.\n**-Vezeték nélküli kapcsolat:** AirPlay 2 támogatás és képernyőtükrözés (Tap View), amivel egyetlen érintéssel átviheted a telefonod képét.\n**-Minimalista dizájn:** Elegáns, fehér szövetborítású készülékház, amely diszkréten illeszkedik a modern nappalikba.\n\n', 30, '/uploads/bc8a194e-f5e1-4782-acad-d35df205543e.png', 'Samsung The Premiere LSP7T ', 3),
(16, 'ELÉRHETŐ', 1750.00, 'Az **Epson EB-435W** egy rövid vetítési távolságú projektor, amely ideális oktatási és irodai környezetbe, mivel kis helyről is nagy képet vetít. Erős fényereje és beépített hangszórója miatt világos helyiségekben is jól használható.\n', 'Epson EB-435W\n\n**-Rövid hatótávolságú lencse:** Már 71 cm-es távolságból képes egy hatalmas, 178 cm-es (70 colos) kép kivetítésére, így a vetítő közvetlenül a tábla elé szerelhető, és az előadó nem takar bele a képbe.\n**-3LCD technológia:** Az Epson saját rendszere, amely egyformán magas fehér- és színesfény-kibocsátást biztosít (3000 lumen), így a színek élénkek és természetesek maradnak világos szobában is.\n**-WXGA felbontás (1280x800):** Szélesvásznú (16:10) képformátum, amely ideális a modern laptopok képének torzításmentes megjelenítéséhez.\n**-Hosszú lámpaélettartam:** Gazdaságos (Eco) üzemmódban akár 6000 órát is bír, ami jelentősen csökkenti a karbantartási költségeket.\n**-Beépített 16W-os hangszóró:** Rendkívül erős beépített hangrendszer, amely egy átlagos méretű osztálytermet vagy irodát külön külső hangfalak nélkül is képes besugározni.\n**-HDMI csatlakozó:** Digitális videó- és hangbemenet a modern eszközök egyszerű csatlakoztatásához.\n**-USB Display (3 az 1-ben):** Egyetlen USB kábellel továbbítható a kép, a hang és a vezérlés (egér funkció) a számítógépről.\n**-Vízszintes és függőleges trapézkorrekció:** Rugalmas elhelyezést tesz lehetővé, mivel a kép torzítása manuálisan és automatikusan is könnyen korrigálható.\n\n', 29, '/uploads/7228c94b-caf5-4e4e-9df1-4b8bd3854d36.png', 'Epson EB-435W', 3),
(17, 'ELÉRHETŐ', 1250.00, 'A **Lenovo IdeaPad Slim 3** egy vékony és könnyű laptop, amely ideális mindennapi használatra, tanuláshoz és irodai munkához. Megbízható teljesítményt, jó kijelzőt és praktikus funkciókat kínál kedvező áron.\n', '**-Vékony és könnyű kialakítás:** Alig 1,6–1,8 kg körüli súly, így ideális diákoknak vagy irodai munkához, ha sokat kell hordozni.\n**-Különböző processzor opciók:** Elérhető hatékony Intel Core (i3/i5/i7) és AMD Ryzen (3/5/7) chipekkel is a napi feladatokhoz.\n**-FHD (1920x1080) kijelző:** 14 vagy 15,6 colos méretben, többnyire matt felülettel, ami csökkenti a tükröződést.\n**-Fizikai webkamera-zár:** Egy elhúzható fedél gondoskodik a magánéletről, ha épp nem használod a kamerát.\n**-Rapid Charge (Gyorstöltés):** Körülbelül 15 perc töltéssel akár 2 órányi használatot is nyerhetsz.\n**-Bőséges csatlakozók:** USB-C (adatátvitelre és tápellátásra), HDMI, SD-kártyaolvasó és hagyományos USB portok.\n**-Dolby Audio hangszórók:** Tiszta hangzás filmnézéshez és online megbeszélésekhez.\n**-Katonai szintű tartósság:** Az újabb generációk megfelelnek a MIL-STD-810H szabványnak, tehát bírják az ütődéseket és a rázkódást.\n\n', 32, '/uploads/f3e80ca0-8921-4dee-8794-9d1aeb8b52d1.png', 'Lenovo IdeaPad Slim 3', 1),
(18, 'ELÉRHETŐ', 1350.00, 'A **Dell Latitude 5510** egy megbízható üzleti laptop, amely erős teljesítményt és bővíthetőséget kínál irodai munkához. Strapabíró kialakítása és fejlett biztonsági funkciói miatt hosszú távon is stabil választás.\n', '**-10. generációs Intel Core processzorok:** Megbízható teljesítmény irodai szoftverekhez és többfeladatos munkavégzéshez.\n**-15,6 colos FHD (1080p) kijelző:** Tükröződésmentes bevonattal, amely kíméli a szemet hosszú munkavégzés alatt is.\n**-Skálázható memória és tárhely:** Két RAM-foglalattal rendelkezik (akár 32 GB-ig bővíthető), és az SSD is könnyen cserélhető.\n**-Kiváló csatlakoztathatóság:** USB-C (DisplayPort és tápellátás funkcióval), HDMI, RJ-45 (Ethernet) és microSD kártyaolvasó.\n**-Üzleti szintű biztonság:** Opcionális ujjlenyomat-olvasó, arcfelismerős kamera és fizikai webkamera-takaró.\n**-Strapabíró ház:** Megfelel a MIL-STD 810G katonai szabványoknak, így ellenáll a pornak, rezgésnek és a szélsőséges hőmérsékletnek.\n**-Kényelmes billentyűzet:** Teljes méretű klaviatúra numerikus paddal, ami elengedhetetlen táblázatkezeléshez vagy könyveléshez.\n**-Hosszú akkumulátor-üzemidő:** Intelligens energiagazdálkodás, amely segít kihúzni a teljes munkanapot töltő nélkül.', 33, '/uploads/6b0fd66b-93f8-4f7d-ae70-170af5ac04dc.png', 'Dell Latitude 5510 ', 1),
(19, 'ELÉRHETŐ', 1800.00, 'Az **ASUS TUF Gaming F15 FX506HM** egy erős gamer laptop, amely nagy teljesítményű processzorral és RTX 3060 videokártyával kiváló játékélményt nyújt. Strapabíró kialakítása és 144 Hz-es kijelzője miatt intenzív használatra is ideális.\n', '**-Intel Core i5-11400H vagy i7-11800H processzor:** 11. generációs chipek, amelyek kiválóak játékhoz és párhuzamos feladatvégzéshez.\n**-NVIDIA GeForce RTX 3060 grafikus kártya:** Támogatja a Ray Tracing technológiát és a DLSS-t a magasabb képkockasebességért.\n**-144 Hz-es FHD kijelző:** Magas frissítési gyakoriság a sima és elmosódásmentes játékélményért.\n**-Katonai szintű tartósság (MIL-STD-810H):** Ellenáll az ütődéseknek, a páratartalomnak és a szélsőséges hőmérsékletnek.\n**-RGB háttérvilágítású billentyűzet:** Testreszabható színek és kiemelt WASD billentyűk a játékosok igényeihez.\n**-Hatékony hűtőrendszer:** Öntisztító technológia és több hőcső gondoskodik a stabil teljesítményről intenzív terhelés alatt is.\n**-Thunderbolt 4 csatlakozó:** Ultra-gyors adatátvitel és külső monitorok támogatása egyetlen porton keresztül.\n**-Könnyű bővíthetőség:** A ház alja könnyen nyitható, így a memória (RAM) és az SSD tárhely egyszerűen fejleszthető.\n', 35, '/uploads/30f89b13-4c54-46cf-9690-b3ee810659c1.png', 'ASUS TUF Gaming F15 FX506HM', 1),
(20, 'ELÉRHETŐ', 2000.00, 'Az **Apple MacBook Air 13\" (2020, M1)** egy rendkívül könnyű és halk laptop, amely az Apple M1 chipnek köszönhetően kiemelkedő teljesítményt és hosszú üzemidőt kínál. Prémium kijelzője és hordozhatósága miatt ideális mindennapi munkára és tanulásra.', '**-Apple M1 chip:** 8 magos CPU és akár 8 magos GPU, amely drasztikus ugrást jelentett sebességben és hatékonyságban az elődökhöz képest.\n**-Ventilátor nélküli kialakítás:** A gép teljesen néma használat közben, még komolyabb terhelés alatt sem ad ki hangot.\n**-Retina kijelző True Tone technológiával:** 2560 x 1600 képpontos felbontás, amely a környezeti fényekhez igazítja a színeket a kényelmesebb olvasásért.\n**-Magic Keyboard:** A korábbi (problémás) pillangómechanikát leváltotta a megbízható és kényelmes ollómechanikás billentyűzet.\n**-Akár 18 órás akkumulátor-üzemidő:** Az egyik legjobb üzemidő a kategóriájában, ami egy teljes munkanapot bőven kibír töltő nélkül.\n**-Touch ID:** Gyors és biztonságos bejelentkezés, valamint fizetés az ujjlenyomat-olvasó segítségével.\n**-P3 széles színtartomány:** 25%-kal több színt jelenít meg, mint az RGB, ami fontos a fotósoknak és videósoknak.\n**-Kompakt és elegáns ház:** 1,29 kg-os súly és 100%-ban újrahasznosított alumíniumból készült váz.\n\n', 40, '/uploads/14309fa4-7ca1-4156-a0d2-673573455a6d.png', ' Apple MacBook Air 13\' 2020', 1),
(21, 'ELÉRHETŐ', 1950.00, 'A **DJI Osmo Pocket 3 Creator Combo** egy kompakt, professzionális kamera, amely nagy szenzorának és 3 tengelyes stabilizálásának köszönhetően kiváló minőségű, sima videókat készít. Ideális választás vloggereknek és tartalomkészítőknek a hordozhatóság és a fejlett funkciók miatt.\n', '**-hüvelykes CMOS szenzor:** Sokkal nagyobb, mint az elődöké, így gyenge fényviszonyok között is kristálytiszta, részletgazdag 4K videókat készít.\n**-colos elforgatható OLED érintőképernyő:** Vízszintes és függőleges állásba is forgatható, így azonnal válthatsz a YouTube és a TikTok formátumok között.\n**-tengelyes mechanikus stabilizálás:** Fizikai gimbal gondoskodik arról, hogy a felvétel selymesen sima maradjon, még futás közben is.\n**-4K/120 fps lassítás:** Rendkívül látványos lassított felvételeket készíthetsz vele Ultra HD felbontásban.\n**-ActiveTrack 6.0:** Intelligens arcfelismerés és tárgykövetés, amivel a kamera magától követ téged, ha mozogsz a kép előtt.\n**-Gyorstöltés:** Mindössze 16 perc alatt 80%-ra tölthető, így szinte azonnal folytathatod a munkát.\n**-10-bites D-Log M színprofil:** Professzionális utómunkát és több mint egymilliárd színárnyalatot tesz lehetővé.', 36, '/uploads/bf8a3706-df45-4b2e-b849-51671082b8be.png', 'DJI Osmo Pocket 3 creator combo', 2),
(22, 'ELÉRHETŐ', 1900.00, 'A **GoPro HERO13 Extended Bundle** egy csúcskategóriás akciókamera, amely kiemelkedő videóminőséget és fejlett stabilizálást kínál extrém körülmények között is. Sokoldalú kiegészítőivel és erős teljesítményével ideális sportoláshoz és profi felvételek készítéséhez.\n', '**-5.3K/60 fps videó és 27 MP fotók:** Rendkívül magas felbontás a tűéles felvételekért, akár professzionális felhasználásra is.\n**-Mágneses rögzítőrendszer (Magnetic Latch):** Az új csatlakozónak köszönhetően pillanatok alatt, csavarozás nélkül válthatsz a különböző tartók és állványok között.\n**-HB-sorozatú cserélhető lencsék:** A gép automatikusan felismeri az új típusú (Macro, Ultraszéles, Anamorf vagy ND szűrő) lencséket, és magától beállítja a hozzájuk tartozó optimális módot.\n**-Nagyobb kapacitású Enduro akkumulátor:** Jobb üzemidő minden hőmérsékleti körülmény között, így hosszabb ideig forgathatsz egy töltéssel.\n**-HyperSmooth 6.0 + 360° Horizon Lock:** A piacvezető szoftveres stabilizálás, amely még akkor is vízszintesen tartja a horizontot, ha a kamera teljesen átfordul.\n**-HLG HDR videó:** Professzionális dinamikatartomány a gazdagabb színekért és a részletesebb árnyékokért.\n**-GPS visszatérés:** A Hero12-ből hiányzó, de itt visszatérő funkció, amivel rögzítheted a sebességet, magasságot és az útvonalat.', 37, '/uploads/a1414f63-2e40-4eec-9b4e-eeb37d79c728.png', 'Gopro Hero13 Extended Bundle', 2),
(23, 'ELÉRHETŐ', 1800.00, 'A **Canon EOS C70** egy professzionális filmes kamera, amely kiemelkedő képminőséget és nagy dinamikatartományt kínál kompakt kivitelben. Fejlett autofókusza és videós funkciói miatt ideális választás komoly videóprodukciókhoz és tartalomkészítéshez.\n', '**-4K Super 35mm DGO (Dual Gain Output) szenzor:** Kiemelkedő, 16+ fényértéknyi dinamikatartományt biztosít, minimális zaj mellett, különösen HDR felvételeknél.\n**-4K/120 fps és 2K/180 fps rögzítés:** Magas képkockasebességű lassított felvételek 4:2:2 10-bit minőségben, hangrögzítéssel együtt.\n**-RF-objektív foglalat:** Lehetővé teszi a legújabb, tűéles Canon RF objektívek használatát, de adapterrel a klasszikus EF lencsékkel is tökéletesen működik.\n**-Dual Pixel CMOS AF iTR AF X-szel:** Rendkívül gyors és pontos autofókusz, amely mélytanulásos technológiával követi az arcokat és a fejeket, még akkor is, ha elfordulnak.\n**-Beépített mechanikus ND-szűrők:** Egy gombnyomással aktiválható 2, 4, 6, 8 vagy 10 fényértéknyi sötétítés a precíz expozícióért erős fényben is.\n**-Kompakt, ergonomikus kialakítás:** Bár filmes kamera, a formája közelebb áll egy fényképezőgéphez, így könnyen használható kézből vagy gimbalon.\n**-Profi csatlakozók:** Két darab mini-XLR bemenet a professzionális hanghoz, időkód (Timecode) csatlakozó és teljes méretű HDMI kimenet.\n**-Dupla SD-kártyahely:** Támogatja a párhuzamos rögzítést különböző formátumokban (pl. 4K és proxy), vagy az egymás utáni (relay) felvételt.\n**-Függőleges videózás támogatása:** Külön rögzítési pontok és szoftveres optimalizáció segítik a közösségi médiára szánt álló formátumú videók készítését.\n\n', 38, '/uploads/776c00ad-e0bb-422d-bfc8-b36fe2d9d553.png', 'Canon C70 kamera', 2),
(24, 'ELÉRHETŐ', 1750.00, 'A **Canon EOS 1300D** egy belépő szintű DSLR fényképezőgép, amely kiváló képminőséget és egyszerű kezelhetőséget kínál kezdők számára. Wi-Fi kapcsolata és cserélhető objektívei miatt rugalmas választás tanuláshoz és hobbi fotózáshoz.\n', '**-** 18 megapixeles APS-C szenzor, amely sokkal jobb képminőséget és elmosott hátteret biztosít, mint egy telefon.Beépített Wi-Fi és NFC, így a képek azonnal átküldhetők mobilra vagy táblagépre.\n**-** Full HD videofelvétel, amely alkalmas családi videók és hobbi-projektek készítésére.\n**-** 9 pontos autofókusz rendszer, amely segít a téma gyors élesre állításában.\n**-** Beépített funkcióismertető, amely a kijelzőn magyarázza el a beállítások hatásait a kezdőknek.\n**-** Nagy fényerejű, 3 colos LCD kijelző a fotók visszanézéséhez és a menü kezeléséhez.\n**-** Cserélhető objektíves rendszer, így a gép kompatibilis a Canon hatalmas EF és EF-S objektívválasztékával.\n**-** Hosszú akkumulátor-üzemidő, ami egy töltéssel több száz kép készítését teszi lehetővé', 42, '/uploads/dc960ef0-091c-45a6-9d69-88255e3f9811.png', 'Canon EOS 1300D SLR Kamera', 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `booking_date` datetime(6) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `days` int(11) NOT NULL,
  `delivery_method` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` varchar(2000) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `shipping_zip` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `device_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `bookings`
--

INSERT INTO `bookings` (`id`, `booking_date`, `customer_name`, `days`, `delivery_method`, `end_date`, `note`, `payment_method`, `payment_status`, `phone`, `shipping_address`, `shipping_city`, `shipping_zip`, `start_date`, `status`, `total_price`, `device_id`, `user_id`) VALUES
(1, '2026-04-24 13:11:06.000000', 'KISS PISTA', 3, 'COURIER', '2026-04-26', '', 'CARD', 'PAID', '+367037237', 'dwdwdd', 'Nydfadwadaw', '4400', '2026-04-24', 'teljesítve', 5250.00, 2, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `description`, `name`) VALUES
(1, 'Hordozható számítógépek', 'Laptopok'),
(2, 'Digitális fényképezőgépek', 'Fényképezőgépek'),
(3, 'Projektorok prezentációkhoz', 'Projektorok'),
(4, 'Hangosítási berendezések', 'Hangrendszerek'),
(5, 'Egyéb technikai eszközök', 'Egyéb'),
(6, 'Automatikusan létrehozott kategória', 'Tabletek'),
(7, 'Automatikusan létrehozott kategória', 'VR eszközök');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `images`
--

CREATE TABLE `images` (
  `id` bigint(20) NOT NULL,
  `content_type` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `uploaded_at` datetime(6) NOT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `images`
--

INSERT INTO `images` (`id`, `content_type`, `description`, `file_name`, `file_size`, `uploaded_at`, `uploaded_by`, `image_url`) VALUES
(15, 'image/png', 'Eszköz képe', 'teszt.png', 783345, '2026-04-24 10:41:26.000000', 'admin', '/uploads/f19c0e37-a964-4052-ae90-3a6d2cd1b57a.png'),
(16, 'image/png', 'Eszköz képe', 'Apple iPad mini 6.png', 1808999, '2026-04-24 10:49:28.000000', 'admin', '/uploads/1f0fdf75-3a55-4add-8dbf-333c090e007e.png'),
(17, 'image/png', 'Eszköz képe', 'Lenovo Tab M11.png', 1750146, '2026-04-24 11:26:31.000000', 'admin', '/uploads/a742004b-75d5-4172-a22b-cdf786f3efa0.png'),
(18, 'image/png', 'Eszköz képe', 'Samsung Galaxy Tab S9 FE.png', 2012439, '2026-04-24 11:32:18.000000', 'admin', '/uploads/5a2f8a7f-3854-419c-9713-1fc120dea042.png'),
(19, 'image/png', 'Eszköz képe', 'Samsung Galaxy Tab S9 FE.png', 2012439, '2026-04-24 11:32:54.000000', 'admin', '/uploads/63f48343-d66f-4dcc-aa87-34a00b901c5b.png'),
(20, 'image/png', 'Eszköz képe', 'Reflex Sat300 hangfal.png', 2777686, '2026-04-24 11:37:43.000000', 'admin', '/uploads/19074bc3-67c8-4739-98fd-889d09f4d644.png'),
(21, 'image/png', 'Eszköz képe', 'Marshall Code 100.png', 1712852, '2026-04-24 11:56:37.000000', 'admin', '/uploads/25fc3a52-0bdb-4e09-8ea6-8a3d0ba615e0.png'),
(22, 'image/png', 'Eszköz képe', 'Jbl Partybox Encore Essential.png', 1529771, '2026-04-24 12:04:21.000000', 'admin', '/uploads/97ac129a-31eb-45a2-b206-5b0228a2a918.png'),
(23, 'image/png', 'Eszköz képe', 'JBL Stage 320.png', 1347579, '2026-04-24 12:19:13.000000', 'admin', '/uploads/00f46042-894c-4d95-9a4d-be9de3d66171.png'),
(24, 'image/png', 'Eszköz képe', 'PlayStation 5 VR szemüveg.png', 2546318, '2026-04-24 12:23:26.000000', 'admin', '/uploads/849923c8-cd19-4ed6-a8a9-334bf6c99db2.png'),
(25, 'image/png', 'Eszköz képe', 'Meta Oculos Quest 3S VR.png', 1021256, '2026-04-24 12:26:58.000000', 'admin', '/uploads/3f1cddda-3b3b-4a70-ad7b-eaea99295c69.png'),
(26, 'image/png', 'Eszköz képe', 'Samsung gear VR szemüveg.png', 967126, '2026-04-24 14:08:25.000000', 'admin', '/uploads/4944960a-3a0e-4577-80be-e096f52c65bd.png'),
(27, 'image/png', 'Eszköz képe', 'Overmax 3.5.png', 3267633, '2026-04-24 14:11:20.000000', 'admin', '/uploads/a6f75611-fe87-45d9-9a12-54bcc5c8a8af.png'),
(28, 'image/png', 'Eszköz képe', 'Elephas mini projektor.png', 4247276, '2026-04-24 14:15:02.000000', 'admin', '/uploads/f262b7a9-fb05-49dc-90c8-165859cbb745.png'),
(29, 'image/png', 'Eszköz képe', 'Epson EB-435W.png', 1048882, '2026-04-24 14:20:36.000000', 'admin', '/uploads/7228c94b-caf5-4e4e-9df1-4b8bd3854d36.png'),
(30, 'image/png', 'Eszköz képe', 'Samsung The Premiere LSP7T.png', 1788772, '2026-04-24 14:21:00.000000', 'admin', '/uploads/bc8a194e-f5e1-4782-acad-d35df205543e.png'),
(31, 'image/png', 'Eszköz képe', 'Lenovo IdeaPad Slim 3.png', 1640270, '2026-04-24 14:24:02.000000', 'admin', '/uploads/cb701e85-bf3c-4210-91f6-a6eb639fca1c.png'),
(32, 'image/png', 'Eszköz képe', 'Lenovo IdeaPad Slim 3.png', 1640270, '2026-04-24 14:27:20.000000', 'admin', '/uploads/f3e80ca0-8921-4dee-8794-9d1aeb8b52d1.png'),
(33, 'image/png', 'Eszköz képe', 'Dell Latitude 5510.png', 1212003, '2026-04-24 14:27:49.000000', 'admin', '/uploads/6b0fd66b-93f8-4f7d-ae70-170af5ac04dc.png'),
(34, 'image/png', 'Eszköz képe', 'ASUS TUF Gaming F15 FX506HM.png', 2299357, '2026-04-24 14:39:19.000000', 'admin', '/uploads/c465f1fe-a106-49b1-adcf-0c12263b00a1.png'),
(35, 'image/png', 'Eszköz képe', 'ASUS TUF Gaming F15 FX506HM.png', 2299357, '2026-04-24 14:39:20.000000', 'admin', '/uploads/30f89b13-4c54-46cf-9690-b3ee810659c1.png'),
(36, 'image/png', 'Eszköz képe', 'DJI Osmo Pocket 3 creator combo.png', 2804323, '2026-04-24 14:44:34.000000', 'admin', '/uploads/bf8a3706-df45-4b2e-b849-51671082b8be.png'),
(37, 'image/png', 'Eszköz képe', 'Gopro Hero13 Extended Bundle.png', 2244273, '2026-04-24 14:46:53.000000', 'admin', '/uploads/a1414f63-2e40-4eec-9b4e-eeb37d79c728.png'),
(38, 'image/png', 'Eszköz képe', 'Canon C70 kamera.png', 2078181, '2026-04-24 14:49:46.000000', 'admin', '/uploads/776c00ad-e0bb-422d-bfc8-b36fe2d9d553.png'),
(39, 'image/png', 'Eszköz képe', 'Apple MacBook Air 13\' 2020.png', 1373487, '2026-04-24 14:53:10.000000', 'admin', '/uploads/7f530376-e1b3-4ac2-ab4b-c03ddf29b123.png'),
(40, 'image/png', 'Eszköz képe', 'Apple MacBook Air 13\' 2020.png', 1373487, '2026-04-24 14:53:10.000000', 'admin', '/uploads/14309fa4-7ca1-4156-a0d2-673573455a6d.png'),
(41, 'image/png', 'Eszköz képe', 'Canon EOS 1300D SLR Kamera.png', 2539469, '2026-04-24 14:57:17.000000', 'admin', '/uploads/64d4be50-b7ea-4f21-9e41-37764c172e8b.png'),
(42, 'image/png', 'Eszköz képe', 'Canon EOS 1300D SLR Kamera.png', 2539469, '2026-04-24 14:57:18.000000', 'admin', '/uploads/dc960ef0-091c-45a6-9d69-88255e3f9811.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `created_at`, `email`, `full_name`, `password`, `phone`, `role`, `updated_at`) VALUES
(1, '2026-04-24 08:25:11.000000', 'admin@rentech.hu', 'RentTech Admin', '$2a$10$bgpZWkua.TWGMgzdo8sRieyVLkVnpuYgEJlX5.timzhY8HkNQI1NK', NULL, 'ADMIN', '2026-04-24 08:25:11.000000'),
(2, '2026-04-24 08:25:12.000000', 'user@example.com', 'Demo User', '$2a$10$R/oBfWdFz2iuCyCcaHxFeeiIZzUtcU7m4T0scNwK11YXBdRFgn/qq', '+36987654321', 'USER', '2026-04-24 12:52:16.000000');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcvyf8pxl6m3wb2bjda2roip1f` (`category_id`);

--
-- A tábla indexei `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrqwjy70rejnpx8c2230d1ejko` (`device_id`),
  ADD KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `assets`
--
ALTER TABLE `assets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT a táblához `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `images`
--
ALTER TABLE `images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `FKcvyf8pxl6m3wb2bjda2roip1f` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Megkötések a táblához `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKrqwjy70rejnpx8c2230d1ejko` FOREIGN KEY (`device_id`) REFERENCES `assets` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
