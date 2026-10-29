**Next action: pick the right microphone and record a 20-second test before you rehearse again. The two rehearsal takes did not capture your voice, so there is no transcript of slides 01 to 07 yet.**

# Rehearsal transcript, slides 01-07: BLOCKED, the recording holds no speech

## Fix it (about 5 minutes)

1. Open Windows Settings > System > Sound > Input. Choose the mic you speak into. The active ones are JLAB TALK GO, HD Pro Webcam C920 and Realtek. Talk and check that the level bar moves. (1 min)
2. In the presenter browser, open `chrome://settings/content/microphone` and choose the same mic. The recorder asks for the browser's default mic, `getUserMedia({ audio: true })`, so whatever device the browser picks is the one it records. (1 min)
3. Record a 20-second rehearsal take while you talk at normal volume. (1 min)
4. Ask Claude to check the level of that test take before you do the full run. Normal speech peaks above -20 dBFS. Both takes below peak at about -60 dBFS. (2 min)

## What was checked (all with Voicebox, model `turbo` = whisper-large-v3-turbo)

- Each take was cut at every slide (scene) change from `events.jsonl`, with 1 s of overlap at each boundary. Slide 04 (10.8 min), slide 05 (5.9 min) and slide 06 (9.5 min) were each split further at a beat change. That made 14 segments.
- Each segment went to Voicebox twice: once as recorded, and once with 40 dB of gain (decoded from `audio.webm`, 80 Hz high-pass, limiter). All 28 requests returned HTTP 200 with no errors.
- **Voicebox works.** As a control, a known spoken sentence was turned down to the recording's own level (-35 dBFS peak) and mixed with 12 s of the recording's background noise. Voicebox transcribed it word for word: "On slide 4, cut the second paragraph and move the pricing example to the end of the deck." So if your voice had been in the recording even that quietly, it would have been transcribed.
- **The recording is the problem.** For about 99% of both takes the signal is steady background noise: roughly -75 dBFS RMS and -60 dBFS peak. Measured in 250 ms windows, the loudness varies by only 1-2 dB. Speech varies by 20-30 dB, so this is not speech. Only about 23 s in total, in three short bursts, is louder than the noise. The voice-cue log also recorded 0 `speech` events.
- Whisper makes up filler words like "so" when it is given only noise. Those outputs are shown below as **noise, not speech** and must not be read as things you said.

## Take 1: `r-20261028-145033` (6:27, slides 01-03)

### Slide 01: 00:00-02:07
- Transcript: **none recoverable.** The only signal is an 8 s burst at about 00:14-00:25 (peak -35 dBFS). Voicebox heard "Hello everyone." in 2 of 3 passes: 0:00-0:40 and 0:00-2:07, both with gain. The tight 0:12-0:28 cut returned "so". This is a possible opening line, with low confidence.
- What you asked to change: **unknown.** No speech was recorded, so this does not mean you asked for nothing.

### Slide 02: 02:07-05:51
- Transcript: **none recoverable.** Background noise only (peak -59 dBFS). Voicebox output: "." as recorded, "so" with gain, which is noise.
- What you asked to change: **unknown** (not recorded).

### Slide 03, take 1: 05:51-06:27
- Transcript: **none recoverable.** Background noise only (peak -60 dBFS). Voicebox output: "." / "so", which is noise.
- What you asked to change: **unknown** (not recorded).

Coverage, take 1: audio 387.36 s, segments cover 387.36 s (0.00-387.36, no gaps), 3 segments, 0 failed requests. **Intelligible speech: 0 s.**

## Take 2: `r-20261028-151210` (33:02, slides 03-07; you stopped on slide 07)

### Slide 03, take 2: 00:00-04:10, and again 05:48-06:05 (brief scroll back)
- Transcript: **none recoverable.** Background noise only (peak -58 / -63 dBFS). Voicebox output: "." / "so". On the 05:48-06:05 piece, the version with gain produced "I'm going to go ahead and get some more of the things I've been doing." That is a whisper hallucination: the raw piece never rises above -63 dBFS.
- What you asked to change: **unknown** (not recorded).

### Slide 04: 04:10-05:48, then 06:05-08:36, 08:36-13:10, 13:10-16:51
- Transcript: **none recoverable.** Steady noise, except a 14 s burst at about 08:10-08:30 (peak -34 dBFS). Voicebox output for every piece and for the tight 08:09-08:32 cut: "." / "so" / "The". Nothing intelligible.
- What you asked to change: **unknown** (not recorded).

### Slide 05: 16:51-20:33, 20:33-22:42
- Transcript: **none recoverable.** Background noise only (peak -57 / -59 dBFS). Voicebox output: "." / "so", which is noise.
- What you asked to change: **unknown** (not recorded).

### Slide 06: 22:42-27:22, 27:22-32:15
- Transcript: **none recoverable.** Steady noise, except a short burst at about 27:50-28:10 (peak -39 dBFS). Voicebox output for both pieces and for the tight 27:48-28:12 cut: "." / "so". Nothing intelligible.
- What you asked to change: **unknown** (not recorded).

### Slide 07: 32:15-33:02 (where you stopped)
- Transcript: **none recoverable.** Background noise only (peak -60 dBFS). Voicebox output: "." / "so", which is noise.
- What you asked to change: **unknown** (not recorded).

Coverage, take 2: audio 1981.50 s, segments cover 1981.50 s (0.00-1981.50, no gaps), 11 segments, 0 failed requests. **Intelligible speech: 0 s.**

## Evidence kept outside the public site

The per-segment Voicebox JSON, the level measurements and the control clips are in the session scratchpad, not in this repo. The source audio is still in `live-runner/.stage/rehearsal/`.

**Next action: do steps 1-3 above, then re-run the rehearsal recorder. The slide-by-slide transcript can be produced as soon as a take has your voice in it.**
