import { NextRequest, NextResponse } from "next/server";
import { loginWithCognito, setNewPassword, COOKIE_NAME } from "@/lib/auth";

function setCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === "set_new_password") {
    const result = await setNewPassword(
      body.email,
      body.newPassword,
      body.session
    );
    if (result.type !== "success") {
      const msg = result.type === "error" ? result.message : "Unexpected error";
      return NextResponse.json({ error: msg }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    setCookie(res, result.idToken);
    return res;
  }

  const result = await loginWithCognito(body.email, body.password);

  if (result.type === "new_password_required") {
    return NextResponse.json({
      challenge: "NEW_PASSWORD_REQUIRED",
      session: result.session,
      email: result.email,
    });
  }

  if (result.type === "error") {
    return NextResponse.json({ error: result.message }, { status: 401 });
  }

  if (result.type !== "success") {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  setCookie(res, result.idToken);
  return res;
}
