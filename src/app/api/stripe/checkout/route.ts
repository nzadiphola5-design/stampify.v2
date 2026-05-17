import { NextRequest, NextResponse } from "next/server";
import { getStripeConfig, isStripeConfigured } from "@/lib/stripe-config";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { plan, businessId, userId, email } = body;
  const config = getStripeConfig();

  const priceId = plan === "growth" ? config.priceGrowth : plan === "pro" ? config.pricePro : null;
  if (!plan || !priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!isStripeConfigured()) {
    return NextResponse.json({
      demo: true,
      message: "Stripe non configuré. Allez dans Admin → Paramètres → Stripe pour configurer.",
      checkoutUrl: `${appUrl}/dashboard/settings?plan=${plan}&demo=1`,
    });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(config.secretKey, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?plan_success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/settings?tab=Plan`,
      customer_email: email,
      metadata: { businessId, userId, plan },
      subscription_data: { metadata: { businessId, userId, plan } },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Échec de la création de session", details: err.message }, { status: 500 });
  }
}
