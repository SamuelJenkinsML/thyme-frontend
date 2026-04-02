import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    // For API routes, return 401 instead of redirecting
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // For page routes, redirect to login
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/catalog/:path*",
    "/inspect/:path*",
    "/jobs/:path*",
    "/sources/:path*",
    "/monitoring/:path*",
    "/api/proxy/:path*",
  ],
};
