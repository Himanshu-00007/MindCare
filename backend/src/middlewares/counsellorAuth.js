import jwt from "jsonwebtoken";
import Counsellor from "../models/Counsellor.model.js"
export const verifyJWT=async(req,res,next)=>{
    try{
        const Token=req.cookies?.Token || req.header("Authorization").replace("Bearer ","");
        if(!Token){
            return res.status(400).json({
            message:"unauthorized token"
            })
        }
        const decodedToken=jwt.verify(Token,process.env.TOKEN)
        const user=await Counsellor.findById(decodedToken?._id).select("-password -refreshTokens");
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