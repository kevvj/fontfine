import { Component, HostListener, computed, effect, linkedSignal, signal, viewChild, ElementRef } from '@angular/core';
import { ICONOS } from './data/icons.generated';
import { GROSOR_MAX, GROSOR_MIN, Icono, Movimiento, Orden, VERSIONES, Version, esRelleno, normalizar } from './data/types';
import { SvgPipe } from './svg.pipe';
import { Detalle } from './detail/detail';
import { Docs } from './docs/docs';

const TODAS = 'All';
/** Íconos por página en la rejilla. */
const POR_PAGINA = 100;

@Component({
  selector: 'app-root',
  imports: [SvgPipe, Detalle, Docs],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly iconos = ICONOS;
  protected readonly versiones = VERSIONES;
  protected readonly todas = TODAS;
  protected readonly esRelleno = esRelleno;
  protected readonly grosorMin = GROSOR_MIN;
  protected readonly grosorMax = GROSOR_MAX;
  protected readonly logo = ICONOS.find((i) => i.nombre === 'dashboard') ?? ICONOS[0];

  protected readonly busqueda = signal('');
  protected readonly categoria = signal(TODAS);
  protected readonly version = signal<Version>('regular');
  protected readonly tamano = signal(36);
  /** Grosor de línea actual. Las versiones Thin a Bold son atajos a un grosor. */
  protected readonly grosor = signal(1.75);
  /** La versión que coincide con el grosor actual (o null si es personalizado). */
  protected readonly versionActiva = computed<Version | null>(() =>
    esRelleno(this.version()) ? this.version() : (VERSIONES.find((v) => v.grosor === this.grosor())?.id ?? null));
  protected readonly tema = signal<'claro' | 'oscuro'>('claro');
  protected readonly seleccionado = signal<Icono | null>(null);
  protected readonly aviso = signal<string | null>(null);
  /** Página visible: buscador de íconos o documentación. */
  protected readonly pagina = signal<'icons' | 'docs'>('icons');
  /** Animaciones: apagadas, al pasar el mouse o siempre. */
  protected readonly movimiento = signal<Movimiento>("hover");
  protected readonly movimientos: { id: Movimiento; nombre: string }[] = [
    { id: "off", nombre: "Off" }, { id: "hover", nombre: "Hover" }, { id: "always", nombre: "Always" }];

  /** Orden de la rejilla: alfabético o más recientes primero. */
  protected readonly orden = signal<Orden>('az');
  protected readonly ordenes: { id: Orden; nombre: string }[] = [{ id: 'az', nombre: 'A–Z' }, { id: 'new', nombre: 'Newest' }];
  private readonly comparar = (a: Icono, b: Icono): number =>
    this.orden() === 'new' ? b.agregado - a.agregado || a.nombre.localeCompare(b.nombre) : a.nombre.localeCompare(b.nombre);

  private readonly campoBusqueda = viewChild<ElementRef<HTMLInputElement>>('campoBusqueda');
  private temporizadorAviso?: ReturnType<typeof setTimeout>;

  protected readonly categorias = computed(() => {
    const cuenta = new Map<string, number>();
    for (const i of this.iconos) cuenta.set(i.categoria, (cuenta.get(i.categoria) ?? 0) + 1);
    const lista = [...cuenta.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'));
    return [{ nombre: TODAS, cantidad: this.iconos.length }, ...lista.map(([nombre, cantidad]) => ({ nombre, cantidad }))];
  });

  protected readonly resultados = computed(() => {
    const q = normalizar(this.busqueda());
    const cat = this.categoria();
    const base = cat === TODAS ? this.iconos : this.iconos.filter((i) => i.categoria === cat);
    if (!q) return [...base].sort(this.comparar);
    const puntaje = (i: Icono): number => {
      const nombre = normalizar(i.nombre.replace(/-/g, ' '));
      if (nombre === q) return 0;
      if (nombre.startsWith(q)) return 1;
      if (nombre.includes(q)) return 2;
      if (i.etiquetas.some((e) => normalizar(e).startsWith(q))) return 3;
      if (i.etiquetas.some((e) => normalizar(e).includes(q))) return 4;
      if (normalizar(i.categoria).includes(q)) return 5;
      return -1;
    };
    return base
      .map((i) => ({ i, p: puntaje(i) }))
      .filter((x) => x.p >= 0)
      .sort((a, b) => a.p - b.p || this.comparar(a.i, b.i))
      .map((x) => x.i);
  });

  /** Página actual de la rejilla; vuelve a la 1 cuando cambian los resultados. */
  protected readonly paginaActual = linkedSignal<Icono[], number>({ source: this.resultados, computation: () => 1 });
  protected readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.resultados().length / POR_PAGINA)));
  protected readonly visibles = computed(() => {
    const inicio = (this.paginaActual() - 1) * POR_PAGINA;
    return this.resultados().slice(inicio, inicio + POR_PAGINA);
  });
  /** Números del paginador, con "…" cuando hay muchas páginas: 1 … 4 5 6 … 14 */
  protected readonly numerosPagina = computed<(number | null)[]>(() => {
    const total = this.totalPaginas(), actual = this.paginaActual();
    const lista: (number | null)[] = [];
    for (let n = 1; n <= total; n++) {
      if (n === 1 || n === total || Math.abs(n - actual) <= 1) lista.push(n);
      else if (lista[lista.length - 1] !== null) lista.push(null);
    }
    return lista;
  });

  protected irAPagina(n: number): void {
    this.paginaActual.set(Math.min(Math.max(1, n), this.totalPaginas()));
    document.querySelector('.info-resultados')?.scrollIntoView({ block: 'start' });
  }

  protected readonly cantidadRelleno = this.iconos.filter((i) => i.relleno).length;

  constructor() {
    // Estado inicial desde la URL (para compartir enlaces) y preferencia de tema.
    const p = new URLSearchParams(location.search);
    this.busqueda.set(p.get('q') ?? '');
    if (p.get('page') === 'docs') this.pagina.set('docs');
    const v = p.get('version') as Version | null;
    if (v && VERSIONES.some((x) => x.id === v)) this.elegirVersion(v);
    const g = Number(p.get('grosor'));
    if (g >= GROSOR_MIN && g <= GROSOR_MAX) this.grosor.set(g);
    const c = p.get('categoria');
    if (c && this.iconos.some((i) => i.categoria === c)) this.categoria.set(c);
    if (p.get('sort') === 'new') this.orden.set('new');
    const sel = this.iconos.find((i) => i.nombre === p.get('icono'));
    if (sel) this.seleccionado.set(sel);
    try {
      const guardado = localStorage.getItem('tema');
      if (guardado === 'claro' || guardado === 'oscuro') this.tema.set(guardado);
      else if (matchMedia('(prefers-color-scheme: dark)').matches) this.tema.set('oscuro');
    } catch { /* sin almacenamiento: tema claro */ }

    effect(() => {
      const q = new URLSearchParams();
      if (this.pagina() === 'docs') { history.replaceState(null, '', '?page=docs'); return; }
      if (this.busqueda()) q.set('q', this.busqueda());
      if (this.categoria() !== TODAS) q.set('categoria', this.categoria());
      if (this.orden() === 'new') q.set('sort', 'new');
      const va = this.versionActiva();
      if (va && va !== 'regular') q.set('version', va);
      if (!va) q.set('grosor', String(this.grosor()));
      const s = this.seleccionado();
      if (s) q.set('icono', s.nombre);
      const texto = q.toString();
      history.replaceState(null, '', texto ? `?${texto}` : location.pathname);
    });

    effect(() => {
      document.documentElement.dataset['tema'] = this.tema();
      try { localStorage.setItem('tema', this.tema()); } catch { /* nada */ }
    });
  }

  protected elegirVersion(v: Version): void {
    this.version.set(v);
    const g = VERSIONES.find((x) => x.id === v)?.grosor;
    if (g != null) this.grosor.set(g);
  }

  protected cambiarGrosor(g: number): void {
    this.grosor.set(g);
    if (esRelleno(this.version())) this.version.set('regular');
  }

  protected verPagina(p: 'icons' | 'docs'): void {
    this.pagina.set(p);
    this.seleccionado.set(null);
    scrollTo({ top: 0 });
  }

  protected alternarTema(): void {
    this.tema.update((t) => (t === 'claro' ? 'oscuro' : 'claro'));
  }

  protected buscarEtiqueta(etiqueta: string): void {
    this.categoria.set(TODAS);
    this.busqueda.set(etiqueta);
    this.seleccionado.set(null);
  }

  protected limpiar(): void {
    this.busqueda.set('');
    this.categoria.set(TODAS);
    this.campoBusqueda()?.nativeElement.focus();
  }

  protected mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    clearTimeout(this.temporizadorAviso);
    this.temporizadorAviso = setTimeout(() => this.aviso.set(null), 1800);
  }

  /** Cierra el panel de detalle al hacer clic fuera (menos en otra tarjeta o en los controles). */
  @HostListener('document:click', ['$event'])
  protected clicFuera(e: MouseEvent): void {
    if (!this.seleccionado()) return;
    const t = e.target as HTMLElement | null;
    if (!t?.isConnected || t.closest('app-detalle, .tarjeta, .controles, .barra')) return;
    this.seleccionado.set(null);
  }

  @HostListener('document:keydown', ['$event'])
  protected teclas(e: KeyboardEvent): void {
    const enCampo = (e.target as HTMLElement | null)?.closest('input, textarea');
    if (e.key === '/' && !enCampo) {
      e.preventDefault();
      this.campoBusqueda()?.nativeElement.focus();
    } else if (e.key === 'Escape') {
      if (this.seleccionado()) this.seleccionado.set(null);
      else if (enCampo && this.busqueda()) this.busqueda.set('');
    }
  }
}
