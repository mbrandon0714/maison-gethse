import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, quantity, size, customer } = body;

    const lineItems = [
      {
        currency: "PHP",
        amount: price * 100, // PayMongo uses centavos
        name: `${name} — Size ${size}`,
        quantity: quantity,
      },
      {
        currency: "PHP",
        amount: 80 * 100, // ₱80 shipping
        name: "Shipping — Nationwide Flat Rate",
        quantity: 1,
      },
    ];

    const origin = req.headers.get("origin") || "https://maison-gethse.vercel.app";

    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: lineItems,
            payment_method_types: ["gcash", "paymaya", "card", "qrph"],
            success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/chapters/01`,
            description: `Maison Gethse — ${name} (Size ${size} × ${quantity})`,
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            metadata: {
              customer_name: `${customer.firstName} ${customer.lastName}`,
              customer_email: customer.email,
              customer_phone: customer.phone,
              shipping_address: `${customer.address}, ${customer.city}, ${customer.province} ${customer.zip}`,
              product: name,
              size: size,
              quantity: String(quantity),
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayMongo error:", data);
      return NextResponse.json({ error: data.errors?.[0]?.detail || "Payment failed" }, { status: 400 });
    }

    const checkoutUrl = data.data.attributes.checkout_url;
    const sessionId = data.data.id;

    // Save order to Supabase
    await supabase.from("orders").insert({
      paymongo_session_id: sessionId,
      product_name: name,
      size,
      quantity,
      subtotal: price * quantity,
      shipping_fee: 80,
      total: price * quantity + 80,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: customer.address,
      shipping_city: customer.city,
      shipping_province: customer.province,
      shipping_zip: customer.zip || "",
      status: "paid",
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmation({
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      productName: name,
      size,
      quantity,
      subtotal: price * quantity,
      shippingFee: 80,
      total: price * quantity + 80,
      shippingAddress: `${customer.address}, ${customer.city}, ${customer.province} ${customer.zip}`,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
