import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const privateStandalonePathPrefixes = ["/google-ads-api-tool"];

function isPrivateStandalonePath(pathname: string) {
  return privateStandalonePathPrefixes.some(
    (pathPrefix) =>
      pathname === pathPrefix || pathname.startsWith(`${pathPrefix}/`),
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPrivateStandalonePath(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";

    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|v/|.*\\..*).*)",
};
