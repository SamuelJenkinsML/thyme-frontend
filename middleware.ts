export { auth as middleware } from "@/lib/auth";

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
