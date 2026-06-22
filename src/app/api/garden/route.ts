import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, prompt, identityType, displayName } = body;

    if (!text || !prompt) {
      return NextResponse.json({ error: "Text and prompt are required" }, { status: 400 });
    }

    const { error } = await supabase.from("garden_seeds").insert({
      text,
      prompt,
      identity_type: identityType || "anonymous",
      display_name: displayName || null,
      status: "pending",
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

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
