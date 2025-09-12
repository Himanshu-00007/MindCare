import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const counsellorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  refreshToken: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String }, // Psychologist / Psychiatrist / Mentor
  availability_schedule: [
    { day: String, start_time: String, end_time: String }
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
}, { timestamps: true });

counsellorSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

counsellorSchema.methods.isPasswordCorrect = async function(password) {
  return bcrypt.compare(password, this.password);
};

counsellorSchema.methods.generateToken = async function() {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name
  }, process.env.TOKEN, {
    expiresIn: process.env.TOKEN_EXPIRY
  });
};

counsellorSchema.methods.generateRefreshToken = async function() {
  return jwt.sign({
    _id: this._id,
  }, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};

const Counsellor = mongoose.models.Counsellor || mongoose.model("Counsellor", counsellorSchema);

export default Counsellor;
