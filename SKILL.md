---
name: windborne-whitepaper
description: Create or restyle technical papers, whitepapers and reports as an editable HTML article and a paginated PDF using the WindBorne editorial template. Use for document authoring and typesetting, not product interfaces or slides.
---

# WindBorne technical documents

Use the approved template in this repository for an editorial, readable technical document. One HTML source serves a navigable web article and a print PDF. Preserve the user's content and explicit design choices; the defaults below are recommendations, not a required document structure.

## Start here

1. Read [README.md](README.md) for setup and the save/export workflow, then [DESIGN.md](DESIGN.md) for typography, components, optional treatments and web/print differences.
2. For a first draft, use `article.html`, which is preloaded with starter copy on a fresh checkout. Inspect it first; do not overwrite an existing manuscript. For an additional document, copy `starter.html` to a new root-level `.html` file in this directory, using letters, numbers, hyphens or underscores in its basename. Keep `style.css`, `fonts.css` and `controls.js` beside it. Use `specimen.html` for component markup; `conop.html` shows a real source document and `stress-report.html` is explicitly synthetic layout-test content.
3. Edit content in the HTML source; the browser controls presentation settings, not manuscript text. Replace both the HTML `<title>` and visible title, subtitle, date, abstract and article. Use the supplied date rather than inheriting the starter date. Update `document-config` with actual authors, organization and chosen defaults; update the body `data-document` to the filename without `.html`. Do not copy the specimen's sample authors, synthetic values or example references into an actual paper.
4. Use semantic `h2` sections and `h3` subsections with stable unique IDs. Navigation and both print contents layouts are generated from those headings. Section headings remain unnumbered in the body.
5. Run the document server using [README.md](README.md) and open `http://127.0.0.1:8743/article.html?mode=edit` (or the new draft’s filename) for the user. The Article tab is the working draft; Template is the component reference, and the CONOP remains a separate example. Keep the server running during review. Save settings writes selected options into the draft’s HTML; it does not save prose or regenerate PDFs. Wait for Saved before reloading or switching tabs. View reader layout opens a separate local preview tab with current choices and leaves the editing tab intact. View PDF renders the current choices, including unsaved ones; save the agreed choices before final export so source defaults and PDF agree. The command-line renderer also remains available. Export the actual selected settings. Inspect every rendered PDF page and the web layout at desktop and mobile widths. Follow [VALIDATION.md](VALIDATION.md); automated checks do not replace visual review.
6. Deliver a durable PDF file and editable HTML with its shared assets. Download/copy the generated PDF or render to a named output file: temporary viewer URLs expire and localhost links are not shareable publications. For a static website, use the publishing command in the README so the linked PDF matches the document settings.

## Recommended defaults

Abstract background **off**; PDF table of contents **two columns (headers only)**; author details **name and title**; category **none**; distribution **Confidential**. These are stored in the document's JSON configuration. Do not infer classification from the subject matter. A distribution label is descriptive and does not implement access control.

One-column contents includes sections and subsections. Two-column contents includes sections only. Contents appears before the abstract in print and never in the web body. The first body section flows after the abstract. In print, CONTENTS and REFERENCES share a small uppercase IBM Plex Mono label. There is no visible Summary label, print cover logo, automatic “Draft for discussion,” or mandatory cover page.

## Preserve evidence and source material

When restyling an existing document, preserve facts, numbers, qualifications, citations and figure meaning. Do not silently rewrite the argument to fill pages. Keep a record of source inconsistencies and missing information; mark unresolved items visibly rather than inventing them. Preserve supplied confidentiality language unless the user authorizes changes. Never invent a source, quote, author, affiliation, dataset or measured result.

Use SVG for diagrams and charts when the underlying data or geometry is available. Keep photographs, scientific maps and unavailable-data charts as images with useful alt text; identify a chart that would need source data to redraw. Recreate tables as semantic HTML. Preserve meaningful scientific color; make distinctions readable in grayscale when feasible.

## Writing and figures

Write for a technical professional: state the problem and claim early, distinguish evidence from estimates, define assumptions and give units. Use paragraphs for arguments and lists for parallel items. Avoid promotional adjectives, stock AI phrases, decorative callouts and bold emphasis scattered through prose. A summary should convey the result or proposal and its principal limitation; do not prescribe a fixed chapter order or force every paper to end with an ask.

Refer to figures and tables before they appear. Number them in order and use captions to explain what readers should notice. Direct labels, consistent line weights, dashed reference series and hatching are preferred over decorative color. Mark synthetic or notional data explicitly. At a 700-unit SVG viewBox and 496.8pt print width, 12-unit labels print at about 8.5pt. Inspect at final size; simplify an overcrowded diagram rather than shrinking text. Equations use MathML and STIX Two Math, with every symbol and unit defined in the prose.

## Page flow

Keep a heading with following content, a figure with its caption, and each ordinary table row or display equation intact. Let sections, tables, abstracts, examples and appendices flow across pages. Repeat table headers. Do not introduce whole-section or whole-table keep rules, chained keeps, fixed page heights, clipped overflow, or routine forced page breaks. Split an oversized row or diagram into meaningful units. The renderer rejects a unit taller than the printable page rather than pretending it can fit.

When a page has excessive space, inspect the actual cause. Adjust figure placement or content structure with the author's intent in mind; do not shrink body type to hide a layout problem. Some space before a figure is acceptable. Report unresolved sparse endings or content issues honestly.

## Verification and handoff

For Confidential documents, retain the full notice at the end of the web article and on the first PDF page, with short footers on subsequent PDF pages. Check exact settings, all content, references and backlinks, contents destinations/page numbers, mathematical glyphs, table continuation, margins, footers and confidentiality notice. Check the sidebar, mobile layout, keyboard figure lightbox, and a custom-settings PDF export. Keep source and generated assets together. Run `npm run check` after changing the shared implementation. Use the copy-paste [AI-PROMPT.md](AI-PROMPT.md) for a new content handoff.
