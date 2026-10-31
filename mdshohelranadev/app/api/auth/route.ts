import { NextResponse } from "next/server";
import { COOKIE, isAuthed, sessionToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ ok: isAuthed() });
}

export async function POST(req: Request) {
  const { password } = await req.json();
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || password !== pw) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
