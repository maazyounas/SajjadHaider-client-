import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import Appointment from "@/models/Appointment";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/stats — dashboard statistics (admin only)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    await dbConnect();

    const [
      totalStudents,
      activeCourses,
      pendingPayments,
      recentPayments,
      upcomingAppointments,
      approvedPayments,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({ isActive: true }),
      Payment.countDocuments({ status: "pending" }),
      Payment.find()
        .populate("user", "name email")
        .populate("course", "name level")
        .sort({ createdAt: -1 })
        .limit(5),
      Appointment.find({ status: { $in: ["pending", "confirmed"] } })
        .sort({ date: 1 })
        .limit(5),
      Payment.find({ status: "approved" }),
    ]);

    const totalRevenue = approvedPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return NextResponse.json({
      stats: {
        totalStudents,
        activeCourses,
        totalRevenue,
        pendingPayments,
      },
      recentPayments,
      upcomingAppointments,
    });
  } catch (error: unknown) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
