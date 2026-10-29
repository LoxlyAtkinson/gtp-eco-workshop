# WhatsApp and SMS rules (Smart AI Solutions)

## The Platform Rules That Decide Whether Your Copy Ships

Verified against Meta and platform documentation, September 2026. **Re-verify before relying on a specific number — Meta changes these, and a rejected template is a launch delay.**

### The 24-hour customer service window

When a user messages you, a 24-hour window opens in which you may reply with free-form ("session") messages. Outside it, you may only send a **pre-approved template**.

This is the single most important constraint on sequence design:

- A nurture sequence spread over days is **all templates**. You cannot write day 3 as a chatty free-form message.
- A conversation that starts when someone replies is **session messages**, and can be written like a real conversation.
- The most effective sequences are built to **provoke a reply**, because a reply opens the window and everything after it is cheaper and freer in form.

### Template categories

| Category | Covers | Note |
|---|---|---|
| **Utility** | Order confirmations, shipping updates, appointment reminders, billing, post-purchase follow-up | Free when sent inside an open 24-hour customer service window |
| **Authentication** | One-time passcodes, account recovery | Strict format; do not put marketing in these |
| **Marketing** | Promotions, launches, newsletters, re-engagement | Anything mixing utility with promotion is classified Marketing |

**The classification trap:** adding one promotional sentence to an appointment reminder reclassifies the whole template as Marketing — which changes its cost and its approval bar. Keep utility templates ruthlessly transactional.

### Character limits

| Component | Limit | Variables |
|---|---|---|
| Body | 1,024 characters | Yes — and the limit counts the **substituted values**, not the placeholder |
| Header (text) | 60 characters | Exactly one |
| Footer | 60 characters | None — static text only |
| Button labels | 25 characters each | None |

Buttons: up to 3 quick replies, or up to 2 call-to-action buttons (URL and/or phone). You cannot mix quick replies and CTAs in the same template.

Write to roughly **half** the body limit. A message that fills 1,024 characters is not a WhatsApp message, it is an email that arrived in the wrong place.

### URL rule (from 1 January 2026)

Any template with a URL in the body or a CTA button must use a **valid, verifiable HTTPS URL**. Link shorteners that obscure the destination are a common rejection cause.

### Why templates get rejected

Write to avoid these, because each one costs a review cycle:

- **Placeholder abuse** — a template that is mostly variables (`{{1}}, {{2}}, {{3}}`) with little static text reads as a spam shell.
- **Variables at the very start or very end** of the body.
- **No context for the opt-in** — the reader cannot tell why they are receiving this.
- **Promotional content in a Utility template.**
- **Threatening, urgent-pressure, or misleading wording** — "final warning", "your account will be closed".
- **Broken or unverifiable link.**
- **Typos and inconsistent casing** — reviewers read these as low-quality sends.

### Quality rating

Meta scores your number on user feedback — blocks and "report" taps. A falling rating restricts your messaging limits and can suspend the number. This is why an aggressive sequence is not merely rude, it is a business risk. **Design every sequence so the easiest action for an uninterested person is to leave, not to block.**

---

## Core Principles

### 1. One message, one job
No message does two things. A reminder reminds. An offer offers. The moment a message has two purposes, both get worse and the template risks reclassification.

### 2. Earn the reply
The window is the whole game. Ending on a genuine, answerable question is worth more than any CTA button, because a reply opens 24 hours of free-form conversation.

### 3. Write like a person, at the length a person writes
Two to four short lines. No greeting paragraph. No sign-off block. If it would look absurd typed by a human into a chat, it is wrong.

### 4. Say who you are, immediately
The reader has your number saved as nothing. The first line must make the sender obvious without sounding like a letterhead.

### 5. Make leaving trivial
Every marketing sequence carries an opt-out instruction, in the message, in plain words. "Reply STOP to end these" costs you nothing and protects the number.

### 6. Respect the hour
A message at 21:00 gets blocked at a rate an email never would. Send inside local business hours unless the message is genuinely urgent and expected.

---

## South African Context

- **WhatsApp is the default channel**, across income brackets and age groups. For many audiences it will out-perform email badly — but the same reach makes an unwanted message far more intrusive.
- **POPIA applies to messaging.** Consent must be specific, informed and recorded, and the person must be able to withdraw it as easily as they gave it. "They gave us their number at an event" is not consent to a marketing sequence.
- **Data cost matters.** Do not attach heavy media without reason; a 4MB image on a metered connection is a real cost imposed on the reader.
- **Language.** English is safe for business audiences; consider isiZulu, isiXhosa or Afrikaans for consumer audiences, and never machine-translate a template without a native check — a clumsy translation reads worse than plain English.
- **Business hours.** 08:00–17:00 SAST on weekdays. Avoid Sundays and public holidays entirely for marketing.

---

