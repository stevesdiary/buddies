import { Router } from "express";
const router = Router();
import userController from "../controllers/userController";
import validate from "../middlewares/validator-middleware";
import  schemas  from "../validators/data.schema";

router.post('/create', validate(schemas.userSchema, 'body'), userController.createUser);

router.get('/all', userController.getAllUsers);

router.get('/one/:user_id', validate(schemas.idSchema, 'params'), userController.getOneUser);

router.put('/update/:user_id', validate(schemas.idSchema, 'params'), userController.updateUser);

router.delete('/delete/:user_id', validate(schemas.idSchema, 'params'), userController.deleteUser);

export default router;