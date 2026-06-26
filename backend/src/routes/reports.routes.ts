import { Router } from "express";
import multer from "multer";
import {
  getReportById,
  getReports,
  uploadReport
} from "../controllers/reports.controller";
import { authenticateUnlessDevelopment } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { idParamSchema } from "../validators/common.validators";
import { reportsQuerySchema } from "../validators/reports.validators";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

router.use(authenticateUnlessDevelopment);

router.get("/", validate({ query: reportsQuerySchema }), getReports);
router.post("/upload", upload.single("report"), uploadReport);
router.get("/:id", validate({ params: idParamSchema }), getReportById);

export default router;
