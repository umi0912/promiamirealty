import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe Checkout. Активируется, когда в Vercel заданы переменные окружения:
//   STRIPE_SECRET_KEY   — секретный ключ Stripe (sk_live_... или sk_test_...)
//   NEXT_PUBLIC_SITE_URL — например https://promiamirealty.com
// Без ключа route отвечает {configured:false} — фронтенд покажет "оплата скоро".

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://promiamirealty.com";

  if (!key) {
    return NextResponse.json({ configured: false });
  }

  try {
    const { price, title, planId, origin } = await req.json();
    const base = origin || site;
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: title || "PRO MIAMI REALTY service" },
          unit_amount: Math.round((price || 0) * 100),
        },
        quantity: 1,
      }],
      metadata: { planId: planId || "" },
      success_url: `${base}/services?paid=1`,
      cancel_url: `${base}/services?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ configured: false, error: "checkout_failed" }, { status: 400 });
  }
}
