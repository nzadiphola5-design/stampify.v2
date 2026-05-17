import { NextRequest, NextResponse } from "next/server";
import { getStripeConfig, isStripeConfigured } from "@/lib/stripe-config";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerId } = body;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!isStripeConfigured()) {
    return NextResponse.json({
      demo: true,
      portalUrl: `${appUrl}/dashboard/settings?tab=Plan`,
    });
  }

  if (!customerId) {
    return NextResponse.json({ error: "customerId is required" }, { status: 400 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const config = getStripeConfig();
    const stripe = new Stripe(config.secretKey, { apiVersion: "2024-06-20" });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/settings?tab=Plan`,
    });

    return NextResponse.json({ portalUrl: session.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ error: "Échec portail Stripe", details: err.message }, { status: 500 });
  }
}
