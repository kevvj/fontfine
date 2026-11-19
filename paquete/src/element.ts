// <fontfine-icon> web component. Works in plain HTML, Angular, Vue, Svelte, etc.
// <fontfine-icon name="llave" variant="bold" size="32" stroke-width="1.5"></fontfine-icon>
import * as iconos from './iconos/index.js';
import { toSvg, type IconData, type Variant } from './tipos.js';

const porNombre = new Map<string, IconData>(Object.values(iconos).map((i) => [i.name, i]));

// En el servidor (SSR) no existe HTMLElement: se usa una clase vacía para no romper la importación.
const Base = (typeof HTMLElement === 'undefined' ? class {} : HTMLElement) as typeof HTMLElement;

export class FontfineIcon extends Base {
  static observedAttributes = ['name', 'variant', 'size', 'stroke-width', 'color', 'label'];

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  private render() {
    const icono = porNombre.get(this.getAttribute('name') ?? '');
    if (!icono) { this.innerHTML = ''; return; }
    const ancho = this.getAttribute('stroke-width');
    this.style.display ||= 'inline-flex';
    this.innerHTML = toSvg(icono, {
      variant: (this.getAttribute('variant') as Variant | null) ?? undefined,
      size: this.getAttribute('size') ?? '1em',
      strokeWidth: ancho ? Number(ancho) : undefined,
      color: this.getAttribute('color') ?? undefined,
      title: this.getAttribute('label') ?? undefined,
    });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('fontfine-icon')) {
  customElements.define('fontfine-icon', FontfineIcon);
}
