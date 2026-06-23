import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  productName: string;
  size: string;
  quantity: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: string;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  await getResend().emails.send({
    from: `Maison Gethse <${fromEmail}>`,
    to: data.customerEmail,
    subject: `Your chapter is being prepared — Order Confirmed`,
    html: `
      <div style="max-width:520px;margin:0 auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a1a18;padding:40px 24px;background:#f4f1ec">
        <div style="text-align:center;margin-bottom:32px">
          <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c8922a;margin:0 0 8px">Maison Gethse</p>
          <h1 style="font-size:24px;font-weight:300;font-style:italic;color:#303d30;margin:0;line-height:1.4">You now carry a chapter.</h1>
        </div>

        <div style="height:1px;background:#d8d4ce;margin:24px 0"></div>

        <p style="font-size:15px;line-height:1.8;color:#564c45;margin:0 0 24px">
          Thank you, <strong style="color:#303d30">${data.customerName}</strong>. Your order has been confirmed and we're preparing your artifact with care.
        </p>

        <div style="background:#fff;border:1px solid #ece8e1;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c8922a;margin:0 0 12px">Order Details</p>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:15px;color:#303d30;font-weight:500">${data.productName}</span>
            <span style="font-size:15px;color:#303d30">₱${data.subtotal.toLocaleString()}</span>
          </div>
          <p style="font-size:13px;color:#564c45;margin:0 0 16px">Size ${data.size} · Qty ${data.quantity}</p>
          <div style="height:1px;background:#ece8e1;margin:12px 0"></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:13px;color:#564c45">Shipping</span>
            <span style="font-size:13px;color:#303d30">₱${data.shippingFee}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:2px solid #ece8e1;margin-top:8px">
            <span style="font-size:16px;font-weight:500;color:#303d30">Total</span>
            <span style="font-size:16px;font-weight:500;color:#303d30">₱${data.total.toLocaleString()}</span>
          </div>
        </div>

        <div style="background:#fff;border:1px solid #ece8e1;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c8922a;margin:0 0 8px">Shipping To</p>
          <p style="font-size:14px;color:#564c45;line-height:1.7;margin:0">${data.shippingAddress}</p>
        </div>

        <div style="background:#fff;border:1px solid #ece8e1;padding:16px 20px;margin-bottom:32px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#564c45">Shipping</span>
            <span style="font-size:13px;color:#303d30">J&T Express · 3-5 business days</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#564c45">Status</span>
            <span style="font-size:13px;color:#c8922a;font-weight:500">Processing</span>
          </div>
        </div>

        <div style="height:1px;background:#d8d4ce;margin:24px 0"></div>

        <p style="font-size:13px;line-height:1.8;color:#564c45;text-align:center;margin:0 0 8px">
          You'll receive a tracking number once your order ships.
        </p>
        <p style="font-size:12px;color:#564c45;opacity:0.5;text-align:center;margin:0">
          © 2026 Maison Gethse · A sanctuary of becoming.
        </p>
      </div>
    `,
  });
}
