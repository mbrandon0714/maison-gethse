import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, portfolio, caption } = await req.json();

    const cleanName = String(name || "").trim().slice(0, 80);
    const cleanPortfolio = String(portfolio || "").trim().slice(0, 200);
    const cleanCaption = String(caption || "").trim().slice(0, 600);

    if (!cleanName || !cleanPortfolio) {
      return NextResponse.json({ error: "Name and a portfolio or Instagram link are required." }, { status: 400 });
    }

    const { error } = await supabase.from("photo_submissions").insert({
      photographer_name: cleanName,
      portfolio_link: cleanPortfolio,
      caption: cleanCaption || null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    const esc = (s: string) => s.replace(/</g, "&lt;");
    sendAdminAlert(
      "📷 New photo submission for The Lens",
      `<p style="font-size:15px;line-height:1.8;color:#564c45;margin:0 0 12px"><strong style="color:#303d30">${esc(cleanName)}</strong> submitted their work:</p>
       <p style="font-size:14px;color:#303d30;margin:0 0 8px">Portfolio: ${esc(cleanPortfolio)}</p>
       ${cleanCaption ? `<p style="font-size:14px;font-style:italic;color:#564c45;margin:0">“${esc(cleanCaption)}”</p>` : ""}`
    ).catch((e) => console.error("Admin alert failed:", e));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
