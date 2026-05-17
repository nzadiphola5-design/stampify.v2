import { readFileSync, existsSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), ".stripe-config.json");

function readFile() {
  if (!existsSync(CONFIG_PATH)) return {};
  try { return JSON.parse(readFileSync(CONFIG_PATH, "utf-8")); } catch { return {}; }
}

export function getStripeConfig() {
  const f = readFile();
  return {
    secretKey: process.env.STRIPE_SECRET_KEY || f.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || f.STRIPE_WEBHOOK_SECRET || "",
    priceGrowth: process.env.STRIPE_PRICE_GROWTH || f.STRIPE_PRICE_GROWTH || "",
    pricePro: process.env.STRIPE_PRICE_PRO || f.STRIPE_PRICE_PRO || "",
  };
}

export function isStripeConfigured() {
  const c = getStripeConfig();
  return !!(c.secretKey && !c.secretKey.includes("YOUR") && c.priceGrowth && c.pricePro);
}
