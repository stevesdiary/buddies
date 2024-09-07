import { Router } from "express";
const router = Router();
import userController from "../controllers/userController";

router.post('/create', userController.createUser);

router.get('/all', userController.getAllUsers);

router.get('/one/:email', userController.getOneUser);

router.put('/update/:user_id', userController.updateUser);

router.delete("/delete/:email", userController.deleteUser);

export default router;