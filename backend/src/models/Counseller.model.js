import mongoose from "mongoose";

const counsellorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  refreshTokens:{
        type:String,
     },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String }, // Psychologist / Psychiatrist / Mentor
  specialization: [String], // e.g., ["Stress", "Depression"]
  availability_schedule: [
    {
      day: String,
      start_time: String,
      end_time: String
    }
  ],
  appointments: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      date: Date,
      status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" }
    }
  ],
  feedback: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ]
},{timestamps:true});

const Counsellor = mongoose.model("Counsellor", counsellorSchema);
export default Counsellor;
