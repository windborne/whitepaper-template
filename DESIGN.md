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

Use left-aligned text. The main web reading column is 660px, with generous gutters between the navigation and caption rails. Print uses US Letter with .68in top, .8in side and .70in bottom margins. Text remains slightly narrower than the figure/table area. Fonts are bundled in `fonts.css`; no network font request is needed.

Use restrained near-black ink, muted gray text, light rules and white space. A light abstract tint is optional. Avoid cards, pills, decorative shadows and arbitrary font sizes inside the article. Meaningful charts and photographs may preserve color; use pattern, line style and direct labels so meaning does not depend on color alone.

## Document configuration

Each HTML includes a `script` with `id="document-config"` and `type="application/json"`:

```json
{
  "authors": [{"name": "Author Name", "title": "Research scientist", "organization": "WindBorne"}],
  "organization": "WindBorne Systems",
  "defaults": {"abstract": "plain", "contents": "two", "details": "title", "category": "", "distribution": "Confidential"}
}
```

Use `plain` or `shaded`; `none`, `one` or `two` for contents; `none` (name only), `title`, `organization` or `full` for author details. Blank category or distribution means None. Escape JSON correctly, including `<` as `\u003c` if it occurs in a value inside the script element. Organization is configurable; the WindBorne web logo remains a brand asset and is not a license to imply affiliation.

The editable metadata date is abbreviated, e.g. `Sep. 23, 2026` or `Sep. 2026`. Do not reformat dates inside source quotations or reference titles.

## Optional treatments

Settings are ordered alphabetically: Abstract background, Author details, Category (optional), Distribution (optional), PDF table of contents. The specimen also has Example authors for demonstration. Below the options, Save settings (Lucide save) persists changes in this document’s HTML. It is disabled until settings change, reports Saved on success and keeps unsaved choices visible on failure. The top bar uses View PDF (Lucide file-text) and Document settings (Lucide pencil-line).

- Authors: singular label for one author; plural for several. Name-only uses comma-separated names. Any title/organization details put each author on a separate line. Without optional fields the metadata uses a 50/50 split, or about 70/30 for a long byline.
- Category: None, Research Paper, Technical Report, Concept of Operations, Case Study, White Paper, Analysis, Proposal, or a custom label (80 characters maximum).
- Distribution: None, Public, Internal, Proprietary, Confidential. Public appears in metadata but adds no footer wording. None hides the metadata field. Internal becomes “Internal use only.” in the footer; Proprietary becomes “Proprietary information.”; Confidential stays “Confidential.”
- Footer: `WindBorne Systems. [Category.] [Distribution wording.]` The first page has no page number. A confidential first page adds “For authorized recipients only. Do not copy or distribute without WindBorne Systems’ permission.” Subsequent pages have the short footer and page number.
- Abstract background: off by default; on uses a pale tint without changing the text measure. No visible Summary or Abstract heading is added.
- PDF contents: None; One column (headers and subheaders); Two columns (headers only). Enabling contents from None turns abstract shading off; a subsequent manual choice can restore it. Changing between enabled layouts preserves that manual choice.

## Web and print

| Component | Web | PDF |
|---|---|---|
| Header bar | White, blog logo link, View PDF | Hidden |
| Editing controls | Local editor or `?mode=edit`; hidden in `?mode=public` | Hidden |
| Navigation | Sticky numbered sidebar; collapsible on mobile | Optional opening contents |
| Captions | Right rail on desktop; below on small screens | Below each figure or table |
| Figures | Click/tap or keyboard opens native dialog; Escape closes | Inline vector/image with caption |
| References | Linked markers and return links | Small mono REFERENCES label, source links retained; return arrows hidden |
| Body | Continuous page | Natural page flow with repeated table headers |

The one-column contents puts CONTENTS to the left of the detailed list. The two-column layout puts the label above, reads down the left then down the right, and omits subsections. Both have flush-aligned titles, smaller matching serif section numbers and right-aligned mono page numbers. Neither uses dotted leaders or row rules. The two-column number-to-title gap is tighter. Contents precedes the abstract; the first section follows without a forced page break.

## Component markup

Copy actual components from `specimen.html`, replacing all illustrative content.

- Figures: `figure` containing a `button.figure-art` with SVG or an image and a sibling `figcaption`. Give the button an accessible label and the graphic an accessible title/description or alt text. Captions use a bold figure label followed by a full sentence. Use unique SVG IDs per figure. The lightbox namespaces IDs in its copy.
- Tables: `.table-block > .table-wrap > table` with `thead`, `tbody`, scoped `th` cells, and a native `caption`. The web side caption is generated from the native caption. Use `.num` for numeric alignment. `.caption-below` keeps a desktop caption below when needed. Notes/legends remain beneath the table.
- Equations: `.eq` with MathML and optional `.eqn`. Define variables and units nearby. Split long derivations into separate display equations rather than one oversized flex container.
- References: `.notes` containing `h2#references` and an ordered list. Each reference has an ID; a `sup.fn` marker links to it. Give the marker an ID for the reference's `.ref-back` link. Keep links meaningful without relying on color.
- Examples: `.example` with `.lbl` and normal paragraphs. The label stays with the following text; the full example may break.
- Code: `pre > code`, no syntax-color dependency; long code wraps. Appendices use `.appendix` and normal headings.

Use thin horizontal table rules, no vertical cell borders, aligned numbers with consistent precision and units in headers. A qualitative Harvey-ball scale needs a text key. Figure vocabulary includes hatching, dimensions, callouts/detail views, line-weight hierarchy, direct chart labels and uncertainty bands; the specimen demonstrates these without imposing a scientific meaning.

## Pagination contract

Ordinary figure/caption units, table rows, equations and contents rows stay intact. Headings keep with the next content. Paragraphs and list items have three-line widow/orphan protection. Tables split between rows and repeat their headers. Whole sections, tables, abstracts, contents lists, examples and appendices are not forced onto one page. There are no automatic appendix page breaks or chained keeps around figures/equations.

An element taller than the available page cannot be kept intact; the renderer detects oversized figures, rows and equations and requests a structural fix. Reduce excess drawing canvas, simplify or divide the material. Never clip, hide, or shrink the entire report to fit. Inspect every final page because text length, figures and long references can still produce sparse endings.

## First-run editor

The local editor starts at `article.html?mode=edit`, with the starter copy preloaded in Article and the component specimen under Template. The CONOP remains a separate worked example. When editing a differently named draft, Template links back to that same Article. Settings save into the editable source, while PDF viewing always reflects the current controls. Static published readers hide editing controls and link their matching PDF.

Settings help is limited to PDF table of contents, Distribution and Save settings. Info buttons expose short explanations on hover, keyboard focus or tap; Escape dismisses help before closing the panel.
