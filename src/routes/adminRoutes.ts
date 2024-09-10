import adminController from '../controllers/adminController';
import { Router } from 'express';
import router from './userRoutes';
const app = Router();

app.post('/create', adminController.createAdmin);

app.get("/all", adminController.findAllAdmin);

app.get("/one", adminController.findAdmin);

app.put('/update/:admin_id', adminController.updateAdmin);

app.delete('/delete/admin_id', adminController.deleteAdmin);

export default router;