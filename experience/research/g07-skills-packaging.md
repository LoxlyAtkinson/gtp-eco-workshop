# G07-T02 Skills packaging and install paths

Next action: the owner runs the Claude-apps upload of `campaign-plan.zip` on his own account (G07-T07, held under G07-Q4). That run also settles risk R1.

Checked 2026-10-27 by the G07-T02/T06 builder. Builder-authored; not an independent review.

## 1. Pin

| Item | Value |
|---|---|
| Repository | `https://github.com/anthropics/knowledge-work-plugins` (GitHub API: default branch `main`, licence `Apache-2.0`) |
| Pinned commit | `c71b6f3082b1e5ace3d1a9e30ac9205934134c9c` (2026-09-21T18:25:14Z, "Fix plugin install command in per-plugin READMEs") |
| Why this commit | It is the newest commit that touches `marketing/` (`gh api repos/anthropics/knowledge-work-plugins/commits?path=marketing`). `main` HEAD at check time was `d9d8e1331e45e87e36792040e840da4fc6260b4b` (2026-10-27T18:30:18Z); `marketing/` has not changed between the pin and HEAD. |
| Pinned folder | <https://github.com/anthropics/knowledge-work-plugins/tree/c71b6f3082b1e5ace3d1a9e30ac9205934134c9c/marketing> |
| Method | `git sparse-checkout set --cone marketing`, `git fetch --depth 1 --filter=blob:none origin <sha>`, `git checkout FETCH_HEAD`, into a new empty folder outside the project. Nothing from the checkout was executed. |

## 2. Upstream files at the pin (sha256)

| Path | Bytes | sha256 |
|---|---:|---|
| `LICENSE` (repo root) | 11607 | `a6946284993aeec75c7d75906064b66210c46051e562077efb30eb6dcfe72e26` |
| `README.md` (repo root) | 6109 | `6db45ae725346e38fa0b6b921aba4fe8489c4d9735986876d366ba5768010b14` |
| `marketing/.claude-plugin/plugin.json` | 277 | `efa94746df716ae20e30d7140caea560adb644962757efe9fb1f3dea0e139833` |
| `marketing/.mcp.json` | 1260 | `2099579862ab8d7e62dd502f146cc398dcf6566d001706779c83e2e70a4021cd` |
| `marketing/CONNECTORS.md` | 1260 | `e85d04dde99b220ba438cf1345212e7414da536fb7d781d83a4ad57270586630` |
| `marketing/LICENSE` | 11358 | `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30` |
| `marketing/README.md` | 4531 | `fbb0f36f1c1c1d58c69a40ab90702e683702e7767b65857d7f57cbe3d43cfdeb` |
| `marketing/skills/brand-review/SKILL.md` | 12936 | `759f29397a908c32521080247292a4e1c52ac01643bea70ccd6e807e86c1fa4b` |
| `marketing/skills/campaign-plan/SKILL.md` | 14153 | `f0b146074b64ee0fd52f7864e30191eab83878c8c1e3e7cf24754e13c7dbfad3` |
| `marketing/skills/competitive-brief/SKILL.md` | 13150 | `c1e5442facbc3206ac6a77392bef009fe9aff4ba7c2678e2f4118be2f6be82b3` |
| `marketing/skills/content-creation/SKILL.md` | 8830 | `17f0bfd536502a91c760accaa1ae6c0c76c3812973571729664133e282c5dded` |
| `marketing/skills/draft-content/SKILL.md` | 4612 | `0bfe029dcc039ff71a76b0fec3c5d900fba0e447eb9dcd505ab25b14be3577fd` |
| `marketing/skills/email-sequence/SKILL.md` | 10627 | `4303252cbe340b19945b3e58d46430fdf42ea47b3e26d985e3ef1d6da5e36021` |
| `marketing/skills/performance-report/SKILL.md` | 19213 | `997397e23ba5124cdcbbf17e4be9f5cb36f2a2145b5648e02b2852c91c3cc140` |
| `marketing/skills/seo-audit/SKILL.md` | 9526 | `25008ccdda6f4d9b7ba05f11120d0b9cc976c2d0b04f3d86605e63b1a54a8c40` |

- The 8 skill folders are present, and there are no others: brand-review, campaign-plan, competitive-brief, content-creation, draft-content, email-sequence, performance-report, seo-audit. Each folder holds only `SKILL.md`.
- Git blob ids of each SKILL.md are in `experience/evidence/g07-skills-zip/manifest.json`. The build script checks every byte it packs against these ids.

## 3. Licence and NOTICE

1. **Licence is Apache-2.0.** `marketing/LICENSE` is byte-identical to `https://www.apache.org/licenses/LICENSE-2.0.txt`. Fetched 2026-10-27, HTTP 200; both files are 11358 bytes with sha256 `cfc7749b…3d30`.
2. **No NOTICE file exists anywhere in the upstream tree at the pin.** `git ls-tree -r HEAD --name-only | grep -i notice` returns nothing. So Apache 4(d) has no upstream NOTICE text to carry forward.
3. **Anomaly in the root LICENSE.** The root `LICENSE` is the Apache text plus 10 extra lines of unrelated text (they start "Syntax-file, code seperations,code vault…"). We ship `marketing/LICENSE`, which is the clean canonical text. The root file is not shipped.
4. **Apache-2.0 obligations, and how the bundle meets each:**
   - 4(a), give recipients a copy of the licence. `LICENSE` is at the bundle root. Each per-skill zip carries `LICENSE.txt` with the same bytes.
   - 4(b), mark modified files. No upstream file is modified; every SKILL.md is byte-identical.
   - 4(c), keep upstream notices. The SKILL.md files are copied verbatim.
   - 4(d), carry the NOTICE file. Upstream has none. Our `NOTICE.txt` is voluntary attribution: source URL, commit, "unmodified copies", Apache-2.0, and "upstream ships no NOTICE".
   - 6, trademarks. "Anthropic" is used only to describe where the work came from. `NOTICE.txt` says the download is not an Anthropic product and is not endorsed by Anthropic.

## 4. Frontmatter checks against the official limits

| Skill | `name` = folder | description chars | extra keys |
|---|---|---:|---|
| brand-review | yes | 333 | argument-hint |
| campaign-plan | yes | 337 | argument-hint |
| competitive-brief | yes | 305 | argument-hint |
| content-creation | yes | 278 | user-invocable: false |
| draft-content | yes | 323 | argument-hint |
| email-sequence | yes | 343 | argument-hint |
| performance-report | yes | 332 | argument-hint |
| seo-audit | yes | 329 | argument-hint |

- Claude Help Center "How to create custom skills" says the `description` is "200 characters maximum".
- The Claude Platform docs say "Maximum 1,024 characters".
- All 8 descriptions are between 200 and 1,024 characters. See R1.

## 5. Official install steps

### (a) Claude apps upload (lead path, G07-Q1)

Sources:

- "Use skills in Claude", <https://support.claude.com/en/articles/12512180-use-skills-in-claude>. Fetched 2026-10-27 (HTTP 200, title "Use skills in Claude | Claude Help Center"); the page says "Updated this week".
- "How to create custom skills", <https://support.claude.com/en/articles/12512198-how-to-create-custom-skills>. Fetched 2026-10-27; the page says "Updated over a week ago".

Facts from those pages:

| Fact | Quote |
|---|---|
| Plans | "Skills are available for users on Free, Pro, Max, Team, and Enterprise plans." |
| Prerequisite | "This feature requires code execution to be enabled." Individual plans: "Navigate to **Settings > Capabilities** and ensure that **Code execution and file creation** (called **Create and edit files** in the updated Settings layout) is enabled." |
| Upload | "Package your skill folder as a ZIP file." "Navigate to **Customize > Skills**." "click the "+" button, then "+ Create skill"." "Select "Upload a skill."" "Upload a ZIP file containing your skill folder." |
| Turn on or off | "Toggle any skill on or off using the switch next to it." |
| Zip structure | "Ensure the folder name matches your skill's name." "The ZIP should contain the skill folder as its root (not a subfolder)." |
| Common failures | size limit; folder name does not match the skill name; missing skill.md; invalid characters in name or description |

- **One skill per zip.** The docs never say this in so many words. It follows from the rule that the skill folder is the zip root and from "a ZIP file containing your skill folder". So the bundle ships one zip per skill (decision D2).
- **Docs conflict.** The Platform docs page (<https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>, fetched 2026-10-27) still says "Upload your own Skills as zip files through Settings > Features. Available on Pro, Max, Team, and Enterprise plans". The Help Center was updated more recently, so INSTALL.md follows it (decision D5).
- Same Platform page: custom skills on claude.ai are "Individual to each user" and "do not sync across surfaces".

### (b) Claude Code plugin marketplace (secondary path)

Sources:

- Claude Code docs, "Install and manage plugins", <https://code.claude.com/docs/en/discover-plugins>, fetched 2026-10-27.
- Upstream `marketing/README.md` and `.claude-plugin/marketplace.json` at the pin.

Commands, from the upstream README at the pin:

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install marketing@knowledge-work-plugins
```

1. **Marketplace and plugin names.** The upstream `marketplace.json` at the pin names the marketplace `knowledge-work-plugins`. Its plugin `marketing` has source `./marketing`.
2. **Shell and in-session forms.** The docs give `claude plugin marketplace add <owner/repo>` and `claude plugin install <plugin>@<marketplace>` for the shell. In a session the forms are `/plugin marketplace add` and `/plugin install`. The shell install defaults to user scope.
3. **Checking the install.** The docs say: "Type `/` and look for the plugin's skills under its name, in the form `/<plugin>:<skill>`", or run `claude plugin list`. For this plugin, that means `/marketing:campaign-plan`.
4. **Pinning and updates.** The docs allow `#ref` "to pin a branch or tag", but upstream has no tag at the pin, so this route cannot be pinned to `c71b6f3`. Auto-update is off by default for `knowledge-work-plugins`.
5. **What else the plugin installs.** The plugin route also installs `.mcp.json`, which holds 13 connector entries: slack, canva, figma, hubspot, amplitude, amplitude-eu, notion, ahrefs, similarweb, klaviyo, supermetrics, google calendar, gmail. The zip route ships only the 8 SKILL.md files.
6. **Manual Claude Code install (not in INSTALL.md).** Copy the folders under `marketing-skills/` into `~/.claude/skills/`. Source: Platform docs, "place them in `~/.claude/skills/` (personal) or `.claude/skills/` (project)".

## 6. Zip layout (built by `scripts/build-skills-zip.mjs`, G07-T06)

```
skills/downloads/anthropic-marketing-skills.zip
  INSTALL.md            3-step guide (Claude apps lead; Claude Code optional)
  LICENSE               = marketing/LICENSE, byte-identical
  NOTICE.txt            attribution, pinned sha, unmodified, Apache-2.0, "no upstream NOTICE"
  SOURCE.md             link at the pinned sha + per-file sha256
  marketing-skills/<8 skill folders>/SKILL.md   unmodified
  upload-to-claude/<skill>.zip  x8               same bytes as skills/downloads/<skill>.zip
skills/downloads/<skill>.zip  x8   root = <skill>/ : SKILL.md (unmodified), LICENSE.txt, NOTICE.txt
skills/downloads/SHA256SUMS.txt
```

| Output | Bytes | sha256 |
|---|---:|---|
| anthropic-marketing-skills.zip | 125080 | `f559c90e5773b2b30b56e2072c1af4012f133694c6fea8b67c346857a69c8029` |
| brand-review.zip | 10531 | `b60c976a3818a1f1d6e875bfd55d98fcbfb76798668712eecc4c12e5b673e4be` |
| campaign-plan.zip | 10654 | `0011b84f4b5b6a4475c76ee82c84f165bf829adf1fcb9afbd56ca3f5966e7dd3` |
| competitive-brief.zip | 10259 | `cb3882e4000237f97c934519b793161ebd7f0702f99fa5eb2391464d7a877a3c` |
| content-creation.zip | 8955 | `0dd262601c2a8c463dbaf2b551843596a9e92cf7be0b65f6748d073715698e1f` |
| draft-content.zip | 7134 | `6d906dc9d1c8239c6f54d8c08ca064ae35540b2dbde16c5e7c4145cda738dded` |
| email-sequence.zip | 9507 | `9bd5e267848c7d67a6d1ef0cee8a0888ed9f2b5a997b354c7b4fb216f9cef8a8` |
| performance-report.zip | 12376 | `fdb7c6f09366fb21bd88b3e737d3dbe1845f9529b4e3e3d7f8f61f812c8c386f` |
| seo-audit.zip | 8942 | `317963b5083f0867c06f9d85529a04b42103ea930d59057bd54ddf0c0947a604` |

The build evidence is in `experience/evidence/g07-skills-zip/`:

- `build-run1.log` and `build-run2.log`
- `zip-listing.txt` (`unzip -l` of all 9 zips)
- `diff-log.txt` (`diff -r` exit 0; `cmp LICENSE` exit 0; per-skill checks)
- `zipfile-test.txt` (Python `testzip` OK × 9)
- `rebuild-compare.txt` (two separate fetches gave identical SHA256SUMS and manifest)
- `manifest.json`

## 7. Decisions (owner asleep; overnight mode; veto in the morning brief)

| ID | Decision | Why |
|---|---|---|
| D1 | Pin `c71b6f3082b1e5ace3d1a9e30ac9205934134c9c` | It is the newest commit touching `marketing/`, and the goal named it |
| D2 | Ship one bundle zip with the per-skill zips nested inside it, and also publish the per-skill zips on their own under `skills/downloads/` | The Help Center rule makes the skill folder the zip root, so there is one skill per upload. Standalone zips spare phone users an unzip step. |
| D3 | Each per-skill zip adds `LICENSE.txt` and `NOTICE.txt` inside the skill folder; SKILL.md is unchanged | Apache 4(a) when a zip travels alone. Upstream ships `LICENSE.txt` inside skill folders elsewhere in the same repo (for example `bio-research/skills/*/LICENSE.txt`). |
| D4 | Ship `marketing/LICENSE`, not the root `LICENSE` | It is the plugin's own licence and is canonical. The root file has 10 stray lines. |
| D5 | INSTALL.md follows the Help Center (Customize > Skills; Free plan included), not the Platform page (Settings > Features) | The Help Center is newer ("Updated this week") |
| D6 | Attribution file is named `NOTICE.txt` and source link file is `SOURCE.md` (the brief said "NOTICE/ATTRIBUTION.md") | These are the names the goal DoD gives |
| D7 | Output paths are `skills/downloads/anthropic-marketing-skills.zip` (brief), not `skills/anthropic-marketing-skills-<sha7>.zip` (goal row T06). The research file is named `g07-skills-packaging.md` (DoD), not `g07-skills-pack.md` (brief). | Follows the caller's paths for outputs and the DoD's names for evidence |
| D8 | Zip timestamps are fixed to the pin's commit time; entries are sorted; deflate level 9; own zip writer (Node built-ins only) | Byte-reproducible builds with no npm dependency |

## 8. Risks and open items

- **R1 (HIGH, open until T07).** Each description is 278-343 characters, but the Help Center says 200 maximum. The Platform docs say 1,024. Extra frontmatter keys (`argument-hint`, `user-invocable`) may also be refused. If the claude.ai upload refuses an unmodified skill, the choices are: (1) make Claude Code the lead path, or (2) ship shortened-description copies, which breaks "unmodified" and needs an owner decision.
- **R2.** `.github/workflows/pages.yml` does not copy `skills/` into `_site` yet. G07-T08 or the release task must add it, or the download will 404 on github.io. Out of scope here because pages.yml is being edited elsewhere.
- **R3.** The install proof on the owner's account is HELD (G07-Q4). INSTALL.md has not been run end to end.
- **R4.** Help Center menu names change often; the Platform page has already drifted. Re-check on the day before the workshop.
