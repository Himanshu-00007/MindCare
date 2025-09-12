import  {Router} from  "express";
import { studentLogout, studentLogin, studentRegister } from "../controllers/student.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";
const router=Router();
router.route("/student-register").post(studentRegister);

router.route("/student-login").post(studentLogin);
router.route("/student-logout").delete(verifyJWT,studentLogout);
export default router;