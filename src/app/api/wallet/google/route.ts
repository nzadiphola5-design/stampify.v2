import { NextRequest, NextResponse } from "next/server";

const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stampify-v2.vercel.app";

function getCredentials() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!b64 || b64.includes("BASE64")) return null;
  try {
    const json = Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    // Maybe it's raw JSON, not base64
    try {
      return JSON.parse(b64);
    } catch {
      return null;
    }
  }
}

// Sign JWT using Web Crypto API (no external dependency issues)
async function signJWT(payload: object, privateKeyPem: string): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Import PEM private key
  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const keyBuffer = Buffer.from(pemContents, "base64");

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    Buffer.from(signingInput)
  );

  const sig = Buffer.from(signature).toString("base64url");
  return `${signingInput}.${sig}`;
}

async function getAccessToken(credentials: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/wallet_object.issuer",
  };

  const signedJwt = await signJWT(jwtPayload, credentials.private_key);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`OAuth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function ensureLoyaltyClass(
  accessToken: string,
  issuerId: string,
  classId: string,
  businessName: string
) {
  const fullClassId = `${issuerId}.${classId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const check = await fetch(`${WALLET_API}/loyaltyClass/${encodeURIComponent(fullClassId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (check.ok) return;

  const loyaltyClass = {
    id: fullClassId,
    issuerName: "Stampify",
    programName: businessName,
    hexBackgroundColor: "#6366f1",
    reviewStatus: "UNDER_REVIEW",
  };

  const createRes = await fetch(`${WALLET_API}/loyaltyClass`, {
    method: "POST",
    headers,
    body: JSON.stringify(loyaltyClass),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Class creation failed: ${err}`);
  }
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

  if (!credentials || !issuerId || issuerId.includes("YOUR")) {
    return NextResponse.json({
      demo: true,
      message: "Google Wallet not configured.",
    });
  }

  try {
    const accessToken = await getAccessToken(credentials);
    await ensureLoyaltyClass(accessToken, issuerId, classId, businessName);

    const objectId = `${issuerId}.${businessId.replace(/-/g, "")}-${cardId.replace(/-/g, "")}`;
    const fullClassId = `${issuerId}.${classId}`;

    const loyaltyPoints =
      mode === "stamps"
        ? { label: "Tampons", balance: { int: stamps } }
        : { label: "Points", balance: { int: points } };

    const loyaltyObject = {
      id: objectId,
      classId: fullClassId,
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

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: credentials.client_email,
      aud: "google",
      origins: [APP_URL],
      typ: "savetowallet",
      payload: { loyaltyObjects: [loyaltyObject] },
      iat: now,
    };

    const token = await signJWT(jwtPayload, credentials.private_key);
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return NextResponse.json({ saveUrl, objectId });
  } catch (err: any) {
    console.error("Google Wallet error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to generate Google Wallet pass", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
