# WindBorne whitepaper template

A reusable editorial document system for technical papers, whitepapers and reports. Write once in HTML; read as a web article or export a paginated PDF with the same content. The approved design uses Newsreader prose/headings, IBM Plex Sans technical matter, IBM Plex Mono navigation/page numbers, and STIX Two Math.

**For an AI:** give it [SKILL.md](SKILL.md), this repository and your content, or copy [AI-PROMPT.md](AI-PROMPT.md).

**For an author:** copy [starter.html](starter.html). [specimen.html](specimen.html) demonstrates components; [conop.html](conop.html) applies the design to the supplied CONOP; [stress-report.html](stress-report.html) is a synthetic long-report layout fixture. The CONOP's technical claims are supplied source material, not independently verified here. The synthetic fixture is not research evidence.

## Install and open

Requires Node.js 20+, Python 3.10+, Playwright Chromium and pypdf. After cloning:

```sh
npm ci
npx playwright install chromium
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHON=.venv/bin/python npm start
```

Open **http://127.0.0.1:8743/**. The local server shows Document settings and generates PDFs when you click **Download PDF**. Custom categories, distribution, author treatment, abstract shading and both contents layouts are preserved, including resolved page numbers. The generated PDF opens in the browser's PDF viewer. Generated files expire from the local server after 30 minutes; save a copy to retain it.

On Windows use the corresponding virtual-environment Python path. Set `PYTHON` to that executable. `CHROME` optionally selects an installed Chrome/Chromium executable instead of Playwright Chromium; `PORT` changes the local port. All document assets and fonts are local; export does not fetch external resources.

## Author a document

1. Copy `starter.html` to `my-paper.html` beside the shared CSS and JavaScript.
2. Replace its visible title, subtitle, abbreviated date, abstract and article content. Update `document-config` authors, organization and optional defaults; change `body data-document="starter"` to `my-paper`.
3. Use stable IDs on `h2` and `h3` headings. Contents is generated automatically. Copy figures, tables, MathML, examples and references from the specimen as needed.
4. Open `http://127.0.0.1:8743/my-paper.html`. Choose settings, then Download PDF. Settings are preview choices; to make them permanent, save them in `document-config.defaults`.

Recommended defaults: plain abstract, two-column PDF contents (headers only), author name and title, no category, Confidential. One-column contents includes headers and subheaders. See [DESIGN.md](DESIGN.md) for all options, typography, footer language and page-flow rules. Distribution markings do not provide access control.

## Command-line export

```sh
PYTHON=.venv/bin/python node render.cjs my-paper.html my-paper.pdf
PYTHON=.venv/bin/python node render.cjs my-paper.html my-paper.pdf \
  --settings '{"contents":"one","category":"Field Brief","distribution":"Internal","details":"full","abstract":"shaded"}'
```

Omitted settings inherit the document's saved defaults. `npm run build` renders the starter, specimen, CONOP and synthetic report. `./build.sh my-paper.html` is a compatibility wrapper. `npm run check` tests layout and interaction behavior; [VALIDATION.md](VALIDATION.md) describes PDF review and stress coverage.

The local server accepts only local, same-origin JSON export requests for root-level HTML documents. It serves no arbitrary filesystem paths or repository secrets. It is an authoring utility, not a production hosting service.

## Publish a static reader

```sh
PYTHON=.venv/bin/python node publish.cjs my-paper.html dist/my-paper \
  --settings '{"distribution":"Public","category":"Research Paper"}'
```

This emits a reader HTML, shared assets and a matching PDF into the output directory. Host that folder on a static web server. The reader's Download PDF opens that baked PDF; a static host cannot run Chromium to generate changed settings. Regenerate the package after content or settings change. The local editor provides live custom export; public static readers receive an exact fixed publication.

Directly opening an editable HTML file still lets you read it and use browser print, but custom PDF generation requires `npm start`. Browser-native print omits unresolved contents page numbers; use the renderer for a finished PDF. Editing controls are presentation state, not authentication.

## Contents of the repository

- `SKILL.md`, `AI-PROMPT.md`, `DESIGN.md`: reusable AI instructions and visual rules.
- `starter.html`, `specimen.html`, `conop.html`, `stress-report.html`: editable sources and companion PDFs.
- `style.css`, `fonts.css`, `controls.js`: shared design, offline fonts and interactions.
- `renderer.cjs`, `render.cjs`, `server.cjs`, `publish.cjs`: deterministic PDF export, local editor and static packaging.
- `check.cjs`, `check.py`, `VALIDATION.md`: behavioral checks, content checks and review guidance.
- `experiments/comparison`: preserved earlier design comparisons; `experiments/original`: original print-only template. `experiments/hybrid-v2` retains the design checkpoint. Start new work at the repository root.

Fonts carry their licenses in `licenses/`; Lucide's license is in `LICENSE-LUCIDE`. WindBorne's name and logo are brand assets, not a grant of trademark rights. Keep font and icon licenses with redistributed assets.
