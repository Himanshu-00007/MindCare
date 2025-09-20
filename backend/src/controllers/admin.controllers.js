import Admin from "../models/admin.model.js";
import { upload } from "../middlewares/multer.js";
import { cloudinaryUpload,cloudinaryDelete } from "../utils/cloudinary.js";
import Student from "../models/student.model.js";
import Counsellor from "../models/Counsellor.model.js"
import Booking from "../models/booking.model.js";
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
const getMyProfile = async (req, res) => {
  try {
    const adminId = req.user._id; // JWT middleware se aayega
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const admin = await Admin.findById(adminId).select("name email");
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    res.status(200).json({ name: admin.name, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getStudentStats = async (req, res) => {
  try {
    const students = await Student.find();

    const total = students.length;

    const avgPHQ9 = total
      ? students.reduce((acc, s) => acc + (s.mental_health_score?.PHQ9 || 0), 0) / total
      : 0;

    const avgGAD7 = total
      ? students.reduce((acc, s) => acc + (s.mental_health_score?.GAD7 || 0), 0) / total
      : 0;

    const avgGHQ = total
      ? students.reduce((acc, s) => acc + (s.mental_health_score?.GHQ || 0), 0) / total
      : 0;

    res.json({
      totalStudents: total,
      avgPHQ9: avgPHQ9.toFixed(2),
      avgGAD7: avgGAD7.toFixed(2),
      avgGHQ: avgGHQ.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student stats", error: error.message });
  }
};

// ---------------------------
// 2️⃣ Get Counsellor Stats
// ---------------------------
export const getCounsellorStats = async (req, res) => {
  try {
    const totalCounsellors = await Counsellor.countDocuments();
    res.json({ totalCounsellors });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching counsellor stats",
      error: error.message,
    });
  }
};

// ---------------------------
// 3️⃣ Appointments Summary
// ---------------------------
export const getAppointmentsSummary = async (req, res) => {
  try {
    const summary = await Booking.aggregate([
      {
        $group: {
          _id: { $toLower: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { pending: 0, confirmed: 0, cancelled: 0 };
    summary.forEach((s) => {
      if (result.hasOwnProperty(s._id)) {
        result[s._id] = s.count;
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments summary", error: error.message });
  }
};

// ---------------------------
// 4️⃣ Student Statistics Trend
// ---------------------------
export const getStudentStatisticsTrend = async (req, res) => {
  try {
    const trend = await Student.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, // 👈 updatedAt use karo
          avgPHQ9: { $avg: "$mental_health_score.PHQ9" },
          avgGAD7: { $avg: "$mental_health_score.GAD7" },
          avgGHQ: { $avg: "$mental_health_score.GHQ" },
        },
      },
      { $sort: { _id: 1 } }, // ascending by date
    ]);

    const formatted = trend.map((t) => [
      { metric: "PHQ9", date: t._id, value: t.avgPHQ9 || 0 },
      { metric: "GAD7", date: t._id, value: t.avgGAD7 || 0 },
      { metric: "GHQ", date: t._id, value: t.avgGHQ || 0 },
    ]);

    res.json({ trend: formatted.flat() });
  } catch (err) {
    console.error("Error in trend stats:", err);
    res.status(500).json({ message: "Failed to fetch trend stats" });
  }
};


export {adminLogin,generateTokenAndRefreshToken,adminLogout,getMyProfile}