// models/booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  counsellor: { type: mongoose.Schema.Types.ObjectId, ref: "Counsellor", required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
  notes: { type: String },
  createdByRole: { type: String, enum: ["student", "admin"], default: "student" }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
