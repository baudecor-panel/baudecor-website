"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

type Txt = { tr: string; me: string; en: string };
function tx(key: Txt, lang: Lang): string { return key[lang]; }

const LANGS: { code: Lang; label: string }[] = [
  { code: "me", label: "ME" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Lagan ABS Polimer",         tr: "Hafif ABS Polimer",            en: "Lightweight ABS Polymer"     },
    text:  { me: "Izrađeni od visokokvalitetnog ABS polimera — laki za rukovanje, otporni na udarce i dugovječni.", tr: "Yüksek kaliteli ABS polimerden üretilmiştir — kullanımı kolay, darbelere dayanıklı ve uzun ömürlü.", en: "Made from high-quality ABS polymer — lightweight, impact-resistant and long-lasting." },
  },
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Laka Montaža",              tr: "Kolay Montaj",                 en: "Easy Installation"           },
    text:  { me: "Montaža direktno na zid bez demoliranja. Jedan majstor završava prostoriju za jedan dan.", tr: "Yıkım olmadan doğrudan duvara montaj. Tek usta bir günde odayı tamamlar.", en: "Direct wall installation without demolition. One worker completes a room in a single day." },
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    title: { me: "Modularni Sistem",          tr: "Modüler Sistem",               en: "Modular System"              },
    text:  { me: "Kombinujte različite modele i boje za jedinstven enterijer. Beskrajne mogućnosti dizajna.", tr: "Benzersiz bir iç mekan için farklı modelleri ve renkleri birleştirin. Sonsuz tasarım imkânları.", en: "Combine different models and colors for a unique interior. Endless design possibilities." },
  },
  {
    icon: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "3D Reljefna Površina",      tr: "3D Rölyef Yüzey",              en: "3D Relief Surface"           },
    text:  { me: "Dubina 3–7 cm daje prostoru dramatičnu dimenzionalnost i luksuzni vizualni efekt.", tr: "3–7 cm derinlik, mekâna çarpıcı boyutsellik ve lüks görsel etki kazandırır.", en: "3–7 cm depth gives spaces dramatic dimensionality and a luxurious visual effect." },
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "RAL Sistem Boja",           tr: "RAL Renk Sistemi",             en: "RAL Color System"            },
    text:  { me: "Dostupan u svim RAL bojama po narudžbi. Prilagodite svaki detalj vašem projektu.", tr: "Sipariş üzerine tüm RAL renklerinde mevcuttur. Her detayı projenize göre özelleştirin.", en: "Available in all RAL colors on request. Customize every detail to your project." },
  },
  {
    icon: <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Akrilna Završna Obrada",    tr: "Akrilik Kaplama",              en: "Acrylic Coating"             },
    text:  { me: "Visokokvalitetna akrilik boja otporna na ogrebotine i UV zrake. Dugotrajna svježina boja.", tr: "Yüksek kaliteli akrilik boya, çizilmelere ve UV ışınlarına dayanıklıdır. Renklerin uzun ömürlü tazeliği.", en: "High-quality acrylic paint resistant to scratches and UV rays. Long-lasting color freshness." },
  },
  {
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" /></>,
    title: { me: "Termička i Akustična",      tr: "Isı ve Ses Yalıtımı",          en: "Thermal & Acoustic"          },
    text:  { me: "Poboljšava toplotnu i zvučnu izolaciju prostora. Manje energije, više komfora.", tr: "Mekanın ısı ve ses yalıtımını geliştirir. Daha az enerji, daha fazla konfor.", en: "Improves thermal and acoustic insulation. Less energy consumption, more comfort." },
  },
  {
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" /></>,
    title: { me: "Široka Primjena",           tr: "Geniş Kullanım Alanı",         en: "Wide Application"            },
    text:  { me: "Otel lobiji, restorani, kancelarije, showroomi, tržni centri — svaki prostor dobija karakter.", tr: "Otel lobileri, restoranlar, ofisler, showroomlar, alışveriş merkezleri — her mekâna karakter katıyor.", en: "Hotel lobbies, restaurants, offices, showrooms, malls — giving character to every space." },
  },
];

type ModVariant = { color: string; img: string };
type ModModel   = { name: string; cover: string; infoImg: string; desc: Txt; variants: ModVariant[]; modelImgs: ModVariant[]; gallery: string[]; teknikPdf: string; montajPdf: string; modelZip: string; };

const MOD_MODELS: ModModel[] = [
  {
    name: "PENTA", cover: "/KAPAK%20PENTA.jpg", infoImg: "/INFO%20PENTA.jpg",
    desc: {
      tr: "Ürün portföyümüzde yer alan dekoratif duvar panellerimizin göz alıcı modellerinden olan Penta, tasarımı itibariyle akılda kalan ve hayret uyandıran modern çizgisiyle uygulandığı mekanı değiştiriyor, kıymetlendiriyor ve özel kılıyor. Asimetrik keskin hatları, içbükey ve dışbükey formları ile realistik üç boyutlu görünüm oluşturan Penta dekoratif duvar paneli, konut ve ticari iç mekan duvar tasarımlarında tercih edilmektedir.",
      me: "Penta, jedan od najupečatljivijih modela u našem portfoliju dekorativnih zidnih panela. Modernim dizajnom koji se pamti i oduševljava, transformiše svaki prostor, daje mu vrijednost i posebnost. Asimetrične oštre linije i konkavno-konveksni oblici stvaraju realistični trodimenzionalni izgled — idealan za stambene i komercijalne projekte.",
      en: "Penta is one of the most striking models in our decorative wall panel portfolio. With a modern design that is memorable and awe-inspiring, it transforms every space, adds value and makes it unique. Asymmetric sharp edges and concave-convex forms create a realistic three-dimensional appearance — ideal for residential and commercial interior projects.",
    },
    variants: [
      { color: "White",         img: "/PENTA%20WH%C4%B0TE.jpg"    },
      { color: "Mink",          img: "/PENTA%20MINK.jpg"           },
      { color: "Black",         img: "/PENTA%20BLACK.jpg"          },
      { color: "Gold",          img: "/PENTA%20GOLD.jpg"           },
      { color: "Silver",        img: "/PENTA%20SILVER.jpg"         },
      { color: "Smoke",         img: "/PENTA%20SMOKE.jpg"          },
      { color: "RAL Katalog",   img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/PENTA-1.jpg","/PENTA-2.jpg","/PENTA-3.jpg","/PENTA-4.jpg","/PENTA-5.jpg","/PENTA-6.jpg","/PENTA-8.jpg","/PENTA-9.jpg","/PENTA-10.jpg","/PENTA-11.jpg","/PENTA-12.jpg","/PENTA-13.jpg"],
    modelImgs: [],
    teknikPdf: "/PENTA-teknik.pdf.pdf", montajPdf: "/PENTA-montaj.pdf.pdf", modelZip: "/PENTA-3d-model.zip.zip",
  },
  {
    name: "ZETA", cover: "/KAPAK%20ZETA.jpg", infoImg: "/INFO%20ZETA.jpg", teknikPdf: "/ZETA-teknik.pdf", montajPdf: "/ZETA-montaj.pdf", modelZip: "/ZETA-3d-model.zip.zip",
    desc: {
      tr: "Üç boyutlu altıgen karolara sahip olan ZETA, hem parlak hem de mat yüzeylerde, farklı renklerde mevcut olan petek yapısının zarif bir versiyonudur. Açılı yüzleri, ışık oyunlarıyla birlikte bir ton senfonisine dönüşür ve zarif görünümler oluşturacak şekilde düzenlenebilir. Çekici poligonal geometrisi, modern ve simetrik keskin çizgileriyle gerçekçi üç boyutlu görünüm yaratan ZETA ile harikalar yaratabilirsiniz. Sade tonların görselliği ve doğal ışık, altıgen duvar panellerine nazikçe yansıtıldığında görsel bir şölen ortaya çıkar.",
      me: "ZETA posjeduje trodimenzionalne šesterokutne pločice i elegantna je verzija saćaste strukture, dostupna na sjajnim i mat površinama u različitim bojama. Uglaste površine u kombinaciji s igrom svjetlosti pretvaraju se u simfoniju tonova i mogu se rasporediti kako bi stvorile elegantne vizuale. Sa privlačnom poligonalnom geometrijom i modernim simetričnim linijama, ZETA stvara realističan trodimenzionalni izgled. Kada se nježni tonovi i prirodno svjetlo reflektuju na šesterokutne panele, nastaje pravi vizualni spektakl.",
      en: "ZETA features three-dimensional hexagonal tiles and is an elegant version of the honeycomb structure, available in both glossy and matte surfaces in various colors. Its angled faces, combined with interplays of light, transform into a symphony of tones that can be arranged to create elegant visuals. With its attractive polygonal geometry and modern symmetrical lines, ZETA creates a realistic three-dimensional appearance. When soft tones and natural light are gently reflected on the hexagonal panels, a true visual feast emerges.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20ZETA.jpg"           },
      { color: "Vizon",       img: "/VIZON%20ZETA.jpg"           },
      { color: "Black",       img: "/BALCK%20ZETA.jpg"           },
      { color: "Gold",        img: "/GOLD%20ZETA.jpg"            },
      { color: "Silver",      img: "/SILVER%20ZETA.jpg"          },
      { color: "Füme",        img: "/F%C3%9CME%20ZETA.jpg"       },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/ZETA-1.png","/ZETA-2.jpg","/ZETA-3.jpg","/ZETA-4.jpg","/ZETA-5.jpg","/ZETA-6.jpg","/ZETA-7.jpg","/ZETA-8.jpg","/ZETA-9.jpg","/ZETA-10.jpg","/ZETA-11.jpg","/ZETA-12.jpg"],
    modelImgs: [],
  },
  {
    name: "NORM", cover: "/KAPAK%20NORM.jpg", infoImg: "/INFO%20NORM.jpg", teknikPdf: "/NORM-teknik.pdf", montajPdf: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya26.mp4", modelZip: "/NORM-3d-model.zip.zip",
    desc: {
      tr: "Altıgen formların farklı açılar ve renkler ile olan kombinasyonunun oluşturduğu sıradışı bir duvar tasarım ürünü olan NORM; cafe, restoran, otel, plaza ve giriş-karşılama alanları gibi birçok mekânda 3 boyutlu simetrik ve asimetrik gölge oyunları ile görsel zarafet sunmaktadır. Montaj kolaylığı ve kısmen ya da tamamen uygulanabilirliği ile geniş kullanım yelpazesine sahiptir. Tak-çıkar özelliği ile dilediğiniz zaman duvar tasarımınızı farklılaştırabilir ve yeni bir dekor elde edebilirsiniz. Farklı yüksekliklere sahip altıgen geometrik formlardan oluşan NORM, uygulandığı yüzeyde gerçekçi bir üç boyut meydana getirir. 3D duvar kağıtlarının aksine gerçek bir derinlik oluşturarak mekâna canlı bir ruh katar. Pratikliği, hafifliği ve kolay uygulanabilirliği ile hem mukavemet hem de kalite açısından mevcut mekânları farklılaştırmada tercih sebebidir.",
      me: "NORM je izvanredan dekorativni zidni proizvod nastao kombinacijom šesterokutnih oblika pod različitim uglovima i bojama. U kafićima, restoranima, hotelima, poslovnim zgradama i recepcijskim prostorima pruža vizualnu eleganciju kroz trodimenzionalne simetrične i asimetrične igre sjena. Zahvaljujući lakoći montaže i mogućnosti djelimične ili potpune primjene, posjeduje široku primjenu. Funkcija 'prikvači-skini' omogućava promjenu dekora u svakom trenutku. NORM se sastoji od heksagonalnih geometrijskih formi različitih visina, što na površini stvara realističnu trodimenzionalnost. Za razliku od 3D tapeta, prava dubina daje prostoru poseban duh i energiju. Praktičan, lagan i jednostavan za ugradnju — prvi izbor za transformaciju enterijera.",
      en: "NORM is an extraordinary wall design product created through the combination of hexagonal forms at different angles and colors. In cafés, restaurants, hotels, plazas and reception areas, it offers visual elegance through three-dimensional symmetric and asymmetric shadow plays. With its ease of installation and partial or full applicability, it has a wide range of uses. Its click-in/click-out feature lets you refresh your wall décor whenever you wish. Consisting of hexagonal geometric forms with varying heights, NORM creates a realistic three-dimensional effect on the applied surface. Unlike 3D wallpapers, it generates real depth and brings a vibrant spirit to the space. Practical, lightweight and easy to install — the preferred choice for transforming interiors.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20NORM.jpg"           },
      { color: "Vizon",       img: "/VIZON%20NORM.jpg"           },
      { color: "Black",       img: "/BLACK%20NORM.jpg"           },
      { color: "Gold",        img: "/GOLD%20NORM.jpg"            },
      { color: "Silver",      img: "/SILVER%20NORM.jpg"          },
      { color: "Füme",        img: "/F%C3%9CME%20NORM.jpg"       },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/NORM-1.png","/NORM-2.jpg","/NORM-3.jpg","/NORM-4.jpg","/NORM-5.jpg","/NORM-6.jpg","/NORM-7.jpg","/NORM-8.jpg","/NORM-9.jpg","/NORM-10.jpg","/NORM-11.jpg","/NORM-12.jpg"],
    modelImgs: [],
  },
  {
    name: "MABEL", cover: "/KAPAK%20MABEL.jpg", infoImg: "/INFO%20MABEL.jpg", teknikPdf: "/MABEL-teknik.pdf", montajPdf: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya30.mp4", modelZip: "/MABEL-3d-model.zip.zip",
    desc: {
      tr: "Karşıt ve benzer yönlerde konumlandırılabilen bu küçük çokgen duvar dekoru ürünü, çok çeşitli iç mimari uygulamalar için geniş bir özgürlük sunar. 3 boyutlu simetrik ve asimetrik gölge oyunları, renk ve desen çeşitliliğiyle birleşerek görsel zarafet yaratır. Işığın doğal yansımasıyla renk tonlarının yarattığı yanılsama, derinlik hissi vererek özgün üç boyutlu duvar tasarımları oluşturmanızı sağlar. Farklı kombinasyonlar uygulayarak birbirinden etkileyici duvar dekorları meydana getirebilirsiniz. Montaj kolaylığı, hafifliği ve tasarım özgürlüğüyle geleneksel ya da modern mimari için pratik çözümler sunar. Ürünler birleşim yerleri belli olmadan tek ya da farklı yönlerde döşenerek bütünlüklü bir görsel sağlar. Montaj aparatlarındaki pimler, ürün içindeki yuvalara geçerek son derece pratik bir uygulama imkânı tanır.",
      me: "Ovaj mali poligonalni zidni dekor koji se može postaviti u suprotnim ili sličnim smjerovima pruža veliku slobodu za razne primjene u enterijeru. Trodimenzionalne simetrične i asimetrične igre sjena, u kombinaciji s raznolikošću boja i uzoraka, stvaraju vizualnu eleganciju. Prirodno odbijanje svjetlosti i iluzija tonova daju osjećaj dubine i omogućavaju kreiranje originalnih 3D zidnih dizajna. Primjenom različitih kombinacija možete kreirati raznovrsne zidne dekoracije. Jednostavna montaža, lakoća i sloboda dizajna nude praktična rješenja za tradicionalnu ili modernu arhitekturu. Paneli se postavljaju bez vidljivih spojeva u jednom ili više smjerova za ujednačen vizualni dojam. Montažni zatici jednostavno se ubacuju u utore na pločici, što čini ugradnju izuzetno praktičnom.",
      en: "This small polygonal wall décor product, positionable in opposing or similar directions, offers great freedom for a wide range of interior design applications. Three-dimensional symmetric and asymmetric shadow plays, combined with a variety of colors and patterns, create visual elegance. The natural reflection of light and the illusion of color tones give a sense of depth, enabling you to create unique three-dimensional wall designs. By applying different combinations, you can create a variety of striking wall décors. With easy installation, lightness and design freedom, it offers practical solutions for both traditional and modern architecture. Panels can be laid in one or multiple directions without visible joints for a unified visual. The mounting pins on the assembly brackets slot into the grooves in the panel, making installation extremely easy.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20MABEL.jpg"          },
      { color: "Vizon",       img: "/VIZON%20MABEL.jpg"          },
      { color: "Black",       img: "/BLACK%20MABEL.jpg"          },
      { color: "Gold",        img: "/GOLD%20MABEL.jpg"           },
      { color: "Silver",      img: "/SILVER%20MABEL.jpg"         },
      { color: "Füme",        img: "/F%C3%9CME%20MABEL.jpg"      },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/MABEL-1.jpg","/MABEL-2.jpg","/MABEL-3.jpg","/MABEL-4.jpg","/MABEL-5.jpg","/MABEL-6.png","/MABEL-7.jpg","/MABEL-8.jpg","/MABEL-9.jpg","/MABEL-10.jpg","/MABEL-11.jpg","/MABEL-12.jpg"],
    modelImgs: [],
  },
  {
    name: "SPLINE", cover: "/KAPAK%20SPLIINE.jpg", infoImg: "/INFO%20SPLINE.jpg", teknikPdf: "/SPLINE-teknik.pdf", montajPdf: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya35.mp4", modelZip: "/SPLINE-3d-model.zip.zip",
    desc: {
      tr: "Eğrisel çizgilerin hareketinden ilham alınarak 3 boyutlu örgü görseli kazandırılan SPLINE, zarif, sade ve şık bir duvar kaplama tasarım ürünüdür. Modüler panellerin bir araya gelmesiyle oluşan bu görsel, arkadan uygulanan LED aydınlatmayla duvarlara gerçek bir derinlik duygusu katar. Lobi, resepsiyon ve giriş alanlarında göz alıcı bir karşılama sunan SPLINE ile mekânlarınızda fark yaratın. Farklı renk alternatifleri ve ışık-gölge oyunlarıyla mekânı lüks, asil ve ihtişamlı bir görünüme kavuşturur. Duvar ve tavanda rahatlıkla uygulanabilen bu üründe, arkadan yapılan LED uygulaması ile paneller arasından süzülen ışıklar dekoratif bir aydınlatma etkisi de yaratır.",
      me: "SPLINE je elegantan, jednostavan i šik zidni dekorativni proizvod inspirisan kretanjem zakrivljenih linija, koji dobija trodimenzionalni pleteni vizualni efekt. Ovaj vizual koji nastaje spajanjem modularnih panela, uz LED osvjetljenje primijenjeno sa zadnje strane, daje zidovima pravi osjećaj dubine. Istaknite se uz SPLINE zidne obloge koje pružaju upečatljiv doček u lobijima, recepcijama i ulaznim prostorima. Različite boje i igre svjetla i sjene daju prostoru luksuzan, plemenit i veličanstven izgled. LED osvjetljenje postavljeno iza panela propušta svjetlost između ploča, stvarajući istovremeno dekorativni efekt osvjetljenja.",
      en: "SPLINE is an elegant, refined and stylish wall cladding design product inspired by the movement of curved lines, given a three-dimensional woven visual appearance. This visual, formed by modular panels coming together, combined with LED lighting applied from behind, gives walls a true sense of depth. Make a statement with SPLINE wall cladding panels that provide a striking welcome in lobbies, reception areas and entrances. With different color alternatives and light-shadow plays, it transforms spaces into a luxurious, noble and magnificent look. The LED application behind the panels allows light to filter through the gaps, simultaneously creating a decorative lighting effect.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20SPLINE.jpg"         },
      { color: "Vizon",       img: "/VIZON%20SPLINE.jpg"         },
      { color: "Black",       img: "/BLACK%20SPLINE.jpg"         },
      { color: "Gold",        img: "/GOLD%20SPLINE.jpg"          },
      { color: "Silver",      img: "/SILVER%20SPLINE.jpg"        },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/SPLINE-1.jpg","/SPLINE-2.jpg","/SPLINE-3.jpg","/SPLINE-4.jpg","/SPLINE-5.jpg","/SPLINE-6.jpg","/SPLINE-7.jpg","/SPLINE-8.jpg","/SPLINE-9.jpg","/SPLINE-10.jpg","/SPLINE-11.jpg","/SPLINE-12.jpg"],
    modelImgs: [],
  },
  {
    name: "NAVA", cover: "/KAPAK%20NAVA.jpg", infoImg: "/INFO%20NAVA.jpg", teknikPdf: "/NAVA-teknik.pdf", montajPdf: "https://www.3dwall.com.tr/rsmlr/dokumantasyon2/dosya44.mp4", modelZip: "/NAVA-3d-model.zip.zip",
    desc: {
      tr: "Bu yeni tasarımla 2. neslin ilk modelini ortaya çıkararak birbirinden bağımsız üç farklı çizginin sonsuz kombinasyon seçeneğini sunuyoruz. Düz, Piramit ve Poligon şeklindeki üç farklı karoyu bir arada ya da bağımsız kullanabileceğiniz bu yeni nesil 3 boyutlu duvar kaplamasıyla mekânınız zarafet, asalet ve ihtişam duygusuna bürünür. Kolay montaj sistemi, farklı renk seçenekleri ve paketleme detaylarıyla birinci jenerasyonun modelleriyle uyum gösterir. Modern çizgileri ve simetrik formlarıyla gerçekçi üç boyutlu görünüm sağlayan NAVA, konut ve ticari projelerinizin duvar dekorunda güvenle tercih edebileceğiniz bir modeldir.",
      me: "Ovim novim dizajnom predstavljamo prvi model druge generacije, nudeći beskrajne kombinacije tri međusobno nezavisne linije. Uz ovu novu generaciju 3D zidnih obloga — s tri različite pločice u obliku ravne, piramidalne i poligonalne forme koje se mogu koristiti zajedno ili samostalno — vaš prostor dobija osjećaj elegancije, plemenitosti i veličanstvenosti. Sistem lake montaže, različite opcije boja i detalji pakiranja usklađeni su s modelima prve generacije. NAVA model, sa svojim modernim linijama i simetričnim formama, pruža realističan trodimenzionalni izgled i idealan je izbor za zidnu dekoraciju stambenih i komercijalnih projekata.",
      en: "With this new design, we present the first model of the second generation, offering endless combination options from three independent lines. With three different tiles — flat, pyramid and polygon — that can be used together or independently, this new generation 3D wall cladding fills your space with a sense of elegance, nobility and grandeur. The easy installation system, different color options and packaging details are consistent with first-generation models. NAVA, with its modern lines and symmetrical forms providing a realistic three-dimensional appearance, is a model you can confidently choose for the wall décor of your residential and commercial projects.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20NAVA.jpg"           },
      { color: "Vizon",       img: "/VIZON%20NAVA.jpg"           },
      { color: "Black",       img: "/BLACK%20NAVA.jpg"           },
      { color: "Gold",        img: "/GOLD%20NAVA.jpg"            },
      { color: "Silver",      img: "/SILVER%20NAVA.jpg"          },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/NAVA-1.png","/NAVA-2.jpg","/NAVA-3.jpg","/NAVA-4.jpg","/NAVA-5.jpg","/NAVA-6.jpg","/NAVA-7.png","/NAVA-8.jpg","/NAVA-9.jpg","/NAVA-10.jpg","/NAVA-11.jpg","/NAVA-12.jpg"],
    modelImgs: [],
  },
  {
    name: "SOHO", cover: "/KAPAK%20SOHO.jpg", infoImg: "/INFO%20SOHO.jpg", teknikPdf: "/SOHO-teknik.pdf", montajPdf: "soon", modelZip: "/SOHO-3d-model.zip.zip",
    desc: {
      tr: "Modern tasarımın akışkanlığına ve sadeliğine atfedilerek tasarlanan SOHO, kurgu ve kompozisyonlarındaki çeşitlilik sayesinde birçok mekâna uyum sağlamaktadır. Formundaki kararlı ve yumuşak hatlarıyla bulunduğu mekânda son derece sıcak bir ambiyans oluşturur. Kafe, restoran, otel, eğitim binaları, sağlık yapıları ve plaza giriş alanları gibi pek çok mekânda yapay ve doğal ışığın farklı açılardan yüzeyine yansımasıyla oluşan yumuşak gölgeler görsel zarafet sunar.",
      me: "SOHO je dizajniran u duhu fluidnosti i jednostavnosti modernog dizajna, te se zahvaljujući raznolikosti svojih formi i kompozicija prilagođava velikom broju prostora. Odlučnim i mekim linijama svoje forme stvara izuzetno toplu atmosferu u prostoru. U kafićima, restoranima, hotelima, obrazovnim i zdravstvenim objektima te ulaznim prostorima poslovnih zgrada, meke sjene nastale odrazom umjetnog i prirodnog svjetlosti pod različitim uglovima pružaju vizualnu eleganciju.",
      en: "Designed with reference to the fluidity and simplicity of modern design, SOHO adapts to many spaces thanks to the variety in its forms and compositions. With its decisive yet soft lines, it creates an exceptionally warm ambiance. In cafés, restaurants, hotels, educational buildings, healthcare facilities and plaza entrances, the soft shadows formed by artificial and natural light reflecting off its surface from different angles offer visual elegance.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20SOHO.jpg"           },
      { color: "Vizon",       img: "/VIZON%20SOHO.jpg"           },
      { color: "Black",       img: "/BLACK%20SOHO.jpg"           },
      { color: "Gold",        img: "/GOLD%20SOHO.jpg"            },
      { color: "Silver",      img: "/SILVER%20SOHO.jpg"          },
      { color: "Füme",        img: "/F%C3%9CME%20SOHO.jpg"       },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/SOHO-1.jpg","/SOHO-2.jpg","/SOHO-3.jpg","/SOHO-4.jpg","/SOHO-5.jpg","/SOHO-6.jpg","/SOHO-7.jpg","/SOHO-8.jpg","/SOHO-9.jpg","/SOHO-10.jpg","/SOHO-11.jpg","/SOHO-12.jpg"],
    modelImgs: [
      { color: "Model 1", img: "/SOHO%20MODEL%201.jpg" },
      { color: "Model 2", img: "/SOHO%20MODEL%202.jpg" },
      { color: "Model 3", img: "/SOHO%20MODEL%203.jpg" },
      { color: "Model 4", img: "/SOHO%20MODEL%204.jpg" },
      { color: "Model 5", img: "/SOHO%20MODEL%205.jpg" },
      { color: "Model 6", img: "/SOHO%20MODEL%206.jpg" },
    ],
  },
  {
    name: "VAVA", cover: "/KAPAK%20VAVA.jpg", infoImg: "/INFO%20VAVA.jpg", teknikPdf: "/VAVA-teknik.pdf", montajPdf: "soon", modelZip: "/VAVA-3d-model.zip.zip",
    desc: {
      tr: "VAVA, geometrik hassasiyet ve çağdaş tasarımın buluşma noktasından doğmuştur. Modern mimarinin incelikli simetrisinden ilham alan VAVA, duvar yüzeylerini dinamik bir görsel ritme dönüştürür. Elmas yapılı deseni, ışığı farklı açılardan yakalayarak her iç mekânı zenginleştiren sofistike bir gölge oyunu yaratır.",
      me: "VAVA nastaje na sjecištu geometrijske preciznosti i savremenog dizajna. Inspirisana suptilnom simetrijom moderne arhitekture, VAVA transformiše zidne površine u dinamičan vizualni ritam. Dijamantski uzorak hvata svjetlost iz različitih uglova, stvarajući sofisticirane igre sjenki koje obogaćuju svaki enterijer.",
      en: "VAVA is born at the intersection of geometric precision and contemporary design. Inspired by the subtle symmetry of modern architecture, VAVA transforms wall surfaces into a dynamic visual rhythm. Its diamond-structured pattern captures light from different angles, creating a sophisticated shadow play that enriches every interior.",
    },
    variants: [
      { color: "White",       img: "/WHITE%20VAVA.jpg"           },
      { color: "Vizon",       img: "/VIZON%20VAVA.jpg"           },
      { color: "Black",       img: "/BLACK%20VAVA.jpg"           },
      { color: "Gold",        img: "/GOLD%20VAVA.jpg"            },
      { color: "Silver",      img: "/SILVER%20VAVA.jpg"          },
      { color: "Füme",        img: "/F%C3%9CME%20VAVA.jpg"       },
      { color: "RAL Katalog", img: "/RAL%20RENK%20KARTELASI.jpg" },
    ],
    gallery: ["/VAVA-1.jpg","/VAVA-2.jpg","/VAVA-3.jpg","/VAVA-4.jpg"],
    modelImgs: [
      { color: "Model 1", img: "/VAVA%20MODEL%201.jpg" },
      { color: "Model 2", img: "/VAVA%20MODEL%202.jpg" },
      { color: "Model 3", img: "/VAVA%20MODEL%203.jpg" },
      { color: "Model 4", img: "/VAVA%20MODEL%204.jpg" },
      { color: "Model 5", img: "/VAVA%20MODEL%205.jpg" },
      { color: "Model 6", img: "/VAVA%20MODEL%206.jpg" },
    ],
  },
];


const USAGE_TAGS: Txt[] = [
  { me: "Otel Lobi",     tr: "Otel Lobi",       en: "Hotel Lobby"   },
  { me: "Restoran",      tr: "Restoran",        en: "Restaurant"    },
  { me: "Kancelarija",   tr: "Ofis",            en: "Office"        },
  { me: "Showroom",      tr: "Showroom",        en: "Showroom"      },
  { me: "Tržni Centar",  tr: "AVM",             en: "Shopping Mall" },
  { me: "Dnevna Soba",   tr: "Oturma Odası",    en: "Living Room"   },
];

export default function ModulerDuvarPaneliPage() {
  const [lang, setLang] = useState<Lang>("me");
  const [scrolled, setScrolled] = useState(false);
  const [backTop, setBackTop] = useState(false);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbModelIdx, setLbModelIdx] = useState(0);
  const [lbVariantIdx, setLbVariantIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [glbOpen, setGlbOpen] = useState(false);
  const [glbIndex, setGlbIndex] = useState(0);
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const thumbsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setBackTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!lbOpen) return;
    const count = MOD_MODELS[lbModelIdx].variants.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setLbVariantIdx((i: number) => (i - 1 + count) % count);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setLbVariantIdx((i: number) => (i + 1) % count);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setLbVariantIdx((i: number) => (i + (e.deltaY > 0 ? 1 : -1) + count) % count);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
    };
  }, [lbOpen, lbModelIdx]);

  useEffect(() => {
    const el = thumbsRef.current?.children[lbVariantIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [lbVariantIdx]);

  function openLb(modelIdx: number, variantIdx: number) { setLbModelIdx(modelIdx); setLbVariantIdx(variantIdx); setLbOpen(true); document.body.style.overflow = "hidden"; }
  function closeLb() { setLbOpen(false); document.body.style.overflow = ""; }

  return (
    <>
      <style>{`body{zoom:0.8}`}</style>
      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} style={{ zoom: 1.25 }}>
        <Link href="/" className="logo-btn" aria-label="Baudecor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Baudecor" height={64} style={{ height: 64, width: "auto", display: "block" }} />
        </Link>
        <div className="pp-breadcrumb-nav">
          <Link href="/" className="pp-breadcrumb-link">
            {lang === "me" ? "Početna" : lang === "tr" ? "Ana Sayfa" : "Home"}
          </Link>
          <span className="pp-breadcrumb-sep">→</span>
          <span className="pp-breadcrumb-current">
            {lang === "me" ? "Modularni Zidni Panel" : lang === "tr" ? "Modüler Duvar Paneli" : "Modular Wall Panel"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="lang-toggle">
            {LANGS.map((l) => (
              <button key={l.code} className={`lang-btn${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <a href="tel:+38268361700" className="nav-cta">+382 68 361 700</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pp-hero">
        <div
          className="pp-hero-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80')" }}
        />
        <div className="pp-hero-overlay" />
        <div className="pp-hero-content">
          <p className="pp-hero-category">
            {lang === "me" ? "— Kolekcija 2026 —" : lang === "tr" ? "— Koleksiyon 2026 —" : "— Collection 2026 —"}
          </p>
          <h1 className="pp-hero-title">
            {lang === "me" ? <>Modularni <em>Zidni Paneli</em></>
             : lang === "tr" ? <>Modüler <em>Duvar Panelleri</em></>
             : <>Modular <em>Wall Panels</em></>}
          </h1>
          <p className="pp-hero-sub">
            {lang === "me" ? "3D Reljef · Lagan ABS Polimer · Beskrajne Kombinacije"
             : lang === "tr" ? "3D Rölyef · Hafif ABS Polimer · Sonsuz Kombinasyonlar"
             : "3D Relief · Lightweight ABS Polymer · Endless Combinations"}
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="pp-intro">
        <div className="pp-intro-text reveal">
          <p className="section-label">
            {lang === "me" ? "O Materijalu" : lang === "tr" ? "Malzeme Hakkında" : "About the Material"}
          </p>
          <h2 className="section-title">
            {lang === "me" ? <>Šta je <em>Modularni Panel</em>?</>
             : lang === "tr" ? <>Modüler Panel <em>Nedir</em>?</>
             : <>What is a <em>Modular Panel</em>?</>}
          </h2>
          <p className="pp-intro-para">
            {lang === "me"
              ? "Modularni zidni paneli su dekorativni elementi izrađeni od visokokvalitetnog laganog ABS polimera, presvučeni trajnom akrilnom bojom. Zahvaljujući trodimenzionalnom reljefu dubine 3–7 cm, svaki zid dobija dramatičnu dubinu i luksuzni vizualni karakter."
              : lang === "tr"
              ? "Modüler duvar panelleri, yüksek kaliteli hafif ABS polimerden üretilmiş ve kalıcı akrilik boya ile kaplanmış dekoratif elemanlardır. 3–7 cm derinliğindeki üç boyutlu rölyef sayesinde her duvar çarpıcı bir derinlik ve lüks görsel karakter kazanır."
              : "Modular wall panels are decorative elements made from high-quality lightweight ABS polymer, coated with durable acrylic paint. Thanks to the three-dimensional relief of 3–7 cm depth, every wall gains dramatic depth and a luxurious visual character."}
          </p>
          <p className="pp-intro-para">
            {lang === "me"
              ? "Zahvaljujući modularnom sistemu, različiti modeli se mogu slobodno kombinovati jedni s drugima. Paneli su dostupni u svim RAL bojama po narudžbi, što omogućuje potpunu prilagodbu svakom projektu — od stambenih interijera do hotela i komercijalnih prostora."
              : lang === "tr"
              ? "Modüler sistem sayesinde farklı modeller birbiriyle özgürce kombinlenebilir. Paneller sipariş üzerine tüm RAL renklerinde mevcuttur; bu da her projeye — konut iç mekanlarından otellere ve ticari mekânlara kadar — tam uyum sağlar."
              : "Thanks to the modular system, different models can be freely combined with each other. Panels are available in all RAL colors on request, allowing complete customization for every project — from residential interiors to hotels and commercial spaces."}
          </p>
          <div className="pp-usage-list">
            {USAGE_TAGS.map((tag, i) => (
              <span key={i} className="pp-usage-tag">{tx(tag, lang)}</span>
            ))}
          </div>
        </div>
        <div className="pp-intro-collage">
          {[
            "/KAPAK%20PENTA.jpg",
            "/KAPAK%20ZETA.jpg",
            "/KAPAK%20NORM.jpg",
            "/KAPAK%20MABEL.jpg",
            "/KAPAK%20SPLIINE.jpg",
            "/KAPAK%20NAVA.jpg",
            "/KAPAK%20SOHO.jpg",
            "/KAPAK%20VAVA.jpg",
          ].map((src, i) => (
            <div key={i} className="pp-intro-collage-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* MODELS */}
      <section className="pp-models">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Kolekcija Modela" : lang === "tr" ? "Model Koleksiyonu" : "Model Collection"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? "Naši Modularni Modeli" : lang === "tr" ? "Modüler Model Koleksiyonumuz" : "Our Modular Models"}
            </h2>
          </div>
          <p className="section-desc">
            {lang === "me" ? "8 jedinstvenih modela za svaki ukus i prostor."
             : lang === "tr" ? "Her zevk ve mekân için 8 özgün model."
             : "8 unique models for every taste and space."}
          </p>
        </div>

        <div className="mod-models-grid">
          {MOD_MODELS.map((model, gi) => (
            <div
              key={gi}
              className={`mod-model-card reveal reveal-delay-${(gi % 4) + 1}${selectedModel === gi ? " mod-model-card--active" : ""}`}
              onClick={() => {
                const next = selectedModel === gi ? null : gi;
                setSelectedModel(next);
                if (next !== null) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }}
            >
              <div className="mod-model-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={model.cover} alt={model.name} loading="lazy" />
                <div className="catalog-accent" />
              </div>
              <div className="mod-model-label">
                <p className="mod-model-name">{model.name}</p>
                <span className="mod-model-arrow">{selectedModel === gi ? "▲" : "▼"}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedModel !== null && (() => {
          const m = MOD_MODELS[selectedModel];
          return (
            <div className="mod-detail-panel" ref={detailRef}>
              <div className="mod-detail-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.infoImg || m.cover} alt={m.name} />
              </div>
              <div className="mod-detail-info">
                <div className="mod-detail-header">
                  <h2 className="mod-detail-name">{m.name}</h2>
                  <p className="mod-detail-sub">
                    {lang === "me" ? "Modularni Dekorativni Zidni Panel"
                     : lang === "tr" ? "Modüler Kaplama Tasarım Profili"
                     : "Modular Decorative Wall Panel"}
                  </p>
                </div>
                {tx(m.desc, lang) && (
                  <p className="mod-detail-desc">{tx(m.desc, lang)}</p>
                )}
                <div className="mod-detail-material">
                  <span className="mod-detail-material-label">
                    {lang === "me" ? "Materijal —" : lang === "tr" ? "Materyal —" : "Material —"}
                  </span>
                  {" "}
                  {lang === "me" ? "Ojačani, laki i čvrsti kopolimer"
                   : lang === "tr" ? "Güçlendirilmiş, hafif ve sert kopolimer"
                   : "Reinforced, lightweight and rigid copolymer"}
                </div>
                {m.variants.length > 0 && (
                  <div className="mod-detail-colors">
                    <p className="mod-detail-colors-label">
                      {lang === "me" ? "Boje" : lang === "tr" ? "Renkler" : "Colors"}
                    </p>
                    <div className="mod-detail-swatches">
                      {m.variants.map((v, vi) => (
                        <div key={vi} className="mod-detail-swatch" onClick={() => openLb(selectedModel!, vi)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.img} alt={v.color} />
                          <span>{v.color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {m.modelImgs.length > 0 && (
                  <div className="mod-detail-colors">
                    <p className="mod-detail-colors-label">
                      {lang === "me" ? "Modeli" : lang === "tr" ? "Modeller" : "Models"}
                    </p>
                    <div className="mod-detail-swatches">
                      {m.modelImgs.map((v, vi) => (
                        <div key={vi} className="mod-detail-swatch" onClick={() => { setActiveGallery(m.modelImgs.map(x => x.img)); setGlbIndex(vi); setGlbOpen(true); }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.img} alt={v.color} />
                          <span>{v.color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mod-detail-actions">
                  {m.teknikPdf && (
                  <a className="mod-detail-action-card" href={m.teknikPdf} target="_blank" rel="noopener noreferrer">
                    <div>
                      <p className="mod-detail-action-title">{lang === "me" ? "Tehnički Podaci" : lang === "tr" ? "Teknik Bilgi" : "Technical Data"}</p>
                      <p className="mod-detail-action-sub">{lang === "me" ? "pogledaj" : lang === "tr" ? "incele" : "view"}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </a>
                  )}
                  {m.montajPdf && m.montajPdf !== "soon" && (
                  <a className="mod-detail-action-card" href={m.montajPdf} target="_blank" rel="noopener noreferrer">
                    <div>
                      <p className="mod-detail-action-title">{lang === "me" ? "Montaža" : lang === "tr" ? "Montaj" : "Assembly"}</p>
                      <p className="mod-detail-action-sub">{lang === "me" ? "pogledaj" : lang === "tr" ? "incele" : "view"}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </a>
                  )}
                  {m.montajPdf === "soon" && (
                  <div className="mod-detail-action-card mod-detail-action-card--soon">
                    <div>
                      <p className="mod-detail-action-title">{lang === "me" ? "Montaža" : lang === "tr" ? "Montaj" : "Assembly"}</p>
                      <p className="mod-detail-action-sub">{lang === "me" ? "uskoro" : lang === "tr" ? "Güncelleniyor" : "Coming soon"}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  )}
                  {m.modelZip && (
                  <a className="mod-detail-action-card" href={m.modelZip} download>
                    <div>
                      <p className="mod-detail-action-title">3D Model</p>
                      <p className="mod-detail-action-sub">{lang === "me" ? "preuzmi" : lang === "tr" ? "indir" : "download"}</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                  </a>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {selectedModel !== null && MOD_MODELS[selectedModel].gallery.length > 0 && (
          <>
            <div className="mod-gallery-header">
              <p className="mod-gallery-title">
                {lang === "me" ? "Galerija" : lang === "tr" ? "Galeri" : "Gallery"}
              </p>
            </div>
            <div className="mod-gallery">
              {MOD_MODELS[selectedModel].gallery.map((src, i) => (
                <div key={i} className="mod-gallery-item" onClick={() => { setActiveGallery(MOD_MODELS[selectedModel!].gallery); setGlbIndex(i); setGlbOpen(true); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${MOD_MODELS[selectedModel].name} ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ADVANTAGES */}
      <section className="features">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Zašto Modularni Panel" : lang === "tr" ? "Neden Modüler Panel" : "Why Modular Panel"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? "8 Ključnih Prednosti" : lang === "tr" ? "8 Temel Avantaj" : "8 Key Advantages"}
            </h2>
          </div>
        </div>
        <div className="features-grid">
          {ADVANTAGES.map((a, i) => (
            <div key={i} className={`feature-item reveal reveal-delay-${(i % 4) + 1}`}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">{a.icon}</svg>
              </div>
              <h3 className="feature-title">{tx(a.title, lang)}</h3>
              <p className="feature-text">{tx(a.text, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-glow" />
        <div className="cta-content">
          <p className="section-label reveal">
            {lang === "me" ? "Kontaktirajte Nas" : lang === "tr" ? "İletişime Geçin" : "Contact Us"}
          </p>
          <h2 className="cta-title reveal">
            {lang === "me" ? <>Zainteresovani Za <em>Modularne Panele</em>?</>
             : lang === "tr" ? <><em>Modüler Paneller</em> İlginizi Çekiyor mu?</>
             : <>Interested in <em>Modular Panels</em>?</>}
          </h2>
          <p className="cta-text reveal">
            {lang === "me" ? "Posjetite naš izložbeni salon u Ulcinju ili nas pozovite. Naš tim će vam pomoći odabrati savršen model za vaš prostor."
             : lang === "tr" ? "Ulcinj'deki salonumuzu ziyaret edin veya arayın. Ekibimiz mekanınız için mükemmel modeli seçmenize yardımcı olacak."
             : "Visit our showroom in Ulcinj or call us. Our team will help you choose the perfect model for your space."}
          </p>
          <div className="reveal" style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+38268361700" className="btn-primary">
              {lang === "me" ? "Pozovite Nas" : lang === "tr" ? "Bizi Arayın" : "Call Us"}
            </a>
            <Link href="/" className="btn-outline">
              {lang === "me" ? "← Nazad na Početnu" : lang === "tr" ? "← Ana Sayfaya Dön" : "← Back to Home"}
            </Link>
          </div>
          <div className="cta-contact-grid reveal">
            {([
              { l: { tr: "Telefon", me: "Telefon", en: "Phone" }   as Txt, v: "+382 68 361 700",    href: "tel:+38268361700"        },
              { l: { tr: "E-posta", me: "Email",   en: "Email" }   as Txt, v: "info@baudecor.me",   href: "mailto:info@baudecor.me" },
              { l: { tr: "Adres",   me: "Adresa",  en: "Address" } as Txt, v: "Bratica bb, Ulcinj",  href: undefined                },
              { l: { tr: "Çalışma Saatleri", me: "Radno Vrijeme", en: "Working Hours" } as Txt, v: "08:30 — 17:30", href: undefined },
            ] as { l: Txt; v: string; href: string | undefined }[]).map((info, i) => (
              <div key={i} className="cta-info">
                <p className="cta-info-label">{tx(info.l, lang)}</p>
                <p className="cta-info-value">
                  {info.href ? <a href={info.href}>{info.v}</a> : info.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-copy">
          © 2026 Baudecor · Crna Gora · {lang === "me" ? "Sva prava zadržana" : lang === "tr" ? "Tüm hakları saklıdır" : "All rights reserved"}
        </p>
        <div className="footer-links">
          {[
            { label: "Instagram", href: "https://www.instagram.com/baudecor.me/" },
            { label: "Facebook",  href: "https://www.facebook.com/baudecor.me/" },
            { label: "YouTube",   href: "https://www.youtube.com/@baudecormontenegro" },
          ].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </div>
      </footer>

      {/* LIGHTBOX */}
      {MOD_MODELS.some(m => m.variants.length > 0) && (() => {
        const lbModel   = MOD_MODELS[lbModelIdx];
        const lbVariant = lbModel.variants[lbVariantIdx];
        const count     = lbModel.variants.length;
        return (
          <div className={`lightbox lightbox--mod${lbOpen ? " open" : ""}`}>
            <div className="lightbox-topbar">
              <span className="lightbox-counter">{lbVariantIdx + 1} / {count}</span>
              <button className="lightbox-close" onClick={closeLb}>✕</button>
            </div>
            <div className="lightbox-image-area" onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}>
              <button className="lightbox-arrow prev" onClick={() => setLbVariantIdx((i: number) => (i - 1 + count) % count)}>‹</button>
              <div className="lightbox-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={`${lbModelIdx}-${lbVariantIdx}`} className="lightbox-img" src={lbVariant.img} alt={lbVariant.color} />
              </div>
              <button className="lightbox-arrow next" onClick={() => setLbVariantIdx((i: number) => (i + 1) % count)}>›</button>
            </div>
            <div className="lightbox-panel">
              <div className="lightbox-panel-cols">
                <div className="lightbox-panel-left">
                  <div>
                    <p className="lb-model-name">{lbVariant.color}</p>
                    <p className="lb-model-code">{lbModel.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lightbox-sidebar">
              <div className="lightbox-thumbs" ref={thumbsRef}>
                {lbModel.variants.map((v, i) => (
                  <div key={i} className={`lightbox-thumb${i === lbVariantIdx ? " active" : ""}`} onClick={() => setLbVariantIdx(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.img} alt={v.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {glbOpen && activeGallery.length > 0 && (
        <div className="mod-gallery-lb" onClick={() => setGlbOpen(false)}>
          <button className="mod-gallery-lb-close" onClick={(e) => { e.stopPropagation(); setGlbOpen(false); }}>✕</button>
          <button className="mod-gallery-lb-arrow prev" onClick={(e) => { e.stopPropagation(); setGlbIndex(i => (i - 1 + activeGallery.length) % activeGallery.length); }}>‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeGallery[glbIndex]} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="mod-gallery-lb-arrow next" onClick={(e) => { e.stopPropagation(); setGlbIndex(i => (i + 1) % activeGallery.length); }}>›</button>
        </div>
      )}

      {backTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
}
