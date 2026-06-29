import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const REGION = process.env.NEXT_PUBLIC_COGNITO_REGION!;
const POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const COOKIE = "blog_token";

const JWKS = createRemoteJWKSet(
  new URL(
    `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}/.well-known/jwks.json`
  )
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/shreenu-editor/login")) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL("/shreenu-editor/login", req.url));

  try {
    await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}`,
    });
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/shreenu-editor/login", req.url));
  }
}

export const config = {
  matcher: ["/shreenu-editor/:path*"],
};
