# G06 runtime probe

## Next action for the owner

1. Share one private probe page with a Claude account outside your organisation, once G06-T01 publishes it. That closes the open OC-1 rows below. About 5 minutes.

## §Baseline (G06-T00)

Status: PASSED for the T00 exit criterion: roster, contract version, quickstart result and the "no Tool B" list and grep are recorded. Open check OC-1 is NOT resolved; see §OC-1 desk check. Nothing was published.
Checked: 2026-10-27, 21:01Z to 21:10Z, by the G06-T00 sub-agent.
PROVISIONAL rows relied on (A2.5): none.

### 1. Skills loaded

| Skill | How loaded | What it returned |
|---|---|---|
| `artifact-capabilities` | Skill tool, 2026-10-27 ~21:04Z | Bundled at `C:/Users/loxly/AppData/Local/Temp/claude/bundled-skills/2.1.308/192aec36d74e1a5b806c16f25dadd3c7/artifact-capabilities` with type folders `0.2.47/` and `0.2.91/` |
| `artifact-design` | Skill tool, same batch | Page contract and design guidance. The quickstart result below repeats the same text ("It is the `artifact-design` skill's own text") |

### 2. Capability roster and runtime contract (this account, this session)

- **Roster served:** `artifact`, `assets`, `comments`, `db`, `downloads`, `mcp`, `room`, `sample`, `self`, `user`. Built in, never declared: `permissions`. The skill says: "Anything not listed is unavailable to this user."
- **Runtime contract:** the guidance is "pinned to runtime contract 0.2.47 — the contract the target artifact `6e96eb11-2c97-4f1e-a50f-555c874c237e` currently runs". The bundle also ships `0.2.91/` type files. Those add `files.d.ts`, and in `sample.d.ts` the options `model`, `effort`, `fast` and the manifest rule `capabilities: {sample: {images: true}}` for images.
- **Not determined:** which contract a NEW Tool B artifact will run. The tool only says `contract: 'latest'` upgrades and that omitting it keeps the current pin. T01's probe must read this back.
- **Drift from goal-06 §2** (written earlier the same day): the goal says contract `0.2.91` and a roster that includes `files`. Today's served roster has no `files`, and the guidance is pinned to `0.2.47`. Re-sync goal-06 §2 text in the bundle-sync task. Tool B's plan does not depend on `files`.
- **Type-file hashes (0.2.47):** `sample.d.ts` `aff7f58ecbe77359d179b9a103f4572dd40b98ada302e8c3fc8a4c8807fd256f`, `claude.d.ts` `54bfa849203cd184725473e365669e501612a826a13651c531d5d01c7ad8ae42`, `permissions.d.ts` `fef0dadf5ffe78dec1ebfb32a5ab1d10bbab79aab9d2098cb7c74e637993b1c9`, `user.d.ts` `52c77301563b9490f48498159bbf5c906bfdfde4c4b3533ed9998d5957f20c3f`. 0.2.91 `sample.d.ts` `870e9102bca5546be1af1674ba8da920c7cefbc0430f431ad617517b86eba109`.

### 3. Artifact `quickstart` (intent "other")

- **Published types (5, all [core]):**
  - Dashboard `https://claude.ai/artifact/GZLZthZ2sQjn7T16skfdeF`
  - Design `https://claude.ai/artifact/QKN21svewxgyPb6SYRqWnd`
  - Design System `https://claude.ai/artifact/5M7UeXXcx16TP3vzVFNDzd`
  - Docs `https://claude.ai/artifact/Rp9naXUCj2xozpUkyQy19W`
  - Slides `https://claude.ai/artifact/8jTsAFQMFDb2oA8MsPJ2eL`
- **Fit for Tool B:** none. Tool B is a questionnaire, a data view and a Claude-powered generator, so it is a plain page with declared capabilities. The Design System type is still the kit FORMAT (T1-b), as goal-06 T02 plans.
- **Design System type URL:** matches goal-06 §2 and `skill-orchestration.md:136`.
- **Design systems this user can open (1):** "(mine) Amberkloof", `https://claude.ai/artifact/Ef41LWvyrcRgSgfs5ybzWR`. Its description: "Brand guideline for the invented botanical body-care brand Amberkloof, built from its current content for the GTP workshop demo". No default is marked.

### 4. Does a Tool B already exist?

- **Artifact `list` (mine, limit 50):** 24 artifacts. None is a Tool B page, an ICP scanner, a brand-kit tool or an OC-1 probe. The only GTP-related one is the Amberkloof Design System above, updated 2026-10-27. It is the hero-brand kit (a G06-T08-style output), not Tool B. This check did not establish which task made it.
- **Repo:** there is no `tool-b/`, `tool_b/` or `toolb/` folder. A grep of code files (`*.html`, `*.js`, `*.mjs`, `*.css`, `*.json`, outside `experience/`, `.claude/`, `vendor/`, `node_modules/`) for "tool-b", "Tool B", "toolB", "ICP scanner" and "brand kit" returned 0 files.
- **Conclusion:** no Tool B exists.

### 5. Design tokens, palette and spine

- **`design-system.md`** (sha256 `615f9ce1fbd0007e5403f1ac15cbc939110c5cab351b78bfb646279d5fd9011d`):
  - Core palette: night `#0d1714`, cream `#f3ead8`, mint `#91d8bd`, copper `#e5a46f`, paper `#f5f1e8`, ink `#171b1b`.
  - Chapter colours: Engage green, Convert warm copper, Optimize blue, Attract green/cream.
  - Type: Manrope for headings and controls, DM Sans for body.
- **G14** (`experience/grill-decisions-2026-10-27.md`, sha256 `b11d38284410b804be4c8cf3bb2d3a353f9d9741fa27e6e6c99aad9e40a6bea2`), verbatim: "**Warm R5 studio for product/ad scenes, green and cream for ECO teaching scenes,** with scroll colour bridges marking chapters."
- **`experience/story-spine.md`:** EXISTS, 118363 B, sha256 `de982bf9704f372df385c46fd7d1df7428df08b35e6f8247460f910712749902`.
  - Hero brand §1: "Amberkloof: small-batch botanical body care, Pretoria East".
  - B2B swap-in: "Tumelo Print & Pack (Johannesburg)".
  - The spine's D-rows are PROVISIONAL (A1.2).

## §OC-1 desk check (from the served contract text and one web search; no probe published)

A1.12: an "unknown" result blocks. Rows marked UNKNOWN block G06-T01 and OG-CLAUDE-PAGE question 1 until T01's probe answers them.

| # | Question | Answer so far | Basis | Status |
|---|---|---|---|---|
| 1 | Whose usage does a participant's `sample` call spend? | The participant's own Claude usage, not the owner's | `sample.d.ts` (0.2.47) lines 2-3 "on the viewer's own Claude account" and 44-45 "spends the VIEWER's own Claude usage"; skill text "Viewer pays". A help-centre search result says usage "counts against each user's own Claude subscription limits" (support.claude.com 9547008; search summary, page not fetched) | KNOWN (contract) |
| 2 | Consent | The first `sample` call in each page view shows a consent dialog and waits. Decline gives `not_granted` for the rest of that view, and the next load asks again. The participant's organisation can also block it (`not_granted`) | `sample.d.ts` 38-47, 571-572; `permissions.d.ts` 22-24 | KNOWN (contract) |
| 3 | Does a participant need a Claude account and to be signed in? | For AI features, yes as far as the evidence goes: calls spend the viewer's own account, and `session_expired` means "the viewer must sign in again". Search result: viewers can open a published artifact without signing up and "are prompted to sign up only for advanced features like using AI-powered capabilities" | `sample.d.ts` 592; support.claude.com 9547008 (search summary, not fetched) | MOSTLY KNOWN. What a signed-out view actually shows (sign-in prompt, `null`, or a rejection) is UNKNOWN until observed |
| 4 | Can a participant OUTSIDE the owner's organisation open the page and use Claude on it? Which sharing modes exist for this account? | Conflicting sources. code.claude.com/docs/en/artifacts reportedly says a public link lets anyone open it with no sign-in, and that on Pro/Max plans a public link is the only way to share. Another page of the same docs reportedly says viewers must sign in as a member of the publishing organisation, with no option outside it. The contract's `user` capability reads outside-organisation viewers as absent, and `assets`, full `comments` and `mcp` make a page organisation-internal. Nothing in the contract says that about `sample` | Search summary (not fetched), contract text | UNKNOWN, BLOCKS. The owner's plan type (Pro/Max vs Team/Enterprise) and the sharing modes for a `sample` page must be observed |
| 5 | Can a free-plan Claude account call `sample`? | Not documented. The contract mentions plan-dependent model tiers and `sampling_disabled` ("Claude is not available for this account or organization") | `sample.d.ts` 332, 487-488, 573-574 | UNKNOWN, BLOCKS (it matters for a room of small-business owners, many likely on free plans) |
| 6 | Rate limits for a room of phones | Per viewer: "a couple of calls run at once … a few more wait their turn, and a flood rejects `rate_limited`", plus the viewer's own usage limit. Because each participant spends their own usage, there is no documented shared quota on the owner. A per-artifact aggregate limit is not documented | `sample.d.ts` 51-53, 587-591 | KNOWN per viewer; per-artifact aggregate UNKNOWN (minor) |
| 7 | Where must the page be opened? | Inside a Claude viewer (claude.ai or the Claude apps). A copy served top-level on the artifact host has every `use()` resolving `null` "for now", and any other copy has no `window.claude` | `sample.d.ts` 29-37, `claude.d.ts` 16-20 | KNOWN |
| 8 | Images (screenshots and logos for the brand scan) | Check `sample.limits().images`. On 0.2.91 the manifest must declare `{sample: {images: true}}` | `sample.d.ts` (both versions) | KNOWN, contract-dependent (see §2) |

**OC-1 verdict:** NOT RESOLVED. Rows 1, 2 and 7 are known from the contract. Rows 3 to 5 are unknown or conflicting, and per A1.12 they block G06-T01 and OG-CLAUDE-PAGE Q1. T01's probe (publish a private probe, then open it signed out, as a non-organisation account and on a phone) is the path to close them. It needs the owner to share the probe with one outside test account.

Sources (web search, 2026-10-27; result summaries only, pages not fetched):
- [Publish and share artifacts (Claude Help Center)](https://support.claude.com/en/articles/9547008-publish-and-share-artifacts)
- [What are artifacts and how do I use them (Claude Help Center)](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Artifacts (Claude Code docs)](https://code.claude.com/docs/en/artifacts)

## Decisions (PROVISIONAL, builder)

| ID | Decision | Why |
|---|---|---|
| G06-T00-D1 | Tool B is a plain artifact page with declared capabilities, not a page made from a listed type | None of the 5 listed types hosts a questionnaire plus Claude calls, and type-made artifacts take the type's capabilities (goal-06 §2) |
| G06-T00-D2 | Treat contract 0.2.47 as the floor for design: no `files`, images gated by `limits()`. Read back the contract a new artifact actually gets in T01 | The roster served today has no `files`; the pin is 0.2.47 |
| G06-T00-D3 | Treat Amberkloof `Ef41LWvyrcRgSgfs5ybzWR` as the candidate hero Design System for T08. Verify it in T02/T08 (made from the type? which task? which story-spine sha?) before relying on it | It exists and matches the spine's hero brand, but it has no task receipt here |
