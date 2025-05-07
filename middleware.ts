import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_at")?.value; // contoh pakai access_token dari cookie

  // const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
  const protectedPaths = ["/dashboard", "/users"];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"], // proteksi semua route ini
};
