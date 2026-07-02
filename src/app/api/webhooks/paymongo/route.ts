import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { sendOrderConfirmation, sendAdminAlert } from "@/lib/email";

// PayMongo signs webhooks with: Paymongo-Signature: t=<ts>,te=<test_sig>,li=<live_sig>
// Signature = HMAC-SHA256(`${t}.${rawBody}`, PAYMONGO_WEBHOOK_SECRET)
function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.split("=").map((s) => s.trim()) as [string, string])
  );
  const timestamp = parts["t"];
  const signature = parts["li"] || parts["te"];
  if (!timestamp || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (secret) {
    const valid = verifySignature(rawBody, req.headers.get("paymongo-signature"), secret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("PAYMONGO_WEBHOOK_SECRET not set — accepting webhook unverified");
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventType = event?.data?.attributes?.type;

  if (eventType === "checkout_session.payment.paid") {
    const session = event.data.attributes.data;
    const sessionId = session?.id;
    if (!sessionId) return NextResponse.json({ received: true });

    // Flip order to paid — only if still pending (webhooks can retry)
    const { data: order } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("paymongo_session_id", sessionId)
      .eq("status", "pending")
      .select()
      .single();

    if (order) {
      sendOrderConfirmation({
        customerName: `${order.customer_first_name} ${order.customer_last_name}`,
        customerEmail: order.customer_email,
        productName: order.product_name,
        size: order.size,
        quantity: order.quantity,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        total: order.total,
        shippingAddress: `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_province} ${order.shipping_zip}`,
      }).catch((err) => console.error("Confirmation email failed:", err));

      sendAdminAlert(
        `💰 New paid order — ${order.product_name} (₱${order.total.toLocaleString()})`,
        `<p style="font-size:15px;line-height:1.8;color:#564c45;margin:0 0 12px">
           <strong style="color:#303d30">${order.customer_first_name} ${order.customer_last_name}</strong> just paid
           <strong style="color:#303d30">₱${order.total.toLocaleString()}</strong> for
           ${order.product_name} · Size ${order.size} × ${order.quantity}.
         </p>
         <p style="font-size:13px;color:#564c45;margin:0">Ship to: ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_province}</p>`
      ).catch((err) => console.error("Admin alert failed:", err));
    }
  }

  return NextResponse.json({ received: true });
}
