import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    refreshTokens:{
        type:String,
     },
    email: { type: String, required: true, unique: true },
    mobile_number: { type: String },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    course: { type: String },
    year: { type: String },
    mental_health_score: {
      PHQ9: { type: Number, default: 0 },
      GAD7: { type: Number, default: 0 },
      GHQ: { type: Number, default: 0 }
    },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counsellor" }],
  },
  { timestamps: true } 
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
