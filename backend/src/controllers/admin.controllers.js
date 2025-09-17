import Admin from "../models/admin.model.js";
import { upload } from "../middlewares/multer.js";
import { cloudinaryUpload,cloudinaryDelete } from "../utils/cloudinary.js";
const generateTokenAndRefreshToken = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    const Token = await user.generateToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { Token, refreshToken };
  } catch (error) {
    throw new Error("something went wrong while generating tokens and refresh tokens");
  }
};

const adminLogin=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({ message: "email or password is required" });
    }
    const user=await Admin.findOne({email});
    if(!user){
      return res.status(400).json({ message: "invalid email" });
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) return res.status(400).json({ message: "invalid password" });
    const {Token,refreshToken}=await generateTokenAndRefreshToken(user._id);
    const User=await Admin.findById(user._id).select("-password -refreshToken");
    const options={httpOnly:true,secure:true};
    return  res.status(200)
    .cookie("Token",Token,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
      User,
      message:"Admin loggedIn successfully",
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
const adminLogout = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
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
export {adminLogin,generateTokenAndRefreshToken,adminLogout}