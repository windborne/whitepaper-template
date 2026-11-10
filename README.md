# WindBorne whitepaper template

A reusable editorial document system for technical papers, whitepapers and reports. Write once in HTML; read as a web article or export a paginated PDF with the same content. The approved design uses Newsreader prose/headings, IBM Plex Sans technical matter, IBM Plex Mono navigation/page numbers, and STIX Two Math.

![Draft editor with Template and Article tabs, View PDF and Save settings](assets/editor-preview.png)

## Start with your agent

Give your agent this repository and [AI-PROMPT.md](AI-PROMPT.md), plus your source text/files, title, authors and date. No prior knowledge of this project is needed. For example:

> Use https://github.com/windborne/whitepaper-template. Read README.md, SKILL.md and DESIGN.md, set up the local editor, and open the starter Article in draft mode. Use the attached content to create my paper. Keep the template defaults unless I specify otherwise. Save my chosen settings, generate a PDF, and give me the editable source and PDF after reviewing both.

The agent needs local file access and a terminal to install dependencies, edit HTML and run the server. **The browser is a layout/settings editor and preview, not a word processor.** Ask your agent to change the text, figures, author names or date in the HTML source; use Document settings to change their presentation.

## Install and open

Requires Git, Node.js 20+ and Python 3.10+. Run these commands in a terminal (macOS/Linux):

```sh
git clone https://github.com/windborne/whitepaper-template.git
cd whitepaper-template
npm ci
npx playwright install chromium
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PYTHON=.venv/bin/python npm start
```

If you already cloned or downloaded the repository, start inside its folder and skip the first two commands. On Windows, use `.venv\Scripts\python.exe` for the virtual environment; in PowerShell set `$env:PYTHON=".venv\Scripts\python.exe"` before `npm start`. Install requirements with `.venv\Scripts\python.exe -m pip install -r requirements.txt`.

Open **[the draft editor](http://127.0.0.1:8743/article.html?mode=edit)**. Keep the terminal running while using Save settings or View PDF. To return another day, run `PYTHON=.venv/bin/python npm start` from the same folder; you do not need to reinstall.

- **Article** opens `article.html`, preloaded with starter copy on a fresh checkout. Your work stays in that file; reopening does not reset it.
- **Template** opens the component specimen. It is a reference you can browse while your agent builds your Article. Its settings belong to the specimen, not your paper.
- **Document settings** controls abstract shading, author details, distribution and independent Category and Prepared for fields and PDF contents. Info icons explain the less obvious choices.

`CHROME` optionally selects an installed Chrome/Chromium executable; `PORT` changes the local port. Use the URL printed in the terminal if the port changes. Fonts and document assets are bundled; PDF export does not fetch external resources.

## Save, preview and export

| Action | What it does |
|---|---|
| **Save settings** | Writes the current choices into this document's HTML. The button is disabled until something changes; **Saved** confirms success. It does not edit article text or generate a PDF. |
| **View PDF** | Generates a PDF using the current choices, including unsaved ones, and opens it in a new viewer tab. Use the viewer's download/save control to keep a copy. |
| **View web reader layout** | Opens a new tab with editing controls hidden and your current choices applied. Your original editing tab stays open. This is a local preview, not a published website. |
| **Print current PDF version** | Opens browser print. Use View PDF for the finished export with resolved contents page numbers. |

**Custom first-page footer (source only):** set `defaults.firstPageFooter` in the HTML document-config (or the `firstPageFooter` CLI setting) to a short notice, up to 400 characters. There is no footer text field in Document settings. The renderer prefixes the organization, distribution wording and optional category, then the notice: `WindBorne Systems. PROPRIETARY. <notice>`. Legacy values beginning with the organization and classification are accepted without duplicating that prefix. Blank uses the automatic notice. The web article ends with the same treatment. Later PDF pages keep the standard organization/month-year/distribution footer. Changing Distribution updates the prefix without rewriting saved custom wording. Save settings preserves the override. Aim for one line at the existing footer type size; long custom notices wrap rather than shrink or clip.

Settings are **not autosaved**. Save before reloading or switching between Template and Article if you want to keep your changes. A reader preview carries a snapshot of the choices when opened; reopen it to see later changes. If another editor saved the same document, reload before choosing and saving again.

Generated PDF links are temporary: they expire after 30 minutes or a server restart. Download the PDF itself for sharing; a `127.0.0.1` link only works on your computer. Saving settings does not update existing PDFs. Generate a fresh PDF after changing content or settings.

## Author a document

1. For the first draft, edit `article.html`. Check for existing work before replacing it. For another paper, copy `starter.html` to a new root-level file such as `my-paper.html` (letters, numbers, hyphens or underscores; no spaces).
2. Replace the HTML `<title>`, visible title, subtitle, date (abbreviated month with a day; full month without a day), abstract and article content. Update `document-config` authors and organization; its `defaults` hold saved presentation choices. Set `body data-document="my-paper"` to the filename without `.html`. The date is explicit source content, not automatically today's date.
3. Use stable unique IDs on `h2` and `h3` headings. Web navigation and PDF contents are generated from them. Copy figures, tables, equations and reference markup from `specimen.html` as needed, replacing illustrative content.
   For square or portrait photos, use the recommended 3in maximum with a right-side print caption aligned to the bottom of the photo; see [Photographs](DESIGN.md#photographs). Export logs flag untreated non-landscape images for review. Scientific charts, diagrams, maps and tables are exempt from photo limits.
4. Open `http://127.0.0.1:8743/my-paper.html?mode=edit`, adjust and save settings, then review the web article and View PDF. Template/Article tabs return to the same named draft. The shared CSS, JavaScript, fonts and referenced assets must remain alongside the source.

Figures and tables have separate sequences: Figure 1… and Table 1… in the main text; Figure A-1… and Table A-1… in Appendix A, restarting for each appendix. See [numbering and appendix markup](DESIGN.md#figure-and-table-numbering). When restyling, update the caption and its in-text references together. Caption labels are bold; caption text is upright with selective italics. Missing labels are filled automatically, but the agent must reconcile existing labels and provide a meaningful caption.

Contents numbering is separate: every top-level entry, including References and appendices, receives a continuous section number (for example, **11. References** and **12. Appendix A: Supporting detail**). Body headings stay unnumbered; the appendix heading retains its letter. A glossary uses the same continuous contents numbering.

Back matter normally follows References → Appendices → Glossary. If an appendix or glossary cites sources, put References last instead. A subtle divider follows References only when another section follows. See [back matter order](DESIGN.md#back-matter-order).

Recommended defaults: plain abstract, two-column PDF contents (headers only), author name and title, Category None and Prepared for blank, Internal distribution. One-column contents includes headers and subheaders. PDF contents never appears in the web body and does not affect the web nav sidebar. See [DESIGN.md](DESIGN.md) for typography, options, footer language and page-flow rules. Distribution is required and footer-only. The first page uses a distribution-specific notice; subsequent pages use a short footer; the classification precedes both automatic and custom first-page notices. Distribution markings do not provide access control.

`stress-report.html` is a synthetic layout fixture, not research evidence. Keep it separate from your draft. Public examples contain placeholder or synthetic material; use real reports only in a separate private workspace.


## Distribution and release

Choose the highest applicable classification. The required Distribution setting defaults to Internal and is rendered only in the footer, not the header metadata. The four choices are always-visible buttons with hover/focus help and a tappable info icon. Internal is selected by default; exactly one choice is required.

| Distribution | Use for | Short footer (PDF pages after page one) |
|---|---|---|
| Public | Data Owner-approved public releases or legitimately public-source material; technical releases also need COO/delegate clearance | WindBorne Systems. November 2026. PUBLIC. |
| Internal | Nonpublic company information that does not meet a higher level; WB personnel and authorized providers under written agreements | WindBorne Systems. November 2026. INTERNAL. |
| Restricted | Commercial observations, forecasts, customer information, pricing and related restricted business information; need-to-know access approved by the Data Owner; external recipients under contract/NDA | WindBorne Systems. November 2026. RESTRICTED. |
| Proprietary | Core technology, source code, models, system/hardware designs and test data; named need-to-know access; external release requires an NDA and written COO/delegate approval | WindBorne Systems. November 2026. PROPRIETARY. |

On later PDF pages, the full month and year from the document date appear between the organization and distribution wording; Category is omitted. On page one and at the web end, classification comes immediately after the organization, followed by Category if selected and the notice. A custom first-page footer affects the first PDF page and web end only; the organization and classification precede the custom notice, while pages 2 onward retain their standard classification footer. The later-page label is always uppercase: PUBLIC, INTERNAL, RESTRICTED or PROPRIETARY. The dates in this table are examples; use the document month/year. First-page notice wording is listed below; custom notices remain source-only.

The setting records classification; it does not authorize release or enforce access. Preserve supplied classifications, apply the highest level present, and ask the Data Owner when uncertain. Do not assume older “Confidential” documents map to any one new level. Blank/Confidential settings must be reviewed and replaced before saving/exporting. Missing settings default to Internal.

Use approved systems and required access controls for nonpublic content, including approved U.S. storage/processing unless an authorized exception applies. CUI, export-controlled data and federal-contract information require additional approved environments, permissions and markings; this template is not a compliance validator and does not replace those markings. Apply matching Google Drive labels where available. Public publishing requires the relevant Data Owner approval and technical/contract clearances; neither a classification selection nor a random URL grants approval. Keep nonpublic source documents and derived outputs out of this public repository.

See [automatic first-page notices](DESIGN.md#automatic-first-page-notices) for the exact default wording. The first-page notice also appears at the end of the web article. Preserve an existing source-authored custom notice instead of replacing it with these defaults.

## Command-line export

```sh
PYTHON=.venv/bin/python node render.cjs my-paper.html my-paper.pdf
PYTHON=.venv/bin/python node render.cjs my-paper.html my-paper.pdf \
  --settings '{"contents":"one","category":"Field Brief","distribution":"Internal","details":"full","abstract":"shaded"}'
```

In Document settings, **Category (optional)** includes None (default), the category choices and Add new option. **Prepared for (optional)** is a separate text field, blank by default, with “Conference/event name” as a placeholder. Both can be filled, saved and exported together. With four metadata fields, Author and Date form the first row; Prepared for sits beneath Author and Category beneath Date. Only Category appears in the footer. For command-line export, use `--settings '{"category":"Technical Report","preparedFor":"AMS Annual Meeting 2027"}'`.

Omitted settings inherit the document's saved defaults. `npm run build` renders the working article, clean starter, specimen and synthetic report. `./build.sh my-paper.html` is a compatibility wrapper. `npm run check` tests layout and interaction behavior; [VALIDATION.md](VALIDATION.md) describes PDF review and stress coverage.

The local server accepts only local, same-origin JSON export and settings-save requests for root-level HTML documents. Saving updates only the document configuration, preserves article content, and detects conflicting settings from another tab. Published reader files are read-only. It serves no arbitrary filesystem paths or repository secrets. It is an authoring utility, not a production hosting service.

## Publish a static reader

```sh
PYTHON=.venv/bin/python node publish.cjs my-paper.html dist/my-paper \
  --settings '{"distribution":"Public","category":"Research Paper"}'
```

This creates `dist/my-paper/my-paper.html`, `my-paper.pdf` and the shared assets. It does not upload anything. Open or host `my-paper.html` from that folder; the command does not create an `index.html`. Share the whole folder for a web reader, or just the PDF for a PDF handoff. The reader's View PDF opens that baked PDF; a static host cannot run Chromium to generate changed settings. Regenerate the package after content or settings change. The local editor provides live custom export; public static readers receive an exact fixed publication.

Directly opening an editable HTML file still lets you read it and use browser print, but saving settings and generating custom PDFs require `npm start`. Saving settings does not rebuild existing PDF files; View PDF generates the current version, and publishing packages the matching PDF. Browser-native print omits unresolved contents page numbers; use the renderer for a finished PDF. Editing controls are presentation state, not authentication.

## Review several documents together

The standard editor has Template and Article tabs. For a private review bundle, configure `document-config.reviewTabs` to link additional documents, such as Template, Sample 1, Sample 2 and Sample 3; see [review bundle configuration](DESIGN.md#private-review-bundles). Each file keeps its own saved settings. Save before switching tabs. Keep customer/internal documents and their derived PDFs outside this public repository.

## Contents of the repository

- `SKILL.md`, `AI-PROMPT.md`, `DESIGN.md`: reusable AI instructions and visual rules.
- `article.html`, `starter.html`, `specimen.html`, `stress-report.html`: editable sources and companion PDFs.
- `style.css`, `fonts.css`, `controls.js`: shared design, offline fonts and interactions.
- `renderer.cjs`, `render.cjs`, `server.cjs`, `settings-store.cjs`, `publish.cjs`: deterministic PDF export, local editor and static packaging.
- `check.cjs`, `check-settings.cjs`, `check-help.cjs`, `check.py`, `VALIDATION.md`: behavioral checks, content checks and review guidance.
- `experiments/comparison`: preserved earlier design comparisons; `experiments/original`: original print-only template. Start new work at the repository root.

Fonts carry their licenses in `licenses/`; Lucide's license is in `LICENSE-LUCIDE`. WindBorne's name and logo are brand assets, not a grant of trademark rights. Keep font and icon licenses with redistributed assets.
