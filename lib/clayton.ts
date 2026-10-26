/* Clayton esnek taş paneller — 21 seri, 56 desen (claytonmontenegro.me ve 2026 kataloğundan) */
import type { Txt } from "./site";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

export type ClayProduct = {
  code: string;
  note?: Txt;                 // renk adı (yalnızca katalogda belirtilenler)
  sizes: string[][];          // [genişlik, uzunluk, kalınlık] mm — kalınlık en yüksek ve en alçak nokta arası
  det: string[];              // yakın çekim doku fotoğrafları
};

export type ClayFamily = {
  id: string; name: string;
  look: Txt; desc: Txt;
  rooms: string[];            // katalogdaki uygulama fotoğrafları
  products: ClayProduct[];
};

/* doku görseli: büyük ve küçük (renk kutusu) */
export const clayTex = (code: string, small = false) => `/clayton/tex/${code.slice(3)}${small ? "-s" : ""}.webp`;

export const CLAY_FAMILIES: ClayFamily[] = [
  {
    id: "traverten", name: "TRAVERTEN", look: T("Travertin", "Traverten", "Travertine"),
    desc: T("Topli, porozni izgled prirodnog travertina — od svijetle krem do hladne sive. Klasičan kamen za dnevne sobe, hodnike i fasade, sada u lakim fleksibilnim pločama.", "Doğal travertenin sıcak, gözenekli dokusu — açık kremden soğuk griye. Salon, koridor ve cepheler için klasik taş, artık hafif ve esnek levhalarda.", "The warm, porous look of natural travertine — from light cream to cool grey. A classic stone for living rooms, hallways and façades, now in light, flexible sheets."),
    rooms: ["/clayton/oda/traverten-1.webp", "/clayton/oda/traverten-2.webp", "/clayton/oda/traverten-3.webp"],
    products: [
      { code: "CL-1801", sizes: [["1200", "600", "2.8"]], det: ["/clayton/det/1801-1.webp"] },
      { code: "CL-1802", sizes: [["1200", "600", "2.8"], ["3000", "1200", "2.8"]], det: ["/clayton/det/1802-1.webp", "/clayton/det/1802-2.webp", "/clayton/det/1802-3.webp", "/clayton/det/1802-4.webp"] },
      { code: "CL-1803", sizes: [["1200", "600", "2.8"], ["3000", "1200", "2.8"]], det: ["/clayton/det/1803-1.webp", "/clayton/det/1803-2.webp", "/clayton/det/1803-3.webp", "/clayton/det/1803-4.webp"] },
      { code: "CL-1804", sizes: [["1200", "600", "2.8"], ["3000", "1200", "2.8"]], det: ["/clayton/det/1804-1.webp", "/clayton/det/1804-2.webp", "/clayton/det/1804-3.webp", "/clayton/det/1804-4.webp", "/clayton/det/1804-5.webp"] },
      { code: "CL-1805", sizes: [["1200", "600", "2.8"], ["3000", "1200", "2.8"]], det: ["/clayton/det/1805-1.webp", "/clayton/det/1805-2.webp", "/clayton/det/1805-3.webp", "/clayton/det/1805-4.webp"] },
      { code: "CL-1806", sizes: [["1200", "600", "2.8"], ["3000", "1200", "3.2 ~ 3.8"]], det: [] },
      { code: "CL-1809", sizes: [["1200", "600", "2.8"], ["3000", "1200", "3.2 ~ 3.8"]], det: [] },
      { code: "CL-1810", sizes: [["3000", "1200", "2.8"]], det: ["/clayton/det/1810-1.webp", "/clayton/det/1810-2.webp", "/clayton/det/1810-3.webp", "/clayton/det/1810-4.webp", "/clayton/det/1810-5.webp"] },
    ],
  },
  {
    id: "tunga", name: "TUNGA", look: T("Škriljac", "Arduvaz", "Slate"),
    desc: T("Slojevita površina prirodnog škriljca sa finim žilama — od antracita do tople bež. Velike ploče do 3000 × 1200 mm za upečatljive zidove bez mnogo spojeva.", "İnce damarlı, katmanlı doğal arduvaz yüzeyi — antrasitten sıcak bejlere. 3000 × 1200 mm'ye varan büyük levhalarla az derzli etkileyici duvarlar.", "The layered surface of natural slate with fine veins — from anthracite to warm beige. Large sheets up to 3000 × 1200 mm for striking walls with few joints."),
    rooms: ["/clayton/oda/tunga-1.webp", "/clayton/oda/tunga-2.webp", "/clayton/oda/tunga-3.webp"],
    products: [
      { code: "CL-1501", sizes: [["1200", "600", "3"], ["3000", "1200", "3"]], det: ["/clayton/det/1501-1.webp"] },
      { code: "CL-1502", sizes: [["1200", "600", "3"], ["1195", "595", "3"], ["3000", "1200", "3"]], det: ["/clayton/det/1502-1.webp", "/clayton/det/1502-2.webp", "/clayton/det/1502-3.webp", "/clayton/det/1502-4.webp"] },
      { code: "CL-1503", sizes: [["1200", "600", "3"], ["3000", "1200", "3"]], det: [] },
      { code: "CL-1504", sizes: [["1190", "590", "3"], ["1200", "600", "3"]], det: ["/clayton/det/1504-1.webp"] },
      { code: "CL-1505", sizes: [["1200", "600", "3"], ["3000", "1200", "3.5"]], det: ["/clayton/det/1505-1.webp", "/clayton/det/1505-2.webp", "/clayton/det/1505-3.webp", "/clayton/det/1505-4.webp", "/clayton/det/1505-5.webp"] },
      { code: "CL-1506", sizes: [["1200", "600", "3"]], det: ["/clayton/det/1506-1.webp"] },
      { code: "CL-1507", sizes: [["3000", "1200", "3.5"]], det: ["/clayton/det/1507-1.webp", "/clayton/det/1507-2.webp", "/clayton/det/1507-3.webp", "/clayton/det/1507-4.webp"] },
      { code: "CL-1508", sizes: [["3000", "1200", "3.5"]], det: ["/clayton/det/1508-1.webp", "/clayton/det/1508-2.webp", "/clayton/det/1508-3.webp", "/clayton/det/1508-4.webp", "/clayton/det/1508-5.webp"] },
    ],
  },
  {
    id: "carra", name: "CARRA", look: T("Mermer i mineralni malter", "Mermer ve mineral sıva", "Marble & mineral plaster"),
    desc: T("Od bijelog mermera sa sivim žilama do mat mineralnih površina u krem, sivoj, terakota i antracit boji. Elegantno rješenje za kuhinje, kupatila i reprezentativne zidove.", "Gri damarlı beyaz mermerden krem, gri, kiremit ve antrasit mat mineral yüzeylere. Mutfak, banyo ve prestijli duvarlar için zarif bir çözüm.", "From white marble with grey veining to matte mineral surfaces in cream, grey, terracotta and anthracite. An elegant choice for kitchens, bathrooms and statement walls."),
    rooms: ["/clayton/oda/carra-1.webp", "/clayton/oda/carra-2.webp"],
    products: [
      { code: "CL-7001", sizes: [["1190", "590", "4"], ["3000", "1200", "4"]], det: [] },
      { code: "CL-7002", note: T("Krem", "Krem", "Cream"), sizes: [["1180", "580", "4"], ["1190", "590", "4"]], det: ["/clayton/det/7002-1.webp"] },
      { code: "CL-7003", note: T("Siva", "Gri", "Grey"), sizes: [["1190", "590", "4"]], det: ["/clayton/det/7003-1.webp"] },
      { code: "CL-7004", sizes: [["1180", "580", "4"]], det: ["/clayton/det/7004-1.webp"] },
      { code: "CL-7005", sizes: [["1180", "580", "4"]], det: ["/clayton/det/7005-1.webp"] },
    ],
  },
  {
    id: "cement", name: "CEMENT", look: T("Beton", "Brüt beton", "Concrete"),
    desc: T("Izgled glatkog arhitektonskog betona za moderne, industrijske i minimalističke prostore — bez teške oplate i dugog sušenja.", "Modern, endüstriyel ve minimalist mekânlar için pürüzsüz brüt beton görünümü — ağır kalıp ve uzun kuruma süresi olmadan.", "The look of smooth architectural concrete for modern, industrial and minimalist spaces — without heavy formwork or long curing."),
    rooms: ["/clayton/oda/cement-1.webp"],
    products: [
      { code: "CL-5001", sizes: [["1200", "580", "3.2"]], det: ["/clayton/det/5001-1.webp"] },
    ],
  },
  {
    id: "narva", name: "NARVA", look: T("Reljefni kamen", "Rölyefli taş", "Relief stone"),
    desc: T("Kamen sa izraženim reljefom od 6,5 mm koji hvata svjetlo i stvara duboke sjenke. Idealan za kamine, recepcije i akcentne zidove.", "Işığı yakalayıp derin gölgeler oluşturan 6,5 mm belirgin rölyefli taş. Şömine, resepsiyon ve vurgu duvarları için ideal.", "Stone with a pronounced 6.5 mm relief that catches the light and casts deep shadows. Ideal for fireplaces, receptions and feature walls."),
    rooms: ["/clayton/oda/narva-1.webp"],
    products: [
      { code: "CL-8001", sizes: [["1200", "600", "6.5"], ["3000", "1200", "6.5"], ["1190", "595", "6.5"]], det: [] },
      { code: "CL-8002", sizes: [["1200", "600", "6.5"], ["3000", "1200", "6.5"]], det: [] },
      { code: "CL-8004", sizes: [["1200", "600", "6.5"], ["3000", "1200", "6.5"]], det: [] },
    ],
  },
  {
    id: "luna", name: "LUNA", look: T("Prirodna stijena", "Doğal kaya", "Natural rock"),
    desc: T("Dramatična slojevita stijena u velikom formatu 2960 × 1060 mm i debljini 9 mm — snažan prirodni karakter za restorane, lobije i fasade.", "2960 × 1060 mm büyük formatta ve 9 mm kalınlıkta dramatik katmanlı kaya — restoran, lobi ve cepheler için güçlü doğal karakter.", "Dramatic layered rock in a large 2960 × 1060 mm format, 9 mm thick — strong natural character for restaurants, lobbies and façades."),
    rooms: ["/clayton/oda/luna-1.webp"],
    products: [
      { code: "CL-1601", sizes: [["2960", "1060", "9"]], det: [] },
    ],
  },
  {
    id: "petra", name: "PETRA", look: T("Cijepani kamen", "Yarma taş", "Split stone"),
    desc: T("Površina cijepanog kamena sa ritmičnim linijama i dubinom od 6 mm. Dostupna i u velikim pločama do 3000 × 1200 mm.", "Ritmik çizgili ve 6 mm derinlikli yarma taş yüzeyi. 3000 × 1200 mm'ye kadar büyük levhalarda da mevcut.", "A split-stone surface with rhythmic lines and 6 mm of depth. Also available in large sheets up to 3000 × 1200 mm."),
    rooms: ["/clayton/oda/petra-1.webp"],
    products: [
      { code: "CL-2001", sizes: [["1200", "600", "6"], ["2400", "1200", "6"], ["3000", "1200", "6"]], det: ["/clayton/det/2001-1.webp"] },
      { code: "CL-2002", sizes: [["1200", "600", "6"], ["2390", "1200", "6"]], det: [] },
    ],
  },
  {
    id: "arita", name: "ARITA", look: T("Kanelirani kamen", "Kanallı taş", "Fluted stone"),
    desc: T("Kamen sa finim vertikalnim kanalima koji izdužuju prostor. Odličan za fasade, ulazne zone i moderne enterijere.", "Mekânı yukarı doğru uzatan ince dikey kanallı taş. Cepheler, giriş alanları ve modern iç mekânlar için mükemmel.", "Stone with fine vertical fluting that draws the eye upward. Excellent for façades, entrances and modern interiors."),
    rooms: ["/clayton/oda/arita-1.webp"],
    products: [
      { code: "CL-1001", sizes: [["1190", "590", "6.5"], ["2640", "1160", "6.5"]], det: ["/clayton/det/1001-1.webp"] },
      { code: "CL-1002", sizes: [["1200", "590", "6.5"], ["2640", "1160", "6.5"]], det: ["/clayton/det/1002-1.webp"] },
      { code: "CL-1004", sizes: [["1190", "590", "6.5"]], det: [] },
    ],
  },
  {
    id: "serva", name: "SERVA", look: T("Klesani kamen", "Yontma taş", "Chiselled stone"),
    desc: T("Ručno klesani izgled kamena sa dubinom od 7 mm, u tamnoj i svijetloj varijanti. Daje toplinu ulazima, hodnicima i fasadama.", "7 mm derinlikte, el yontması görünümlü taş; koyu ve açık iki tonda. Girişlere, koridorlara ve cephelere sıcaklık katar.", "A hand-chiselled stone look with 7 mm of depth, in dark and light versions. Brings warmth to entrances, corridors and façades."),
    rooms: ["/clayton/oda/serva-1.webp"],
    products: [
      { code: "CL-1101", sizes: [["1200", "600", "7"]], det: ["/clayton/det/1101-1.webp"] },
      { code: "CL-1102", sizes: [["1200", "600", "7"]], det: ["/clayton/det/1102-1.webp"] },
    ],
  },
  {
    id: "galata", name: "GALATA", look: T("Kameni zid", "Taş duvar", "Stone wall"),
    desc: T("Klasičan zid od složenog kamena — bez zidara, maltera i težine pravog kamena. Posebno lijep uz indirektnu rasvjetu.", "Klasik örme taş duvar — duvarcı, harç ve gerçek taşın ağırlığı olmadan. Dolaylı aydınlatmayla özellikle etkileyici.", "A classic stacked-stone wall — without masons, mortar or the weight of real stone. Especially beautiful with indirect lighting."),
    rooms: ["/clayton/oda/galata-1.webp"],
    products: [
      { code: "CL-4001", sizes: [["1200", "600", "4"]], det: ["/clayton/det/4001-1.webp"] },
    ],
  },
  {
    id: "renga", name: "RENGA", look: T("Prugasti kamen", "Çizgili taş", "Ribbed stone"),
    desc: T("Horizontalne kamene trake sa reljefom od 9 mm u formatu 3000 × 600 mm — za mirne, arhitektonske površine.", "3000 × 600 mm formatta, 9 mm rölyefli yatay taş şeritler — sakin, mimari yüzeyler için.", "Horizontal stone bands with a 9 mm relief in a 3000 × 600 mm format — for calm, architectural surfaces."),
    rooms: ["/clayton/oda/renga-1.webp"],
    products: [
      { code: "CL-1301", sizes: [["3000", "600", "9"]], det: ["/clayton/det/1301-1.webp"] },
    ],
  },
  {
    id: "perge", name: "PERGE", look: T("Antički kamen", "Antik taş", "Ancient stone"),
    desc: T("Topli oker i rđasti tonovi starog kamena, inspirisani antičkim gradovima. Daje karakter fasadama i rustičnim enterijerima.", "Antik kentlerden ilham alan eski taşın sıcak hardal ve pas tonları. Cephelere ve rustik iç mekânlara karakter katar.", "The warm ochre and rust tones of weathered stone, inspired by ancient cities. Gives character to façades and rustic interiors."),
    rooms: ["/clayton/oda/perge-1.webp"],
    products: [
      { code: "CL-3001", sizes: [["1160", "580", "5"]], det: [] },
    ],
  },
  {
    id: "volan", name: "VOLAN", look: T("3D talasi", "3D dalga", "3D waves"),
    desc: T("Meki trodimenzionalni talasi u pločama 2830 × 1200 mm. Svjetlo klizi preko površine i stvara živu igru sjenki.", "2830 × 1200 mm levhalarda yumuşak üç boyutlu dalgalar. Işık yüzeyde kayarak canlı bir gölge oyunu oluşturur.", "Soft three-dimensional waves in 2830 × 1200 mm sheets. Light glides across the surface for a lively play of shadows."),
    rooms: ["/clayton/oda/volan-1.webp"],
    products: [
      { code: "CL-6001", sizes: [["2830", "1200", "7"]], det: [] },
      { code: "CL-6002", sizes: [["2830", "1200", "7"]], det: [] },
    ],
  },
  {
    id: "aren", name: "AREN", look: T("Tamni mermer", "Koyu mermer", "Dark marble"),
    desc: T("Duboki tamni mermer sa izraženim bijelim žilama — luksuzan akcent za hodnike, kupatila i poslovne prostore.", "Belirgin beyaz damarlı derin koyu mermer — koridor, banyo ve iş yerleri için lüks bir vurgu.", "Deep dark marble with bold white veining — a luxurious accent for hallways, bathrooms and offices."),
    rooms: ["/clayton/oda/aren-1.webp"],
    products: [
      { code: "CL-1406", sizes: [["1200", "600", "3.5"]], det: ["/clayton/det/1406-1.webp"] },
    ],
  },
  {
    id: "avron", name: "AVRON", look: T("Složeni kamen", "Kayrak taş", "Ledgestone"),
    desc: T("Izgled složenih kamenih pločica u bež, crnoj i rđasto-šarenoj boji. Topao, prirodan zid za dnevne sobe, terase i ugostiteljske objekte.", "Bej, siyah ve pas rengi alacalı tonlarda istiflenmiş kayrak taş görünümü. Salon, teras ve restoranlar için sıcak, doğal bir duvar.", "The look of stacked ledgestone in beige, black and a rusty multicolour. A warm, natural wall for living rooms, terraces and hospitality spaces."),
    rooms: ["/clayton/oda/avron-1.webp"],
    products: [
      { code: "CL-1701", sizes: [["1200", "560", "4.5"]], det: ["/clayton/det/1701-1.webp"] },
      { code: "CL-1703", sizes: [["1200", "560", "4.5"]], det: ["/clayton/det/1703-1.webp"] },
      { code: "CL-1704", sizes: [["1200", "560", "4.5"]], det: [] },
    ],
  },
  {
    id: "granit", name: "GRANIT", look: T("Granit", "Granit", "Granite"),
    desc: T("Zrnasta struktura granita za otporne i elegantne površine — fasade, stubove, ulaze i javne prostore.", "Dayanıklı ve şık yüzeyler için granitin taneli dokusu — cepheler, kolonlar, girişler ve kamusal alanlar.", "The grainy structure of granite for durable, elegant surfaces — façades, columns, entrances and public spaces."),
    rooms: ["/clayton/oda/granit-1.webp"],
    products: [
      { code: "CL-9001", sizes: [["1200", "600", "5"]], det: ["/clayton/det/9001-1.webp"] },
      { code: "CL-9002", sizes: [["1200", "600", "3.5"]], det: [] },
      { code: "CL-9004", sizes: [["1200", "600", "3.5"]], det: ["/clayton/det/9004-1.webp", "/clayton/det/9004-2.webp", "/clayton/det/9004-3.webp", "/clayton/det/9004-4.webp"] },
    ],
  },
  {
    id: "dune", name: "DUNE", look: T("Pješčar", "Kumtaşı", "Sandstone"),
    desc: T("Slojeviti pješčar toplih pustinjskih tonova u velikom formatu 2360 × 1200 mm. Savršen za zaobljene zidove i fasade.", "2360 × 1200 mm büyük formatta, sıcak çöl tonlarında katmanlı kumtaşı. Kavisli duvarlar ve cepheler için mükemmel.", "Layered sandstone in warm desert tones, in a large 2360 × 1200 mm format. Perfect for curved walls and façades."),
    rooms: ["/clayton/oda/dune-1.webp"],
    products: [
      { code: "CL-1202", sizes: [["2360", "1200", "2.8"]], det: ["/clayton/det/1202-1.webp"] },
    ],
  },
  {
    id: "crocodile", name: "CROCODILE", look: T("Koža", "Deri", "Leather"),
    desc: T("Tekstura krokodilske kože u antracit i bordo tonu — smjeli akcent za butike, barove i luksuzne enterijere.", "Antrasit ve bordo tonlarında timsah derisi dokusu — butik, bar ve lüks iç mekânlar için cesur bir vurgu.", "A crocodile-leather texture in anthracite and burgundy — a bold accent for boutiques, bars and luxury interiors."),
    rooms: ["/clayton/oda/crocodile-1.webp"],
    products: [
      { code: "CL-2201", sizes: [["1200", "600", "3.5"]], det: ["/clayton/det/2201-1.webp"] },
      { code: "CL-2202", sizes: [["1200", "600", "3.5"]], det: ["/clayton/det/2202-1.webp"] },
    ],
  },
  {
    id: "viva", name: "VIVA", look: T("Tekstil", "Tekstil", "Textile"),
    desc: T("Fina tekstura tkanine u svijetlom tonu — mekan, smiren izgled za spavaće sobe, hotele i kancelarije.", "Açık tonda ince kumaş dokusu — yatak odaları, oteller ve ofisler için yumuşak, sakin bir görünüm.", "A fine fabric texture in a light tone — a soft, calm look for bedrooms, hotels and offices."),
    rooms: ["/clayton/oda/viva-1.webp"],
    products: [
      { code: "CL-2401", sizes: [["1180", "590", "3.5"], ["3000", "1200", "3.5"]], det: ["/clayton/det/2401-1.webp"] },
    ],
  },
  {
    id: "wood", name: "WOOD", look: T("Drvo", "Ahşap", "Wood"),
    desc: T("Topla tekstura drveta u tamnoj, srednjoj i svijetloj nijansi — izgled drveta, a otpornost minerala na vlagu i vatru.", "Koyu, orta ve açık tonlarda sıcak ahşap dokusu — ahşap görünümü, mineralin neme ve ateşe dayanımıyla.", "A warm wood texture in dark, medium and light shades — the look of wood with the moisture and fire resistance of mineral."),
    rooms: ["/clayton/oda/wood-1.webp"],
    products: [
      { code: "CL-1908", sizes: [["1180", "590", "3.5"]], det: ["/clayton/det/1908-1.webp", "/clayton/det/1908-2.webp", "/clayton/det/1908-3.webp", "/clayton/det/1908-4.webp"] },
      { code: "CL-1909", sizes: [["1170", "570", "3.5"]], det: ["/clayton/det/1909-1.webp"] },
      { code: "CL-1910", sizes: [["1180", "590", "3.5"]], det: ["/clayton/det/1910-1.webp", "/clayton/det/1910-2.webp", "/clayton/det/1910-3.webp", "/clayton/det/1910-4.webp"] },
    ],
  },
  {
    id: "cubrik", name: "CUBRIK", look: T("Opeka", "Tuğla", "Brick"),
    desc: T("Fleksibilne pločice opeke 212 × 58 mm u crvenoj i sivoj boji — za fasade, kamine i industrijske enterijere.", "Kırmızı ve gri tonlarda 212 × 58 mm esnek tuğla plakalar — cepheler, şömineler ve endüstriyel iç mekânlar için.", "Flexible 212 × 58 mm brick slips in red and grey — for façades, fireplaces and industrial interiors."),
    rooms: ["/clayton/oda/cubrik-1.webp"],
    products: [
      { code: "CL-2101", sizes: [["212", "58", "3.5"]], det: [] },
      { code: "CL-2102", sizes: [["212", "58", "3.5"]], det: [] },
      { code: "CL-2103", sizes: [["212", "58", "3.5"]], det: [] },
      { code: "CL-2104", sizes: [["212", "58", "3.5"]], det: [] },
    ],
  },
];

export const CLAY_COUNT = CLAY_FAMILIES.reduce((a, f) => a + f.products.length, 0);
