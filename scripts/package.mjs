// Genera el código fuente del paquete npm (package/src/icons) desde svg/ y metadatos.json.
// Uso: node scripts/package.mjs   (lo corre solo "npm run build" dentro de package/)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const metadatos = JSON.parse(readFileSync(join(raiz, "metadata.json"), "utf8"));
const cuerpo = (archivo) => {
  const m = readFileSync(archivo, "utf8").match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!m) throw new Error(`${archivo}: SVG inválido`);
  return m[1].trim();
};

const nombres = readdirSync(join(raiz, "svg", "line")).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4)).sort();
const pascal = (n) => n.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
const camel = (n) => { const p = pascal(n); return p[0].toLowerCase() + p.slice(1); };

const src = join(raiz, "package", "src");
const dirIconos = join(src, "icons");
rmSync(dirIconos, { recursive: true, force: true });
mkdirSync(dirIconos, { recursive: true });

const aviso = "// Generado por scripts/package.mjs. No editar a mano.\n";
for (const n of nombres) {
  const linea = cuerpo(join(raiz, "svg", "line", `${n}.svg`));
  let relleno = null, duotono = null;
  try { duotono = cuerpo(join(raiz, "svg", "duotone", `${n}.svg`)); } catch { /* sin duotone */ }
  try { relleno = cuerpo(join(raiz, "svg", "solid", `${n}.svg`)); } catch { /* sin relleno */ }
  const datos = { name: n, category: metadatos[n]?.category ?? "", tags: metadatos[n]?.tags ?? [], line: linea, solid: relleno, duotone: duotono, animation: metadatos[n]?.animation ?? "pulse", origin: metadatos[n]?.origin ?? null };
  writeFileSync(join(dirIconos, `${n}.ts`), `${aviso}import type { IconData } from '../types.js';\n\nexport const ${camel(n)}: IconData = ${JSON.stringify(datos, null, 2)};\n`);
}
writeFileSync(join(dirIconos, "index.ts"), aviso + nombres.map((n) => `export { ${camel(n)} } from './${n}.js';`).join("\n") + "\n");

// React: un componente por ícono.
writeFileSync(join(src, "react", "icons.ts"), aviso + "import { createIcon } from './create.js';\n" +
  nombres.map((n) => `import { ${camel(n)} } from '../icons/${n}.js';`).join("\n") + "\n\n" +
  nombres.map((n) => `export const ${pascal(n)} = /* @__PURE__ */ createIcon(${camel(n)}, '${pascal(n)}');`).join("\n") + "\n");

// SVG sueltos dentro del paquete.
rmSync(join(raiz, "package", "svg"), { recursive: true, force: true });
cpSync(join(raiz, "svg"), join(raiz, "package", "svg"), { recursive: true });

cpSync(join(raiz, "animations.css"), join(raiz, "package", "animations.css"));
console.log(`${nombres.length} íconos -> package/src`);
