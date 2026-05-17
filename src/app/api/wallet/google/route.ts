import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────────────────────
// Google Wallet Loyalty Object generation endpoint
// POST /api/wallet/google
// Body: { cardId, businessId, customerName, stamps, goal, reward, businessName, mode, points }
// ──────────────────────────────────────────────────────────────

const IS_CONFIGURED =
  process.env.GOOGLE_WALLET_ISSUER_ID &&
  !process.env.GOOGLE_WALLET_ISSUER_ID.includes("YOUR") &&
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON &&
  !process.env.GOOGLE_SERVICE_ACCOUNT_JSON.includes("BASE64");

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    cardId, businessId, customerName,
    stamps = 0, goal = 10, reward = "", businessName = "Stampify",
    mode = "stamps", points = 0,
  } = body;

  if (!cardId || !businessId) {
    return NextResponse.json({ error: "cardId and businessId are required" }, { status: 400 });
  }

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || "STAMPIFY_ISSUER";
  const classId = process.env.GOOGLE_WALLET_CLASS_ID || "stampify.loyalty";
  const objectId = `${issuerId}.${businessId}-${cardId}`;

  // Build loyalty object
  const loyaltyObject = buildLoyaltyObject({
    issuerId, classId, objectId, customerName, businessName,
    stamps, goal, reward, mode, points, cardId,
  });

  // ── Demo / unconfigured ──
  if (!IS_CONFIGURED) {
    // Return a save URL with an unsigned JWT for demo
    const unsignedJwt = buildUnsignedJwt(loyaltyObject);
    const saveUrl = `https://pay.google.com/gp/v/save/${unsignedJwt}`;

    return NextResponse.json({
      demo: true,
      message: "Google Wallet service account not configured. Add GOOGLE_* variables to .env.local.",
      saveUrl,
      loyaltyObject,
    });
  }

  // ── Real Google Wallet JWT signing ──
  try {
    const serviceAccountJson = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!, "base64").toString("utf-8")
    );

    const { GoogleAuth } = await import("google-auth-library");
    const auth = new GoogleAuth({
      credentials: serviceAccountJson,
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });

    const client = await auth.getClient();
    const jwt = require("jsonwebtoken");
    const claims = {
      iss: serviceAccountJson.client_email,
      aud: "google",
      origins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
      typ: "savetowallet",
      payload: { loyaltyObjects: [loyaltyObject] },
    };

    const token = jwt.sign(claims, serviceAccountJson.private_key, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return NextResponse.json({ saveUrl, objectId });
  } catch (err: any) {
    console.error("Google Wallet error:", err);
    return NextResponse.json({ error: "Failed to generate Google Wallet pass", details: err.message }, { status: 500 });
  }
}

function buildLoyaltyObject({ issuerId, classId, objectId, customerName, businessName, stamps, goal, reward, mode, points, cardId }: {
  issuerId: string; classId: string; objectId: string; customerName: string;
  businessName: string; stamps: number; goal: number; reward: string;
  mode: string; points: number; cardId: string;
}) {
  const loyaltyPoints = mode === "stamps"
    ? { label: "Tampons", balance: { int: stamps }, localizedLabel: { defaultValue: { language: "fr", value: "Tampons" } } }
    : { label: "Points", balance: { int: points }, localizedLabel: { defaultValue: { language: "fr", value: "Points" } } };

  return {
    id: objectId,
    classId: `${issuerId}.${classId}`,
    state: "ACTIVE",
    accountId: cardId,
    accountName: customerName,
    loyaltyPoints,
    secondaryLoyaltyPoints: mode === "stamps" ? {
      label: "Objectif",
      balance: { int: goal },
    } : undefined,
    textModulesData: [
      { header: "Récompense", body: reward, id: "reward" },
      {
        header: mode === "stamps" ? "Progression" : "Solde",
        body: mode === "stamps" ? `${stamps}/${goal} tampons` : `${points} points`,
        id: "progress",
      },
    ],
    linksModuleData: {
      uris: [
        { uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`, description: "Stampify", id: "website" },
      ],
    },
    barcode: {
      type: "QR_CODE",
      value: `stampify://card/${cardId}`,
      alternateText: customerName,
    },
  };
}

function buildUnsignedJwt(loyaltyObject: object): string {
  // For demo only — not cryptographically signed
  const claims = {
    iss: "demo@stampify.app",
    aud: "google",
    origins: ["http://localhost:3000"],
    typ: "savetowallet",
    payload: { loyaltyObjects: [loyaltyObject] },
    iat: Math.floor(Date.now() / 1000),
  };
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${header}.${payload}.DEMO_SIGNATURE`;
}
