/** Data of one icon. `line` and `solid` are the inner contents of a 24x24 SVG. */
export interface IconData {
  name: string;
  category: string;
  tags: string[];
  line: string;
  solid: string | null;
}

export type Variant = 'thin' | 'light' | 'regular' | 'bold' | 'solid';

/** Stroke width of each line variant. */
export const STROKE_WIDTHS: Record<Exclude<Variant, 'solid'>, number> = {
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
}

const escapar = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Attributes and inner content of the SVG, shared by every adapter. */
export function partes(icon: IconData, opts: SvgOptions = {}) {
  const variant = opts.variant ?? 'light';
  const color = opts.color ?? 'currentColor';
  const size = opts.size ?? 24;
  const solid = variant === 'solid' && icon.solid !== null;
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
    const ancho = opts.strokeWidth ?? STROKE_WIDTHS[variant === 'solid' ? 'light' : variant];
    Object.assign(attrs, { fill: 'none', stroke: color, 'stroke-width': String(ancho), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  }
  if (opts.className) attrs['class'] = opts.className;
  if (opts.title) attrs['role'] = 'img';
  else attrs['aria-hidden'] = 'true';
  const titulo = opts.title ? `<title>${escapar(opts.title)}</title>` : '';
  return { attrs, inner: titulo + (solid ? icon.solid! : icon.line) };
}

/** Returns the icon as an SVG string. */
export function toSvg(icon: IconData, opts: SvgOptions = {}): string {
  const { attrs, inner } = partes(icon, opts);
  const a = Object.entries(attrs).map(([k, v]) => `${k}="${escapar(v)}"`).join(' ');
  return `<svg ${a}>${inner}</svg>`;
}
