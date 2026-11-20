import { Component, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ICONOS } from '../data/icons.generated';
import { Icono, VERSIONES } from '../data/types';
import { t } from '../data/i18n';
import { SvgPipe } from '../svg.pipe';

interface Seccion { id: string; titulo: string }

/** Página de documentación: instalación y uso de la librería. */
@Component({
  selector: 'app-docs',
  imports: [SvgPipe, NgTemplateOutlet],
  templateUrl: './docs.html',
  styleUrl: './docs.css',
})
export class Docs {
  readonly avisar = output<string>();
  protected readonly t = t;

  protected readonly versiones = VERSIONES;
  protected readonly icono = (n: string): Icono => ICONOS.find((i) => i.nombre === n) ?? ICONOS[0];
  protected readonly animados = ['bell', 'heart', 'gear', 'trash', 'phone', 'arrow-right'].map(this.icono);
  protected readonly total = ICONOS.length;

  protected readonly secciones: Seccion[] = [
    { id: 'install', titulo: 'Install' },
    { id: 'react', titulo: 'React' },
    { id: 'web-component', titulo: 'Angular, Vue, HTML' },
    { id: 'svg-string', titulo: 'SVG string' },
    { id: 'raw-svg', titulo: 'Raw SVG files' },
    { id: 'variants', titulo: 'Variants and stroke' },
    { id: 'duotone', titulo: 'Duotone colors' },
    { id: 'animations', titulo: 'Animations' },
    { id: 'options', titulo: 'All options' },
    { id: 'accessibility', titulo: 'Accessibility' },
    { id: 'contributing', titulo: 'Contributing' },
  ];

  protected readonly codigo = {
    install: 'npm install fontfine',
    react: `import { Bell, Search } from 'fontfine/react';

export function Toolbar() {
  return (
    <>
      <Bell />                                 {/* light, 24px, text color */}
      <Search size={32} variant="bold" />
      <Bell variant="duotone" color="#2563eb" />
      <Bell strokeWidth={1.6} title="Notifications" />
    </>
  );
}`,
    elementJs: `import 'fontfine/element';`,
    elementHtml: `<fontfine-icon name="bell"></fontfine-icon>
<fontfine-icon name="search" variant="bold" size="32"></fontfine-icon>
<fontfine-icon name="bell" stroke-width="1.6" label="Notifications"></fontfine-icon>`,
    angular: `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'fontfine/element';

@Component({
  selector: 'app-toolbar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`<fontfine-icon name="bell" variant="solid"></fontfine-icon>\`,
})
export class Toolbar {}`,
    vue: `// vite.config.js: tell Vue that fontfine-icon is a custom element
vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === 'fontfine-icon' } } })`,
    toSvg: `import { toSvg, bell } from 'fontfine';

const html = toSvg(bell, { size: 24, variant: 'regular', strokeWidth: 1.5 });
// '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ...>...</svg>'`,
    raw: `node_modules/fontfine/svg/line/<name>.svg
node_modules/fontfine/svg/solid/<name>.svg
node_modules/fontfine/svg/duotone/<name>.svg`,
    variants: `<Bell variant="thin" />      // stroke 0.75
<Bell variant="light" />     // stroke 1.25 (default)
<Bell variant="regular" />   // stroke 1.75
<Bell variant="bold" />      // stroke 2.25
<Bell variant="solid" />
<Bell variant="duotone" />
<Bell strokeWidth={1.4} />   // any width`,
    duotone: `/* Both layers take the icon color. Change them with CSS: */
.ff-secondary { opacity: 1; fill: #93c5fd; }
.ff-primary   { fill: #1d4ed8; }`,
    animReact: `import 'fontfine/animations.css';   // once, e.g. in main.tsx

<Bell animate />            // always
<Bell animate="hover" />    // only on hover`,
    animHtml: `<fontfine-icon name="bell" animate></fontfine-icon>
<fontfine-icon name="bell" animate="hover"></fontfine-icon>

<!-- Animate the icon when the whole button is hovered -->
<button class="ff-hover">
  <fontfine-icon name="trash" animate="hover"></fontfine-icon> Delete
</button>`,
    a11y: `<Bell />                          // decorative: aria-hidden="true"
<Bell title="Notifications" />    // meaningful: role="img" + <title>`,
  };

  protected ir(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected async copiar(texto: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(texto);
      this.avisar.emit(t().codigoCopiado);
    } catch {
      this.avisar.emit(t().noCopiado);
    }
  }
}
