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

Use restrained near-black ink, muted gray text, light rules and white space. A light abstract tint is optional. Avoid cards, pills, decorative shadows and arbitrary font sizes inside the article. Meaningful charts and photographs may preserve color; use pattern, line style and direct labels so meaning does not depend on color alone.

## Document configuration

Each HTML includes a `script` with `id="document-config"` and `type="application/json"`:

```json
{
  "authors": [{"name": "Author Name", "title": "Research scientist", "organization": "WindBorne"}],
  "organization": "WindBorne Systems",
  "defaults": {"abstract": "plain", "contents": "two", "details": "title", "label": "none", "category": "", "preparedFor": "", "distribution": "Confidential", "firstPageFooter": ""}
}
```

Use `plain` or `shaded`; `none`, `one` or `two` for contents; `none` (name only), `title`, `organization` or `full` for author details. Use `none`, `category` or `prepared-for` for `label`. Store the category in `category`, or the free text in `preparedFor` (160 characters maximum); inactive values are saved as empty strings. Blank distribution means None. Existing documents with a category and no label mode are treated as Category for compatibility. Escape JSON correctly, including `<` as `\u003c` if it occurs in a value inside the script element. Organization is configurable; the WindBorne web logo remains a brand asset and is not a license to imply affiliation.

The editable metadata date is abbreviated, e.g. `Sep. 23, 2026` or `Sep. 2026`. Do not reformat dates inside source quotations or reference titles.

## Optional treatments

Settings are ordered alphabetically: Abstract background, Author details, Distribution (optional), First-page footer (optional), Label (optional), PDF table of contents. Category or Prepared for appears immediately below Label when selected. The specimen also has Example authors for demonstration. Below the options, Save settings (Lucide save) persists changes in this document’s HTML. It is disabled until settings change, reports Saved on success and keeps unsaved choices visible on failure. The top bar uses View PDF (Lucide file-text) and Document settings (Lucide pencil-line).

- Authors: singular label for one author; plural for several. Name-only uses comma-separated names. Any title/organization details put each author on a separate line. Without optional fields the metadata uses a 50/50 split, or about 70/30 for a long byline.
- Label (optional): None, Category, Prepared for. None hides the metadata slot. Category and Prepared for are mutually exclusive.
- Category: Research Paper, Technical Report, Concept of Operations, Case Study, White Paper, Analysis, Proposal, or a custom label (80 characters maximum).
- Distribution: None, Public, Internal, Proprietary, Confidential. Public appears in metadata but adds no footer wording. None hides the metadata field. Internal becomes “Internal use only.” in the footer; Proprietary becomes “Proprietary information.”; Confidential stays “Confidential.”
- Prepared for: free text with “Conference/event name” as a placeholder, never a prefilled value. Suitable for conferences, events, organizations or audiences; omit it from the footer.
- Footer: `WindBorne Systems. [Category.] [Distribution wording.]` The first page has no page number. A confidential first page adds “For authorized recipients only. Do not copy or distribute without WindBorne Systems’ permission.” Subsequent PDF pages have the short footer and page number. The continuous web article ends with the full confidentiality notice when Distribution is Confidential; other distribution choices retain their short footer.
- Abstract background: off by default; on uses a pale tint without changing the text measure. No visible Summary or Abstract heading is added.
- PDF contents: None; One column (headers and subheaders); Two columns (headers only). Enabling contents from None turns abstract shading off; a subsequent manual choice can restore it. Changing between enabled layouts preserves that manual choice.

**First-page footer (optional)** accepts a complete custom footer (up to 400 characters), including the organization name. Blank uses the recommended distribution-based wording: Confidential includes the standard permission notice; other distributions use the short footer. Custom text replaces that recommendation on the first PDF page and at the end of the web article. Later PDF pages retain the standard organization/category/distribution footer. It is independent of Distribution: changing Distribution does not overwrite custom wording. Clear the field to return to the recommendation. Save settings persists it; View PDF and reader preview include unsaved changes. The configuration/CLI key is `firstPageFooter`.

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

The local editor starts at `article.html?mode=edit`, with the starter copy preloaded in Article and the component specimen under Template. The CONOP remains a separate worked example. When editing a differently named draft, Template links back to that same Article. Settings save into the editable source, while PDF viewing always reflects the current controls. View reader layout opens a new tab with a snapshot of those choices, preserving the editing tab. Manuscript text and metadata are edited in HTML, not in the settings panel. Static published readers hide editing controls and link their matching PDF.

Settings help covers PDF table of contents, Distribution, First-page footer and Save settings. Info buttons expose short explanations on hover, keyboard focus or tap; Escape dismisses help before closing the panel.

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
