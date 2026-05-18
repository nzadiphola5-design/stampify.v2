import { NextResponse } from "next/server";

function getCredentials() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!b64) return null;
  try { return JSON.parse(Buffer.from(b64, "base64").toString("utf-8")); }
  catch { try { return JSON.parse(b64); } catch { return null; } }
}

async function signJWT(payload: object, privateKeyPem: string): Promise<string> {
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const header = { alg: "RS256", typ: "JWT" };
  const signingInput = `${encode(header)}.${encode(payload)}`;
  const pemContents = privateKeyPem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s/g, "");
  const cryptoKey = await crypto.subtle.importKey("pkcs8", Buffer.from(pemContents, "base64"), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, Buffer.from(signingInput));
  return `${signingInput}.${Buffer.from(signature).toString("base64url")}`;
}

export async function GET() {
  const results: Record<string, any> = {};
  const creds = getCredentials();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || "";
  const classId = process.env.GOOGLE_WALLET_CLASS_ID || "stampify-loyalty";
  const fullClassId = `${issuerId}.${classId}`;

  results.config = { issuerId, classId, fullClassId };

  if (!creds) return NextResponse.json({ error: "Cannot parse credentials" });

  // Get OAuth token
  let accessToken = "";
  try {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = { iss: creds.client_email, sub: creds.client_email, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600, scope: "https://www.googleapis.com/auth/wallet_object.issuer" };
    const signed = await signJWT(jwtPayload, creds.private_key);
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: signed }),
    });
    const data = await res.json();
    if (data.access_token) { accessToken = data.access_token; results.oauth = "✅ Token OK"; }
    else { results.oauth = `❌ ${JSON.stringify(data)}`; return NextResponse.json(results); }
  } catch (e: any) { results.oauth = `❌ ${e.message}`; return NextResponse.json(results); }

  const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

  // Try to list classes for this issuer
  const listRes = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass?issuerId=${issuerId}`, { headers });
  const listData = await listRes.json();
  results.list_classes = listRes.ok ? `✅ ${JSON.stringify(listData).substring(0, 200)}` : `❌ ${listRes.status}: ${JSON.stringify(listData.error)}`;

  // Try to create the class
  const createRes = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass`, {
    method: "POST", headers,
    body: JSON.stringify({
      id: fullClassId,
      issuerName: "Stampify",
      programName: "Test",
      hexBackgroundColor: "#6366f1",
      reviewStatus: "UNDER_REVIEW",
    }),
  });
  const createData = await createRes.json();
  if (createRes.ok) results.create_class = `✅ Class created: ${createData.id}`;
  else if (createRes.status === 409) results.create_class = `✅ Class already exists (409 conflict)`;
  else results.create_class = `❌ ${createRes.status}: ${JSON.stringify(createData.error)}`;

  return NextResponse.json(results);
}
