# fontfine

Free and open source **thin line icons**. Every icon comes in 5 variants (**thin**, **light**, **regular**, **bold**, **solid**) and the stroke width can be set to any value.

**Browse the icons:** https://fontfine.vercel.app

```bash
npm install fontfine
```

## React

```jsx
import { Wrench, Search } from 'fontfine/react';

<Wrench />                                 // light, 24px, current text color
<Search size={32} variant="bold" />
<Wrench strokeWidth={1.6} color="#262626" />
<Wrench variant="solid" title="Settings" />  // with title = accessible image
```

Each icon is its own component, so your bundle only includes the icons you use.

## Angular, Vue, Svelte or plain HTML (web component)

```js
import 'fontfine/element';
```

```html
<fontfine-icon name="wrench"></fontfine-icon>
<fontfine-icon name="search" variant="bold" size="32"></fontfine-icon>
<fontfine-icon name="wrench" stroke-width="1.6" label="Settings"></fontfine-icon>
```

In Angular, add `CUSTOM_ELEMENTS_SCHEMA` to the component's `schemas`.

## Animations

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

## SVG string (any framework, Node, SSR)

```js
import { toSvg, wrench } from 'fontfine';

toSvg(wrench, { size: 24, variant: 'regular', strokeWidth: 1.5 });
```

## Raw SVG files

```
fontfine/svg/line/<name>.svg      line version
fontfine/svg/solid/<name>.svg     solid version
```

## Options

| Option | Values | Default |
| --- | --- | --- |
| `variant` | `thin` (0.75) · `light` (1.25) · `regular` (1.75) · `bold` (2.25) · `solid` | `light` |
| `strokeWidth` | any number, overrides the variant (line variants only) | – |
| `size` | number (px) or CSS size | `24` (`1em` in the web component) |
| `color` | any CSS color | `currentColor` |
| `title` / `label` | accessible name; without it the icon is decorative | – |
| `animate` | `true` or `'hover'` (needs `fontfine/animations.css`) | – |

## License

[MIT](LICENSE). Icons drawn from scratch; not copied from other icon sets.
