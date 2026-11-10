# Validation and review

The renderer waits for bundled fonts, applies the chosen settings, and resolves contents page numbers against PDF destinations until the numbers stabilize. It fails for missing destinations, nonconverging pagination or an oversized figure, table row or equation. It does not claim to judge every editorial page break.

## Repeatable checks

```sh
PYTHON=.venv/bin/python npm run check
PYTHON=.venv/bin/python npm run build
pdftoppm -r 120 -png specimen.pdf preview/specimen
```

Create `preview/` before rendering page images. `npm run check` opens its own loopback test server on port 18743. It checks four documents at 1500, 1264, 1101, 1100, 768 and 390px; internal links; one/two-column heading inclusion; settings; bylines; footer wording; keyboard lightbox/focus return; print visibility; matching print CONTENTS/REFERENCES typography; and a custom-settings export opening an actual PDF in a new viewer tab. It also verifies that cross-origin export requests, invalid options and repository-internal file requests are rejected.

The structural checker uses Python's standard library and checks JSON metadata, duplicate IDs, internal anchors and image alt text. It intentionally does not police prose by a keyword blacklist.

## Stress fixture

`stress-report.html` is a synthetic long technical report, not a second research publication. It covers six named example authors with long titles, nested headings, a sum/fraction/root equation, a labelled chart, 64 synthetic table rows, repeated table headers, long identifiers, an appendix and 12 reference/audit entries. The specimen adds a grouped table header, qualitative status symbols, hatching, dimensions, an enlarged detail, a raster field, lists, code and a worked example.

Before release, inspect all rendered pages and verify:

- Every synthetic table record appears once in order, including the first/last record on each continuation page; each continuation has its header.
- Figure and table labels remain readable at actual print size. Mathematical operators and status symbols render correctly.
- Text remains inside margins, captions remain attached to figures, and no heading is stranded.
- Contents page numbers agree with actual section destinations, including references. No PDF contents block appears in web reading mode.
- Distribution is absent from header metadata. Classification precedes automatic or custom notices on page one and at the web end; later PDF pages retain the short classification footer. Verify one-line default notices and wrapping for long custom notices. The first-page Internal notice says “Internal use only.” The Public notice describes public distribution. Later pages always use the uppercase distribution label, including PUBLIC and INTERNAL. Page numbers remain absent on page one and present later.
- Static publication's PDF matches its baked settings and its View PDF works without the export server.
- Source facts, caveats, tables, figures and references survive any restyling. Any unresolved sparse page or source issue is recorded rather than concealed.

The original and blog-like reference treatments are preserved. Their old typography rules and checkers do not define the current system.

## Verified checkpoint — November 9, 2026

Current public builds contain starter and working article (1 page each), the component specimen (5 pages), and the synthetic long report (7 pages). The 64 inventory records are verified in order with repeating headers. The small print REFERENCES label matches CONTENTS. Interaction/export tests cover a custom category, distribution, detailed authors, shaded abstract and one-column contents.

Every new manuscript needs a page-by-page review. Real source-document conversion checks belong in a separate private workspace; do not add those manuscripts or preview images to this public repository.

Settings persistence is tested on a disposable draft: saving and reopening, preserving all article content and author records, discarding unsaved changes, escaping custom labels, detecting stale-tab conflicts, rejecting invalid or cross-origin writes, and refusing to save published reader files. The first-run route and the three Lucide icons are also checked.

Reader preview is checked as a separate tab: it carries unsaved choices, hides editor controls, and leaves the original editor URL and unsaved state intact. Settings help is checked on hover, keyboard focus, Escape and touch.

Lightbox resizing checks cover raster and SVG artwork while an open dialog shrinks and expands from 320px to 1500px. They verify aspect ratios and that the image, caption and close control stay within the dialog without horizontal overflow.

Print figure preflight is tested at the actual Letter content width. A synthetic portrait verifies the opt-in 3in square/portrait photo ceiling and side caption; an uncapped tall chart still renders, and a 70-row table spans pages with every row present once and repeated headers.

Optional metadata fields are tested for independent controls, all four fields together, safe free text, save/reload, reader preview and generated PDF output. Prepared for is omitted from footers. Legacy category links remain supported; long event names wrap on narrow screens.

The opt-in portrait photo is checked in equal print columns with a centered image and bottom-aligned caption. Web checks cover its compact centered layout and responsive side caption, plus whole-image lightbox fitting at desktop, mobile portrait and mobile landscape sizes. Scientific figures retain their separate sizing.

For a source-document conversion, inventory every section, table, figure, caption, note and reference before formatting. Compare text and numeric table values independently against the source; check ligatures, subscripts and cross-page paragraph joins. Do not present selected-excerpt tests as complete documents. Update all internal references when renumbering.

Caption checks cover separate figure/table sequences, explicit-label preservation, missing labels, Appendix A/B counters, repeated normalization, removal of blanket italics and preservation of selective emphasis. They also verify numbered References/appendix contents entries and private review tabs at mobile widths.

Custom footer checks cover recommended wording, custom notices with classification prefixes and preserved later-page classification markings, clearing the source override back to the automatic first-page notice, preservation of saved custom text when Distribution changes, save/reload, reader preview, input validation and mobile layout. Verify custom wording appears only on the first PDF page and at the web article end, with organization, full month/year and distribution on later PDF pages (no Category or day).
