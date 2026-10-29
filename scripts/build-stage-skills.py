"""Build the branded take-home skills: the three stage skills under our own brand, plus the combined pack.

Run from the project root:  python -I scripts/build-stage-skills.py [--brand "Smart AI Solutions"] [--site smartaisolutions.co.za] [--prefix smart-ai]
For a client version, pass their brand, site and prefix. Sources are read from ~/.claude/skills and never changed.

Writes to skills/downloads/: <prefix>-ad-ideas.zip, <prefix>-unslop.zip, <prefix>-trends.zip,
workshop-stage-skills.zip and gtp-workshop-skills.zip (with skills/HOW-TO-USE.txt), and refreshes SHA256SUMS.txt.
The MIT licence text travels inside each skill folder as LICENSE.txt, as the licence requires.
"""
import argparse, hashlib, re, zipfile
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--brand', default='Smart AI Solutions')
ap.add_argument('--site', default='smartaisolutions.co.za')
ap.add_argument('--prefix', default='smart-ai')
ap.add_argument('--licences', default='', help='folder with <source>.txt MIT licence files when a source has none')
a = ap.parse_args()

ROOT = Path(__file__).resolve().parent.parent
SRC = Path.home() / '.claude' / 'skills'
OUT = ROOT / 'skills' / 'downloads'
SKIP_DIRS = {'__pycache__', '.git', 'evals', 'img', 'node_modules', 'docs', 'examples'}
SKIP_FILES = {'LICENSE', 'README.md', '.skillkit.json'}

# source folder -> (new suffix, display title, one-line purpose)
SKILLS = {
    'ad-creative': ('ad-ideas', 'Ad Ideas', 'ad ideas and ad copy, written from what you sell'),
    'slopmonster': ('unslop', 'Unslop', 'takes the AI sound out of your writing, so it sounds like you'),
    'last30days': ('trends', 'Trends', 'what people said about a topic on YouTube, Reddit and X in the last 30 days'),
    # Our own skill, kept in skills/source/ and shipped as written.
    'smart-ai-funnels': ('funnels', 'Funnels', 'maps your sales and support funnel, then writes every WhatsApp and email step'),
}
LOCAL = ROOT / 'skills' / 'source'
DISPLAY_NAMES = {'slopmonster': ['SlopMonster', 'Slopmonster', 'SLOPMONSTER'], 'last30days': ['Last30Days']}
DROP_FRONTMATTER =re.compile(r'^\s*(homepage|repository|author):', re.I)
DROP_LINES = re.compile(r'mvanhorn|ItsssssJack|coreyhaines|Corey Haines|Jack Roberts|Matt Van Horn', re.I)


def brand_text(text: str, old: str, new: str, title: str, purpose: str, is_skill_md: bool) -> str:
    lines = text.split('\n')
    if is_skill_md and lines and lines[0].strip() == '---':
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == '---')
        fm = [l for l in lines[1:end] if not DROP_FRONTMATTER.match(l)]
        for i, l in enumerate(fm):
            if re.match(r'^name:', l):
                fm[i] = f'name: {new}'
            elif re.match(r'^description:\s*', l):
                fm[i] = re.sub(r'^description:\s*(["\']?)', lambda m: f'description: {m.group(1)}{a.brand}: ', l, count=1)
        lines = ['---', *fm, '---', '', f'> **{a.brand} {title}** · {a.site}', f'> {purpose[0].upper() + purpose[1:]}.', *lines[end + 1:]]
    lines = [l for l in lines if not DROP_LINES.search(l)]
    out = '\n'.join(lines)
    # People-facing names and install paths. Script file names and settings keep their names.
    out = re.sub(rf'(skills/){re.escape(old)}(?=[/\s`"\']|$)', rf'\g<1>{new}', out)
    out = re.sub(rf'(?<![\w/.-])/{re.escape(old)}\b(?![./])', f'/{new}', out)
    for display in DISPLAY_NAMES.get(old, []):
        out = out.replace(display, f'{a.brand} {title}')
    if old == 'slopmonster':
        out = re.sub(r'\bslopmonster\b(?!/)', new, out)
    return out


def licence_for(src: str) -> str:
    if (LOCAL / src).exists():
        return f'Copyright {a.brand}. Free to use and share.\n'
    own = SRC / src / 'LICENSE'
    if own.exists():
        return own.read_text(encoding='utf-8')
    alt = Path(a.licences) / f'{src}.txt' if a.licences else None
    if alt and alt.exists():
        return alt.read_text(encoding='utf-8')
    raise SystemExit(f'no MIT licence text for {src}: pass --licences <folder with {src}.txt>')


def add_skill(z: zipfile.ZipFile, src: str, prefix: str = '') -> str:
    suffix, title, purpose = SKILLS[src]
    new = f'{a.prefix}-{suffix}'
    local = (LOCAL / src).exists()
    root = LOCAL / src if local else SRC / src
    for p in sorted(root.rglob('*')):
        rel = p.relative_to(root)
        if not p.is_file() or set(rel.parts) & SKIP_DIRS or p.name in SKIP_FILES or p.suffix == '.pyc':
            continue
        arc = f'{prefix}{new}/{rel.as_posix()}'
        if not local and (p.suffix in {'.md', '.txt'} or p.name == 'SKILL.md'):
            z.writestr(arc, brand_text(p.read_text(encoding='utf-8'), src, new, title, purpose, rel.as_posix() == 'SKILL.md'))
        else:
            z.write(p, arc)
    z.writestr(f'{prefix}{new}/LICENSE.txt', licence_for(src))
    z.writestr(f'{prefix}{new}/ABOUT.txt', f'{a.brand} {title}\n{purpose[0].upper() + purpose[1:]}.\n{a.site}\n\nBuilt on open-source work under the MIT licence (LICENSE.txt).\n')
    return new


names = []
for src in SKILLS:
    new = f'{a.prefix}-{SKILLS[src][0]}'
    with zipfile.ZipFile(OUT / f'{new}.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        add_skill(z, src)
    names.append(new)

with zipfile.ZipFile(OUT / 'workshop-stage-skills.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('README.txt', f'{a.brand} skills from the GTP ECO workshop.\n\n'
               + ''.join(f'{f"{a.prefix}-{s}"}: {p}.\n' for s, _, p in SKILLS.values())
               + '\nclaude.ai: upload each zip in upload-to-claude/ under Customize > Skills.\nClaude Code: copy each folder into ~/.claude/skills/.\n')
    for src in SKILLS:
        add_skill(z, src, 'stage-skills/')
    for n in names:
        z.write(OUT / f'{n}.zip', f'upload-to-claude/{n}.zip')

anth = ['brand-review', 'campaign-plan', 'competitive-brief', 'content-creation', 'draft-content', 'email-sequence', 'performance-report', 'seo-audit']
with zipfile.ZipFile(OUT / 'gtp-workshop-skills.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(ROOT / 'skills' / 'HOW-TO-USE.txt', 'HOW-TO-USE.txt')
    for src, pre in (('anthropic-marketing-skills.zip', 'anthropic/'), ('workshop-stage-skills.zip', f'{a.prefix}/')):
        with zipfile.ZipFile(OUT / src) as s:
            for n in s.namelist():
                if not n.endswith('/') and not n.startswith('upload-to-claude/'):
                    z.writestr(pre + n.removeprefix('stage-skills/'), s.read(n))
    for n in anth + names:
        z.write(OUT / f'{n}.zip', f'upload-to-claude/{n}.zip')

# Checksums: keep the Anthropic lines, rewrite ours.
sums = OUT / 'SHA256SUMS.txt'
ours = set(names) | {'workshop-stage-skills', 'gtp-workshop-skills', 'ad-creative', 'slopmonster', 'last30days'}
keep = [l for l in sums.read_text(encoding='utf-8').splitlines() if l.strip() and l.split()[-1].lstrip('*').removesuffix('.zip') not in ours]
for n in [*names, 'workshop-stage-skills', 'gtp-workshop-skills']:
    p = OUT / f'{n}.zip'
    keep.append(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}')
    print(f'{p.name}  {p.stat().st_size // 1024} KB')
sums.write_text('\n'.join(keep) + '\n', encoding='utf-8')
