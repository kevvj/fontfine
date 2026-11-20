# fontfine

Free and open source icons with a thin, clean line style. Every icon comes in six versions (**Thin**, **Light**, **Regular**, **Bold**, **Solid** and **Duotone**), has its own animation, and the stroke width can be set to any value.

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

Duotone icons have two layers: `.ff-primary` and `.ff-secondary` (40% opacity). Change them with CSS, e.g. `.ff-secondary { opacity: 1; fill: #93c5fd; }`.

### Animations

Every icon has its own animation: the bell swings, the heart beats, the gear spins, the trash shakes... Import the CSS once:

```js
import 'fontfine/animations.css';
```

```jsx
<Bell animate />             // always
<Bell animate="hover" />     // only on hover
```

```html
<fontfine-icon name="bell" animate></fontfine-icon>
<fontfine-icon name="bell" animate="hover"></fontfine-icon>
```

With `animate="hover"`, add the class `ff-hover` to a parent (a button, for example) to animate the icon when the parent is hovered. Animations turn off for users who prefer reduced motion.

### SVG string (any framework, Node, SSR)

```js
import { toSvg, wrench } from 'fontfine';

toSvg(wrench, { size: 24, variant: 'regular', strokeWidth: 1.5 });
```

### Raw SVG files

```
fontfine/svg/line/<name>.svg      line version
fontfine/svg/solid/<name>.svg     solid version (only icons with areas to fill; line-only icons use the bold line)
```

### Options

| Option | Values | Default |
| --- | --- | --- |
| `variant` | `thin` (0.75) · `light` (1.25) · `regular` (1.75) · `bold` (2.25) · `solid` · `duotone` | `light` |
| `strokeWidth` | any number, overrides the variant (line variants only) | – |
| `size` | number (px) or CSS size | `24` (`1em` in the web component) |
| `color` | any CSS color | `currentColor` |
| `title` / `label` | accessible name; without it the icon is decorative | – |
| `animate` | `true` or `'hover'` (needs `fontfine/animations.css`) | – |

## Repository

| Folder | Contents |
| --- | --- |
| `svg/line/` | Line icons (24×24 grid, source of truth) |
| `svg/solid/` | Solid icons |
| `metadata.json` | Category and search tags for each icon |
| `scripts/build.mjs` | Validates the icons and generates the data for the website |
| `package/` | npm package (core, React, web component) |
| `web/` | Website (Angular) |

## Run the website locally

```bash
cd web
npm install
npm start
```

## Contributing

New icons are welcome, drawn by hand or with AI. Read [CONTRIBUTING.md](CONTRIBUTING.md) and pick missing icons from the [roadmap](ROADMAP.md). AI assistants: follow [AGENTS.md](AGENTS.md), or use the [prompt for chat AIs](docs/ai-prompt.md). Every pull request is checked automatically (`node scripts/check.mjs`) and reviewed before merging.

## License

[MIT](LICENSE)
