/** Data of one icon. `line` and `solid` are the inner contents of a 24x24 SVG. */
export interface IconData {
  name: string;
  category: string;
  tags: string[];
  line: string;
  solid: string | null;
  /** Duotone: layers with classes ff-secondary (40% opacity) and ff-primary. */
  duotone: string | null;
  /** Name of the icon's own animation (class ff-<name> in animations.css). */
  animation: string;
  /** Transform origin of the animation, when it is not the center. */
  origin: string | null;
}

export type Variant = 'thin' | 'light' | 'regular' | 'bold' | 'solid' | 'duotone';

/** Stroke width of the thin variant of brand logos: thicker than a normal thin so the outline reads at small sizes. */
export const BRAND_THIN_WIDTH = 1.25;

/** Stroke width of each line variant. */
export const STROKE_WIDTHS: Record<Exclude<Variant, 'solid' | 'duotone'>, number> = {
  thin: 0.75,
  light: 1.25,
  regular: 1.75,
  bold: 2.25,
};

export interface SvgOptions {
  /** Width and height. Number (px) or any CSS size. Default: 24. */
  size?: number | string;
  /** Default: 'light'. */
  variant?: Variant;
  /** Custom stroke width for line variants (overrides the variant's width). */
  strokeWidth?: number;
  /** Default: 'currentColor' (takes the text color). */
  color?: string;
  /** Accessible title. Without it the icon is decorative (aria-hidden). */
  title?: string;
  /** Extra class names. */
  className?: string;
  /** Play the icon's own animation: true = always, 'hover' = on hover. Needs fontfine/animations.css. */
  animate?: boolean | 'hover';
}

const escapar = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Attributes and inner content of the SVG, shared by every adapter. */
export function partes(icon: IconData, opts: SvgOptions = {}) {
  // Brand logos only have two variants: thin (line) and solid (filled).
  const marca = icon.category === 'Brands';
  const pedida = opts.variant ?? 'light';
  const variant: Variant = marca ? (pedida === 'solid' || pedida === 'duotone' ? 'solid' : 'thin') : pedida;
  const color = opts.color ?? 'currentColor';
  const size = opts.size ?? 24;
  const relleno = variant === 'duotone' ? icon.duotone : variant === 'solid' ? icon.solid : null;
  const solid = relleno !== null;
  const attrs: Record<string, string> = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    width: String(size),
    height: String(size),
  };
  if (solid) {
    attrs['fill'] = color;
    attrs['fill-rule'] = 'evenodd';
  } else {
    const ancho = opts.strokeWidth ?? (marca ? BRAND_THIN_WIDTH : undefined) ?? STROKE_WIDTHS[variant === 'solid' ? 'bold' : variant === 'duotone' ? 'light' : variant];
    Object.assign(attrs, { fill: 'none', stroke: color, 'stroke-width': String(ancho), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  }
  const clases = [opts.className];
  if (opts.animate) {
    clases.unshift(`ff-anim ff-${icon.animation}` + (opts.animate === 'hover' ? ' ff-anim-hover' : ''));
    if (icon.origin) attrs['style'] = `--ff-origin: ${icon.origin}`;
  }
  const clase = clases.filter(Boolean).join(' ');
  if (clase) attrs['class'] = clase;
  if (opts.title) attrs['role'] = 'img';
  else attrs['aria-hidden'] = 'true';
  const titulo = opts.title ? `<title>${escapar(opts.title)}</title>` : '';
  return { attrs, inner: titulo + (relleno ?? icon.line) };
}

/** Returns the icon as an SVG string. */
export function toSvg(icon: IconData, opts: SvgOptions = {}): string {
  const { attrs, inner } = partes(icon, opts);
  const a = Object.entries(attrs).map(([k, v]) => `${k}="${escapar(v)}"`).join(' ');
  return `<svg ${a}>${inner}</svg>`;
}
