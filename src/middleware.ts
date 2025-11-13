import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  // Allow public routes
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register") ||
    url.pathname.startsWith("/api") ||
    url.pathname === "/" ||
    url.pathname.startsWith("/kegiatan") ||
    url.pathname.startsWith("/prestasi")
  ) {
    return NextResponse.next();
  }

  // Protected dashboard
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const role = token.role;

    if (url.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/guru", req.url));
    }

    if (url.pathname.startsWith("/dashboard/guru") && role !== "GURU" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"]
};