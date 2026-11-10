# WindBorne whitepaper template

A reusable editorial document system for technical papers, whitepapers and reports. Write once in HTML; read as a web article or export a paginated PDF with the same content. The approved design uses Newsreader prose/headings, IBM Plex Sans technical matter, IBM Plex Mono navigation/page numbers, and STIX Two Math.

![Draft editor with Template and Article tabs, View PDF and Save settings](assets/editor-preview.png)

**For an AI:** give it [SKILL.md](SKILL.md), this repository and your content, or copy [AI-PROMPT.md](AI-PROMPT.md).

**For an author:** open [article.html](article.html) in the local editor. It is preloaded with the starter copy; [starter.html](starter.html) remains the clean source for additional documents. [specimen.html](specimen.html) demonstrates components; [conop.html](conop.html) applies the design to the supplied CONOP; [stress-report.html](stress-report.html) is a synthetic long-report layout fixture. The CONOP's technical claims are supplied source material, not independently verified here. The synthetic fixture is not research evidence.

## Install and open

Requires Node.js 20+, Python 3.10+, Playwright Chromium and pypdf. After cloning:

```sh
npm ci
npx playwright install chromium
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHON=.venv/bin/python npm start
```

Open **http://127.0.0.1:8743/article.html?mode=edit**. This starts in draft mode: **Article** contains the starter copy, and **Template** opens the component specimen. The CONOP is a separate worked example at `/conop.html`. The local server shows Document settings and generates PDFs when you click **View PDF**. Custom categories, distribution, author treatment, abstract shading and both contents layouts are preserved, including resolved page numbers. The generated PDF opens in the browser's PDF viewer. Generated files expire from the local server after 30 minutes; save a copy to retain it.

On Windows use the corresponding virtual-environment Python path. Set `PYTHON` to that executable. `CHROME` optionally selects an installed Chrome/Chromium executable instead of Playwright Chromium; `PORT` changes the local port. All document assets and fonts are local; export does not fetch external resources.

## Author a document

1. For the first draft, edit `article.html`, which already contains the starter copy. For another paper, copy `starter.html` to `my-paper.html` beside the shared CSS and JavaScript.
2. Replace its visible title, subtitle, abbreviated date, abstract and article content. Update `document-config` authors, organization and optional defaults; change `body data-document="starter"` to `my-paper`.
3. Use stable IDs on `h2` and `h3` headings. Contents is generated automatically. Copy figures, tables, MathML, examples and references from the specimen as needed.
4. Open the draft with `?mode=edit` (for example, `http://127.0.0.1:8743/my-paper.html?mode=edit`). Choose settings, then **Save settings** to keep them in this document’s HTML. The button becomes available when a setting changes and confirms **Saved** when complete. **View PDF** uses the current choices, including unsaved changes. Template/Article tabs let you consult the specimen and return to the same draft.

Recommended defaults: plain abstract, two-column PDF contents (headers only), author name and title, no category, Confidential. One-column contents includes headers and subheaders. See [DESIGN.md](DESIGN.md) for all options, typography, footer language and page-flow rules. Distribution markings do not provide access control.

## Command-line export

```sh
PYTHON=.venv/bin/python node render.cjs my-paper.html my-paper.pdf
PYTHON=.venv/bin/python node render.cjs my-paper.html my-paper.pdf \
  --settings '{"contents":"one","category":"Field Brief","distribution":"Internal","details":"full","abstract":"shaded"}'
```

Omitted settings inherit the document's saved defaults. `npm run build` renders the working article, clean starter, specimen, CONOP and synthetic report. `./build.sh my-paper.html` is a compatibility wrapper. `npm run check` tests layout and interaction behavior; [VALIDATION.md](VALIDATION.md) describes PDF review and stress coverage.

The local server accepts only local, same-origin JSON export and settings-save requests for root-level HTML documents. Saving updates only the document configuration, preserves article content, and detects conflicting settings from another tab. Published reader files are read-only. It serves no arbitrary filesystem paths or repository secrets. It is an authoring utility, not a production hosting service.

## Publish a static reader

```sh
PYTHON=.venv/bin/python node publish.cjs my-paper.html dist/my-paper \
  --settings '{"distribution":"Public","category":"Research Paper"}'
```

This emits a reader HTML, shared assets and a matching PDF into the output directory. Host that folder on a static web server. The reader's View PDF opens that baked PDF; a static host cannot run Chromium to generate changed settings. Regenerate the package after content or settings change. The local editor provides live custom export; public static readers receive an exact fixed publication.

Directly opening an editable HTML file still lets you read it and use browser print, but saving settings and generating custom PDFs require `npm start`. Saving settings does not rebuild existing PDF files; View PDF generates the current version, and publishing packages the matching PDF. Browser-native print omits unresolved contents page numbers; use the renderer for a finished PDF. Editing controls are presentation state, not authentication.

## Contents of the repository

- `SKILL.md`, `AI-PROMPT.md`, `DESIGN.md`: reusable AI instructions and visual rules.
- `article.html`, `starter.html`, `specimen.html`, `conop.html`, `stress-report.html`: editable sources and companion PDFs.
- `style.css`, `fonts.css`, `controls.js`: shared design, offline fonts and interactions.
- `renderer.cjs`, `render.cjs`, `server.cjs`, `settings-store.cjs`, `publish.cjs`: deterministic PDF export, local editor and static packaging.
- `check.cjs`, `check-settings.cjs`, `check.py`, `VALIDATION.md`: behavioral checks, content checks and review guidance.
- `experiments/comparison`: preserved earlier design comparisons; `experiments/original`: original print-only template. `experiments/hybrid-v2` retains the design checkpoint. Start new work at the repository root.

Fonts carry their licenses in `licenses/`; Lucide's license is in `LICENSE-LUCIDE`. WindBorne's name and logo are brand assets, not a grant of trademark rights. Keep font and icon licenses with redistributed assets.
