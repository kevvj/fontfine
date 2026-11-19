// Marks in ROADMAP.md the icons that already exist and updates the counters.
// A line looks like:  - [ ] rocket   or   - [ ] a (as `letter-a`)
// It is checked when svg/line/<fontfine name>.svg exists.
// Usage: node scripts/roadmap.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "ROADMAP.md");
const lines = readFileSync(file, "utf8").split("\n");
const ITEM = /^- \[[ x]\] ([a-z0-9-]+)( \(as `([a-z0-9-]+)`\))?$/;

let total = 0, done = 0;
const out = lines.map((l) => {
  const m = l.match(ITEM);
  if (!m) return l;
  const name = m[3] ?? m[1];
  const ok = existsSync(join(root, "svg", "line", `${name}.svg`));
  total++; if (ok) done++;
  return `- [${ok ? "x" : " "}] ${m[1]}${m[2] ?? ""}`;
});

// Counters per section: "## Title (3/36)".
for (let i = 0; i < out.length; i++) {
  const h = out[i].match(/^## (.+) \(\d+\/\d+\)$/);
  if (!h) continue;
  let d = 0, t = 0;
  for (let j = i + 1; j < out.length && !out[j].startsWith("## "); j++) {
    if (ITEM.test(out[j])) { t++; if (out[j].startsWith("- [x]")) d++; }
  }
  out[i] = `## ${h[1]} (${d}/${t})`;
}
const text = out.join("\n").replace(/\*\*Progress: \d+ \/ \d+\*\*/, `**Progress: ${done} / ${total}**`);
writeFileSync(file, text);
console.log(`ROADMAP: ${done} / ${total}`);
