import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    refreshToken:{
        type:String,
     },
    profile:{
      type:String, //cloudinary url
    },
    profileId:{
      type:String,
    },
    email: { type: String, required: true, unique: true },
    mobile_number: { type: Number ,required : true},
    password: { type: String, required: true },
    age: { type: Number ,required:true },
    gender: { type: String, enum: ["Male", "Female", "Other"] ,required: true },
    course: { type: String ,required: true },
    mental_health_score: {
      PHQ9: { type: Number, default: 0 },
      GAD7: { type: Number, default: 0 },
      GHQ: { type: Number, default: 0 }
    },
    appointments: [
      {
        counsellor: { type: mongoose.Schema.Types.ObjectId, ref: "Counsellor" },
        date: Date,
        status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" }
      }
    ],
  },
  
  { timestamps: true } 
);
studentSchema.pre("save",async function(next){
  if(this.isModified("password")){
  this.password=await bcrypt.hash(this.password,10);
  next();
  }
  else{
    return next();
  }
});
studentSchema.methods.isPasswordCorrect=async function(password){
  return bcrypt.compare(password,this.password);
}
studentSchema.methods.generateToken=async function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    name:this.name
  },process.env.TOKEN,{
    expiresIn:process.env.TOKEN_EXPIRY
  })
}
studentSchema.methods.generateRefreshToken=async function(){
  return jwt.sign({
    _id:this._id,
  },process.env.REFRESH_TOKEN,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  })
}

const Student = mongoose.model("Student", studentSchema);
export default Student;
