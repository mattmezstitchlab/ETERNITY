#!/usr/bin/env bash
# Relance la preview ETERNITY (le sandbox purge node_modules & .next entre les tours)
set -e
cd "$(dirname "$0")/.."
[ -d node_modules/.bin ] || npm ci --no-audit --no-fund
[ -f .next/BUILD_ID ] || npx next build
exec npx next start -p "${PORT:-3000}" -H 0.0.0.0
