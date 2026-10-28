"""Check story spine v2.1: sums, p-ranges, clocks, card match (text included), unit coverage,
live-slot head starts, slot floors and sourcing counts, and every cut-list total and claim.

Usage: python scripts/check-spine-v2.py
Reads experience/story-spine-v2-timing.md and experience/story-spine.md.
Exits 1 if any check fails. A unit with only an ID and no beat is a failure.
Round 3 (2026-10-27) added checks only; no earlier check was weakened.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIMING = (ROOT / "experience" / "story-spine-v2-timing.md").read_text(encoding="utf-8")
SPINE = (ROOT / "experience" / "story-spine.md").read_text(encoding="utf-8")
FROZEN = {"01", "02", "03"}
PROCESS_OK = {"U12", "U16", "U17", "U74", "U75", "U83", "U85", "U103", "U104", "U105", "U106"}
results = []

def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))

def section(text, start, stop):
    a = text.index(start); b = text.index(stop, a)
    return text[a:b]

def rows(block):
    out = []
    for line in block.splitlines():
        if line.startswith("|") and not line.startswith("|---"):
            out.append([c.strip() for c in line.strip().strip("|").split("|")])
    return out

# ---- beats (section 3)
beat_rows = [r for r in rows(section(TIMING, "## 3. Every beat", "## 4.")) if re.fullmatch(r"\d\d-\d+", r[0])]
beats = {}
for r in beat_rows:
    a, z = (float(x) for x in r[2].split("-"))
    beats[r[0]] = dict(scene=r[1], a=a, z=z, s=int(r[3]), clock=r[4], sub=r[5], units=[u.strip() for u in r[6].split(",") if u.strip()], live=r[7], slots=[x.strip() for x in r[8].split(",") if x.strip() and x.strip() != "-"])
check("beats parsed", len(beats) > 100, f"{len(beats)} beats")

def mmss(t):
    return f"{t // 60}:{t % 60:02d}"
order = sorted(beats, key=lambda k: (int(beats[k]["scene"]), beats[k]["a"]))
start, _t = {}, 0
for k in order:
    start[k] = _t; _t += beats[k]["s"]
bad_clock = [k for k in order if beats[k]["clock"] != mmss(start[k])]
check("beat clocks = running sum of seconds (v2.1)", not bad_clock, ", ".join(bad_clock[:8]))

# ---- scene totals (section 2)
tot_rows = [r for r in rows(section(TIMING, "## 2. Scene totals", "**`sceneSeconds`")) if re.fullmatch(r"\d\d", r[0])]
scene_tot = {r[0]: (int(r[2]), int(r[3])) for r in tot_rows}
total_row = [r for r in rows(section(TIMING, "## 2. Scene totals", "**`sceneSeconds`")) if r[0] == "**Total**"][0]
TOTAL = int(total_row[3].strip("*"))
check("15 numbered scenes", sorted(scene_tot) == [f"{i:02d}" for i in range(1, 16)], str(sorted(scene_tot)))

for sc, (n, S) in scene_tot.items():
    bl = [b for b in beats.values() if b["scene"] == sc]
    bl.sort(key=lambda b: b["a"])
    check(f"scene {sc} beat count", len(bl) == n, f"{len(bl)} vs {n}")
    check(f"scene {sc} seconds sum", sum(b["s"] for b in bl) == S, f"{sum(b['s'] for b in bl)} vs {S}")
    contiguous = bl and abs(bl[0]["a"]) < 1e-9 and abs(bl[-1]["z"] - 0.92) < 1e-9 and all(abs(bl[i]["z"] - bl[i + 1]["a"]) < 1e-9 for i in range(len(bl) - 1))
    check(f"scene {sc} p-ranges contiguous 0.00-0.92", contiguous)
    if sc not in FROZEN:
        bad = [k for k, b in beats.items() if b["scene"] == sc and abs((b["z"] - b["a"]) - 0.92 * b["s"] / S) > 0.002]
        check(f"scene {sc} p-width proportional to seconds", not bad, ", ".join(bad))
check("overall total = sum of scenes", TOTAL == sum(S for _, S in scene_tot.values()), f"{TOTAL}")
scene_start = {sc: min(start[k] for k in order if beats[k]["scene"] == sc) for sc in scene_tot}
live_s = {sc: sum(b["s"] for b in beats.values() if b["scene"] == sc and b["live"].startswith("LS-")) for sc in scene_tot}
bad2 = [r[0] for r in tot_rows if r[7] != mmss(scene_start[r[0]]) or int(r[5]) != live_s[r[0]] or abs(float(r[4]) - round(int(r[3]) / 60, 3)) > 1e-9]
check("section 2 minutes, live-result seconds and start clocks recompute (v2.1)", not bad2 and total_row[7] == f"ends {mmss(TOTAL)}" and int(total_row[5].strip("*")) == sum(live_s.values()), ", ".join(bad2))
m_all = re.search(r"Overall real talk time: (\d+) s = (\d+:\d\d)", TIMING)
m_live = re.search(r"\*\*Live-result seconds:\*\* (\d+) s", TIMING)
check("headline total and live-result seconds match the beats (v2.1)", m_all and int(m_all.group(1)) == TOTAL and m_all.group(2) == mmss(TOTAL) and m_live and int(m_live.group(1)) == sum(live_s.values()))

m = re.search(r"const sceneSeconds=\[([\d,]+)\]", TIMING)
arr = [int(x) for x in m.group(1).split(",")]
check("sceneSeconds matches scene totals", arr == [scene_tot[f"{i:02d}"][1] for i in range(1, 16)], str(arr))
m2 = re.search(r"\*\*`sceneMinutes` \(v2[^`]*`\[([\d.,]+)\]`", TIMING)
mins = [float(x) for x in m2.group(1).split(",")]
check("sceneMinutes = sceneSeconds/60", all(abs(a - round(s / 60, 3)) < 1e-9 for a, s in zip(mins, arr)) and len(mins) == 15, str(mins))

# ---- every beat has substance, seconds and units
thin = [k for k, b in beats.items() if b["s"] < 10 or len(b["sub"]) < 40 or not b["units"]]
check("every beat has >=10 s, substance and units", not thin, ", ".join(thin))
dd = [k for k, b in beats.items() if re.search(r"DD-\d\d default", b["sub"]) and b["s"] < 15]
check("every DD default beat >= 15 s (A1.6)", not dd, ", ".join(dd))
waits = []
for k, b in beats.items():
    for w in re.findall(r"(\d+) s (?:write-down|timed write)", b["sub"]):
        if b["s"] - int(w) < 20:
            waits.append(k)
    if re.search(r"hold slack|click-hold inside", b["sub"]):
        waits.append(k)
check("planned waits counted in their beat with >= 20 s of talk, none in the hold slack (NV-01, NV-m10)", not waits and "40 s write-down" in beats["03-4"]["sub"], ", ".join(waits))

# ---- per-unit check (section 6), both directions
unit_rows = [r for r in rows(section(TIMING, "## 6. Every unit", "## 7.")) if re.fullmatch(r"U\d{2,3}", r[0])]
units = {r[0]: r for r in unit_rows}
check("106 unit rows", sorted(units, key=lambda u: int(u[1:])) == [f"U{i:02d}" for i in range(1, 107)], f"{len(units)}")
from_beats = {}
for k, b in beats.items():
    for u in b["units"]:
        from_beats.setdefault(u, set()).add(k)
fails = []
for u, r in units.items():
    if r[4] == "PROCESS":
        if u not in PROCESS_OK or "Process:" not in r[3]:
            fails.append(f"{u} process without receipt")
        if u in from_beats:
            fails.append(f"{u} marked process but has beats")
        continue
    listed = re.findall(r"(\d\d-\d+) \((\d\d), ([\d.]+)-([\d.]+), (\d+) s\)", r[1])
    if not listed:
        fails.append(f"{u} ID only, no beat"); continue
    for bid, sc, a, z, s in listed:
        b = beats.get(bid)
        if not b or b["scene"] != sc or abs(b["a"] - float(a)) > 1e-9 or abs(b["z"] - float(z)) > 1e-9 or b["s"] != int(s):
            fails.append(f"{u}->{bid} mismatch")
    if {x[0] for x in listed} != from_beats.get(u, set()):
        fails.append(f"{u} beats differ from section 3")
    if len(r[3]) < 20 or "MISSING" in r[3]:
        fails.append(f"{u} no substance text")
    if int(r[2]) != sum(int(x[4]) for x in listed):
        fails.append(f"{u} total s")
check("per-unit: beat + p-range + seconds + substance + total for every deck unit", not fails, "; ".join(fails[:12]))
orphan = sorted(set(from_beats) - set(units))
check("no beat cites an unknown unit", not orphan, ", ".join(orphan))
lab = [u for u, r in units.items() if r[4] == "PRESENT" and "BLOCKED" in r[3]]
check("no unit is bare PRESENT while its substance says BLOCKED (NV-m5)", not lab, ", ".join(lab))

# ---- cards in story-spine.md match the beats
cards = section(SPINE, "### 3.2 Scene cards", "### 3.3")
card_lines = re.findall(r"^  - (\d\d-\d+) · ([\d.]+)-([\d.]+) · (\d+) s · (.*?)\r?$", cards, re.M)
card_map = {c[0]: c for c in card_lines}
miss = [k for k, b in beats.items() if b["scene"] not in FROZEN and k not in card_map]
wrong = [k for k, c in card_map.items() if k in beats and (abs(float(c[1]) - beats[k]["a"]) > 1e-9 or abs(float(c[2]) - beats[k]["z"]) > 1e-9 or int(c[3]) != beats[k]["s"])]
check("cards 04-15 carry every beat with the same p-range and seconds", not miss and not wrong, f"missing {miss} wrong {wrong}")
wrong_text = [k for k, c in card_map.items() if k in beats and c[4] != beats[k]["sub"]]
check("cards 04-15 carry the same on-screen text as the beat table (NV-m8)", not wrong_text and len(card_map) == len(beats) - sum(1 for b in beats.values() if b["scene"] in FROZEN), ", ".join(wrong_text[:8]))
badt = []
for part in re.split(r"(?=^#### Scene )", cards, flags=re.M):
    mm = re.match(r"#### Scene (\d\d) ", part)
    if not mm or mm.group(1) in FROZEN:
        continue
    sc = mm.group(1)
    mt = re.search(r"\*\*Talk time \(v2\):\*\* (\d+) s = (\d+:\d\d) \((\d+) beats\)\. Live-result seconds: (\d+)\.", part)
    if not mt or int(mt.group(1)) != scene_tot[sc][1] or mt.group(2) != mmss(scene_tot[sc][1]) or int(mt.group(3)) != scene_tot[sc][0] or int(mt.group(4)) != live_s[sc]:
        badt.append(sc)
check("scene cards 04-15: talk-time lines match the timing totals (v2.1)", not badt, ", ".join(badt))
m03 = re.search(r"\*\*v2 timing \(v2\.1[^)]*\):\*\* (\d+) s; beats 03-1\.\.03-6 \(([\d, ]+) s\)", cards)
check("scene 03 timing annotation matches the beats (NV-01)", m03 and int(m03.group(1)) == scene_tot["03"][1] and [int(x) for x in m03.group(2).split(",")] == [beats[k]["s"] for k in order if beats[k]["scene"] == "03"])
r31 = [r for r in rows(section(SPINE, "### 3.1 Summary", "### 3.2")) if re.fullmatch(r"\d\d", r[0])]
bad31 = [r[0] for r in r31 if int(r[3]) != scene_tot[r[0]][1] or abs(float(r[4]) - round(int(r[3]) / 60, 3)) > 1e-9 or int(r[5]) != live_s[r[0]] or int(r[6]) != scene_tot[r[0]][0]]
check("spine 3.1 table matches the timing scene totals (v2.1)", len(r31) == 15 and not bad31, ", ".join(bad31))
sp_sec = [list(map(int, x.split(","))) for x in re.findall(r"`\[(\d+(?:,\d+){14})\]`", SPINE)]
sp_sec = [x for x in sp_sec if min(x) >= 100]
check("every sceneSeconds array in story-spine.md equals the timing array (v2.1)", sp_sec and all(x == arr for x in sp_sec), f"{len(sp_sec)} arrays")
for sc in sorted(FROZEN):
    block = section(cards, f"#### Scene {sc} ", "#### Scene " + f"{int(sc) + 1:02d}")
    ranges = re.findall(r"^  - (0\.\d\d)-(0\.\d\d): ", block, re.M)
    want = sorted((b["a"], b["z"]) for b in beats.values() if b["scene"] == sc)
    check(f"frozen card {sc} p-ranges match the timing file", [(float(a), float(z)) for a, z in ranges] == want, str(ranges))

# ---- owner words and named findings
v2cards = cards[cards.index("#### Scene 04 "):] if "#### Scene 04 " in cards else ""
check("VS-02 line 'Copy what works. Then fill the gap.' in 05 and 06, labelled PROVISIONAL builder copy (NV-m1)", v2cards.count("Copy what works. Then fill the gap.") >= 2 and all("PROVISIONAL" in beats[k]["sub"] for k in ("05-7", "06-14")) and "owner's line on screen: \"Copy" not in TIMING + SPINE)
def _norm(s):
    return s.lower().replace("’", "'")
beat_tbl = section(TIMING, "## 3. Every beat", "## 4.")
check("VS-02 no \"don't copy\" / \"do not copy\" in scene cards or the beat table, any case (NV-m8)", all(p not in _norm(cards) and p not in _norm(beat_tbl) for p in ("don't copy", "do not copy", "dont copy")))
check("VS-06 R1 labelled Good 0-7.9 s, Average on end card only", re.search(r"\"Good\" for 0-7\.9 s.*\"Average\" on its end card only", beats["08-5"]["sub"]) is not None)
check("VS-03 channel beats incl. honest Slack", all(k in beats for k in ("09-2", "09-3", "09-4", "09-5")) and "Slack" in beats["09-5"]["sub"] and "honest" in beats["09-5"]["sub"])
check("VS-04 Claude + Claude Code one-step beat", "Claude Code" in beats["06-3"]["sub"] and "Follow this skill" in beats["06-3"]["sub"])
check("VS-08 three slopmonster pairs", all(f"Pair {i}" in beats[f"06-{8 + i}"]["sub"] for i in (1, 2, 3)))
check("VS-09 Design System guideline beat in 06", "Claude Design System" in beats["06-7"]["sub"] and "guideline" in beats["06-7"]["sub"])
check("VS-10 judge, recreate look, recreate interaction", "design-loop" in beats["12-11"]["sub"] and "Recreate the look" in beats["12-12"]["sub"] and "Recreate an interaction" in beats["12-13"]["sub"])
check("VS-11 AI = Attract + Interact teaching beat >= 30 s", "ATTRACT and INTERACT" in beats["11-1"]["sub"] and beats["11-1"]["s"] >= 30)
check("VS-07 B2B find and content generation are live slots", beats["05-6"]["live"].startswith("LS-") and beats["06-2"]["live"].startswith("LS-"))
check("VS-14 conversion skills named with sources", "coreyhaines31/marketingskills" in beats["09-14"]["sub"] and "knowledge-work-plugins" in beats["09-14"]["sub"])
OLD_SKILLS = re.compile(r"\b(page-cro|form-cro|popup-cro|signup-flow-cro)\b")
bad_sk = [k for k, b in beats.items() if OLD_SKILLS.search(b["sub"]) and "f3990f7" not in b["sub"] and "older installs" not in b["sub"]]
paths_ok = all("github.com/coreyhaines31/marketingskills/tree/main/skills" in beats[k]["sub"] and all(re.search(rf"\b{nm}\b", beats[k]["sub"]) for nm in ("cro", "popups", "signup")) for k in ("08-8", "09-14", "15-4"))
check("NV-02 skills on screen use today's names + working path; old names only as older installs or pinned to commit f3990f7", not bad_sk and paths_ok and "f3990f7" in beats["09-14"]["sub"], ", ".join(bad_sk))

# ---- consent before every run
run_start = [k for k, b in beats.items() if b["live"] == "starts all runs"]
check("one run-start beat, after consent", run_start == ["04-2"] and "consent" in beats["04-1"]["sub"].lower())
order = sorted(beats, key=lambda k: (int(beats[k]["scene"]), beats[k]["a"]))
live_before = [k for k in order[: order.index("04-2")] if beats[k]["live"].startswith("LS-")]
check("no live slot before consent", not live_before, ", ".join(live_before))

# ---- live slots (section 4): start, reveal, head start, tray, not-runnable seconds (v2.1)
ls_rows = [r for r in rows(section(TIMING, "## 4. Live slots", "## 5.")) if r[0].startswith("LS-")]
submit = start["04-2"] + beats["04-2"]["s"]
bad4 = []
for r in ls_rows:
    first = r[1].split(",")[0].strip(); b = beats[first]
    if r[4] != f"04-2 Submit ({mmss(submit)})": bad4.append(f"{r[0]} start")
    if r[5] != f"{first} at {mmss(start[first])}, {start[first] - scene_start[b['scene']]} s after scene arrival": bad4.append(f"{r[0]} reveal")
    if r[6] != f"{start[first] - submit} s" or start[first] - submit < 60: bad4.append(f"{r[0]} head start")
    if {x.strip() for x in r[1].split(",")} != {k for k, bb in beats.items() if bb["live"] == r[0]}: bad4.append(f"{r[0]} beats")
check("live slots: every run starts at 04-2 Submit; reveals and head starts (>= 60 s) recompute (A1.4 binding reading, NV-m3)", ls_rows and not bad4, ", ".join(bad4))
TRAY = {"LS-1": "competitor scan", "LS-2": "B2B find", "LS-3": "content", "LS-4": "Last 30 Days", "LS-5": "keywords", "LS-6": "SEO", "LS-7": "backlinks", "LS-8": "citations", "LS-9": "30/60/90", "LS-10": "AI helper", "LS-11": "Tool A", "LS-12": "Tool B"}
tray = beats["04-2"]["sub"].split("Skill loaded", 1)[-1]
no_tray = [r[0] for r in ls_rows if r[0] not in TRAY or TRAY[r[0]] not in tray]
check("04-2 run tray names every run that starts there (NV-m6)", not no_tray, ", ".join(no_tray))
blocked = {r[0] for r in ls_rows if r[8].startswith(("BLOCKED", "HELD"))}
nr = sum(b["s"] for b in beats.values() if b["live"] in blocked)
m_nr = re.search(r"(\d+) s of them are not runnable today", TIMING)
check("not-runnable live-result seconds claim recomputes (NV-m4)", m_nr and int(m_nr.group(1)) == nr, f"{m_nr and m_nr.group(1)} vs {nr}")

# ---- slot floors (section 5)
slot_rows = [r for r in rows(section(TIMING, "## 5. Real ads", "| Floor |")) if r[0] not in ("Slot",)]
slots = {r[0]: r for r in slot_rows}
def n(pfx, f=lambda r: True):
    return sum(1 for k, r in slots.items() if k.startswith(pfx) and f(r))
check("G02 >=4 Engage ad slots, sourced", n("AD-E", lambda r: r[5].startswith("SOURCED")) >= 4)
check("G03 >=3 CTA ad slots incl. B2B", n("AD-C") >= 3 and n("AD-C", lambda r: "B2B" in r[2] or "B2B" in r[3]) >= 1)
check("G04 ad slot categories", n("AD-A", lambda r: "beauty" in r[2]) >= 2 and n("AD-A", lambda r: "clothing" in r[2]) >= 2 and n("AD-A", lambda r: "retail" in r[2]) >= 1 and n("AD-A", lambda r: "B2B" in r[2]) >= 1)
check("G04 >=3 websites, >=2 provider statements", n("W") >= 3 and n("PS-") >= 2)
check("A1.10 QR per tool + /skills/", {"QR-A", "QR-B", "QR-S"} <= set(slots))
check("pins and R1 not counted as ads", all("NOT an ad" in slots[x][2] for x in ("R1", "R2", "R5")))
bad_slot = [k for k, r in slots.items() if r[1] not in beats or k not in beats[r[1]]["slots"]]
check("every slot sits in its beat", not bad_slot, ", ".join(bad_slot))
FLOOR = {
    "G02-T03/T11": lambda k, r: k.startswith("AD-E"),
    "G03-T05": lambda k, r: k.startswith("AD-C"),
    "G04-T03 beauty": lambda k, r: k.startswith("AD-A") and "beauty" in r[2],
    "G04-T03 clothing": lambda k, r: k.startswith("AD-A") and "clothing" in r[2],
    "G04-T03 retail": lambda k, r: k.startswith("AD-A") and "retail" in r[2],
    "G04-T03 B2B": lambda k, r: k.startswith("AD-A") and "B2B" in r[2],
    "G04-T03 websites": lambda k, r: re.fullmatch(r"W\d", k) is not None,
    "G04-T03 provider": lambda k, r: k.startswith("PS-"),
}
badf = []
for r in [r for r in rows(section(TIMING, "| Floor |", "## 6.")) if r[0] != "Floor"]:
    key = next((p for p in FLOOR if r[0].startswith(p)), None)
    if key is None:
        continue
    match = [k for k, s in slots.items() if FLOOR[key](k, s)]
    srcd = [k for k in match if slots[k][5].startswith(("SOURCED", "NAMED"))]
    if int(r[2]) != len(match) or int(r[3]) != len(srcd) or len(match) < int(r[1]):
        badf.append(r[0])
check("floor table: planned and sourced counts recompute from the slots (NV-m8)", not badf, ", ".join(badf))
src_ads = [k for k, r in slots.items() if k.startswith("AD-") and r[5].startswith("SOURCED")]
n_ads = sum(1 for k in slots if k.startswith("AD-"))
m78 = re.search(r"(\d+) of (\d+) ad slots sourced", units["U78"][4])
m7 = re.search(r"(\d+) of the (\d+) real-ad slots are sourced", TIMING)
check("U78 and section 7 sourced-ad counts match section 5 (NV-m5)", m78 and m7 and (int(m78.group(1)), int(m78.group(2))) == (len(src_ads), n_ads) == (int(m7.group(1)), int(m7.group(2))), f"{len(src_ads)} of {n_ads}")

# ---- cut list arithmetic (section 8)
cut_rows = [r for r in rows(section(TIMING, "## 8. Owner cut list", "## 9.")) if r[0].isdigit()]
cum, bad = 0, []
for r in cut_rows:
    cum += int(r[3].split()[0])
    mm, ss = r[6].split(":")
    if int(mm) * 60 + int(ss) != TOTAL - cum:
        bad.append(r[1])
check("cut list running totals", cut_rows and not bad, ", ".join(bad))
tiers = [int(r[5]) for r in cut_rows]
lab_bad = [r[1] for r in cut_rows if (r[5] == "3") != r[4].startswith("OWNER OK NEEDED") or (r[5] == "4") != r[4].startswith("GOAL SHORTFALL, HELD")]
check("cut list: ranks 1..N, unique IDs, tiers in order, Tier 3 = OWNER OK NEEDED, Tier 4 = GOAL SHORTFALL, HELD (NV-03)",
      [int(r[0]) for r in cut_rows] == list(range(1, len(cut_rows) + 1)) and len({r[1] for r in cut_rows}) == len(cut_rows) and tiers == sorted(tiers) and not lab_bad, ", ".join(lab_bad))
def expand(spec):
    out = []
    for part in [p.strip() for p in spec.split(",")]:
        if ".." in part:
            x, y = part.split("..")
            out += [f"{x[:2]}-{i}" for i in range(int(x[3:]), int(y[3:]) + 1)]
        else:
            out.append(part)
    return out
badc = [r[1] for r in cut_rows if any(b not in beats for b in expand(r[2])) or int(r[3].split()[0]) > sum(beats[b]["s"] for b in expand(r[2]) if b in beats)]
check("every cut names real beats and saves no more than they hold", not badc, ", ".join(badc))
t13 = sum(int(r[3].split()[0]) for r in cut_rows if int(r[5]) <= 3)
claims = re.findall(r"Tiers 1-3 (?:together save (\d+) s and )?(?:end|reach) at (\d+:\d\d)", TIMING + SPINE)
bad_claim = [c for c in claims if (c[0] and int(c[0]) != t13) or c[1] != mmss(TOTAL - t13)]
run, c_ = [], 0
for r in cut_rows:
    c_ += int(r[3].split()[0]); run.append((r[0], r[1], mmss(TOTAL - c_), TOTAL - c_))
fi = next((x for x in run if x[3] <= 3660), None)
f6 = next((x for x in run if x[3] <= 3600), None)
m_fi = re.search(r"first falls inside 61:00 at rank (\d+) \((K\d+)\), at (\d+:\d\d)", TIMING)
m_f6 = re.search(r"first reaches 60:00 or less at rank (\d+) \((K\d+)\), at (\d+:\d\d)", TIMING)
check("cut-list claims recompute in both files: Tiers 1-3 saving and end, first inside 61:00, first at or under 60:00 (NV-01, NV-03)",
      claims and not bad_claim and fi and f6 and m_fi and m_fi.groups() == fi[:3] and m_f6 and m_f6.groups() == f6[:3],
      f"claims {claims} want {t13} s / {mmss(TOTAL - t13)}; fi {fi}; f6 {f6}")

width = max(len(r[0]) for r in results)
for name, ok, detail in results:
    print(f"{'PASS' if ok else 'FAIL'}  {name.ljust(width)}  {detail if not ok else ''}".rstrip())
nf = sum(1 for r in results if not r[1])
print(f"\n{len(results) - nf}/{len(results)} checks pass. Total {TOTAL} s = {TOTAL // 60}:{TOTAL % 60:02d}.")
sys.exit(1 if nf else 0)
