---
name: document-typesetting
description: Write and typeset papers, whitepapers, reports and memos as print-quality PDFs in a restrained grayscale house style. Use when asked to produce a document meant to be read as a PDF or on paper.
---

# Document typesetting

This guide tells you, the AI, how to produce a document that looks like a careful person designed and wrote it. The documents are written in plain HTML, styled by `style.css`, and printed to PDF with headless Chrome by `build.sh`. `specimen.html` shows every style once; `examples/` has a complete document to copy from.

Read the whole guide before starting. The rules are short because each one matters. Tell the person you are following this guide, and name any part you choose not to follow and why.

The visual rules apply to documents meant to be read as pages: papers, whitepapers, reports, memos, one-pagers, and the figures in them. Do not apply them to web apps, dashboards or slides unless asked. The writing rules apply anywhere.

## 1. Workflow

1. **Settle the content first.** Know who reads the document, what they should do after reading it, and the three or four points that get them there. Write those down before any HTML.
2. **Pick the document type** (section 3) and lay out its sections.
3. **Write the HTML** in one file next to `style.css`, starting from `examples/whitepaper.html` or `specimen.html`. Use only the classes listed in the README. Do not add a `<style>` block unless the document truly needs something the stylesheet lacks, and then keep it to a few lines in the same grays and weights.
4. **Build:** `./build.sh my-document.html`. This writes the PDF and page images in `preview/`.
5. **Look at every page image.** Not the HTML, the pages. Check the list in section 11. Fix, rebuild, look again. Expect three or more rounds.
6. **Run the checker:** `python3 check.py my-document.html`. Fix everything it reports, or say why a report is wrong.
7. **Hand over** the PDF and the HTML together. The HTML is the editable source.

**Rebuilding an existing document.** When the person hands you a finished PDF or slide-styled report to redo in this style:

- Extract the full text first and keep every fact, number and caveat. Cut words, not content.
- Turn every image of a table into a real table, and a row of stat tiles or a "validated today / tomorrow" graphic into a small table. Redraw every chart you have the numbers for as SVG. A chart whose data you do not have (a time series drawn in a dashboard, for example) stays as an image, and you say that it should be redrawn from the data.
- Keep photographs and scientific maps as images.
- Do not reconcile numbers that disagree between the text and the figures, and do not fill in missing sources. List each one when you hand over, and leave a `[TK]` where a source is missing.
- Drop the separate cover page, the logo and any legal boilerplate. The title block and the summary go on page one with the text.

## 2. The look

The target is a well-made engineering report or a university press book, not a web page or a slide deck.

- **Grayscale by default.** Black ink (`#111`), grays from the stylesheet (`#333`, `#555`, `#777`, `#bbb`, `#d9d9d9`, `#e6e6e6`), and white. Text, rules, tables, links and icons are never colored. A distinction in a figure should come from line weight, dash pattern, hatching or a direct label before it comes from color.
- **One accent, for the subject.** A figure may use the accent (`var(--accent)`, with `var(--accent-2)` as its tint) for the one thing the document is about, such as our own sensors on a map, the proposed program among its comparisons, or the measured series against the reference. The same meaning throughout the document, never a second hue, and never for decoration or emphasis in text.
- **Photographs keep their color.** A photo of the real thing, such as a balloon against the sky, is printed as it is. Screenshots and other people's charts are grayscale unless color carries meaning.
- **More color only when asked or needed.** If the person asks for color, or a reader could not read the figure without it (a color map, a many-series chart), use a small ordered palette and say so in the caption. Keep the rest of the document grayscale.
- **Two type families.** Newsreader for body text, headings and captions. IBM Plex Sans for tables, figure labels, the title block meta line and footers. IBM Plex Mono for code. Nothing else.
- **Sizes are fixed by the stylesheet.** Body 9.4 pt justified and hyphenated, h1 19 pt, h2 10.6 pt bold, h3 body size bold, h4 body size italic, captions and notes 8 pt. Never set a font size inline.
- **Rules, not boxes.** Set things apart with thin horizontal rules (`.ruled`), a left rule (`.sidebar`, `blockquote`), or space. No filled panels, cards, drop shadows, rounded corners, gradients or background tints behind text.
- **Emphasis is rare.** Italic for a term being defined or a title. Bold only for list lead-ins and caption labels. No bold phrases scattered through paragraphs, no underlines, no all-caps sentences.
- **No decoration.** No emoji, icon fonts, clip art, stock photos, decorative dividers, "key takeaway" callouts or pull quotes that repeat the text.

## 3. Document types and their structure

Every document opens with the `.titleblock`: the meta line (organization and document type on the left, status and date on the right, e.g. `DRAFT, SEPTEMBER 2026`), the title, an optional subtitle, and the byline with name, role and organization. Titles say what the document is about in plain words. Subtitles say what it concludes or proposes.

There is no separate cover page and no logo; the organization's name in the meta line does that job. A title page that holds only a title, a date and a photo wastes the page a reader is most likely to read.

**The first page stands alone.** A reader who only sees page one should know the claim, the ask and the evidence. The pattern that works: the summary paragraph beside the strongest figure (`.opener`), a short numbered list with bold lead-ins of what the reader gets, a run-in paragraph on the ask or the program, and a small table of today against what we are building toward. Sections start on page two.


| Type | Length | Sections, in order |
|---|---|---|
| Whitepaper | 4 to 12 pages | Summary; the problem and why now; the approach; evidence or results; cost, risks and limits; what we propose or ask; notes |
| Technical report | 6 to 30 pages | Summary; background; method; results; discussion and limits; conclusion; references; appendices |
| Concept of operations | 4 to 15 pages | Summary; mission need; concept overview figure; how it is used, step by step; roles and interfaces; requirements or assumptions; schedule and next steps |
| Memo or note | 1 to 3 pages | No section numbers. First paragraph states the conclusion or the ask. Then support, then next steps. |
| Impact or results report | 3 to 10 pages | Summary with the headline numbers; what was measured and how; results by case; caveats; what changes because of it |

Rules that apply to all of them:

- **Summary first.** A `.summary` paragraph or two directly under the title block, saying the conclusion, the key number and the ask. A reader who stops there should have the point.
- **Number sections** (`<span class="n">1</span>`) only when the text refers to them by number. Otherwise leave headings plain. Section titles are short noun phrases in sentence case: "Launch cadence", not "Understanding Launch Cadence: Key Considerations".
- **Headings go no deeper than h3** in most documents. If you need h4 often, the section should be split.
- **No "Introduction" that restates the title** and no "Conclusion" that restates the summary. End with what happens next or with the open question, never with a recap.
- **Subsections** are numbered 2.1, 2.2 when the sections are numbered. Below that, use italic run-in labels (`.runin`) on paragraphs rather than a fourth heading level.
- **Appendices** hold material a specialist needs and a decision-maker does not: derivations, full tables, test logs, where we are today, notes on sizing. Open them with `<section class="part"><h1>Appendices</h1>` and give each its own `<section class="appendix">` and a lettered h2: "Appendix A. Why it has to be a weather program". The body text refers to them by letter.

## 4. Writing voice

Write the way a senior engineer writes to a respected colleague: plain, specific, and sure of what is known and what is not.

- **Lead with the problem.** Open the document with the problem or a direct question, and state the claim early. Each paragraph opens with its point and the rest supports it.
- **One concrete example.** Explain a hard idea with a single analogy or worked example, and name the real people, tools and numbers involved. Use the reader's own vocabulary for the problem, and where a citable source states it, their own words.
- **Name things once.** When a concept needs a name, define it once in plain words and use that name consistently.
- **Say what you think.** State opinions and recommendations directly. Say plainly what is unknown, unproven, or planned rather than done.
- **Be specific.** Numbers with units, named systems, dates, sources. "Cut forecast error by 11 percent over 40 days of trials" beats "significantly improved accuracy".
- **Short sentences, short paragraphs.** A few sentences per paragraph. Use a period where a semicolon or a dash would go. Active voice. Say "we" for the authoring organization.
- **Paragraphs over bullets.** Use a list only for items that are truly parallel: steps, requirements, options. Never turn an argument into bullets. Lists of two items belong in a sentence.
- **State limits plainly.** Say what was not tested, what is estimated and what is illustrative. Mark illustrative figures "Notional."
- **Numbers in text:** numerals for all measurements and for counts of 10 and above, with a non-breaking space between number and unit (`12&nbsp;km`). Thousands separators on numbers of five or more digits. Use the true minus sign (−) and en dash for ranges (4–6 km). Percent in running text as "percent" or `%` consistently.
- **Punctuation:** curly quotes and apostrophes, en dashes for ranges. No em dashes. A comma, parentheses or a new sentence does the job.

### Avoiding AI tells

Readers now spot machine-written text quickly and discount it. Remove these on sight:

- **Stock phrases:** delve, leverage (as a verb), robust, seamless, cutting-edge, game-changer, unlock, empower, harness, landscape, realm, tapestry, navigate (figuratively), pivotal, crucial, paramount, holistic, synergy, "in today's fast-paced world", "it's worth noting", "it is important to note", "plays a vital role", "a testament to", "at the end of the day", "in conclusion".
- **Structures:** catchy slogans. "It's not just X, it's Y." "Whether you're A or B…" Reflexive groups of three, used for rhythm rather than content. A closing sentence that sums up the paragraph it ends. Rhetorical questions as section openers. Colon-split headings ("Scale: Why It Matters").
- **Formatting habits:** bold phrases inside paragraphs, bold lead-ins on every paragraph, emoji, headings on every paragraph, title case everywhere, em dashes.
- **Visual tells:** colored pills, tags and status chips. Numbered badges or icons beside headings. Stat tiles, KPI rows and big numbers standing alone. Three matching cards in a row. Gradients, rounded shaded panels and drop shadows. Decorative icons and crossed-out icons.
- **Hedging and inflation:** stacked qualifiers ("potentially could help to"), and praise words (innovative, powerful, revolutionary, unprecedented) standing in for evidence. Delete the adjective and give the number.

`check.py` flags the most common of these. Passing it is necessary, not sufficient: read the text aloud in your head and cut anything a careful person would not have written.

## 5. Typography details

- Body text is justified with hyphenation. Headings, captions, tables and notes are ragged right. The stylesheet handles this.
- Keep a heading with the paragraph after it (`break-after: avoid` is set). Never leave a heading or a single line at the bottom of a page, or a single line at the top.
- Use real small caps (`.smallcaps`) for acronyms of four or more letters only if the document is dense with them; otherwise set acronyms as normal capitals. Spell out an acronym at first use unless every reader knows it.
- One space after periods. No double line breaks for spacing. Use the stylesheet's margins.
- Run-in labels (`.runin`) for a short series of paragraphs that each discuss one named item.

## 6. Tables

- Booktabs rules only: heavy rule above the header, light rule below it, hairlines between rows, heavy rule at the end. No vertical rules, no shaded rows, no boxed cells.
- Numbers right-aligned in `td.num` with the same number of decimals down a column. When a column spans orders of magnitude (0.28 next to 0.0007), give every value the same number of significant figures instead, and never add digits the source does not have. Units go in the column header, not in every cell.
- Group related columns under a spanning header (`<th colspan="2">Impact per 1,000 units (%)</th>` over `24 h` and `72 h`) instead of repeating the unit in each header.
- Captions go below the table: `<caption><b>Table 2.</b> Sentence describing what the table shows and what to notice.</caption>`.
- Harvey balls (see the specimen) for qualitative ratings, with a `.legend`. Never check marks, crosses or colored dots.
- Keep short tables on one page (`class="keep"`). A table longer than a page gets its header repeated automatically; do not split it by hand.

## 7. Figures and diagrams

Every figure is inline SVG drawn to the conventions below, so it prints sharp and stays editable. Treat figure drawing as drafting, not illustration.

**Canvas.** `viewBox` width 700 for a full-width figure. On a letter page one user unit then prints at about 0.71 pt, so a label of 8.6 prints at about 6 pt; all sizes below are in user units. A half-width figure uses a viewBox about 340 wide so its type prints at the same size. Figure text is IBM Plex Sans; the stylesheet sets it on every `<svg>` inside a `<figure>`. Leave no empty band above or below the drawing: fit the viewBox to the content.

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

**Charts.** Axes 0.7 with outward ticks and labeled units; no gridlines, or very light ones (`#ddd`, 0.3) only when readers must read values. The data series is the heaviest line. Uncertainty as a gray band, observations as open circles, a reference level as a dotted gray line, all labeled directly. Start the value axis at zero for bars. No 3-D, no pie charts, no dual axes. Mark illustrative data "Notional." above the plot area. When a chart mixes measured points with a notional curve, draw the measured points as markers, the notional curve dotted, and say which is which in the figure note: "Points are measured. The curve is notional."

**Diagrams.** A block diagram shows one idea: flow left to right or top to bottom, one heavier outline on the component the text is about, a dashed return path for feedback. Show one example of each thing, not several. A concept or CONOP figure can combine a simple side-view line drawing (terrain line, vehicle silhouettes as outlines) with numbered step markers that the text refers to in order. Add "Not to scale." in small italic when proportions are schematic.

**Real objects.** Draw what the reader recognizes from their own work. For a balloon, an aircraft, an antenna or a building, trace a reference such as a public-domain three-view drawing from Wikimedia Commons rather than approximating it freehand. Add enough detail to be recognizable, then stop. When downloading a reference, use a generic identifier in the request and never a person's name or email address.

**Captions.** Below the figure: `<b>Figure 3.</b>` then one or two sentences that say what the figure shows and what to notice, as a full sentence. The caption does not repeat the panel titles. Refer to every figure in the text before it appears ("Figure 3 shows…"), and number figures in order of first mention.

**Placement.** A figure sits after the paragraph that first cites it, or at the top of the next page. It never splits (`break-inside: avoid` is set). Two small related figures go side by side in `.figrow`, which never splits across pages. When the two are images of different shapes, set each figure's `flex` to its image's width divided by its height (`<figure style="flex:1.09">` beside `<figure style="flex:1.78">`) so both print at the same height and the captions line up. A tall, narrow figure such as a plan-view map goes in `figure.right`, floated with the text running beside it. Small multiples (the same map at four densities, panels a to d) share one `.figrow` and one caption.

**Figure notes.** A short italic line under the drawing, `<div class="note">`, carries the view and the status: "Plan view. Notional.", "Not to scale.", "Dimensions in millimeters." On a notional chart say what would make it real: "Notional. To be measured in the first demonstration."

**One size for figure text.** Every figure in a document uses the same label size (8.6 at viewBox 700) and the same secondary size (8). A figure that needs smaller type to fit has too much in it: split it, or move detail to a table.

## 8. Images, equations, code

**Photographs and screenshots.** `<figure><img src="…" alt="…"></figure>`. Photographs print in color. Add `class="gray"` to print a screenshot or a borrowed chart in grayscale, and check it still reads. A chart with a dark background cannot be fixed with a filter: redraw it from its data, or keep it and say it needs redrawing. Crop tight to what matters. Add leader-line labels by overlaying an SVG in the same figure, not by drawing on the image in an editor. Use at least 200 dpi at printed size. Never use an image of text, a table or a chart that could be drawn.

**Equations.** Display equations use MathML inside `.eq`, numbered at the right:

```html
<div class="eq"><math display="block">…</math><span class="eqn">(1)</span></div>
```

Refer to them as "equation (1)". Define every symbol in the sentence after the equation, with units. Inline, set variables in italic (`<i>v</i>`) and keep inline math simple; anything with a fraction or sum goes on its own line.

**Code.** Inline names of commands, files and fields in `<code>`. Blocks in `<pre>`, at most about 20 lines; longer listings go in an appendix. No syntax coloring. Show only what the reader needs to run or understand.

## 9. Citations and notes

- Cite with note markers, `<sup class="fn">1</sup>`, after the punctuation of the sentence, and list sources in `.notes` at the end of the document, after the appendices.
- Note format: Author or Organization, "Title," *Publication or Venue*, identifier, date. Check the original and cite its exact title, author and date, never a paraphrase from a search snippet. Add a URL only when the source is public and stable.
- Each factual claim that a reader could question gets a source or is labeled as an estimate. Never invent a source, a number, a quote or a name. If a fact is missing, leave a visible `[TK: what is needed]` placeholder and say so when handing over.
- Explanatory notes are allowed but rare. If a note is longer than two lines, it belongs in the text or an appendix.

## 10. Page layout

- Letter size by default (edit `@page` for A4). Set the footer text in `@page` to the document's short title and organization. The first page has no footer.
- Fill pages. A last page that holds fewer than five lines should be pulled back by tightening text, not by shrinking type.
- Use `.pagebreak` only to start an appendix or a major part; let everything else flow.
- When a figure lands on the next page and leaves a gap, fix it in this order: move the figure to after a nearby paragraph, float it (`figure.right`) if it is narrow, pair it with another in `.figrow`, or crop it. Do not shrink it below the size where its text reads at 6 pt.
- Side-by-side layouts (`display:flex` with small gaps) are fine for two short lists or two small figures. Do not build multi-column page layouts.

## 11. Before handing over

Look at every page image and confirm:

- [ ] The summary states the conclusion, the key number and the ask.
- [ ] No color except photographs and the one accent, and the accent means the same thing in every figure.
- [ ] No heading, caption or single line is stranded at a page bottom or top. No figure or table is split.
- [ ] Every figure and table is numbered in order, cited in the text before it appears, and has a caption that is a sentence.
- [ ] Figure labels do not collide with lines or each other, and nothing is clipped at the viewBox edge.
- [ ] Line weights and fills follow section 7, with no more than three grays in a figure.
- [ ] Every number has a unit and a source or an "estimate" or "Notional." label.
- [ ] `check.py` reports nothing, or each remaining report is explained.
- [ ] The last page is reasonably full, and the footer text is set. Note numbers of two digits are not clipped.
- [ ] Reading the text aloud, nothing sounds like a press release or a chatbot.
