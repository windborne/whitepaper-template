#!/usr/bin/env python3
"""Check a document against the house style in SKILL.md.

Usage: python3 check.py my-document.html

Checks the HTML source for color, stray fonts and sizes, figure and table
numbering, captions, citations, punctuation, and common AI-writing tells.
If the PDF has been built and PyMuPDF is installed (pip install pymupdf),
also checks the printed pages for color, stranded headings, and a nearly
empty last page. Prints one line per finding and exits 1 if there are any.
"""

import os
import re
import sys
from html.parser import HTMLParser

STOCK_PHRASES = [
    "delve", "delves", "delving", "leverage", "leverages", "leveraging", "robust",
    "seamless", "seamlessly", "cutting-edge", "game-changer", "game-changing",
    "unlock", "unlocks", "unlocking", "empower", "empowers", "empowering",
    "harness", "harnessing", "landscape", "realm", "tapestry", "pivotal",
    "crucial", "paramount", "holistic", "synergy", "synergies", "innovative",
    "revolutionary", "unprecedented", "transformative", "state-of-the-art",
    "in today's", "it's worth noting", "it is worth noting",
    "it's important to note", "it is important to note", "plays a vital role",
    "plays a crucial role", "a testament to", "at the end of the day",
    "in conclusion", "in summary", "navigate the", "navigating the",
    "not just", "whether you're", "stands as", "serves as a",
    "ever-evolving", "fast-paced", "furthermore", "moreover",
]

ALLOWED_NAMED = {"none", "black", "white", "transparent", "currentcolor",
                 "inherit", "gray", "grey"}
ALLOWED_FONTS = ("newsreader", "ibm plex sans", "ibm plex mono", "stix two math",
                 "sans-serif", "serif", "monospace")
SKIP_TEXT = {"code", "pre", "style", "script", "svg", "math"}
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿⭐✅]")


def is_gray(value):
    v = value.strip().lower()
    if v in ALLOWED_NAMED or v.startswith("url("):
        return True
    m = re.fullmatch(r"#([0-9a-f]{3}|[0-9a-f]{6})", v)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return h[0:2] == h[2:4] == h[4:6]
    m = re.fullmatch(r"rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+).*\)", v)
    if m:
        return m.group(1) == m.group(2) == m.group(3)
    return False


class Doc(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.findings = []
        self.stack = []
        self.text = []          # (text, line) outside code/svg
        self.events = []        # ordered: ("ref"|"figure"|"table", n, line)
        self.caption_mode = None
        self.caption_buf = ""
        self.heading = None
        self.heading_buf = ""
        self.p_depth = 0
        self.p_text_seen = False
        self.fn_marks = []
        self.notes_items = 0
        self.in_notes = 0
        self._classes = []

    def add(self, msg):
        self.findings.append((self.getpos()[0], msg))

    def skipping(self):
        return any(t in SKIP_TEXT for t in self.stack)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = (a.get("class") or "").split()
        in_svg = "svg" in self.stack or tag == "svg"
        for k in ("fill", "stroke", "stop-color", "color"):
            if k in a and not is_gray(a[k]):
                self.add(f"non-gray {k} {a[k]!r} on <{tag}>")
        style = a.get("style") or ""
        for prop, val in re.findall(r"([a-z-]+)\s*:\s*([^;]+)", style):
            if "color" in prop or prop in ("fill", "stroke", "background"):
                for c in re.findall(r"#[0-9a-fA-F]{3,6}\b|rgba?\([^)]*\)|\b[a-z]+\b", val):
                    if (c.startswith("#") or c.startswith("rgb")) and not is_gray(c):
                        self.add(f"non-gray {prop} {c!r} in style on <{tag}>")
            if prop == "font-size" and not in_svg:
                self.add(f"inline font-size on <{tag}>; use the stylesheet sizes")
            if prop == "font-family":
                self._check_font(val, tag)
        if "font-family" in a:
            self._check_font(a["font-family"], tag)
        if in_svg and "font-size" in a:
            try:
                if float(a["font-size"]) < 7.4:
                    self.add(f"figure text {a['font-size']} is smaller than 7.4")
            except ValueError:
                pass
        if tag == "img" and not a.get("alt"):
            self.add("<img> without alt text")
        if tag in ("strong",):
            self.add("<strong> used; bold is only for lead-ins and caption labels")
        if tag == "b" and "p" in self.stack and self.p_text_seen and self.caption_mode is None:
            self.add("bold phrase inside a paragraph")
        if tag == "p":
            self.p_text_seen = False
        if tag == "figcaption" or (tag == "caption"):
            self.caption_mode = "figure" if tag == "figcaption" else "table"
            self.caption_buf = ""
        if tag in ("h1", "h2", "h3", "h4") and "titleblock" not in " ".join(self._classes):
            self.heading = tag
            self.heading_buf = ""
        if tag == "sup" and "fn" in cls:
            self.fn_marks.append(None)
        if "notes" in cls:
            self.in_notes = len(self.stack) + 1
        if tag == "li" and self.in_notes:
            self.notes_items += 1
        if tag not in ("br", "img", "hr", "meta", "link", "input", "line",
                       "circle", "rect", "path", "stop", "use"):
            self.stack.append(tag)
            self._classes.append(" ".join(cls))

    def _check_font(self, val, tag):
        for f in val.split(","):
            f = f.strip().strip("'\"").lower()
            if f and f not in ALLOWED_FONTS and not f.startswith("var("):
                self.add(f"font {f!r} on <{tag}> is not one of the house faces")
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
            self._classes.pop()

    def handle_endtag(self, tag):
        if tag in ("figcaption", "caption") and self.caption_mode:
            kind = self.caption_mode
            label = "Figure" if kind == "figure" else "Table"
            m = re.match(rf"\s*{label}\s+(\d+)\.", self.caption_buf)
            if not m:
                self.add(f"{kind} caption should start with '{label} N.'")
            else:
                self.events.append((kind, int(m.group(1)), self.getpos()[0]))
            body = self.caption_buf[m.end():].strip() if m else self.caption_buf
            if body and not body.rstrip().endswith((".", ".)", "”")):
                self.add(f"{label} caption is not a full sentence ending in a period")
            self.caption_mode = None
        if tag == self.heading:
            h = self.heading_buf.strip()
            words = [w for w in re.findall(r"[A-Za-z][\w'-]*", h)]
            minor = {"a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with", "by", "at"}
            major = [w for w in words[1:] if w.lower() not in minor and not w.isupper()]
            if len(major) >= 2 and all(w[0].isupper() for w in major):
                self.add(f"heading in title case, use sentence case: {h!r}")
            if ":" in h:
                self.add(f"colon in heading: {h!r}")
            self.heading = None
        if self.in_notes and len(self.stack) == self.in_notes and tag == self.stack[-1]:
            self.in_notes = 0
        while tag in self.stack:
            t = self.stack.pop()
            self._classes.pop()
            if t == tag:
                break

    def handle_data(self, data):
        if self.caption_mode:
            self.caption_buf += data
        if self.heading:
            self.heading_buf += data
        if self.skipping():
            return
        if "p" in self.stack and data.strip():
            self.p_text_seen = True
        line = self.getpos()[0]
        self.text.append((data, line))
        if not self.caption_mode:
            for m in re.finditer(r"\b(Figures?|Fig\.|Tables?)\s+(\d+)((?:\s*(?:,|and|to|–)\s*\d+)*)", data):
                kind = "figure" if m.group(1).startswith("Fig") else "table"
                nums = [int(m.group(2))] + [int(n) for n in re.findall(r"\d+", m.group(3))]
                for n in nums:
                    self.events.append(("ref-" + kind, n, line))


def check_source(path):
    src = open(path, encoding="utf-8").read()
    doc = Doc()
    doc.feed(src)
    out = list(doc.findings)

    for block in re.findall(r"<style[^>]*>(.*?)</style>", src, re.S | re.I):
        for c in re.findall(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\([^)]*\)", block):
            if not is_gray(c):
                out.append((0, f"non-gray color {c} in <style> block"))

    # Numbering and citation order for figures and tables.
    for kind in ("figure", "table"):
        placed = [(n, ln) for k, n, ln in doc.events if k == kind]
        nums = [n for n, _ in placed]
        if nums != list(range(1, len(nums) + 1)):
            out.append((0, f"{kind}s are numbered {nums}, expected 1 to {len(nums)} in order"))
        seen = set()
        for k, n, ln in doc.events:
            if k == "ref-" + kind:
                seen.add(n)
            elif k == kind and n not in seen:
                out.append((ln, f"{kind.title()} {n} appears before the text cites it"))

    # Notes.
    if len(doc.fn_marks) and doc.notes_items < len(doc.fn_marks):
        out.append((0, f"{len(doc.fn_marks)} note markers but only {doc.notes_items} notes"))

    # Prose checks.
    words = 0
    em = 0
    for data, line in doc.text:
        words += len(data.split())
        em += data.count("—")
        low = data.lower()
        for p in STOCK_PHRASES:
            for m in re.finditer(rf"(?<![\w-]){re.escape(p)}(?![\w-])", low):
                out.append((line, f"stock phrase {p!r}"))
        if EMOJI.search(data):
            out.append((line, "emoji"))
        if re.search(r"(?<=\w)\"|\"(?=\w)|(?<=\w)'(?=\w)|(?<=\s)'(?=\w)", data):
            out.append((line, "straight quote or apostrophe; use curly ones"))
        if re.search(r"(?<![\w.-])\d+(\.\d+)?-\d+(\.\d+)?\b(?!-)", data):
            out.append((line, "hyphen in a numeric range; use an en dash (–)"))
        if re.search(r"(?<![\w-])-\d", data):
            out.append((line, "hyphen before a number; use a minus sign (−) if it is negative"))
        if ";" in data and not self_is_list(data):
            out.append((line, "semicolon in prose; use a period"))
        if "[TK" in data:
            out.append((line, "unresolved [TK] placeholder"))
    if em:
        out.append((0, f"{em} em dash(es); the house style uses none"))
    return out


def self_is_list(data):
    """A semicolon that separates list items in a table cell or caption is fine."""
    return data.count(";") >= 2 and len(data) < 200


def check_pdf(pdf):
    try:
        import pymupdf
    except ImportError:
        try:
            import fitz as pymupdf
        except ImportError:
            return [(0, "PyMuPDF not installed; skipped the printed-page checks")]
    out = []
    doc = pymupdf.open(pdf)
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(dpi=40)
        s = pix.samples
        n = pix.n
        colored = 0
        for j in range(0, len(s), n * 3):
            r, g, b = s[j], s[j + 1], s[j + 2]
            if max(r, g, b) - min(r, g, b) > 24:
                colored += 1
        if colored > 3:
            out.append((0, f"page {i}: color in the printed page"))
        # A heading as the last text on a page, above the footer.
        blocks = [b for b in page.get_text("dict")["blocks"] if b.get("type") == 0]
        body = [b for b in blocks if b["bbox"][3] < page.rect.height - 50]
        if body and i < len(doc):
            last = max(body, key=lambda b: b["bbox"][3])
            spans = [s for l in last["lines"] for s in l["spans"] if s["text"].strip()]
            if spans and all(s["flags"] & 16 for s in spans) and len(spans) <= 3 \
                    and all(s["size"] > 9 for s in spans):
                text = " ".join(s["text"] for s in spans)
                out.append((0, f"page {i}: heading {text!r} is stranded at the bottom"))
    last = doc[-1]
    blocks = [b for b in last.get_text("dict")["blocks"]
              if b["bbox"][3] < last.rect.height - 50]
    if len(doc) > 1 and blocks:
        bottom = max(b["bbox"][3] for b in blocks)
        if bottom < last.rect.height * 0.2:
            out.append((0, f"last page is nearly empty (text ends {bottom / last.rect.height:.0%} down)"))
    return out


def main():
    if len(sys.argv) != 2:
        print(__doc__.strip().splitlines()[2])
        sys.exit(2)
    path = sys.argv[1]
    findings = check_source(path)
    pdf = os.path.splitext(path)[0] + ".pdf"
    if os.path.exists(pdf):
        if os.path.getmtime(pdf) < os.path.getmtime(path):
            findings.append((0, "the PDF is older than the HTML; rebuild before checking pages"))
        findings += check_pdf(pdf)
    else:
        findings.append((0, "no PDF yet; run ./build.sh to check the printed pages"))
    for line, msg in sorted(findings, key=lambda f: f[0]):
        where = f"{path}:{line}" if line else path
        print(f"{where}: {msg}")
    real = [f for f in findings if "skipped" not in f[1]]
    print(f"{len(real)} finding(s)" if real else "no findings")
    sys.exit(1 if real else 0)


if __name__ == "__main__":
    main()
