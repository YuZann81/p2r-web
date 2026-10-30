#!/usr/bin/env bash
#
# P2R WEB — STAGING activation.
#
#   deploy-staging.sh <tarball> <release-sha> <sha256>
#
# Independent of the API activation script (that one builds Laravel caches and
# drives FrankenPHP) and of the production release script (which hardcodes the
# production root and the p2r-web process). What is shared is the contract:
# releases/<sha> + atomic `current` symlink + PM2 reload + health gate.
#
# Everything below the guards operates on STAGING_ROOT only.
set -euo pipefail

LOG_FILE=/var/www/staging/pixel2reality/logs/web/deploy.log
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
exec > >(tee -a "$LOG_FILE") 2>&1
echo "--- $(date -u +%Y-%m-%dT%H:%M:%SZ) deploy-staging.sh (web) args: $* ---"

readonly STAGING_ROOT=/var/www/staging/pixel2reality
readonly PRODUCTION_ROOT=/var/www/production/pixel2reality
readonly APP=web
readonly PM2_NAME=p2r-web-staging
readonly PORT=3005
readonly HEALTH_URL="http://127.0.0.1:${PORT}/"
readonly RELEASES="$STAGING_ROOT/apps/$APP/releases"
readonly CURRENT="$STAGING_ROOT/apps/$APP/current"
readonly ECOSYSTEM="$STAGING_ROOT/config/ecosystem.web.config.js"
readonly NODE_BIN="$STAGING_ROOT/shared/web/runtime/bin/node"
readonly HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-20}"

log()  { printf '[web] %s\n' "$*"; }
fail() { printf '[web] FAIL: %s\n' "$*" >&2; exit 1; }

# ------------------------------------------------------------------ arguments
[[ $# -eq 3 ]] || fail "usage: $0 <tarball> <release-sha> <sha256>"
tarball="$1"
release="$2"
expected="$3"

# -------------------------------------------------------------- root isolation
if [[ -n "${P2R_ROOT:-}" && "$P2R_ROOT" != "$STAGING_ROOT" ]]; then
  fail "P2R_ROOT='${P2R_ROOT}' is not the staging root — refusing to activate"
fi
[[ -d "$STAGING_ROOT" ]] || fail "staging root missing: $STAGING_ROOT"
[[ "$STAGING_ROOT" != "$PRODUCTION_ROOT" ]] || fail "staging root equals the production root"
case "$STAGING_ROOT" in
  "$PRODUCTION_ROOT" | "$PRODUCTION_ROOT"/*) fail "staging root resolves inside production" ;;
esac
if [[ -d "$PRODUCTION_ROOT" ]]; then
  [[ "$(readlink -f "$STAGING_ROOT")" != "$(readlink -f "$PRODUCTION_ROOT")" ]] \
    || fail "staging and production roots resolve to the same directory"
fi

# ------------------------------------------------------------ runtime identity
[[ -x "$NODE_BIN" ]] \
  || fail "staging Node runtime missing: $NODE_BIN — run deploy/install-staging-runtime.sh"
node_version="$("$NODE_BIN" -v 2>/dev/null || true)"
[[ "$node_version" == v24.* ]] \
  || fail "staging Node runtime is '${node_version:-none}', expected v24.x: $NODE_BIN"

# ------------------------------------------------------- artifact + checksum
[[ -f "$tarball" ]] || fail "artifact not found: $tarball"
[[ "$release" =~ ^[0-9a-f]{40}$ ]] || fail "release id must be a full 40-character commit sha"
[[ "$expected" =~ ^[0-9a-f]{64}$ ]] || fail "expected sha256 must be 64 lowercase hex characters"
actual="$(sha256sum "$tarball" | awk '{print $1}')"
[[ "$actual" == "$expected" ]] || fail "checksum mismatch — artifact bytes do not match the verified digest"
log "checksum verified: $actual"

# ------------------------------------------------------------------ port guard
if ss -ltn 2>/dev/null | grep -q "127.0.0.1:${PORT}\b"; then
  owner_pid="$(pm2 pid "$PM2_NAME" 2>/dev/null | tr -d '[:space:]' || true)"
  [[ -n "$owner_pid" ]] || fail "port ${PORT} is held by another listener — refusing to start"
  log "port ${PORT} is held by $PM2_NAME (pid $owner_pid)"
fi

# --------------------------------------------------------------------- unpack
mkdir -p "$RELEASES"
target="$RELEASES/$release"
[[ -e "$target" ]] && fail "release already exists: $target"
mkdir -p "$target"
tar -xzf "$tarball" -C "$target" || fail "extraction failed"
for required in server.js package.json .next/BUILD_ID .next/static public; do
  [[ -e "$target/$required" ]] || fail "artifact is missing required runtime file: $required"
done
log "extracted: $target"

# ------------------------------------------------------------------- activate
previous=""
[[ -L "$CURRENT" ]] && previous="$(readlink "$CURRENT")"

swap="$STAGING_ROOT/apps/$APP/.current.swap.$$"
ln -sfn "$target" "$swap"
mv -Tf "$swap" "$CURRENT"
log "activated: $CURRENT -> $target"

# ---------------------------------------------------------------------- pm2
pm2 startOrReload "$ECOSYSTEM" --only "$PM2_NAME" --update-env >/dev/null \
  || fail "pm2 could not start/reload $PM2_NAME"

# -------------------------------------------------------------------- health
# The root document is the verdict. A 500 here means the standalone server
# failed to boot or the app threw during render; HTTP 200 alone is not enough,
# so the body must contain the application shell.
body=""
for _ in $(seq 1 "$HEALTH_TIMEOUT"); do
  body="$(curl -s --max-time 5 -w '\n%{http_code}' "$HEALTH_URL" 2>/dev/null || true)"
  code="${body##*$'\n'}"
  if [[ "$code" == "200" && "$body" == *"<html"* ]]; then
    log "health OK (200) $HEALTH_URL"
    log "release $release is live on port $PORT"
    exit 0
  fi
  sleep 1
done

if [[ -n "$previous" ]]; then
  ln -sfn "$previous" "$CURRENT"
  pm2 startOrReload "$ECOSYSTEM" --only "$PM2_NAME" --update-env >/dev/null 2>&1 || true
  log "restored previous release: $previous"
fi
fail "health check did not return 200 with the app shell from $HEALTH_URL (last: ${body:0:200})"
