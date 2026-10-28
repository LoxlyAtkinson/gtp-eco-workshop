# Owner feedback 2026-10-28 ~04:00 (binding; A1.8 amendment protocol)

Source: the owner's chat message at ~04:00, reviewing the CURRENT live deck (old Amina scenes 04-07). The directives below keep his words and his meaning.

## Global
1. "make sure that the language is correct. So use the slop monster": every visible line goes through slopmonster (deslop.py 5/5, rival cleanse where possible).
2. "think in terms of how people would read things as they see the presentation": every headline must be understood at first glance, with no insider phrasing.
3. Slides 1-3 (Amberkloof): "all that really is needed there is to polish up the design. There's a lot of text overflow. There's a lot of blandness". Fix the overflow and add visual richness, but keep the content.

## Engage chapter teaching intent (carry into the rebuilt scenes, whatever their new form)
4. Channel/buying-moment: make the meaning explicit. Example point: "6 out of 10 orders came through Google search, so the answer and the quote should live on the page." Say it that plainly.
5. "Original feed post": make its purpose obvious (good example vs where the inquiry came from). Use a real generated image ("create an actual thing that looks good").
6. Competitor slide: it must clearly be competitive analysis AND show "we use AI in order to do competitor analysis".
7. Formats: search results = online/Google; short video = TikTok/Instagram; feed post = still image. Generate the 8 s vertical storyboard as a real video.
8. "receipts can only tell you what's sold, but it cannot tell you who made the decision to buy. So that's how you create a persona."
9. Renames:
   - "Engage: who" becomes "Who's making the decision?"
   - "Engage: what" becomes "What are they asking?" (how did they find you, what are they asking)
   - "Interact" becomes "Interact with the correct answer"
10. The get-details, tailor-quote, agree-follow-up illustration "will only work on a website ... not on a social media ad. We need to say that".
11. The "image catches the eye, words earn the reply" slide is about OWN VOICE. Teach how to keep your voice, and how to teach AI to talk like you and follow your brand.
12. Rewrite the human edit in "AI drafts faster, you make it yours" so a normal reply reads naturally ("We'll confirm what travels well" is unclear). Never write "how much lunch for 20"; say "20 people" in full.
13. The week strip is wrong. Listen, write the question, draft with AI, check, publish in your voice, measure: that takes minutes, "not a week worth of work". Show it as one quick loop.
14. "One useful answer can live longer than a post ... searchable FAQ" was not understood. Explain it plainly or cut it.
15. Website 90-day:
    - Plan content for 90 days, then adjust as the market shifts.
    - It starts with the website: blogs and landing pages.
    - Research what people search for in AI and Google SEO, and what they rank for.
    - Put the answer near the top so people AND AI find it fast.
    - Measure and refresh: SEO takes time to sink in.
    - Unpaid ads die, and attention fades when people stop seeing you.
    - No engagement means you lose the customer; engagement without conversion is "even worse".
16. The owner offered to generate images himself from prompts. Keep the full prompt per slot in assets/gen/MANIFEST.md.
17. (~04:20) "we didn't even need to generate videos ... We just need to show them what good looks like ... find videos ... take from those Pinterest URLs ... as well as that Instagram URL". Implementation:
    - In the LOCAL stage deck, use the downloaded reference clips R1-R5 (experience/research/*/, git-ignored) as the "What good looks like" examples, each credited on screen to its creator or source.
    - Do NOT relabel them as another brand; that would misrepresent the creators' work.
    - Do NOT ship them in the public github.io build (G6, no re-hosting). The public build uses links or embeds instead.
    - The 6 ElevenLabs clips in assets/gen/ stay available as Amberkloof examples where they help.

## Live stage and skills decisions (2026-10-28 ~09:40, owner via AskUserQuestion)
18. Audience flow: the owner presents from his laptop; the audience follows the PUBLIC GitHub page, scans the QR or clicks the link there, a form POPS UP, they type their website and submit. The presenter presses Retrieve (websites populate with an "amazing animation"), Choose Website (back-to-front drum spins, random winner), Scan, and so on.
19. Supabase project = "SAIS Website" (ref efkgdafxzbsdhjbspavs), owner-approved. Tables stage_submissions (anon insert only) and skills_requests (RLS on, no anon policies) were created 09:40. Keys live only in the git-ignored .env.local (DataForSEO login/password, Supabase URL/anon/service/access token). No Apify key was found in the owner's .env files; the Apify plugin shows "needs authentication".
20. Skills pack: the main download stays the 8 official Anthropic marketing skills. A SEPARATE special link gives access to three more skills (slopmonster, last30days, competitor-analysis), stored in a SEPARATE Supabase bucket and renamed with a "Smart" prefix (owner example: SmartMarketScan). Before shipping: keep each original licence and credit inside the renamed zip; any skill without a licence that allows sharing is left out and reported.

## Feedback ~09:55 (owner, binding)
21. Presenter assistant: "Mic in the deck + Jev drives" (owner choice). The deck listens through the laptop mic (Chrome speech-to-text), matches the owner's words to cues taken from presentation-script.md and brings in the right transition or reveal; Jev Ultrafast (C:/Users/loxly/.agents/tools/jev/, start-ultrafast.ps1) opens and runs the localhost deck in the background. "Train it" = the cue map per scene from the script.
22. Replace every 2D, paper-cut-out looking picture with real-looking images. Examples: the gift/present box at "Keep learning" (keep the animation, the box must look real); the drawn bottle in the scene 11 Average/Good pair.
23. Every Amberkloof bottle in photos must carry the actual Amberkloof label; the good-looking AI images must show the name on the product.
24. Make an actual product video for the Amberkloof marula oil: a proper 3D look with floating objects around it.
25. Scene 09: remove Slack (not a South African channel).
26. The Instagram reel must never open off-site: play the downloaded clip (stage) or a generated equivalent.
27. Keep: the shop animation and the move-in; the Keep learning animation.
28. Images: owner says Codex is linked to an OLD account; re-run Codex OAuth to his current account and use Codex for the images. Apify key: owner pastes APIFY_API_TOKEN into .env.local himself.
