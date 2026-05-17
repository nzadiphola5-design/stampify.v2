import { NextRequest, NextResponse } from "next/server";

const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stampify-v2.vercel.app";

function getCredentials() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!b64 || b64.includes("BASE64")) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

async function getAuthHeaders(credentials: any): Promise<Record<string, string>> {
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });
  const client = await auth.getClient();
  return (await client.getRequestHeaders()) as Record<string, string>;
}

async function ensureLoyaltyClass(
  credentials: any,
  issuerId: string,
  classId: string,
  businessName: string
) {
  const fullClassId = `${issuerId}.${classId}`;
  const headers = await getAuthHeaders(credentials);

  const check = await fetch(`${WALLET_API}/loyaltyClass/${fullClassId}`, { headers });
  if (check.ok) return; // already exists

  const loyaltyClass = {
    id: fullClassId,
    issuerName: "Stampify",
    programName: businessName,
    programLogo: {
      sourceUri: { uri: `${APP_URL}/icon-192.png` },
      contentDescription: {
        defaultValue: { language: "fr-CA", value: businessName },
      },
    },
    hexBackgroundColor: "#6366f1",
    reviewStatus: "UNDER_REVIEW",
  };

  await fetch(`${WALLET_API}/loyaltyClass`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(loyaltyClass),
  });
}

function buildLoyaltyObject({
  issuerId, classId, objectId, customerName, businessName,
  stamps, goal, reward, mode, points, cardId,
}: {
  issuerId: string; classId: string; objectId: string; customerName: string;
  businessName: string; stamps: number; goal: number; reward: string;
  mode: string; points: number; cardId: string;
}) {
  const loyaltyPoints =
    mode === "stamps"
      ? {
          label: "Tampons",
          balance: { int: stamps },
          localizedLabel: { defaultValue: { language: "fr", value: "Tampons" } },
        }
      : {
          label: "Points",
          balance: { int: points },
          localizedLabel: { defaultValue: { language: "fr", value: "Points" } },
        };

  return {
    id: objectId,
    classId: `${issuerId}.${classId}`,
    state: "ACTIVE",
    accountId: cardId,
    accountName: customerName,
    loyaltyPoints,
    textModulesData: [
      { header: "Récompense", body: reward, id: "reward" },
      {
        header: mode === "stamps" ? "Progression" : "Solde",
        body: mode === "stamps" ? `${stamps}/${goal} tampons` : `${points} points`,
        id: "progress",
      },
    ],
    barcode: {
      type: "QR_CODE",
      value: `stampify://card/${cardId}`,
      alternateText: customerName,
    },
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    cardId, businessId, customerName = "Client",
    stamps = 0, goal = 10, reward = "", businessName = "Stampify",
    mode = "stamps", points = 0,
  } = body;

  if (!cardId || !businessId) {
    return NextResponse.json({ error: "cardId and businessId are required" }, { status: 400 });
  }

  const credentials = getCredentials();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || "";
  const classId = process.env.GOOGLE_WALLET_CLASS_ID || "stampify-loyalty";
  const objectId = `${issuerId}.${businessId}-${cardId}`;

  // Demo mode — not configured
  if (!credentials || !issuerId || issuerId.includes("YOUR")) {
    return NextResponse.json({
      demo: true,
      message: "Google Wallet not configured. Add GOOGLE_* env vars to Vercel.",
    });
  }

  try {
    // Create class if missing
    await ensureLoyaltyClass(credentials, issuerId, classId, businessName);

    const loyaltyObject = buildLoyaltyObject({
      issuerId, classId, objectId, customerName, businessName,
      stamps, goal, reward, mode, points, cardId,
    });

    const { default: jwt } = await import("jsonwebtoken");
    const claims = {
      iss: credentials.client_email,
      aud: "google",
      origins: [APP_URL],
      typ: "savetowallet",
      payload: { loyaltyObjects: [loyaltyObject] },
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(claims, credentials.private_key, { algorithm: "RS256" });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return NextResponse.json({ saveUrl, objectId });
  } catch (err: any) {
    console.error("Google Wallet error:", err);
    return NextResponse.json(
      { error: "Failed to generate Google Wallet pass", details: err.message },
      { status: 500 }
    );
  }
}
