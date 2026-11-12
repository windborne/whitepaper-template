# Editorial design system

This is the approved default, evolved from the WindBorne research blog. Earlier treatments remain in `experiments/comparison`; the original print template is archived in `experiments/original`. Those files are references, not competing instructions for new documents.

## Type and reading geometry

| Role | Family | Web | Print |
|---|---|---|---|
| Body | Newsreader, regular | 18px / 1.48 | 10.75pt / 1.38 |
| Title | Newsreader, semibold | Responsive | 27pt / 1.1 |
| Section | Newsreader, semibold | 28px | 16pt / 1.2 |
| Subsection | Newsreader, semibold | 22px | 12pt / 1.25 |
| Captions | IBM Plex Sans | 12px / 1.5 | 8.5pt / 1.45 |
| Tables | IBM Plex Sans | 13px / 1.5 | 8.7pt / 1.4 |
| Metadata | IBM Plex Sans | Small labels + 13px values | 7pt labels, 8.8pt values |
| CONTENTS / REFERENCES | IBM Plex Mono | Print-only shared treatment | 7.5pt / 1.4, uppercase, tracking .11em |
| Contents title / section number | Newsreader, semibold | Not in web body | 10.5pt / 9.5pt, same color and weight |
| Contents subsection / number | Newsreader, regular | Not in web body | 10pt / 9pt, same color and weight |
| Contents page numbers | IBM Plex Mono | Not in web body | 8.2pt |
| Math | STIX Two Math | MathML | MathML |

Use left-aligned text. The main web reading column is 660px, with generous gutters between the navigation and caption rails. Print uses US Letter with .68in top, .8in side and .70in bottom margins. Text remains slightly narrower than the figure/table area. Appendix headings and prose, and the references block, use the same centered 6.5in print measure as body text; figures and tables inside an appendix retain the wider measure. Fonts are bundled in `fonts.css`; no network font request is needed.

Use Engine Storybook’s verified brand palette: Gray 900 `#1E1C1C` for ink and figure frames; Gray 700 `#4F4D4B` for supporting text; Gray 200 `#DADBD7` for light rules; Gray 75 `#F2F1F0` for optional abstract shading; muted Sky 700 `#17667D` for links. PDF pages, including covers and margins, use pure white `#FFFFFF`, not Engine’s tinted application canvas. Palette source: https://app.windbornesystems.com/storybook/index.html?path=/docs/design-system-color--docs (verified November 12, 2026). Preserve original scientific image/chart colors. A light abstract tint is optional. Avoid cards, pills, decorative shadows and arbitrary font sizes inside the article. Meaningful charts and photographs may preserve color; use pattern, line style and direct labels so meaning does not depend on color alone.

## Document configuration

Each HTML includes a `script` with `id="document-config"` and `type="application/json"`:

```json
{
  "authors": [{"name": "Author Name", "title": "Research scientist", "organization": "WindBorne"}],
  "organization": "WindBorne Systems",
  "footer": {"title": ""},
  "defaults": {"figureBorders": "off", "cover": "off", "abstract": "plain", "contents": "two", "details": "title", "category": "", "preparedFor": "", "distribution": "Internal", "firstPageFooter": ""}
}
```

Use `plain` or `shaded`; `none`, `one` or `two` for contents; `none` (name only), `title`, `organization` or `full` for author details. Store independent optional values in `category` (80 characters maximum) and `preparedFor` (160 characters maximum). Empty strings mean None/blank. The deprecated `label` mode is ignored on import and removed on save; it no longer hides either populated field. Distribution is required: Public, Internal or Proprietary; an omitted setting defaults to Internal. Legacy Restricted and Confidential distribution values automatically resolve to Proprietary in saved configurations, URL settings and export requests; saving writes Proprietary back to the source. Blank and unrecognized values are rejected. Escape JSON correctly, including `<` as `\u003c` if it occurs in a value inside the script element. Organization is configurable; the WindBorne web logo remains a brand asset and is not a license to imply affiliation.

In header metadata, abbreviate the month with a period when a day is included, e.g. `Nov. 9, 2026`; use the full month name for month/year only, e.g. `November 2026`. This applies with two, three or four metadata fields. Do not reformat dates inside source quotations or reference titles.

## Optional treatments

Settings are ordered alphabetically: Abstract background, Author details, Category (optional), Distribution, Figure borders, PDF cover page, PDF table of contents, Prepared for (optional). Category is always visible and includes None (the default); Prepared for is an always-visible text field, blank by default, with “Conference/event name” as placeholder. The specimen also has Example authors for demonstration. Below the options, Save settings (Lucide save) persists changes in this document’s HTML. It is disabled until settings change, reports Saved on success and keeps unsaved choices visible on failure. The top bar uses View PDF (Lucide file-text) and Document settings (Lucide pencil-line).

With four metadata fields, use two columns: Author / Date, then Prepared for / Category. With only one optional field, use three columns where space permits. Omit empty fields; never display the placeholder as content. This applies to web and PDF; long values wrap. Distribution is footer-only.

- Authors: singular label for one author; plural for several. Name-only uses comma-separated names. Any title/organization details put each author on a separate line. Without optional fields the metadata uses a 50/50 split, or about 70/30 for a long byline.
- Category (optional): None (default) first; Case Study, Proposal, Technical Report and White Paper alphabetically; Add new option last. Custom labels (80 characters maximum) join the alphabetical list. Existing Research Paper, Concept of Operations and Analysis values remain valid as custom labels; do not rename or erase them.
- Distribution: required; Public, Internal (default), Proprietary. Footer-only: never put it in the header metadata. Later PDF pages use uppercase PUBLIC, INTERNAL or PROPRIETARY; first-page wording is listed below. Every choice button has an info tooltip explaining when to use it.
- Prepared for (optional): independent free text with “Conference/event name” as a placeholder, never a prefilled value. Suitable for conferences, events, organizations or audiences; omit it from the footer.
- Footer: pages after page one use `WindBorne Systems. [Footer title.] [Full month YYYY.]` on the left, in mixed case. The uppercase classification and page number sit on the right, separated by two em spaces. Use 7.5pt IBM Plex Sans Regular. The left box is 5.15in and the right box is 1.5in within the 6.9in content width, leaving a clear gutter. Keep month and year together. Align the left text and right group at their bottom baseline. Long left text wraps at the same font size; never truncate or silently abbreviate. Derive month/year from the document date and omit Category. Page one uses the separate notice treatment below. The first page has no page number; subsequent pages do. Custom notices appear without an organization/classification prefix. The web article ends with the first-page footer treatment. Prepared for is never included in the footer. The first-page notices are proposed template wording derived from the handling rules, not quotations or approved legal language.
- Abstract background: off by default; on uses a pale tint without changing the text measure. No visible Summary or Abstract heading is added.
- PDF contents: None; One column (headers and subheaders); Two columns (headers only). Enabling contents from None turns abstract shading off; a subsequent manual choice can restore it. Changing between enabled layouts preserves that manual choice.

**Custom first-page footer (source only):** set `defaults.firstPageFooter` in the HTML document-config (or the `firstPageFooter` CLI setting) to a short notice, up to 1,000 characters. There is no footer text field in Document settings. The first page and web end display only the tailored notice, without an additional organization, category or distribution prefix. Company/classification wording within the approved notice itself is intentional. Legacy organization/classification prefixes are stripped from custom notices. Blank uses the automatic notice. The web article ends with the same treatment. Later PDF pages keep the standard organization/title/month-year footer on the left, with uppercase classification and page number on the right. Changing Distribution changes the default notice and later-page label, but preserves supplied custom notice wording. Save settings preserves the override. Aim for one line at the existing footer type size; long custom notices wrap rather than shrink or clip.


## Automatic first-page notices

The following template notices and three-label scheme were confirmed by Chris on November 12, 2026. These notices are template wording, not quotations from the policy. They appear on the first PDF page and at the end of the web article. Show the notice alone; later PDF pages retain the organization/title/date footer on the left and classification/page number on the right.

| Distribution | Complete first-page notice |
|---|---|
| Public | WindBorne Systems. For public distribution. |
| Internal | Internal WindBorne Systems document. Not approved for public release. |
| Proprietary | Proprietary WindBorne Systems document. External release requires an NDA and written approval from the COO or delegate. |

A source-authored `defaults.firstPageFooter` takes precedence over these notices. Preserve existing document-specific wording, including regulatory disclaimers; do not replace it during migration. Do not prepend an additional organization, category or classification prefix on page one or at the web end. Preserve company wording already present in the default or supplied notice. These notices do not replace additional CUI, export-control or contractual markings and permissions.

## Web and print

| Component | Web | PDF |
|---|---|---|
| Header bar | White, blog logo link, View PDF | Hidden |
| Editing controls | Local editor or `?mode=edit`; hidden in `?mode=public` | Hidden |
| Navigation | Sticky numbered sidebar; collapsible on mobile | Optional opening contents |
| Captions | Right rail on desktop; below on small screens | Below figures/tables; opt-in portrait photos use a bottom-aligned right-side caption |
| Figures | Click/tap or keyboard opens native dialog; Escape closes | Inline vector/image with caption |
| References | Linked markers and return links | Small mono REFERENCES label, source links retained; return arrows hidden |
| Body | Continuous page | Natural page flow with repeated table headers |

The one-column contents puts CONTENTS to the left of the detailed list. The two-column layout puts the label above, reads down the left then down the right, and omits subsections. Both have flush-aligned titles, smaller matching serif section numbers and right-aligned mono page numbers. Neither uses dotted leaders or row rules. The two-column number gutter is 25pt (one column: 27pt), leaving room for double-digit section numbers without crowding titles. The PDF contents numbers every top-level entry continuously, including References and appendices: for example, `11. References` and `12. Appendix A: Momentum values`. Use an `h2` appendix heading and `h3` subheadings; detailed contents uses the corresponding numeric subsection sequence, such as 12.1. The body heading remains `Appendix A: Momentum values`. This navigation numbering is separate from the lettered figure/table labels inside the appendix, such as Table A-1. Contents precedes the abstract; the first section follows without a forced page break.

## Component markup

Copy actual components from `specimen.html`, replacing all illustrative content.

- Figures: `figure` containing a `button.figure-art` with SVG or an image and a sibling `figcaption`. Give the button an accessible label and the graphic an accessible title/description or alt text. Captions use a bold figure label followed by upright text. The runtime adds missing Figure/Table labels, using separate sequences and retaining existing explicit labels (including appendix labels). Do not italicize entire captions; selective emphasis is fine. Captions imported with blanket italics are normalized to upright text; partial italics are retained. Use unique SVG IDs per figure. Lightbox raster images and SVGs scale to the dialog width at every breakpoint, preserving aspect ratio without forced minimum widths. The lightbox caption uses 16px/1.5 IBM Plex Sans and spans its full inner width, aligned with the enlarged figure. The lightbox namespaces IDs in its copy. Its close control is a Lucide X with an accessible Close label; Escape also closes it and focus returns to the figure.
- Tables: `.table-block > .table-wrap > table` with `thead`, `tbody`, scoped `th` cells, and a native `caption`. The web side caption is generated from the native caption. Use `.num` for numeric alignment. `.caption-below` keeps a desktop caption below when needed. Notes/legends remain beneath the table.
- Equations: `.eq` with MathML and optional `.eqn`. Define variables and units nearby. Split long derivations into separate display equations rather than one oversized flex container.
- References: `.notes` containing `h2#references` and an ordered list. Each reference has an ID; a `sup.fn` marker links to it. Give the marker an ID for the reference's `.ref-back` link. Keep links meaningful without relying on color.
- Examples: `.example` with `.lbl` and normal paragraphs. The label stays with the following text; the full example may break.
- Code: `pre > code`, no syntax-color dependency; long code wraps. Appendices use `.appendix` and normal headings.

Use thin horizontal table rules, no vertical cell borders, aligned numbers with consistent precision and units in headers. A qualitative Harvey-ball scale needs a text key. Figure vocabulary includes hatching, dimensions, callouts/detail views, line-weight hierarchy, direct chart labels and uncertainty bands; the specimen demonstrates these without imposing a scientific meaning.

## Pagination contract

Ordinary figure/caption units, table rows, equations and contents rows stay intact. Headings keep with the next content. In print, main section headings use 24pt above and 8pt below; subsections use 16pt above and 6pt below. Use normal collapsing margins so spacing is discarded at automatic page breaks, rather than padding or forced breaks. Web heading spacing is independent. Paragraphs and list items have three-line widow/orphan protection. Tables split between rows and repeat their headers. Whole sections, tables, abstracts, contents lists, examples and appendices are not forced onto one page. There are no automatic appendix page breaks or chained keeps around figures/equations.

An element taller than the available page cannot be kept intact; the renderer detects oversized figures, rows and equations and requests a structural fix. Reduce excess drawing canvas, simplify or divide the material. Never clip, hide, or shrink the entire report to fit. Inspect every final page because text length, figures and long references can still produce sparse endings.

## First-run editor

The local editor starts at `article.html?mode=edit`, with the starter copy preloaded in Article and the component specimen under Template. When editing a differently named draft, Template links back to that same Article. Settings save into the editable source, while PDF viewing always reflects the current controls. View web reader layout opens a new tab with a snapshot of those choices, preserving the editing tab. Manuscript text and metadata are edited in HTML, not in the settings panel. Static published readers hide editing controls and link their matching PDF.

Settings help covers PDF table of contents, Distribution and Save settings. Info buttons expose short explanations on hover, keyboard focus or tap; Escape dismisses help before closing the panel.

## Photographs

Photo sizing is opt-in; do not classify every tall image as a photograph. Add `figure-photo` to a photographic figure to give the image a preferred maximum print height of 4in, preserving its aspect ratio and using less width when necessary. This is a ceiling, not a target. Never stretch or crop automatically.

For a square or portrait photo (height ≥ width), the recommended maximum is **3in**, with the caption to the right. Use `class="figure-photo figure-portrait"`. In print, use two equal columns within the body-text width, with an 18pt gutter. Center the photograph horizontally in the left column. Left-align the caption in the right column and align its bottom edge with the bottom of the photo. For a longer explanatory caption, add `photo-caption-top` to align both columns at the top. An unusually narrow image may occupy less than that column. This treatment defaults to the 3in ceiling. A square photo may be smaller to fit its column. Override `--photo-max-height` only for a deliberate, reviewed exception. On the web, center the photo within the article column, with a maximum image height of 360px or half the viewport height, whichever is smaller. Keep its caption in the standard right-hand rail on desktop; on small screens it moves below, like other figures. The lightbox uses the available viewport height rather than the inline photo ceiling; it preserves aspect ratio and keeps the whole photo visible on mobile. Other figures retain their existing side captions and lightbox sizing.

These photo rules do not apply to charts, heatmaps, diagrams or tables. Keep chart labels readable: use a larger figure or split a genuinely oversized chart into meaningful panels with repeated labels. Tables continue across pages with repeating headers. The export preflight measures at the printable page width; it checks indivisible units, not the height of an entire table.

During PDF export, non-landscape images without this treatment produce a non-blocking layout recommendation in the terminal/server log. Review the image’s purpose before applying it. Mark scientific figures with `data-figure-kind="chart"`, `"heatmap"`, `"diagram"` or `"map"` on the `figure` to explicitly exempt them. The flag never resizes artwork automatically and never changes the PDF content.

## Figure and table numbering

Use separate sequential numbering in the main text: Figure 1, Figure 2… and Table 1, Table 2…. In Appendix A, restart each sequence as Figure A-1 and Table A-1; Appendix B restarts at B-1. Do not use section-based numbers unless the user or submission requirements call for them. When changing labels, update every matching in-text reference and link together.

Wrap each appendix in `<section class="appendix" data-appendix="A">` (then B, C, etc.). Put its heading and all its content inside that wrapper. Use the letter even for a single appendix. The runtime adds missing labels in the appropriate sequence; explicit source labels are preserved to avoid silently breaking references, so the authoring agent must reconcile them to this convention. Do not infer appendix membership from a heading's wording. An existing `.appendix` without a letter falls back to A, B, etc. in document order.

Number figures and tables independently in first-citation order and place them in that order. A multi-panel figure has one figure number and panels (a), (b), etc.; cite a panel as Figure 2(a). A table continued over pages retains one table number. Caption labels use bold text; caption prose is upright, with selective italics allowed. Automatic labels do not supply a missing explanation: the authoring agent must write a source-supported caption or flag the missing information.

## Private review bundles

For a local review site, `document-config.reviewTabs` may contain `{ "label": "Sample 1", "document": "sample-1.html", "title": "Descriptive document title" }` entries. These replace Template/Article tabs only in edit mode. All tab targets must be root-level HTML files served by the local editor. Keep real customer/internal examples outside the public repository; review tabs do not grant access control or publish the site.

## Back matter order

When these sections are present, use body → References → Appendices → Glossary. Put the glossary after all appendices; omit any sections the document does not need. If any appendix or glossary cites an external source, including an existing bibliography entry, move the single References section to the very end: body → Appendices → Glossary → References. Links to sections, figures or tables within the document do not trigger this change. Inspect both linked citations and plain-text source attributions; do not rely only on citation markup. Preserve reference IDs and backlinks when moving the section. Submission requirements or explicit user instructions take precedence.

This is an authoring decision, not automatic browser reordering. Use `<section class="glossary"><h2 id="glossary">Glossary</h2><dl>…</dl></section>` with `dt` terms and `dd` definitions. Define unfamiliar terms at first use too; a glossary supplements the prose. Glossary gets an ordinary section heading and continuous navigation/contents number, like References and appendices. Do not invent definitions unsupported by the manuscript.

When References is followed by another section, a subtle bottom rule separates the reference list from that section on web and in print. The rule uses the reference/body text width, adds no forced page break, and is absent when References is last.

The optional abstract background uses WindBorne brand Gray 75 (`#F2F1F0`), a quiet warm-neutral reading surface from the Storybook color ramp. The same shade token is used for subtle reference highlights.


## PDF cover page

The **PDF cover page** switch uses `defaults.cover: "off"` (recommended) or `"on"`, also supported by URL/CLI settings and Save settings. It affects print only. The cover replaces `.paper-header` in print; on the web the ordinary header remains visible. PDF contents, abstract and body follow the cover. It counts as physical page one, carries the first-page tailored notice in its left text column and has no printed page number. Subsequent page numbers and contents destinations include the cover.

The cover takes the visible title, subtitle and metadata from the header. Set `document-config.cover.title` for deliberate cover line breaks (`\n`) or a shorter presentation title while retaining the complete title elsewhere. The bundled WindBorne logo sits above the title. Set the full tailored notice in `defaults.firstPageFooter`; it is placed inside the cover's left column, not in a page-wide bottom margin box. No organization or distribution prefix is added.

Optional decorative image markup:

```html
<template id="cover-art"><img src="assets/cover-photo.jpg" alt="Balloon in flight"></template>
```

The cover uses a named US Letter page with zero margins. The image occupies a 2.1in strip flush with the right, top and bottom edges. Only decorative photographs may be cropped with `object-fit: cover`; never crop scientific figures. The left column begins 1in from the left edge; the logo, title, subtitle and metadata form one block centered vertically between the 1in top margin and the top of the confidentiality notice. The block shifts automatically as its content grows. The cover has only a title and an optional subtitle: 36pt bold Newsreader for the title and 18pt regular Newsreader for the subtitle. The subtitle comes from the normal article header. Metadata uses 8.5pt uppercase sans-serif labels, 14pt medium values, 13pt Medium (500) recipient names and 12pt email/validity. Do not split a title into separate volume labels or contract-number fields. Keep that information within the title and optional subtitle, preserving all source wording. Proposals put Delivery Date before Point of Contact, then Prepared for. Validity appears below the date without a comma. The 8.5pt notice is anchored near the bottom of the left column, aligned with the other text. Without art, the same cover uses the full text area.

The body pages retain their usual margins, type sizes and short footers. Web typography is unchanged except for the separate validity line and notice-only end footer. Inspect every cover for title wrapping, photo crop and long notices. The renderer rejects overflow within the fixed cover instead of clipping; revise presentation spacing or metadata while preserving required information. Edge-to-edge refers to the PDF; a physical printer's printable area may differ.


## Proposal treatment

Choosing Category **Proposal** enables the PDF cover and switches metadata to **Point of Contact** and **Delivery Date**. Proposal remains a saved category for behavior, but its label is omitted from web metadata, print metadata and footers. The user may switch the cover off afterward; unrelated setting changes and reload preserve that explicit choice. Switching to another category restores ordinary author/date labels and leaves the cover choice alone.

Supply proposal contact and validity in `document-config`, rather than duplicating them as extra header blocks:

```json
"proposal": {
  "contact": {"name": "Contact name", "email": "contact@example.com"},
  "validity": "Valid for 180 days"
}
```

The contact replaces authors and includes a mailto link. The Author details control is hidden while Proposal is selected. If no separate contact was supplied, existing names are retained as a fallback; agents should confirm the actual contact instead of inventing one. Validity is optional, appears on a separate line beneath the delivery date (for example, `Jul. 4, 2026` followed by `Valid for 180 days`, without a comma) and does not alter the month/year used in later PDF footers. Prepared for remains independent.

Move the full original confidentiality notice into `defaults.firstPageFooter`. It appears once at the web end and in the first PDF page footer, without an organization/classification prefix. Remove the duplicate `.document-notice` and `.document-contact` blocks from a proposal's header. Preserve original notice wording; longer notices wrap and need visual inspection. Use **WindBorne Systems** for the displayed organization (without Inc.). The PDF cover uses the bundled WindBorne logo from the web header.

Private review tabs support an optional `shortLabel`, for example `{"label":"Proposal 2","shortLabel":"P2","document":"proposal-2.html"}`. Inactive tabs show the short label; the current document shows the full label. Accessible names and hover titles retain the full label. Template remains Template. This changes local navigation, not sharing permissions.

The bundled IBM Plex Sans weights are Regular (400), Medium (500), Semibold (600) and Bold (700). Cover dates and contact names use the actual Medium (500) face at 14pt, and Prepared for recipients use it at 13pt; this is the approved cover standard, not a preview option. Field labels, email addresses and validity remain Regular (400). Do not substitute a heavier weight or rely on browser synthesis when packaging fonts. Preserve source notice capitalization, including CONFIDENTIALITY NOTICE: when supplied; do not normalize it to sentence case.

The optional source-only `document-config.footer.title` supplies a short running title for every PDF page after page one. Omitted, empty or whitespace-only values fall back to the complete visible `.paper-header h1` text; do not use `cover.title` or the browser `<title>`. Normalize whitespace and avoid doubled terminal periods, preserving case, identifiers and wording. Save settings preserves the field. It does not change the visible title, web header, cover title or first-page notice. Review long full-title footers for wrapping and separation from the right-hand classification/page number.

When authoring a short footer title, omit repeated “WindBorne” or “WindBorne Systems”: the company prefix already identifies the organization. If the main title includes the brand, set `footer.title` explicitly to avoid repeating it; for example, “WindBorne White Paper Template” uses “White Paper Template”. Keep the main/web/cover title unchanged. Preserve the remaining title wording unless the user provides or approves a shorter version. This is an authoring rule; the runtime full-title fallback remains available when no footer title is supplied.

Distribution is a fixed three-choice control: **Public, Internal (default), Proprietary**. There is no custom-distribution input in the editor; use the source-only custom first-page footer for document-specific wording. Only change the classification scheme in code when explicitly requested and authorized; that requires updating validation, notices, help and tests together. Do not invent a new level for an individual document. This differs from Category, which still supports custom labels. Preserve supplied notice text even when its wording includes “confidential”; migrate the distribution field, not the manuscript or legal notice.

## Optional figure borders

Figure borders is a single on/off switch, off by default (`defaults.figureBorders: "off"`; use `"on"` to enable). The fixed 0.5pt Gray 900 frame follows each image or SVG artwork edge in web, lightbox and print; captions and decorative cover art remain outside it. No thickness control. Multi-image figures frame each panel separately. The border stays inside the artwork box; verify pagination at export. Use `data-figure-border="off"` on a figure that already has a frame or should remain unframed. Native HTML tables keep their own table rules. The setting is saved, carried to the web reader and honored by PDF export.
