# fontfine

Free and open source icons with a thin, clean line style. Every icon comes in five versions: **Thin**, **Light**, **Regular**, **Bold** and **Solid**, and the stroke width can be set to any value.

**Website:** https://fontfine.vercel.app (search, preview and copy the SVG)

> Íconos gratis y de código abierto, de línea fina. Cada ícono tiene 5 versiones y el grosor se puede ajustar.

## Usage

> The npm package is not published yet. Until then, copy the SVG from the website or from `svg/`.

```bash
npm install fontfine
```

### React

```jsx
import { Wrench, Search } from 'fontfine/react';

<Wrench />                                 // light, 24px, current text color
<Search size={32} variant="bold" />
<Wrench strokeWidth={1.6} color="#262626" />
<Wrench variant="solid" title="Settings" />  // with title = accessible image
```

Each icon is its own component, so your bundle only includes the icons you use.

### Angular, Vue, Svelte or plain HTML (web component)

```js
import 'fontfine/element';
```

```html
<fontfine-icon name="wrench"></fontfine-icon>
<fontfine-icon name="search" variant="bold" size="32"></fontfine-icon>
<fontfine-icon name="wrench" stroke-width="1.6" label="Settings"></fontfine-icon>
```

In Angular, add `CUSTOM_ELEMENTS_SCHEMA` to the component's `schemas`.

### SVG string (any framework, Node, SSR)

```js
import { toSvg, wrench } from 'fontfine';

toSvg(wrench, { size: 24, variant: 'regular', strokeWidth: 1.5 });
```

### Raw SVG files

```
fontfine/svg/line/<name>.svg      line version
fontfine/svg/solid/<name>.svg     solid version
```

### Options

| Option | Values | Default |
| --- | --- | --- |
| `variant` | `thin` (0.75) · `light` (1.25) · `regular` (1.75) · `bold` (2.25) · `solid` | `light` |
| `strokeWidth` | any number, overrides the variant (line variants only) | – |
| `size` | number (px) or CSS size | `24` (`1em` in the web component) |
| `color` | any CSS color | `currentColor` |
| `title` / `label` | accessible name; without it the icon is decorative | – |

## Repository

| Folder | Contents |
| --- | --- |
| `svg/line/` | Line icons (24×24 grid, source of truth) |
| `svg/solid/` | Solid icons |
| `metadata.json` | Category and search tags for each icon |
| `scripts/build.mjs` | Validates the icons and generates the data for the website |
| `paquete/` | npm package (core, React, web component) |
| `web/` | Website (Angular) |

## Run the website locally

```bash
cd web
npm install
npm start
```

## Adding an icon

1. Draw it from scratch on a 24×24 grid: no fill, round caps and joins. Do not copy or trace icons from other sets.
2. Save it as `svg/line/<name>.svg` (English, lowercase, words separated by `-`, named after what it shows, e.g. `wrench`, not `maintenance`).
3. Add the solid version in `svg/solid/<name>.svg`.
4. Add its category and tags in `metadata.json`.
5. Run `node scripts/build.mjs` to validate.

## License

[MIT](LICENSE)
