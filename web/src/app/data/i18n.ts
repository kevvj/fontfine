import { computed, signal } from '@angular/core';

/** Idioma de la web: inglés por defecto; si eligen español se recuerda en localStorage. */
export type Idioma = 'en' | 'es';

const inicial = (): Idioma => {
  try {
    const g = localStorage.getItem('idioma');
    if (g === 'en' || g === 'es') return g;
  } catch { /* sin almacenamiento */ }
  return 'en';
};

export const idioma = signal<Idioma>(inicial());
if (typeof document !== 'undefined') document.documentElement.lang = idioma();

export function cambiarIdioma(i: Idioma): void {
  idioma.set(i);
  try { localStorage.setItem('idioma', i); } catch { /* nada */ }
  document.documentElement.lang = i;
}

const en = {
  // Barra
  icons: 'Icons', docs: 'Docs', contador: (n: number) => `${n} icons · 6 variants`,
  aOscuro: 'Switch to dark mode', aClaro: 'Switch to light mode', oscuro: 'Dark mode', claro: 'Light mode',
  cambiarIdioma: 'Ver en español', menu: 'Main',
  // Portada
  tituloA: 'Clean, ', tituloB: 'thin line', tituloC: ' icons',
  subtitulo: 'Search, preview every variant and copy the SVG. Free and open source.',
  buscar: 'Search icons: wrench, delete, user…', aBuscar: 'Search icons', limpiar: 'Clear search', atajo: 'Press / to search',
  // Rejilla
  categorias: 'Categories', version: 'Variant', animacion: 'Animation', orden: 'Sort', grosor: 'Stroke', tamano: 'Size',
  aGrosor: 'Stroke width', aTamano: 'Icon size',
  movimientos: { off: 'Off', hover: 'Hover', always: 'Always' } as Record<string, string>,
  ordenes: { az: 'A–Z', new: 'Newest' } as Record<string, string>,
  resultados: (n: number) => (n === 1 ? '1 icon' : `${n} icons`),
  para: (q: string) => ` for “${q}”`, en: (c: string) => ` in ${c}`,
  pagina: (a: number, t: number) => ` · page ${a} of ${t}`,
  nuevo: 'New', paginas: 'Pages', anterior: 'Previous page', siguiente: 'Next page',
  sinResultados: (q: string) => `No icons for “${q}”.`, otraPalabra: 'Try another word, or request the icon on GitHub.', verTodos: 'Show all',
  // Detalle
  icono: 'Icon', cerrar: 'Close', cerrarEsc: 'Close (Esc)', versiones: 'Variants', tamanos: 'Sizes', etiquetas: 'Tags',
  copiarAnimacion: 'Copy animation code', animacionCopiada: 'Animation code copied',
  notaAnimacion: 'Use <code>animate</code> to always play it, or <code>animate="hover"</code>. Turns off for users who prefer reduced motion.',
  buscarEtiqueta: (e: string) => `Search “${e}”`, trazo: 'stroke',
  copiarSvg: 'Copy SVG', svgCopiado: 'SVG copied', descargar: 'Download', svgDescargado: 'SVG downloaded',
  copiarNombre: 'Copy name', nombreCopiado: 'Name copied',
  notaColor: 'The SVG uses <code>currentColor</code>, so it takes the color of the surrounding text.',
  noCopiado: 'Could not copy. Select the code and copy it manually.', codigoCopiado: 'Code copied', copiar: 'Copy', copiarCodigo: 'Copy code',
  // Docs
  enEstaPagina: 'On this page', documentacion: 'Documentation',
  intro: (n: number) => `fontfine is a free, open source set of ${n} icons. Every icon has 6 variants, its own animation and a stroke width you can change. It works with React, Angular, Vue, plain HTML and any server.`,
  secciones: {
    install: 'Install', react: 'React', 'web-component': 'Angular, Vue, HTML', 'svg-string': 'SVG string', 'raw-svg': 'Raw SVG files',
    variants: 'Variants and stroke', duotone: 'Duotone colors', animations: 'Animations', options: 'All options', accessibility: 'Accessibility', contributing: 'Contributing',
  } as Record<string, string>,
  tituloWeb: 'Angular, Vue, Svelte or plain HTML',
  reactP1: 'Each icon is a component named in PascalCase (<code>arrow-left</code> → <code>ArrowLeft</code>). Your bundle only includes the icons you import.',
  reactP2: 'Any other SVG prop (<code>className</code>, <code>style</code>, <code>onClick</code>, <code>ref</code>…) is passed to the <code>&lt;svg&gt;</code>.',
  webP: 'Import the web component once. It registers <code>&lt;fontfine-icon&gt;</code>. Its default size is <code>1em</code>, so it follows the font size.',
  angularP: 'Add <code>CUSTOM_ELEMENTS_SCHEMA</code> to the component.',
  svgP: 'For any framework, server rendering, emails or Node scripts. Icons are exported in camelCase (<code>arrowLeft</code>).',
  rawP: 'The package also ships the plain files. You can also copy or download any icon from the <strong>Icons</strong> page.',
  variantsP: '<code>strokeWidth</code> only affects line variants. Icons use <code>currentColor</code>, so they take the text color unless you pass <code>color</code>.',
  duoP: 'Duotone icons have two layers: <code>.ff-primary</code> (solid) and <code>.ff-secondary</code> (40% opacity). By default both use the icon color.',
  animP1: 'Every icon has its own animation: the bell swings, the heart beats, the gear spins. Hover the icons:',
  animP2: 'Animations turn off automatically for people who enable "reduce motion" in their system.',
  tabla: ['React / toSvg', 'Web component', 'Values', 'Default'],
  filas: ['thin · light · regular · bold · solid · duotone', 'any number (line variants)', 'number (px) or CSS size', 'any CSS color', 'accessible name', "true · 'hover'", 'extra classes'],
  deVariante: 'from variant',
  a11yP: 'Without a title the icon is decorative and hidden from screen readers. Give it a title when it is the only content of a button or link.',
  contribP: 'New icons are welcome, drawn by hand or with AI. Every pull request is checked automatically and reviewed before it is merged.',
  enlaces: [
    ['How to contribute', ': steps to add an icon and open a pull request.'],
    ['Style guide (AGENTS.md)', ': exact rules; coding agents read it automatically.'],
    ['Prompt for chat AIs', ': copy, paste and get the 3 files.'],
  ],
  categoria: (c: string) => c,
};

type Textos = typeof en;

const CATEGORIAS_ES: Record<string, string> = {
  All: 'Todos', Actions: 'Acciones', Arrows: 'Flechas', Brands: 'Marcas', Communication: 'Comunicación', Files: 'Archivos', Health: 'Salud',
  Interface: 'Interfaz', 'Letters & Numbers': 'Letras y números', Media: 'Multimedia', 'Music & Audio': 'Música y audio', Nature: 'Naturaleza',
  Objects: 'Objetos', People: 'Personas', Places: 'Lugares', Religion: 'Religión', Security: 'Seguridad', Status: 'Estado',
  Technology: 'Tecnología', Weather: 'Clima',
};

const es: Textos = {
  icons: 'Íconos', docs: 'Docs', contador: (n) => `${n} íconos · 6 versiones`,
  aOscuro: 'Cambiar a modo oscuro', aClaro: 'Cambiar a modo claro', oscuro: 'Modo oscuro', claro: 'Modo claro',
  cambiarIdioma: 'View in English', menu: 'Principal',
  tituloA: 'Íconos de ', tituloB: 'línea fina', tituloC: ', limpios',
  subtitulo: 'Busca, mira cada versión y copia el SVG. Gratis y de código abierto.',
  buscar: 'Buscar íconos en inglés: wrench, delete, user…', aBuscar: 'Buscar íconos', limpiar: 'Borrar búsqueda', atajo: 'Pulsa / para buscar',
  categorias: 'Categorías', version: 'Versión', animacion: 'Animación', orden: 'Orden', grosor: 'Grosor', tamano: 'Tamaño',
  aGrosor: 'Grosor de línea', aTamano: 'Tamaño del ícono',
  movimientos: { off: 'Apagada', hover: 'Al pasar', always: 'Siempre' },
  ordenes: { az: 'A–Z', new: 'Recientes' },
  resultados: (n) => (n === 1 ? '1 ícono' : `${n} íconos`),
  para: (q) => ` para “${q}”`, en: (c) => ` en ${CATEGORIAS_ES[c] ?? c}`,
  pagina: (a, t) => ` · página ${a} de ${t}`,
  nuevo: 'Nuevo', paginas: 'Páginas', anterior: 'Página anterior', siguiente: 'Página siguiente',
  sinResultados: (q) => `No hay íconos para “${q}”.`, otraPalabra: 'Prueba otra palabra (en inglés) o pide el ícono en GitHub.', verTodos: 'Ver todos',
  icono: 'Ícono', cerrar: 'Cerrar', cerrarEsc: 'Cerrar (Esc)', versiones: 'Versiones', tamanos: 'Tamaños', etiquetas: 'Etiquetas',
  copiarAnimacion: 'Copiar código de la animación', animacionCopiada: 'Código de la animación copiado',
  notaAnimacion: 'Usa <code>animate</code> para que siempre se mueva, o <code>animate="hover"</code>. Se apaga para quien prefiere reducir el movimiento.',
  buscarEtiqueta: (e) => `Buscar “${e}”`, trazo: 'grosor',
  copiarSvg: 'Copiar SVG', svgCopiado: 'SVG copiado', descargar: 'Descargar', svgDescargado: 'SVG descargado',
  copiarNombre: 'Copiar nombre', nombreCopiado: 'Nombre copiado',
  notaColor: 'El SVG usa <code>currentColor</code>, así que toma el color del texto que lo rodea.',
  noCopiado: 'No se pudo copiar. Selecciona el código y cópialo a mano.', codigoCopiado: 'Código copiado', copiar: 'Copiar', copiarCodigo: 'Copiar código',
  enEstaPagina: 'En esta página', documentacion: 'Documentación',
  intro: (n) => `fontfine es un set gratuito y de código abierto de ${n} íconos. Cada ícono tiene 6 versiones, su propia animación y un grosor de línea que puedes cambiar. Funciona con React, Angular, Vue, HTML puro y cualquier servidor.`,
  secciones: {
    install: 'Instalación', react: 'React', 'web-component': 'Angular, Vue, HTML', 'svg-string': 'SVG como texto', 'raw-svg': 'Archivos SVG',
    variants: 'Versiones y grosor', duotone: 'Colores duotone', animations: 'Animaciones', options: 'Todas las opciones', accessibility: 'Accesibilidad', contributing: 'Contribuir',
  },
  tituloWeb: 'Angular, Vue, Svelte o HTML puro',
  reactP1: 'Cada ícono es un componente en PascalCase (<code>arrow-left</code> → <code>ArrowLeft</code>). Tu bundle solo incluye los íconos que importas.',
  reactP2: 'Cualquier otra prop de SVG (<code>className</code>, <code>style</code>, <code>onClick</code>, <code>ref</code>…) pasa al <code>&lt;svg&gt;</code>.',
  webP: 'Importa el web component una vez. Registra <code>&lt;fontfine-icon&gt;</code>. Su tamaño por defecto es <code>1em</code>, así que sigue el tamaño de la letra.',
  angularP: 'Agrega <code>CUSTOM_ELEMENTS_SCHEMA</code> al componente.',
  svgP: 'Para cualquier framework, render en el servidor, correos o scripts de Node. Los íconos se exportan en camelCase (<code>arrowLeft</code>).',
  rawP: 'El paquete también trae los archivos sueltos. También puedes copiar o descargar cualquier ícono desde la página <strong>Íconos</strong>.',
  variantsP: '<code>strokeWidth</code> solo afecta a las versiones de línea. Los íconos usan <code>currentColor</code>, así que toman el color del texto salvo que pases <code>color</code>.',
  duoP: 'Los íconos duotone tienen dos capas: <code>.ff-primary</code> (sólida) y <code>.ff-secondary</code> (40% de opacidad). Por defecto ambas usan el color del ícono.',
  animP1: 'Cada ícono tiene su propia animación: la campana se mece, el corazón late, el engranaje gira. Pasa el mouse por los íconos:',
  animP2: 'Las animaciones se apagan solas para quien activa "reducir movimiento" en su sistema.',
  tabla: ['React / toSvg', 'Web component', 'Valores', 'Por defecto'],
  filas: ['thin · light · regular · bold · solid · duotone', 'cualquier número (versiones de línea)', 'número (px) o tamaño CSS', 'cualquier color CSS', 'nombre accesible', "true · 'hover'", 'clases extra'],
  deVariante: 'según la versión',
  a11yP: 'Sin título el ícono es decorativo y los lectores de pantalla lo ignoran. Ponle título cuando sea lo único dentro de un botón o enlace.',
  contribP: 'Los íconos nuevos son bienvenidos, dibujados a mano o con IA. Cada pull request se revisa automáticamente y a mano antes de unirlo.',
  enlaces: [
    ['Cómo contribuir', ': pasos para agregar un ícono y abrir un pull request.'],
    ['Guía de estilo (AGENTS.md)', ': reglas exactas; los agentes de código la leen solos.'],
    ['Prompt para IAs de chat', ': copia, pega y obtén los 3 archivos.'],
  ],
  categoria: (c) => CATEGORIAS_ES[c] ?? c,
};

/** Textos de la web en el idioma actual. */
export const t = computed<Textos>(() => (idioma() === 'es' ? es : en));
