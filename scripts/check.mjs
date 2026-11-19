// Strict checks for every icon. Runs in CI on every pull request.
// Usage: node scripts/check.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const VARIANTS = ["line", "solid", "duotone"];
const HEADERS = {
  line: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">',
  solid: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">',
  duotone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd">',
};
const ELEMENTS = new Set(["svg", "g", "path", "circle", "rect", "ellipse", "line", "polyline", "polygon", "mask"]);
const ATTRS = new Set(["xmlns", "viewBox", "d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "x1", "y1", "x2", "y2", "points",
  "fill", "fill-rule", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "opacity", "transform", "class", "id", "mask", "data-ajuste"]);
const CATEGORIES = new Set(["Actions", "Arrows", "Communication", "Files", "Health", "Interface", "Letters & Numbers", "Media", "Music & Audio", "Nature",
  "Objects", "People", "Places", "Religion", "Security", "Status", "Technology", "Weather"]);
const ANIMATIONS = new Set([...readFileSync(join(root, "animations.css"), "utf8").matchAll(/^\.ff-([a-z-]+)\{animation:/gm)].map((m) => m[1]));
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NUMBER = /^-?\d*\.?\d+$/;
const MAX_BYTES = 2048;

const names = (v) => readdirSync(join(root, "svg", v)).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4));
const all = new Set(VARIANTS.flatMap(names));
const metadata = JSON.parse(readFileSync(join(root, "metadata.json"), "utf8"));

for (const v of VARIANTS) for (const f of readdirSync(join(root, "svg", v))) if (!f.endsWith(".svg")) fail(`svg/${v}/${f}`, "only .svg files are allowed here");

for (const name of all) {
  if (!NAME.test(name)) fail(name, "name must be lowercase English words separated by '-' (e.g. arrow-left)");
  if (!metadata[name]) fail(name, "missing entry in metadata.json");

  for (const v of VARIANTS) {
    const rel = `svg/${v}/${name}.svg`;
    const file = join(root, rel);
    let src;
    try { src = readFileSync(file, "utf8"); } catch { fail(rel, `missing (every icon needs line, solid and duotone)`); continue; }
    if (statSync(file).size > MAX_BYTES) fail(rel, `too big (${statSync(file).size} bytes, max ${MAX_BYTES}). Simplify the paths.`);
    if (!src.startsWith(HEADERS[v])) fail(rel, `must start exactly with:\n  ${HEADERS[v]}`);
    if (!src.trimEnd().endsWith("</svg>")) fail(rel, "must end with </svg>");
    if (/<!--|<!\[CDATA|<\?|&/.test(src)) fail(rel, "comments, CDATA, processing instructions and entities are not allowed");

    // Text between tags is not allowed (no <text>, no stray content).
    if (/>[^<\s][^<]*</.test(src)) fail(rel, "text content is not allowed");

    for (const [, tag, attrs] of src.matchAll(/<([a-zA-Z:-]+)([^>]*)>/g)) {
      if (!ELEMENTS.has(tag)) { fail(rel, `<${tag}> is not allowed (allowed: ${[...ELEMENTS].join(", ")})`); continue; }
      const leftover = attrs.replace(/\s[a-zA-Z:-]+="[^"]*"/g, "").replace(/\/$/, "").trim();
      if (leftover) { fail(rel, `<${tag}> has unexpected content: ${leftover.slice(0, 40)} (use attr="value" with double quotes)`); continue; }
      for (const [, k, val] of attrs.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) {
        if (!ATTRS.has(k)) { fail(rel, `attribute "${k}" is not allowed`); continue; }
        if (tag === "svg") continue;
        if ((k === "fill" || k === "stroke") && !["none", "currentColor", "#fff", "#000"].includes(val)) fail(rel, `${k}="${val}": use currentColor (colors come from the user)`);
        if ((val === "#fff" || val === "#000") && !src.includes("<mask")) fail(rel, "#fff/#000 are only allowed inside a <mask>");
        if (["cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "x1", "y1", "x2", "y2", "stroke-width", "opacity"].includes(k) && !NUMBER.test(val)) fail(rel, `${k}="${val}" must be a number`);
        if (k === "d" && !/^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/.test(val)) fail(rel, `d="${val.slice(0, 30)}…" has invalid characters`);
        if (k === "transform" && !/^[a-z0-9 ().,-]+$/.test(val)) fail(rel, `transform="${val}" is not allowed`);
        if (k === "id" && !new RegExp(`^ff-${name}(-[a-z0-9]+)?$`).test(val)) fail(rel, `id="${val}" must be "ff-${name}" (unique on the page)`);
        if (k === "mask" && !new RegExp(`^url\\(#ff-${name}(-[a-z0-9]+)?\\)$`).test(val)) fail(rel, `mask="${val}" must point to #ff-${name}`);
        if (k === "class" && (v !== "duotone" || !["ff-primary", "ff-secondary"].includes(val))) fail(rel, `class="${val}": only ff-primary / ff-secondary in duotone`);
      }
      // Line icons inherit stroke and width from the root, so the variants (thin, bold...) work.
      if (v === "line" && tag !== "svg" && tag !== "mask" && /\s(stroke|stroke-width)="/.test(attrs) && !src.includes("<mask")) fail(rel, "line icons must not set stroke or stroke-width on shapes (they come from the root, so the width can change)");
    }
    if (v === "duotone") {
      if (!/<g class="ff-primary">/.test(src)) fail(rel, 'needs a <g class="ff-primary"> layer');
      if (/<g class="ff-secondary"/.test(src) && !/<g class="ff-secondary" opacity="\.4">/.test(src)) fail(rel, 'the secondary layer must be <g class="ff-secondary" opacity=".4">');
      if (/stroke-linecap="round"|stroke-linejoin="round"/.test(src)) fail(rel, "duotone uses straight corners: square/butt caps and miter/bevel joins");
    }
  }
}

for (const [name, m] of Object.entries(metadata)) {
  const rel = `metadata.json → ${name}`;
  if (!all.has(name)) fail(rel, `no SVG files for this name`);
  const extra = Object.keys(m).filter((k) => !["category", "tags", "animation", "origin"].includes(k));
  if (extra.length) fail(rel, `unknown fields: ${extra.join(", ")}`);
  if (!CATEGORIES.has(m.category)) fail(rel, `category "${m.category}" is not one of: ${[...CATEGORIES].join(", ")}`);
  if (!Array.isArray(m.tags) || m.tags.length < 3 || m.tags.length > 30) fail(rel, "tags: 3 to 30 search words");
  else for (const t of m.tags) if (typeof t !== "string" || !/^[\p{Ll}0-9 &'-]{1,30}$/u.test(t)) fail(rel, `tag "${t}" must be lowercase, max 30 chars`);
  if (!ANIMATIONS.has(m.animation)) fail(rel, `animation "${m.animation}" is not in animations.css (${[...ANIMATIONS].join(", ")})`);
  if (m.origin !== undefined && !/^\d{1,3}% \d{1,3}%$/.test(m.origin)) fail(rel, `origin "${m.origin}" must look like "50% 12%"`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n\n` + errors.map((e) => "- " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${all.size} icons OK (line, solid, duotone and metadata)`);
