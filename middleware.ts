import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set("x-full-url", request.url);

  // Skip .well-known and any API/system routes
  if (
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next({ headers });
}

// Only run middleware on routes we care about
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
