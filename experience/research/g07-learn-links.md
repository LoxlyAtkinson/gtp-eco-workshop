# G07-T04 Where to keep learning: verified websites

Next action: G07-T08 copies these 12 links into `skills/index.html`, grouped by stage. G07-T11 uses the same list for the final scene.

All links were checked on 2026-10-27 by the G07-T04 builder. The `fact-checker-loxly` pass ran on 2026-10-27 (report: `experience/evidence/g07-learn-factcheck/fact-check-report.md`). It found 0 FALSE and 0 UNVERIFIABLE verdicts on the 12 listed links after 5 wording fixes (rows 2, 3, 6 and 7), each re-verified in a headless browser.

How each link was checked:

- `curl -sSL` with a desktop browser user agent, following redirects. We recorded the HTTP status, the final URL and the page `<title>`.
- Meta and WhatsApp return 400 to curl, so those two were opened in Playwright (Chromium). The status comes from `performance.getEntriesByType('navigation')[0].responseStatus`.
- Every cost statement is quoted from an official page. Where the main page does not state its cost, the quote comes from a second official page, and that page is named.

## Engage: get attention and start conversations

| # | Site | Final URL | HTTP / title observed | What it gives | Cost (source quote) | Why it helps a South African small business |
|---|---|---|---|---|---|---|
| 1 | Meta Blueprint | <https://www.facebook.com/business/learn> | 200 (browser) / "Meta Blueprint: Free online training for advertising on Facebook \| Meta for Business" | Self-paced courses, live webinars and videos for Facebook, Messenger, Instagram and WhatsApp | Free: "Explore free online courses, live webinars and videos" (same page). Certification exam prices not checked | Facebook, Instagram and WhatsApp are where most local customers already are |
| 2 | WhatsApp Business app | <https://whatsappbusiness.com/products/business-app/> (requested `business.whatsapp.com/products/business-app`; it redirects) | 200 (browser) / "WhatsApp Business App \| Connect to customers, grow your business" | Business profile, product showcase, and greeting and away messages, "built with the small business owner in mind" | Free to download: "WhatsApp Business is a free-to-download app" (Google Play listing <https://play.google.com/store/apps/details?id=com.whatsapp.w4b&hl=en_ZA>, 200, "WhatsApp Business – Apps on Google Play") | Customers ask, quote and order over WhatsApp. The app turns those chats into a shop counter |

## Convert: turn attention into enquiries and sales

| # | Site | Final URL | HTTP / title observed | What it gives | Cost (source quote) | Why it helps a South African small business |
|---|---|---|---|---|---|---|
| 3 | HubSpot Academy | <https://academy.hubspot.com/> | 200 / "HubSpot Academy - Homepage" (rendered title; plain curl returned "HubSpot Academy") | Courses in inbound, email marketing, content marketing, social media marketing and digital marketing | Free: "Get up to speed quickly on popular business topics with our free courses." (same page) | Step-by-step lessons on turning followers into leads and leads into sales, with no tool purchase needed |
| 4 | Google Skillshop | <https://skillshop.withgoogle.com/> | 200 / "Skillshop" | Google's own training and certifications for Google Ads, Analytics and Business Profile | No cost: "Access to the Skillshop platform, awards and most certifications are available at no cost." (Skillshop Help FAQ <https://support.google.com/skillshop/answer/7378254?hl=en>, 200, "FAQs Skillshop Other Topics - Skillshop Help") | Learn to run small, targeted Google Ads so people searching nearby find and call you |

## Optimize: learn what worked, why, and for whom

| # | Site | Final URL | HTTP / title observed | What it gives | Cost (source quote) | Why it helps a South African small business |
|---|---|---|---|---|---|---|
| 5 | Google Search Console Help | <https://support.google.com/webmasters/> | 200 / "Search Console Help" | How to see which searches bring people to your site and fix what blocks them | Free: "Google Search Console is a free service offered by Google" (<https://support.google.com/webmasters/answer/9128668>, 200, "About Search Console - Search Console Help") | Shows what customers actually typed to find you, so you write more of what works |
| 6 | Google Analytics Academy (on Skillshop) | <https://support.google.com/analytics/answer/15068052> (requested `analytics.google.com/analytics/academy/`; it redirects) | 200 / "Enroll in Analytics Academy courses on Skillshop - Analytics Help" | Four Google Analytics courses, from 101 "Get started using Google Analytics (GA)" (Beginner) to 301 "Use GA with other tools and data sources" (Advanced) | Free: "free e-learning courses designed by Analytics experts" (same page) | Learn to read your website numbers and judge which post, ad or channel paid off |

## Attract and Interact: be found, look good, invite people in

| # | Site | Final URL | HTTP / title observed | What it gives | Cost (source quote) | Why it helps a South African small business |
|---|---|---|---|---|---|---|
| 7 | Google Business Profile | <https://business.google.com/en-all/business-profile/> (requested `www.google.com/business/`; it redirects). Help: <https://support.google.com/business/> (200, "Google Business Profile Help") | 200 / "Get Listed on Google - Google Business Profile" | A listing on Google Search and Maps with photos, reviews, orders, reservations and bookings. The Help Center covers verifying the listing, replying to reviews and improving the profile's performance | Free: "Stand out on Google with a free Business Profile" (same page) | "Near me" searches decide which shop people walk into. Photos and reviews are the shop window |
| 8 | Grow with Google (Africa) | <https://grow.google/intl/ssa-en/> | 200 / "Grow with Google - Courses & Tools to Grow Your Business or Career" | Hustle Academy (live training and masterclasses), the Business Profile marketing kit (posters and social posts made from your reviews), and the "Grow with Google in Africa" section | Free bootcamp and kit: "our free week-long bootcamp"; "Free marketing kit from Business Profile" (same page) | Google's Africa programme. It turns your Google reviews into ready-made posts |

## AI skills and responsible AI

| # | Site | Final URL | HTTP / title observed | What it gives | Cost (source quote) | Why it helps a South African small business |
|---|---|---|---|---|---|---|
| 9 | Claude Academy (Anthropic) | <https://academy.claude.com/> (requested `www.anthropic.com/learn`; it redirects) | 200 / "Claude Academy · Learn to work and build with Claude" | Courses such as "AI Fluency: Framework and foundations" and "AI capabilities and limitations" | Free: "Free courses, tutorials, and use cases" (same page) | Learn to use AI well and safely before trusting it with customer-facing copy |
| 10 | Claude Help Center: Use skills in Claude | <https://support.claude.com/en/articles/12512180-use-skills-in-claude> | 200 / "Use skills in Claude \| Claude Help Center" | Official steps to switch on, upload and toggle skills, including the marketing skills in our download | The free plan is included: "Skills are available for users on Free, Pro, Max, Team, and Enterprise plans." (same page) | The current, official version of our 3-step install guide, for when menus change |
| 11 | Information Regulator: Guidance Notes (POPIA) | <https://inforegulator.org.za/guidance-notes/> | 200 / "Guidance Notes -" | Includes the "Guidance note on direct marketing in terms of the Protection Of Personal Information Act of 2013 (POPIA)", dated 03 December 2024, covering unsolicited electronic marketing under section 69 | Free to read. The site belongs to the regulator that "monitor[s] and enforce[s] compliance" with POPIA (home page <https://inforegulator.org.za/>, 200) | South African law on WhatsApp, SMS and email marketing to customers, and on what customer data you may give an AI tool |

## Support across all stages

| # | Site | Final URL | HTTP / title observed | What it gives | Cost (source quote) | Why it helps a South African small business |
|---|---|---|---|---|---|---|
| 12 | SEDFA (Small Enterprise Development and Finance Agency) | <https://www.sedfa.org.za/> | 200 / "Small Enterprise Development and Finance Agency (SEDFA)" | The government agency formed on 1 October 2024 from Seda and sefa. It offers business development (formalisation, marketing, business plans), the Enterprise Coaching Programme, Empretec training, branch support and an online eThuse account | Free account: "Create Your Free Online SEDFA Account". The page does not price branch services; ask the branch | The national, in-person help for small businesses, including marketing and business plans |

## Checked and not listed

| Candidate | Observed 2026-10-27 | Why not listed |
|---|---|---|
| `https://www.seda.org.za/` | curl: connection reset (no HTTP status) | Seda merged into SEDFA on 1 October 2024 (SEDFA home page); #12 replaces it |
| `https://www.dsbd.gov.za/` | 200 / "Department of Small Business Development – Igniting the Spirit of Entrepreneurship" | A policy department, not a learning resource; SEDFA is its delivery agency |
| `https://anthropic.skilljar.com/` | 200 / "Anthropic Courses" | Course host. `academy.claude.com` is the front door that `anthropic.com/learn` now redirects to |
| `https://learndigital.withgoogle.com/digitalskillsforafrica` | 200, redirects to `https://grow.google/intl/ssa-en/` | Same as #8 |
| The owner's own support channel | not checked | G07-Q2: not listed by default; HELD for the owner to add |

## Mapping notes

- Stages follow the deck's ECO journey: Engage > Convert > Optimize > Attract > Interact > Responsible AI (`experience/story-spine.md`). Attract and Interact share one group. AI skills and responsible AI share one group.
- Sites 1, 2, 7 and 8 also fit a second stage. Each is placed under the stage where it teaches the most.
- The criteria are: free or low cost, current, and useful to a South African small business. Each of the 12 links is free to use or read; the Meta certification exam price was not checked.
- Re-check every link within 7 days of the workshop. Menus and redirects drift; for example, `anthropic.com/learn` and `business.whatsapp.com` both redirect today.
