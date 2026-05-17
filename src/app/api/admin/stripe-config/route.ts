import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Stores Stripe config in .stripe-config.json at project root
// In production with Supabase: store encrypted in a platform_config table instead
const CONFIG_PATH = join(process.cwd(), ".stripe-config.json");

function readConfig() {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeConfig(config: Record<string, string>) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

// GET /api/admin/stripe-config — returns config with masked secret key
export async function GET() {
  const config = readConfig();
  return NextResponse.json({
    hasSecretKey: !!config.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!config.STRIPE_WEBHOOK_SECRET,
    hasPriceGrowth: !!config.STRIPE_PRICE_GROWTH,
    hasPricePro: !!config.STRIPE_PRICE_PRO,
    secretKeyMasked: config.STRIPE_SECRET_KEY
      ? config.STRIPE_SECRET_KEY.slice(0, 7) + "••••••••" + config.STRIPE_SECRET_KEY.slice(-4)
      : "",
    webhookSecretMasked: config.STRIPE_WEBHOOK_SECRET
      ? "whsec_••••••••" + config.STRIPE_WEBHOOK_SECRET.slice(-4)
      : "",
    priceGrowth: config.STRIPE_PRICE_GROWTH || "",
    pricePro: config.STRIPE_PRICE_PRO || "",
    isConfigured: !!(config.STRIPE_SECRET_KEY && config.STRIPE_PRICE_GROWTH && config.STRIPE_PRICE_PRO),
  });
}

// POST /api/admin/stripe-config — save config
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { secretKey, webhookSecret, priceGrowth, pricePro } = body;

  if (!secretKey || !priceGrowth || !pricePro) {
    return NextResponse.json({ error: "secretKey, priceGrowth and pricePro are required" }, { status: 400 });
  }

  // Validate the secret key by calling Stripe
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
    await stripe.accounts.retrieve(); // lightweight check
  } catch (err: any) {
    if (err.type === "StripeAuthenticationError") {
      return NextResponse.json({ error: "Clé API Stripe invalide. Vérifiez votre Secret Key." }, { status: 400 });
    }
    // Other errors (network, etc.) — don't block saving
  }

  const existing = readConfig();
  writeConfig({
    ...existing,
    STRIPE_SECRET_KEY: secretKey,
    ...(webhookSecret && { STRIPE_WEBHOOK_SECRET: webhookSecret }),
    STRIPE_PRICE_GROWTH: priceGrowth,
    STRIPE_PRICE_PRO: pricePro,
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/stripe-config — clear config
export async function DELETE() {
  writeConfig({});
  return NextResponse.json({ success: true });
}

// Export config loader for use in other routes
export function getStripeConfig() {
  const config = readConfig();
  return {
    secretKey: process.env.STRIPE_SECRET_KEY || config.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || config.STRIPE_WEBHOOK_SECRET || "",
    priceGrowth: process.env.STRIPE_PRICE_GROWTH || config.STRIPE_PRICE_GROWTH || "",
    pricePro: process.env.STRIPE_PRICE_PRO || config.STRIPE_PRICE_PRO || "",
  };
}
