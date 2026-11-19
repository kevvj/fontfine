import { Component, computed, input, output } from '@angular/core';
import { Icono, VERSIONES, Version, svgDe } from '../datos/tipos';
import { SvgPipe } from '../svg.pipe';

@Component({
  selector: 'app-detalle',
  imports: [SvgPipe],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle {
  readonly icono = input.required<Icono>();
  readonly version = input.required<Version>();
  readonly grosor = input.required<number>();
  readonly versionActiva = input.required<Version | null>();
  readonly cerrar = output<void>();
  readonly cambiarVersion = output<Version>();
  readonly etiqueta = output<string>();
  readonly avisar = output<string>();

  protected readonly versiones = VERSIONES;
  protected readonly tamanos = [16, 20, 24, 32, 48];

  /** Si piden Solid y este ícono no lo tiene, se muestra la línea y se avisa. */
  protected readonly faltaRelleno = computed(() => this.version() === 'solid' && !this.icono().relleno);
  protected readonly codigo = computed(() => svgDe(this.icono(), this.version(), 24, this.grosor()));

  protected async copiar(texto: string, mensaje: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(texto);
      this.avisar.emit(mensaje);
    } catch {
      this.avisar.emit('No se pudo copiar. Selecciona el código y cópialo a mano.');
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
    this.avisar.emit('SVG descargado');
  }
}
