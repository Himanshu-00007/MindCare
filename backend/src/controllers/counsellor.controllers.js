import Counsellor from "../models/Counsellor.model.js";
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
    const { name, email, password, designation} = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || !email.trim()) {
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
    
    let profile="";
    
    if(req.files?.profile[0]?.buffer){
         profile=await cloudinaryUpload(profileBuffer,"profile");
        if(!profile?.url){
          return res.status(400).json({ message: "profile upload failed" });
        }
    }
    const counsellor=await Counsellor.create({
        name,
        email,
        password,
        designation,
        profile:profile?.url || "",
    })
    const createdUser=await Counsellor.findById(counsellor._id).select("-password -refreshToken");
    if(!createdUser){
        return res.status(400).json({ message: "something went wrong while registering " });
    }
    return res.status(200).json({
        createdUser,
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
    const loggedInUser=await Counsellor.findById(user._id).select("-password -refreshToken");
    const options={httpOnly:true,secure:true};
    return  res.status(200)
    .cookie("Token",Token,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
      loggedInUser,
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
export {counsellorRegister,counsellorLogin,generateTokenAndRefreshToken}