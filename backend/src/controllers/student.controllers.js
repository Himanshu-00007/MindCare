import Student from "../models/student.model.js";
import { upload } from "../middlewares/multer.js";
import { cloudinaryUpload,cloudinaryDelete } from "../utils/cloudinary.js";
const generateTokenAndRefreshToken = async (userId) => {
  try {
    const user = await Student.findById(userId);
    const Token = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { Token, refreshToken };
  } catch (error) {
    throw new Error("something went wrong while generating tokens and refresh tokens");
  }
};
const studentRegister = async (req, res) => {
  try {
    const { name, email, mobile_number, password, age, gender, course,institution } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!institution || !institution.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!mobile_number ) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!age) {
      return res.status(400).json({ message: "Age is required" });
    }

    if (!gender || !gender.trim()) {
      return res.status(400).json({ message: "Gender is required" });
    }

    if (!course || !course.trim()) {
      return res.status(400).json({ message: "Course is required" });
    }
    const existedUser=await Student.findOne({email});
    if(existedUser){
        return res.status(400).json({ message: "student already exist" });
    }
    
    let profile="";
    
    if(req.files?.profile[0]?.buffer){
         profile=await cloudinaryUpload(profileBuffer,"profile");
        if(!profile?.url){
          return res.status(400).json({ message: "profile upload failed" });
        }
    }
    const student=await Student.create({
        name,
        email,
        mobile_number,
        password,
        gender,
        age,
        institution,
        course,
        profile:profile?.url || "",
    })
    const createdUser=await Student.findById(student._id).select("-password -refreshToken");
    if(!createdUser){
        return res.status(400).json({ message: "something went wrong while registering student" });
    }
    return res.status(200).json({
        createdUser,
        message:"student created successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: "error while student registered",
      error:error.message,
    });
  }
};
const studentLogin=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({ message: "email or password is required" });
    }
    const user=await Student.findOne({email});
    if(!user){
      return res.status(400).json({ message: "invalid email" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) return res.status(400).json({ message: "invalid password" });
    const {Token,refreshToken}=await generateTokenAndRefreshToken(user._id);
    const loggedInUser=await Student.findById(user._id).select("-password -refreshToken");
    const options={httpOnly:true,secure:true};
    return  res.status(200)
    .cookie("Token",Token,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
      loggedInUser,
      message:"user loggedIn successfully",
      Token,
      refreshToken
    })

  }
  catch(error){
    return res.status(500).json({
      message: "error while student loggedIn",
      error:error.message,
    });
  }
}
const studentLogout = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .clearCookie("Token", options)
      .clearCookie("refreshToken", options)
      .json({ message: "student logout successfully" });
  } catch (error) {
    return res.status(400).json({ message: "error in logging out" });
  }
};
export {studentRegister,studentLogin,generateTokenAndRefreshToken,studentLogout}