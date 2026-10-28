# Platform logo sources

Next action (owner, about 10 minutes): download the four blocked packs yourself (WhatsApp, Facebook, Instagram, LinkedIn) using the steps under each entry, because each download accepts the brand's terms in your name. Put the ZIPs in `assets/logos/_incoming/` and a builder will copy out the single glyph file, byte-unmodified.

Retrieved: 2026-10-27. Owner rule G5: official files only, crisp, never redrawn, recoloured, cropped or traced. No logo here comes from Wikipedia, Wikimedia, icon sites or GitHub icon packs.

The Pages workflow (`.github/workflows/pages.yml`) copies only named files, so nothing in this folder is published until a builder adds it on purpose.

## 1. Status

| # | Platform | File | Status |
|---|---|---|---|
| 1 | WhatsApp | none | BLOCKED: terms checkbox before download |
| 2 | Facebook | none | BLOCKED: terms checkbox before download |
| 3 | Instagram | none | BLOCKED: terms checkbox before download |
| 4 | TikTok | `tiktok.png` (staged) | BLOCKED FOR USE: TikTok requires prior written permission to show its logo |
| 5 | LinkedIn | none | BLOCKED: downloading counts as accepting the LinkedIn Brand and User Agreements |
| 6 | Google Business Profile | none | BLOCKED: product icons need a Partner Marketing Hub account and an approval request |
| 7 | Google G (Search) | `google-g.png` | OK, with one condition (see entry 7) |

SVG safety check: no SVG was saved. Both saved files are PNG, which cannot carry script, event handlers or external references. `file` reports both as valid PNG images.

## 2. WhatsApp

- Brand-resource page: https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/
- Direct file: `WhatsApp-Brand-Resource-Center.zip` on `scontent-*.xx.fbcdn.net` (Meta's asset CDN). The link is signed, it expires, and it sits behind the acceptance checkbox.
- sha256: not applicable (not downloaded).
- Blocking step: the page has a checkbox, "I have read and accept the applicable guidelines and other terms for use", and it must be ticked before Download. It was not ticked.
- Owner step: open the page, read the guidelines, tick the checkbox, click Download under "Logo pack", and save the ZIP to `assets/logos/_incoming/`.
- Rules that matter: do not modify the logo or change any colours. You may scale it, but it must not be the most prominent or distinctive feature of the page. Do not combine it with other marks or imply partnership or endorsement. Use only logos from Meta's brand site. Write the name "WhatsApp" with capital W and A, and never as a verb. The page states no clear space, minimum size or attribution line, and it does not cover educational use. Logos in books or plays need prior written permission, so treat any print handout as needing permission.

## 3. Facebook

- Brand-resource page: https://www.meta.com/brand/resources/facebook/logo/
- Direct file: `Facebook-Brand-Asset-Pack.zip` on `scontent-*.xx.fbcdn.net`. The link is signed, it expires, and it sits behind the acceptance checkbox.
- sha256: not applicable.
- Blocking step: the same "I have read and accept..." checkbox before Download.
- Owner step: open the page, tick the checkbox, click Download, and save the ZIP to `assets/logos/_incoming/`.
- Rules that matter: clear space is a quarter of the logo's width (X/4). Minimum size is 16 px wide on screen and 6 mm in print. Colours: primary is Facebook Blue with a white "f"; secondary is white with a transparent "f", for use on blue or on imagery. Never recolour it to your own brand colours. The logo must stay complete and unaltered: no 3D, outlines, shadows or effects, no lone "f", and no words or emojis attached. Use only the current official download. The page gives no attribution line and does not cover educational use.

## 4. Instagram

- Brand-resource page: https://www.meta.com/brand/resources/instagram/instagram-brand/ (logo pack). Detailed glyph rules are linked from that page at https://www.facebook.com/brand/resources/instagram/icons
- Direct file: `IG_brand_asset_pack_2023.zip` on `scontent-*.xx.fbcdn.net`. The link is signed, it expires, and it sits behind the acceptance checkbox.
- sha256: not applicable.
- Blocking step: the same "I have read and accept..." checkbox before Download.
- Owner step: open the page, tick the checkbox, click Download under "Logo pack", and save the ZIP to `assets/logos/_incoming/`.
- Rules that matter: use only the official logos. Do not modify them, and do not make Instagram the most prominent feature or imply endorsement. Permission is needed for broadcast, out-of-home, or print larger than A4. The page says not to mention other social networks in the same spot as Instagram or Facebook, except in a general "Follow us on..." call to action. This conflicts with a slide that shows all 7 platforms side by side (see Decisions in `experience/research/g02-logos-and-ads.md`). Clear space and minimum size are on the icons page, which was not read past the gate.

## 5. TikTok

- Brand-resource pages: https://developers.tiktok.com/doc/getting-started-design-guidelines (developer design guidelines, logo pack) and https://www.tiktokbrandhub.com/legal (TikTok Brand Hub, Brand and Use Guidelines).
- Direct file: https://sf16-va.tiktokcdn.com/obj/eden-va2/uvzhqeh7nuhd/tt4d/logo-pack.zip (TikTok's own CDN; no login, checkbox or terms step). ZIP sha256: `b3f31728ceb6ce6fc1a0ae8c635a0223e35ac2f7d203b2743e713541bf2085cd`.
- File copied out of the ZIP: `Dev Portal Logo Pack/TikTok Logo Pack/TikTok – Icons/TikTok_Icon_Black_Square.png`, saved as `tiktok.png` (1200 x 1200 PNG, byte-identical).
- sha256 (`tiktok.png`): `e8013e14350422f54f4b61735d91e232bf02972f6156d979cd82905559f5ee2e`
- Why it is blocked for use: TikTok's Brand and Use Guidelines say "If you have not received our permission, you may not use the TikTok logo." The plain word "TikTok" may be used without permission to refer to the platform (for example "follow us on TikTok").
- Second caveat: this icon dates from 2020. The Brand Hub says the note and wordmark were "subtly refined" since then, and current assets sit behind the Brand Hub's "Log in" button.
- Owner step: either get TikTok's written permission (log in at https://www.tiktokbrandhub.com and follow its request route), or show "TikTok" as plain text in the deck's own type and leave the icon out.
- Rules that matter (if permission is granted): do not modify, abbreviate or translate "TikTok". Do not use the brand alongside your own brand identity, on merchandise, or as the prominent feature of promotional material. Do not use it as a noun or verb ("a TikTok"). Imply no partnership. Clear space, minimum size and colour variants are in the logo dos and don'ts that come with the permission.

## 6. LinkedIn

- Brand-resource pages: https://brand.linkedin.com/in-logo and https://brand.linkedin.com/downloads
- Direct file: https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/logos/in-logo.zip
- sha256: not applicable.
- Blocking step: the downloads page says "By downloading our logos, you agree to comply with the terms of the LinkedIn Brand and User Agreements." Downloading is the act of accepting, so it was not done on the owner's behalf.
- Owner step: read the Brand and User Agreements linked on https://brand.linkedin.com/downloads, click "[in] Logo", and save the ZIP to `assets/logos/_incoming/`.
- Rules that matter: only three colour variants are allowed (blue, black, white), and blue on solid white is preferred. Do not change the colour or shape. Do not combine it with other symbols, words or logos, and do not imply affiliation. Use the high-resolution file for print. The listed acceptable uses are member uses (profile links, business cards, email signatures, social icon rows). Other uses go to trademarkrequest@linkedin.com. Notice shown on the page: "LinkedIn logo © LinkedIn Corporation". No clear space or minimum size is stated.

## 7. Google G (Google Search)

- Brand-resource page: https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ (Google's brand resource center; `about.google/brand-resource-center` redirects here)
- Direct file: `https://storage.googleapis.com/pe-portal-consumer-prod-wagtail-static/original_images/GoogleG_FullColor_RGB.png`. The page generates a signed link that expires after 24 hours, so re-download from the page if needed. No login, checkbox or terms step was shown for this file.
- File: `google-g.png`, 2820 x 2820 PNG, full-colour G with the current blended-gradient style, byte-identical to the download.
- sha256: `4d5cfbd85af19c003770a74f8de210156ca42c54ac0a4cb0d95572c286c882a6`
- Condition: Google's page allows the G "to refer to Google (the company)", including in "classroom teaching materials – so long as it's not being used for marketing or business purposes". It says not to use the G "in marketing materials for a business". A workshop that teaches marketing fits "teaching materials". If the workshop is sold or used to promote a business, the owner should treat this as a judgement call.
- Rules that matter: use only the newest gradient G and only the full-colour version. Keep it on white or black backgrounds. Do not modify or recolour it, and do not combine it with your own logo. Clear space on all sides equals the width of the G. No minimum size or attribution line is stated.
- Not used: `signin-assets.zip` from https://developers.google.com/identity/branding-guidelines. It has only Sign in with Google buttons (the G inside a button frame), and those guidelines forbid the G without the button boundary.

## 8. Google Business Profile

- Brand-resource page: https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ (section "Product icons")
- Direct file: none public.
- sha256: not applicable.
- Blocking step: the page says "To use a Google product icon in your work, create a Partner Marketing Hub account to find assets and request permission through our approval form."
- Owner step: create an account at https://partnermarketinghub.withgoogle.com/signup/ and request the Google Business Profile product icon through the approval form. Approval takes an unknown time.
- Interim route Google itself offers: a business that references or links to its own Business Profile may use the Google G (https://partnermarketinghub.withgoogle.com/brands/google/use-cases/customer-reviews/). Ratings must be described as "on Google" with an "as of" date, and stars must not be added to the Google name or logo.
