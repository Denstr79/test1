"""Extract structured content blocks from saved micromat.de pages (build helper)."""
import re, html
from html.parser import HTMLParser
BLOCK={'h1','h2','h3','h4','h5','h6','p','li','td','th','dt','dd','figcaption','blockquote'}
SKIP={'script','style','noscript','form','nav','header','footer','svg','button','select','option','textarea','iframe'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.out=[]; s.stack=[]; s.cur=None; s.skip=0; s.inmain=False; s.depth=0; s.buf=[]; s.imgs=[]; s.links=[]
    def handle_starttag(s,t,a):
        a=dict(a)
        if a.get('id')=='main': s.inmain=True
        if not s.inmain: return
        if t in SKIP: s.skip+=1; return
        if s.skip: return
        if t=='img':
            src=a.get('data-orig-src') or a.get('src') or ''
            if 'uploads' in src: s.out.append(('img',src,a.get('alt','')))
        if t=='a' and a.get('href'): s.links.append(a['href'])
        if t in BLOCK:
            s.flush(); s.cur=t; s.buf=[]
            if t=='a': pass
        if t=='br': s.buf.append('\n')
        if t=='a' and a.get('href','').lower().endswith(('.pdf','.zip')): s.out.append(('pdf',a['href'],''))
    def handle_endtag(s,t):
        if not s.inmain: return
        if t in SKIP: s.skip=max(0,s.skip-1); return
        if t in BLOCK and s.cur==t: s.flush()
    def handle_data(s,d):
        if s.inmain and not s.skip and s.cur: s.buf.append(d)
    def flush(s):
        if s.cur:
            t=re.sub(r'[ \t\r\f\v]+',' ',''.join(s.buf)); t=re.sub(r' ?\n ?','\n',t).strip()
            if t: s.out.append((s.cur,t,''))
        s.cur=None; s.buf=[]
def extract(path):
    src=open(path,encoding='utf8',errors='ignore').read()
    p=P(); p.feed(src); p.flush()
    res=[]
    for b in p.out:
        if res and res[-1]==b: continue
        if b[0] in BLOCK and ('Gallerie' == b[1] or 'Page load link' in b[1] or b[1].startswith('Sie sehen gerade') or 'Inhalt entsperren' in b[1] or b[1] in('Mehr Informationen',)): continue
        res.append(b)
    return res
if __name__=='__main__':
    import sys
    for b in extract(sys.argv[1]): print(b)
