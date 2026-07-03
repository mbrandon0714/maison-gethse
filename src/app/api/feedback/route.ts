import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminAlert } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPES = ["question", "bug", "other"] as const;
const TYPE_LABEL: Record<string, string> = {
  question: "❓ Question",
  bug: "🐞 Issue report",
  other: "✉️ Note",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = TYPES.includes(body.type) ? body.type : "question";
    const message = String(body.message || "").trim();
    const email = body.email ? String(body.email).trim().toLowerCase() : "";
    const page = body.page ? String(body.page).slice(0, 200) : "";

    if (message.length < 3) {
      return NextResponse.json({ error: "Please add a little more detail." }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "That's a bit long — keep it under 2000 characters." }, { status: 400 });
    }
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "That email doesn't look quite right." }, { status: 400 });
    }

    const { error } = await supabase.from("feedback").insert({
      type,
      email: email || null,
      message,
      page: page || null,
      status: "new",
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    const esc = (s: string) => s.replace(/</g, "&lt;");
    sendAdminAlert(
      `${TYPE_LABEL[type]} — from the website`,
      `<p style="font-size:15px;line-height:1.8;color:#564c45;margin:0 0 12px">Someone reached out through the site:</p>
       <blockquote style="border-left:2px solid #c8922a;padding-left:14px;color:#303d30;font-size:15px;line-height:1.7;margin:0 0 14px">${esc(message)}</blockquote>
       <p style="font-size:13px;color:#564c45;margin:0 0 4px"><strong>Type:</strong> ${type}</p>
       <p style="font-size:13px;color:#564c45;margin:0 0 4px"><strong>Reply to:</strong> ${email ? esc(email) : "— (no email left)"}</p>
       ${page ? `<p style="font-size:13px;color:#564c45;margin:0"><strong>Page:</strong> ${esc(page)}</p>` : ""}`
    ).catch((e) => console.error("Feedback alert failed:", e));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
