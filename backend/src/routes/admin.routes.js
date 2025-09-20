import  {Router} from  "express";
import { adminLogout, adminLogin, getMyProfile, getStudentStats, getCounsellorStats, getAppointmentsSummary, getStudentStatisticsTrend } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/adminAuth.js";
const router=Router();


router.route("/admin-login").post(adminLogin);
router.route("/admin-logout").delete(verifyJWT, adminLogout);
router.route("/me").get(verifyJWT, getMyProfile);
router.route("/student-stats").get(verifyJWT, getStudentStats);
router.route("/counsellor-stats").get(verifyJWT, getCounsellorStats);
router.route("/appointments-summary").get(verifyJWT, getAppointmentsSummary);
router.route("/student-statistics-trend").get(verifyJWT, getStudentStatisticsTrend);


export default router;