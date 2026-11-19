# Contributing

Thanks for helping! The most useful contribution is **new icons**. You can draw them by hand (Figma, Inkscape, any editor) or with an AI assistant.

## Add an icon in 6 steps

1. **Fork** the repo on GitHub and clone your fork.
2. Create a branch: `git checkout -b icon/<name>`.
3. Add the 3 files and the metadata, following the style guide in **[AGENTS.md](AGENTS.md)**:
   - `svg/line/<name>.svg`
   - `svg/solid/<name>.svg`
   - `svg/duotone/<name>.svg`
   - an entry in `metadata.json`
4. Run the checks (Node 20+):
   ```bash
   node scripts/check.mjs
   ```
   and look at it in the website: `cd web && npm ci && npm start`.
5. Commit and push: `git commit -m "Add <name> icon"` and `git push origin icon/<name>`.
6. Open a **pull request**. Fill in the checklist. One PR can add several icons.

The automatic checks run on every PR. A maintainer reviews the drawing and merges it. Small changes may be requested so all icons look like one family.

## Using AI

AI tools can draw good icons if you give them the rules. Two options:

- **Coding agents** (Claude Code, Cursor, Copilot, Codex…) working inside the repo: they read `AGENTS.md` automatically. Just ask: *"Add a `rocket` icon following AGENTS.md"*.
- **Chat AIs** (ChatGPT, Claude, Gemini…): copy the prompt in **[docs/ai-prompt.md](docs/ai-prompt.md)**, replace the icon name and paste the answer into the 3 files.

Always look at the result before opening the PR. AIs often make icons too detailed, off-center, or with lines too close together. You are responsible for the PR, and it must be original (no paths copied from other icon sets).

## Other contributions

- **Bug or idea**: open an issue.
- **Changes to the library or website** (`paquete/`, `web/`, `scripts/`): open an issue first so we can agree on the approach. These PRs need a maintainer review.

## Rules that keep the project safe

- Icon PRs should only change `svg/` and `metadata.json`.
- SVGs are checked strictly: no scripts, links, images, styles or event attributes. Anything outside the allow-list fails the check.
- PRs from forks run with read-only permissions and no secrets.
- Nothing is published to npm automatically; releases are made by the maintainer.

By contributing you agree that your icons are released under the [MIT license](LICENSE).
