import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/auth";

// GET /api/payments — admin gets all, student gets own
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (auth.user.role !== "admin") {
      filter.user = auth.user._id;
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate("user", "name email")
      .populate("course", "name level icon fee")
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments });
  } catch (error: unknown) {
    console.error("Get payments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/payments — student submits a payment
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    await dbConnect();

    // Check for duplicate pending payment
    const existing = await Payment.findOne({
      user: auth.user._id,
      course: body.courseId,
      status: "pending",
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending payment for this course" },
        { status: 400 }
      );
    }

    const payment = await Payment.create({
      user: auth.user._id,
      course: body.courseId,
      amount: body.amount,
      method: body.method,
      screenshotUrl: body.screenshotUrl,
      screenshotPublicId: body.screenshotPublicId,
    });

    const populated = await payment.populate([
      { path: "user", select: "name email" },
      { path: "course", select: "name level icon fee" },
    ]);

    return NextResponse.json({ payment: populated }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
