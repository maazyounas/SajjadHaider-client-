import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;  // optional — can be guest
  studentName: string;
  email: string;
  phone: string;
  classType: string;
  subject: string;
  date: string;   // YYYY-MM-DD
  time: string;   // e.g. "10:00 AM"
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    classType: { type: String, required: true },
    subject: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
