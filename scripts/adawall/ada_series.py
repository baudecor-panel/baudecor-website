"""Her seri sayfasından ana (oda) görselini, galeri görsellerini ve açıklamayı toplar."""
import re, json, html, time, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

cat = json.load(open('ada_catalog.json', encoding='utf-8'))
urls = sorted(set(v['series_url'] for v in cat['variants']))  # katalog adresleri düzeltilmiş olmalı
BASE = 'https://www.adawall.com.tr'


def fetch(path):
    for attempt in range(3):
        try:
            req = urllib.request.Request(BASE + urllib.parse.quote(path, safe='/-'), headers={'User-Agent': 'Mozilla/5.0 (Baudecor dealer catalog sync)'})
            return urllib.request.urlopen(req, timeout=40).read().decode('cp1254', errors='ignore')
        except Exception as e:
            time.sleep(2 + attempt * 3)
    return None


def fix(t):
    # bazı sayfalar UTF-8: cp1254 olarak okunduysa geri çevir
    try:
        return t.encode('cp1254').decode('utf-8')
    except Exception:
        return t


def norm(u):
    # /resimler/<boyut>/<id veya Products>/<dosya> → klasör ve dosya
    m = re.search(r'/resimler/[^/]+/([^/]+)/([^"\'?\s)]+)', u)
    return (m.group(1), m.group(2)) if m else None


def parse(path):
    s = fetch(path)
    time.sleep(0.4)
    if not s:
        return path, None
    main = re.search(r'kl-store-main-image[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="kl-store-main-image', s)
    main_url = (main.group(1) or main.group(2)) if main else None
    gallery = re.findall(r'<a href="(https://www\.adawall\.com\.tr/resimler/800/[^"]+)" class="zoom"', s)
    desc = re.search(r'<div[^>]*class="[^"]*(?:kw-details-desc|product-description|desc)[^"]*"[^>]*>(.*?)</div>', s, flags=re.S)
    text = ''
    if desc:
        text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', desc.group(1)))).strip()
    title = re.search(r'class="kl-store-main-image[^"]*" title="([^"]+)"', s)
    return path, {
        'title': fix(html.unescape(title.group(1)).strip()) if title else None,
        'main': norm(main_url) if main_url else None,
        'gallery': [norm(g) for g in gallery if norm(g)],
        'desc': text[:1200],
    }


out = {}
with ThreadPoolExecutor(max_workers=3) as ex:
    for i, (path, data) in enumerate(ex.map(parse, urls)):
        out[path] = data
        if i % 20 == 0:
            print(i, path[:70], 'OK' if data else 'FAIL', flush=True)

json.dump(out, open('ada_series.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ok = [v for v in out.values() if v]
print('series', len(out), 'ok', len(ok), 'with main', sum(1 for v in ok if v['main']), 'with desc', sum(1 for v in ok if v['desc']))
print(json.dumps(ok[0], ensure_ascii=False)[:600])
