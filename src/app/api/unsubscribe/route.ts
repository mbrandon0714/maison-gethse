import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// One-click unsubscribe from the email footer link.
// Returns a small branded page rather than raw JSON.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://maison-gethse.marknitor.workers.dev";

  let ok = false;
  if (token) {
    const { data, error } = await supabase.rpc("unsubscribe_by_token", {
      p_token: token,
    });
    if (error) console.error("Unsubscribe error:", error);
    ok = Boolean(data);
  }

  const title = ok ? "Your address has been released." : "This letter has already been closed.";
  const body = ok
    ? "The letters will stop. The door stays open — you can always leave your address again."
    : "This link may have been used already, or the address was never on our list.";

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Maison Gethse</title>
  <style>
    body { margin:0; background:#0a0d0a; color:#f4f1ec; font-family:Helvetica,Arial,sans-serif;
           display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; }
    .card { max-width:440px; padding:48px 32px; }
    .label { font-size:11px; letter-spacing:0.24em; text-transform:uppercase; color:#c8922a; margin:0 0 16px; }
    h1 { font-family:Georgia,serif; font-weight:400; font-style:italic; font-size:26px; line-height:1.4; margin:0 0 16px; }
    p { font-size:14px; line-height:1.9; color:rgba(216,212,206,0.7); margin:0 0 32px; }
    a { display:inline-block; padding:13px 30px; border:1px solid rgba(200,146,42,0.4); color:#c8922a;
        font-size:11px; letter-spacing:0.18em; text-transform:uppercase; text-decoration:none; }
  </style>
</head>
<body>
  <div class="card">
    <p class="label">Maison Gethse</p>
    <h1>${title}</h1>
    <p>${body}</p>
    <a href="${site}">Return to the Maison</a>
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
