// Genera el código fuente del paquete npm (paquete/src/iconos) desde svg/ y metadatos.json.
// Uso: node scripts/paquete.mjs   (lo corre solo "npm run build" dentro de paquete/)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const metadatos = JSON.parse(readFileSync(join(raiz, "metadatos.json"), "utf8"));
const cuerpo = (archivo) => {
  const m = readFileSync(archivo, "utf8").match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!m) throw new Error(`${archivo}: SVG inválido`);
  return m[1].trim();
};

const nombres = readdirSync(join(raiz, "svg", "linea")).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4)).sort();
const pascal = (n) => n.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
const camel = (n) => { const p = pascal(n); return p[0].toLowerCase() + p.slice(1); };

const src = join(raiz, "paquete", "src");
const dirIconos = join(src, "iconos");
rmSync(dirIconos, { recursive: true, force: true });
mkdirSync(dirIconos, { recursive: true });

const aviso = "// Generado por scripts/paquete.mjs. No editar a mano.\n";
for (const n of nombres) {
  const linea = cuerpo(join(raiz, "svg", "linea", `${n}.svg`));
  let relleno = null;
  try { relleno = cuerpo(join(raiz, "svg", "relleno", `${n}.svg`)); } catch { /* sin relleno */ }
  const datos = { name: n, category: metadatos[n]?.categoria ?? "", tags: metadatos[n]?.etiquetas ?? [], line: linea, solid: relleno };
  writeFileSync(join(dirIconos, `${n}.ts`), `${aviso}import type { IconData } from '../tipos.js';\n\nexport const ${camel(n)}: IconData = ${JSON.stringify(datos, null, 2)};\n`);
}
writeFileSync(join(dirIconos, "index.ts"), aviso + nombres.map((n) => `export { ${camel(n)} } from './${n}.js';`).join("\n") + "\n");

// React: un componente por ícono.
writeFileSync(join(src, "react", "iconos.ts"), aviso + "import { createIcon } from './crear.js';\n" +
  nombres.map((n) => `import { ${camel(n)} } from '../iconos/${n}.js';`).join("\n") + "\n\n" +
  nombres.map((n) => `export const ${pascal(n)} = /* @__PURE__ */ createIcon(${camel(n)}, '${pascal(n)}');`).join("\n") + "\n");

// SVG sueltos dentro del paquete.
rmSync(join(raiz, "paquete", "svg"), { recursive: true, force: true });
cpSync(join(raiz, "svg"), join(raiz, "paquete", "svg"), { recursive: true });

console.log(`${nombres.length} íconos -> paquete/src`);
