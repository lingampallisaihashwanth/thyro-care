import { Router } from "express";
import {
  getNotifications,
  markNotificationAsRead
} from "../controllers/notifications.controller";
import { authenticateUnlessDevelopment } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { idParamSchema } from "../validators/common.validators";
import { notificationsQuerySchema } from "../validators/notifications.validators";

const router = Router();

router.use(authenticateUnlessDevelopment);

router.get("/", validate({ query: notificationsQuerySchema }), getNotifications);
router.patch(
  "/:id/read",
  validate({ params: idParamSchema, query: notificationsQuerySchema }),
  markNotificationAsRead
);

export default router;
