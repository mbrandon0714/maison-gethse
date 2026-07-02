import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SITE = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://maison-gethse.marknitor.workers.dev";

/* ═══════════════════════════════════════════════════════════
   SHARED SHELL — every Maison Gethse email lives in this frame.
   Email-safe: inline styles only, Georgia as the serif voice.
   ═══════════════════════════════════════════════════════════ */

interface ShellOptions {
  title: string; // serif italic headline
  bodyHtml: string; // inner content blocks
  preheader?: string; // hidden inbox preview line
  footerNote?: string; // small line above the copyright
  unsubscribeUrl?: string; // present on newsletter-type emails only
}

function emailShell({ title, bodyHtml, preheader, footerNote, unsubscribeUrl }: ShellOptions) {
  return `
    <div style="background:#f4f1ec;padding:32px 12px">
      ${
        preheader
          ? `<span style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</span>`
          : ""
      }
      <div style="max-width:520px;margin:0 auto;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a1a18;padding:40px 24px;background:#f4f1ec">
        <div style="text-align:center;margin-bottom:32px">
          <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c8922a;margin:0 0 8px">Maison Gethse</p>
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;font-style:italic;color:#303d30;margin:0;line-height:1.4">${title}</h1>
        </div>

        <div style="height:1px;background:#d8d4ce;margin:24px 0"></div>

        ${bodyHtml}

        <div style="height:1px;background:#d8d4ce;margin:24px 0"></div>

        ${
          footerNote
            ? `<p style="font-size:13px;line-height:1.8;color:#564c45;text-align:center;margin:0 0 8px">${footerNote}</p>`
            : ""
        }
        <p style="font-size:12px;color:#564c45;opacity:0.5;text-align:center;margin:0">
          © 2026 Maison Gethse · A sanctuary of becoming.
        </p>
        ${
          unsubscribeUrl
            ? `<p style="font-size:11px;text-align:center;margin:12px 0 0"><a href="${unsubscribeUrl}" style="color:#564c45;opacity:0.5;text-decoration:underline">Release my address — no more letters</a></p>`
            : ""
        }
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   ADMIN ALERT — notify the owner when something needs attention
   ═══════════════════════════════════════════════════════════ */

export async function sendAdminAlert(subject: string, bodyHtml: string) {
  if (!process.env.RESEND_API_KEY) return;
  const adminEmail = process.env.ADMIN_EMAIL || "maisongethse@gmail.com";

  await getResend().emails.send({
    from: `Maison Gethse <${FROM()}>`,
    to: adminEmail,
    subject,
    html: `
      <div style="max-width:520px;margin:0 auto;font-family:Helvetica,Arial,sans-serif;padding:32px 24px;background:#f4f1ec;color:#1a1a18">
        <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#c8922a;margin:0 0 16px">Maison Gethse · Admin</p>
        ${bodyHtml}
        <div style="height:1px;background:#d8d4ce;margin:24px 0"></div>
        <p style="font-size:12px;color:#564c45;opacity:0.6;margin:0">Manage this in your <a href="${SITE()}/admin" style="color:#c8922a">admin panel</a>.</p>
      </div>
    `,
  });
}

/* ═══════════════════════════════════════════════════════════
   ORDER CONFIRMATION
   ═══════════════════════════════════════════════════════════ */

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

  await getResend().emails.send({
    from: `Maison Gethse <${FROM()}>`,
    to: data.customerEmail,
    subject: `Your chapter is being prepared — Order Confirmed`,
    html: emailShell({
      title: "You now carry a chapter.",
      preheader: `Order confirmed — ${data.productName}, size ${data.size}.`,
      bodyHtml: `
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

        <div style="background:#fff;border:1px solid #ece8e1;padding:16px 20px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#564c45">Shipping</span>
            <span style="font-size:13px;color:#303d30">J&T Express · 3-5 business days</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#564c45">Status</span>
            <span style="font-size:13px;color:#c8922a;font-weight:500">Processing</span>
          </div>
        </div>
      `,
      footerNote: "You'll receive a tracking number once your order ships.",
    }),
  });
}

/* ═══════════════════════════════════════════════════════════
   SHIPPING NOTIFICATION
   ═══════════════════════════════════════════════════════════ */

interface ShippingEmailData {
  customerName: string;
  customerEmail: string;
  productName: string;
  trackingNumber: string;
}

export async function sendShippingNotification(data: ShippingEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  await getResend().emails.send({
    from: `Maison Gethse <${FROM()}>`,
    to: data.customerEmail,
    subject: `Your chapter is on its way — Order Shipped`,
    html: emailShell({
      title: "Your chapter is on its way.",
      preheader: `${data.productName} has shipped — tracking ${data.trackingNumber}.`,
      bodyHtml: `
        <p style="font-size:15px;line-height:1.8;color:#564c45;margin:0 0 24px">
          Good news, <strong style="color:#303d30">${data.customerName}</strong> — your <strong style="color:#303d30">${data.productName}</strong> has shipped and is travelling to you now.
        </p>

        <div style="background:#fff;border:1px solid #ece8e1;padding:20px;text-align:center">
          <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#c8922a;margin:0 0 10px">Tracking Number</p>
          <p style="font-size:20px;font-family:monospace;color:#303d30;margin:0 0 12px;letter-spacing:0.05em">${data.trackingNumber}</p>
          <a href="https://www.jtexpress.ph/trajectoryQuery?waybillNo=${encodeURIComponent(data.trackingNumber)}" style="display:inline-block;padding:12px 28px;background:#303d30;color:#fff;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none">Track My Order</a>
        </div>
      `,
      footerNote: "Delivery via J&T Express · usually 3–5 business days.",
    }),
  });
}

/* ═══════════════════════════════════════════════════════════
   NEWSLETTER WELCOME — "the first letter"
   ═══════════════════════════════════════════════════════════ */

export async function sendNewsletterWelcome({
  to,
  unsubscribeUrl,
}: {
  to: string;
  unsubscribeUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  await getResend().emails.send({
    from: `Maison Gethse <${FROM()}>`,
    to,
    subject: `The first letter — welcome to the Maison`,
    html: emailShell({
      title: "You've left your address.",
      preheader: "When the next chapter opens, we'll write to you first.",
      bodyHtml: `
        <p style="font-size:15px;line-height:1.9;color:#564c45;margin:0 0 20px">
          Thank you for letting us write to you. This is not a mailing list — it's a correspondence.
        </p>
        <p style="font-size:15px;line-height:1.9;color:#564c45;margin:0 0 20px">
          When the next chapter opens, you'll hear it here first — the story behind it, the person it honors, and the artifacts that carry it. Nothing more. No noise.
        </p>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-style:italic;line-height:1.9;color:#303d30;margin:0 0 28px;text-align:center">
          "Every story begins with a key."
        </p>
        <div style="text-align:center">
          <a href="${SITE()}" style="display:inline-block;padding:13px 30px;background:#303d30;color:#fff;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none">Return to the Maison</a>
        </div>
      `,
      footerNote: "Letters arrive only when something is worth saying.",
      unsubscribeUrl,
    }),
  });
}

/* ═══════════════════════════════════════════════════════════
   DROP ANNOUNCEMENT — sent when a new chapter / artifact opens.
   Renders per-recipient so each letter carries its own
   unsubscribe link.
   ═══════════════════════════════════════════════════════════ */

interface DropAnnouncementData {
  to: string;
  chapterLabel: string; // e.g. "Chapter 01 — Before We Knew"
  title: string; // e.g. "The second artifact has arrived."
  excerpt: string; // short story excerpt / description
  ctaUrl: string; // link to the chapter page
  unsubscribeUrl: string;
}

export async function sendDropAnnouncement(data: DropAnnouncementData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  await getResend().emails.send({
    from: `Maison Gethse <${FROM()}>`,
    to: data.to,
    subject: `${data.chapterLabel} — a letter from the Maison`,
    html: emailShell({
      title: data.title,
      preheader: data.excerpt.slice(0, 120),
      bodyHtml: `
        <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#c8922a;text-align:center;margin:0 0 20px">${data.chapterLabel}</p>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-style:italic;line-height:1.9;color:#303d30;margin:0 0 28px;text-align:center">
          ${data.excerpt}
        </p>
        <div style="text-align:center">
          <a href="${data.ctaUrl}" style="display:inline-block;padding:13px 30px;background:#303d30;color:#fff;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none">Enter the Chapter</a>
        </div>
      `,
      footerNote: "You're receiving this because you left your address at the Maison.",
      unsubscribeUrl: data.unsubscribeUrl,
    }),
  });
}
