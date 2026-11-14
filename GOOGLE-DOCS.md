# Google Docs and Word companion

Use this guide when the user wants an editable Google Doc or Word document. It adapts the WindBorne print style to native document formatting; it does not require converting a working document into HTML. The HTML editor remains the route for a web article and its matching PDF. This companion is included in `v1.1.0` and on `main`, and does not supersede Dana's Word template or customer-required formats.

## Start with the existing document

Use current `main` for new documents unless the user requests a fixed tag or commit. Record the exact template commit in private handoff notes alongside the document/export. Do not silently restyle existing work to a newer template revision.

- Work on a private copy unless the user requests edits to the live source. Keep real manuscripts, DOCX files, exports and QA images outside the public template checkout, in approved storage. Do not put a live private document URL or its content in this repository.
- Preserve every paragraph, table value, figure, link, citation and supplied notice. Formatting changes do not authorize rewriting claims or replacing the document with excerpts. Keep existing section numbering and a useful Summary heading unless asked to change them.
- Confirm the document date, author information and classification. Use Public, Internal or Proprietary, with Internal as the default only when no higher classification applies. Map legacy Confidential/Restricted labels to Proprietary; preserve those words when they are part of a supplied notice. Follow the handling and approval requirements in README.md.
- Use Google Docs **Pages** mode for page margins, footers and page numbering. An imported Word document must be checked again in Google Docs and in its exported PDF; pagination and font handling can differ between applications.

## First-page opening

1. Insert the supplied `assets/windborne.svg` logo above the title, left aligned with the text. Use an inline image in the document body, not a repeating page header or floating text box. If SVG import is unsupported, convert this exact logo to a high-resolution transparent PNG. Preserve its aspect ratio. A width of about 1.4–1.6 inches and 12–16 pt of space below it is a useful starting point.
2. Use Newsreader Semibold/Bold for the title, approximately 26–28 pt. Preserve the author's title and capitalization; allow natural wrapping. An optional subtitle uses regular Newsreader. Remove inherited Word Title-style borders and colored theme rules.
3. A compact horizontal metadata line is welcome: `Team or role | Author Name | November 2026`. Use IBM Plex Sans at about 9–10 pt. Preserve an existing clean line; do not force small AUTHOR/DATE labels or a metadata table onto it. Remove trailing separators and empty fields. Use a single thin neutral rule below the metadata (about 0.5 pt, WB Gray 200 `#DADBD7`), with a little space between the text and rule. Do not add a rule above the metadata or underneath the title. This is an intentional metadata paragraph border; when sanitizing inherited title borders, preserve this requested bottom rule. Let long author lists wrap naturally.
4. Keep classification in the footer, not the opening metadata. Display dates as `Nov. 9, 2026` when a day is supplied, or `November 2026` when it is not. Do not invent a day.

Do not add a repeating WINDBORNE SYSTEMS banner or a horizontal rule at the top of later pages. The running footer supplies the company attribution. A proposal can use the separate cover treatment in DESIGN.md when requested; do not automatically add a cover to an existing report.

## Fonts and page layout

Use Newsreader for prose and headings, IBM Plex Sans for metadata, captions, tables and footers, and IBM Plex Mono only for small navigation/index labels where needed. Preserve a sound existing layout. For a new US Letter document, the print template's starting point is 0.8-inch side margins, roughly 0.68-inch top and 0.7-inch bottom margins, 10.75–11 pt prose and about 1.35–1.4 line spacing. These are starting values, not a reason to squeeze an existing manuscript onto a prescribed number of pages. Use pure white paper.

Use small solid black square bullets (`▪`) for top-level unordered lists. Set the glyph on the native list definition (or Google Docs custom bullet), with a font that contains it, rather than typing square characters into ordinary paragraphs. Keep the square at the body left margin and use a consistent hanging text indent of about 0.2 inches, with the list tab stop at that same text position. Set matching paragraph and list-definition indents so the first line and wrapped lines align across applications; avoid relying on default tab stops. Preserve list semantics. Keep numbered/lettered lists and meaningful nested-list hierarchy unchanged. Check the glyph after Word-to-Docs import; do not accept a substituted round bullet.

Keep headings with the following paragraph, allow tables to flow across pages with repeating column headers, and avoid forcing entire sections or long tables to stay together. Keep captions with their artwork; grouped images share one caption and, when framed, one thin outer frame. Do not impose the web sidebar, side captions or HTML editor controls on a Google Doc.

## First-page and running footers

Enable **Different first page**. Page one has its tailored notice only, without an extra company/classification prefix or page number. Use the exact approved notice from [DESIGN.md](DESIGN.md#automatic-first-page-notices), or preserve the supplied custom notice and its capitalization. Do not invent a shorter notice to fit one line.

On page two and beyond:

- Left: `WindBorne Systems. Document title. November 2026.`
- Right: uppercase `PUBLIC`, `INTERNAL` or `PROPRIETARY`, followed by the automatic page number. The second physical page is page 2, not page 1.
- Use the supplied short running title when available; otherwise use the full title. Omit repeated WindBorne/WindBorne Systems from the running title while preserving the main title. Request a shorter title if necessary rather than silently abbreviating it.
- Use IBM Plex Sans at about 8 pt in WB Gray 600 (`#696965`), without a decorative rule. Align to the same left/right margins as the document. Start with a footer distance of about 0.3 inches; reserve enough bottom margin for longer notices.
- Apply the footer font, size and color to the paragraph style and paragraph mark as well as every run of the automatic page-number field, including its field result. A field with only partial direct formatting can revert to the document default after refresh/import; verify the number matches the rest of the footer in the exported PDF. Use native right-aligned tab stops or a borderless footer table to keep the right-hand label/page number separate. Never position them with a string of spaces or type page numbers by hand. Let long notices wrap at a readable size without clipping or overlapping the body.

Google Docs supports these controls in Pages mode: [Google's header/footer and page-number instructions](https://support.google.com/docs/answer/86629). Application support does not guarantee that every agent connector exposes the same editing operations. Verify the actual tool's capabilities; if it cannot edit footers or insert page-number fields, explain the limitation rather than substituting footer-looking body text.

## Check before delivering

- Compare the complete manuscript and tables with the original. The only text changes should be those the user authorized or trivial separator cleanup.
- Render the edited Word file and inspect every page. Check actual font rendering, title wrapping, logo proportions, metadata, table breaks, and first-page versus later-page footers. Preserve embedded fonts when possible; do not silently substitute them.
- After import or live Google Docs edits, export a fresh PDF and inspect it again. A local Word render is not proof of the final Google Docs layout. Check clickable links and automatic page numbers as well as appearance.
- Give the user the editable private document; provide a PDF when requested. Do not publish it or add it to the public specimen. Keep the original source intact when making a preview.

## Short agent prompt

> Read GOOGLE-DOCS.md and the approved notices in DESIGN.md from windborne/whitepaper-template on main. Restyle a private copy of my existing document without changing its content. Keep its horizontal author/team/date line, add the supplied WindBorne logo above the first-page title, remove the repeated company header, and apply the first-page notice and running footer for my confirmed classification. Use native document formatting and automatic page numbers. Preserve all tables, figures, links and references, and inspect every exported page before returning the editable document. Keep real content and previews outside the public template repository.
