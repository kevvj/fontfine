import { Component, computed, input, output } from '@angular/core';
import { Icono, Movimiento, VERSIONES, Version, esRelleno, soloThinSolid, svgDe, versionDe } from '../data/types';
import { t } from '../data/i18n';
import { SvgPipe } from '../svg.pipe';

@Component({
  selector: 'app-detalle',
  imports: [SvgPipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detalle {
  readonly icono = input.required<Icono>();
  readonly version = input.required<Version>();
  readonly grosor = input.required<number>();
  readonly versionActiva = input.required<Version | null>();
  readonly movimiento = input<Movimiento>("hover");
  /** Cómo usar la animación de este ícono (React y CSS). */
  protected readonly codigoAnimacion = computed(() => {
    const i = this.icono();
    const p = i.nombre.split("-").map((x) => x[0].toUpperCase() + x.slice(1)).join("");
    return `import 'fontfine/animations.css';

// React
<${p} animate="hover" />

<!-- HTML, Angular, Vue -->
<fontfine-icon name="${i.nombre}" animate="hover"></fontfine-icon>`;
  });
  readonly cerrar = output<void>();
  readonly cambiarVersion = output<Version>();
  readonly etiqueta = output<string>();
  readonly avisar = output<string>();

  /** Las marcas solo muestran Thin y Solid. */
  protected readonly versiones = computed(() => (soloThinSolid(this.icono()) ? VERSIONES.filter((v) => v.id === 'thin' || v.id === 'solid') : VERSIONES));
  protected readonly activa = computed(() => { const v = this.versionActiva() ?? this.version(); return soloThinSolid(this.icono()) ? versionDe(this.icono(), v) : this.versionActiva(); });
  protected readonly esRelleno = esRelleno;
  protected readonly tamanos = [16, 20, 24, 32, 48];
  protected readonly t = t;

  /** Si piden Solid y este ícono no lo tiene, se muestra la línea y se avisa. */
  protected readonly faltaRelleno = computed(() => this.version() === 'solid' && !this.icono().relleno);
  protected readonly codigo = computed(() => svgDe(this.icono(), this.version(), 24, this.grosor()));

  protected async copiar(texto: string, mensaje: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(texto);
      this.avisar.emit(mensaje);
    } catch {
      this.avisar.emit(t().noCopiado);
    }
  }

  protected descargar(): void {
    const blob = new Blob([this.codigo() + '\n'], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.icono().nombre}${this.version() === 'light' ? '' : '-' + this.version()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    this.avisar.emit(t().svgDescargado);
  }
}
