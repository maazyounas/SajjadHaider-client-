import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMaterial {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "free" | "premium";
  fileUrl?: string;         // Cloudinary URL
  filePublicId?: string;    // Cloudinary public_id for deletion
  fileType?: string;        // pdf, video, image, etc.
}

const MaterialSchema = new Schema<IMaterial>({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["free", "premium"], default: "free" },
  fileUrl: { type: String },
  filePublicId: { type: String },
  fileType: { type: String },
});

export interface ICourseResources {
  notes: IMaterial[];
  quizzes: IMaterial[];
  pastPapers: IMaterial[];
  videos: IMaterial[];
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  level: "igcse" | "as" | "a2";
  category: "economics" | "business" | "sciences" | "humanities" | "languages";
  icon: string;
  description: string;
  tags: string[];
  fee: number;
  instructor: string;
  resources: ICourseResources;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    level: { type: String, enum: ["igcse", "as", "a2"], required: true },
    category: {
      type: String,
      enum: ["economics", "business", "sciences", "humanities", "languages"],
      required: true,
    },
    icon: { type: String, default: "📚" },
    description: { type: String, default: "" },
    tags: [{ type: String }],
    fee: { type: Number, required: true },
    instructor: { type: String, required: true },
    resources: {
      notes: [MaterialSchema],
      quizzes: [MaterialSchema],
      pastPapers: [MaterialSchema],
      videos: [MaterialSchema],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create a virtual `id` field that returns the string ObjectId (for frontend compat)
CourseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
