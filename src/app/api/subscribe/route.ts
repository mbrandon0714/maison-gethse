import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendNewsletterWelcome } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const source = body.source ? String(body.source).slice(0, 40) : "popup";

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "That address doesn't look quite right — mind checking it?" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("subscribe_email", {
      p_email: email,
      p_source: source,
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // Only send the welcome letter on a fresh subscription —
    // never re-send to someone already on the list.
    if (data && !data.already) {
      const site =
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://maison-gethse.marknitor.workers.dev";
      const unsubscribeUrl = `${site}/api/unsubscribe?token=${data.token}`;
      sendNewsletterWelcome({ to: email, unsubscribeUrl }).catch((e) =>
        console.error("Welcome email failed:", e)
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
