import  {Router} from  "express";
import { upload } from "../middlewares/multer.js";
import { counsellorLogin, counsellorRegister } from "../controllers/counsellor.controllers.js";
const router=Router();
router.route("/counsellor-register").post(upload.fields([
    {
        name:"profile",
        maxCount:1,
    }
]),counsellorRegister);

router.route("/counsellor-login").post(counsellorLogin);
export default router;