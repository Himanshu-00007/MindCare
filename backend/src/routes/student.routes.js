import  {Router} from  "express";
import { studentLogout, studentLogin, studentRegister, getMyProfile, updateSelfAssessment } from "../controllers/student.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";
const router=Router();
router.route("/student-register").post(studentRegister);

router.route("/student-login").post(studentLogin);
router.route("/student-logout").delete(verifyJWT,studentLogout);
router.get("/me", verifyJWT, getMyProfile);
router.route("/self-assessment/:studentId").patch(verifyJWT,updateSelfAssessment);
export default router;