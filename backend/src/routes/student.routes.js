import  {Router} from  "express";
import { upload } from "../middlewares/multer.js";
import { studentLogout, studentLogin, studentRegister } from "../controllers/student.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";
const router=Router();
router.route("/student-register").post(upload.fields([
    {
        name:"profile",
        maxCount:1,
    }
]),studentRegister);

router.route("/student-login").post(studentLogin);
router.route("/student-logout").delete(verifyJWT,studentLogout);
export default router;