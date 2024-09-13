import adminController from '../controllers/adminController';
import { Router } from 'express';
import router from './userRoutes';
const app = Router();
import validate from '../middlewares/validator-middleware';
import schemas from "../validators/data.schema"

app.post('/create', validate(schemas.adminSchema, "body"), adminController.createAdmin);

app.get("/all", adminController.findAllAdmin);

app.get("/one", validate(schemas.adminIdSchema, "params"), adminController.findAdmin);

app.put('/update/:admin_id', validate(schemas.adminIdSchema, "params"), validate(schemas.adminSchema, "body"), adminController.updateAdmin);

app.delete('/delete/admin_id', validate(schemas.adminIdSchema, "params"), adminController.deleteAdmin);

export default router;