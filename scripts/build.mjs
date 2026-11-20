// Lee svg/linea, svg/relleno y metadata.json, valida todo y genera los datos de la web.
// Uso: node scripts/build.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const metadatos = JSON.parse(readFileSync(join(raiz, "metadata.json"), "utf8"));

function leerCarpeta(carpeta) {
  const dir = join(raiz, "svg", carpeta);
  const salida = {};
  if (!existsSync(dir)) return salida;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".svg")).sort()) {
    const nombre = f.slice(0, -4);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nombre)) throw new Error(`svg/${carpeta}/${f}: nombre inválido (minúsculas, números y guiones)`);
    const svg = readFileSync(join(dir, f), "utf8");
    const m = svg.match(/<svg[^>]*viewBox="0 0 24 24"[^>]*>([\s\S]*)<\/svg>/);
    if (!m) throw new Error(`svg/${carpeta}/${f}: falta viewBox="0 0 24 24"`);
    salida[nombre] = m[1].trim();
  }
  return salida;
}

const linea = leerCarpeta("line");
const relleno = leerCarpeta("solid");
const duotono = leerCarpeta("duotone");

const errores = [];
for (const n of Object.keys(linea)) if (!metadatos[n]) errores.push(`Falta "${n}" en metadata.json`);
for (const n of Object.keys(metadatos)) if (!linea[n]) errores.push(`metadata.json tiene "${n}" pero no existe svg/line/${n}.svg`);
for (const n of Object.keys(relleno)) if (!linea[n]) errores.push(`svg/solid/${n}.svg no tiene su versión de línea`);
if (errores.length) { console.error(errores.join("\n")); process.exit(1); }

// Fecha de alta: primer commit que agregó svg/line/<nombre>.svg. Lo que aún no está en git cuenta como ahora.
const agregado = {};
try {
  const log = execFileSync("git", ["log", "--diff-filter=A", "--format=@%ct", "--name-only", "--", "svg/line"], { cwd: raiz, encoding: "utf8" });
  let t = 0;
  for (const l of log.split(/\r?\n/)) {
    if (l.startsWith("@")) t = Number(l.slice(1));
    else if (l.startsWith("svg/line/")) agregado[l.slice(9, -4)] = t; // el log va de nuevo a viejo: queda el primero
  }
} catch { /* sin git: todos iguales */ }
const ahora = Math.floor(Date.now() / 1000);
// "New": los íconos de las 3 últimas tandas (commits que agregaron íconos). Lo que aún no está en git también.
const TANDAS_NUEVAS = 3;
const fechas = [...new Set(Object.values(agregado))].sort((a, b) => b - a);
const corte = fechas[TANDAS_NUEVAS - 1] ?? Infinity; // sin historial suficiente: ninguno
// Vista previa de una tanda: "New" solo en los íconos que no están en main (FF_TANDA=1) o en la ref dada (FF_TANDA=<ref>).
let enMain = null;
if (process.env.FF_TANDA) {
  try {
    enMain = new Set(execFileSync("git", ["ls-tree", "--name-only", process.env.FF_TANDA === "1" ? "main" : process.env.FF_TANDA, "svg/line/"], { cwd: raiz, encoding: "utf8" })
      .split(/\r?\n/).filter(Boolean).map((f) => f.slice(9, -4)));
  } catch { /* sin git: regla normal */ }
}
const esNuevo = (nombre) => (enMain ? !enMain.has(nombre) : (agregado[nombre] ?? ahora) >= corte);

const iconos = Object.keys(linea).map((nombre) => ({
  nombre,
  categoria: metadatos[nombre].category,
  etiquetas: metadatos[nombre].tags,
  linea: linea[nombre],
  relleno: relleno[nombre] ?? null,
  duotono: duotono[nombre] ?? null,
  animacion: metadatos[nombre].animation ?? "pulse",
  origen: metadatos[nombre].origin ?? null,
  agregado: agregado[nombre] ?? ahora,
  nuevo: esNuevo(nombre),
}));

const destino = join(raiz, "web", "src", "app", "data");
mkdirSync(destino, { recursive: true });
writeFileSync(join(destino, "icons.generated.ts"),
`// Generado por scripts/build.mjs. No editar a mano.
import type { Icono } from './types';

export const ICONOS: Icono[] = ${JSON.stringify(iconos, null, 2)};
`);
// Animaciones: la web usa el mismo CSS que el paquete.
writeFileSync(join(raiz, "web", "src", "animations.generated.css"), readFileSync(join(raiz, "animations.css"), "utf8"));
console.log(`${iconos.length} íconos (${Object.keys(relleno).length} con relleno) -> web/src/app/data/`);
