import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Appointment from "@/models/Appointment";
import { getAuthUser } from "@/lib/auth";

// GET /api/appointments — admin gets all, student gets own
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (!user || user.role !== "admin") {
      if (user) filter.user = user._id;
    }
    if (status && status !== "all") filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ appointments });
  } catch (error: unknown) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/appointments — book an appointment (public or authenticated)
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();

    const { studentName, email, phone, classType, subject, date, time, notes } = body;

    if (!studentName || !email || !phone || !classType || !date || !time) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    await dbConnect();

    const appointment = await Appointment.create({
      user: user?._id,
      studentName,
      email,
      phone,
      classType,
      subject: subject || "",
      date,
      time,
      notes: notes || "",
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
