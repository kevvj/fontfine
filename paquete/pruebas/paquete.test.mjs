import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import * as core from 'fontfine';
import * as react from 'fontfine/react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const nombres = readdirSync(new URL('../svg/linea/', import.meta.url)).map((f) => f.slice(0, -4));
const iconos = Object.values(core).filter((v) => v && typeof v === 'object' && 'line' in v);

test('exporta todos los íconos', () => {
  assert.equal(iconos.length, nombres.length);
});

test('toSvg: variante por defecto es light (1.25) con currentColor', () => {
  const s = core.toSvg(core.llave);
  assert.match(s, /stroke-width="1.25"/);
  assert.match(s, /stroke="currentColor"/);
  assert.match(s, /aria-hidden="true"/);
});

test('toSvg: grosor personalizado, tamaño y título', () => {
  const s = core.toSvg(core.llave, { strokeWidth: 1.6, size: 32, title: 'Llave <x>' });
  assert.match(s, /stroke-width="1.6"/);
  assert.match(s, /width="32"/);
  assert.match(s, /<title>Llave &lt;x&gt;<\/title>/);
  assert.match(s, /role="img"/);
});

test('toSvg: solid usa relleno', () => {
  const s = core.toSvg(core.llave, { variant: 'solid' });
  assert.match(s, /fill="currentColor"/);
  assert.doesNotMatch(s, /stroke-width/);
});

test('todos los íconos tienen versión solid', () => {
  for (const i of iconos) assert.ok(i.solid, i.name);
});

test('React: renderiza con props', () => {
  const html = renderToStaticMarkup(createElement(react.Llave, { size: 20, variant: 'bold', className: 'x' }));
  assert.match(html, /^<svg/);
  assert.match(html, /stroke-width="2.25"/);
  assert.match(html, /width="20"/);
  assert.match(html, /class="x"/);
  assert.match(html, /<path/);
});

test('React: un componente por ícono', () => {
  const comps = Object.keys(react).filter((k) => /^[A-Z]/.test(k));
  assert.equal(comps.length, nombres.length);
});

test('element: se puede importar en el servidor', async () => {
  await import('fontfine/element');
});
