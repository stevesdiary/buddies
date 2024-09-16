import { Router } from "express";
const router = Router();
import loginController from '../controllers/loginController';


router.get('/admin', loginController.adminLogin);
router.get('/user', loginController.userLogin);

export default router;