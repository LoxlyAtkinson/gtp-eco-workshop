# G03-T01 skill inventory (Convert / Optimize chapter)

Status: REVIEW (builder evidence complete; the email-sequence route rests on PROVISIONAL decision G03-Q1, which waits on owner acceptance under A1.2/A2.1).
Checked: 2026-10-27, 20:55Z to 21:07Z, by the G03-T01 sub-agent.
PROVISIONAL rows relied on (A2.5): G03-Q1 (email-sequence route). No other.
Raw receipts: `experience/evidence/g03-skill-inventory/` (`skill-tool-receipts.md`, `hashes.txt`, `email-sequence-claude-p.jsonl`, `attempt1-*`).

## Next action for the owner

1. Accept or veto G03-Q1: on-screen `email-sequence` = the official Anthropic marketing-pack copy (pinned at `c71b6f3`), run through `claude -p --plugin-dir`. About 1 minute.

## 1. Result per skill

"Invocable" means a real invocation receipt exists from this check. "On screen" lists the goal-03 T01 row.

| Skill | On screen (goal-03 T01) | Path | Exists | sha256 of SKILL.md | Invocable | Receipt |
|---|---|---|---|---|---|---|
| cro | yes | `C:/Users/loxly/.claude/skills/cro/SKILL.md` | yes (3136 B) | `ca9aef67e5bf51314867e52059d93d9ba2a4f2f458c9966aec22354ed8ffbf4d` | YES, Skill tool | `Launching skill: cro` |
| page-cro | yes | `C:/Users/loxly/.claude/skills/page-cro/SKILL.md` | yes (5887 B; plus `references/experiments.md`) | `89dadde593a2c9738b5274fe37276f9eb22e2a6001fdd4a069150e9f89c7beab` | YES, Skill tool | `Launching skill: page-cro` |
| popup-cro | yes | `C:/Users/loxly/.claude/skills/popup-cro/SKILL.md` | yes (11889 B) | `c18dcecbce78b37eb19627affec54ff21983d5ed7c722cbdb140aec2fe83dbe0` | YES, Skill tool | `Launching skill: popup-cro` |
| form-cro | yes | `C:/Users/loxly/.claude/skills/form-cro/SKILL.md` | yes (11128 B) | `895d16a76872d9aaa8cd53e7c8b086f836584c97136816f185e43a3b36ca572f` | YES, Skill tool | `Launching skill: form-cro` |
| email-sequence | yes | NOT under `~/.claude/skills` (absent). Pinned copy: `skills/downloads/email-sequence.zip!email-sequence/SKILL.md` and `skills/downloads/anthropic-marketing-skills.zip!marketing-skills/email-sequence/SKILL.md` | no locally; yes in the pinned pack | `4303252cbe340b19945b3e58d46430fdf42ea47b3e26d985e3ef1d6da5e36021` (10627 B; equals upstream `marketing/skills/email-sequence/SKILL.md` at `c71b6f3` per `g07-skills-packaging.md`) | NOT through this session's Skill tool. YES through `claude -p --plugin-dir` (G03-Q1 route) | `Launching skill: marketing:email-sequence`; result `SKILL_LOADED email-sequence` |
| whatsapp-sequences | yes | `C:/Users/loxly/.claude/skills/whatsapp-sequences/SKILL.md` | yes (12355 B) | `bd426895f13f546ab44a458c37e08012a3f74beca0577b020f064c5f02c9e8d9` | YES, Skill tool | `Launching skill: whatsapp-sequences` |
| signup-flow-cro | yes | `C:/Users/loxly/.claude/skills/signup-flow-cro/SKILL.md` | yes (10336 B) | `f55e000da27618a6a06497b74420174cec2a700704dd624ee67e028d37ed6f78` | YES, Skill tool | `Launching skill: signup-flow-cro` |
| analytics | candidate ("any Optimize skill the spec names, e.g. analytics") | `C:/Users/loxly/.claude/skills/analytics/SKILL.md` | yes (8670 B; plus `references/`, `evals/evals.json`) | `5674199dfb5f0897aef81fd333e727f8cd9ae4a6757defe133a135c0790037cf` | YES, Skill tool | `Launching skill: analytics` |
| performance-report | candidate ("or performance-report from the G13 pack") | NOT under `~/.claude/skills` (absent). Pinned copy: `skills/downloads/anthropic-marketing-skills.zip!marketing-skills/performance-report/SKILL.md` | no locally; yes in the pinned pack | `997397e23ba5124cdcbbf17e4be9f5cb36f2a2145b5648e02b2852c91c3cc140` (19213 B) | DISCOVERABLE through `claude -p --plugin-dir` (listed in the run's init event as `marketing:performance-report`), NOT invoked | None yet. Invoke before naming it on screen |

`experience/g03-scene-spec.md` does not exist yet (T02), so no other Optimize skill is named. The two candidates above are covered in advance.

## 2. Frontmatter, verbatim

| Skill | `name` | `description` |
|---|---|---|
| cro | cro | Conversion Rate Optimization hub - routes to specialized CRO sub-skills for forms, pages, popups, signup flows, onboarding, and paywalls |
| page-cro | page-cro | When the user wants to optimize, improve, or increase conversions on any marketing page — including homepage, landing pages, pricing pages, feature pages, or blog posts. Also use when the user says "CRO," "conversion rate optimization," "this page isn't converting," "improve conversions," or "why isn't this page working." For signup/registration flows, see signup-flow-cro. For post-signup activation, see onboarding-cro. For forms outside of signup, see form-cro. For popups/modals, see popup-cro. |
| popup-cro | popup-cro | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also use when the user mentions "exit intent," "popup conversions," "modal optimization," "lead capture popup," "email popup," "announcement banner," or "overlay." For forms outside of popups, see form-cro. For general page conversion optimization, see page-cro. |
| form-cro | form-cro | When the user wants to optimize any form that is NOT signup/registration — including lead capture forms, contact forms, demo request forms, application forms, survey forms, or checkout forms. Also use when the user mentions "form optimization," "lead form conversions," "form friction," "form fields," "form completion rate," or "contact form." For signup/registration forms, see signup-flow-cro. For popups containing forms, see popup-cro. |
| email-sequence | email-sequence | Design and draft multi-email sequences with full copy, timing, branching logic, exit conditions, and performance benchmarks. Use when building onboarding, lead nurture, re-engagement, win-back, or product launch flows, when you need a complete drip campaign with A/B test suggestions, or when mapping a sequence end-to-end with a flow diagram. (also `argument-hint: "[sequence type]"`) |
| whatsapp-sequences | whatsapp-sequences | When the user wants to write WhatsApp Business message templates, a WhatsApp nurture or re-engagement sequence, opt-in confirmation messages, appointment reminders, or SMS campaign copy. Also use when the user mentions "WhatsApp template," "WhatsApp Business API," "WhatsApp sequence," "WhatsApp automation," "template got rejected," "24-hour window," "session message," "quick reply buttons," "WhatsApp broadcast," "SMS campaign," "bulk SMS," "text message sequence," or "opt-in message." Use this for any message written to be delivered over WhatsApp or SMS. For email sequences, see emails. For chatbot or voice conversation flows, see conversation-scripts. For the surrounding journey, see customer-journey-map. |
| signup-flow-cro | signup-flow-cro | When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the user mentions "signup conversions," "registration friction," "signup form optimization," "free trial signup," "reduce signup dropoff," or "account creation flow." For post-signup onboarding, see onboarding-cro. For lead capture forms (not account creation), see form-cro. |
| analytics | analytics | When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions "set up tracking," "GA4," "Google Analytics," "conversion tracking," "event tracking," "UTM parameters," "tag manager," "GTM," "analytics implementation," "tracking plan," "how do I measure this," "track conversions," "attribution," "Mixpanel," "Segment," "are my events firing," or "analytics isn't working." Use this whenever someone asks how to know if something is working or wants to measure marketing results. For A/B test measurement, see ab-testing. |
| performance-report | performance-report | Build a marketing performance report with key metrics, trend analysis, wins and misses, and prioritized optimization recommendations. Use when wrapping a campaign, when preparing weekly, monthly, or quarterly channel summaries for stakeholders, or when you need data translated into an executive summary with next-period priorities. (also `argument-hint: "<time period or campaign>"`) |

Version fields: page-cro, popup-cro, form-cro, signup-flow-cro `version: 1.0.0`; whatsapp-sequences `metadata.version 1.0.0`; analytics `metadata.version 2.0.0`; cro, email-sequence, performance-report none.

## 3. Source and licence

| Skill | Source | Licence |
|---|---|---|
| cro, page-cro, popup-cro, form-cro, whatsapp-sequences, signup-flow-cro, analytics | Not determinable from local files. No folder holds a LICENSE, NOTICE or README; no SKILL.md names an author or upstream; `~/.claude/skills/REGISTRY.md` has no row for them; `~/.claude/skills` is not a git repo. | Unknown. Do not ship their text in any public file until a source is found. Naming them on screen is a different matter: it ships no text. |
| email-sequence, performance-report | `anthropics/knowledge-work-plugins`, folder `marketing/`, commit `c71b6f3082b1e5ace3d1a9e30ac9205934134c9c` (plugin `marketing` v1.2.0, author Anthropic). The plugin.json fetched from GitHub at that commit hashes `efa94746…e139833`, equal to `g07-skills-packaging.md`. | Apache-2.0 (`marketing/LICENSE`, sha256 `cfc7749b…3d30`). No upstream NOTICE. Packed copies carry `LICENSE.txt` and `NOTICE.txt`. Same files participants download in G13. Not quality-approved (global CLAUDE.md rule for upstream skills without eval.yaml). |

## 4. Findings

1. **6 of the 7 named skills are installed and invocable** through the Skill tool, with receipts. `email-sequence` is still absent from `~/.claude/skills`. That matches the known gap in goal-03 §2.
2. **email-sequence now has a proven execution path.** The pinned pack copy, loaded as plugin `marketing` through `claude -p --plugin-dir`, invoked `marketing:email-sequence` and returned `SKILL_LOADED email-sequence` (1 run, USD 0.82, logged in `spend.log`). The SKILL.md bytes are identical in the pinned zip, the per-skill zip and the plugin dir used.
3. **The plugin dir is a scratch build, not upstream as checked out.** It holds the upstream `plugin.json` (hash-matched) and only the two SKILL.md files from the pinned zip. For T06 runs, rebuild it the same way (or from a fresh sparse checkout at `c71b6f3`) and record its hashes.
4. **`cro` is a router, not a producer.** Its body only points to page-cro, form-cro, popup-cro, signup-flow-cro, onboarding-cro and paywall-upgrade-cro, then asks what the user needs. A T06 "cro run" will return routing, not a capture map. The T06 brief says cro writes "the whole capture map". The likely result is that the map comes from the sub-skills, with cro credited for routing. Flag this in T02/T06.
5. **Dangling cross-references.** page-cro and popup-cro point to `ab-test-setup`, which is absent (`ab-testing` exists). popup-cro points to `email-sequence`, which is absent locally. analytics points to `../../tools/REGISTRY.md`, which is absent. None blocks a run. Each may show up as a broken pointer in raw T06 output.
6. **Pipeline note (not a defect):** in `claude -p`, the global st-gate hook (RULE 9) blocked the first Skill call until Sequential Thinking ran. T06 prompts of 3 or more sentences will hit the same gate. Budget one extra turn per run.
7. **Spend:** `claude -p` runs in `spend.log` are now 35 of the A2.9 ceiling of 60. The failed first attempt made no model call.

## 5. Decisions (PROVISIONAL, builder)

| ID | Decision | Why |
|---|---|---|
| G03-T01-D1 | Use the pinned `c71b6f3` pack copy as THE email-sequence for on-screen naming and T06 runs, through `claude -p --plugin-dir` (follows G03-Q1). Do not install it into `~/.claude/skills`. | It is the copy participants download (G13). Installing globally would change the owner's global config, and that is not authorised. |
| G03-T01-D2 | Treat `analytics` (local) and `performance-report` (pack) as the Optimize candidates. Name neither on screen until T02 picks one and T06 runs it. `performance-report` needs its own invocation receipt first. | goal-03 T01: "A skill with no receipt is never named on screen". |
| G03-T01-D3 | Name the 7 skills on screen by name and source only, never by quoting their bodies, until their licence is known. | The licence of the 7 local skills is unknown. |
