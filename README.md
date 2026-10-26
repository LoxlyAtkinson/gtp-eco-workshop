# GTP ECO workshop

An original 60-minute cinematic ECO web presentation for small-business owners and a participant business-analysis tool. The public presentation and form are static GitHub Pages files; the protected scanner, contact storage, email delivery and admin API are prepared for Supabase Edge Functions/Postgres and Resend.

## Current release state

The current local revision is a 15-scene native-scroll journey with an original ECO compass, fourteen object-led scene handoffs, illustrated ad specimens, a fictional ICP exercise, a brand-voice comparison, a weekly content habit, a 30/60/90 website audit and a local no-network quote preview. This revision has not yet replaced the earlier accepted public deck at c31e608. The Supabase function and migration are prepared but **live data collection is disabled** until the selected `smmartaisolutions` Supabase project is accessible, the Resend sender `loxly@smartaisolutions.co.za` is verified, provider costs are bounded, and end-to-end checks pass. `tool/config.js` has no live API URL. Source files and unit tests do not prove public scan or inbox delivery. GTP is the organiser and records have 30-day expiry with an hourly purge job prepared.

## Local preview

From this folder, run `python -m http.server 8765 --bind 127.0.0.1` and open `http://127.0.0.1:8765/`. The tool is at `/tool/`, the private report shell at `/tool/report/`, and organiser shell at `/tool/admin/`. Without a configured API, the tool explains that scanning is unavailable.

Run `node --test api/*.test.js` with Node 22+ for the existing analysis and protected-flow prototype tests. Run `deno check --node-modules-dir=auto supabase/functions/eco-api/index.ts` for the Supabase function. The full browser, database and provider checks remain required.

## Public deployment

The workflow in `.github/workflows/pages.yml` assembles the presentation, original compass artwork, QR code and `tool/` into the Pages artifact. The public URL is [loxlyatkinson.github.io/gtp-eco-workshop](https://loxlyatkinson.github.io/gtp-eco-workshop/). The closing scene's QR code points to the presentation. The participant tool is clearly labelled as a preview and its submit control is disabled. No backend secret or contact record goes into Pages. The previous static deck was accepted at commit `c31e608`; the cinematic revision needs its own browser and independent acceptance before release.

## Protected Supabase setup

1. Connect the user's `smmartaisolutions` Supabase project, which is not listed by the current CLI login. Inspect its current migrations, extensions, Cron jobs and data before linking this folder. The GTP tables use a separate `gtp_eco_` prefix and Row Level Security.
2. Apply `supabase/migrations/202610230001_gtp_eco.sql`, then install and verify `supabase/retention-job.sql`. Deploy `supabase/functions/eco-api/index.ts` with `verify_jwt = false`; this function enforces exact CORS, report tokens and an admin credential internally. Keep `DATA_COLLECTION_ENABLED=false` until checks pass.
3. Set protected function secrets for `RATE_LIMIT_SALT`, `DAILY_SCAN_LIMIT`, `FIRECRAWL_API_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_TOKEN`, `NOTICE_VERSION`, `FRONTEND_ORIGIN`, `FRONTEND_REPORT_URL`, and optionally `APIFY_API_TOKEN`, `APIFY_ENABLED` and `APIFY_MAX_CHARGE_USD`. Supabase provides its own URL and service-role key to the function. Never commit secret values. Choose the daily scan ceiling from the participant count and provider budget before enabling paid calls.
4. Verify the public notice with GTP's `loxly@smartaisolutions.co.za` contact, Supabase, Firecrawl, Resend and optional Apify, plus 30-day retention. Set `NOTICE_VERSION=gtp-eco-v1-2026-10-23` in the protected function; `tool/tool.js` sends the matching version. The marketing checkbox must remain unchecked.
5. Set the deployed function URL in `tool/config.js`. Restrict `FRONTEND_ORIGIN` to `https://loxlyatkinson.github.io`. Verify CORS, input validation, mobile intake, real source links, inbox delivery, private report, denied/allowed admin, opt-out, deletion and Cron retention.
6. Only after those checks, set `DATA_COLLECTION_ENABLED=true` and publish the final Pages revision. Recheck the live public journey and independent experience verdict.

The earlier Cloudflare Worker files under `api/` are a local prototype and are **not** the selected deployment target. Shared analysis and social-sampling rules currently live there; the Supabase function imports them. Do not deploy both backends.

The scanner checks only bounded public evidence. Candidate competitors need owner confirmation; sampled public social posts are not sales proof. Keyword suggestions are hypotheses without Search Console/search-volume data. The report explicitly marks backlink and AI-answer visibility as unknown when no suitable source is connected.

## Method and sources

The workshop applies ECO: Engage, Convert, Optimize, followed by Attract and Interact. The reference sites linked in the deck are examples for discussion; Oryzo is a fictional/satirical product. The acceptance contract and progress record are in `experience/`.

Provider implementations follow the official [Firecrawl scrape](https://docs.firecrawl.dev/api-reference/endpoint/scrape) and [search](https://docs.firecrawl.dev/api-reference/endpoint/search), [Apify Actor API](https://docs.apify.com/api/v2), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Supabase Edge Functions](https://supabase.com/docs/guides/functions), [Supabase Cron](https://supabase.com/docs/guides/cron), and [GitHub Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) documentation. Verify pricing and service policy in the selected accounts before launch.
