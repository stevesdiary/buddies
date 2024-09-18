import { Router } from "express";
import qualitiesController from "../controllers/qualitiesController";
const router = Router();


router.post('/create', qualitiesController.createQuality);

router.get('/one/:quality_id', qualitiesController.getOneQuality);

router.get('/all', qualitiesController.getQualities);

router.delete('/delete/:quality_id', qualitiesController.deleteQuality);

export default router;