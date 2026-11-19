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
  /** Play the icon's own animation: true = always, 'hover' = on hover. Import 'fontfine/animations.css' once. */
  animate?: boolean | 'hover';
}

const aReact = (k: string) => k.replace(/-([a-z])/g, (_, l: string) => l.toUpperCase());

export function createIcon(icon: IconData, displayName: string) {
  const Componente = forwardRef<SVGSVGElement, IconProps>(function Icono(
    { size, variant, strokeWidth, color, title, className, animate, style, ...resto },
    ref,
  ) {
    const { attrs, inner } = partes(icon, { size, variant, strokeWidth, color, title, className, animate });
    const props: Record<string, unknown> = { ref, dangerouslySetInnerHTML: { __html: inner } };
    const origen = attrs['style'];
    delete attrs['style'];
    if (origen || style) props['style'] = { ...(origen ? { '--ff-origin': icon.origin } : {}), ...style };
    for (const [k, v] of Object.entries(attrs)) props[k === 'class' ? 'className' : k.startsWith('aria-') ? k : aReact(k)] = v;
    return createElement('svg', { ...props, ...resto });
  });
  Componente.displayName = displayName;
  return Componente;
}
