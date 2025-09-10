import Student from "../models/student.model.js";
import { upload } from "../middlewares/multer.js";
import { cloudinaryUpload,cloudinaryDelete } from "../utils/cloudinary.js";
const studentRegister = async (req, res) => {
  try {
    const { name, email, mobile_number, password, age, gender, course } = req.body;

    if (!name || !name.trim()) {
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
export {studentRegister}