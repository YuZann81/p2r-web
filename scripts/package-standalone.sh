#!/usr/bin/env bash
#
# Assemble and verify the Web standalone runtime artifact.
#
# Single source of truth for the artifact layout, used by CI so a layout or
# basePath regression fails before an artifact is uploaded.
#
# Layout expected by the production image build and release procedure:
#   server.js, package.json, .next/BUILD_ID at the archive root,
# plus the static assets Next.js does not copy into .next/standalone itself:
#   .next/static and public/.
#
# Usage: bash scripts/package-standalone.sh [app-name]
# Env:   GITHUB_SHA  full 40-character commit SHA embedded in the artifact name
#                    (default: git rev-parse HEAD)

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

app="${1:-p2r-web}"
sha="${GITHUB_SHA:-$(git rev-parse HEAD)}"
standalone=".next/standalone"

fail() {
  echo "::error::artifact verification failed: $*" >&2
  exit 1
}

# Release identity is immutable: a short SHA or a non-hex value is ambiguous.
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] \
  || fail "release id must be a full 40-character lowercase Git SHA: $sha"

[[ -f "$standalone/server.js" ]] || fail "server.js missing from $standalone"
[[ -f "$standalone/package.json" ]] || fail "package.json missing from $standalone"
[[ -f "$standalone/.next/BUILD_ID" ]] || fail "BUILD_ID missing from $standalone/.next"

mkdir -p "$standalone/.next"
rm -rf "$standalone/.next/static" "$standalone/public"
cp -r .next/static "$standalone/.next/"
cp -r public "$standalone/"

for required in server.js package.json .next/BUILD_ID .next/static public; do
  [[ -e "$standalone/$required" ]] || fail "artifact is missing $required"
done

# p2r-web is served from the origin root (/), never a sub-path.
grep -Eq '"basePath"[[:space:]]*:[[:space:]]*""' .next/routes-manifest.json \
  || fail "basePath is not empty in .next/routes-manifest.json"

mkdir -p dist
tar -czf "dist/$app-$sha.tar.gz" -C "$standalone" .
( cd dist && sha256sum "$app-$sha.tar.gz" > "$app-$sha.tar.gz.sha256" )
cat "dist/$app-$sha.tar.gz.sha256"

echo "artifact verified: dist/$app-$sha.tar.gz"
echo "layout: server.js package.json .next/BUILD_ID .next/static public"
