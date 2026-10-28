**Next action (owner, about 30 minutes before 08:00):**
1. Pick an opener: A, B or C below (2 min).
2. Read scenes 04, 05 and 09 out loud once. They carry the volunteer, the live runs and the one customer question (20 min).
3. Do the door prep in section 2 with your volunteer (10 min, before the session starts).

# GTP presentation script: Sales, Marketing and AI

- **Status:** PROVISIONAL script for the 08:00 talk, written 2026-10-28 from story spine v2.1 with cut tiers 1-3 applied, plus the owner feedback of this morning (Amberkloof carries the story, Tumelo is the B2B swap, one customer question used once, no scene re-teaches another).
- **Total talk time: 60:40** (3,640 s). Tiers 1-3 give 61:00; two more redundancy trims (07-8 and 12-9/12-10, 10 s each) bring it to 60:40.
- **Voice:** plain South African English, said out loud. Lines in quotes are what you say. Everything in **[brackets]** is a cue, not speech.
- **Honesty rule:** Amberkloof and Tumelo Print & Pack are invented brands. Every number about them is an illustrative sample or demo data, and the screen says so. Say it the same way.
- **Checks run:** humanizer-loxly SPOKEN pass and the slopmonster lint (`deslop.py`). Receipts are in section 6.

## 1. Cues and timing

| Cue | Meaning |
|---|---|
| **[NEXT]** | Press Next. The next scene starts moving on its own. |
| **[SPACE]** | Pause or restart the scroll (for a long answer from the room). |
| **[CLICK x]** / **[TAP x]** | Click a control in the scene. A click holds the scroll on that state. |
| **[LIVE]** | A tool run on the volunteer's business shows here. Read the three-state rule below. |
| **[PLAY]** | Click a real video to play it. |
| **[ASK]** | The one audience question for this scene. |

**Three-state rule for every [LIVE] beat.** Look at the small tag on the result card.
1. **Tag says "live":** read the volunteer's result. Use the scene's live line.
2. **Tag says "cached run":** the live run was late or failed, so the deck shows last night's run of the same tool on Amberkloof. Say: "That little tag says cached run. Yours hasn't come back in time, so this is the same tool's run from last night, on Amberkloof. Same skill, same steps." Then use the scene's cached line.
3. **No result and a "needs a key" note:** that tool is not switched on today. Use the scene's not-running line. Never pretend it ran.

| # | Scene | Time | Starts | Live slot |
|---:|---|---:|---:|---|
| 01 | Open: Be found. Be chosen. Keep learning. | 2:00 | 0:00 | none |
| 02 | Growth is a loop (ECO) | 3:00 | 2:00 | none |
| 03 | Engage: Who? | 5:45 | 5:00 | none |
| 04 | Engage: Where? (volunteer, consent, runs start) | 4:10 | 10:45 | runs start at 04-2 |
| 05 | Engage: What? | 4:25 | 14:55 | competitor scan, B2B find |
| 06 | Engage: Make it yours | 6:15 | 19:20 | content, Last 30 Days |
| 07 | Engage: Be found | 4:55 | 25:35 | keywords, SEO, backlinks, citations, 30/60/90 |
| 08 | Convert: Capture | 4:20 | 30:30 | AI helper (demo data) |
| 09 | Convert: Follow up | 4:55 | 34:50 | none |
| 10 | Optimize | 2:40 | 39:45 | none |
| 11 | Attract (the peak) | 4:05 | 42:25 | none |
| 12 | Interact, then teach AI | 4:40 | 46:30 | none |
| 13 | Use AI responsibly | 2:15 | 51:10 | none |
| 14 | Your turn: Tool A and Tool B | 3:35 | 53:25 | Tool A, Tool B |
| 15 | Keep learning and the 7-day test | 3:40 | 57:00 | none |
| | **Total** | **60:40** | ends 60:40 | |

Engine array for this script: `sceneSeconds=[120,180,345,250,265,375,295,260,295,160,245,280,135,215,220]` (sum 3640). The deck in `scroll-presentation.js` still holds the v2 array; whoever owns the engine updates it.

## 2. Door prep with the volunteer (10 min, before 08:00)

1. Meet the volunteer at the door. Confirm their business name and website.
2. They answer the 6 questions: business and website, what they sell, who buys most (age group and the rough men/women split), area, where customers find them, and whether they sell to businesses or the public. Business-level answers only. No customer names or numbers.
3. Show them the consent card. Tell them: "I'll read this out on stage and ask you again. You can say no then, and that's fine."
4. Check the runner is up and the volunteer's answers are loaded.
5. If no volunteer turns up: run everything on Amberkloof. Drop the volunteer lines and say "Amberkloof" wherever the script says [business].

## 3. Three openers (pick one)

The on-screen card at 01-4 matches **A**. If you pick B or C, change the one line in `.g1-open__opener`.

- **A, a question.** "Quick show of hands. Who's posted on three platforms this month and still can't tell you which one brought in a customer? Keep your hand up for a second. Look around. If your hand is up, mine would be too. That's what the next hour is for."
- **B, the product.** "This bottle isn't real. Amberkloof is a brand we made up for today. In the next hour we'll work out who buys it and where those people spend their time. We'll trace how a like turns into a sale. Then we do it for real, with one of your businesses."
- **C, a challenge.** "Hands up if you know who your best customer is. Now keep it up if you could prove it from your records. Orders, WhatsApp messages, people who came back. Okay. If your hand came down, you're in good company. That gap is what we're working on today."

## 4. The script, scene by scene

### Scene 01 · Open · 2:00 (0:00 to 2:00)

- **New here:** the promise of the hour, and the one product that carries it.
- **On screen:** the bottle on a stone plinth in a dark warm studio; "Sales, Marketing and AI" top left; the three lines land one by one.

**01-1 · 0:10** [Arrive. Say nothing for three seconds. Let the bottle land.]

**01-2 · 0:29** "Morning, everyone. I'm [your name]. Today is about sales, marketing and AI, for businesses like yours. Three lines on the screen. Be found. Be chosen. Keep learning. If you walk out knowing how to do those three for your own business, this was worth your morning."

**01-3 · 0:33** [The bottle turns.] "And this is our guest for the hour. Amberkloof marula face oil, from a small body-care brand in Pretoria East. Two people and a part-time packer. It's a brand we made up for today, so nobody's real secrets are on the screen. Watch this bottle. It follows us all the way through."
[If you picked opener B, say B here instead, and use A's show of hands at 01-4.]

**01-4 · 0:26** [The opener card fades up.] Say your opener (A or C).
- **[ASK]** The opener is this scene's question.

**01-5 · 0:22** [E, C and O start to orbit the bottle.] "So how does a business get found, get chosen, and keep getting better at it? It's a loop. Three letters. E, C, O. Let's open it up."
[NEXT when the page stops.]

### Scene 02 · Growth is a loop · 3:00 (2:00 to 5:00)

- **New here:** the ECO loop. Engage, Convert, Optimize, and what each one means.
- **On screen:** the three words orbit the bottle on a ring; each one swings to the centre when clicked.

**02-1 · 0:23** "Growth is a loop. Make each turn useful. We call it ECO. Engage, Convert, Optimize. Every business already runs this loop, whether they know it or not. Today we run it on purpose."

**02-2 · 0:55** [CLICK Engage, or let it swing in.] "Engage first. Engagement is anything that makes people respond to you. A like. A comment. A save. A message. And what makes them respond? Usually one of four things. A question answered. A striking picture. An offer. A story. Look at that comment: 'Is this OK for sensitive skin?' That's engagement. Somebody cared enough to ask."
- **[ASK]** "Think of your last post that did well. What did people react to? The question, the picture, the offer or the story? Shout it out."

**02-3 · 0:59** [CLICK Convert.] "Convert comes right after. Engagement got their attention. So while you have it, give them a clear next step. And here's the catch. You can't convert people you don't know. So it starts small. A name. A surname. An email. Two ways to get it. One, ask for their details while they're engaging with you. Two, give them something worth having. Amberkloof gives a free 5 ml sample for an email address. Fair swap."

**02-4 · 0:43** [CLICK Optimize.] "Then Optimize. We measure both ends. Failures: the posts nobody engaged with. And the sneaky ones, the posts people liked, but nobody bought from. Successes: the posts that did both. Then two questions. Why did it work? And to whom? To whom is the big one. So that's where we start."
[NEXT. The "to whom" chip punches through into the next scene.]

### Scene 03 · Engage: Who? · 5:45 (5:00 to 10:45)

- **New here:** you probably don't know your best customer yet. Gather the data, group it, and the customer profile comes from records, not a feeling.
- **On screen:** ENGAGE, WITH WHO, a giant question mark; the assumption card; the data table; three groups; the persona card.

**03-1 · 0:43** [Let the title build and say it with it.] "Engage... with who? [Let the question mark land.] Before we post anything, we need to know who we're talking to. The proper name is your ideal customer profile. ICP. All it means is a clear picture of the people who buy from you."

**03-2 · 0:43** "So let me ask. Do you really know who buys from you? If you do, kudos to you. Most of us don't, and I include myself. Amberkloof's owner was sure. 'Our customer is women 25 to 34 who love natural skincare.' [The stamp lands.] That's a feeling. A guess. And a guess is a fine place to start, as long as we test it."

**03-3 · 1:15** "So how do we test it? Read it with me. 'Start with the people who actually buy, inquire, and come back.' Buy. Inquire. Come back. [The streams pour in.] Every order. Every WhatsApp question. Every repeat customer. They all go into one simple table. What they bought. Their area. Where they found us. Did they come back? Age group. Sex. And their circumstances, meaning what's going on in their life when they buy. Race only if they tell us themselves. We never guess it. Simple enough, right?"

**03-4 · 1:27 (47 s talk, then the 40 s write)** "Now, where does that data come from? We gather it. Every sale adds a row. Every inquiry adds a row. Every repeat adds a row. And at checkout, three quick questions, all optional: age group, sex, and who it's for. No data? You're guessing.
Right, your turn. I know, writing things down in a workshop feels like school. It's forty seconds. Write down your last ten customers. Names are fine, it's your own paper. Next to them, one thing they have in common. Go."
[The timer holds the page and keeps the motion alive. At zero it moves on. SPACE skips it.]

**03-5 · 1:01** "Now watch Amberkloof's rows sort themselves. Sixty orders, an illustrative sample. Three groups. Gift planners, 24. Self-care regulars, 21. Guesthouses and spas, 15. [The assumption card cracks.] Look who's biggest. Not women 25 to 34. Gift planners. Mostly men, by the survey, 35 to 49, buying a present twice a year. The feeling was wrong. The answer was in the records all along."
- **[ASK]** "Look at your own list. Is your biggest group the one you would have guessed? Hands up if it isn't."

**03-6 · 0:36** "And that group becomes a person. Meet the Gift Planner. 35 to 49. Midrand and Centurion. Busy. Wants it wrapped and delivered. Finds us on Instagram, orders on WhatsApp. That's an ICP, and it works in any business. A salon counts bookings and rebookings. A plumber counts call-outs and repeat clients. [TAP B2B] And if you sell to other businesses, here's Tumelo Print & Pack, the printer that makes Amberkloof's gift box. Their best customer is the Launching Founder. A small product brand, one to ten staff, about to launch, needing 500 to 2,000 boxes before a market date."
[NEXT. The "found us on" field pops off and becomes the hub of the platform wheel.]

### Scene 04 · Engage: Where? · 4:10 (10:45 to 14:55)

- **New here:** don't try to be everywhere. Pick two or three platforms where your customer already spends time, and know why. AI can research where they are, but your records win.
- **On screen:** the volunteer's consent card; the run tray; the "where do they live online" infographic; seven platform tiles burst out of a mouse click and spin like a carousel; the phone comes alive on the chosen platform.

**04-1 · 0:35** **[VOLUNTEER]** "Now I need some help. [Name] from [business] agreed to be our real business for today. Come on up. Give them a hand.
Before anything runs on your business, here's what you're saying yes to. I'll read it out so everyone hears it."
**Consent line (read word for word):** "We'll scan your public website and your public social pages, and use the answers you gave us about your business. Claude from Anthropic, Firecrawl and Apify do that work. Tool A, at the end, also uses Supabase and Resend. We don't touch any of your customers' details. And we delete all of it after 30 days. Are you happy with that?"
[Wait for a clear yes. CLICK Accept. Nothing runs before this click.]
[If they say no: "That's completely fine, thank you." They sit down. Run everything on Amberkloof.]

**04-2 · 0:25** "[Name] answered six questions at the door. What they sell, who buys most, their area, where people find them, and whether they sell to businesses or the public. [Read two of their answers aloud.] [CLICK Submit] That's every tool starting at once, on [business]. Some take a minute or two, so they get a head start now. You'll see the results land one by one as we go."

**04-3 · 0:15** "Back to our Gift Planner. We know who. Now, where do they spend their time?"

**04-4 · 0:30** "We asked AI to research where these people live online, with sources. Google still handles more than nine in ten searches in South Africa. And of South Africans on social media, about 94 in every 100 use WhatsApp. For our Gift Planner, it says: searches Google, scrolls Facebook and TikTok, orders on WhatsApp. But our own records said they found us on Instagram. When the research and your records disagree, your records win. That's why the tag says: check it against your own data."

**04-5 · 0:15** [The mouse clicks; seven tiles burst into an arc.] "Seven places you could be. WhatsApp. Facebook. Instagram. TikTok. LinkedIn. Google Business Profile. And your website on Google search. Most of us try to be on all seven. Let's not."

**04-6 · 0:30** [CLICK to spin.] "Let's spin it for the Gift Planner. [It lands on Instagram.] Instagram. Why? Because that's where our records say they found us, and people find gift ideas by browsing pictures. So this is where Amberkloof gets seen."

**04-7 · 0:30** [Next landing: WhatsApp.] "WhatsApp. Why? Because that's where they buy. Nobody wants a checkout form for a birthday present. They want to send a message and have it sorted."
[Google Business Profile comes alive only if you click it: "And Google Business, for the self-care regulars who search for something nearby."]

**04-9 · 0:25** [B2B swap.] "Same wheel for Tumelo. [It lands.] Google search and LinkedIn. A founder searches Google for a printer, then checks them out on LinkedIn before asking for a quote."

**04-10 · 0:25** "So here's Amberkloof's verdict. Instagram to be seen. WhatsApp to sell. Google Business to be found. TikTok, later. Average is the same post copied to all seven, and calling that being everywhere. Good is two or three, each with a reason you can say out loud. Fewer places. Better reasons."

**04-11 · 0:20** - **[ASK]** "Now [business]. Their customers are [read their 'who buys most' answer]. Which two or three would you pick for them? Hands up for... [point at the tiles one by one]." [Any tile can be clicked.]
[NEXT. The Instagram post slides off the phone onto a shelf.]

### Scene 05 · Engage: What? · 4:25 (14:55 to 19:20)

- **New here:** the mix of education and promotion depends on the group. A competitor's post has a recipe you can read. The gap, what nobody posts, is where you fit. B2B buyers can be found the same way.
- **On screen:** the shelf; the education and promotion toggle; competitor cards ignite one by one as an electric line traces each glass frame; one post splits open into its recipe; the gap slot.

**05-1 · 0:10** "We know who, and we know where. Now, what do we give them?"

**05-2 · 0:30** "Two kinds of post. Education, and promotion. [TOGGLE] Education answers a real question, like: 'Can I use face oil under my make-up?' Promotion makes an offer: 'Gift set, wrapped, delivered Friday.' [TOGGLE the audience.] And each group wants a different mix. The self-care regulars want the answers. The Gift Planners want the offer. So the mix follows the person."

**05-3 · 1:00** **[LIVE: competitor scan]**
- **Live:** "Remember the runs we started? The first one's back. This is a competitor scan on [business]. AI went looking for their competitors, where they post, what they say, and which of their posts people respond to. [Read two of the three cards: the name, the platform, the main message.]"
- **Cached:** "So this is Amberkloof. It found African Botanics and Afrakari, among others. And look, where it isn't sure, it says 'inferred'. Good. A tool that tells you where it's guessing is a tool you can trust."
- **Not running:** "This scan didn't come back today. Here's what it would show: their competitors, where each one posts, and what works."

**05-4 · 0:50** "Let's open their best post and see how it's built. [It splits apart.] The hook, the first line that stops your thumb. The body. The offer, or the giveaway. The format: a video, a photo, a carousel. And the platform. Now a weak post, split the same way. [Point.] See the difference? Usually one or two of these pieces carry the whole post."

**05-5 · 0:30** "Now the useful bit. The same scan looks for gaps. Things none of them do. [Read the gaps on screen, for example: nobody shows the gift wrapped.] That gap is exactly where Amberkloof fits. [The bottle slides into the slot.]"
- **[ASK]** "What's one thing your competitors never post about? Think of it now. That's your gap."

**05-6 · 0:35** **[LIVE: B2B find]** "If you sell to businesses, AI can find buyers too. Two steps. Step one, it collects every business on Google Maps in your area that could buy from you. Step two, a tool called Apify fills in each one's website, social pages and size."
- **Not running (expected today, it needs a key):** "This one needs a key that isn't switched on today, so you're seeing the two steps, not results."
- **Live:** "[Read the first two rows. The names are blurred on the public deck.]"
- **Always say:** "One rule. A list like this is for research. Before you market to anyone on it, POPIA's direct-marketing rules apply. Consent first."

**05-7 · 0:35** "And this is the bit I care about most. B2B or B2C, it doesn't matter. The method is the same. Copy what works. Then fill the gap. Average is copying their post. Good is copying their recipe, then doing the thing they're not doing."

**05-8 · 0:15** [A spotlight finds the bottle in the gap.] "So that empty slot? That's our next post."
[NEXT. The slot becomes a blank post canvas.]

### Scene 06 · Engage: Make it yours · 6:15 (19:20 to 25:35)

- **New here:** AI drafts five kinds of content in seconds; how to run a skill in Claude; why a bare prompt looks like everyone else's; your brand guideline from your own content; real ads; slopmonster keeps your voice; the Last 30 Days brief; the habit week.
- **On screen:** five outputs burst around the bottle; the same-prompt cards; real ad cards; the generic caption shatters into the edited one; the week fills Monday to Friday.

**06-1 · 0:10** "AI drafts fast. You make it yours. Let's see both halves."

**06-2 · 1:00** **[LIVE: content]** [Five outputs burst out.] "Three post ideas. A caption. A product description. A simple picture. And a short video. [PLAY the short video.] One request. When we timed it, the writing took about twenty seconds."
- **Live:** "This is for [business]. [Read the first post idea and the first line of the caption.] [Name], would you post that?"
- **Cached:** "So this is Amberkloof. Look at idea one: a pour shot of the oil, with the line 'Three drops. That's the whole routine.' That's usable. Today."

**06-3 · 0:20** "How did we make that? Two tools. Claude, the app you chat to. And Claude Code, the same assistant working on your computer, running skills. A skill is a saved recipe. To use one, paste the skill's link into Claude and say, 'Follow this skill, please.' A normal Claude Pro plan is enough."

**06-4 · 0:10** "Think of a chef. Good ingredients, that's your brand, your photos, your customer data. Plus a recipe, that's the skill. A bare prompt is a chef with an empty fridge."

**06-5 · 0:20** "Watch what a bare prompt does. 'Make me a launch video.' [Three identical cards.] Theirs. Yours. Everyone's. Big text, a gradient, a fade. [FLIP to With media.] Now the same thing with the real product photo in it. Already better."

**06-6 · 0:25** "So when you make video with AI, five habits. Pick a style first. Use real references. Write the brief in numbers: seconds, sizes, colours. Decide if it loops. And check the actual frames before you post. [The short clip plays, muted.]"

**06-7 · 0:35** "Now, your look and your voice. We gave Claude's Design System everything Amberkloof already had. The posts, the labels, the website. It gave back a brand guideline. Colours. Fonts. Voice rules, like: no medical claims, ever. And from that guideline, one new post that looks like it came from the brand. That's how AI learns your look."

**06-8 · 0:30** **[PLAY]** "These are real ads, from real South African brands. The brand's name is on every card. Oh So Heavenly. Feel Silki. And from Tumelo's world, Dash Labels. [Click one to play. Let it run about ten seconds.] Under each one, what people did with it on the day we checked. And next to them, our own pair, Good and Average. Same product. Look how differently they land."

**06-9 · 0:20** - **[ASK]** "Quick one. Hands up if you've ever posted something AI wrote without changing a word. [Beat.] Me too."
"So, does AI copy sound like you? There's a skill called slopmonster. It finds the giveaways that make writing sound like a machine did it, and takes them out. Pair one, an Instagram caption. Without the skill: 'One little night-time ritual', a sparkle emoji, a flag emoji. With it: 'That's it. Marula does the quiet work.' [The generic pane shatters.] Four emoji down to none."

**06-10 · 0:20** "Pair two, the product description. Without: made-up promises about how your skin will look by morning. With: 'No promises about how you'll look by morning.' And a line only a person would write: count your two drops in the dark."

**06-11 · 0:20** "Pair three, a WhatsApp follow-up. Without: 'Your feedback means a lot.' With: 'A short review helps a two-person business like ours a lot.' Now, the skill also gives each draft a score, and on these three the score barely moved. The drafts were fairly clean already. What changed was the voice. So the score helps, and you still read it yourself."

**06-12 · 0:15** "Same for Tumelo on LinkedIn. [Point at the marked words.] Those are the giveaways it took out. The before could be any printer anywhere. The after sounds like Tumelo."

**06-13 · 0:50** **[LIVE: Last 30 Days]** "Last piece: what to post about. There's a skill called Last 30 Days. Every morning it reads what people are saying about your niche on social media, Reddit and YouTube, and gives you a brief. What they're talking about. What they're complaining about. With dates and sources. You pick one complaint, and you answer it with an opinion or a how-to post."
- **Not running (expected today):** "This one needs a key and a review before I'll run it on a stage, so it's not live today. The idea is what matters: one brief a morning, one complaint answered."
- **Live or cached:** "[Read one talk theme and one complaint.] That complaint is Monday's post."

**06-14 · 0:30** "Put it together and marketing becomes a habit. Every weekday morning, fifteen minutes. Read the brief. Draft with AI. Your edit. Schedule. Monday, an answer from the brief. Wednesday, the competitor gap. Friday, the offer."

**06-15 · 0:10** "And Friday's post turns into something people type. [The card becomes a search: 'marula face oil Pretoria'.]"
[NEXT.]

### Scene 07 · Engage: Be found · 4:55 (25:35 to 30:30)

- **New here:** your website and Google are still the main place; AI answer tools search the web; SEO, AEO and GEO; keywords, an SEO check, backlinks, citations; how to become the authority; a 30, 60 and 90-day plan.
- **On screen:** the search bar; social cards bounce off a glass wall; the three words land one at a time; the query streams down a data tunnel with an orbit ring; live check cards; the 30/60/90 track.

**07-1 · 0:10** "Be found where people ask. And for most businesses, that's still your website and Google."

**07-2 · 0:30** "People search Google, or they ask an AI. ChatGPT. Copilot. Gemini. Claude. Perplexity. And they trust what comes back. But AI can't go into social media all by itself. So most of the time, it searches the web. [The social cards bounce off the glass.] So your website has to carry your proof."
[Optional, only if you've decided to add it (Q-FACT): "To be fair, some public posts do show up through Google. But AI doesn't scroll your feed or read your DMs."]

**07-3 · 0:30** [One word at a time.] "Three words you'll hear. SEO: Google ranks you. AEO: an AI answers with you. GEO: an AI names you as its source. Same goal. Be the answer."

**07-4 · 0:25** **[LIVE: keywords]** "Now four quick checks on a website. The words to rank for. What's blocking it. Who links to it. And who quotes it."
- **Live:** "Back to [business]. Which words should they try to rank for? [Read the top two.]"
- **Cached:** "So Amberkloof. 'Pure marula oil South Africa.' 'Marula face oil Pretoria.' And it says plainly there's no search-volume data behind these. Check them in Google Search Console before you write a word."

**07-5 · 0:25** **[LIVE: SEO check]**
- **Live:** "Next, an SEO check on their site. What stops Google finding it? [Read the top issue.]"
- **Cached:** "Amberkloof doesn't have a website, so last night we pointed this check at this workshop's own site. And it didn't go well. No sitemap, so Google has no list of our pages. So I'm not above any of this."

**07-6 · 0:25** **[LIVE: backlinks]** "A backlink is another website pointing to yours. Each one is a vote for you."
- **Live:** "[Read one example from the run.]"
- **Cached:** "Our workshop site? Nobody links to it yet. Not one. Honest."

**07-7 · 0:25** **[LIVE: citations]** "And citations. When someone asks an AI about your kind of business, who does it quote? References are the other way round: the sources your own page names. Name good ones."
- **Live:** "[Read who gets cited for the sample question.]"
- **Cached:** "Our own site scored 41 out of 100 for how easily an AI could quote it. Lots of room."

**07-8 · 0:20** "So how do you show up? Become the authority in your niche, and make your website prove it. Average: 'We are the best natural skincare.' Good: a page that answers the question people really ask, with proof."

**07-9 · 1:15** **[LIVE: 30/60/90 plan]** "And then a plan. Thirty, sixty, ninety days of blog posts and landing pages. [TAP 30, then 60, then 90.]"
- **Live:** "[Read one item from each tab for [business].]"
- **Cached:** "Days one to thirty, the foundation. Claim the Google Business Profile. Set up Search Console. Add a WhatsApp button. Make sure AI tools are allowed to read the site. And on day 21, a Christmas gift-set page. Days thirty-one to sixty: reviews on the product pages, and guides an AI can quote. Sixty-one to ninety: earn links and mentions, and once a month ask ChatGPT, Perplexity and Gemini your own questions to see if you come up."
- **[ASK]** "If someone asked ChatGPT tonight for a business like yours in your area, would it name you? Who's sure? And who's not sure?"

**07-10 · 0:15** "Tumelo's version: a page for 'custom product labels Johannesburg', plus LinkedIn articles that show they know their stuff."

**07-11 · 0:15** "And when someone clicks that answer, where do they land? [The answer card punches through to full screen.]"
[NEXT.]

### Scene 08 · Convert: Capture · 4:20 (30:30 to 34:50)

- **New here (scene 02 already gave the why):** where to put capture (the pages people land on), the AI helper, the timed pop-up, the button that lives inside the ad, and the skills that set it up.
- **On screen:** the landing page; a demo analytics pane; the helper pops up; an electric line traces the capture card's glass frame as it fills; the R1 reel; our ad; real CTA ads.

**08-1 · 0:15** "Now the where and the how. Capture their details as soon as you can, on your website or on social media."

**08-2 · 0:30** "First, where do people land? [The pane ranks the pages.] This is demo data, but your own analytics shows the same thing. Most visits go to two or three pages, and often it's not the home page. Put your capture where people land."
- **[ASK]** "On your website, which page do most people land on? Do you know? If you don't, that's tonight's homework."

**08-3 · 1:00** **[LIVE: AI helper, demo data]** "The best one I've seen is an AI helper that pops up and offers to help. [It pops up and offers to help choose a gift.] The visitor says they need a birthday present for their mom. It suggests the gift set. Then it asks for their name and surname, and then an email address and a WhatsApp number, so it can send the details. Everything typed in here is made-up demo data. Nobody real."
- **Cached:** "Same demo, recorded last night. Same point."

**08-4 · 0:30** "Second spot. Someone has sat on the gift page for thirty seconds. They're interested, or they're stuck. [Fast-forward the timer.] So the page says, 'We're here to help,' and offers to take their details. Same on the FAQ page."

**08-5 · 0:20** **[PLAY: R1 reel, attributed]** "Here's a reel I love. [Play.] For the first eight seconds, this is Good. Ideas, movement, things worth watching. Then the end card. A flat coupon, bolted on. That's Average. The ask feels stuck on afterwards."

**08-6 · 0:15** **[PLAY: our ad]** "Our Good. The gift set floats out of the phone and into a WhatsApp chat. 'Order for Friday?' The ask lives inside the story."

**08-7 · 0:45** **[PLAY]** "Real ads that do this. One opens a WhatsApp chat. One collects an email with a sign-up form. One asks a business for a quote. [Click one to play.] Each card says what the button does and what people did with it."
- **If a card is empty (these were still being sourced):** "We're still finding good examples of this one, so here's the pattern instead. The button opens a conversation, asks for details, or asks for a quote. Never 'learn more'."

**08-8 · 0:20** "Setting this up? Three free skills. C-R-O, for which page and which form fields. popups, for the helper and the timed pop-up. signup, for the newsletter or the freebie. They're in a collection called marketingskills, by Corey Haines. The address is on screen. Take a photo."

**08-9 · 0:15** "Tumelo does it with a form. 'Quote in 24 hours.' Company, role, quantity. Three fields, and they know exactly who's asking."

**08-10 · 0:10** "And once we have those details, the real work starts."
[NEXT. The filled card drops into the first box of the follow-up track.]

### Scene 09 · Convert: Follow up · 4:55 (34:50 to 39:45)

- **New here:** the four places AI answers; reply speed; what a sales lifecycle is; the simplest funnel; the pipeline; reviews; two more funnels; a CRM built with AI; the follow-up skills.
- **On screen:** the channel places spiral into orbit around the order; a response clock; the email and WhatsApp timeline; the pipeline boxes; review stars.

**09-1 · 0:15** "A sale is often won after the first reply. So where does AI come in? Four places."

**09-2 · 0:10** "Place one. The helper on your website. You've just seen it."

**09-3 · 0:10** "Place two. WhatsApp. AI drafts the replies and the quick answers. You stay inside WhatsApp's rules: people opt in, and when you message first, you use approved templates."

**09-4 · 0:10** "Place three. Instagram and Facebook messages. Someone comments, 'Do you deliver to Centurion?' AI answers, and asks for their details."

**09-5 · 0:20** "And Slack? Honestly, mostly for your team. AI posts 'new lead' in your Slack and helps you reply. Customers rarely message a small business on Slack. A few business clients might share a channel with you, and that's about it."

**09-6 · 0:30** **[VOLUNTEER from the room]** "Speed matters. A message comes in at four on a Thursday afternoon: 'How much would a gift set for 20 guests cost?' Two possible replies. Who wants to pick? [A room member picks Helpful or Vague. CLICK it.] Vague: 'Hi, price is R450.' Helpful: [read the helpful reply on screen]. And a reply in two minutes beats a reply in two days. Every time."
- **[ASK]** "Be honest. How long does it take you to answer a WhatsApp inquiry?"

**09-7 · 0:15** "People say 'sales lifecycle'. That's a fancy way to say we'll WhatsApp you and email you a series of useful things, so you trust us, and you can see we know our stuff."

**09-8 · 0:40** "Here's the simplest funnel. [CLICK Send.] The moment someone leaves their details, a welcome and thank-you email goes out. Then a short series of emails and a short series of WhatsApps run side by side. Every message has their permission and a way to opt out. That's POPIA. It's also just manners."

**09-9 · 0:35** "To keep track of it all, you need a pipeline. A pipeline puts each customer in a box, so nobody gets forgotten. Here's Tumelo's deal for Amberkloof's gift boxes. Quotation. [CLICK Advance.] Order. Invoice. Follow-up. You can ask AI to build this with you."

**09-10 · 0:20** "The follow-up box does one more job. It asks for a review, on Google and on social. Ask everyone, not only the happy ones. And never pay for a review."

**09-11 · 0:15** "Every one of these is a funnel. So what's a funnel? A funnel sends something with a specific goal in mind. Abandoned cart: reminders after an hour, a day, three days. Automatic."

**09-12 · 0:15** "Onboarding: a new customer gets to know your business one section at a time."

**09-13 · 0:20** "And this is a simple CRM we built with AI. A CRM is just your customer list, knowing which box each person is in. The same customer, moving between boxes. Ask AI to build it with you. The funnels. The CRM. The emails."

**09-14 · 0:30** "The skills behind the follow-up. email-sequence writes the email series, and it's in the download at the end. whatsapp-sequences does the WhatsApp side. That one runs on my own machine, so it's not in the download."

**09-15 · 0:10** "Reviews come in. The week's results pour out. Now, did any of it work?"
[NEXT.]

### Scene 10 · Optimize · 2:40 (39:45 to 42:25)

- **New here (scene 02 gave failures and successes):** what to count, the giveaway trap, and what doubling down looks like in practice.
- **On screen:** the week's five posts; the website pane morphs into a dashboard; tap to sort; the success cards clone into next week; then near-black.

**10-1 · 0:20** "Here's Amberkloof's week. Five posts. [The lights lower.] Let's look at them properly."

**10-2 · 0:30** [The website morphs into a dashboard.] "Same posts, through a results lens. Each one now shows how many people saw it, how many commented, and how many asked to buy. Demo numbers, but your own pages give you the same three."

**10-3 · 1:00** [TAP to sort.] "Let's sort. Tuesday's flat photo: hardly anyone engaged, no inquiries. Thursday's giveaway: 1,200 likes. Zero inquiries. [Pause.] Monday's how-to post answered a real question, and the self-care regulars asked to buy. Friday's ad looked like a gift worth giving, and the Gift Planners ordered. Average is counting likes. Good is counting inquiries, and knowing who they came from."
- **[ASK]** "What do you count every week? Likes, or inquiries?"

**10-4 · 0:35** [The success cards clone into next week.] "So we double down. Monday and Friday get copied into next week. Tuesday and Thursday are marked stop or fix. Tumelo does the same, but it counts quote requests from founders, not followers."

**10-5 · 0:15** [Near-black. Only Tuesday's photo stays lit. Wait three seconds.] "Tuesday's post. Let's fix it."
[NEXT.]

### Scene 11 · Attract (the peak) · 4:05 (42:25 to 46:30)

- **New here:** the second AI. Attract and Interact. Why people choose what looks good, and the five layers that turn a flat photo into an ad people stop for.
- **On screen:** the letters A and I; Tuesday's flat photo rebuilds itself layer by layer into a floating studio ad; the switchboard; real ads; the reference card; the camera pulls back to a shop window at dusk.

**11-1 · 0:40** "So far: E, C, O. Now, AI. And no, not that AI. [The letters resolve.] A for Attract. I for Interact. They sound like Engage and Convert, but they're different. Engage gets people to respond. Attract is why they stop at all: it looks worth it. Convert asks for the next step. Interact lets them get to know you first."

**11-2 · 0:17** "Here's Tuesday's photo. White table, harsh flash. That's Average. Watch what happens, one layer at a time. Layer one: light. [Warm plaster, one key light.]"

**11-3 · 0:15** "Layer two: depth. A plinth. Stone behind it. Things at different distances."

**11-4 · 0:18** "Layer three: break-out. [The products float out of the phone.] A flat product photo sits there. A product that floats out to meet you makes you look twice."

**11-5 · 0:13** "Layer four: the offer. 'Gift set. Wrapped. Delivered Friday.'"

**11-6 · 0:27** "Layer five: the button, inside the picture. 'Order on WhatsApp.' [The label flips to Good.]"
- **[ASK]** "Now you choose. Which layer should I switch off? Shout it." [Switch off what they call. Then switch it back on.] "See what fell apart? That one decision was doing a lot of the work."

**11-7 · 0:45** "Why does this work? Because we're wired to like things that look good. It's why shops pack everything neatly. It's why merchandising is a whole job. It's why beauty, make-up and clothing are such big industries. [The neat shelf and the messy shelf.] Whatever you're creating, it needs to be attractive."

**11-8 · 0:38** **[PLAY]** "Real ads that get this right. [Tap one.] Each card says what pulls you in, and what people did with it. And remember the Oh So Heavenly and Dash Labels ads from earlier? Look at them again with this lens."

**11-9 · 0:20** "Our own pair. The flat snapshot, and the floating ad. And Tumelo's version: your packaging is your shelf ad."

**11-10 · 0:12** "This is the reference we learned from. We took the ideas, not the pictures. [The camera pulls back to a shop window at dusk.]"
[NEXT.]

### Scene 12 · Interact, then teach AI · 4:40 (46:30 to 51:10)

- **New here:** first attract, then interact; every tap should give something back; a walkthrough you choose from beats a static grid; the real oryzo.ai next to our plain version; AI has to be shown success, judged, and taught to recreate it.
- **On screen:** the shop window; product taps burst into detail arcs; the walkthrough; oryzo.ai live in a frame or a presenter tab; a judge step-through; the generic look shatters.

**12-1 · 0:25** "First attract, then interact. Think of a lit shop window at night. It pulls you in. And then you want to know more. Interaction is letting people get to know you."

**12-2 · 0:25** [TAP the bottle.] "Tap the bottle. [The detail arc bursts out.] Ingredients. Size. Price. Proof. 'Ask us on WhatsApp.' Every tap gives you something back, straight away."

**12-3 · 0:20** "And with ads, people do more than look. They comment, save, share, tap a product tag, try it on, send a message. Each of those is a door to the next step."

**12-4 · 0:30** "Average: a grid of products, and a 'Contact us' button that goes nowhere you can see. Good: you walk through it. Pick the oil. Pick the butter. Pick the box. And it ends in a WhatsApp chat with your order already typed."

**12-5 · 0:15** "Now a website. First, our own plain version of a scrolling product page. Decent. Tidy. That's Average. [Open the real oryzo.ai, in the frame or the presenter tab.] And this is the site that inspired it, oryzo.ai, built by the studio Lusion. That's Good. [Scroll it.] One object you follow the whole way down. That's the bar."
- **[ASK]** "When last did a website make you want to click around? Which one was it?"

**12-6 · 0:15** "House Down Studio. Watch how their work leads you, step by step, to contacting them."

**12-7 · 0:15** [If a third site is loaded: one line on what you do there and what it gives back. If not: stay on oryzo and keep scrolling.]

**12-8 · 0:20** [If two provider quotes are on screen: read them, with who said them. If not: skip straight to 12-9.]

**12-9 · 0:15** "Here's the catch. AI doesn't know what good looks like, or how a good interaction works. You have to show it success. [The slider: one line of prompt, against the same request with real examples.]"

**12-11 · 0:20** "Then we let AI judge. Three critics score the work, round by round. [Step through.] It fails, we fix it, it goes again, until all three agree. That skill is called design-loop."

**12-12 · 0:20** "Recreate the look. Amberkloof's design system makes a new piece that matches the brand."

**12-13 · 0:25** "Recreate an interaction. We gave AI the click-and-burst idea from a reference, and it rebuilt it for Amberkloof. That's what you just tapped."

**12-14 · 0:10** [The generic AI look shatters.] "Show AI what success looks like."

**12-15 · 0:15** "Tumelo's version: build your box. Size, finish, and an instant quote."

**12-16 · 0:10** "Tap 'Ask us', and the chat asks first: 'May we use your details?' Which brings us to doing this properly."
[NEXT.]

### Scene 13 · Use AI responsibly · 2:15 (51:10 to 53:25)

- **New here:** check every claim, never fake proof, and know what you may paste into a public AI tool.
- **On screen:** AI's product description; a red pen; each false claim shatters when corrected; the sorting exercise.

**13-1 · 0:15** "AI wrote this product description for the bottle. Before you post anything AI wrote: check it, be honest, protect people's information."

**13-2 · 0:50** "Exercise one. [CLICK 'clinically proven'.] No source. Gone. [CLICK 'heals eczema'.] That's a medical claim, and Amberkloof never makes those. Gone. [CLICK the five-star review.] And this review? AI made it up. A fake review is a lie with your name on it. Gone. What's left is true, and it says AI helped write it."

**13-3 · 0:40** - **[ASK]** "Exercise two. Would you paste this into ChatGPT? Yes or no?"
"A customer list with names and numbers? [Room answers.] No. Take the names out first. Sales totals with no names? Yes. A customer's WhatsApp chat? No. [Tap each one for the reason on screen.] And a race field? Only if the customer told you, and never into a public tool."

**13-4 · 0:20** "Three words. Check. Be honest. Protect. And if you sell to businesses: don't scrape personal emails off LinkedIn for cold mail. Under POPIA, direct marketing needs consent."

**13-5 · 0:10** "Which is why [Name] said yes earlier. Their public pages and socials, and their own answers about the business. No customer details. Deleted in 30 days. Their results are ready."
[NEXT.]

### Scene 14 · Your turn: Tool A and Tool B · 3:35 (53:25 to 57:00)

- **New here:** the two tools you can use on your own business.
- **On screen:** a pedestal rises; Tool A's panels; strengths, gaps, next steps; Tool B's persona card and brand kit; two QR codes.

**14-1 · 0:15** "Now for a real business in the room. [Name], this one's yours. These runs started [read the time on screen], when you said yes."

**14-2 to 14-6 · 0:55** **[LIVE: Tool A]** "Tool A scans the whole business. What you do, from your website. Your social pages. Your competitors, and what we'd suggest you do on social. Whether AI can even reach your site. And whether AI quotes you when people ask about what you do. [Spend your time on competitors and AI reach. One line each for the other three.]"

**14-7 · 0:40** "Then three tabs. What's working. What isn't. And what to do next. [Read one strength, one gap and one next step.] [Name], which of these would you fix first?"
- **If Tool A is not live:** "Tool A isn't public yet. So let's put together what the tools already found on [business] today: the competitor scan, the keywords, the SEO check, the backlinks and the citations. That's the same picture, in pieces."

**14-8 · 0:15** **[LIVE: Tool B]** "Tool B starts from the six answers [Name] gave at the door."

**14-9 · 0:30** "And here's their customer, as a card, just like the Gift Planner. [Read the card.] [Name], does that sound like your customers?"

**14-10 and 14-11 · 0:30** "Then a brand kit from their current content. Colours, fonts, voice. And one post for their best platform, in their own look."
- **If Tool B is not live:** "Tool B isn't open to the public yet. It does for your business what you saw us do for Amberkloof: the customer card, then the brand kit."

**14-12 · 0:20** "[Name], thank you. Give them a hand. [Applause.] Two codes. One for each tool. Scan now, and run your own business."
- **If the codes aren't on screen:** "These open to the public soon. [Say how people will get the links: through GTP, or your own channel. Your call.]"
- **[ASK]** "Who's running theirs tonight? Hands up."

**14-13 · 0:10** "And everything you need next goes in one box."
[NEXT.]

### Scene 15 · Keep learning, the 7-day test, the close · 3:40 (57:00 to 60:40)

- **New here:** the free skills download, where to learn by stage, and your own one-week test.
- **On screen:** the kraft gift box opens; eight skills rise; the learn links by stage; the plan card; the bottle settles in the box; the QR to the skills page.

**15-1 · 0:10** "Keep learning. [The box opens.] Tumelo made this box, by the way."

**15-2 · 0:45** "Inside: eight free marketing skills from Anthropic, the company that makes Claude, on an open licence. [They rise one by one.] Brand review checks your work against your brand. Campaign plan plans a campaign. Competitive brief sizes up a competitor. Content creation and draft content write the first draft. Email sequence writes your follow-up emails. Performance report tells you what worked. And SEO audit checks your website."

**15-3 · 0:30** "Does a skill make a difference? Same request, a campaign plan, with the skill and without it. [Read one line from each.] Hear the difference? That's what a recipe does."

**15-4 · 0:10** "And the capture skills from earlier, C-R-O, popups and signup? They're not in this box. Their address is on screen. Take a photo."

**15-5 · 0:40** "Where to learn more, by stage. [CLICK Engage.] Meta Blueprint, and the WhatsApp Business app. [CLICK Convert.] HubSpot Academy, and Google Skillshop. [CLICK Optimize.] Search Console Help, and Google Analytics. [CLICK Attract and Interact.] Google Business Profile, and Grow with Google. [CLICK AI skills.] Claude Academy, and the Information Regulator's POPIA guidance. Every link is on the skills page."

**15-6 · 1:00 (20 s talk, then the 40 s write): the 7-day test**
"So here's your test for the next seven days. It's small on purpose. Four picks. One customer, from the list you wrote earlier. One platform where they already are. One action: post something, capture details, or follow someone up. And one number you'll check next Friday. Write it down. Forty seconds. Go."
[The plan card builds: tonight, this week, 30-60-90. Copy works offline. The timer holds the page.]

**15-7 · 0:25 · the close** [The bottle settles into the box. The lid closes on the QR.]
"An hour ago, this bottle was a brand nobody had heard of. We found out who buys it, and it wasn't who we guessed. We picked where to show up, and why. We let AI write the first draft, and we kept our own voice. We gave people a next step, and we followed up. We counted what worked. We made it worth stopping for. And we ran one of your businesses through the same tools, live.
None of that needs a big budget. It needs one week, and the card in your hand.
Be found. Be chosen. Keep learning. Thank you."
[Hold. Leave the QR up.]

## 5. No-repeat checks

### 5.1 Each scene teaches one new thing

| Scene | New point | Not re-taught (where it was taught) |
|---|---|---|
| 01 | The promise of the hour and the product that carries it | |
| 02 | The ECO loop; capture details; failures vs successes, why, to whom | |
| 03 | Data, not a feeling: gather, group, persona; B2B persona | |
| 04 | Two or three platforms with a reason; records beat research | who the customer is (03) |
| 05 | Education vs promotion by group; the competitor recipe; the gap; B2B find | where they are (04) |
| 06 | AI drafts; skills and how to run one; bare prompt looks like everyone's; brand guideline; real ads; voice (slopmonster); Last 30 Days; habit week | "Copy what works. Then fill the gap." (said once, in 05) |
| 07 | Website and Google; AI searches the web; SEO, AEO, GEO; four checks; authority; 30/60/90 | copying competitors' social formats (05; trimmed from 07-8) |
| 08 | Where capture goes; AI helper; timed pop-up; CTA inside the ad; capture skills | why capture and name, surname, email (02) |
| 09 | Four places AI answers; reply speed; lifecycle; funnel; pipeline; reviews; CRM; follow-up skills | capture skills (08) |
| 10 | What to count; the giveaway trap; doubling down in practice | failures and successes (02) |
| 11 | Attract vs Interact; the five layers; why beauty sells; 3D floating product vs flat photo | |
| 12 | Every tap pays back; walkthrough vs static grid; real oryzo.ai vs our plain version; teach, judge, recreate | "a skill beats a bare prompt" (06; 12-9 and 12-10 merged to one line) |
| 13 | Check claims; no fake proof; what to paste into public AI | race only if stated (03 says the rule; 13 practises it) |
| 14 | The two tools on a real business | |
| 15 | Free skills; where to learn; the 7-day test; the close | conversion skills (08 and 09; 15-4 is a pointer only) |

### 5.2 Customer questions: each used once

| Question as spoken | Scene | Note for the builders |
|---|---|---|
| "Is this OK for sensitive skin?" | 02-2 | on screen already (built) |
| "Can I use face oil under my make-up?" | 05-2 | education example. The spine's "Is marula OK for sensitive skin?" repeats 02, so the screen should show this one |
| "Do you deliver to Centurion?" | 09-4 | DM example |
| "How much would a gift set for 20 guests cost?" | 09-6 | the owner's example, used once only |
| Search typed: "marula face oil Pretoria" | 06-15, 07-1 | a real keyword from the cached run. The spine's "gentle face oil for sensitive skin Johannesburg" repeats the sensitive-skin question, so the screen should show this one |
| Visitor to the helper: a birthday present for their mom | 08-3 | the spine's "gift for my mom, sensitive skin" repeats 02. Drop "sensitive skin" on screen |

The retired catering example (Amina's Kitchen) and its portion question: zero uses.

### 5.3 What is not runnable today, and what the script says

| Slot | Status (spine v2.1) | Line in the script |
|---|---|---|
| B2B find (05-6) | BLOCKED: Apify key; no live or cached run | "needs a key... the two steps, not results" |
| Last 30 Days (06-13) | BLOCKED: review and key; no live or cached run | "needs a key and a review before I'll run it on a stage" |
| CTA ads (08-7) | 0 of 3 sourced | "here's the pattern instead" |
| Gallery ads (11-8) | 1 of 6 sourced, plus the 06 callbacks | callback to Oh So Heavenly and Dash Labels |
| Third website, provider quotes (12-7, 12-8) | not sourced | skip lines |
| Tool A (14) | BLOCKED: release and keys | "the same picture, in pieces" |
| Tool B (14) | HELD | "what you saw us do for Amberkloof" |
| QR codes (14-12, 15-7) | wait on public URLs | owner says how links will be shared |

## 6. Receipts

- **Source of the beats and seconds:** `experience/story-spine-v2-timing.md` sections 3 and 8, cut ranks 1 to 29 (Tiers 1 to 3), plus the two redundancy trims above. Scene sums: 120, 180, 345, 250, 265, 375, 295, 260, 295, 160, 245, 280, 135, 215, 220 = 3,640 s = 60:40.
- **Facts used in speech:** Google search share and WhatsApp use from `experience/research/g02-real-runs.md` (fact-checked TRUE). Ads from `g02-logos-and-ads.md` §4A. Slopmonster pairs from `g02-real-runs.md` (d). Cached-run lines from `assets/cached-runs/*.json`. Learn links from `g07-learn-links.md`. The owner's line on AI and social media is kept as spoken; its fact-check came back MOSTLY-TRUE, so the qualifier stays optional (Q-FACT).
### 6.1 humanizer-loxly, SPOKEN mode (2026-10-28, about 04:40)

- **Order:** the 29 written patterns first, then S0 to S11 from `references/spoken.md`, then the two-pass audit ("what still sounds AI?", then "where would a listener get lost?").
- **S0 bugs found and fixed (claims that fail when heard once):**
  1. 01-2 promised the three lines would be "working" by the end of the hour. Changed to "knowing how to do those three".
  2. 12-5 said "a page like this" before any page was on screen. Now our plain page comes first, then the real oryzo.ai.
  3. 15-3 described the with/without skill outputs before they were read. Now you read them and ask "Hear the difference?"
  4. 06-11 mentioned "the checker's scores" before any score was introduced. Now the score is introduced first.
  5. 06-2 claimed "less than half a minute" for any live run. Now it quotes the measured time ("when we timed it, about twenty seconds").
- **Spoken patterns applied:** S3 check-ins ("Simple enough, right?"); S4 the listener's question asked aloud ("So what's a funnel?", "So how do we test it?"); S6 say it shorter ("Fewer places. Better reasons."); S8 name the discomfort before both writes; S11 plain words ("robots file", "AI crawlers" and "Google Maps scrape" replaced; CRM and C-R-O explained).
- **Written patterns fixed:** "Here's the thing" (throat-clearing); a quoted "can help you" (hedged benefit); a four-item list that read as a rule-of-three; four extra uses of "actually"; "All free" removed (not every link's cost was checked).
- **Second audit, where a listener could get lost:** scene 06 has the most ideas in a row, so 06-3 to 06-6 stay short and the screen carries the five habits; scene 07 now says up front that four checks are coming.
- **Flags for you (not changed automatically):**
  1. 07-2: your line "AI cannot go into social media all by itself" came back MOSTLY-TRUE in the fact-check. The qualifier is in brackets; say it or leave it (Q-FACT).
  2. 01-2: put your own name in.
  3. 14-12: decide how people get the tool links if the QR codes are not live.
  4. Section 5.2: three on-screen questions in the spine repeat "sensitive skin". The builders should use the questions in that table.

### 6.2 Lint results

| Check | Input | Result |
|---|---|---|
| slopmonster `tools/deslop.py` | 166 spoken passages, about 5,075 words, extracted from section 4 | first run 3/5 (throat-clearing opener, hedged benefit, two list shapes, one an extraction artefact); after fixes **5/5 CLEAN** |
| slopmonster `tools/deslop.py` | `presentation-cue-card.md` | 4/5 on "10 customers" (read as invented proof); changed to "ten customers" |
| humanizer `tools/lint.py` (a WRITTEN-mode gate; SPOKEN mode does not require it) | the same spoken passages | first run 4/5 on "actually" ×6; now 4/5 on "actually" ×2. Both are in your exact on-screen sentence "Start with the people who actually buy, inquire, and come back", so they stay |
| em dash and en dash count | both files | 0 and 0 |
| slopmonster rival-model cleanse (`cleanse.sh`) | | not run: the task asked for the lint, and the deadline came first |

Next action: pick your opener (A, B or C) and read scene 04 aloud once with the consent line.
