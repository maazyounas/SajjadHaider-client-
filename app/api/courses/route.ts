import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/auth";

// GET /api/courses — list all courses (public)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = { isActive: true };
    if (level && level !== "all") filter.level = level;
    if (category && category !== "all") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ courses });
  } catch (error: unknown) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/courses — create a course (admin only)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    await dbConnect();

    const course = await Course.create({
      name: body.name,
      level: body.level,
      category: body.category,
      icon: body.icon || "📚",
      description: body.description || "",
      tags: body.tags || [],
      fee: body.fee,
      instructor: body.instructor,
      resources: body.resources || { notes: [], quizzes: [], pastPapers: [], videos: [] },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
