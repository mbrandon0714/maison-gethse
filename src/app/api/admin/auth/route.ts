import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const secret = process.env.ADMIN_PASSWORD;

  if (!secret) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }
  if (!password || password !== secret) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = crypto.createHash("sha256").update(`mg-admin:${secret}`).digest("hex");
  const res = NextResponse.json({ success: true });
  res.cookies.set("mg-admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
