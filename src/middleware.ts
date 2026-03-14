import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("JSESSIONID");

  // Check if it's a protected route (not starting with /auth/ and not a public asset)
  // Locale-aware check: /^/(en|uk)/(protected)/
  const isProtectedPath =
    pathname.match(/^\/(en|uk)\/\(protected\)/) ||
    (!pathname.includes("/auth/") &&
      !pathname.includes("/api/") &&
      pathname !== "/" &&
      !pathname.match(/^\/(en|uk)$/) &&
      !pathname.match(/^\/(en|uk)\/auth\//));

  if (isProtectedPath && !session) {
    const locale = pathname.split("/")[1] || "uk";
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|uk)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
