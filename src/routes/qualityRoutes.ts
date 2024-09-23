import { Router } from "express";
import qualitiesController from "../controllers/qualitiesController";
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authentication";
import validate from "../middlewares/validator-middleware";
import schemas from '../validators/data.schema';
const router = Router();


router.post('/create', validate(schemas.qualitySchema, 'body'), qualitiesController.createQuality);

router.get('/one/:quality_id', qualitiesController.getOneQuality);

router.get('/all', qualitiesController.getQualities);

router.delete('/delete/:quality_id', authenticateAdmin, authorizeAdmin(['master']), qualitiesController.deleteQuality);

export default router;