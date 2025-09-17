import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized token" });

    const decoded = jwt.verify(token, process.env.TOKEN);
    const user = await Admin.findById(decoded._id).select("-password -refreshToken");
    if (!user) return res.status(401).json({ message: "Invalid access token" });

    req.user = { ...user.toObject(), role: "admin" };
    next();
  } catch (err) {
    console.error("Admin JWT error:", err);
    return res.status(401).json({ message: "Something went wrong in auth middleware or invalid access token" });
  }
};
