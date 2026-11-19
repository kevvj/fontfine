# Instructions for AI assistants

You are helping someone add or edit icons in **fontfine**. Follow this file exactly. Every pull request runs `node scripts/check.mjs`; if a rule below is broken, the PR fails.

## What an icon is

One icon = **3 SVG files with the same name** + **1 entry in `metadata.json`**:

```
svg/line/<name>.svg      thin line, the source of truth
svg/solid/<name>.svg     filled
svg/duotone/<name>.svg   two tones, sharp corners
metadata.json            category, tags, animation
```

`<name>`: English, lowercase, words joined by `-`, named after **what it shows** (`bell`, not `notification`; `arrow-left`, not `back`). Check that the name does not already exist.

## Style (must match the existing icons)

Before drawing, open 3 or 4 similar icons in `svg/line/` and copy their proportions.

**Grid**: `viewBox="0 0 24 24"`. Keep the drawing inside 2–22 on both axes (2 px padding). Most icons touch about 3 and 21. Center it visually.

### line

Start the file with exactly this line (one line, no line breaks inside the tag):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
```

- Shapes inherit stroke from the root. **Never** set `stroke`, `stroke-width`, or a color on shapes. That way users can change the width (thin 0.75 to bold 2.25).
- No fill, except tiny dots (`r` ≤ 1) when really needed.
- Simple and clean: few paths, round ends, gaps of at least 1.5 px between lines so it still reads at 16 px and at stroke 2.25.
- Prefer `<path>`, `<circle>`, `<rect rx>`. Use 1 or 2 decimals at most.

Example (`svg/line/bell.svg` style):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/></svg>
```

### solid

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">
```

- Same shape as the line icon, filled. It must look **the same size** as the line version (the outer edge of the solid = the outer edge of the line stroke, about 0.6 px bigger than the line path).
- Details are **holes**: draw them as extra subpaths in the same `<path>` (`fill-rule="evenodd"` cuts them out). Careful: two overlapping subpaths in one path also make a hole.
- If you need a gap that crosses shapes, use a `<mask id="ff-<name>">` with `#fff` / `#000` (see `svg/solid/eye-off.svg`).

### duotone (Duotone Sharp)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd"><g class="ff-secondary" opacity=".4">…</g><g class="ff-primary">…</g></svg>
```

- **Sharp**: straight corners. If you use strokes here: `stroke-linecap="square"` or `"butt"`, `stroke-linejoin="miter"`. Never `round`.
- **Secondary** (40 %): the big body (the bell, the house, the card).
- **Primary** (solid): the detail that gives meaning (the clapper, the roof and door, the stripe). If the icon is a single simple shape, put it all in primary and leave out the secondary group.
- Both layers are filled shapes; strokes are allowed with `fill="none" stroke="currentColor"`.

### Forbidden everywhere

`<script>`, `<style>`, `<text>`, `<image>`, `<use>`, `<foreignObject>`, links, gradients, filters, `style=""`, event attributes (`onload`…), comments, colors other than `currentColor`, files over 2 KB. Do not copy paths from other icon sets (Font Awesome, Material, Lucide…): draw them yourself. The license is MIT and copied icons cannot be accepted.

## metadata.json

Add the entry in **alphabetical order**:

```json
"bell": {
  "category": "Interface",
  "tags": ["bell", "notification", "alert", "alarm", "ring"],
  "animation": "swing",
  "origin": "50% 12%"
}
```

- `category`: one of Actions, Arrows, Communication, Files, Health, Interface, Media, Music & Audio, Nature, Objects, People, Places, Religion, Security, Status, Technology, Weather.
- `tags`: 3–30 lowercase search words (synonyms people would type). Other languages are welcome at the end.
- `animation`: one of the `.ff-<name>` classes in `animations.css`. Pick what fits the object: `swing` (hangs from the top), `spin` (rotates), `beat` (heart, speaker), `shake` (warning, delete), `bounce` (objects, places, people), `nudge-left/right/up/down` (arrows), `wiggle` (tools), `float` (light things), `pop` (checks, bubbles), `pulse` (default).
- `origin` (optional): pivot point of the animation when it is not the center, e.g. `"50% 12%"` for the top of a bell.

## What to draw next

[ROADMAP.md](ROADMAP.md) lists the icons still missing. Use the fontfine name shown in parentheses when there is one (letters are `letter-a`, numbers `number-0`). Draw from scratch: the list only gives the concept.

## Check your work

```bash
node scripts/check.mjs               # rules above
node scripts/roadmap.mjs             # marks your icons as done in ROADMAP.md
cd paquete && npm ci && npm test     # library tests
cd web && npm ci && npm start        # see it at http://localhost:4200
```

In the website, look at the icon in all 6 variants, at 16 px and 48 px, and with the animation on (Always). Compare it with the icons around it.

## Do not touch

Unless the person explicitly asks, do not edit `scripts/`, `paquete/src/`, `web/`, `.github/` or `animations.css`. Icon PRs should only change `svg/` and `metadata.json`.
