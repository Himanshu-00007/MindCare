import  {Router} from  "express";
import { upload } from "../middlewares/multer.js";
import { counsellorLogin, counsellorLogout, counsellorRegister, getMyProfile, listCounsellors } from "../controllers/counsellor.controllers.js";
import { verifyJWT } from "../middlewares/counsellorAuth.js";
import { verifyJWT as stu } from "../middlewares/studentAuth.js";


const router=Router();
router.route("/counsellor-register").post(counsellorRegister);
router.route("/me").get(verifyJWT,getMyProfile);
router.route("/counsellor-login").post(counsellorLogin);
router.route("/counsellor-logout").delete(verifyJWT,counsellorLogout)

router.get("/list", stu, listCounsellors);
export default router;