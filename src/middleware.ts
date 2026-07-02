import { NextRequest, NextResponse } from "next/server";

async function expectedToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(`mg-admin:${secret}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/auth";
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    // Fail closed: no password configured means no admin access.
    return isAdminApi
      ? NextResponse.json({ error: "Admin not configured" }, { status: 503 })
      : new NextResponse("Admin not configured. Set ADMIN_PASSWORD.", { status: 503 });
  }

  const cookie = req.cookies.get("mg-admin")?.value;
  if (cookie && cookie === (await expectedToken(secret))) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
