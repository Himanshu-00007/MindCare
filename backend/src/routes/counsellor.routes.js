import  {Router} from  "express";
import { upload } from "../middlewares/multer.js";
import { counsellorLogin, counsellorLogout, counsellorRegister, listCounsellors } from "../controllers/counsellor.controllers.js";
import { verifyJWT } from "../middlewares/studentAuth.js";

const router=Router();
router.route("/counsellor-register").post(counsellorRegister);

router.route("/counsellor-login").post(counsellorLogin);
router.route("/counsellor-logout").delete(verifyJWT,counsellorLogout)

router.get("/list", verifyJWT, listCounsellors);
export default router;