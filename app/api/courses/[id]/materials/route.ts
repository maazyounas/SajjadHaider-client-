import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/courses/[id]/materials — add a material to a course (admin only)
export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { category, title, description, type, fileUrl, filePublicId, fileType } = body;

    if (!category || !title) {
      return NextResponse.json(
        { error: "Category and title are required" },
        { status: 400 }
      );
    }

    if (!["notes", "quizzes", "pastPapers", "videos"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    await dbConnect();

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const material = { title, description: description || "", type: type || "free", fileUrl, filePublicId, fileType };
    course.resources[category as keyof typeof course.resources].push(material);
    await course.save();

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: unknown) {
    console.error("Add material error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
