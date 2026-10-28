**Next action (owner, about 3 minutes):** read the three final openers below and pick one, or say what to change (gate OG-OPENER). All three are already in the scene 01 speaker note.

# Scene 01 opener: before and after (G01-T04)

- **Source of the directions:** `experience/story-spine.md` section 3.2, scene 01 (A question, B product, C challenge).
- **Process:** a spoken first draft, then a hand rewrite, then `slopmonster` (lint, cleanse with a rival model through `tools/cleanse.sh`, re-lint), then `humanizer-loxly` in SPOKEN mode (the S0 "heard once" logic check) because the notes are spoken.
- **Lint scores:** 5/5 before, 5/5 after the cleanse (`tools/deslop.py`).
- **Status:** OG-OPENER stays open until the owner chooses.

## Before (first draft)

- **A, a question.** Quick show of hands: who here has posted on three different platforms this month and still can't tell which one actually brought in a customer? Keep your hand up. That is exactly what today is about: engage, convert and optimize, step by step.
- **B, the product.** This bottle doesn't exist. It's a made-up brand called Amberkloof. Over the next hour we'll find out who buys it, where those people hang out, and how a like becomes a sale. And then we'll do the same thing, live, for one of your businesses.
- **C, a challenge.** Hands up if you know who your best customer is. Now keep it up if you could prove it from your records (with an em dash): your orders, your messages, your repeat buyers. That gap between knowing and proving is what this hour is about.

## After slopmonster (rival-model cleanse)

- **A.** Quick show of hands. Who's posted on three platforms this month and still can't tell you which one brought in a customer? Keep your hand up for a second. Look around the room. That's most of us, and that's what the next hour is for.
- **B.** This bottle doesn't exist. Amberkloof is a brand we made up for today. In the next hour we'll work out who buys it and where those people spend their time. We'll trace how a like turns into a sale. Then we do it for real, with one of your businesses.
- **C.** Hands up if you know who your best customer is. Now keep it up if you could prove it from your records. Orders, WhatsApp messages, people who came back. Okay. Most hands just came down. That gap is what we're working on today.

Cleanse notes from the rival model: the three-part plan in B sounded rehearsed, so it became two beats; fragments and contractions were kept because they sound natural aloud.

## Final, in the speaker note (after the SPOKEN pass)

- **A.** Quick show of hands. Who's posted on three platforms this month and still can't tell you which one brought in a customer? Keep your hand up for a second. Look around. If your hand is up, mine would be too. That's what the next hour is for.
- **B.** This bottle isn't real. Amberkloof is a brand we made up for today. In the next hour we'll work out who buys it and where those people spend their time. We'll trace how a like turns into a sale. Then we do it for real, with one of your businesses.
- **C.** Hands up if you know who your best customer is. Now keep it up if you could prove it from your records. Orders, WhatsApp messages, people who came back. Okay. If your hand came down, you're in good company. That gap is what we're working on today.

What the SPOKEN pass changed and why:
- **S0, heard once:** "That's most of us" (A) and "Most hands just came down" (C) predict what the room will do. If the room does something else, the line is wrong out loud. Both became conditional.
- **S0, heard once:** "This bottle doesn't exist" (B) is said while the bottle is on screen. "This bottle isn't real" fits what people see.
- **S1, inclusive we:** A now puts the speaker in the group ("mine would be too").

## On-screen opener card

The slide shows a "Show of hands" card from about a quarter of the way into scene 01: "Who posted this month and still can't say which post brought in a customer?" It matches option A. If the owner picks B or C, change that one line in `index.html` (`.g1-open__opener`).

## Visible copy log (slides 1-3)

All visible copy on slides 1-3 was linted with `slopmonster/tools/deslop.py`. The run and its score are in `experience/evidence/g01-final/deslop-visible-copy.txt`. Where the owner's spec quotes exact wording (for example tactic 1 "Get their details while they are engaging", the POPIA line, "No data? You're guessing."), the spec wording was kept even where the cleanse suggested otherwise.
