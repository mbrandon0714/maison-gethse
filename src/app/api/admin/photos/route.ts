import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("photo_submissions").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ submissions: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const { error } = await supabase.from("photo_submissions").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabase.from("photo_submissions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
