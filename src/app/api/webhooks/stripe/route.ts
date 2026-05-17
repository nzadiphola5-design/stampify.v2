import { NextRequest, NextResponse } from "next/server";
import { getStripeConfig, isStripeConfigured } from "@/lib/stripe-config";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!isStripeConfigured()) {
    return NextResponse.json({ received: true, demo: true });
  }

  const config = getStripeConfig();

  if (!sig || !config.webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: any;
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(config.secretKey, { apiVersion: "2024-06-20" });
    event = stripe.webhooks.constructEvent(body, sig, config.webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { businessId, plan } = session.metadata || {};
      console.log(`✅ Subscription activated: business=${businessId} plan=${plan}`);
      // TODO: update businesses table in Supabase
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      console.log(`🔄 Subscription updated: status=${sub.status}`);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      console.log(`❌ Subscription canceled: business=${sub.metadata?.businessId}`);
      break;
    }
    case "invoice.payment_failed": {
      console.log(`💳 Payment failed: customer=${event.data.object.customer}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
