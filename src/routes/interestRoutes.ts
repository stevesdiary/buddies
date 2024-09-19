import { Router } from "express";
import interestController from "../controllers/interestController";
const router = Router();


router.post('/create', interestController.createInterest);

router.get('/one/:interest_id', interestController.getOneInterest);

router.get('/all', interestController.getInterests);

router.delete('/delete/:interest_id', interestController.deleteInterest);

export default router;