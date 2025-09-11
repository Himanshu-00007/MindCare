import  {Router} from  "express";
import { upload } from "../middlewares/multer.js";
import { counsellorLogin, counsellorLogout, counsellorRegister } from "../controllers/counsellor.controllers.js";
import { verifyJWT } from "../middlewares/counsellorAuth.js";

const router=Router();
router.route("/counsellor-register").post(upload.fields([
    {
        name:"profile",
        maxCount:1,
    }
]),counsellorRegister);

router.route("/counsellor-login").post(counsellorLogin);
router.route("/counsellor-logout").delete(verifyJWT,counsellorLogout)
export default router;