Next action (you, about 10 minutes): download the WhatsApp, Facebook, Instagram and LinkedIn logo packs yourself (section 3), because each download accepts the brand's terms in your name.

# G02-T03: platform logos and real ad examples

Date: 2026-10-27. Owner rules: G5 (official logos, crisp, unmodified) and G6 (real ads shown only through their public source, with attribution, never re-hosted).

## 1. Where things stand

1. Logos: 1 of 7 is ready (Google G). TikTok's file is saved, but TikTok's rules forbid showing it without their written permission. The other 5 are blocked by a terms or account step that only you can take.
2. Ads:
   - **9 real brand ads with an official embed**, each tested rendering at `http://localhost:8765` (section 4A). All are South African.
     - 8 are YouTube embeds and 1 is a TikTok embed.
     - 6 are body care and 3 are print and labels.
     - These are the ones that count toward the ≥4 (A2.7).
   - The 8 Meta Ad Library ads in section 4B are link-only. They stay listed as attribution and backup, but **do not count**.
   - No image or video was saved or re-hosted.
3. Full per-logo sources, file hashes and rules: `assets/logos/SOURCES.md`.

## 2. Logos

| # | Platform | File | Source page | Rules summary | Status |
|---|---|---|---|---|---|
| 1 | WhatsApp | none | https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/ | No changes, no recolouring. Must not be the most prominent thing on the page. No endorsement implied. | BLOCKED: "I have read and accept..." checkbox before download |
| 2 | Facebook | none | https://www.meta.com/brand/resources/facebook/logo/ | Clear space = 1/4 of the logo's width. Minimum 16 px on screen, 6 mm in print. Blue with white "f", or the white version. No effects, no recolouring. | BLOCKED: same checkbox |
| 3 | Instagram | none | https://www.meta.com/brand/resources/instagram/instagram-brand/ | Official files only, no changes. Permission needed for broadcast, out-of-home, or print larger than A4. Not in the same spot as other social networks unless it is a general "Follow us on..." line. | BLOCKED: same checkbox |
| 4 | TikTok | `assets/logos/tiktok.png` (staged) | https://developers.tiktok.com/doc/getting-started-design-guidelines and https://www.tiktokbrandhub.com/legal | Logo needs TikTok's prior written permission. The word "TikTok" may be used freely to name the platform. The staged icon is from 2020 and the logo has been refined since. | BLOCKED FOR USE: written permission needed |
| 5 | LinkedIn | none | https://brand.linkedin.com/downloads | Blue, black or white only, preferably blue on white. No changes to colour or shape. Other uses go through trademarkrequest@linkedin.com. Notice: "LinkedIn logo © LinkedIn Corporation". | BLOCKED: downloading counts as accepting the Brand and User Agreements |
| 6 | Google Business Profile | none | https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ | Product icons are released only to Partner Marketing Hub accounts, through an approval form. | BLOCKED: account plus approval request |
| 7 | Google G (Search) | `assets/logos/google-g.png` (2820 x 2820 PNG, sha256 `4d5cfbd8…c882a6`) | same Google page as row 6 | Newest gradient G only, full colour, on white or black. Clear space on every side = the width of the G. No changes. Allowed in classroom teaching material that is not used for marketing or business purposes. | OK (see decision 5) |

## 3. Your steps for the blocked logos (about 15 minutes in total)

1. WhatsApp (2 min): open https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/, tick "I have read and accept...", click Download under "Logo pack", and save the ZIP to `assets/logos/_incoming/`.
2. Facebook (2 min): do the same at https://www.meta.com/brand/resources/facebook/logo/.
3. Instagram (2 min): do the same at https://www.meta.com/brand/resources/instagram/instagram-brand/.
4. LinkedIn (2 min): read the agreements linked at https://brand.linkedin.com/downloads, click "[in] Logo", and save the ZIP to `assets/logos/_incoming/`.
5. TikTok (2 min to decide): either request written permission through https://www.tiktokbrandhub.com (Log in), or tell the builder to show "TikTok" as text in the deck's own type and delete `assets/logos/tiktok.png`.
6. Google Business Profile (5 min to apply, approval time unknown): create an account at https://partnermarketinghub.withgoogle.com/signup/ and request the Business Profile product icon. Until it arrives, use the Google G with the words "Business Profile" set beside it as plain text (decision 7).
7. A builder then copies one glyph per ZIP into `assets/logos/<platform>.<ext>` byte-unmodified, checks any SVG for script, event handlers and external references, and adds the sha256 to `assets/logos/SOURCES.md`.

## 4A. Ads with an official embed (these count toward the ≥4)

**How they were tested.**
- Every row below rendered in our own headless Chrome on `http://localhost:8765/experience/evidence/g02-ads/embed-test.html` on 2026-10-27, with no error state.
- The checklist was written first. Results are in `experience/evidence/g02-ads/embed-results.md`, with screenshots `e1-…png` to `e9-…png` and `embed-test-full-tall.png`.
- Raw frame data is in `embed-proof.json`.

**What was checked before the browser test.**
- **YouTube rows:** oEmbed returned 200 with the brand's channel as `author_name`, and the watch page shows `playableInEmbed: true`.
- **TikTok row:** `tiktok.com/embed/v2/<id>` returned 200 with `uniqueId=sundaeskinco`. A fake ID returned 400.
- Publish dates come from the watch page's `publishDate` (YouTube) or the embed page's `createTime` (TikTok).

**Media and terms.**
- Media plays from the platform's own player; nothing is downloaded or re-hosted.
- **Terms basis, YouTube:** YouTube's Terms of Service allow embedding through the embeddable player when the uploader has not disabled it. Every row was checked as embeddable.
- **Terms basis, TikTok:** TikTok's Terms of Service and its Embed Player allow embedding public videos.

Date seen for every row: 2026-10-27.

| # | Advertiser | Platform | Ad URL | Embed code (src of the official iframe) | Published | What it shows (own words) | Fit |
|---|---|---|---|---|---|---|---|
| E1 | Oh So Heavenly (SA, ohsoheavenly.co.za) | YouTube, channel @ohsoheavenly1844 | https://www.youtube.com/watch?v=EQ0C2oLxHAk | `https://www.youtube.com/embed/EQ0C2oLxHAk` | 5 Oct 2026 | An 18 s product spot for a glow body-care line | Body care. The newest; a short ad a small brand can copy |
| E2 | Oh So Heavenly | YouTube | https://www.youtube.com/watch?v=jWRmaxUJAwY | `https://www.youtube.com/embed/jWRmaxUJAwY` | 4 Aug 2026 | A 28 s ad for a body gel oil that names marula oil among its ingredients | Body care. Closest to Amberkloof's marula face oil |
| E3 | Feel Silki (SA, feelsilki.co.za) | YouTube, @SilkiSkincare | https://www.youtube.com/watch?v=zrd2zKRyZhU | `https://www.youtube.com/embed/zrd2zKRyZhU` | 13 Apr 2025 | A 30 s ad for one body oil gel in two scents | Body care. The same advertiser as Ad Library row 4 |
| E4 | Bio-Oil South Africa | YouTube, @BioOilSouthAfrica | https://www.youtube.com/watch?v=Y92hwfSYLFw | `https://www.youtube.com/embed/Y92hwfSYLFw` | 17 Feb 2025 | A customer-story video from the brand's own story series | Body care. Customer-story format a small brand can film on a phone |
| E5 | Afri'Pure, uploaded by the Great Africa Beauty channel | YouTube Short, @GreatAfricaBeauty | https://www.youtube.com/shorts/TWO7GVx6yLo | `https://www.youtube.com/embed/TWO7GVx6yLo` | 18 Jun 2025 | A 21 s vertical "which body oil is right for you" ad for a body-oil range | Body care. The same creative idea as Ad Library row 3. **Caveat:** the channel's ownership of Afri'Pure is presumed, not confirmed on afripure.co.za |
| E6 | Dash Labels & Digital (SA) | YouTube, @DashLabelsSA | https://www.youtube.com/watch?v=yjkoIPBf3y8 | `https://www.youtube.com/embed/yjkoIPBf3y8` | 12 Feb 2025 | A 43 s intro for a custom label printer: short runs, barcodes, design | Print and labels. The closest real match to Tumelo Print & Pack |
| E7 | Brandbase Branding (SA) | YouTube, @brandbaseprinting9885 | https://www.youtube.com/watch?v=rlHxo3eIOL0 | `https://www.youtube.com/embed/rlHxo3eIOL0` | 22 Oct 2025 | A 2 min promo for one service, direct-to-film transfer printing | Print. The same advertiser as Ad Library row 6 |
| E8 | Impress Online (Impress Printers, KZN) | YouTube, @impressonline569 | https://www.youtube.com/watch?v=tcIBpe02oPs | `https://www.youtube.com/embed/tcIBpe02oPs` | 30 Jan 2024 (older) | A 2 min "get to know us" video for a print and packaging house | Print and packaging. The same advertiser as Ad Library row 7. Reserve, because of its age |
| E9 | Sundae Skin Co (SA, sundaeskinco.co.za) | TikTok, @sundaeskinco | https://www.tiktok.com/@sundaeskinco/video/7431510841062657286 | `https://www.tiktok.com/player/v1/7431510841062657286` | 30 Oct 2024 (older) | A 10 s clip of whipped body butter jars being filled by hand | Body care, small handmade maker. The same advertiser as Ad Library row 2. Reserve, because of its age |

**Embed code used.** Each row is one `<iframe>`:
- **YouTube:** `<iframe src="<src>" title="YouTube ad by <Advertiser>" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`. This is YouTube's Share > Embed code.
- **TikTok:** the same iframe pattern with TikTok's Embed Player src, which is the URL TikTok's oEmbed returns.

**Attribution line in the card:** "Ad by <Advertiser> · <platform> · published <date> · seen 27 Oct 2026", plus the source URL.

**Recommended scene set:**
- **Body care:** E2 and E1.
- **Print, for the B2B swap:** E6.
- **Link to an Ad Library advertiser:** E3.
- **Reserves:** E7, E4, E5.

Rejected while sourcing:
- **Embedding disabled:** Bio-Oil SA "Zinhle's story" and a Brandbase mug ad (oEmbed 401).
- **Not verifiable from the command line:** four Afri'Pure Instagram posts. They were never browser-tested, so they do not count.
- **Old (2023):** two Sundae Skin Co TikToks.
- **Old (2019-2022) or not by the brand:** Africology, Lulu & Marula, Kalahari, Hey Gorgeous, Printulu.
- **No brand video found:** Veld Skin, Mabira Pack, Wayserve.

## 4B. Meta Ad Library ads (link-only: kept for attribution and backup, NOT counted)

Every ad was seen on 2026-10-27 and was Active. Platform for all eight: Meta ads (Facebook and Instagram family); the exact placements are shown only as icons on the Library card and were not read. Display method for all eight: link to the Ad Library page; no official embed was found for Ad Library items. Each ad URL opens the advertiser's Library view with that ad included.

| # | Advertiser | Ad URL | What it shows | Started | Why it is relevant, and what the deck can teach |
|---|---|---|---|---|---|
| 1 | Veld Skin (veldskin.co.za) | https://www.facebook.com/ads/library/?id=2530275520760026 | Video (about 44 s) for whipped body butters made with tallow and African oils, including marula and baobab. Aimed at people whose skin keeps reacting. | 28 May 2026 | Body care, closest to Amberkloof. Hook: names the reader's frustration in the first line. Proof: an ingredient story. Format: long caption plus video. Primary. |
| 2 | Sundae Skin Co | https://www.facebook.com/ads/library/?id=1346173180963038 | Image ad in several versions: real customer photos plus a results percentage for dark marks. | 7 Aug 2026 | Body care. Teaches social proof ("not stock photos") and testing versions. Also a caution: a percentage claim needs evidence behind it. Primary. |
| 3 | Afripure Skin | https://www.facebook.com/ads/library/?id=1518048650021517 | Video (about 21 s) that helps the viewer pick one of several body oils by skin need, linking to a Takealot listing. | 23 Jun 2026 | Body oil, close to Amberkloof's marula face oil. Teaches the "which one is right for you?" format and selling through a marketplace. Primary. |
| 4 | FeelSilki (feelsilki.com) | https://www.facebook.com/ads/library/?id=1169283185161487 | Carousel-style cards offering a free skin guide, with a Download button. | 18 Nov 2025 | Body care. Teaches a lead-magnet offer that collects contacts instead of asking for a sale. Still running after almost a year. Primary. |
| 5 | Mabira Pack (mabirapack.co.za) | https://www.facebook.com/ads/library/?id=1595529002032814 | Image ad for bottles and labels, aimed at small brands whose packaging looks home-made. | 20 Sep 2026 | Packaging and labels, the mirror of Tumelo Print & Pack. Teaches a B2B hook that speaks to the buyer's worry (a product that "doesn't look like a sample"). Primary. |
| 6 | Brandbase Printing Shop | https://www.facebook.com/ads/library/?id=733470875740228 | Image ad for a print shop. The button opens a WhatsApp chat ("Send WhatsApp Message"). | 20 Jun 2025 | Printing. Teaches the click-to-WhatsApp ad format, which links the ads section to the WhatsApp section. Long-running. Primary. |
| 7 | Impress Printers (impressonline.co.za) | https://www.facebook.com/ads/library/?id=2544729219309708 | Very short video (about 5 s) cycling through custom printed packaging shapes, with online ordering and nationwide delivery. | 3 Aug 2026 | Printing and packaging. Teaches showing the range in a few seconds, and the same creative run as 2 ads. Reserve. |
| 8 | Wayserve (wayserve.co.za) | https://www.facebook.com/ads/library/?id=2917529045120125 | Several versions selling beauty products and packaging, online or at its shop in Centurion. | 12 Dec 2025 | Packaging for beauty brands near Pretoria East. Teaches combining an online shop with a local store. Reserve. |

Attribution line for each ad slide: "Ad by <Advertiser>. Source: Meta Ad Library, seen 27 Oct 2026."

## 5. Decisions

1. I treated Meta's checkbox ("I have read and accept the applicable guidelines and other terms for use") as an "I agree" step and marked WhatsApp, Facebook and Instagram BLOCKED. The page's HTML exposes the signed CDN link to each ZIP, but I did not fetch it, because that would skip the acceptance.
2. I marked LinkedIn BLOCKED because its downloads page says downloading the logos means agreeing to the LinkedIn Brand and User Agreements. Downloading would have been accepting.
3. For TikTok I downloaded the official developer-portal pack (TikTok's own CDN, no gate) and saved `TikTok_Icon_Black_Square.png` as `tiktok.png`, byte-identical. I marked it BLOCKED FOR USE because TikTok's guidelines forbid showing the logo without written permission. I chose the square app-icon variant because a row of platform marks reads as app icons. The pack has no SVG for the icon, and its .ai files are not web formats.
4. For the Google G I took the 2820 px PNG from Google's own brand page (Partner Marketing Hub, the target of `about.google/brand-resource-center`). I did not use the 200 px `g-logo.png` on developers.google.com, which is an older style. I did not use the Sign in with Google SVGs, which are buttons with a frame, and whose rules forbid the bare G. No SVG of the bare G is offered. The EPS does not render in browsers, so I chose the PNG.
5. I marked the Google G OK, with a condition. Google allows it in "classroom teaching materials" not used for marketing or business purposes. A workshop that teaches marketing fits "teaching". If the workshop is sold as a service or promotes a business, you need to judge whether that still holds.
6. I did not take a Business Profile icon from Google's product CDN, because Google releases product icons only through an approval form. Taking one elsewhere would bypass that.
7. Interim fallback for the blocked logos: set the platform name as plain text in the deck's type. TikTok explicitly allows its word mark for naming the platform, and Meta allows descriptive use of its names. For Business Profile, Google's customer-reviews guidance lets a business use the Google G to point to its own profile. I did not edit any deck file; the other builder owns them.
8. Instagram's page says not to place Instagram in the same spot as other social networks, except in a general "Follow us on..." line. A 7-logo row conflicts with that. Proposal once the files arrive: show each platform's logo on its own slide or section, and use plain names in any combined row. Confirm when you add the logos.
9. For ads I used the Meta Ad Library (public, no login) with the country set to South Africa and searched "marula oil", "body butter" and "custom labels". I chose small and mid-size South African brands over big retail advertisers (Vaseline, Shoprite, Oh So Heavenly), because the audience is small businesses.
10. Display method for the 4B Ad Library rows is link only. I found no official embed for Ad Library items, and G6 forbids re-hosting, so no screenshots were taken or saved. The browser snapshot files that held ad text were deleted from `.playwright-mcp/`. Under A2.7 these rows do not count; section 4A supplies the counted ads.
14. (PROVISIONAL, 2026-10-27 night) Brand ad videos on the brand's own YouTube or TikTok channel count as "real ads or brand ad posts" when the brand uploaded them and they promote its product or service. Bio-Oil (E4) is a brand customer-story video, not a TV spot. Veto: drop E4 and E5 and keep E1-E3 and E6-E9.
15. (PROVISIONAL) I chose the standard `youtube.com/embed` host because it is the default official embed code and the one tested. The privacy-enhanced `youtube-nocookie.com` host is also official and loads no doubleclick requests. It is recommended for the public deck, but is untested here.
16. (PROVISIONAL) Instagram and Facebook embeds were not used, because no public post could be verified without logging in. The task allows any of the four official embed types.
11. I quoted at most a few words per ad and described each one in my own words.
12. I did not read ad placements (Facebook, Instagram, Messenger and so on) because the card shows them only as unlabeled icons. They are recorded as "Meta ads".
13. Downloads went into new, empty scratchpad folders, and nothing from the ZIPs was executed. Only the two glyph files were copied into the project.

## 6. Risks and failures

0. Embeds can break if a brand deletes a video, makes it private, or turns embedding off. The day before the workshop, re-run `node experience/evidence/g02-ads/capture-embeds.mjs`, which takes about 30 s, and swap in a reserve for any that fails. Running it again is also how the visual proof gets re-checked.
1. Ad Library links are not permanent. Outside the EU and UK, Meta keeps ordinary (non-political) ads in the Library only while they run. Re-open all 8 links the day before the workshop and swap in a reserve (rows 7 and 8) for any that has stopped.
2. Sundae Skin Co's and FeelSilki's home countries were not confirmed. They appeared in the South Africa results but use no .co.za domain in the ad.
3. A click on the Ad Library card's "Open Drop-down" menu failed (another layer blocked the click), so the menu was not inspected for an embed or share option.
4. Nothing was committed or pushed.

Next action: do the 4 downloads in section 3, steps 1 to 4 (about 8 minutes).
