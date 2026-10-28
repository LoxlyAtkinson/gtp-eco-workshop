**Next action (builder, about 5 minutes):** before you touch scenes 01-03, read the lines tagged BUILD below. When you capture proof (G01-T09), tick each line against a screenshot, and only against a screenshot.

# G01 slide spec: Paste B, sentence by sentence (slides 1, 2 and 3)

- **Source:** `experience/owner-brief-2026-10-27.md`, Paste B. Every sentence is quoted verbatim, typos included. Sentences are in order, and none is skipped.
- **Binding decisions:** G2 (base is the local tree, corrected), G3 (race), G7 (hero brand), G9 (auto-scroll), G15 (slides 1-3 first). The hero brand is Amberkloof, with Tumelo Print & Pack as the B2B swap-in (`experience/story-spine.md` section 1).
- **How to read a line:** the owner's sentence, then `->` and what must be true on screen. A line tagged `CONTEXT` sets no build requirement on its own, but the build must not contradict it. A line tagged `BUILD` is an acceptance item.
- **Shared with:** `experience/story-spine.md` section 4 holds an identical copy. If one changes, change both in the same step.

## Preamble

- [ ] P-01 "I'd like to talk through this presentation so that it's aligned with how I want to do things." -> CONTEXT: the owner's notes, not the builder's taste, decide slides 1-3.
- [ ] P-02 "So I'm just going to scroll through it and give my thoughts page by page." -> CONTEXT: each slide has its own contract. The page numbers follow the 15-scene deck.

## Slide 1 (scene 01, Open) and the navigation rules he gave there

- [ ] S1-01 "Beginning page, number one, or page number one, looks good." -> BUILD: keep slide 1's structure (subject label, the three-part promise, a moving visual). Restage it with the Amberkloof bottle, but do not tear the slide down.
- [ ] S1-02 "The only thing is I wouldn't probably say at the left-hand side, top, GPT Field Guide." -> BUILD: "GTP Field Guide" (or "GPT Field Guide") appears nowhere in the deck header. Flag `tool/index.html:16,43`, which still says "GTP FIELD GUIDE", to G05.
- [ ] S1-03 "I would probably just say Sales, Marketing and AI, and I'll make that bigger so people can see it." -> BUILD: the top-left label reads exactly "Sales, Marketing and AI". It renders at 28 px or more at 1366x768 (twice the current 14.4 px), is the dominant top-left identity, and is visible at 390x844 (it is hidden there today by `scroll-experience.css:183`).
- [ ] S1-04 "Be found, be chosen and keep learning, that is fine." -> BUILD: keep the headline "Be found. Be chosen. Keep learning." exactly.
- [ ] S1-05 "So I can open with, I can think of an opener." -> BUILD: the scene gives the presenter an opening moment (an audience question beat) before the scroll reaches the ECO preview.
- [ ] S1-06 "You can help me with thinking of an opener for that beginning slide." -> BUILD: write three opener options (the directions are in story-spine 3.2, scene 01), run them through `slopmonster`, and keep a before and after record in `experience/g01-opener.md`.
- [ ] S1-07 "Let's see." -> CONTEXT: no requirement.
- [ ] S1-08 "You do have notes, so maybe add this to the notes and then we can go through it together." -> BUILD: the three opener options sit in the scene 01 speaker note, and the presenter can see them in the Notes panel. OG-OPENER (the owner picks one) stays open until he answers.
- [ ] S1-09 "The other thing is I always need to scroll down, right?" -> CONTEXT: the problem statement for auto-scroll.
- [ ] S1-10 "So the problem is with scrolling down while talking is my focus." -> BUILD: the presenter never has to scroll to make a scene progress.
- [ ] S1-11 "My focus isn't consistently going to be on having to scroll down." -> BUILD: opening Notes, clicking an in-scene control or talking for a long time must not freeze the deck in a state that needs a manual scroll to recover. Notes open with motion still running is an acceptance item.
- [ ] S1-12 "So I would probably say that each and every page, one to fifteen, should just start scrolling, but on its own and at a certain pace." -> BUILD: all 15 scenes auto-scroll at a pace set from their talk minutes (`sceneMinutes` in story-spine 3.3), with a presenter speed control.
- [ ] S1-13 "So as it, so I would probably say just before it transitions into the next page, it should start scrolling." -> BUILD (read together with S1-14 and S1-15, which correct it): motion runs from the scene's start and **stops just before** the next scene's transition, then waits for Next.
- [ ] S1-14 "And the scroll starts at the beginning of each and every page already." -> BUILD: motion starts within 1 s of arriving on any scene, whether you arrive on open, by Next, by Overview or by a chapter jump.
- [ ] S1-15 "So page one starts scrolling as soon as I open the page, and it scrolls until just before the next page comes up, which is going to be, The growth is a loop, make each turn useful." -> BUILD: on open, scene 01 moves within 1 s. It stops with the scene 02 headline "Growth is a loop. Make each turn useful." not yet on screen, and holds until Next.

## Slide 2 (scene 02, ECO loop)

- [ ] S2-01 "Now there we've got this engage, convert and optimize section." -> CONTEXT: slide 2 is the ECO section.
- [ ] S2-02 "The only thing with that is we can start off by showing all three: engage, convert and optimize." -> BUILD: the arrival state shows Engage, Convert and Optimize together at equal weight.
- [ ] S2-03 "And then what I'd like is as you scroll down, the word engage becomes more prominent, or it moves to the center and it becomes bigger, so that at that stage I can mention engage and then talk about engagement: what is engagement, etc." -> BUILD: at the first scroll beat (auto or manual), the word Engage moves to the centre and grows to at least 2x its arrival size.
- [ ] S2-04 "So in the slide itself, it says know who, where and what matters." -> CONTEXT: the old live copy.
- [ ] S2-05 "I don't know if that really is going to convey what engage means." -> BUILD: the string "Know who, where and what matters." is absent.
- [ ] S2-06 "So engagement is what catalysts are there, or what catalysts drive engagement." -> BUILD: the Engage explanation names catalysts, the things that make people respond. Shown as 3 or 4 picture chips (a question answered, a striking picture, an offer, a story) that turn into reactions (like, comment, save, message).
- [ ] S2-07 "So you want people to be able to interact with you, or engage with what you're doing, or what you're posting, or what they are seeing." -> BUILD: the Engage line says people interact with what you do, post or show. Amberkloof example: a post of the face-oil bottle gets a comment, "Is this OK for sensitive skin?"
- [ ] S2-08 "So, but engagement, I would probably..." -> CONTEXT: an unfinished thought, no requirement.
- [ ] S2-09 "So that's what I give the title of engagement." -> BUILD: the Engage heading carries that meaning (for example "What makes people respond?"), not a generic label.
- [ ] S2-10 "It just needs to be clear." -> BUILD: a blind reader shown only the Engage state can say what engagement means in one sentence (the G01 O1 mini-critic covers this).
- [ ] S2-11 "And then convert becomes after engagement starts." -> BUILD: the order is fixed as Engage, then Convert, then Optimize.
- [ ] S2-12 "So that'll be the next section." -> BUILD: Convert is the second beat.
- [ ] S2-13 "Again, convert would then come up to the center and it will become bigger, and it will explain what convert is." -> BUILD: at the second beat (or a click), Convert takes the centre and grows, with its explanation underneath.
- [ ] S2-14 "And convert is right after engagement, meaning that engagement gets the attention and gets people talking, or engaging with your content." -> BUILD: the Convert state shows a link back to Engage: "Engagement got their attention."
- [ ] S2-15 "Conversion, or convert, means that while you have their attention, there's a clear next step." -> BUILD: the Convert headline says this. Proposed wording: "While you have their attention, give them a clear next step." It gets a slopmonster pass.
- [ ] S2-16 "And one of the biggest things in conversion is you cannot convert without knowing who you're converting to." -> BUILD: a visible line says you cannot convert people you do not know.
- [ ] S2-17 "Sorry, who your audience is that is engaging with you." -> BUILD: that line is about the people engaging with you right now (the commenter from S2-07), not a generic audience.
- [ ] S2-18 "So conversion, there's a step of accumulating information." -> BUILD: a capture step is drawn as a small form that fills in.
- [ ] S2-19 "This normally starts with a simple thing like a name and a surname and an email address." -> BUILD: the form shows exactly three fields, Name, Surname and Email, filling in.
- [ ] S2-20 "And conversion tactics involve multiple things, and we can mention these things." -> BUILD: a short "Tactics" list follows the form.
- [ ] S2-21 "Conversion tactics could mean that while these people are engaging, we get their details." -> BUILD: tactic 1 is "Get their details while they are engaging".
- [ ] S2-22 "That's number one." -> BUILD: tactic 1 is numbered 1.
- [ ] S2-23 "Number two, we could offer something to the people that are engaging, like a newsletter, like an email, like something free or something worth value, as long as we are thinking in the spectrum of converting them to a client." -> BUILD: tactic 2 is "Offer something of value: a newsletter, an email guide or a free sample", with the aim "on the way to becoming a client" visible. Amberkloof example: a free 5 ml sample in exchange for an email.
- [ ] S2-24 "And then after that is optimize, and it's exactly what it says." -> BUILD: Optimize is the third beat.
- [ ] S2-25 "So it does measure the outcomes that you received from both ends." -> BUILD: the Optimize explanation says it measures results from both ends, engagement and conversion, shown as two input lanes.
- [ ] S2-26 "Right?" -> CONTEXT.
- [ ] S2-27 "So we need to frame it like optimize again, by the way." -> BUILD: Optimize gets the same treatment as Engage and Convert (centred and bigger).
- [ ] S2-28 "So it comes to the middle, gets bigger, and then we have things coming up that says failures and successes." -> BUILD: in the Optimize state, two labelled visual elements, FAILURES and SUCCESSES, rise in after the word centres.
- [ ] S2-29 "Failures is you need to know where you're failing, meaning which posts, which things that you did did not work." -> BUILD: FAILURES holds post thumbnails (Amberkloof posts), not abstract text.
- [ ] S2-30 "So which did not drive engagement or conversion." -> BUILD: failure type A, "No engagement, no conversion".
- [ ] S2-31 "Even within that, which drove engagement, but it didn't drive conversion." -> BUILD: failure type B, "Engagement, but no conversion" (for example, many likes and 0 inquiries, labelled as illustrative).
- [ ] S2-32 "So that's one." -> CONTEXT.
- [ ] S2-33 "Number two is successes." -> BUILD: SUCCESSES is the second element.
- [ ] S2-34 "So which ones did do both, and why?" -> BUILD: a success card shows "Drove both", plus a WHY chip (for example "Answered a real question").
- [ ] S2-35 "Right?" -> CONTEXT.
- [ ] S2-36 "So, and to who." -> BUILD: the success card shows a TO WHOM chip (for example "Gift planners, 35-49").
- [ ] S2-37 "That's very important." -> BUILD: TO WHOM is visually the strongest chip on the success card, larger or accented.
- [ ] S2-38 "So why and to who it drove that conversion to." -> BUILD: WHY and TO WHOM appear together on the success card.
- [ ] S2-39 "Then we close that slide." -> BUILD: the scene holds after Optimize and waits for Next.
- [ ] S2-40 "Let's keep all of that information and animation that I've just said in the second slide, where the words like engage, convert and optimize come to the center, and then there's a brief explanation of what it means and what it entails." -> BUILD: all of S2-02 to S2-38 lives in scene 02. Each explanation is brief: at most a heading plus 2 short lines plus the visual chips. No paragraphs.
- [ ] S2-41 "And again, it should auto-scroll, but for this specific slide, I would like to be able to click on it." -> BUILD: scene 02 auto-scrolls through the three beats, and each word is also a button.
- [ ] S2-42 "So I would like to be able to click on engage, and then the animation happens for engage." -> BUILD: clicking Engage plays the Engage animation (centre, grow, explanation) from any state.
- [ ] S2-43 "And then I would like to be able to click on convert and click on optimize when I get to that section." -> BUILD: Convert and Optimize clicks do the same. A click holds auto-scroll on the chosen state, and Next moves on.
- [ ] S2-44 "So obviously convert and optimize is not going to be completely off of the page." -> BUILD: the two words that are not selected stay visible, at least 40% opacity, on screen and readable.
- [ ] S2-45 "It's just that engage is going to be highlighted into the middle." -> BUILD: only the selected word is centred and highlighted.
- [ ] S2-46 "Convert and optimize is going to move away." -> BUILD: the words not selected step aside to the edges, smaller.
- [ ] S2-47 "And when I click on convert, then convert goes to the middle, centered, all the attention there, everything that has to do with convert comes underneath it, and so on and so forth." -> BUILD: each word's details render underneath it when it is centred, and only that word's details show.
- [ ] S2-48 "Once I finish off with optimize, I'll probably click on next." -> BUILD: Next is visible and pulses when the Optimize state has played.
- [ ] S2-49 "Now when I click on next, whether I click on next, so when I click on next, it's going to go to the next page, right?" -> BUILD: Next always lands on the next numbered scene's top.
- [ ] S2-50 "However, again, the animation on that page is going to not show." -> BUILD: the reported defect must not occur. The landing scene's animation shows.
- [ ] S2-51 "If I click on next, then it happens pretty quickly and the page is stationary." -> BUILD: the landing scene is never stationary after Next.
- [ ] S2-52 "So again, when I click on next, that animation should start, or that scroll effect should start." -> BUILD: after Next, scrollY increases within 1 s with no other input. Proof-of-proof: disable the restart call and the check must fail.
- [ ] S2-53 "For now, I'm going to finish here because I want you to first do the changes for me on the first two slides, as well as number three." -> CONTEXT: G15. Slides 1-3 are built first, then the build continues.

## Slide 3 (scene 03, Engage > Who?)

- [ ] S3-01 "All right, so then there is a title that says engage and then who." -> CONTEXT: the "ENGAGE / WHO" title.
- [ ] S3-02 "Now the problem is that you cannot see the title, right?" -> BUILD: the ENGAGE and WHO? title is display size (at least 72 px at 1366x768) and is the first thing that animates.
- [ ] S3-03 "You can see your ideal customer is a hypothesis." -> CONTEXT: the old live headline.
- [ ] S3-04 "However, that sentence doesn't convey what exactly we are saying." -> BUILD: "Your ideal customer is a hypothesis." is not the headline anywhere in scene 03.
- [ ] S3-05 "It doesn't convey in any way or means." -> CONTEXT.
- [ ] S3-06 "So those are the biggest words on the slide, meaning that people are going to focus on it." -> BUILD: whatever the biggest words are, they must carry the slide's message on their own.
- [ ] S3-07 "But if it doesn't say, if the people don't understand it immediately, it really has no effect." -> BUILD: a blind O1 mini-critic shown only a scene 03 capture answers "you probably don't know your best customer yet; your records tell you" (G01 evidence row).
- [ ] S3-08 "So we need to change that." -> BUILD: the headline is replaced. Proposed: "Do you really know who buys from you?" with the sub-line "Most owners guess. Your records know." It gets a slopmonster pass.
- [ ] S3-09 "So number one, I would probably say that the title there, engage and with who, should be animated, so I can start saying, you know, we're firstly going to discuss engagement, and then the word engage needs to be again highlighted, and then who, and then a question mark, and then we go to your ICP, and we explain what we mean here." -> BUILD: the title animates in this order, one at a time, at the presenter's talking pace: (1) ENGAGE highlighted, (2) WHO, (3) a large "?", (4) the ICP explanation. The term "ideal customer profile (ICP)" is spelled out once.
- [ ] S3-10 "So what we mean by your ideal customer is a hypothesis is we want to explain that currently you probably don't know who your ideal customer is." -> BUILD: the slide's first message is "you probably don't know who your ideal customer is yet".
- [ ] S3-11 "And this slide has to convey that, that you don't actually know." -> BUILD: it is conveyed visually. The "assumption" card ("Our customer: women 25-34 who love natural skincare", tagged "A feeling") is contradicted by the data animation.
- [ ] S3-12 "And if you do, kudos to you, but most people don't know." -> BUILD: the speaker note carries the "kudos if you do, most people don't" line.
- [ ] S3-13 "Your ideal customer isn't something you thumb suck, and it isn't something that you just know." -> BUILD: the assumption card is visibly stamped "Guess" or "Thumb-suck" before the data replaces it.
- [ ] S3-14 "It shouldn't be that." -> CONTEXT.
- [ ] S3-15 "It shouldn't be a feeling." -> BUILD: the words "not a feeling" or "A feeling" appear on the assumption card.
- [ ] S3-16 "It shouldn't be a..." -> CONTEXT: an unfinished thought.
- [ ] S3-17 "All right." -> CONTEXT.
- [ ] S3-18 "So what I wanted to say now was, we start with your ideal customer hypothesis, although we need to change it." -> BUILD: the hypothesis framing is reworded (see S3-08). The idea that a first guess gets tested survives in the notes.
- [ ] S3-19 "But it starts by saying, Start with the people who actually buy, inquire, and come back." -> BUILD: the DOM contains, verbatim, "Start with the people who actually buy, inquire, and come back." This is a string check.
- [ ] S3-20 "That's perfect." -> BUILD: no rewording of that sentence, not even "for flow".
- [ ] S3-21 "We need to keep that there." -> BUILD: the sentence stays visible through the infographic beats.
- [ ] S3-22 "Although that sentence has no animation." -> BUILD: the sentence animates. Its three verbs light up in step with three data streams.
- [ ] S3-23 "So that's actually what you want to convey." -> CONTEXT.
- [ ] S3-24 "You want to convey it in an animated form, something that people can pay attention to, what you're saying in the slide, which is start with people who actually buy, inquire, and come back." -> BUILD: three animated streams run, each tied to a verb. BUY is order tokens (shop and markets). INQUIRE is message bubbles (WhatsApp and DMs). COME BACK is repeat-order tokens with a loop arrow.
- [ ] S3-25 "And you want to convey it not with words." -> BUILD: the infographic beats use icons, pictures and motion. On-screen text in them is limited to labels of 3 words or fewer.
- [ ] S3-26 "You want to convey it with animations, pictures, etc." -> BUILD: generated customer pictures (media M11) and product pictures (M03, M08) appear in the scene.
- [ ] S3-27 "Even an infographic that's animated that shows you exactly what analysis of your customer looks like." -> BUILD: the infographic runs capture, then rows, then groups, then a persona card. The streams land as table rows. The rows sort into 3 groups (Gift planners, Self-care regulars, Guesthouses and spas). One group becomes a persona card. Every number is tagged "Illustrative sample".
- [ ] S3-28 "The next sentence says, Ask what job they need done before guessing demographics." -> CONTEXT.
- [ ] S3-29 "Now that sentence in general doesn't say anything." -> BUILD: the DOM does not contain "Ask what job they need done before guessing demographics." This is a string check.
- [ ] S3-30 "There's no clear— when I read that sentence, even me, I'm confused." -> BUILD: no replacement sentence may use jargon (no "jobs to be done", "JTBD" or "demographics" as a bare noun).
- [ ] S3-31 "What the hell are you saying, right?" -> CONTEXT.
- [ ] S3-32 "What are you talking about?" -> CONTEXT.
- [ ] S3-33 "Ask them what job they need done?" -> BUILD: the word "job" appears nowhere in scene 03's visible copy or notes.
- [ ] S3-34 "What are we talking about?" -> CONTEXT.
- [ ] S3-35 "In what industry is this?" -> BUILD: the slide states that the method works in any industry.
- [ ] S3-36 "If the rest of this slide, by the way, is about the food industry, what job would somebody need done that's coming to eat somewhere, right?" -> BUILD: the slide is not tied to food. Amberkloof (a product brand) is the worked example, Tumelo Print & Pack (B2B) is the swap, and an "any industry" strip names other industries.
- [ ] S3-37 "And then it goes on to say before guessing demographics." -> CONTEXT.
- [ ] S3-38 "What does that mean, before guessing demographics?" -> CONTEXT.
- [ ] S3-39 "I don't get it." -> CONTEXT.
- [ ] S3-40 "So we need to make that whole sentence clearer, and we probably need to put an example there, or at least be much more clear in our sentence structures." -> BUILD: the replacement is one short, plain sentence plus an example. Proposed: "Get to know them from your records: who bought, what they asked, who came back." Example strip: "A salon: bookings and rebookings. A plumber: call-outs and repeat clients. A label printer: quotes and reorders."
- [ ] S3-41 "Right?" -> CONTEXT.
- [ ] S3-42 "So the whole point is actually just to get to know them." -> BUILD: the phrase "get to know them" (or the same meaning in plain words) is visible.
- [ ] S3-43 "I wouldn't say ask what job they need done." -> BUILD: the same as S3-33, no "job" wording.
- [ ] S3-44 "It really isn't." -> CONTEXT.
- [ ] S3-45 "It's not specific." -> BUILD: the example is concrete (real field names and illustrative values), not abstract.
- [ ] S3-46 "It's not talking to anything specific." -> CONTEXT, covered by S3-45.
- [ ] S3-47 "It really just doesn't even—it needs to be allocated to be able to be allocated to any industry, and it doesn't allow for that." -> BUILD: there is a B2C to B2B toggle. Tapping "B2B" swaps the persona fields to Tumelo's (industry, company size, area, buyer role, circumstances) without leaving the scene.
- [ ] S3-48 "So we need to be saying there that we need to go and see who is our ICP, obviously, and before we— sorry, how we know who they are is we go and delve into the data." -> BUILD: the visible line says how we know: "We look in the data." The data table is on screen.
- [ ] S3-49 "We need to know age group, even race, and then sex, like male or female." -> BUILD: the persona card shows Age group and Sex. Race is shown as a field marked "Only if they tell you". The POPIA line reads: "Race is special personal information under POPIA. Record it only when customers choose to tell you, never guess it." (decision G3).
- [ ] S3-50 "They're male or female." -> BUILD: the Sex field shows survey-stated values (for example "Mostly men, from the checkout survey").
- [ ] S3-51 "Simple things like that." -> BUILD: the persona card has at most 6 fields: Age group, Sex, Area, Circumstances, Found us on, Race (only if stated).
- [ ] S3-52 "It's, I think you also need to do some research on how to take data and then create a persona for that data." -> BUILD: `experience/persona-research.md` gains cited sources on turning records into a persona (G01-T06). The method on screen (capture, group, describe, test) matches it.
- [ ] S3-53 "And that's it." -> CONTEXT.
- [ ] S3-54 "We also need— well, we need the ability to, number one, gather that data, because it's one thing." -> BUILD: a "Gather" step is drawn first: orders, inquiries, repeat orders, plus a 3-question opt-in checkout survey.
- [ ] S3-55 "So otherwise, if you don't have that data, you are guessing." -> BUILD: the visible line reads "No data? You're guessing."
- [ ] S3-56 "You are basically guessing and going off of a feeling." -> BUILD: this is echoed by the assumption card stamped "A feeling" (S3-15).
- [ ] S3-57 "So you need a process that captures that data." -> BUILD: the capture process is shown as a loop: every sale, inquiry and repeat adds a row, and the 3-question survey fills Age group, Sex and Circumstances. Nothing is uploaded to a public AI. Anonymised counts only.
- [ ] S3-58 "That's very important." -> BUILD: the capture process gets its own beat (at least 10% of the scene's scroll), not a footnote.
- [ ] S3-59 "And then something like circumstances, obviously." -> BUILD: the persona card has a Circumstances field (for example "Busy, buys gifts twice a year, wants it wrapped and delivered").
- [ ] S3-60 "What circumstances are they in?" -> BUILD: the Circumstances field is phrased as their situation, not a demographic.
- [ ] S3-61 "But go and do research about personas and let's teach around building a persona, which is your ideal customer profile, and then just fix everything that I've just said." -> BUILD: the scene teaches building a persona and names it as your ideal customer profile (ICP). Every BUILD line above is ticked against a screenshot.

## Viewport, motion and data rules for these three slides

1. Capture at 1366x768, 1440x900 and 390x844, plus reduced motion.
2. With reduced motion there is no auto-scroll. Each scene shows its complete end state, and the clicks on slide 2 still work.
3. On a phone, scene 01's label is visible. In scene 02 the centred word is stacked above the other two. In scene 03 the streams run vertically and the persona card sits at the bottom.
4. Every figure is tagged "Illustrative sample, not research". No figure animates as a live counter.
5. The proof is checklist-first per RULE 19. Write the expected facts, then capture, then tick each line here.
