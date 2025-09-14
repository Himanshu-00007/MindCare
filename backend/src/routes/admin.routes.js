import  {Router} from  "express";
import { adminLogout, adminLogin } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/adminAuth.js";
const router=Router();


router.route("/admin-login").post(adminLogin);
router.route("/admin-logout").delete(verifyJWT,adminLogout);
export default router;