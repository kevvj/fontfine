import { Component, HostListener, computed, effect, signal, viewChild, ElementRef } from '@angular/core';
import { ICONOS } from './datos/iconos.generado';
import { GROSOR_MAX, GROSOR_MIN, Icono, Movimiento, VERSIONES, Version, normalizar } from './datos/tipos';
import { SvgPipe } from './svg.pipe';
import { Detalle } from './detalle/detalle';

const TODAS = 'All';

@Component({
  selector: 'app-root',
  imports: [SvgPipe, Detalle],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly iconos = ICONOS;
  protected readonly versiones = VERSIONES;
  protected readonly todas = TODAS;
  protected readonly grosorMin = GROSOR_MIN;
  protected readonly grosorMax = GROSOR_MAX;
  protected readonly logo = ICONOS.find((i) => i.nombre === 'dashboard') ?? ICONOS[0];

  protected readonly busqueda = signal('');
  protected readonly categoria = signal(TODAS);
  protected readonly version = signal<Version>('light');
  protected readonly tamano = signal(28);
  /** Grosor de línea actual. Las versiones Thin a Bold son atajos a un grosor. */
  protected readonly grosor = signal(1.25);
  /** La versión que coincide con el grosor actual (o null si es personalizado). */
  protected readonly versionActiva = computed<Version | null>(() =>
    this.version() === 'solid' ? 'solid' : (VERSIONES.find((v) => v.grosor === this.grosor())?.id ?? null));
  protected readonly tema = signal<'claro' | 'oscuro'>('claro');
  protected readonly seleccionado = signal<Icono | null>(null);
  protected readonly aviso = signal<string | null>(null);
  /** Animaciones: apagadas, al pasar el mouse o siempre. */
  protected readonly movimiento = signal<Movimiento>("hover");
  protected readonly movimientos: { id: Movimiento; nombre: string }[] = [
    { id: "off", nombre: "Off" }, { id: "hover", nombre: "Hover" }, { id: "always", nombre: "Always" }];

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
    if (!q) return base;
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
      .sort((a, b) => a.p - b.p || a.i.nombre.localeCompare(b.i.nombre))
      .map((x) => x.i);
  });

  protected readonly cantidadRelleno = this.iconos.filter((i) => i.relleno).length;

  constructor() {
    // Estado inicial desde la URL (para compartir enlaces) y preferencia de tema.
    const p = new URLSearchParams(location.search);
    this.busqueda.set(p.get('q') ?? '');
    const v = p.get('version') as Version | null;
    if (v && VERSIONES.some((x) => x.id === v)) this.elegirVersion(v);
    const g = Number(p.get('grosor'));
    if (g >= GROSOR_MIN && g <= GROSOR_MAX) this.grosor.set(g);
    const c = p.get('categoria');
    if (c && this.iconos.some((i) => i.categoria === c)) this.categoria.set(c);
    const sel = this.iconos.find((i) => i.nombre === p.get('icono'));
    if (sel) this.seleccionado.set(sel);
    try {
      const guardado = localStorage.getItem('tema');
      if (guardado === 'claro' || guardado === 'oscuro') this.tema.set(guardado);
      else if (matchMedia('(prefers-color-scheme: dark)').matches) this.tema.set('oscuro');
    } catch { /* sin almacenamiento: tema claro */ }

    effect(() => {
      const q = new URLSearchParams();
      if (this.busqueda()) q.set('q', this.busqueda());
      if (this.categoria() !== TODAS) q.set('categoria', this.categoria());
      const va = this.versionActiva();
      if (va && va !== 'light') q.set('version', va);
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
    if (this.version() === 'solid') this.version.set('light');
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
