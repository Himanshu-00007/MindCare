import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    
    institution: { type: String, required: true }, // only for institution admins
    refreshToken:{
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
    
  },
  { timestamps: true } 
);
adminSchema.pre("save",async function(next){
  if(this.isModified("password")){
  this.password=await bcrypt.hash(this.password,10);
  next();
  }
  else{
    return next();
  }
});
adminSchema.methods.isPasswordCorrect=async function(password){
  return bcrypt.compare(password,this.password);
}
adminSchema.methods.generateToken=async function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    name:this.name
  },process.env.TOKEN,{
    expiresIn:process.env.TOKEN_EXPIRY
  })
}
adminSchema.methods.generateRefreshToken=async function(){
  return jwt.sign({
    _id:this._id,
  },process.env.REFRESH_TOKEN,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  })
}
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
