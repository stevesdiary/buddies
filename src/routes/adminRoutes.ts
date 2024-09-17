import adminController from '../controllers/adminController';
import { Router } from 'express';
const router = Router();
import  { authenticateAdmin, authorizeAdmin } from '../middlewares/authentication';
import validate from '../middlewares/validator-middleware';
import schemas from "../validators/data.schema"

router.post('/create', authenticateAdmin, authorizeAdmin(['master']),  adminController.createAdmin);

router.get('/all', authenticateAdmin, authorizeAdmin(['master', 'senior']), adminController.findAllAdmin);

router.get('/one/:admin_id', authenticateAdmin, authorizeAdmin(['junior', 'master', 'senior']), validate(schemas.adminIdSchema, "params"), adminController.findAdmin);

router.put('/update/:admin_id', authenticateAdmin, authorizeAdmin(['master']), validate(schemas.createAdminSchema, "params"), validate(schemas.createAdminSchema, "body"), adminController.updateAdmin);

router.delete('/delete/:admin_id',authenticateAdmin, authorizeAdmin(['master']), validate(schemas.adminIdSchema, "params"), adminController.deleteAdmin);

export default router;