import { Router } from "express";
const router = Router();
import loginController from '../controllers/loginController';


router.post('/admin', loginController.adminLogin);
router.post('/user', loginController.userLogin);

export default router;