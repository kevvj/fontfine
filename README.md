# fontfine

Free and open source icons with a thin, clean line style. Every icon comes in five versions: **Thin**, **Light**, **Regular**, **Bold** and **Solid**, and the stroke width can be set to any value.

**Website:** https://fontfine.vercel.app (search, preview and copy the SVG)

> Íconos gratis y de código abierto, de línea fina. Cada ícono tiene 5 versiones y el grosor se puede ajustar.

## Status

- 120 icons, all with line and solid versions.
- The npm package is in progress. For now, copy the SVG from the website or from the `svg/` folder.

## Repository

| Folder | Contents |
| --- | --- |
| `svg/line/` | Line icons (24×24 grid, source of truth) |
| `svg/solid/` | Solid icons |
| `metadata.json` | Category and search tags for each icon |
| `scripts/build.mjs` | Validates the icons and generates the data for the website |
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
