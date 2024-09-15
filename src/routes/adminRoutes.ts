import adminController from '../controllers/adminController';
import { Router } from 'express';
const router = Router();
import validate from '../middlewares/validator-middleware';
import schemas from "../validators/data.schema"

router.post('/create', adminController.createAdmin);

router.get("/all", adminController.findAllAdmin);

router.get("/one", validate(schemas.adminIdSchema, "params"), adminController.findAdmin);

router.put('/update/:admin_id', validate(schemas.createAdminSchema, "params"), validate(schemas.createAdminSchema, "body"), adminController.updateAdmin);

router.delete('/delete/admin_id', validate(schemas.adminIdSchema, "params"), adminController.deleteAdmin);

export default router;