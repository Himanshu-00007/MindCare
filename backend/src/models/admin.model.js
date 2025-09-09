import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    refreshTokens:{
        type:String,
     },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Anonymous student statistics
    student_statistics: [
      {
        metric: String,   // e.g., "Stress Level", "Appointments"
        value: Number,    // e.g., 40% students moderate stress
        date: { type: Date, default: Date.now }
      }
    ],

    // Counsellor management
    counsellors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counsellor" }],

    // Psychoeducational resources (Cloudinary uploads)
    video: {
      type: String // Cloudinary URL
    },
    video_obj_id: {
      type: String // Cloudinary public_id
    },
    image: {
      type: String // Cloudinary URL
    },
    image_obj_id: {
      type: String // Cloudinary public_id
    }
  },
  { timestamps: true } 
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
