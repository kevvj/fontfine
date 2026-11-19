# Prompt for chat AIs

Copy everything inside the box into ChatGPT, Claude, Gemini or similar. Replace `ICON_NAME` and the description. Then paste each block of the answer into its file and run `node scripts/check.mjs`.

````text
You are drawing an icon for "fontfine", an open source SVG icon set. Draw it from scratch (do not copy any existing icon set).

Icon: ICON_NAME  (what it shows: DESCRIBE THE OBJECT IN ONE SENTENCE)

Give me exactly 4 code blocks, nothing else:
1. svg/line/ICON_NAME.svg
2. svg/solid/ICON_NAME.svg
3. svg/duotone/ICON_NAME.svg
4. the metadata.json entry

RULES
- 24x24 grid. Keep the drawing between 2 and 22 on both axes, visually centered. Simple, clean, few paths, max 2 decimals. It must read at 16 px.
- Only these elements: path, circle, rect, ellipse, line, polyline, polygon, g, mask. No text, style, script, image, use, gradients, filters, comments, style="" or on* attributes. Only the color currentColor. Each file under 2 KB, one line.

1) LINE. Start exactly with:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
Shapes must NOT set stroke, stroke-width or fill (they inherit). Leave at least 1.5 px between parallel lines.

2) SOLID. Start exactly with:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
Same shape filled, same visual size as the line version (outer edge about 0.6 px outside the line path). Details are holes made with extra subpaths in the same path (evenodd). A mask is allowed only with id="ff-ICON_NAME" and fills #fff/#000.

3) DUOTONE. Start exactly with:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
Then <g class="ff-secondary" opacity=".4"> with the main body, and <g class="ff-primary"> with the detail that gives meaning. Straight, sharp corners. If you use strokes: fill="none" stroke="currentColor", stroke-linecap square or butt, stroke-linejoin miter (never round).

4) METADATA:
"ICON_NAME": { "category": "...", "tags": ["...", "..."], "animation": "...", "origin": "50% 50%" }
category: Actions, Arrows, Communication, Files, Health, Interface, Letters & Numbers, Media, Music & Audio, Nature, Objects, People, Places, Religion, Security, Status, Technology or Weather.
tags: 3 to 30 lowercase search words.
animation: one of nudge-left, nudge-right, nudge-up, nudge-down, nudge-diag, spin, spin-slow, turn-y, quarter, swing, wave, beat, beat-fast, shake, wiggle, slide, tick, bounce, pop, star, wobble, blink, flicker, glow, flash, write, dance, ring, drive, float, rock, flip, thumb, turn-key, search, drip, signal, dots, squash, pulse.
origin: pivot of the animation (e.g. "50% 12%" for something hanging from the top). Omit it if it is the center.

STYLE REFERENCE (line version of "bell"):
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/></svg>
````

Tip: paste 2 or 3 existing icons from `svg/line/` that look similar to yours as extra reference. Results are better.
