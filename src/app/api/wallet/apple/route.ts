import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────────────────────
// Apple Wallet PKPass generation endpoint
// POST /api/wallet/apple
// Body: { cardId, businessId, customerName, stamps, goal, reward, businessName }
// ──────────────────────────────────────────────────────────────

const IS_CONFIGURED =
  process.env.APPLE_TEAM_ID &&
  !process.env.APPLE_TEAM_ID.includes("YOUR") &&
  process.env.APPLE_SIGNER_CERT &&
  !process.env.APPLE_SIGNER_CERT.includes("BASE64");

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cardId, businessId, customerName, stamps = 0, goal = 10, reward = "", businessName = "Stampify", mode = "stamps", points = 0 } = body;

  if (!cardId || !businessId) {
    return NextResponse.json({ error: "cardId and businessId are required" }, { status: 400 });
  }

  const passSerial = `${businessId}-${cardId}-${Date.now()}`;

  // ── Demo / unconfigured: return pass metadata JSON instead of .pkpass ──
  if (!IS_CONFIGURED) {
    return NextResponse.json({
      demo: true,
      message: "Apple Wallet certificates not configured. Add APPLE_* variables to .env.local to generate real .pkpass files.",
      passData: buildPassJson({ passSerial, customerName, businessName, businessId, stamps, goal, reward, mode, points }),
      instructions: "https://developer.apple.com/documentation/walletpasses",
    });
  }

  // ── Real .pkpass generation ──
  try {
    const { PKPass } = await import("passkit-generator");

    const wwdrCert = Buffer.from(process.env.APPLE_WWDR_CERT!, "base64").toString("utf-8");
    const signerCert = Buffer.from(process.env.APPLE_SIGNER_CERT!, "base64").toString("utf-8");
    const signerKey = Buffer.from(process.env.APPLE_SIGNER_KEY!, "base64").toString("utf-8");

    const pass = new PKPass({}, {
      wwdr: wwdrCert,
      signerCert,
      signerKey,
      signerKeyPassphrase: process.env.APPLE_SIGNER_KEY_PASSPHRASE,
    }, buildPassJson({ passSerial, customerName, businessName, businessId, stamps, goal, reward, mode, points }));

    const buffer = await pass.getAsBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="stampify-${businessName.toLowerCase().replace(/\s+/g, "-")}.pkpass"`,
      },
    });
  } catch (err: any) {
    console.error("PKPass generation error:", err);
    return NextResponse.json({ error: "Failed to generate pass", details: err.message }, { status: 500 });
  }
}

function buildPassJson({ passSerial, customerName, businessName, businessId, stamps, goal, reward, mode, points }: {
  passSerial: string; customerName: string; businessName: string; businessId: string;
  stamps: number; goal: number; reward: string; mode: string; points: number;
}) {
  const progressText = mode === "stamps"
    ? `${stamps} / ${goal} — ${goal - stamps > 0 ? `encore ${goal - stamps} pour` : "🎁"} ${reward}`
    : `${points} points — ${reward}`;

  return {
    formatVersion: 1,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || "pass.app.stampify.loyalty",
    serialNumber: passSerial,
    teamIdentifier: process.env.APPLE_TEAM_ID || "STAMPIFY1",
    organizationName: businessName,
    description: `Carte de fidélité ${businessName}`,
    logoText: businessName,
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(15, 23, 42)",
    labelColor: "rgb(148, 163, 184)",
    storeCard: {
      headerFields: [
        { key: "progress", label: "Progression", value: progressText },
      ],
      primaryFields: [
        { key: "customerName", label: "Client", value: customerName },
      ],
      secondaryFields: [
        { key: "reward", label: "Récompense", value: reward },
        {
          key: "stamps",
          label: mode === "stamps" ? "Tampons" : "Points",
          value: mode === "stamps" ? `${stamps}/${goal}` : `${points}`,
          numberStyle: "PKNumberStyleDecimal",
        },
      ],
      backFields: [
        { key: "info", label: "Programme de fidélité", value: `Accumulation: ${mode === "stamps" ? `${goal} visites = ${reward}` : `Points par dollar dépensé = ${reward}`}` },
        { key: "contact", label: "À propos", value: "Powered by Stampify · stampify.app" },
      ],
    },
    barcode: {
      message: `stampify://card/${passSerial}`,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
      altText: customerName,
    },
    barcodes: [
      {
        message: `stampify://card/${passSerial}`,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1",
        altText: customerName,
      },
    ],
    webServiceURL: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/wallet/apple-push`
      : undefined,
    authenticationToken: passSerial,
  };
}
