import { NextResponse } from "next/server";

function getCredentials() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!b64) return { error: "GOOGLE_SERVICE_ACCOUNT_JSON is missing" };
  try {
    const json = Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    try { return JSON.parse(b64); } catch { return { error: "Cannot parse credentials" }; }
  }
}

async function signJWT(payload: object, privateKeyPem: string): Promise<string> {
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const header = { alg: "RS256", typ: "JWT" };
  const signingInput = `${encode(header)}.${encode(payload)}`;
  const pemContents = privateKeyPem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s/g, "");
  const keyBuffer = Buffer.from(pemContents, "base64");
  const cryptoKey = await crypto.subtle.importKey("pkcs8", keyBuffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, Buffer.from(signingInput));
  return `${signingInput}.${Buffer.from(signature).toString("base64url")}`;
}

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Check env vars
  results.env = {
    issuer_id: process.env.GOOGLE_WALLET_ISSUER_ID ? "✅ set" : "❌ missing",
    class_id: process.env.GOOGLE_WALLET_CLASS_ID ? "✅ set" : "❌ missing",
    service_account: process.env.GOOGLE_SERVICE_ACCOUNT_JSON ? "✅ set" : "❌ missing",
  };

  // 2. Parse credentials
  const creds = getCredentials();
  if (creds.error) { results.credentials = `❌ ${creds.error}`; return NextResponse.json(results); }
  results.credentials = { client_email: creds.client_email ?? "missing", has_private_key: !!creds.private_key };

  // 3. Get OAuth token
  try {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = { iss: creds.client_email, sub: creds.client_email, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600, scope: "https://www.googleapis.com/auth/wallet_object.issuer" };
    const signedJwt = await signJWT(jwtPayload, creds.private_key);
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: signedJwt }),
    });
    const tokenData = await res.json();
    if (tokenData.access_token) {
      results.oauth = "✅ Access token obtained";

      // 4. Check loyalty class
      const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
      const classId = process.env.GOOGLE_WALLET_CLASS_ID!;
      const fullClassId = `${issuerId}.${classId}`;
      const classRes = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${encodeURIComponent(fullClassId)}`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const classData = await classRes.json();
      results.loyalty_class = classRes.ok ? `✅ Class exists: ${classData.id}` : `❌ Class not found: ${JSON.stringify(classData.error)}`;
    } else {
      results.oauth = `❌ Token failed: ${JSON.stringify(tokenData)}`;
    }
  } catch (e: any) {
    results.oauth = `❌ Exception: ${e.message}`;
  }

  return NextResponse.json(results, { status: 200 });
}
