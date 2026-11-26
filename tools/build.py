#!/usr/bin/env python3
"""Static site generator for the Micromat redesign.
Reads content extracted from the saved micromat.de pages (ref dir) and renders
all pages with a shared header/footer into the repository root."""
import sys,os,re,json,html as H
sys.path.insert(0,os.path.dirname(__file__))
from extract import extract
from sitedata import *
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
REF=os.environ.get('REF','/tmp/claude-0/-home-user-test1/ebaf4612-79be-5db1-a072-dbd7808c0661/scratchpad/ref/')
IMG=json.load(open(os.path.join(os.path.dirname(__file__),'imgmap.json')))
CAD='https://micromat.partcommunity.com/3d-cad-models/'
LOGOS=('-318x236','Logo-HK')
e=H.escape
def local(u):
    if u.startswith('/'): u=M+u
    n=IMG.get(u)
    return 'assets/img/'+n if n else None
def find(frag):
    for u,n in IMG.items():
        if frag in u: return 'assets/img/'+n
    return None
def link(slug): return slug+'.html'
def auto(t):
    t=e(t.replace('\xad',''))
    t=re.sub(r'([\w.+-]+@[\w-]+\.[\w.]+\w)',r'<a href="mailto:\1">\1</a>',t)
    t=re.sub(r'(Telefon|Tel|Fon|Telefax|Fax):? ?(\+49[ 0-9()/\-]+\d)',lambda m:f'{m.group(1)}: <a href="tel:+{re.sub(r"[^0-9]","",m.group(2))}">{m.group(2).strip()}</a>' if m.group(1) in('Telefon','Tel','Fon') else m.group(0),t)
    return t.replace('\n','<br>')
def ext(u): return u if u.startswith('http') else M+u

# ---------- shared chrome ----------
def header(cur):
    items=[]
    for label,slug,sub in NAV:
        act=' class="act"' if cur==slug or (sub and cur in flat(sub)) else ''
        if sub is None:
            items.append(f'<a{act} href="{link(slug)}">{label}</a>');continue
        if isinstance(sub[0][2] if len(sub[0])>2 else None,list):
            cols=''.join(f'<div class="col"><a class="h" href="{link(s)}">{l}</a>'+''.join(f'<a href="{link(x)}">{n}</a>' for n,x in kids)+'</div>' for l,s,kids in sub)
            panel=f'<div class="drop wide">{cols}</div>'
        else:
            panel='<div class="drop">'+''.join(f'<a href="{link(x)}">{n}</a>' for n,x in sub)+'</div>'
        items.append(f'<div class="mi"><a{act} href="{link(slug)}">{label}<i></i></a>{panel}</div>')
    return f'''<header class="nav" id="nav">
  <a class="brand" href="index.html" aria-label="Micromat Startseite"><span class="brand-mark"><i></i></span><b>micromat</b></a>
  <nav class="menu" id="menu" aria-label="Hauptnavigation">{''.join(items)}<a href="kontakt.html" class="btn btn-sm">Kontakt</a></nav>
  <div class="lang"><a href="#" class="on">DE</a><a href="{M}/?lang=en" rel="noopener">EN</a></div>
  <button class="burger" id="burger" aria-label="Menü öffnen" aria-expanded="false"><span></span><span></span></button>
</header>'''
def flat(sub):
    out=[]
    for s in sub:
        if len(s)==3 and isinstance(s[2],list): out+= [s[1]]+[x for _,x in s[2]]
        else: out.append(s[1])
    return out
FOOTER=f'''<footer class="foot">
  <div class="wrap foot-grid">
    <div>
      <a class="brand" href="index.html"><span class="brand-mark"><i></i></span><b>micromat</b></a>
      <p>Micromat Spannhydraulik GmbH<br>Siemensstr. 15, D-71277 Rutesheim<br>Telefon: <a href="tel:+4971523576560">+49 (0) 7152 35765-60</a><br>E-Mail: <a href="mailto:info@micromat.de">info@micromat.de</a></p>
    </div>
    <div><h4>Produkte</h4><a href="spanntechnik.html">Spanntechnik</a><a href="zylindertechnik.html">Zylindertechnik</a><a href="zubehoer.html">Zubehör</a><a href="sonderanfertigungen.html">Sonderanfertigungen</a><a href="lohnfertigung.html">Lohnfertigung</a></div>
    <div><h4>Kontakt</h4><a href="ansprechpartner.html">Ansprechpartner</a><a href="katalog-anfordern.html">Katalog anfordern</a><a href="karriere.html">Karriere</a><a href="referenzen.html">Referenzen</a></div>
    <div><h4>Rechtliches</h4><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><a href="agb.html">AGB</a><a href="compliance.html">Compliance</a></div>
    <div><h4>Follow</h4><a href="https://www.youtube.com/channel/UCNcODmYfXdJ5pQsG1sdp3fQ/" rel="noopener">YouTube</a><a href="https://www.linkedin.com/company/12362329" rel="noopener">LinkedIn</a><a href="https://www.xing.com/companies/micromatspannhydraulikgmbh" rel="noopener">XING</a></div>
  </div>
  <div class="wrap copy">© Micromat Spannhydraulik GmbH <span>Deutsch · <a href="{M}/?lang=en" rel="noopener">English</a></span></div>
</footer>'''
def shell(slug,title,body,desc=''):
    t=f'{title} – Micromat Spannhydraulik' if slug!='index' else title
    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(t)}</title>
<meta name="description" content="{e(desc or 'Micromat Spannhydraulik GmbH – Ihr Spezialist für Spann- und Zylindertechnik. Wir geben Halt!')}">
<meta name="theme-color" content="#05080f">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="progress" id="progress"></div>
{header(slug)}
<main id="top">
{body}
</main>
{FOOTER}
<script src="script.js"></script>
</body>
</html>
'''

# ---------- generic block renderer ----------
DROP_TEXT={'Gehäuse','Kopf','Kopfform','Größe','Hub','Indexierung','Richtung','Winkel','Abstreifer','Anfrage','Nächster Schritt','Gehäuseform','*','PDF','Step – ZIP','Gallerie','Download','DOWNLOAD','Katalog DOWNLOAD','Katalog herunterladen','Herunterladen','Zur technischen Information','Zum CAD-Portal','CAD-Portal','Kontaktformular','Deutsch'}
def crumbs(slug):
    ch=[];p=slug
    while p:
        t,par=PAGES[p]; ch.append((p,t)); p=par
        if p=='service': break
    ch=ch[::-1]
    h='<a href="index.html">Start</a>'
    for s,t in ch[:-1]:
        h+=f'<i>/</i><a href="{link(s)}">{e(t)}</a>' if s in PAGES and s!='service' else ''
    return h+f'<i>/</i><span>{e(ch[-1][1])}</span>'
def pdf_label(u,ctx=''):
    if u.lower().endswith('.zip'): return 'STEP (ZIP)'
    n=u.lower()
    if 'katalog' in n: return 'Katalog (PDF)'
    return 'PDF'
def caption(t):
    parts=[x.strip() for x in re.split(r' [–-] ',t,maxsplit=1)]
    if len(parts)==2: return f'<b>{e(parts[0])}</b><span>{e(parts[1])}</span>'
    return f'<b>{e(t)}</b>'
def is_head(x):
    return len(x)<34 and '\n' not in x and not re.search(r'[.!?,:]$',x) and len(x.split())>=2 and x[0].isupper()
def render(blocks,slug,after=None):
    after=after or {}
    out=[];i=0;n=len(blocks)
    def hook(text):
        for k,v in after.items():
            if text.startswith(k): out.append(v)
    while i<n:
        t,x,alt=blocks[i]
        # galleries: image(+caption) runs
        if t=='img':
            items=[]
            while i<n and blocks[i][0]=='img':
                u=blocks[i][1]; cap=blocks[i][2] or ''
                j=i+1
                if j<n and blocks[j][0]=='h4': cap=blocks[j][1]; j+=1
                items.append((u,cap)); i=j
                while i<n and blocks[i][0]=='h2' and blocks[i][1]==cap: i+=1
            items=[(u,c) for u,c in items if local(u) and not any(l in u for l in LOGOS)]
            if items:
                cls='gallery'+(' tall' if any(('565x' in u or '556x' in u or '350x495' in u) for u,_ in items) else '')+(' fit' if any(u.lower().endswith('.png') for u,_ in items) else '')
                out.append(f'<div class="{cls}">'+''.join(f'<figure class="gcard reveal" style="--d:{k%4*.06}s"><div class="gimg"><img src="{local(u)}" alt="{e(c or "")}" loading="lazy"></div>'+(f'<figcaption>{caption(c)}</figcaption>' if c else '')+'</figure>' for k,(u,c) in enumerate(items))+'</div>')
            continue
        # td runs: spec list or download rows
        if t=='td':
            run=[]
            while i<n and blocks[i][0] in('td','pdf'): run.append(blocks[i]); i+=1
            if any(r[0]=='pdf' for r in run):
                rows=[]
                for r in run:
                    if r[0]=='td' and r[1] not in('PDF','Step – ZIP'): rows.append([r[1],[]])
                    elif r[0]=='pdf' and rows: rows[-1][1].append(r[1])
                out.append('<div class="dl">'+''.join(f'<div class="dlrow"><span>{e(l)}</span><div>'+''.join(f'<a class="chipbtn" href="{ext(u)}" rel="noopener">{pdf_label(u)}</a>' for u in us)+'</div></div>' if us else f'<div class="dlsub">{e(l)}</div>' for l,us in rows)+'</div>')
            else:
                v=[r[1] for r in run]
                out.append('<dl class="specs reveal">'+''.join(f'<div><dt>{e(v[k].rstrip(":"))}</dt><dd>{e(v[k+1]) if k+1<len(v) else ""}</dd></div>' for k in range(0,len(v),2))+'</dl>')
            continue
        if t=='li':
            run=[]
            while i<n and blocks[i][0]=='li': run.append(blocks[i][1]); i+=1
            out.append('<ul class="checks reveal">'+''.join(f'<li>{auto(r)}</li>' for r in run)+'</ul>'); continue
        if t=='p' and is_head(x):
            i+=1; out.append(f'<h4 class="reveal">{e(x)}</h4>'); continue
        if t=='p' and len(x)<18 and '\n' not in x:
            run=[]
            while i<n and blocks[i][0]=='p' and len(blocks[i][1])<18 and '\n' not in blocks[i][1]: run.append(blocks[i][1]); i+=1
            if len(run)>2: out.append('<ul class="pills reveal">'+''.join(f'<li>{e(r)}</li>' for r in run)+'</ul>')
            else: out+= [f'<p class="reveal">{e(r)}</p>' for r in run]
            continue
        i+=1
        if x in DROP_TEXT and t!='pdf': continue
        if t=='pdf':
            out.append(f'<p class="dlbtn reveal"><a class="btn btn-sm" href="{ext(x)}" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg> {pdf_label(x)} herunterladen</a></p>')
        elif t=='h1' or t=='h2': out.append(f'<h2 class="reveal">{auto(x)}</h2>'); hook(x)
        elif t=='h3': out.append(f'<h3 class="reveal">{auto(x)}</h3>'); hook(x)
        elif t in('h4','h5','h6'): out.append(f'<h4 class="reveal">{auto(x)}</h4>'); hook(x)
        elif t=='blockquote': out.append(f'<blockquote class="reveal">{auto(x)}</blockquote>')
        else: out.append(f'<p class="reveal">{auto(x)}</p>'); hook(x)
    return '\n'.join(out)

def getblocks(slug):
    b=extract(REF+SRC[slug])
    b=[x for x in b if not (x[0]=='p' and 'reCAPTCHA' in x[1])]
    if b and b[0][0]=='h1': b=b[1:]
    t=PAGES[slug][0]
    b=[x for x in b if not (x[0]=='h2' and x[1].strip()==t)]
    last={}
    for k,x in enumerate(b):
        if x[0]=='pdf': last[x[1]]=k
    b=[x for k,x in enumerate(b) if not (x[0]=='pdf' and last[x[1]]!=k)]
    for k,x in enumerate(b):
        if slug.startswith('schwenkspanner-') and x[0]=='h2' and (x[1].startswith('Technische Informationen') or x[1].startswith('Direkt zu')):
            b=b[:k]; break
    return b

CTA='''<section class="cta-band"><div class="wrap"><div class="cta-in reveal">
  <div><h2>Kein passendes Produkt gefunden? Keine Sorge!</h2><p>Unser Team steht Ihnen gerne zur Verfügung.</p></div>
  <div class="cta-act"><a class="btn" href="mailto:vertrieb@micromat.de">vertrieb@micromat.de</a><a class="btn btn-ghost" href="tel:+4971523576560">+49 (0)7152 35765-60</a></div>
</div></div></section>'''
def hero(slug,title,eyebrow,lead='',img=None,actions=''):
    pic=f'<div class="ph-img reveal" data-tilt><img src="{img}" alt="" fetchpriority="high"></div>' if img else ''
    return f'''<section class="phero{' has-img' if img else ''}">
  <div class="phero-bg"></div>
  <div class="wrap phero-grid">
    <div class="phero-copy">
      <nav class="crumbs reveal" aria-label="Brotkrumen">{crumbs(slug) if slug in PAGES else ''}</nav>
      <p class="eyebrow reveal"><span class="dot"></span> {e(eyebrow)}</p>
      <h1 class="reveal" style="--d:.06s">{e(title)}</h1>
      {f'<p class="lead reveal" style="--d:.12s">{auto(lead)}</p>' if lead else ''}
      {f'<div class="cta reveal" style="--d:.18s">{actions}</div>' if actions else ''}
    </div>
    {pic}
  </div>
</section>'''
def page(slug,eyebrow,lead='',img=None,actions='',pre='',post='',after=None,lead_from_first=False,cta=True,title=None,desc=''):
    t=title or PAGES[slug][0]
    blocks=getblocks(slug) if slug in SRC else []
    norm=lambda z:re.sub(r'[^\w]','',z).lower()
    blocks=[b for b in blocks if not (b[0] in('h2','p') and lead and norm(b[1])==norm(lead))]
    if slug=='spanner-konfigurator' and blocks and blocks[0][0]=='img': blocks=blocks[1:]
    blocks=[b for b in blocks if not (b[0]=='h1' or (b[0]=='h2' and norm(b[1])==norm('Schwenkspanner-Konfigurator') and slug=='spanner-konfigurator'))]
    if lead_from_first and blocks:
        for k,b in enumerate(blocks):
            if b[0] in('p','h5','h4') and len(b[1])>60 and not b[1].rstrip().endswith(':'): lead=b[1]; del blocks[k]; break
    body=hero(slug,t,eyebrow,lead,img,actions)+f'<section class="content"><div class="wrap flow">{pre}{render(blocks,slug,after)}{post}</div></section>'+(CTA if cta else '')
    write(slug,shell(slug,t,body,desc or lead[:155]))
def write(slug,content): open(os.path.join(ROOT,slug+'.html'),'w',encoding='utf8').write(content)
def cards(items):
    return '<div class="cards3">'+''.join(f'<a class="pcard reveal" style="--d:{k%3*.07}s" href="{link(s)}" data-tilt>'+(f'<img src="{im}" alt="" loading="lazy">' if im else '')+f'<div class="shade"></div><span class="num">{k+1:02d}</span><h3>{e(t)}</h3><p>{e(d)}</p><i class="arr"></i></a>' for k,(s,t,d,im) in enumerate(items))+'</div>'
def btn(href,label,ghost=False,small=False):
    return f'<a class="btn{" btn-ghost" if ghost else ""}{" btn-sm" if small else ""}" href="{href}" rel="noopener">{label}</a>'

# ---------- pages ----------
S=lambda f:find(f)
IMG_SCHWENK=S('schwenkspanner-micromat-980')
IMG_HEBEL=S('hebelspanner-produktbild'); IMG_KEIL=S('2.keilspann'); IMG_ABST=S('3.abst'); IMG_BLOCK=S('4.blockzylinder_v'); IMG_RUND=S('5.rundzylinder_v'); IMG_SONDER=S('6.sonderanfertigung')
def build():
    # hub pages
    page('produkte','Produkte','Spann- und Zylindertechnik, Zubehör, Sonderanfertigungen und Lohnfertigung – aus einer Hand.',
      pre=cards([('spanntechnik','Spanntechnik','Schwenkspanner, Hebelspanner, Keilelemente, Abstützelemente',IMG_SCHWENK),
                 ('zylindertechnik','Zylindertechnik','Blockzylinder und Rundzylinder',IMG_BLOCK),
                 ('zubehoer','Zubehör','Druckschrauben, Spannarme, …',find('m901-906')),
                 ('sonderanfertigungen','Sonderanfertigungen','Wir finden die passende Lösung',IMG_SONDER),
                 ('lohnfertigung','Lohnfertigung','Wir fertigen Einzel- und Serienteile mit hoher Genauigkeit an',find('hohe-genauigkeiten'))]),cta=True)
    page('spanntechnik','Produkte · Spanntechnik','Schwenkspanner, Hebelspanner, Keilspannelemente und Abstützelemente für sicheres, querkraftfreies Spannen.',
      pre=cards([('schwenkspanner','Schwenkspanner','Ohne Schwenkhub / Mit Schwenkhub · Ohne Abfrage / Mit Abfrage',IMG_SCHWENK),
                 ('hebelspanner','Hebelspanner','Mit konfigurierbarem Spannarm',IMG_HEBEL),
                 ('keilspannelemente','Keilspannelemente','Ohne Abfrage / Mit Abfrage',IMG_KEIL),
                 ('abstuetzelemente','Abstützelemente','Weniger Vibration, kein Durchbiegen',IMG_ABST)]))
    page('zylindertechnik','Produkte · Zylindertechnik','Mit Micromat Zylindern haben Sie die Kräfte im Griff.',
      pre=cards([('blockzylinder','Blockzylinder','Stahlgehäuse und Aluminiumgehäuse',IMG_BLOCK),
                 ('rundzylinder','Rundzylinder','Hohlkolben-, Einspann- und Einschraubzylinder',IMG_RUND)]))
    page('schwenkspanner','Spanntechnik · Schwenkspanner','Schwenkspanner von Micromat ohne und mit Schwenkhub – wahlweise mit oder ohne Abfrage.',img=IMG_SCHWENK,
      actions=btn('spanner-konfigurator.html','Spanner-Konfigurator <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>')+btn(CAD,'CAD-Portal',True),
      pre='<h2 class="reveal">Schwenkspanner von Micromat ohne Schwenkhub</h2>'+cards([
         ('schwenkspanner-ohne-abfrage-ohne-schwenkhub','Ohne Abfrage Ohne Schwenkhub','Baureihen M620 · M630 · M640 · M650 · M680',IMG_SCHWENK),
         ('schwenkspanner-mit-abfrage-ohne-schwenkhub','Mit Abfrage Ohne Schwenkhub','Baureihe M622 mit pneumatischer Abfrage',IMG_SCHWENK)])+
         '<h2 class="reveal">Schwenkspanner von Micromat mit Schwenkhub</h2>'+cards([
         ('schwenkspanner-ohne-abfrage-mit-schwenkhub','Ohne Abfrage Mit Schwenkhub','Baureihe M820',IMG_SCHWENK)])+
         f'<p class="dlbtn reveal"><a class="btn btn-sm" href="{M}/wp-content/uploads/2023/08/KATALOG_Micromat_10_2020-spanntechnik.pdf" rel="noopener">Schwenkspanner-Informationen im Katalog (PDF)</a></p>')
    # variant pages
    VAR={'schwenkspanner-ohne-abfrage-ohne-schwenkhub':('Baureihen',[('m620-gehaeuse','M620','Kopfflansch mit O-Ring Anschluss'),('m630-gehaeuse','M630','Fußflansch mit O-Ring Anschluss'),('m640-gehaeuse','M640','Blockbauweise mit O-Ring Anschluss'),('m650-gehaeuse','M650','Patronenbauweise'),('m680-gehaeuse','M680','Kopfflansch mit O-Ring-Anschluss')],'technische-info-ohne-abfrage'),
         'schwenkspanner-mit-abfrage-ohne-schwenkhub':('Baureihe',[('m620-gehaeuse','M622','Kopfflansch mit O-Ring Anschluss')],'technische-info-mit-abfrage'),
         'schwenkspanner-ohne-abfrage-mit-schwenkhub':('Baureihe',[('m820-gehaeuse','M820','Kopfflansch mit O-Ring Anschluss')],None)}
    for s,(gt,items,tech) in VAR.items():
        gal=f'<h2 class="reveal">{gt}</h2><div class="gallery tall">'+''.join(f'<figure class="gcard reveal" style="--d:{k*.06}s"><div class="gimg"><img src="assets/img/{f}.jpg" alt="{n}" loading="lazy"></div><figcaption><b>{n}</b><span>{d}</span></figcaption></figure>' for k,(f,n,d) in enumerate(items))+'</div>'
        links=f'<p class="dlbtn reveal">'+(btn(link(tech),'Technische Informationen',small=True)+' ' if tech else '')+btn(CAD,'Direkt im CAD-Portal',True,True)+' '+btn(M+'/wp-content/uploads/2023/08/KATALOG_Micromat_10_2020-spanntechnik.pdf','Katalog (PDF)',True,True)+'</p>'
        page(s,'Spanntechnik · Schwenkspanner',lead_from_first=True,img=find('m820-gehaeuse') if 'mit-schwenkhub' in s else find('m620-gehaeuse'),
          actions=btn('spanner-konfigurator.html','Spanner-Konfigurator')+btn(CAD,'Zum CAD-Portal',True),post=gal+links)
    page('spanner-konfigurator','Schwenkspanner · Konfigurator',img=find('amb-2018-9'),lead_from_first=False,
      actions=btn(M+'/produkte/schwenkspanner/ohne-schwenkhub/','Zum geführten Konfigurator')+btn(CAD,'Direkt zum CAD-Portal',True),
      after={'Hier gelangen Sie direkt auf unserer Website':f'<p class="dlbtn reveal">{btn(M+"/produkte/schwenkspanner/ohne-schwenkhub/","Geführter Konfigurator",small=True)} {btn(M+"/produkte/schwenkspanner/spanner-konfigurator/","Integrierte Konfiguration",True,True)}</p>',
             'Hier gelangen Sie direkt zur Konfiguration':f'<p class="dlbtn reveal">{btn(CAD,"Zum CAD-Portal",small=True)}</p>'})
    page('hebelspanner','Spanntechnik · Hebelspanner','Hydraulische Hebelspanner mit konfigurierbarem Spannarm – querkraftfrei spannen.',img=find('hebelspanner-mit-spannarm') or IMG_HEBEL,
      actions=btn(CAD,'Konfiguration im CAD-Portal'),lead_from_first=False,
      post='<div class="note reveal">Der Konfigurator auf der Website folgt zeitnah. Bitte verwenden Sie jetzt den Konfigurator im CAD-Portal. Weitere Baugrößen folgen in Kürze.</div>')
    page('keilspannelemente','Spanntechnik · Keilspannelemente',lead_from_first=True,img=IMG_KEIL,
      post='<h2 class="reveal">Baureihen</h2><ul class="tags"><li>M530 ohne Abfrage</li><li>M531 mit Abfrage</li></ul>')
    page('abstuetzelemente','Spanntechnik · Abstützelemente',lead_from_first=True,img=IMG_ABST)
    page('zubehoer','Produkte · Zubehör','Druckschrauben, Spannarme und Sensorik für Ihre Spannlösung.')
    page('sonderanfertigungen','Produkte · Sonderanfertigungen',lead_from_first=True,img=IMG_SONDER,actions=btn('kontakt.html','Konstruktions-Team kontaktieren'))
    for s,eb in [('blockzylinder','Zylindertechnik · Blockzylinder'),('rundzylinder','Zylindertechnik · Rundzylinder')]:
        extra=''
        if s=='blockzylinder': extra=cards([('blockzylinder-stahlgehaeuse','Blockzylinder Stahlgehäuse','Einfach- und doppeltwirkend · bis 500 bar',find('m501')),('blockzylinder-aluminiumgehaeuse','Blockzylinder Aluminiumgehäuse','Doppeltwirkend · bis 350 bar',find('m521'))])
        else: extra=cards([('hohlkolbenzylinder','Hohlkolbenzylinder','M710 – M713',find('hohlkolbenzylinder.png') or find('m710')),('einspannzylinder','Einspannzylinder','M720B · M720G',find('einspannzylinder.png') or find('m720_b')),('einschraubzylinder','Einschraubzylinder','M730B · M730G · M731',find('einschraubzylinder.png') or find('m730_b'))])
        bl=getblocks(s)
        page(s,eb,img=IMG_BLOCK if s=='blockzylinder' else IMG_RUND,lead_from_first=True,post=extra,
             after={})
    for s in ['blockzylinder-stahlgehaeuse','blockzylinder-aluminiumgehaeuse','hohlkolbenzylinder','einspannzylinder','einschraubzylinder']:
        page(s,'Zylindertechnik · '+('Blockzylinder' if 'block' in s else 'Rundzylinder'),lead_from_first=True,
             actions=btn(CAD,'Konfigurieren im CAD-Portal')+btn(M+'/wp-content/uploads/2023/08/KATALOG_Micromat_10_2020.pdf','Katalog (PDF)',True))
    page('lohnfertigung','Lohnfertigung',img=find('einzel-serienteile'),actions=btn('kontakt.html','Anfrage senden'),
         lead_from_first=True,post=LOHN_FORM)
    page('zertifizierung','Unternehmen · Zertifizierung','ISO 9001:2015 – Qualität nach internationalen Standards.',
         actions=btn(M+'/wp-content/uploads/2026/01/Z-000186-DE-DE-A-000434-Micromat_Spannhydraulik_GmbH.pdf','Zertifikat (PDF)'))
    page('karriere','Unternehmen · Karriere','„Wenn’s keiner vormacht, macht’s keiner nach!“',actions=btn('mailto:bewerbungen@micromat.de','Jetzt bewerben'),cta=False)
    page('compliance','Unternehmen · Compliance','Klare Regeln sind uns wichtig – Vertrauen ist die Grundlage unseres Geschäfts.',cta=False)
    page('referenzen','Unternehmen · Referenzen','Kunden, mit denen wir lange und erfolgreich zusammenarbeiten.',post=REFLOGOS())
    page('katalog-anfordern','Service · Katalog anfordern',lead_from_first=True,post=CAT_FORM,cta=False)
    page('technische-info-ohne-abfrage','Service · Technische Informationen','Technische Informationen für Schwenkspanner ohne Abfrage ohne Schwenkhub.',cta=True)
    page('technische-info-mit-abfrage','Service · Technische Informationen','Technische Informationen für Schwenkspanner mit Abfrage ohne Schwenkhub.',cta=True)
    for s in ['impressum','datenschutz','agb']: page(s,'Rechtliches',cta=False)
    unternehmen(); kontakt(); ansprechpartner(); notfound()

LOHN_FORM='''<h2 class="reveal">Anfrage senden</h2>
<form class="form reveal" data-mail="vertrieb@micromat.de" data-subject="Anfrage Lohnfertigung">
  <label>Ihr Name<input name="name" required></label><label>Ihre E-Mail-Adresse<input type="email" name="email" required></label>
  <label class="full">Ihre Nachricht<textarea name="msg" rows="5"></textarea></label>
  <button class="btn" type="submit">Anfrage vorbereiten</button><p class="fine">Das Formular öffnet Ihr E-Mail-Programm mit einer vorbereiteten Nachricht.</p>
</form>'''
CAT_FORM='''<h2 class="reveal">Katalog bestellen</h2>
<form class="form reveal" data-mail="info@micromat.de" data-subject="Katalogbestellung">
  <label>Ihr Name (Pflichtfeld)<input name="name" required></label><label>Ihre E-Mail-Adresse (Pflichtfeld)<input type="email" name="email" required></label>
  <label class="full">Betreff<input name="subject"></label><label class="full">Ihre Nachricht<textarea name="msg" rows="5"></textarea></label>
  <button class="btn" type="submit">Nachricht vorbereiten</button><p class="fine">Das Formular öffnet Ihr E-Mail-Programm mit einer vorbereiteten Nachricht.</p>
</form>'''
def REFLOGOS():
    names=[('mag','MAG'),('ffg','FFG'),('Logo-HK','HK Präzisionstechnik'),('roehm','Röhm'),('wvl','WVL'),('noelle-nordhorn-318','Nölle + Nordhorn'),('grob','GROB'),('forming','Forming'),('fill','FILL')]
    return '<div class="logos">'+''.join(f'<div class="logo reveal" style="--d:{k%3*.06}s"><img src="{find(f)}" alt="{n}" loading="lazy"></div>' for k,(f,n) in enumerate(names))+'</div>'

def unternehmen():
    b=getblocks('unternehmen')
    b=[x for x in b if not (x[0]=='img') and 'reCAPTCHA' not in x[1]]
    head=[x for x in b if x[0] in('h2','h3','h5') and not re.match(r'^\d{4}:',x[1])]
    tl=[];i=0
    while i<len(b):
        if b[i][0]=='h3' and re.match(r'^\d{4}:',b[i][1]):
            y,tx=b[i][1].split(':',1); sub=''
            if i+1<len(b) and b[i+1][0]=='p': sub=b[i+1][1]; i+=1
            tl.append((y.strip(),tx.strip(),sub))
        i+=1
    title2=[x for x in b if x[0]=='h2'][:1]
    lead=[x[1] for x in b if x[0]=='h3' and not re.match(r'^\d{4}:',x[1])][:1]
    paras=[x[1] for x in b if x[0]=='h5']
    body=hero('unternehmen','Unternehmen','Unternehmen · Rutesheim',lead[0].title() if False else lead[0],find('micromat-rutesheim-gebaeude') )
    body+='<section class="content"><div class="wrap flow"><h2 class="reveal">'+e(title2[0][1])+'</h2>'+''.join(f'<p class="reveal">{auto(p)}</p>' for p in paras)
    body+='<h2 class="reveal">Unsere Geschichte</h2><div class="timeline">'+''.join(f'<div class="tl reveal"><b>{e(y)}</b><div><h3>{e(t)}</h3>'+(f'<p>{e(s)}</p>' if s else '')+'</div></div>' for y,t,s in tl)+'</div>'
    body+='<h2 class="reveal">Mehr über Micromat</h2>'+cards([('zertifizierung','Zertifizierung','DIN EN ISO 9001:2015 seit 2003',None),('karriere','Karriere','Zu unseren aktuellen Stellenangeboten',None),('referenzen','Referenzen','Kunden, die uns vertrauen',None)])+'</div></section>'+CTA
    write('unternehmen',shell('unternehmen','Unternehmen',body,'Micromat Spannhydraulik GmbH, Rutesheim – Ihr zuverlässiger Partner für hydraulische Spannlösungen seit 1989.'))
def kontakt():
    body=hero('kontakt','Kontakt','Kontakt · Standort Rutesheim','Suchen Sie den passenden Ansprechpartner oder möchten Sie uns über das Kontaktformular eine Nachricht senden? Wir helfen Ihnen gerne weiter.',find('micromat-rutesheim-gebaeude'),
      btn('ansprechpartner.html','Ansprechpartner')+btn('mailto:info@micromat.de','info@micromat.de',True))
    b=extract(REF+SRC['kontakt'])
    partners=[]
    txt=[x for x in b if x[0]=='p']
    dist=''.join(f'<article class="person reveal" style="--d:{k*.06}s"><b>{e(n)}</b><em>{e(r)}</em><span>{auto(a)}</span></article>' for k,(n,r,a) in enumerate(DIST))
    body+=f'''<section class="content"><div class="wrap flow">
<div class="two-col">
 <div><h2 class="reveal">Wie dürfen wir Ihnen helfen?</h2>
 <form class="form reveal" data-mail="info@micromat.de" data-subject="Kontaktanfrage">
  <label>Ihr Name<input name="name" required></label><label>Ihre E-Mail-Adresse<input type="email" name="email" required></label>
  <label class="full">Betreff<input name="subject"></label><label class="full">Ihre Nachricht<textarea name="msg" rows="5"></textarea></label>
  <button class="btn" type="submit">Nachricht vorbereiten</button><p class="fine">Das Formular öffnet Ihr E-Mail-Programm mit einer vorbereiteten Nachricht.</p></form></div>
 <div class="addr reveal"><img src="{find('micromat-rutesheim-gebaeude')}" alt="Micromat Spannhydraulik Rutesheim" loading="lazy">
  <h3>Micromat Spannhydraulik GmbH</h3><p>Siemensstr. 15, D-71277 Rutesheim<br>Telefon: <a href="tel:+4971523576560">+49 (0) 7152 35765-60</a><br>E-Mail: <a href="mailto:info@micromat.de">info@micromat.de</a></p>
  <h4>Weitere E-Mail-Adressen</h4><p>Anfragen: <a href="mailto:vertrieb@micromat.de">vertrieb@micromat.de</a><br>Rechnungen: <a href="mailto:rechnungen@micromat.de">rechnungen@micromat.de</a><br>Auftragsbestätigungen: <a href="mailto:einkauf@micromat.de">einkauf@micromat.de</a></p></div>
</div>
<h2 class="reveal">Ansprechpartner Deutschland</h2><div class="people dist">{dist}</div>
</div></section>'''
    write('kontakt',shell('kontakt','Kontakt',body,'Kontakt zu Micromat Spannhydraulik GmbH in Rutesheim.'))
DIST=[('Hydraulik-Technik Gülich-Pohl GmbH','Ansprechpartner Großraum Köln','Max-Planck-Straße 14-20\n50171 Kerpen\nFon +49 (0) 22 37 / 92 36 0-0\nFax +49 (0) 22 37 / 92 36 06 0 / 70\nE-Mail info@ht-hydraulik.de'),
 ('Nölle + Nordhorn GmbH','Ansprechpartner Großraum Gütersloh','Carl-Bertelsmann-Str. 56\n33332 Gütersloh\nFon +49 (0) 52 41 / 86 06-0\nFax +49 (0) 52 41 / 86 06-86\nE-Mail info@nngt.de'),
 ('Hydraulik Service Stollberg','Ansprechpartner Großraum Dresden','Inh. Jürgen Kramer\nRudolf-Breitscheid-Straße 7\n09366 Stollberg\nFon +49 (0) 03 72 96 / 1 52 34\nFax +49 (0) 03 72 96 / 8 77 29\nE-Mail hydraulisto@t-online.de')]
PEOPLE=[('Felix Wagner','Geschäftsführung','+49 (0)7152/357 65-60','vertrieb@micromat.de','Felix-Wagner'),('Christine Höltschl','Vertrieb, Anfragen','+49 (0)7152/357 65-65','c.hoeltschl@micromat.de','Christine-Hoeltschl'),
 ('Tanja Hübner','Personal, Buchhaltung','+49 (0)7152/357 65-62','t.huebner@micromat.de',None),('Sven Sauter','Konstruktion, Anwendungstechnik','+49 (0)7152/357 65-75','s.sauter@micromat.de',None),('Romy Gräf','Einkauf','+49 (0)7152/357 65-60','r.graef@micromat.de',None)]
def ansprechpartner():
    rows=''
    for k,(n,r,t,m,ph) in enumerate(PEOPLE):
        im=find(ph.lower()) if ph else None
        ini=''.join(w[0] for w in n.split())
        av=f'<img class="avimg" src="{im}" alt="{e(n)}" loading="lazy">' if im else f'<span class="av">{ini}</span>'
        rows+=f'<article class="person reveal" style="--d:{k*.06}s">{av}<b>{e(n)}</b><em>{e(r)}</em><a href="tel:+{re.sub(r"[^0-9]","",t)}">{e(t)}</a><a href="mailto:{m}">{m}</a></article>'
    body=hero('ansprechpartner','Ansprechpartner','Kontakt · Ansprechpartner','Suchen Sie den passenden Ansprechpartner für Ihre Fragen? Gerne helfen wir Ihnen weiter.')
    body+=f'<section class="content"><div class="wrap flow"><div class="people">{rows}</div></div></section>'+CTA
    write('ansprechpartner',shell('ansprechpartner','Ansprechpartner',body))
def notfound():
    body='''<section class="phero nf"><div class="phero-bg"></div><div class="wrap"><p class="eyebrow"><span class="dot"></span> Fehler 404</p><h1>Hier hält nichts.</h1><p class="lead">Die gesuchte Seite wurde nicht gefunden.</p><div class="cta"><a class="btn" href="index.html">Zur Startseite</a><a class="btn btn-ghost" href="produkte.html">Zu den Produkten</a></div></div></section>'''
    write('404',shell('404','Seite nicht gefunden',body))

def rewrite_index():
    p=os.path.join(ROOT,'index.html'); s=open(p,encoding='utf8').read()
    s=re.sub(r'<header class="nav" id="nav">[\s\S]*?</header>',lambda m:header('index'),s)
    s=re.sub(r'<footer class="foot">[\s\S]*?</footer>',lambda m:FOOTER,s)
    def rep(m):
        u=m.group(1)
        if u.startswith(M):
            path=u[len(M):]
            if path in URLMAP: return f'href="{URLMAP[path]}.html"'
        elif u in URLMAP: return f'href="{URLMAP[u]}.html"'
        return m.group(0)
    s=re.sub(r'href="([^"]+)"',rep,s)
    s=s.replace('href="https://micromat.de/produkte/schwenkspanner/ohne-schwenkhub/" rel="noopener"','href="spanner-konfigurator.html"')
    s=s.replace('href="#kontakt"','href="#kontakt"')
    open(p,'w',encoding='utf8').write(s)
if __name__=='__main__':
    build(); rewrite_index(); print('built')
