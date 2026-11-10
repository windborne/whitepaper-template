# Validation and review

The renderer waits for bundled fonts, applies the chosen settings, and resolves contents page numbers against PDF destinations until the numbers stabilize. It fails for missing destinations, nonconverging pagination or an oversized figure, table row or equation. It does not claim to judge every editorial page break.

## Repeatable checks

```sh
PYTHON=.venv/bin/python npm run check
PYTHON=.venv/bin/python npm run build
pdftoppm -r 120 -png conop.pdf preview/conop
```

Create `preview/` before rendering page images. `npm run check` opens its own loopback test server on port 18743. It checks five documents at 1500, 1264, 1101, 1100, 768 and 390px; internal links; one/two-column heading inclusion; settings; bylines; footer wording; keyboard lightbox/focus return; print visibility; matching print CONTENTS/REFERENCES typography; and a custom-settings export opening an actual PDF in a new viewer tab. It also verifies that cross-origin export requests, invalid options and repository-internal file requests are rejected.

The structural checker uses Python's standard library and checks JSON metadata, duplicate IDs, internal anchors and image alt text. It intentionally does not police prose by a keyword blacklist.

## Stress fixture

`stress-report.html` is a synthetic long technical report, not a second research publication. It covers six named example authors with long titles, nested headings, a sum/fraction/root equation, a labelled chart, 64 synthetic table rows, repeated table headers, long identifiers, an appendix and 12 reference/audit entries. The specimen adds a grouped table header, qualitative status symbols, hatching, dimensions, an enlarged detail, a raster field, lists, code and a worked example. The CONOP remains the real-content application.

Before release, inspect all rendered pages and verify:

- Every synthetic table record appears once in order, including the first/last record on each continuation page; each continuation has its header.
- Figure and table labels remain readable at actual print size. Mathematical operators and status symbols render correctly.
- Text remains inside margins, captions remain attached to figures, and no heading is stranded.
- Contents page numbers agree with actual section destinations, including references. No PDF contents block appears in web reading mode.
- Confidential first-page notice, short subsequent footer and page numbers match the configuration. Public adds no distribution footer wording.
- Static publication's PDF matches its baked settings and its View PDF works without the export server.
- Source facts, caveats, tables, figures and references survive any restyling. Any unresolved sparse page or source issue is recorded rather than concealed.

The original and blog-like reference treatments are preserved. Their old typography rules and checkers do not define the current system.

## Verified checkpoint — November 9, 2026

Current default builds: starter and working article 1 page each, specimen 5 pages, supplied CONOP 6 pages and synthetic long report 7 pages. All 64 inventory records were verified in order with repeating headers; all four PDFs passed text-bound checks. The CONOP's normalized article and abstract text, including tables, captions and references, match the supplied design-checkpoint source. The small print REFERENCES label matches CONTENTS. The full interaction/export checks and skill validator passed. A static publication was tested with a custom category, Public distribution, three detailed authors, shaded abstract and one-column contents.

Every page was rendered for visual review. The CONOP still has space before its large concept diagram because the figure and caption remain together; no whole-section keep is involved. The CONOP currently ends with a short references-only sixth page after missing table labels were added. This is a remaining copy-fitting opportunity, not a forced section break; preserve the source content and body typography when refining it. Each new manuscript still needs a page-by-page review.

Settings persistence is tested on a disposable draft: saving and reopening, preserving all article content and author records, discarding unsaved changes, escaping custom labels, detecting stale-tab conflicts, rejecting invalid or cross-origin writes, and refusing to save published reader files. The first-run route and the three Lucide icons are also checked.

Reader preview is checked as a separate tab: it carries unsaved choices, hides editor controls, and leaves the original editor URL and unsaved state intact. Settings help is checked on hover, keyboard focus, Escape and touch.

Lightbox resizing checks cover raster and SVG artwork while an open dialog shrinks and expands from 320px to 1500px. They verify aspect ratios and that the image, caption and close control stay within the dialog without horizontal overflow.

Print figure preflight is tested at the actual Letter content width. A synthetic portrait verifies the opt-in 3in square/portrait photo ceiling and side caption; an uncapped tall chart still renders, and a 70-row table spans pages with every row present once and repeated headers.

Optional labels are tested for conditional controls, mutually exclusive metadata, safe free text, save/reload, reader preview and generated PDF output. Prepared for is omitted from footers. Legacy category links remain supported; long event names wrap on narrow screens.

The opt-in portrait photo is checked in equal print columns with a centered image and bottom-aligned caption. Web checks cover its compact centered layout and responsive side caption, plus whole-image lightbox fitting at desktop, mobile portrait and mobile landscape sizes. Scientific figures retain their separate sizing.

For a source-document conversion, inventory every section, table, figure, caption, note and reference before formatting. Compare text and numeric table values independently against the source; check ligatures, subscripts and cross-page paragraph joins. Do not present selected-excerpt tests as complete documents. Update all internal references when renumbering.

Caption checks cover separate figure/table sequences, explicit-label preservation, missing labels, Appendix A/B counters, repeated normalization, removal of blanket italics and preservation of selective emphasis. They also verify numbered References/appendix contents entries and private review tabs at mobile widths.

Custom footer checks cover recommended wording, a complete first-page override, clearing back to the recommendation, independence from Distribution, save/reload, reader preview, input validation and mobile layout. Verify custom wording appears only on the first PDF page and at the web article end, with standard short footers on later PDF pages.
