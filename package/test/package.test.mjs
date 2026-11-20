import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import * as core from 'fontfine';
import * as react from 'fontfine/react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const nombres = readdirSync(new URL('../svg/line/', import.meta.url)).map((f) => f.slice(0, -4));
const iconos = Object.values(core).filter((v) => v && typeof v === 'object' && 'line' in v);

test('exporta todos los íconos', () => {
  assert.equal(iconos.length, nombres.length);
});

test('toSvg: variante por defecto es light (1.25) con currentColor', () => {
  const s = core.toSvg(core.wrench);
  assert.match(s, /stroke-width="1.25"/);
  assert.match(s, /stroke="currentColor"/);
  assert.match(s, /aria-hidden="true"/);
});

test('toSvg: grosor personalizado, tamaño y título', () => {
  const s = core.toSvg(core.wrench, { strokeWidth: 1.6, size: 32, title: 'Wrench <x>' });
  assert.match(s, /stroke-width="1.6"/);
  assert.match(s, /width="32"/);
  assert.match(s, /<title>Wrench &lt;x&gt;<\/title>/);
  assert.match(s, /role="img"/);
});

test('toSvg: solid usa relleno', () => {
  const s = core.toSvg(core.wrench, { variant: 'solid' });
  assert.match(s, /fill="currentColor"/);
  assert.doesNotMatch(s, /stroke-width/);
});

test('solid sin archivo propio usa la línea en bold', () => {
  const sinSolid = iconos.filter((i) => !i.solid);
  assert.ok(sinSolid.length > 0);
  for (const i of sinSolid) assert.match(core.toSvg(i, { variant: 'solid' }), /stroke-width="2\.25"/, i.name);
  assert.match(core.toSvg(core.wrench, { variant: 'solid' }), /fill-rule="evenodd"/);
});

test('React: renderiza con props', () => {
  const html = renderToStaticMarkup(createElement(react.Wrench, { size: 20, variant: 'bold', className: 'x' }));
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

test('animate: clase de su animación, origen y modo hover', () => {
  const s = core.toSvg(core.bell, { animate: true });
  assert.match(s, /class="ff-anim ff-swing"/);
  assert.match(s, /style="--ff-origin: 50% 12%"/);
  assert.match(core.toSvg(core.gear, { animate: 'hover', className: 'x' }), /class="ff-anim ff-spin ff-anim-hover x"/);
  assert.doesNotMatch(core.toSvg(core.gear), /ff-anim/);
});

test('React: animate y style juntos', () => {
  const html = renderToStaticMarkup(createElement(react.Bell, { animate: 'hover', style: { color: 'red' } }));
  assert.match(html, /class="ff-anim ff-swing ff-anim-hover"/);
  assert.match(html, /--ff-origin:50% 12%/);
  assert.match(html, /color:red/);
});

test('duotone: dos capas y sin trazo', () => {
  const s = core.toSvg(core.bell, { variant: 'duotone' });
  assert.match(s, /class="ff-secondary" opacity=".4"/);
  assert.match(s, /class="ff-primary"/);
  assert.match(s, /fill="currentColor"/);
  assert.equal(iconos.filter((i) => !i.duotone).length, 0);
});
