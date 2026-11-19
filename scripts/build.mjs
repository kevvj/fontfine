// Lee svg/linea, svg/relleno y metadatos.json, valida todo y genera los datos de la web.
// Uso: node scripts/build.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const metadatos = JSON.parse(readFileSync(join(raiz, "metadatos.json"), "utf8"));

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

const linea = leerCarpeta("linea");
const relleno = leerCarpeta("relleno");

const errores = [];
for (const n of Object.keys(linea)) if (!metadatos[n]) errores.push(`Falta "${n}" en metadatos.json`);
for (const n of Object.keys(metadatos)) if (!linea[n]) errores.push(`metadatos.json tiene "${n}" pero no existe svg/linea/${n}.svg`);
for (const n of Object.keys(relleno)) if (!linea[n]) errores.push(`svg/relleno/${n}.svg no tiene su versión de línea`);
if (errores.length) { console.error(errores.join("\n")); process.exit(1); }

const iconos = Object.keys(linea).map((nombre) => ({
  nombre,
  categoria: metadatos[nombre].categoria,
  etiquetas: metadatos[nombre].etiquetas,
  linea: linea[nombre],
  relleno: relleno[nombre] ?? null,
}));

const destino = join(raiz, "web", "src", "app", "datos");
mkdirSync(destino, { recursive: true });
writeFileSync(join(destino, "iconos.generado.ts"),
`// Generado por scripts/build.mjs. No editar a mano.
import type { Icono } from './tipos';

export const ICONOS: Icono[] = ${JSON.stringify(iconos, null, 2)};
`);
console.log(`${iconos.length} íconos (${Object.keys(relleno).length} con relleno) -> web/src/app/datos/`);
