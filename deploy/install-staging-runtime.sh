#!/usr/bin/env bash
#
# P2R Web — staging Node.js runtime installer.
#
# Why this exists: the host ships Node v22 and this package requires Node 24
# (`.node-version`, `engines.node`). Nothing global is replaced: a pinned
# upstream Node is unpacked under the staging shared tree and PM2 uses it as the
# interpreter for p2r-web-staging only. The Panel keeps its own copy under
# shared/panel/runtime, so a Web runtime change can never disturb it.
#
# Idempotent: an installation whose `node -v` already matches is left alone.
# Staging only: refuses any root other than the staging root, never writes
# outside it and never needs sudo.
set -euo pipefail

readonly STAGING_ROOT=/var/www/staging/pixel2reality
readonly PRODUCTION_ROOT=/var/www/production/pixel2reality
readonly VERSION=24.22.0
readonly SHA256=cc2f601cee82d9a5a233302fe307abc600727035fd7d2c3a3571755989e95008
readonly URL="https://nodejs.org/dist/v${VERSION}/node-v${VERSION}-linux-x64.tar.xz"
readonly RUNTIME_DIR="$STAGING_ROOT/shared/web/runtime"
readonly NODE_BIN="$RUNTIME_DIR/bin/node"

log()  { printf '[web-runtime] %s\n' "$*"; }
fail() { printf '[web-runtime] FAIL: %s\n' "$*" >&2; exit 1; }

if [[ -n "${P2R_ROOT:-}" && "$P2R_ROOT" != "$STAGING_ROOT" ]]; then
  fail "P2R_ROOT='${P2R_ROOT}' is not the staging root — refusing to install"
fi
[[ -d "$STAGING_ROOT" ]] || fail "staging root missing: $STAGING_ROOT"
case "$(readlink -f "$STAGING_ROOT")/" in
  "$(readlink -f "$PRODUCTION_ROOT")"/*) fail "staging root resolves inside production" ;;
esac

if [[ -x "$NODE_BIN" && "$("$NODE_BIN" -v 2>/dev/null)" == "v$VERSION" ]]; then
  log "verified, already current: $NODE_BIN (v$VERSION)"
else
  mkdir -p "$RUNTIME_DIR"
  tmp="$(mktemp "$STAGING_ROOT/tmp/node.XXXXXX")"
  trap 'rm -f "$tmp"' EXIT

  log "downloading Node.js v$VERSION"
  curl -fsSL --max-time 300 -o "$tmp" "$URL" || fail "download failed: $URL"
  actual="$(sha256sum "$tmp" | awk '{print $1}')"
  [[ "$actual" == "$SHA256" ]] || fail "checksum mismatch for $URL — refusing to install"

  # Replace the unpacked tree atomically enough for PM2: extract beside the
  # destination, then move it into place.
  staging="$RUNTIME_DIR/.node-v$VERSION.$$"
  rm -rf "$staging"
  mkdir -p "$staging"
  tar -xJf "$tmp" -C "$staging" --strip-components=1 || fail "extraction failed"
  rm -rf "$RUNTIME_DIR/bin" "$RUNTIME_DIR/include" "$RUNTIME_DIR/lib" "$RUNTIME_DIR/share"
  mv "$staging"/* "$RUNTIME_DIR"/
  rmdir "$staging"
  trap - EXIT
  rm -f "$tmp"
  log "installed: $NODE_BIN"
fi

[[ "$("$NODE_BIN" -v)" == "v$VERSION" ]] || fail "$NODE_BIN is not v$VERSION"
log "ready: $("$NODE_BIN" -v)"
