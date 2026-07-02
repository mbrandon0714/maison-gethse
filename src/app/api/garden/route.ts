import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, prompt, identityType, displayName } = body;

    if (!text || !prompt) {
      return NextResponse.json({ error: "Text and prompt are required" }, { status: 400 });
    }
    const trimmed = String(text).trim();
    if (trimmed.length < 10) {
      return NextResponse.json({ error: "Your seed is a little short — give it a few more words." }, { status: 400 });
    }
    if (trimmed.length > 600) {
      return NextResponse.json({ error: "Seeds are limited to 600 characters." }, { status: 400 });
    }

    const { error } = await supabase.from("garden_seeds").insert({
      text: trimmed,
      prompt,
      identity_type: identityType || "anonymous",
      display_name: displayName ? String(displayName).trim().slice(0, 60) : null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    sendAdminAlert(
      "🌱 New Garden seed awaiting review",
      `<p style="font-size:15px;line-height:1.8;color:#564c45;margin:0 0 12px">A new seed was planted:</p>
       <blockquote style="border-left:2px solid #c8922a;padding-left:14px;font-style:italic;color:#303d30;font-size:15px;line-height:1.7;margin:0 0 12px">${trimmed.replace(/</g, "&lt;")}</blockquote>
       <p style="font-size:13px;color:#564c45;margin:0">— ${displayName ? String(displayName).replace(/</g, "&lt;") : "Anonymous"} · “${String(prompt).replace(/</g, "&lt;")}”</p>`
    ).catch((e) => console.error("Admin alert failed:", e));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("garden_seeds")
    .select("id, text, prompt, identity_type, display_name, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json({ seeds: data });
}
