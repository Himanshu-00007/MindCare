import Counsellor from "../models/Counsellor.model.js";
import Student from "../models/student.model.js";
import { upload } from "../middlewares/multer.js";
import { cloudinaryUpload,cloudinaryDelete } from "../utils/cloudinary.js";
const generateTokenAndRefreshToken = async (userId) => {
  try {
    const user = await Counsellor.findById(userId);
    const Token = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { Token, refreshToken };
  } catch (error) {
    throw new Error("something went wrong while generating tokens and refresh tokens");
  }
};
const counsellorRegister = async (req, res) => {
  try {
    const { name, email, password, designation,experience,institution} = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!experience || !experience.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!institution || !institution.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({ message: "designation is required" });
    }
    const existedUser=await Counsellor.findOne({email});
    if(existedUser){
        return res.status(400).json({ message: "counsellor already exist" });
    }
    
    
    const counsellor=await Counsellor.create({
        name,
        email,
        password,
        designation,
        experience,
        institution,
       
    })
    const User=await Counsellor.findById(counsellor._id).select("-password -refreshToken");
    if(!User){
        return res.status(400).json({ message: "something went wrong while registering " });
    }
    return res.status(200).json({
        User,
        message:"counsellor created successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: "error while registered",
      error:error.message,
    });
  }
};
const counsellorLogin=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({ message: "email or password is required" });
    }
    const user=await Counsellor.findOne({email});
    if(!user){
      return res.status(400).json({ message: "invalid email" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) return res.status(400).json({ message: "invalid password" });
    const {Token,refreshToken}=await generateTokenAndRefreshToken(user._id);
    const User=await Counsellor.findById(user._id).select("-password -refreshToken");
    const options={httpOnly:true,secure:true};
    return  res.status(200)
    .cookie("Token",Token,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
      User,
      message:"counsellor loggedIn successfully",
      Token,
      refreshToken
    })

  }
  catch(error){
    return res.status(500).json({
      message: "error while counsellor loggedIn",
      error:error.message,
    });
  }
}
const counsellorLogout = async (req, res) => {
  try {
    await Counsellor.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .clearCookie("Token", options)
      .clearCookie("refreshToken", options)
      .json({ message: "counsellor logout successfully" });
  } catch (error) {
    return res.status(400).json({ message: "error in logging out" });
  }
};
const listCounsellors = async (req, res) => {
  try {
    const userId = req.user._id;

    // Student check
    const student = await Student.findById(userId).select("institution");

    let filter = {};
    if (student) {
      // Agar student hai, sirf same institution ke counsellors dikhana
      filter.institution = student.institution;
    }

    const counsellors = await Counsellor.find(filter).select("_id name email experience designation");

    return res.status(200).json({ counsellors });
  } catch (err) {
    console.error("listCounsellors error:", err);
    return res.status(500).json({ message: "Error fetching counsellors", error: err.message });
  }
};
const getMyProfile = async (req, res) => {
  try {
    const counsellorId = req.user._id; // JWT middleware se aayega
    if (!counsellorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const counsellor = await Counsellor.findById(counsellorId).select("name email");
    if (!counsellor) {
      return res.status(404).json({ message: "counsellor not found" });
    }

    res.status(200).json({ name: counsellor.name, email: counsellor.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export {counsellorRegister,counsellorLogin,generateTokenAndRefreshToken,counsellorLogout,listCounsellors,getMyProfile}