import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────────────────────
// Apple Wallet Push Notification endpoint
// Called by Apple to get updated pass data
// ──────────────────────────────────────────────────────────────

// Register a device to receive push notifications for a pass
export async function POST(req: NextRequest, { params }: { params: { passTypeId: string; serialNumber: string } }) {
  // In production: store deviceLibraryIdentifier + pushToken in DB
  return NextResponse.json({}, { status: 201 });
}

// Unregister a device
export async function DELETE(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}

// Return serial numbers of passes that need updating
export async function GET(req: NextRequest) {
  // In production: return array of serial numbers that changed since lastUpdated
  return NextResponse.json({ serialNumbers: [] }, { status: 200 });
}
