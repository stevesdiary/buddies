import { Router } from "express";
const router = Router();
import userController from "../controllers/userController";

router.post('/user/create', userController.createUser);

router.get('/alluser', userController.getAllUsers);

export default { router };