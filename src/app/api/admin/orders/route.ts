import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendShippingNotification } from "@/lib/email";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status, tracking_number } = await req.json();

  const updates: Record<string, string> = {};
  if (status) updates.status = status;
  if (tracking_number) updates.tracking_number = tracking_number;

  // Snapshot before update so we can detect the moment an order becomes
  // "shipped with tracking" and send the notification exactly once.
  const { data: before } = await supabase.from("orders").select("*").eq("id", id).single();

  const { data: after, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });

  const wasReady = before?.status === "shipped" && before?.tracking_number;
  const isReady = after?.status === "shipped" && after?.tracking_number;

  if (isReady && !wasReady) {
    sendShippingNotification({
      customerName: `${after.customer_first_name} ${after.customer_last_name}`,
      customerEmail: after.customer_email,
      productName: after.product_name,
      trackingNumber: after.tracking_number,
    }).catch((err) => console.error("Shipping email failed:", err));
  }

  return NextResponse.json({ success: true, emailSent: Boolean(isReady && !wasReady) });
}
