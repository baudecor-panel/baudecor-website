import re, json, html
from urllib.parse import unquote

s = open('ada_all.html', 'rb').read().decode('cp1254', errors='ignore')


def fix(t):
    # sayfa karışık kodlu: UTF-8 baytları cp1254 olarak okunmuşsa geri çevir
    try:
        return t.encode('cp1254').decode('utf-8')
    except Exception:
        return t


filters = {}
for key in ['interiors', 'styles', 'colors', 'patternRepeats']:
    for k, v in re.findall(r'(?:data-filter|value|for|id)="\.?(%s\d+)"[^>]*>\s*([^<]{1,40})' % key, s):
        filters[k] = fix(html.unescape(v.strip()))

items = re.findall(r'<li class="product ([^"]*)">(.*?)</li>', s, flags=re.S)
variants = []
for cls, body in items:
    code = re.search(r'hg_badge_sale">\s*([^<]+?)\s*<', body)
    href = re.search(r'href="([^"]+)"', body)
    img = re.search(r'data-src="([^"]+)"', body)
    titles = re.findall(r'kw-details-title[^"]*">\s*([^<]+?)\s*<', body)
    if not (href and img):
        continue
    tags = cls.split()
    variants.append({
        'code': html.unescape(code.group(1)) if code else None,
        'series_url': fix(href.group(1)),
        'collection_slug': fix(href.group(1)).split('/')[3],
        'collection': html.unescape(titles[0]) if titles else None,
        'series_title': html.unescape(titles[1]) if len(titles) > 1 else None,
        'img': img.group(1),
        'new': 'hg_badge_new' in body,
        'rooms': [filters[t] for t in tags if t.startswith('interiors') and t in filters],
        'styles': [filters[t] for t in tags if t.startswith('styles') and t in filters],
        'colors': [filters[t] for t in tags if t.startswith('colors') and t in filters],
        'repeat': next((filters[t] for t in tags if t.startswith('patternRepeats') and t in filters), None),
    })

json.dump({'filters': filters, 'variants': variants}, open('ada_catalog.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
series = sorted(set(v['series_url'] for v in variants))
cols = {}
for v in variants:
    cols.setdefault(v['collection'], set()).add(v['series_url'])
print('variants', len(variants), 'series', len(series), 'codes missing', sum(1 for v in variants if not v['code']))
for c, ss in sorted(cols.items(), key=lambda x: -len(x[1])):
    print(f'  {c}: {len(ss)} seri, {sum(1 for v in variants if v["collection"] == c)} renk')
print(json.dumps(variants[0], ensure_ascii=False))
