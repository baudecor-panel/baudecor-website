# Baudecor web sitesi — proje notları

Bu dosya, site üzerinde Claude ile yapılan çalışmaların kalıcı kaydıdır. Her yeni oturumda önce bunu oku,
iş bittikçe güncelle. (Şifre, token gibi gizli bilgiler buraya **yazılmaz**.)

Son güncelleme: 31 Ekim 2026

---

## 1. Genel

- **Canlı site:** https://baudecor.me — 31 Ekim 2026'dan beri bu yeni tasarım yayında (öncesi WordPress'ti).
- **Teknoloji:** Next.js 16 (App Router), CSS Modules. Bu Next sürümü eğitim verisinden farklı:
  kod yazmadan önce `node_modules/next/dist/docs/` içindeki ilgili rehbere bak (AGENTS.md).
- **Diller:** ME (Karadağca, varsayılan) / TR / EN. Site her yeni ziyarette ME açılır; seçilen dil yalnızca
  o ziyaret boyunca hatırlanır (`lib/useLang.ts`, sessionStorage).
- **İletişim bilgileri:** +382 68 361 700 · info@baudecor.me · Bratica bb, Ulcinj. Ortak sabitler `lib/site.ts` (`PHONE`, `pick`, `PRODUCT_LINKS`).
- Kullanıcı (işletme sahibi) Türkçe yazar; cevaplar Türkçe ve sade olmalı.

## 2. Sayfalar ve dosyalar

| Sayfa | Adres | Ana dosyalar |
|---|---|---|
| Ana sayfa | `/` | `components/home/HomePage.tsx`, `Home.module.css`, `HeroAccordion.tsx` |
| PVC paneller | `/urunler/pvc-paneli` | `components/pvc/PvcPage.tsx` |
| MDF paneller | `/urunler/mdf-paneli` | `components/mdf/*`, `lib/mdf.ts`, `public/mdf-yuz/` |
| Modüler 3D paneller | `/urunler/moduler-duvar-paneli` | `components/moduler/*`, `lib/moduler.ts` |
| Akustik paneller | `/urunler/akustik-duvar-paneli` | `components/akustik/*`, `lib/akustik.ts`, `public/akustik/` |
| Esnek taş (Clayton) | `/urunler/esnek-tas-panel` | `components/clayton/*`, `lib/clayton.ts`, `public/clayton/` |
| Duvar kağıdı | `/duvar-kagidi` | `components/wallpaper/Catalog.tsx` (kart görselleri `public/duvar-kagidi/oda-kart/`) |
| Katalog | `/katalog` | `components/katalog/KatalogPage.tsx`, `Katalog.module.css` |

Ortak parçalar: `components/site/PageHeader.tsx`, `components/site/SiteFooter.tsx` (SiteFooter + ContactSection),
`components/site/Product.module.css`. Kartlar ekrana girerken dönerek gelir (`useFlipIn`); telefonda hafif yükselme (`riseIn`) kullanılır — telefonda 3D dönüş takılma yapıyordu.

## 3. Kullanıcının verdiği içerik kararları (geri alma!)

- Slogan: "Karadağ'ın en büyük showroom'u" **kullanılmaz** → "Ulcinj'de duvar dekor showroom'unuz".
- **"Besplatna Dostava" / ücretsiz teslimat yok** — hiçbir yere yazılmaz.
- Duvar kağıdı kartlarında "Yeni" rozeti yok.
- Ana sayfada Avantajlar ve Galeri bölümleri kaldırıldı.
- Akustik panel: yalnızca **keçe** (taşyünü yok); tek panel 60 × 280 cm, renkler light-oak, teak, beyaz, siyah.
  Montaj: "sadece güçlü bir silikonla". "Nelerden oluşur" bölümü renk seçimine göre değişmez. Esnek bükülme görseli orijinal fotoğraf (SVG versiyonu beğenilmedi).
- MDF: renk kartelası modellerin hemen altında, sonra başlangıç/bitiş profilleri; görsellerin siyah arka planı **orijinal haliyle** kalır (açık renkli deneme beğenilmedi).
- Katalog sayfası: PDF'i olmayan gruplarda "PDF katalog · Hazırlanıyor" satırı var.

## 4. Değişiklik ve yayın akışı

1. Değişiklik `yeni-tasarim` dalında yapılır, test edilir (tsc, eslint, tarayıcıda masaüstü + telefon).
2. `git push origin yeni-tasarim` → Vercel önizleme:
   https://baudecor-website-git-yeni-tasarim-baudecor-panel.vercel.app
3. Kullanıcı **"canlıya al"** deyince: `main`'e fast-forward merge + push → Vercel baudecor.me'yi günceller.
   **Kullanıcı onayı olmadan main'e push yapılmaz.**
4. Sorun olursa Vercel → Overview → **Instant Rollback**.

Teknik notlar:
- Commit mesajı dosyadan (`git commit -F`), BOM'suz. Push Bash'ten `GIT_TERMINAL_PROMPT=0` ile.
- Vercel CLI: `npx vercel@65.5.0 ...` (giriş yapılı; token `%APPDATA%\com.vercel.cli` içinde — asla yazdırma).
- Ekran testleri: puppeteer-core + Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`).

## 5. Alan adı, DNS, e-posta (dikkat!)

- **Alan adı:** Namecheap'te kayıtlı (bitiş 7 Aralık 2027). Nameserver'lar **Romarg** (ns1–ns4.romarg.com) — Namecheap'te değişiklik yapılmaz.
- **DNS kayıtları:** Romarg hosting **cPanel → Zone Editor**. cPanel adresi artık **https://ftp.baudecor.me:2083**.
- Şu anki kayıtlar:
  - `baudecor.me` A → `216.198.79.1` (Vercel)
  - `www.baudecor.me` CNAME → `ae2a56a2a7ff0409.vercel-dns-017.com` (Vercel'de 308 ile baudecor.me'ye yönlenir)
  - `mail.baudecor.me` A → `89.42.218.110` (eski hosting — e-posta için; eskiden CNAME'di, değiştirildi)
  - `ftp.baudecor.me` A → `89.42.218.110`
  - MX → `mx01/02/03.whmpanels.com`, SPF/DKIM/DMARC TXT kayıtları — **dokunma**
  - `claytonmontenegro.me.baudecor.me` kayıtları — ayrı site, dokunma
- **E-posta eski hostingde çalışıyor → Romarg hosting paketi iptal edilmemeli.**
- Eski WordPress adresleri (`/proizvod/*`, `/kategorija-proizvoda/*`, `/shop`, `/kontakt`, `/o-nama`, `/katalozi`, `/blog`…) `next.config.ts` içindeki redirect'lerle yeni sayfalara yönlenir.

## 6. Bekleyen işler

- [ ] **Kataloglar:** kullanıcı PDF'leri gönderince `KatalogPage.tsx` içindeki `SOON` satırlarını `{ kind: "pdf", href: "/katalog/....pdf", size }` ile değiştir (PVC, MDF, modüler, akustik, duvar kağıdı).
- [ ] **Facebook Pixel:** eski sitede vardı, yenide yok — kullanıcı pixel ID'sini gönderirse ekle.
- [ ] **Güvenlik ("sonra bir ara yapalım" dedi):** GitHub, Vercel, Namecheap, Romarg/cPanel hesaplarında 2FA + güçlü şifre; Namecheap Domain Lock kontrolü; önizleme korumasını (Vercel Deployment Protection) isteğe bağlı tekrar açma.
- [ ] **Eski WordPress:** 1–2 hafta sorunsuz geçince yedekleyip cPanel'den silmeyi öner (e-postaya ve claytonmontenegro.me'ye dokunmadan).
- [ ] Cevap bekleyen sorular: ana sayfa kayan yazıdaki "SPC Paneli" ve "Kupovina na Rate" kalsın mı? Hero için alternatif tasarım ("liste + büyük görsel" / "mozaik") istenecek mi?
- `lib/supabase.ts` kullanılmıyor (Supabase env değişkenleri boş); ileride temizlenebilir.
