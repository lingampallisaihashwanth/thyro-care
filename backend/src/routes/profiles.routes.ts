import { Router } from "express";
import { syncProfile } from "../controllers/profiles.controller";
import { authenticateUnlessDevelopment } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { syncProfileSchema } from "../validators/profiles.validators";

const router = Router();

router.use(authenticateUnlessDevelopment);
router.post("/sync", validate({ body: syncProfileSchema }), syncProfile);

export default router;
