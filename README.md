# WindBorne whitepaper template

A reusable editorial document system for technical papers, whitepapers, reports and proposals. Write once in HTML; read as a web article or export a paginated PDF with the same content. John approved the design. It uses Newsreader prose/headings, IBM Plex Sans technical matter, IBM Plex Mono navigation/page numbers, and STIX Two Math.

![Draft editor with Template and Article tabs, View PDF and Save settings](assets/editor-preview.png)

Use the latest `main` for new documents. The `v1.1.0` tag is a fixed checkpoint for reproducing this release; use a tag or commit only when a fixed revision is requested. Existing document workspaces keep their copied template until explicitly updated and checked.

## Start with your agent

**Working in Google Docs or Word?** Use [GOOGLE-DOCS.md](GOOGLE-DOCS.md), included in `v1.1.0` and on `main`. It adapts the typography, first-page logo, horizontal metadata and first-page/running footers to native document formatting. Keep an existing clean metadata line; labeled AUTHOR/DATE fields are not required. Ask your agent to edit a private copy and check its exported pages. This route does not require the HTML editor or replace Dana's Word template/customer-required formats.

Give your agent this repository and [AI-PROMPT.md](AI-PROMPT.md), plus your source text/files, title, authors and date. No prior knowledge of this project is needed. For example:

> Use https://github.com/windborne/whitepaper-template on the latest main. Read README.md, SKILL.md and DESIGN.md, create a separate document workspace outside every Git checkout, set up its local editor, and open the starter Article in draft mode. Use the attached content to create my paper. Keep the template defaults unless I specify otherwise. Save my chosen settings, generate a PDF, and give me the editable source and PDF after reviewing both.

The agent needs local file access and a terminal to install dependencies, edit HTML and run the server. **The browser is a layout/settings editor and preview, not a word processor.** Ask your agent to change the text, figures, author names or date in the HTML source; use Document settings to change their presentation.

## Create a separate document workspace

**This GitHub repository is public. Keep the checkout for template code and synthetic examples only.** Before adding real content, create a separate document folder outside every Git checkout. The command below copies an explicit list of starter/editor files, creates a fresh `article.html` from `starter.html`, and leaves Git history, remotes, existing drafts and generated PDFs behind. It refuses nonempty destinations and destinations inside a Git checkout, including symlinked paths.

Requires Node.js 20+ and Python 3.10+. Git is needed only to clone the toolkit. Choose a storage location and AI tool already approved for your document’s classification; the location below is only a path example, not an approved-storage designation (macOS/Linux). Darius/the responsible IT or security owner must identify approved storage and AI environments for CUI, export-controlled or otherwise contract-restricted material before that content is provided to an agent. This repository does not name or approve those environments:

```sh
git clone --branch main https://github.com/windborne/whitepaper-template.git
cd whitepaper-template
node create-document.cjs "$HOME/Documents/WindBorne Documents/my-paper"
cd "$HOME/Documents/WindBorne Documents/my-paper"
node setup.cjs
npm start
```

Already have the toolkit? Check for uncommitted template work first; preserve it rather than resetting or overwriting it. On a clean checkout, run `git switch main` and `git pull --ff-only` before creating a new document with `node create-document.cjs`. If the pull cannot fast-forward, resolve the divergence before continuing; do not force-reset the checkout. Already have a document workspace? Read its `START-HERE.md` and resume there; do not recreate or overwrite it. For another document, create another workspace from the toolkit. On Windows, pass a quoted absolute destination such as `"C:\Users\you\Documents\WindBorne Documents\my-paper"`, then run the same Node commands inside that folder.

`node setup.cjs` installs locked Node packages, creates a local Python environment, installs the pinned PDF dependency and Playwright Chromium, then verifies a real PDF export. On Linux it also installs Chromium's system libraries, which may require administrator access. Use `node setup.cjs --skip-system-deps` only if those libraries are already present. Install Node/Python first if setup reports they are missing. Setup can be rerun without resetting your document.

Open **[the draft editor](http://127.0.0.1:8743/article.html?mode=edit)**, or the URL printed by the server if the port differs. Keep the terminal running for Save settings and View PDF. To return another day, run **`npm start` from your document folder**; there is no need to reinstall or set a Python environment variable. `npm run doctor` checks the browser, Python and PDF export if something stops working.

- **Article** opens `article.html`, preloaded with starter copy. Your work stays in that file; reopening does not reset it.
- **Template** opens the synthetic component specimen for reference. Its settings belong to the specimen, not your paper.
- **Document settings** controls abstract shading, author details, distribution, independent Category and Prepared for fields, PDF cover page and PDF contents. Info icons explain the less obvious choices.

**Reset view** restores the last saved settings and discards unsaved choices. **Save settings** writes to the document’s HTML in the local editor. In a hosted review (`hostedReview: true`), the same button saves only this browser’s preferences for this document; it does not modify shared source or prepared PDFs. The status confirms “Saved in this browser.” Neither button has an info icon.

Single-image figures are unframed by default. Two or more images sharing a caption automatically get one outer frame; there is no border toggle in Document settings. Agents can enable a frame for a specific figure and use `figure-compact` for centered 70% artwork on desktop/print, while keeping normal caption alignment and full available width on mobile. See [figure guidance](DESIGN.md#optional-figure-borders); inspect readability before shrinking technical images.

The new folder has no Git repository or publishing remote. This prevents an ordinary push from that folder; it does not set access permissions, disable cloud sync or authorize sharing. Keep it in approved storage and never add the public template remote. Ask your agent to work in this folder, not in the toolkit checkout. A separate approved private repository is an option for collaboration, but is not created automatically.

`CHROME` optionally selects an installed Chrome/Chromium executable; `PYTHON` can explicitly override the auto-selected local `.venv`; `PORT` changes the local port. Fonts and document assets are bundled; PDF export does not fetch external resources. Keep `template-origin.json` (source revision and file hashes) and `toolchain.json` (versions from the latest successful setup check) with the source for later troubleshooting and rebuilds. These records do not upload anything or guarantee identical output across operating systems.

## Save, preview and export

| Action | What it does |
|---|---|
| **Reset view** | Discards unsaved choices and restores the last saved settings. |
| **Save settings** | In the local editor, writes the current choices into this document's HTML. The button is disabled until something changes; **Saved** confirms success. It does not edit article text or generate a PDF. |
| **View PDF** | Generates a PDF using the current choices, including unsaved ones, and opens it in a new viewer tab. Use the viewer's download/save control to keep a copy. |
| **View web reader layout** | Opens a new tab with editing controls hidden and your current choices applied. Your original editing tab stays open. This is a local preview, not a published website. |
| **Print current PDF version** | Opens browser print. Use View PDF for the finished export with resolved contents page numbers. |

**Custom first-page footer (source only):** set `defaults.firstPageFooter` in the HTML document-config (or the `firstPageFooter` CLI setting) to a short notice, up to 1,000 characters. There is no footer text field in Document settings. The first page and web end display only the tailored notice, without an additional organization, category or distribution prefix. Company/classification wording within the approved notice itself is intentional. Legacy organization/classification prefixes are stripped from custom notices. Blank uses the automatic notice. The web article ends with the same treatment. Later PDF pages keep the standard organization/title/month-year footer on the left, with uppercase classification and page number on the right. Changing Distribution changes the default notice and later-page label, but preserves supplied custom notice wording. Save settings preserves the override. Aim for one line at the existing footer type size; long custom notices wrap rather than shrink or clip.

Settings are **not autosaved**. Save before reloading or switching between Template and Article if you want to keep your changes. A reader preview carries a snapshot of the choices when opened; reopen it to see later changes. If another editor saved the same document, reload before choosing and saving again.

Generated PDF links are temporary: they expire after 30 minutes or a server restart. Download the PDF itself for sharing; a `127.0.0.1` link only works on your computer. Saving settings does not update existing PDFs. Generate a fresh PDF after changing content or settings.

## Running PDF footer

Pages 2 onward show **WindBorne Systems. Title. Month Year.** on the left, and **CLASSIFICATION** plus the page number on the right. Keep company/title/date in their supplied mixed case; the classification stays uppercase. Page one and the web end retain their tailored notice.

For an optional short footer title, add `"footer": {"title": "Short document title"}` at the top level of the HTML's `document-config`, beside `defaults`. Omitted, empty or whitespace-only titles use the complete visible article title (`.paper-header h1`), not the browser title or cover override. Save settings preserves this source-only field; there is no additional editor control. Long titles wrap at the existing font size, without ellipsis or automatic shortening. Inspect the exported footer; ask for an explicit short title if the full title cannot fit the footer area.

When authoring a short footer title, omit repeated “WindBorne” or “WindBorne Systems”: the company prefix already identifies the organization. If the main title includes the brand, set `footer.title` explicitly to avoid repeating it; for example, “WindBorne White Paper Template” uses “White Paper Template”. Keep the main/web/cover title unchanged. Preserve the remaining title wording unless the user provides or approves a shorter version. This is an authoring rule; the runtime full-title fallback remains available when no footer title is supplied.

## Optional PDF cover

Enable **PDF cover page** in Document settings for a proposal or report that needs a separate opening page. It is **off by default**. Save settings retains the choice; View PDF exports it. The web article stays unchanged. In the PDF, the cover replaces the usual opening header and the contents/abstract/body begin on the next page. The cover counts as page one without a printed page number; subsequent pages and contents destinations include it.

Selecting Category **Proposal** turns the cover on, uses Point of Contact and Delivery Date, and suppresses the visible Proposal category. You can still turn the cover off manually. Put contact name/email and optional validity in the source configuration; see [proposal treatment](DESIGN.md#proposal-treatment). The original confidentiality notice belongs in the custom first-page footer and at the web end.

The cover uses the document title, subtitle and metadata. An agent can add an optional narrow photograph, contact details and the original submission notice in the HTML; see [cover markup](DESIGN.md#pdf-cover-page). Without a photograph it uses a text-only layout. Preserve supplied notices in full; do not replace them with the short classification footer.

Cover typography is fixed: **Newsreader Bold (700)** for the title and **Newsreader Regular (400)** for the optional subtitle; **IBM Plex Sans Medium (500)** for dates, contact names and Prepared for recipients. Small uppercase field labels, emails and validity remain IBM Plex Sans Regular (400). The real Medium font is bundled for offline rendering. Preserve source notice capitalization, including **CONFIDENTIALITY NOTICE:**.

## Author a document

1. Work inside the separate document workspace created above. Edit its `article.html`; inspect existing work before changing it. For another paper, create another workspace. A multi-document private review workspace may instead have additional root-level HTML files copied from its starter (letters, numbers, hyphens or underscores; no spaces). Never write a real manuscript into the public toolkit checkout.
2. Replace the HTML `<title>`, visible title, subtitle, date (abbreviated month with a day; full month without a day), abstract and article content. Update `document-config` authors and organization; its `defaults` hold saved presentation choices. Set `body data-document="my-paper"` to the filename without `.html`. The date is explicit source content, not automatically today's date.
3. Use stable unique IDs on `h2` and `h3` headings. Web navigation and PDF contents are generated from them. Copy figures, tables, equations and reference markup from `specimen.html` as needed, replacing illustrative content.
   For square or portrait photos, use the recommended 3in maximum with a right-side print caption aligned to the bottom of the photo; see [Photographs](DESIGN.md#photographs). Export logs flag untreated non-landscape images for review. Scientific charts, diagrams, maps and tables are exempt from photo limits.
4. Open `http://127.0.0.1:8743/my-paper.html?mode=edit`, adjust and save settings, then review the web article and View PDF. Template/Article tabs return to the same named draft. The shared CSS, JavaScript, fonts and referenced assets must remain alongside the source.

Figures and tables have separate sequences: Figure 1… and Table 1… in the main text; Figure A-1… and Table A-1… in Appendix A, restarting for each appendix. See [numbering and appendix markup](DESIGN.md#figure-and-table-numbering). When restyling, update the caption and its in-text references together. Caption labels are bold; caption text is upright with selective italics. Missing labels are filled automatically, but the agent must reconcile existing labels and provide a meaningful caption.

Contents numbering is separate: every top-level entry, including References and appendices, receives a continuous section number (for example, **11. References** and **12. Appendix A: Supporting detail**). Body headings stay unnumbered; the appendix heading retains its letter. A glossary uses the same continuous contents numbering.

Back matter normally follows References → Appendices → Glossary. If an appendix or glossary cites sources, put References last instead. A subtle divider follows References only when another section follows. See [back matter order](DESIGN.md#back-matter-order).

Recommended defaults: single-image figures unframed, grouped images automatically framed, PDF cover page off, plain abstract, two-column PDF contents (headers only), author name and title, Category None and Prepared for blank, Internal distribution. One-column contents includes headers and subheaders. PDF contents never appears in the web body and does not affect the web nav sidebar. See [DESIGN.md](DESIGN.md) for typography, options, footer language and page-flow rules. Distribution is required and footer-only. The first page uses a distribution-specific notice; subsequent pages use a short footer; the first-page and web-end notices include company wording as part of the notice itself, without an additional classification, organization or category prefix. Distribution markings do not provide access control.

`stress-report.html` is a synthetic layout fixture, not research evidence. Keep it separate from your draft. Public examples contain placeholder or synthetic material; use real reports only in a separate private workspace.


## Distribution and release

Choose the highest applicable classification. The required Distribution setting defaults to Internal and is rendered only in the footer, not the header metadata. The three choices are always-visible buttons with hover/focus help and a tappable info icon. Internal is selected by default; exactly one choice is required.

| Distribution | Use for | Short footer (PDF pages after page one) |
|---|---|---|
| Public | Data Owner-approved public releases or legitimately public-source material; technical releases also need COO/delegate clearance | Left: WindBorne Systems. Document title. November 2026. / Right: PUBLIC + page number |
| Internal | Nonpublic company information that does not meet a higher level; WB personnel and authorized providers under written agreements | Left: WindBorne Systems. Document title. November 2026. / Right: INTERNAL + page number |
| Proprietary | Sensitive company/customer information, pricing, commercial observations/forecasts, core technology, source code, models, system/hardware designs and test data; named need-to-know access; external release requires an NDA and written COO/delegate approval | Left: WindBorne Systems. Document title. November 2026. / Right: PROPRIETARY + page number |

On later PDF pages, the left footer reads `WindBorne Systems. Document title. November 2026.` in mixed case; uppercase classification and the page number sit on the right with a generous gap. Category and Prepared for are omitted. On page one and at the web end, show only the tailored notice. A custom first-page footer affects those locations only; pages 2 onward retain their standard organization/title/date footer on the left and classification/page number on the right. The later-page label is always uppercase: PUBLIC, INTERNAL or PROPRIETARY. The dates in this table are examples; use the document month/year. First-page notice wording is listed below; custom notices remain source-only.

The setting records classification; it does not authorize release or enforce access. Preserve supplied classifications, apply the highest level present, and ask the Data Owner when uncertain. Former Restricted and Confidential distribution values now map to Proprietary, including old links and saved configurations. Save settings persists the migrated label. Blank and unknown values are rejected. Missing settings default to Internal.

Use approved systems and required access controls for nonpublic content, including approved U.S. storage/processing unless an authorized exception applies. CUI, export-controlled data and federal-contract information require additional approved environments, permissions and markings; this template is not a compliance validator and does not replace those markings. Apply matching Google Drive labels where available. Public publishing requires the relevant Data Owner approval and technical/contract clearances; neither a classification selection nor a random URL grants approval. Keep nonpublic source documents and derived outputs out of this public repository.

See [automatic first-page notices](DESIGN.md#automatic-first-page-notices) for the exact default wording. All three defaults name WindBorne Systems within the notice; no separate company/classification prefix is added. The first-page notice also appears at the end of the web article. Preserve an existing source-authored custom notice instead of replacing it with these defaults.

## Command-line export

```sh
node render.cjs my-paper.html my-paper.pdf
node render.cjs my-paper.html my-paper.pdf \
  --settings '{"contents":"one","category":"Field Brief","distribution":"Internal","details":"full","abstract":"shaded"}'
```

In Document settings, **Category (optional)** includes None (default) first, Case Study / Proposal / Technical Report / White Paper alphabetically, and Add new option last. Existing or newly added custom labels appear alphabetically too; Research Paper, Concept of Operations and Analysis are custom labels rather than presets. **Prepared for (optional)** is a separate text field, blank by default, with “Conference/event name” as a placeholder. Both can be filled, saved and exported together. With four metadata fields, Author and Date form the first row; Prepared for sits beneath Author and Category beneath Date. Neither appears in the footer. For command-line export, use `--settings '{"category":"Technical Report","preparedFor":"AMS Annual Meeting 2027"}'`.

Omitted settings inherit the document's saved defaults. In a generated document workspace, `npm run build` renders your article and `npm run check` runs the setup/export smoke check. In the public toolkit checkout, `npm run build` renders the synthetic examples and `npm run check` runs the full implementation suite. [VALIDATION.md](VALIDATION.md) describes visual review and test coverage.

The local server accepts only local, same-origin JSON export and settings-save requests for root-level HTML documents. Saving updates only the document configuration, preserves article content, and detects conflicting settings from another tab. Published reader files are read-only. It serves no arbitrary filesystem paths or repository secrets. It is an authoring utility, not a production hosting service.

## Publish a static reader

```sh
node publish.cjs my-paper.html dist/my-paper \
  --settings '{"distribution":"Public","category":"Technical Report"}'
```

This creates `dist/my-paper/my-paper.html`, `my-paper.pdf` and the shared assets. It does not upload anything. Open or host `my-paper.html` from that folder; the command does not create an `index.html`. Share the whole folder for a web reader, or just the PDF for a PDF handoff. The reader's View PDF opens that baked PDF; a static host cannot run Chromium to generate changed settings. Regenerate the package after content or settings change. The local editor provides live custom export; public static readers receive an exact fixed publication.

Directly opening an editable HTML file still lets you read it and use browser print, but saving settings and generating custom PDFs require `npm start`. Saving settings does not rebuild existing PDF files; View PDF generates the current version, and publishing packages the matching PDF. Browser-native print omits unresolved contents page numbers; use the renderer for a finished PDF. Editing controls are presentation state, not authentication.

## Review several documents together

The standard editor has Template and Article tabs. For a private review bundle, configure `document-config.reviewTabs` to link additional documents, such as Template, Sample 1, Sample 2 and Sample 3; see [review bundle configuration](DESIGN.md#private-review-bundles). Each file keeps its own saved settings. Save before switching tabs. Keep customer/internal documents and their derived PDFs outside this public repository.

## Contents of the repository

- `create-document.cjs`, `setup.cjs`, `doctor.cjs`: isolated document creation, dependency setup and export diagnostics.
- `SKILL.md`, `AI-PROMPT.md`, `DESIGN.md`: reusable AI instructions and visual rules.
- `RELEASE.md`: v1.1.0 scope, release procedure and rollout responsibilities.
- `article.html`, `starter.html`, `specimen.html`, `stress-report.html`: editable sources and companion PDFs.
- `style.css`, `fonts.css`, `controls.js`: shared design, offline fonts and interactions.
- `renderer.cjs`, `render.cjs`, `server.cjs`, `settings-store.cjs`, `publish.cjs`: PDF export, local editor and static packaging.
- `check.cjs`, `check-settings.cjs`, `check-help.cjs`, `check.py`, `VALIDATION.md`: behavioral checks, content checks and review guidance.
- `experiments/comparison`: preserved earlier design comparisons; `experiments/original`: original print-only template. These are historical references, not places to write real documents.

Fonts carry their licenses in `licenses/`; Lucide's license is in `LICENSE-LUCIDE`. WindBorne's name and logo are brand assets, not a grant of trademark rights. Keep font and icon licenses with redistributed assets.

## Template versions and reproducibility

Use the latest `main` for new documents so they receive current fixes and guidance. `v1.1.0` is the fixed release checkpoint that includes Reset/Save controls, automatic grouped-image frames, hosted PDF link fixes, and the Google Docs/Word companion. The existing `v1.0` and `v1.0.1` tags remain unchanged.

When a fixed revision is requested, run `git checkout v1.1.0` (or the requested tag/commit) before creating the document workspace. Return the toolkit to `main` before starting later work that should use current defaults. Never move a published tag.

Keep `template-origin.json`, `toolchain.json`, the source/assets and the final PDF with each HTML document. The workspace generator records the exact source commit and file hashes. For native Google Docs/Word work, record the template commit in private handoff notes beside the source/export. A source revision does not guarantee identical output across browser/OS versions. Resume existing workspaces as they are; do not silently replace their shared assets or dependencies. Update an existing document only when requested, then rerun setup/export checks and inspect its pages.

## Maintaining the toolkit

Change shared code in the public checkout using synthetic fixtures only. Setup also installs `requirements-dev.txt` here for the PDF-layout checks; document workspaces receive only the export dependency. Run `node setup.cjs`, `npm run check:workspace` and `npm run check` before handing off a change. GitHub Actions runs the same checks on Linux and macOS for pull requests and pushes to main; it uses no customer documents or publishing credentials and uploads no document artifacts. Automated checks catch known failures but do not replace visual PDF review or automatically enforce branch protection.

Use pull requests for shared template changes. Do not copy a working manuscript back into `article.html`, a fixture, a screenshot or a test log. Dana’s Word template remains supported when Word is needed; it is not superseded by this workflow. Customer-mandated formats take precedence. This toolkit supports AI-assisted HTML/PDF and a native Google Docs/Word companion.

John approved the design; Chris confirmed the exact three default notices and classification mapping on November 12, 2026, following Mei-lan’s policy approval. These approvals do not authorize a particular document’s release or approve a storage/AI environment. See [release status and rollout](RELEASE.md) for the v1.1.0 checkpoint and remaining owner decisions. Record the template revision used for each document rather than silently updating its shared assets mid-draft.

Distribution is a fixed three-choice control: **Public, Internal (default), Proprietary**. There is no custom-distribution input in the editor; use the source-only custom first-page footer for document-specific wording. Only change the classification scheme in code when explicitly requested and authorized; that requires updating validation, notices, help and tests together. Do not invent a new level for an individual document. This differs from Category, which still supports custom labels. Preserve supplied notice text even when its wording includes “confidential”; migrate the distribution field, not the manuscript or legal notice.
