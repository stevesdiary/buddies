import { Router } from "express";
import interestController from "../controllers/interestController";
const router = Router();
import  validate  from '../middlewares/validator-middleware';
import schemas from '../validators/data.schema';
import { authenticateAdmin, authorizeAdmin } from "../middlewares/authentication";

router.post('/create', validate(schemas.interestSchema, 'body'), interestController.createInterest);

router.get('/one/:interest_id', validate(schemas.interestIdSchema, 'params'), interestController.getOneInterest);

router.get('/all', interestController.getInterests);

router.delete('/delete/:interest_id', authenticateAdmin, authorizeAdmin(['master']), validate(schemas.interestIdSchema, 'params'), interestController.deleteInterest);

export default router;