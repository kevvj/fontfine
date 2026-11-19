export interface Icono {
  nombre: string;
  categoria: string;
  etiquetas: string[];
  /** Contenido interno del SVG de línea (viewBox 0 0 24 24). */
  linea: string;
  /** Contenido interno del SVG relleno, o null si todavía no existe. */
  relleno: string | null;
  /** Contenido del SVG Duotone Sharp (capas ff-secondary y ff-primary), o null. */
  duotono: string | null;
  /** Animación propia del ícono (clase ff-<nombre> de animations.css). */
  animacion: string;
  /** Punto de giro de la animación, si no es el centro. */
  origen: string | null;
}

export type Movimiento = "off" | "hover" | "always";

export type Version = 'thin' | 'light' | 'regular' | 'bold' | 'solid' | 'duotone';

/** Versiones rellenas: no tienen grosor de línea. */
export const esRelleno = (v: Version) => v === 'solid' || v === 'duotone';

export const VERSIONES: { id: Version; nombre: string; grosor: number | null }[] = [
  { id: 'thin', nombre: 'Thin', grosor: 0.75 },
  { id: 'light', nombre: 'Light', grosor: 1.25 },
  { id: 'regular', nombre: 'Regular', grosor: 1.75 },
  { id: 'bold', nombre: 'Bold', grosor: 2.25 },
  { id: 'solid', nombre: 'Solid', grosor: null },
  { id: 'duotone', nombre: 'Duotone', grosor: null },
];

export const GROSOR_MIN = 0.5;
export const GROSOR_MAX = 3;

/** Arma el SVG completo de un ícono en una versión. Si no hay relleno, usa la línea. */
export function svgDe(icono: Icono, version: Version, tamano = 24, grosor?: number, color = 'currentColor'): string {
  const v = VERSIONES.find((x) => x.id === version)!;
  const relleno = version === 'duotone' ? icono.duotono : version === 'solid' ? icono.relleno : null;
  if (relleno) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${tamano}" height="${tamano}" fill="${color}" fill-rule="evenodd">${relleno}</svg>`;
  }
  const trazo = grosor ?? v.grosor ?? 1.25;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${tamano}" height="${tamano}" fill="none" stroke="${color}" stroke-width="${trazo}" stroke-linecap="round" stroke-linejoin="round">${icono.linea}</svg>`;
}

/** Quita tildes y pasa a minúsculas para buscar. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}
