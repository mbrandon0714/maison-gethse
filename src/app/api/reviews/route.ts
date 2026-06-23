import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product") || "perspective-change";

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });

  const avg = data && data.length > 0
    ? data.reduce((sum, r) => sum + r.rating, 0) / data.length
    : 0;

  return NextResponse.json({ reviews: data || [], average: Math.round(avg * 10) / 10, count: data?.length || 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, name, rating, text } = body;

  if (!productId || !name || !rating || !text) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    name,
    rating: Math.min(5, Math.max(1, rating)),
    text,
    status: "approved",
  });

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
