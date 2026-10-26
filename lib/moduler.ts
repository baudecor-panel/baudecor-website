/* Modüler (3D) duvar paneli kataloğu — 10 model, renkler, galeriler, belgeler ve karo dizilimi (m² hesabı için) */
import type { Txt } from "./site";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

/* ===== Renkler (ABS + akrilik boya) ===== */
export type ColorId = "white" | "mink" | "black" | "gold" | "silver" | "smoke";
export const MOD_COLORS: Record<ColorId, { name: Txt; swatch: string }> = {
  white: { name: T("Bijela", "Beyaz", "White"), swatch: "#efede8" },
  mink: { name: T("Vizon", "Vizon", "Mink"), swatch: "#5b4b3f" },
  black: { name: T("Crna", "Siyah", "Black"), swatch: "#222121" },
  gold: { name: T("Zlatna", "Altın", "Gold"), swatch: "#c9a46a" },
  silver: { name: T("Srebrna", "Gümüş", "Silver"), swatch: "#c9cbcd" },
  smoke: { name: T("Dimljena", "Füme", "Smoke"), swatch: "#3b3936" },
};

/* ===== Karo dizilimi (m² başına adet hesabı) =====
   square: kare ızgara · hex: altıgen (p: köşe yarı genişliği, q: üst kenar yarı uzunluğu, h: yarı yükseklik)
   tri: eşkenar üçgen (s: kenar, h: yükseklik) · weave: dik parçalar, tek sütunlar yarım boy kaymış (sivri uçlar komşunun beline oturur) */
export type Lattice =
  | { kind: "square"; s: number; rot: "diamond" | "random" }
  | { kind: "hex"; p: number; q: number; h: number; rot: 60 | 180 }
  | { kind: "tri"; s: number; h: number }
  | { kind: "weave"; sx: number; sy: number };

export type ModModel = {
  id: string; name: string;
  shape: Txt;
  lattice?: Lattice;            // bilinmiyorsa m² hesabı gösterilmez
  size?: string; depth?: string;  // karo ölçüsü ve kabartma derinliği (üretici 3D dosyalarından ölçüldü)
  cover: string; info: string;
  desc: Txt;
  colors: { id: ColorId; img: string }[];
  layouts?: string[];           // örnek dizilimler (SOHO, VAVA)
  gallery: string[];
  docs: { teknik?: string; montaj?: string; montajVideo?: boolean; model3d?: string };
  isNew?: boolean;
};

const C = (...ids: [ColorId, string][]) => ids.map(([id, file]) => ({ id, img: `/${encodeURI(file)}` }));
const G = (name: string, files: string[]) => files.map((f) => `/${name}-${f}`);

export const MOD_MODELS: ModModel[] = [
  {
    id: "penta", name: "PENTA", shape: T("Kvadrat · piramida", "Kare · piramit", "Square · pyramid"),
    lattice: { kind: "square", s: 0.18, rot: "diamond" },
    size: "18 × 18 cm", depth: "7,2 cm", cover: "/KAPAK%20PENTA.jpg", info: "/INFO%20PENTA.jpg",
    desc: {
      tr: "Ürün portföyümüzde yer alan dekoratif duvar panellerimizin göz alıcı modellerinden olan Penta, tasarımı itibariyle akılda kalan ve hayret uyandıran modern çizgisiyle uygulandığı mekanı değiştiriyor, kıymetlendiriyor ve özel kılıyor. Asimetrik keskin hatları, içbükey ve dışbükey formları ile realistik üç boyutlu görünüm oluşturan Penta dekoratif duvar paneli, konut ve ticari iç mekan duvar tasarımlarında tercih edilmektedir.",
      me: "Penta, jedan od najupečatljivijih modela u našem portfoliju dekorativnih zidnih panela. Modernim dizajnom koji se pamti i oduševljava, transformiše svaki prostor, daje mu vrijednost i posebnost. Asimetrične oštre linije i konkavno-konveksni oblici stvaraju realistični trodimenzionalni izgled — idealan za stambene i komercijalne projekte.",
      en: "Penta is one of the most striking models in our decorative wall panel portfolio. With a modern design that is memorable and awe-inspiring, it transforms every space, adds value and makes it unique. Asymmetric sharp edges and concave-convex forms create a realistic three-dimensional appearance — ideal for residential and commercial interior projects.",
    },
    colors: C(["white", "PENTA WHİTE.jpg"], ["mink", "PENTA MINK.jpg"], ["black", "PENTA BLACK.jpg"], ["gold", "PENTA GOLD.jpg"], ["silver", "PENTA SILVER.jpg"], ["smoke", "PENTA SMOKE.jpg"]),
    gallery: G("PENTA", ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg"]),
    docs: { teknik: "/PENTA-teknik.pdf.pdf", montaj: "/PENTA-montaj.pdf.pdf", model3d: "/PENTA-3d-model.zip.zip" },
  },
  {
    id: "zeta", name: "ZETA", shape: T("Šestougao · fasete", "Altıgen · fasetli", "Hexagon · faceted"),
    lattice: { kind: "hex", p: 0.08, q: 0.04, h: 0.0693, rot: 60 },
    size: "16 × 13,9 cm", depth: "4,6 cm", cover: "/KAPAK%20ZETA.jpg", info: "/INFO%20ZETA.jpg",
    desc: {
      tr: "Üç boyutlu altıgen karolara sahip olan ZETA, hem parlak hem de mat yüzeylerde, farklı renklerde mevcut olan petek yapısının zarif bir versiyonudur. Açılı yüzleri, ışık oyunlarıyla birlikte bir ton senfonisine dönüşür ve zarif görünümler oluşturacak şekilde düzenlenebilir. Çekici poligonal geometrisi, modern ve simetrik keskin çizgileriyle gerçekçi üç boyutlu görünüm yaratan ZETA ile harikalar yaratabilirsiniz. Sade tonların görselliği ve doğal ışık, altıgen duvar panellerine nazikçe yansıtıldığında görsel bir şölen ortaya çıkar.",
      me: "ZETA posjeduje trodimenzionalne šesterokutne pločice i elegantna je verzija saćaste strukture, dostupna na sjajnim i mat površinama u različitim bojama. Uglaste površine u kombinaciji s igrom svjetlosti pretvaraju se u simfoniju tonova i mogu se rasporediti kako bi stvorile elegantne vizuale. Sa privlačnom poligonalnom geometrijom i modernim simetričnim linijama, ZETA stvara realističan trodimenzionalni izgled. Kada se nježni tonovi i prirodno svjetlo reflektuju na šesterokutne panele, nastaje pravi vizualni spektakl.",
      en: "ZETA features three-dimensional hexagonal tiles and is an elegant version of the honeycomb structure, available in both glossy and matte surfaces in various colors. Its angled faces, combined with interplays of light, transform into a symphony of tones that can be arranged to create elegant visuals. With its attractive polygonal geometry and modern symmetrical lines, ZETA creates a realistic three-dimensional appearance. When soft tones and natural light are gently reflected on the hexagonal panels, a true visual feast emerges.",
    },
    colors: C(["white", "WHITE ZETA.jpg"], ["mink", "VIZON ZETA.jpg"], ["black", "BALCK ZETA.jpg"], ["gold", "GOLD ZETA.jpg"], ["silver", "SILVER ZETA.jpg"], ["smoke", "FÜME ZETA.jpg"]),
    gallery: G("ZETA", ["1.png", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]),
    docs: { teknik: "/ZETA-teknik.pdf", montaj: "/ZETA-montaj.pdf", model3d: "/ZETA-3d-model.zip.zip" },
  },
  {
    id: "norm", name: "NORM", shape: T("Šestougao · ravan", "Altıgen · düz", "Hexagon · flat"),
    lattice: { kind: "hex", p: 0.081, q: 0.041, h: 0.07, rot: 60 },
    size: "16,2 × 14 cm", depth: "4,5 cm", cover: "/KAPAK%20NORM.jpg", info: "/INFO%20NORM.jpg",
    desc: {
      tr: "Altıgen formların farklı açılar ve renkler ile olan kombinasyonunun oluşturduğu sıradışı bir duvar tasarım ürünü olan NORM; cafe, restoran, otel, plaza ve giriş-karşılama alanları gibi birçok mekânda 3 boyutlu simetrik ve asimetrik gölge oyunları ile görsel zarafet sunmaktadır. Montaj kolaylığı ve kısmen ya da tamamen uygulanabilirliği ile geniş kullanım yelpazesine sahiptir. Tak-çıkar özelliği ile dilediğiniz zaman duvar tasarımınızı farklılaştırabilir ve yeni bir dekor elde edebilirsiniz. Farklı yüksekliklere sahip altıgen geometrik formlardan oluşan NORM, uygulandığı yüzeyde gerçekçi bir üç boyut meydana getirir. 3D duvar kağıtlarının aksine gerçek bir derinlik oluşturarak mekâna canlı bir ruh katar. Pratikliği, hafifliği ve kolay uygulanabilirliği ile hem mukavemet hem de kalite açısından mevcut mekânları farklılaştırmada tercih sebebidir.",
      me: "NORM je izvanredan dekorativni zidni proizvod nastao kombinacijom šesterokutnih oblika pod različitim uglovima i bojama. U kafićima, restoranima, hotelima, poslovnim zgradama i recepcijskim prostorima pruža vizualnu eleganciju kroz trodimenzionalne simetrične i asimetrične igre sjena. Zahvaljujući lakoći montaže i mogućnosti djelimične ili potpune primjene, posjeduje široku primjenu. Funkcija 'prikvači-skini' omogućava promjenu dekora u svakom trenutku. NORM se sastoji od heksagonalnih geometrijskih formi različitih visina, što na površini stvara realističnu trodimenzionalnost. Za razliku od 3D tapeta, prava dubina daje prostoru poseban duh i energiju. Praktičan, lagan i jednostavan za ugradnju — prvi izbor za transformaciju enterijera.",
      en: "NORM is an extraordinary wall design product created through the combination of hexagonal forms at different angles and colors. In cafés, restaurants, hotels, plazas and reception areas, it offers visual elegance through three-dimensional symmetric and asymmetric shadow plays. With its ease of installation and partial or full applicability, it has a wide range of uses. Its click-in/click-out feature lets you refresh your wall décor whenever you wish. Consisting of hexagonal geometric forms with varying heights, NORM creates a realistic three-dimensional effect on the applied surface. Unlike 3D wallpapers, it generates real depth and brings a vibrant spirit to the space. Practical, lightweight and easy to install — the preferred choice for transforming interiors.",
    },
    colors: C(["white", "WHITE NORM.jpg"], ["mink", "VIZON NORM.jpg"], ["black", "BLACK NORM.jpg"], ["gold", "GOLD NORM.jpg"], ["silver", "SILVER NORM.jpg"], ["smoke", "FÜME NORM.jpg"]),
    gallery: G("NORM", ["1.png", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]),
    docs: { teknik: "/NORM-teknik.pdf", montaj: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya26.mp4", montajVideo: true, model3d: "/NORM-3d-model.zip.zip" },
  },
  {
    id: "mabel", name: "MABEL", shape: T("Izduženi šestougao", "Uzun altıgen", "Elongated hexagon"),
    lattice: { kind: "hex", p: 0.278, q: 0.102, h: 0.102, rot: 180 },
    size: "55,6 × 20,4 cm", depth: "8,7 cm", cover: "/KAPAK%20MABEL.jpg", info: "/INFO%20MABEL.jpg",
    desc: {
      tr: "Karşıt ve benzer yönlerde konumlandırılabilen bu küçük çokgen duvar dekoru ürünü, çok çeşitli iç mimari uygulamalar için geniş bir özgürlük sunar. 3 boyutlu simetrik ve asimetrik gölge oyunları, renk ve desen çeşitliliğiyle birleşerek görsel zarafet yaratır. Işığın doğal yansımasıyla renk tonlarının yarattığı yanılsama, derinlik hissi vererek özgün üç boyutlu duvar tasarımları oluşturmanızı sağlar. Farklı kombinasyonlar uygulayarak birbirinden etkileyici duvar dekorları meydana getirebilirsiniz. Montaj kolaylığı, hafifliği ve tasarım özgürlüğüyle geleneksel ya da modern mimari için pratik çözümler sunar. Ürünler birleşim yerleri belli olmadan tek ya da farklı yönlerde döşenerek bütünlüklü bir görsel sağlar. Montaj aparatlarındaki pimler, ürün içindeki yuvalara geçerek son derece pratik bir uygulama imkânı tanır.",
      me: "Ovaj mali poligonalni zidni dekor koji se može postaviti u suprotnim ili sličnim smjerovima pruža veliku slobodu za razne primjene u enterijeru. Trodimenzionalne simetrične i asimetrične igre sjena, u kombinaciji s raznolikošću boja i uzoraka, stvaraju vizualnu eleganciju. Prirodno odbijanje svjetlosti i iluzija tonova daju osjećaj dubine i omogućavaju kreiranje originalnih 3D zidnih dizajna. Primjenom različitih kombinacija možete kreirati raznovrsne zidne dekoracije. Jednostavna montaža, lakoća i sloboda dizajna nude praktična rješenja za tradicionalnu ili modernu arhitekturu. Paneli se postavljaju bez vidljivih spojeva u jednom ili više smjerova za ujednačen vizualni dojam. Montažni zatici jednostavno se ubacuju u utore na pločici, što čini ugradnju izuzetno praktičnom.",
      en: "This small polygonal wall décor product, positionable in opposing or similar directions, offers great freedom for a wide range of interior design applications. Three-dimensional symmetric and asymmetric shadow plays, combined with a variety of colors and patterns, create visual elegance. The natural reflection of light and the illusion of color tones give a sense of depth, enabling you to create unique three-dimensional wall designs. By applying different combinations, you can create a variety of striking wall décors. With easy installation, lightness and design freedom, it offers practical solutions for both traditional and modern architecture. Panels can be laid in one or multiple directions without visible joints for a unified visual. The mounting pins on the assembly brackets slot into the grooves in the panel, making installation extremely easy.",
    },
    colors: C(["white", "WHITE MABEL.jpg"], ["mink", "VIZON MABEL.jpg"], ["black", "BLACK MABEL.jpg"], ["gold", "GOLD MABEL.jpg"], ["silver", "SILVER MABEL.jpg"], ["smoke", "FÜME MABEL.jpg"]),
    gallery: G("MABEL", ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.png", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]),
    docs: { teknik: "/MABEL-teknik.pdf", montaj: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya30.mp4", montajVideo: true, model3d: "/MABEL-3d-model.zip.zip" },
  },
  {
    id: "spline", name: "SPLINE", shape: T("Pleteni talas", "Örgü dalga", "Woven wave"),
    lattice: { kind: "weave", sx: 0.216, sy: 0.322 },
    size: "26 × 32 cm", depth: "6,2 cm", cover: "/KAPAK%20SPLIINE.jpg", info: "/INFO%20SPLINE.jpg",
    desc: {
      tr: "Eğrisel çizgilerin hareketinden ilham alınarak 3 boyutlu örgü görseli kazandırılan SPLINE, zarif, sade ve şık bir duvar kaplama tasarım ürünüdür. Modüler panellerin bir araya gelmesiyle oluşan bu görsel, arkadan uygulanan LED aydınlatmayla duvarlara gerçek bir derinlik duygusu katar. Lobi, resepsiyon ve giriş alanlarında göz alıcı bir karşılama sunan SPLINE ile mekânlarınızda fark yaratın. Farklı renk alternatifleri ve ışık-gölge oyunlarıyla mekânı lüks, asil ve ihtişamlı bir görünüme kavuşturur. Duvar ve tavanda rahatlıkla uygulanabilen bu üründe, arkadan yapılan LED uygulaması ile paneller arasından süzülen ışıklar dekoratif bir aydınlatma etkisi de yaratır.",
      me: "SPLINE je elegantan, jednostavan i šik zidni dekorativni proizvod inspirisan kretanjem zakrivljenih linija, koji dobija trodimenzionalni pleteni vizualni efekt. Ovaj vizual koji nastaje spajanjem modularnih panela, uz LED osvjetljenje primijenjeno sa zadnje strane, daje zidovima pravi osjećaj dubine. Istaknite se uz SPLINE zidne obloge koje pružaju upečatljiv doček u lobijima, recepcijama i ulaznim prostorima. Različite boje i igre svjetla i sjene daju prostoru luksuzan, plemenit i veličanstven izgled. LED osvjetljenje postavljeno iza panela propušta svjetlost između ploča, stvarajući istovremeno dekorativni efekt osvjetljenja.",
      en: "SPLINE is an elegant, refined and stylish wall cladding design product inspired by the movement of curved lines, given a three-dimensional woven visual appearance. This visual, formed by modular panels coming together, combined with LED lighting applied from behind, gives walls a true sense of depth. Make a statement with SPLINE wall cladding panels that provide a striking welcome in lobbies, reception areas and entrances. With different color alternatives and light-shadow plays, it transforms spaces into a luxurious, noble and magnificent look. The LED application behind the panels allows light to filter through the gaps, simultaneously creating a decorative lighting effect.",
    },
    colors: C(["white", "WHITE SPLINE.jpg"], ["mink", "VIZON SPLINE.jpg"], ["black", "BLACK SPLINE.jpg"], ["gold", "GOLD SPLINE.jpg"], ["silver", "SILVER SPLINE.jpg"]),
    gallery: G("SPLINE", ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]),
    docs: { teknik: "/SPLINE-teknik.pdf", montaj: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya35.mp4", montajVideo: true, model3d: "/SPLINE-3d-model.zip.zip" },
  },
  {
    id: "nava", name: "NAVA", shape: T("Trougao · 3 forme", "Üçgen · 3 form", "Triangle · 3 forms"),
    lattice: { kind: "tri", s: 0.198, h: 0.172 },
    size: "19,8 × 17,2 cm", depth: "3,8 cm", cover: "/KAPAK%20NAVA.jpg", info: "/INFO%20NAVA.jpg",
    desc: {
      tr: "Bu yeni tasarımla 2. neslin ilk modelini ortaya çıkararak birbirinden bağımsız üç farklı çizginin sonsuz kombinasyon seçeneğini sunuyoruz. Düz, Piramit ve Poligon şeklindeki üç farklı karoyu bir arada ya da bağımsız kullanabileceğiniz bu yeni nesil 3 boyutlu duvar kaplamasıyla mekânınız zarafet, asalet ve ihtişam duygusuna bürünür. Kolay montaj sistemi, farklı renk seçenekleri ve paketleme detaylarıyla birinci jenerasyonun modelleriyle uyum gösterir. Modern çizgileri ve simetrik formlarıyla gerçekçi üç boyutlu görünüm sağlayan NAVA, konut ve ticari projelerinizin duvar dekorunda güvenle tercih edebileceğiniz bir modeldir.",
      me: "Ovim novim dizajnom predstavljamo prvi model druge generacije, nudeći beskrajne kombinacije tri međusobno nezavisne linije. Uz ovu novu generaciju 3D zidnih obloga — s tri različite pločice u obliku ravne, piramidalne i poligonalne forme koje se mogu koristiti zajedno ili samostalno — vaš prostor dobija osjećaj elegancije, plemenitosti i veličanstvenosti. Sistem lake montaže, različite opcije boja i detalji pakiranja usklađeni su s modelima prve generacije. NAVA model, sa svojim modernim linijama i simetričnim formama, pruža realističan trodimenzionalni izgled i idealan je izbor za zidnu dekoraciju stambenih i komercijalnih projekata.",
      en: "With this new design, we present the first model of the second generation, offering endless combination options from three independent lines. With three different tiles — flat, pyramid and polygon — that can be used together or independently, this new generation 3D wall cladding fills your space with a sense of elegance, nobility and grandeur. The easy installation system, different color options and packaging details are consistent with first-generation models. NAVA, with its modern lines and symmetrical forms providing a realistic three-dimensional appearance, is a model you can confidently choose for the wall décor of your residential and commercial projects.",
    },
    colors: C(["white", "WHITE NAVA.jpg"], ["mink", "VIZON NAVA.jpg"], ["black", "BLACK NAVA.jpg"], ["gold", "GOLD NAVA.jpg"], ["silver", "SILVER NAVA.jpg"]),
    gallery: G("NAVA", ["1.png", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.png", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]),
    docs: { teknik: "/NAVA-teknik.pdf", montaj: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya44.mp4", montajVideo: true, model3d: "/NAVA-3d-model.zip.zip" },
  },
  {
    id: "soho", name: "SOHO", shape: T("Kvadrat · meke linije", "Kare · yumuşak hat", "Square · soft lines"),
    lattice: { kind: "square", s: 0.18, rot: "diamond" },
    size: "18 × 18 cm", depth: "2,8 cm", cover: "/KAPAK%20SOHO.jpg", info: "/INFO%20SOHO.jpg",
    desc: {
      tr: "Modern tasarımın akışkanlığına ve sadeliğine atfedilerek tasarlanan SOHO, kurgu ve kompozisyonlarındaki çeşitlilik sayesinde birçok mekâna uyum sağlamaktadır. Formundaki kararlı ve yumuşak hatlarıyla bulunduğu mekânda son derece sıcak bir ambiyans oluşturur. Kafe, restoran, otel, eğitim binaları, sağlık yapıları ve plaza giriş alanları gibi pek çok mekânda yapay ve doğal ışığın farklı açılardan yüzeyine yansımasıyla oluşan yumuşak gölgeler görsel zarafet sunar.",
      me: "SOHO je dizajniran u duhu fluidnosti i jednostavnosti modernog dizajna, te se zahvaljujući raznolikosti svojih formi i kompozicija prilagođava velikom broju prostora. Odlučnim i mekim linijama svoje forme stvara izuzetno toplu atmosferu u prostoru. U kafićima, restoranima, hotelima, obrazovnim i zdravstvenim objektima te ulaznim prostorima poslovnih zgrada, meke sjene nastale odrazom umjetnog i prirodnog svjetlosti pod različitim uglovima pružaju vizualnu eleganciju.",
      en: "Designed with reference to the fluidity and simplicity of modern design, SOHO adapts to many spaces thanks to the variety in its forms and compositions. With its decisive yet soft lines, it creates an exceptionally warm ambiance. In cafés, restaurants, hotels, educational buildings, healthcare facilities and plaza entrances, the soft shadows formed by artificial and natural light reflecting off its surface from different angles offer visual elegance.",
    },
    colors: C(["white", "WHITE SOHO.jpg"], ["mink", "VIZON SOHO.jpg"], ["black", "BLACK SOHO.jpg"], ["gold", "GOLD SOHO.jpg"], ["silver", "SILVER SOHO.jpg"], ["smoke", "FÜME SOHO.jpg"]),
    layouts: [1, 2, 3, 4, 5, 6].map((i) => `/SOHO%20MODEL%20${i}.jpg`),
    gallery: G("SOHO", ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]),
    docs: { teknik: "/SOHO-teknik.pdf", model3d: "/SOHO-3d-model.zip.zip" },
  },
  {
    id: "vava", name: "VAVA", shape: T("Trougao · dijamant", "Üçgen · elmas", "Triangle · diamond"),
    lattice: { kind: "tri", s: 0.202, h: 0.176 },
    size: "20,2 × 17,6 cm", depth: "1,5 cm", cover: "/KAPAK%20VAVA.jpg", info: "/INFO%20VAVA.jpg",
    desc: {
      tr: "VAVA, geometrik hassasiyet ve çağdaş tasarımın buluşma noktasından doğmuştur. Modern mimarinin incelikli simetrisinden ilham alan VAVA, duvar yüzeylerini dinamik bir görsel ritme dönüştürür. Elmas yapılı deseni, ışığı farklı açılardan yakalayarak her iç mekânı zenginleştiren sofistike bir gölge oyunu yaratır.",
      me: "VAVA nastaje na sjecištu geometrijske preciznosti i savremenog dizajna. Inspirisana suptilnom simetrijom moderne arhitekture, VAVA transformiše zidne površine u dinamičan vizualni ritam. Dijamantski uzorak hvata svjetlost iz različitih uglova, stvarajući sofisticirane igre sjenki koje obogaćuju svaki enterijer.",
      en: "VAVA is born at the intersection of geometric precision and contemporary design. Inspired by the subtle symmetry of modern architecture, VAVA transforms wall surfaces into a dynamic visual rhythm. Its diamond-structured pattern captures light from different angles, creating a sophisticated shadow play that enriches every interior.",
    },
    colors: C(["white", "WHITE VAVA.jpg"], ["mink", "VIZON VAVA.jpg"], ["black", "BLACK VAVA.jpg"], ["gold", "GOLD VAVA.jpg"], ["silver", "SILVER VAVA.jpg"], ["smoke", "FÜME VAVA.jpg"]),
    layouts: [1, 2, 3, 4, 5, 6].map((i) => `/VAVA%20MODEL%20${i}.jpg`),
    gallery: G("VAVA", ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]),
    docs: { teknik: "/VAVA-teknik.pdf", model3d: "/VAVA-3d-model.zip.zip" },
  },
  {
    id: "space", name: "SPACE", isNew: true, shape: T("Kvadrat · zaobljeni reljef", "Kare · yuvarlak rölyef", "Square · rounded relief"),
    lattice: { kind: "square", s: 0.18, rot: "diamond" },
    size: "18 × 18 cm", cover: "/SPACE-cover.webp", info: "/SPACE-cover.webp",
    desc: {
      tr: "SPACE, geometrinin daha akışkan, yumuşak ve süreklilik gösteren karakterinden yola çıkarak tasarlanmış üç boyutlu bir yüzey modülüdür. Işık-gölge ilişkisi SPACE'e statik bir dekoratif desen yerine, gün boyunca algısı değişebilen üç boyutlu bir mimari karakter kazandırır. İç içe ilerleyen kademeli geometrisi ve yumuşatılmış köşe geçişleri, klasik ortogonal yüzey algısını kırarak daha akıcı ve dinamik bir yüzey oluşturur. 4 farklı kotta devam eden yüzey katmanları ışığı farklı açılarda yönlendirir; gün ışığı veya yapay aydınlatmanın geliş açısına bağlı olarak yüzeyde değişken parlak ve gölgeli alanlar oluşur. 18 × 18 cm'lik modüllerin ritmik tekrarıyla geniş yüzeyde bütüncül bir desen ve rölyef etkisi ortaya çıkar.",
      me: "SPACE je trodimenzionalni površinski modul nastao iz mekše, fluidnije geometrije koja teče bez prekida. Igra svjetla i sjenke daje mu arhitektonski karakter koji se mijenja tokom dana, umjesto statičnog dekorativnog uzorka. Stepenasta geometrija i zaobljeni prelazi uglova razbijaju klasičnu pravougaonu površinu i stvaraju dinamičniju formu. Slojevi na četiri različite visine usmjeravaju svjetlo pod različitim uglovima, pa se na površini smjenjuju osvijetljene i zasjenjene zone. Ritmičnim ponavljanjem modula 18 × 18 cm na velikoj površini nastaje jedinstven uzorak i reljefni efekat.",
      en: "SPACE is a three-dimensional surface module derived from a geometry characterised by softness and continuity. The interplay of light and shadow gives it an architectural character that shifts throughout the day, rather than a static decorative pattern. Its interlocking stepped geometry and softened corner transitions break away from conventional orthogonal surfaces for a more fluid, dynamic form. Surface layers at four distinct elevations redirect light at varying angles, so highlights and shadows move across the surface with the light. Repeated in 18 × 18 cm modules, the individual form recedes and a unified pattern and relief emerges across large surfaces.",
    },
    colors: C(["white", "SPACE-white.webp"], ["mink", "SPACE-mink.webp"], ["black", "SPACE-black.webp"], ["gold", "SPACE-gold.webp"], ["silver", "SPACE-silver.webp"], ["smoke", "SPACE-smoke.webp"]),
    gallery: G("SPACE", ["1.webp", "2.webp", "3.webp"]),
    docs: {},
  },
  {
    id: "grid", name: "GRID", isNew: true, shape: T("Kvadrat · stepenasti okvir", "Kare · kademeli çerçeve", "Square · stepped frame"),
    cover: "/GRID-cover.webp", info: "/GRID-cover.webp",
    desc: {
      tr: "GRID, mimari tasarımın temel organizasyon prensiplerinden biri olan grid sistemini üç boyutlu bir yüzey geometrisi olarak yeniden yorumlar. Modüllerin yatay ve düşey akslarda tekrarlanması, geniş yüzeylerde güçlü bir ritim ve görsel süreklilik yaratır. Ortogonal geometrisi; logo, tipografi ve kurumsal kimlik elemanları için kontrollü bir arka plan oluştururken, üç boyutlu yapısı düz tabela yüzeylerine göre daha güçlü bir mimari derinlik sağlar. Ritim, düzen, derinlik: modül üzerindeki kot farklılıkları ışığın geliş açısına göre belirginleşen gölge çizgileri oluşturarak kare geometrinin derinliğini vurgular.",
      me: "GRID ponovo tumači sistem mreže — jedan od osnovnih principa arhitektonske organizacije — kao trodimenzionalnu geometriju površine. Ponavljanje modula po horizontalnoj i vertikalnoj osi stvara snažan ritam i vizuelni kontinuitet na velikim površinama. Pravougaona geometrija pruža kontrolisanu pozadinu za logotipe, tipografiju i elemente korporativnog identiteta, a trodimenzionalna struktura daje veću arhitektonsku dubinu od ravnih površina. Ritam, red, dubina: razlike u visini na modulu stvaraju linije sjenke koje se mijenjaju sa uglom svjetla i naglašavaju dubinu kvadratne geometrije.",
      en: "GRID reinterprets the grid system — a fundamental principle of architectural organisation — as a three-dimensional surface geometry. Repeating modules along horizontal and vertical axes creates a strong rhythm and visual continuity across large surfaces. Its orthogonal geometry offers a controlled backdrop for logos, typography and corporate identity, while its three-dimensional structure adds more architectural depth than flat signage surfaces. Rhythm, order, depth: changes in elevation across the module cast shadow lines that shift with the light, accentuating the depth of the square geometry.",
    },
    colors: C(["white", "GRID-white.webp"], ["mink", "GRID-mink.webp"], ["black", "GRID-black.webp"], ["gold", "GRID-gold.webp"], ["silver", "GRID-silver.webp"], ["smoke", "GRID-smoke.webp"]),
    gallery: G("GRID", ["1.webp", "2.webp", "3.webp"]),
    docs: {},
  },
];

/* m² başına karo sayısı (dizilim ızgarasından) */
export function tilesPerM2(l: Lattice) {
  if (l.kind === "square") return 1 / (l.s * l.s);
  if (l.kind === "weave") return 1 / (l.sx * l.sy);
  if (l.kind === "hex") return 1 / ((l.p + l.q) * 2 * l.h);
  return 2 / (l.s * l.h);
}

export const MOD_MATERIAL = T("ABS polimer, akrilna boja", "ABS polimer, akrilik boya", "ABS polymer, acrylic paint");
