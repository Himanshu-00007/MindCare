import  {Router} from  "express";
import { upload } from "../middlewares/multer.js";
import { studentRegister } from "../controllers/student.controllers.js";
const router=Router();
router.route("/student-register").post(upload.fields([
    {
        name:"profile",
        maxCount:1,
    }
]),studentRegister);
export default router;