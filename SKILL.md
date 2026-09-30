---
name: document-typesetting
description: Write and typeset papers, whitepapers, reports and memos as print-quality PDFs in a restrained grayscale house style. Use when asked to produce a document meant to be read as a PDF or on paper.
---

# Document typesetting

This guide tells you, the AI, how to produce a document that looks like a careful person designed and wrote it. The documents are written in plain HTML, styled by `style.css`, and printed to PDF with headless Chrome by `build.sh`. `specimen.html` shows every style once; `examples/` has a complete document to copy from.

Read the whole guide before starting. The rules are short because each one matters.

## 1. Workflow

1. **Settle the content first.** Know who reads the document, what they should do after reading it, and the three or four points that get them there. Write those down before any HTML.
2. **Pick the document type** (section 3) and lay out its sections.
3. **Write the HTML** in one file next to `style.css`, starting from `examples/whitepaper.html` or `specimen.html`. Use only the classes listed in the README. Do not add a `<style>` block unless the document truly needs something the stylesheet lacks, and then keep it to a few lines in the same grays and weights.
4. **Build:** `./build.sh my-document.html`. This writes the PDF and page images in `preview/`.
5. **Look at every page image.** Not the HTML, the pages. Check the list in section 11. Fix, rebuild, look again. Expect three or more rounds.
6. **Run the checker:** `python3 check.py my-document.html`. Fix everything it reports, or say why a report is wrong.
7. **Hand over** the PDF and the HTML together. The HTML is the editable source.

## 2. The look

The target is a well-made engineering report or a university press book, not a web page or a slide deck.

- **Grayscale only.** Black ink (`#111`), grays from the stylesheet (`#333`, `#555`, `#777`, `#bbb`, `#d9d9d9`, `#e6e6e6`), and white. No color anywhere, including charts, links and icons. A distinction that needs color should use line weight, dash pattern, hatching or a direct label instead.
- **Two type families.** Source Serif 4 for body text, headings and captions. Source Sans 3 for tables, figure labels, the title block meta line and footers. Source Code Pro for code. Nothing else.
- **Sizes are fixed by the stylesheet.** Body 9.4 pt justified and hyphenated; h1 19 pt; h2 10.6 pt bold; h3 body size bold; h4 body size italic; captions and notes 8 pt. Never set a font size inline.
- **Rules, not boxes.** Set things apart with thin horizontal rules (`.ruled`), a left rule (`.sidebar`, `blockquote`), or space. No filled panels, cards, drop shadows, rounded corners, gradients or background tints behind text.
- **Emphasis is rare.** Italic for a term being defined or a title. Bold only for list lead-ins and caption labels. No bold phrases scattered through paragraphs, no underlines, no all-caps sentences.
- **No decoration.** No emoji, icon fonts, clip art, stock photos, decorative dividers, "key takeaway" callouts or pull quotes that repeat the text.

## 3. Document types and their structure

Every document opens with the `.titleblock`: the meta line (organization and document type on the left; status and date on the right, e.g. `DRAFT, SEPTEMBER 2026`), the title, an optional subtitle, and the byline. Titles say what the document is about in plain words; subtitles say what it concludes or proposes.

| Type | Length | Sections, in order |
|---|---|---|
| Whitepaper | 4 to 12 pages | Summary; the problem and why now; the approach; evidence or results; cost, risks and limits; what we propose or ask; notes |
| Technical report | 6 to 30 pages | Summary; background; method; results; discussion and limits; conclusion; references; appendices |
| Concept of operations | 4 to 15 pages | Summary; mission need; concept overview figure; how it is used, step by step; roles and interfaces; requirements or assumptions; schedule and next steps |
| Memo or note | 1 to 3 pages | No section numbers. First paragraph states the conclusion or the ask. Then support, then next steps. |
| Impact or results report | 3 to 10 pages | Summary with the headline numbers; what was measured and how; results by case; caveats; what changes because of it |

Rules that apply to all of them:

- **Summary first.** A `.summary` paragraph or two directly under the title block, saying the conclusion, the key number and the ask. A reader who stops there should have the point.
- **Number sections** (`<span class="n">1</span>`) in anything longer than three pages. Section titles are short noun phrases in sentence case: "Launch cadence", not "Understanding Launch Cadence: Key Considerations".
- **Headings go no deeper than h3** in most documents. If you need h4 often, the section should be split.
- **No "Introduction" that restates the title** and no "Conclusion" that restates the summary. End with what happens next.
- **Appendices** hold material a specialist needs and a decision-maker does not: derivations, full tables, test logs. Use `<section class="appendix">` so each starts on a new page, and letter them: "Appendix A. Derivation of the drift model", with sections A.1, A.2.

## 4. Writing voice

Write the way a senior engineer writes to a respected colleague: plain, specific, and sure of what is known and what is not.

- **Lead with the claim.** Each paragraph opens with its point; the rest supports it.
- **Be specific.** Numbers with units, named systems, dates, sources. "Cut forecast error by 11 percent over 40 days of trials" beats "significantly improved accuracy".
- **Short words, varied sentences.** Mostly short sentences, some long ones where the idea needs it. Active voice. Say "we" for the authoring organization.
- **Paragraphs over bullets.** Use a list only for items that are truly parallel: steps, requirements, options. Never turn an argument into bullets. Lists of two items belong in a sentence.
- **State limits plainly.** Say what was not tested, what is estimated and what is illustrative. Mark illustrative figures "Notional."
- **Numbers in text:** numerals for all measurements and for counts of 10 and above, with a non-breaking space between number and unit (`12&nbsp;km`). Thousands separators on numbers of five or more digits. Use the true minus sign (−) and en dash for ranges (4–6 km). Percent in running text as "percent" or `%` consistently.
- **Punctuation:** curly quotes and apostrophes, en dashes for ranges. Use em dashes rarely; at most one pair per page. A comma, colon, parentheses or a new sentence usually works better.

### Avoiding AI tells

Readers now spot machine-written text quickly and discount it. Remove these on sight:

- **Stock phrases:** delve, leverage (as a verb), robust, seamless, cutting-edge, game-changer, unlock, empower, harness, landscape, realm, tapestry, navigate (figuratively), pivotal, crucial, paramount, holistic, synergy, "in today's fast-paced world", "it's worth noting", "it is important to note", "plays a vital role", "a testament to", "at the end of the day", "in conclusion".
- **Structures:** "It's not just X, it's Y." "Whether you're A or B…" Rule-of-three lists used for rhythm rather than content. A closing sentence that sums up the paragraph it ends. Rhetorical questions as section openers. Colon-split headings ("Scale: Why It Matters").
- **Formatting habits:** bold phrases inside paragraphs, bullets with bold lead-ins where prose would do, emoji, headings on every paragraph, title case everywhere, many em dashes.
- **Hedging and inflation:** stacked qualifiers ("potentially could help to"), and praise words (innovative, powerful, revolutionary, unprecedented) standing in for evidence. Delete the adjective and give the number.

`check.py` flags the most common of these. Passing it is necessary, not sufficient: read the text aloud in your head and cut anything a careful person would not have written.

## 5. Typography details

- Body text is justified with hyphenation; headings, captions, tables and notes are ragged right. The stylesheet handles this.
- Keep a heading with the paragraph after it (`break-after: avoid` is set). Never leave a heading or a single line at the bottom of a page, or a single line at the top.
- Use real small caps (`.smallcaps`) for acronyms of four or more letters only if the document is dense with them; otherwise set acronyms as normal capitals. Spell out an acronym at first use unless every reader knows it.
- One space after periods. No double line breaks for spacing; use the stylesheet's margins.
- Run-in labels (`.runin`) for a short series of paragraphs that each discuss one named item.

## 6. Tables

- Booktabs rules only: heavy rule above the header, light rule below it, hairlines between rows, heavy rule at the end. No vertical rules, no shaded rows, no boxed cells.
- Numbers right-aligned in `td.num` with the same number of decimals down a column. Units go in the column header, not in every cell.
- Captions go below the table: `<caption><b>Table 2.</b> Sentence describing what the table shows and what to notice.</caption>`.
- Harvey balls (see the specimen) for qualitative ratings, with a `.legend`. Never check marks, crosses or colored dots.
- Keep short tables on one page (`class="keep"`). A table longer than a page gets its header repeated automatically; do not split it by hand.

## 7. Figures and diagrams

Every figure is inline SVG drawn to the conventions below, so it prints sharp and stays editable. Treat figure drawing as drafting, not illustration.

**Canvas.** `viewBox` width 700 for a full-width figure. On a letter page one user unit then prints at about 0.71 pt, so a label of 8.6 prints at about 6 pt; all sizes below are in user units. A half-width figure uses a viewBox about 340 wide so its type prints at the same size. Set `font-family="'Source Sans 3', sans-serif"` on the `<svg>`. Leave no empty band above or below the drawing: fit the viewBox to the content.

**Line weights** (stroke-width in user units), each with one job:

| Weight | Use |
|---|---|
| 0.4 | Hairlines: leader lines, dimension and extension lines, grid ticks, hatching (0.5) |
| 0.7–0.8 | Outlines of boxes and parts, axes, connectors |
| 1.0–1.2 | Section outlines, emphasized part edges |
| 1.5–1.6 | The one thing the figure is about: the main curve, the key block |

Dashed (`4 3`) for return paths, future or planned items; dotted (`1.5 3`, gray `#888`) for reference lines; dash-dot (`10 2.5 2 2.5`, 0.4–0.5) for center lines.

**Fills.** White, `#e6e6e6` or `#d9d9d9` for a second material or a region, 45° hatching (`pattern` with 0.5 lines at 5 units) for a cut surface or a distinguished region. At most three fill levels in one figure.

**Type in figures.** Labels 8–8.6, secondary text 8 in `#555`, panel titles 8.6 bold capitals with 0.5 letter spacing: "(a) LAUNCH SITE LAYOUT". Italic `#333` for annotations. Nothing smaller than 7.4. Sentence case for labels.

**Shapes and connectors.** Square corners. Open chevron arrowheads for flow (`marker` path `M0 1 L9 5 L0 9`, stroke 1.4, no fill); filled triangular arrowheads only on dimension lines. Connectors run horizontal and vertical with right-angle turns, never diagonal across the figure. Align boxes on a grid; equal sizes for equal-rank items.

**Labels.** Label things directly, next to the thing or on a thin leader line with a short horizontal shoulder (`M x y L x2 y2 H x3`). Avoid legends; use one only when direct labels would collide. No numbered keys that send the reader to the caption.

**Charts.** Axes 0.7 with outward ticks and labeled units; no gridlines, or very light ones (`#ddd`, 0.3) only when readers must read values. The data series is the heaviest line. Uncertainty as a gray band, observations as open circles, a reference level as a dotted gray line, all labeled directly. Start the value axis at zero for bars. No 3-D, no pie charts, no dual axes. Mark illustrative data "Notional." above the plot area.

**Diagrams.** A block diagram shows one idea: flow left to right or top to bottom, one heavier outline on the component the text is about, a dashed return path for feedback. A concept or CONOP figure can combine a simple side-view line drawing (terrain line, vehicle silhouettes as outlines) with numbered step markers that the text refers to in order.

**Captions.** Below the figure: `<b>Figure 3.</b>` then one or two sentences that say what the figure shows and what to notice, as a full sentence. The caption does not repeat the panel titles. Refer to every figure in the text before it appears ("Figure 3 shows…"), and number figures in order of first mention.

**Placement.** A figure sits after the paragraph that first cites it, or at the top of the next page. It never splits (`break-inside: avoid` is set). Two small related figures go side by side in `.figrow`.

## 8. Images, equations, code

**Photographs and screenshots.** `<figure><img src="…" alt="…"></figure>`. The stylesheet renders them in grayscale; check they still read that way. Crop tight to what matters. Add leader-line labels by overlaying an SVG in the same figure, not by drawing on the image in an editor. Use at least 200 dpi at printed size. Never use an image of text, a table or a chart that could be drawn.

**Equations.** Display equations use MathML inside `.eq`, numbered at the right:

```html
<div class="eq"><math display="block">…</math><span class="eqn">(1)</span></div>
```

Refer to them as "equation (1)". Define every symbol in the sentence after the equation, with units. Inline, set variables in italic (`<i>v</i>`) and keep inline math simple; anything with a fraction or sum goes on its own line.

**Code.** Inline names of commands, files and fields in `<code>`. Blocks in `<pre>`, at most about 20 lines; longer listings go in an appendix. No syntax coloring. Show only what the reader needs to run or understand.

## 9. Citations and notes

- Cite with note markers, `<sup class="fn">1</sup>`, after the punctuation of the sentence, and list sources in `.notes` at the end of the document (or of each appendix).
- Note format: Author or Organization, "Title," *Publication or Venue*, identifier, date. Add a URL only when the source is public and stable.
- Each factual claim that a reader could question gets a source or is labeled as an estimate. Never invent a source, a number, a quote or a name. If a fact is missing, leave a visible `[TK: what is needed]` placeholder and say so when handing over.
- Explanatory notes are allowed but rare. If a note is longer than two lines, it belongs in the text or an appendix.

## 10. Page layout

- Letter size by default (edit `@page` for A4). Set the footer text in `@page` to the document's short title and organization. The first page has no footer.
- Fill pages. A last page that holds fewer than five lines should be pulled back by tightening text, not by shrinking type.
- Use `.pagebreak` only to start an appendix or a major part; let everything else flow.
- Side-by-side layouts (`display:flex` with small gaps) are fine for two short lists or two small figures. Do not build multi-column page layouts.

## 11. Before handing over

Look at every page image and confirm:

- [ ] The summary states the conclusion, the key number and the ask.
- [ ] Nothing is in color. Photos read in grayscale.
- [ ] No heading, caption or single line is stranded at a page bottom or top. No figure or table is split.
- [ ] Every figure and table is numbered in order, cited in the text before it appears, and has a caption that is a sentence.
- [ ] Figure labels do not collide with lines or each other, and nothing is clipped at the viewBox edge.
- [ ] Line weights and fills follow section 7; there are no more than three grays in a figure.
- [ ] Every number has a unit and a source or an "estimate" or "Notional." label.
- [ ] `check.py` reports nothing, or each remaining report is explained.
- [ ] The last page is reasonably full, and the footer text is set.
- [ ] Reading the text aloud, nothing sounds like a press release or a chatbot.
