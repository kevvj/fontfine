import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Icono, Version, svgDe } from './datos/tipos';

/** Muestra un ícono. Los SVG vienen de nuestros propios archivos (generados en el build), no de usuarios. */
@Pipe({ name: 'svg' })
export class SvgPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(icono: Icono, version: Version, tamano = 24, grosor?: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgDe(icono, version, tamano, grosor));
  }
}
