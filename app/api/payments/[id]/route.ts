import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/payments/[id] — approve or reject (admin only)
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const { status, adminNote } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    await dbConnect();

    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    payment.status = status;
    if (adminNote) payment.adminNote = adminNote;
    await payment.save();

    // If approved, grant course access to the user
    if (status === "approved") {
      await User.findByIdAndUpdate(payment.user, {
        $addToSet: { subscribedCourses: payment.course },
      });
    }

    const populated = await payment.populate([
      { path: "user", select: "name email" },
      { path: "course", select: "name level icon fee" },
    ]);

    return NextResponse.json({ payment: populated });
  } catch (error: unknown) {
    console.error("Update payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
