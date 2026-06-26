import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking
} from "../controllers/bookings.controller";
import { authenticateUnlessDevelopment } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  bookingsQuerySchema,
  createBookingSchema,
  updateBookingSchema
} from "../validators/bookings.validators";
import { idParamSchema } from "../validators/common.validators";

const router = Router();

router.use(authenticateUnlessDevelopment);

router
  .route("/")
  .post(validate({ body: createBookingSchema }), createBooking)
  .get(validate({ query: bookingsQuerySchema }), getBookings);

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), getBookingById)
  .put(validate({ params: idParamSchema, body: updateBookingSchema }), updateBooking)
  .delete(validate({ params: idParamSchema }), deleteBooking);

export default router;
