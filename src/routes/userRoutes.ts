import { Router } from "express";
const router = Router();
import authenticate from '../middlewares/authentication';
import userController from "../controllers/userController";
import validate from "../middlewares/validator-middleware";
import  schemas  from "../validators/data.schema";

router.post('/create', validate(schemas.createUserSchema, 'body'), userController.createUser);

router.get('/all', userController.getAllUsers);

router.get('/one/:user_id', authenticate, validate(schemas.userIdSchema, 'params'), userController.getOneUser);

router.put('/update/:user_id', validate(schemas.userIdSchema, "params"), validate(schemas.updateUserSchema, 'body'), userController.updateUser);

router.delete('/delete/:user_id', validate(schemas.userIdSchema, 'params'), userController.deleteUser);

export default router;