import { createElement, forwardRef, type SVGProps } from 'react';
import { partes, type IconData, type Variant } from '../tipos.js';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'> {
  /** Width and height. Default: 24. */
  size?: number | string;
  /** 'thin' | 'light' | 'regular' | 'bold' | 'solid'. Default: 'light'. */
  variant?: Variant;
  /** Custom stroke width for line variants. */
  strokeWidth?: number;
  /** Default: 'currentColor'. */
  color?: string;
  /** Accessible title. Without it the icon is decorative. */
  title?: string;
}

const aReact = (k: string) => k.replace(/-([a-z])/g, (_, l: string) => l.toUpperCase());

export function createIcon(icon: IconData, displayName: string) {
  const Componente = forwardRef<SVGSVGElement, IconProps>(function Icono(
    { size, variant, strokeWidth, color, title, className, ...resto },
    ref,
  ) {
    const { attrs, inner } = partes(icon, { size, variant, strokeWidth, color, title, className });
    const props: Record<string, unknown> = { ref, dangerouslySetInnerHTML: { __html: inner } };
    for (const [k, v] of Object.entries(attrs)) props[k === 'class' ? 'className' : k.startsWith('aria-') ? k : aReact(k)] = v;
    return createElement('svg', { ...props, ...resto });
  });
  Componente.displayName = displayName;
  return Componente;
}
