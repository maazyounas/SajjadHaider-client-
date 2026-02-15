import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface RouteContext {
  params: Promise<{ id: string; materialId: string }>;
}

// PUT /api/courses/[id]/materials/[materialId] — update material (admin)
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id, materialId } = await context.params;
    const body = await req.json();
    const { category, title, description, type, fileUrl, filePublicId, fileType } = body;

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    await dbConnect();
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const materials = course.resources[category as keyof typeof course.resources];
    const mat = materials.find((m) => m._id?.toString() === materialId);
    if (!mat) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    if (title) mat.title = title;
    if (description !== undefined) mat.description = description;
    if (type) mat.type = type;
    if (fileUrl) mat.fileUrl = fileUrl;
    if (filePublicId) mat.filePublicId = filePublicId;
    if (fileType) mat.fileType = fileType;

    await course.save();
    return NextResponse.json({ course });
  } catch (error: unknown) {
    console.error("Update material error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/courses/[id]/materials/[materialId] — delete material (admin)
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id, materialId } = await context.params;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    await dbConnect();
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const materials = course.resources[category as keyof typeof course.resources];
    const matIndex = materials.findIndex((m) => m._id?.toString() === materialId);
    if (matIndex === -1) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Clean up Cloudinary file if it exists
    const mat = materials[matIndex];
    if (mat.filePublicId) {
      try {
        const resourceType = mat.fileType === "video" ? "video" : mat.fileType === "pdf" ? "raw" : "image";
        await deleteFromCloudinary(mat.filePublicId, resourceType);
      } catch (err) {
        console.error("Cloudinary cleanup error:", err);
      }
    }

    materials.splice(matIndex, 1);
    await course.save();

    return NextResponse.json({ message: "Material deleted", course });
  } catch (error: unknown) {
    console.error("Delete material error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
