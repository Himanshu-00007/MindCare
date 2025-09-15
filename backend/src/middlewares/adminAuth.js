import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js"
export const verifyJWT=async(req,res,next)=>{
    try{
        const token=req.cookies?.Token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(400).json({
            message:"unauthorized token"
            })
        }
        const decodedToken=jwt.verify(token,process.env.TOKEN)
        const user=await Admin.findById(decodedToken?._id).select("-password -refreshTokens");
        if(!user){
            return res.status(401).json({
            message:"invalid access token"
            })
        }
        req.user=user;
        next();
    }
    catch(error){
        return res.status(400).json({
            message:"something went wrong in auth middleware or Invalid access token"
        })
    }
}