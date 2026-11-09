#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
input="${1:-specimen.html}"
node render.cjs "$input" "${2:-${input%.html}.pdf}"
