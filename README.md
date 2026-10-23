# GTP ECO workshop

An original 60-minute web presentation for small-business owners and a participant business-analysis tool. The public presentation and form are static GitHub Pages files; the protected scanner, contact storage, email delivery and admin API are a separate Cloudflare Worker.

## Current release state

The presentation and participant interfaces run locally. The protected Worker is implemented but **live data collection is disabled** until the organiser identity, notice, retention, accounts, service costs and end-to-end checks are completed. `tool/config.js` has no live API URL. Source files and unit tests do not prove public scan or inbox delivery.

## Local preview

From this folder, run `python -m http.server 8765 --bind 127.0.0.1` and open `http://127.0.0.1:8765/`. The tool is at `/tool/`, the private report shell at `/tool/report/`, and organiser shell at `/tool/admin/`. Without a configured API, the tool explains that scanning is unavailable.

Run `node --test api/*.test.js` with Node 22+ for the analysis and protected-flow tests. The full browser and provider checks remain required.

## Public deployment

The workflow in `.github/workflows/pages.yml` assembles only the presentation and `tool/` into the Pages artifact. The intended URL is `https://loxlyatkinson.github.io/gtp-eco-workshop/`; it must be verified after the dedicated repository and GitHub Pages are created. No backend secret or contact record goes into Pages.

## Protected Worker setup

1. Create a Cloudflare D1 database and copy `api/wrangler.example.toml` to `api/wrangler.toml`, inserting the real database ID. Keep `DATA_COLLECTION_ENABLED = "false"` while preparing.
2. Apply `api/schema.sql` to the D1 database and deploy `api/worker.js` through Wrangler. Configure encrypted secrets for `RATE_LIMIT_SALT`, `FIRECRAWL_API_KEY`, `RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_TOKEN`, and optionally `APIFY_API_TOKEN`. Set an Apify charge ceiling if enabling its sampled public-post adapter. Check service accounts and spending before enabling any paid call.
3. Complete the public privacy notice with organiser identity, contact, processors and retention; update `NOTICE_VERSION` and the matching value in `tool/tool.js`. The marketing checkbox must remain unchecked by default.
4. Set the deployed Worker origin in `tool/config.js` and restrict `FRONTEND_ORIGIN` to `https://loxlyatkinson.github.io`. Verify CORS, input validation, mobile intake, real source links, inbox delivery, private report, denied/allowed admin, opt-out, deletion and retention.
5. Only after those checks, set `DATA_COLLECTION_ENABLED = "true"` and publish the final Pages revision. Recheck the live public journey and independent experience verdict.

The scanner checks only bounded public evidence. Candidate competitors need owner confirmation; sampled public social posts are not sales proof. Keyword suggestions are hypotheses without Search Console/search-volume data. The report explicitly marks backlink and AI-answer visibility as unknown when no suitable source is connected.

## Method and sources

The workshop applies ECO: Engage, Convert, Optimize, followed by Attract and Interact. The reference sites linked in the deck are examples for discussion; Oryzo is a fictional/satirical product. The acceptance contract and progress record are in `experience/`.

Provider implementations follow the official [Firecrawl scrape](https://docs.firecrawl.dev/api-reference/endpoint/scrape) and [search](https://docs.firecrawl.dev/api-reference/endpoint/search), [Apify Actor API](https://docs.apify.com/api/v2), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Cloudflare D1 and secrets](https://developers.cloudflare.com/workers/wrangler/configuration/), and [GitHub Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) documentation. Verify pricing and service policy in the selected accounts before launch.
