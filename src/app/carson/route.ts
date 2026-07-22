import { ipAddress } from "@vercel/functions";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "~/server/db";
import { linkVisits } from "~/server/db/schema";

export const dynamic = "force-dynamic";

// Tracking link: logs the visit, then sends the visitor to the homepage.
// Kept as a 307 so browsers never cache the redirect and skip tracking.
export async function GET(request: NextRequest) {
  try {
    await db.insert(linkVisits).values({
      slug: "carson",
      ipAddress: ipAddress(request) ?? request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    });
  } catch (error) {
    // Tracking must never block the redirect.
    console.error("Failed to record /carson visit", error);
  }

  return NextResponse.redirect(new URL("/", request.url));
}
