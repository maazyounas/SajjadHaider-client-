import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Setting from "@/models/Setting";
import { requireAdmin, getAuthUser } from "@/lib/auth";

// GET /api/settings — public settings (some) or all (admin)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getAuthUser(req);
    const isAdmin = user?.role === "admin";

    const settings = await Setting.find();
    const result: Record<string, unknown> = {};

    for (const s of settings) {
      // Only expose public keys to non-admins
      const publicKeys = [
        "academyName",
        "tagline",
        "about",
        "whatsappNumber",
        "contactEmail",
        "contactPhone",
        "contactAddress",
        "socialLinks",
        "announcementEnabled",
        "announcementText",
        "announcementCta",
        "announcementCtaLink",
        "testimonials",
      ];

      if (isAdmin || publicKeys.includes(s.key)) {
        result[s.key] = s.value;
      }
    }

    return NextResponse.json({ settings: result });
  } catch (error: unknown) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/settings — update settings (admin only)
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    await dbConnect();

    // Upsert each key-value pair
    const operations = Object.entries(body).map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      )
    );

    await Promise.all(operations);

    return NextResponse.json({ message: "Settings updated" });
  } catch (error: unknown) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
