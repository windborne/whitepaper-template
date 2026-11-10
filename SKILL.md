---
name: windborne-whitepaper
description: Create or restyle technical papers, whitepapers and reports as an editable HTML article and a paginated PDF using the WindBorne editorial template. Use for document authoring and typesetting, not product interfaces or slides.
---

# WindBorne technical documents

Use the approved template in this repository for an editorial, readable technical document. One HTML source serves a navigable web article and a print PDF. Preserve the user's content and explicit design choices; the defaults below are recommendations, not a required document structure.

## Start here

1. Read [README.md](README.md) for setup and the save/export workflow, then [DESIGN.md](DESIGN.md) for typography, components, optional treatments and web/print differences.
2. For a first draft, use `article.html`, which is preloaded with starter copy on a fresh checkout. Inspect it first; do not overwrite an existing manuscript. For an additional document, copy `starter.html` to a new root-level `.html` file in this directory, using letters, numbers, hyphens or underscores in its basename. Keep `style.css`, `fonts.css` and `controls.js` beside it. Use `specimen.html` for component markup; `stress-report.html` is explicitly synthetic layout-test content.
3. Edit content in the HTML source; the browser controls presentation settings, not manuscript text. Replace both the HTML `<title>` and visible title, subtitle, date, abstract and article. Use the supplied date rather than inheriting the starter date. Update `document-config` with actual authors, organization and chosen defaults; update the body `data-document` to the filename without `.html`. Do not copy the specimen's sample authors, synthetic values or example references into an actual paper.
4. Use semantic `h2` sections and `h3` subsections with stable unique IDs. Navigation and both print contents layouts are generated from those headings. Section headings remain unnumbered in the body. The PDF contents numbers every top-level entry continuously, including References and appendices: for example, `11. References` and `12. Appendix A: Momentum values`. Use an `h2` appendix heading and `h3` subheadings; detailed contents uses the corresponding numeric subsection sequence, such as 12.1. The body heading remains `Appendix A: Momentum values`. This navigation numbering is separate from the lettered figure/table labels inside the appendix, such as Table A-1.
5. Run the document server using [README.md](README.md) and open `http://127.0.0.1:8743/article.html?mode=edit` (or the new draft’s filename) for the user. The Article tab is the working draft; Template is the component reference. Keep the server running during review. Save settings writes selected options into the draft’s HTML; it does not save prose or regenerate PDFs. Wait for Saved before reloading or switching tabs. View web reader layout opens a separate local preview tab with current choices and leaves the editing tab intact. View PDF renders the current choices, including unsaved ones; save the agreed choices before final export so source defaults and PDF agree. The command-line renderer also remains available. Export the actual selected settings. Inspect every rendered PDF page and the web layout at desktop and mobile widths. Follow [VALIDATION.md](VALIDATION.md); automated checks do not replace visual review.
6. Deliver a durable PDF file and editable HTML with its shared assets. Download/copy the generated PDF or render to a named output file: temporary viewer URLs expire and localhost links are not shareable publications. For a static website, use the publishing command in the README so the linked PDF matches the document settings.

## Content fidelity when restyling

A supplied document is a full manuscript unless the user explicitly asks for excerpts. Preserve every section, paragraph, list item, table value, figure, caption, note, appendix and reference; do not replace it with a selection of layout examples or write substitute summaries. Audit the complete source against the output. PDF extraction needs special checks for ligatures, subscripts, merged table cells and paragraphs split across pages. When removing source numbering, update all internal section references to the new scheme. Keep customer/internal source material and derived previews outside the public repository.

## Recommended defaults

Abstract background **off**; PDF table of contents **two columns (headers only)**; author details **name and title**; label **None**; distribution **Confidential**. Use the optional Label slot for either Category or Prepared for, never both; only Category is included in the footer. Prepared for is user-supplied text, not the placeholder. These are stored in the document's JSON configuration. Do not infer classification from the subject matter. A distribution label is descriptive and does not implement access control.

One-column contents includes sections and subsections. Two-column contents includes sections only. Contents appears before the abstract in print and never in the web body. The first body section flows after the abstract. In print, CONTENTS and REFERENCES share a small uppercase IBM Plex Mono label. There is no visible Summary label, print cover logo, automatic “Draft for discussion,” or mandatory cover page.

## Preserve evidence and source material

When restyling an existing document, preserve facts, numbers, qualifications, citations and figure meaning. Do not silently rewrite the argument to fill pages. Keep a record of source inconsistencies and missing information; mark unresolved items visibly rather than inventing them. Preserve supplied confidentiality language unless the user authorizes changes. Never invent a source, quote, author, affiliation, dataset or measured result.

Use SVG for diagrams and charts when the underlying data or geometry is available. Keep photographs, scientific maps and unavailable-data charts as images with useful alt text; identify a chart that would need source data to redraw.

For print photographs, use the opt-in `figure-photo` and `figure-portrait` treatments in DESIGN.md. For square or portrait photos, use the explicit photo treatment: print has a 3in maximum, centered in the left of two equal columns with a right-side caption aligned to the bottom of the photo; web uses a compact centered image with the standard desktop side caption (below on small screens) and a larger lightbox. Landscape photos retain a 4in ceiling. Review export layout recommendations, classify scientific images explicitly, and keep charts, diagrams, heatmaps, maps and tables exempt from these photo limits.

Give every figure and table a numbered caption. Use separate sequential numbering in the main text: Figure 1, Figure 2… and Table 1, Table 2…. In Appendix A, restart each sequence as Figure A-1 and Table A-1; Appendix B restarts at B-1. Do not use section-based numbers unless the user or submission requirements call for them. When changing labels, update every matching in-text reference and link together. Mark each appendix wrapper with `class="appendix" data-appendix="A"` (B, C, etc.). The runtime fills missing labels but preserves explicit ones; reconcile those in the source. Multi-panel figures share one number with (a), (b) panels; continued tables retain their original number. A generated label alone is not a complete caption: supply a source-supported explanation or flag what is missing. Use upright caption text with selective italics only, never blanket italics.

Recreate tables as semantic HTML. Preserve meaningful scientific color; make distinctions readable in grayscale when feasible.

## Writing and figures

Write for a technical professional: state the problem and claim early, distinguish evidence from estimates, define assumptions and give units. Use paragraphs for arguments and lists for parallel items. Avoid promotional adjectives, stock AI phrases, decorative callouts and bold emphasis scattered through prose. A summary should convey the result or proposal and its principal limitation; do not prescribe a fixed chapter order or force every paper to end with an ask.

Refer to figures and tables before they appear. Number them in order and use captions to explain what readers should notice. Direct labels, consistent line weights, dashed reference series and hatching are preferred over decorative color. Mark synthetic or notional data explicitly. At a 700-unit SVG viewBox and 496.8pt print width, 12-unit labels print at about 8.5pt. Inspect at final size; simplify an overcrowded diagram rather than shrinking text. Equations use MathML and STIX Two Math, with every symbol and unit defined in the prose.

## Page flow

Keep a heading with following content, a figure with its caption, and each ordinary table row or display equation intact. Let sections, tables, abstracts, examples and appendices flow across pages. Repeat table headers. Do not introduce whole-section or whole-table keep rules, chained keeps, fixed page heights, clipped overflow, or routine forced page breaks. Split an oversized row or diagram into meaningful units. The renderer rejects a unit taller than the printable page rather than pretending it can fit.

When a page has excessive space, inspect the actual cause. Adjust figure placement or content structure with the author's intent in mind; do not shrink body type to hide a layout problem. Some space before a figure is acceptable. Report unresolved sparse endings or content issues honestly.

## Verification and handoff

For Confidential documents without a custom first-page footer, retain the recommended full notice at the end of the web article and on the first PDF page. A supplied custom footer replaces that notice; subsequent PDF pages retain short footers. Check exact settings, all content, references and backlinks, contents destinations/page numbers, mathematical glyphs, table continuation, margins, footers and confidentiality notice. Check the sidebar, mobile layout, keyboard figure lightbox, and a custom-settings PDF export. Keep source and generated assets together. Run `npm run check` after changing the shared implementation. Use the copy-paste [AI-PROMPT.md](AI-PROMPT.md) for a new content handoff.

## Document-specific notices

Use `defaults.firstPageFooter` for a supplied document-specific first-page notice. This is the complete footer text, including the organization name; it replaces the recommended first-page wording and the web end notice. Leave it empty to use the recommended distribution notice. Preserve the user’s exact wording; do not invent legal or regulatory language. Later PDF pages retain the standard short footer. Review the first page at final size for wrapping and verify the notice appears once, rather than also placing it beneath the title. Changing Distribution does not change a saved custom footer.

## Public repository boundary

This repository is public on the internet. Keep examples synthetic or placeholder-based. Supplying a real document for local restyling does not authorize publishing it. Keep source documents, derived HTML/PDFs, screenshots and review bundles outside this checkout. Require explicit publication approval for the specific real content before adding it to a public repository, including historical examples.

## Back matter order

When these sections are present, use body → References → Appendices → Glossary. Put the glossary after all appendices; omit any sections the document does not need. If any appendix or glossary cites an external source, including an existing bibliography entry, move the single References section to the very end: body → Appendices → Glossary → References. Links to sections, figures or tables within the document do not trigger this change. Inspect both linked citations and plain-text source attributions; do not rely only on citation markup. Preserve reference IDs and backlinks when moving the section. Submission requirements or explicit user instructions take precedence.

This is an authoring decision, not automatic browser reordering. Use `<section class="glossary"><h2 id="glossary">Glossary</h2><dl>…</dl></section>` with `dt` terms and `dd` definitions. Define unfamiliar terms at first use too; a glossary supplements the prose. Glossary gets an ordinary section heading and continuous navigation/contents number, like References and appendices. Do not invent definitions unsupported by the manuscript.

When References is followed by another section, a subtle bottom rule separates the reference list from that section on web and in print. The rule uses the reference/body text width, adds no forced page break, and is absent when References is last.
