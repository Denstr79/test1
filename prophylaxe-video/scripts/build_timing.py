"""Split the full voice-over into per-scene mp3s and compute cue + subtitle timings.

Usage: python3 build_timing.py <full.wav> <alignment.csv>
Writes public/vo/<n>.mp3 and src/timing.json.
"""
import csv, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
wav, align = sys.argv[1], sys.argv[2]
script = json.load(open(os.path.join(ROOT, 'scripts', 'script.json')))
rows = list(csv.DictReader(open(align)))
text = ''.join(r['char'] for r in rows)


def run(*a):
    return subprocess.run(a, capture_output=True, text=True)


err = run('ffmpeg', '-hide_banner', '-i', wav, '-af', 'silencedetect=noise=-40dB:d=1.8', '-f', 'null', '-').stderr
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', err)]
ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', err)]
total = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav).stdout)
segs = list(zip([0.0] + ends, starts + [total]))
assert len(segs) == len(script), (len(segs), len(script))


def chunks(vo):
    """Subtitle lines: sentences, long ones broken at clause boundaries."""
    out = []
    for sent in re.split(r'(?<=[.!?])\s+', vo):
        parts, cur = [], ''
        for piece in re.split(r'(?<=[,;:–])\s+', sent):
            if cur and len(cur) + len(piece) > 78:
                parts.append(cur)
                cur = piece
            else:
                cur = (cur + ' ' + piece).strip()
        parts.append(cur)
        out += [p for p in parts if p]
    return out


pos, timing = 0, []
os.makedirs(os.path.join(ROOT, 'public', 'vo'), exist_ok=True)
for n, (sc, (a, b)) in enumerate(zip(script, segs), 1):
    a, b = max(0, a - 0.05), min(total, b + 0.15)
    out = os.path.join(ROOT, 'public', 'vo', f'{n}.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-t', str(b - a), '-i', wav,
                    '-c:a', 'libmp3lame', '-q:a', '2', out], check=True)
    dur = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out).stdout)
    i0 = text.find(sc['vo'][:14], pos)
    assert i0 >= 0, sc['id']
    t0 = float(rows[i0]['start'])
    rel = lambda i: round(float(rows[i]['start']) - t0 + 0.05, 2)
    cues = {}
    for k, w in sc['cues'].items():
        j = text.find(w, i0)
        assert j >= 0, (sc['id'], w)
        cues[k] = rel(j)
    subs, p = [], i0
    for line in chunks(sc['vo']):
        j = text.find(line[:10], p)
        assert j >= 0, (sc['id'], line)
        subs.append({'t': rel(j), 'text': line})
        p = j + max(1, len(line) - 4)
    pos = p
    timing.append({'id': sc['id'], 'title': sc['title'], 'dur': round(dur, 2), 'cues': cues, 'subs': subs})
    print(n, sc['id'], round(dur, 1), cues)
json.dump(timing, open(os.path.join(ROOT, 'src', 'timing.json'), 'w'), ensure_ascii=False, indent=1)
print('total', round(sum(t['dur'] for t in timing), 1))
