#!/usr/bin/env bash
# Print an HTML file to PDF with headless Chrome or Chromium.
# Usage: ./build.sh [file.html]   (default: specimen.html)
# If pdftoppm is installed, also writes page images to preview/.
set -euo pipefail
cd "$(dirname "$0")"
in="${1:-specimen.html}"
out="${in%.html}.pdf"

browser=""
for b in chromium chromium-browser google-chrome-stable google-chrome; do
  if command -v "$b" >/dev/null 2>&1; then browser="$b"; break; fi
done
mac="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ -z "$browser" ] && [ -x "$mac" ]; then browser="$mac"; fi
[ -n "$browser" ] || { echo "Chrome or Chromium not found" >&2; exit 1; }

# The time budget lets web fonts load before printing.
"$browser" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=15000 --print-to-pdf="$out" "$in" 2>/dev/null
echo "wrote $out"

if command -v pdftoppm >/dev/null 2>&1; then
  name="$(basename "${in%.html}")"
  mkdir -p preview
  rm -f "preview/$name"-*.png
  pdftoppm -r 150 -png "$out" "preview/$name"
  echo "wrote preview/$name-*.png"
fi
