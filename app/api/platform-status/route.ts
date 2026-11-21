import { NextResponse } from "next/server";
import {
  buildDegradedFallbackStatus,
  fetchServerPlatformStatus,
} from "@/lib/maintenance/status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-side platform status probe consumed by P2R Web clients for
 * retry, auto-recovery, and live maintenance detection.
 *
 * Always returns uncached JSON describing both API health and canonical
 * manual maintenance state so browser clients never mistake a healthy
 * frontend HTTP 200 for a healthy backend API.
 */
export async function GET(): Promise<NextResponse> {
  const status =
    (await fetchServerPlatformStatus({ allowMissingConfig: false })) ??
    buildDegradedFallbackStatus();

  return NextResponse.json(status, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
