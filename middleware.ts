// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// The real login screen lives at /register-login. /login is kept in the list
// only so a stray hit there is treated as public instead of bouncing.
const LOGIN_PATH = "/register-login";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register-login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-otp-password",
];

const PUBLIC_FILE =
  /\.(?:png|jpe?g|gif|webp|svg|ico|bmp|avif|mp3|wav|ogg|mp4|webm|txt|xml|json|js|css|map|woff2?|ttf|eot)$/i;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sw99_token")?.value;
  const { pathname } = request.nextUrl;

  // Never block API or preflight requests.
  if (pathname.startsWith("/api") || request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // Always allow static / public assets.
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/icons") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith(".webmanifest") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // No token on a private route.
  if (!token && !isPublicRoute) {
    // For non-GET (form / XHR) return 401 instead of redirecting.
    if (request.method !== "GET") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("next", pathname);
    // 303 forces the follow-up request to GET.
    return NextResponse.redirect(url, 303);
  }

  // Logged in and visiting a public/auth page -> send to the dashboard.
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Exclude /api from the matcher.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
  ],
};
