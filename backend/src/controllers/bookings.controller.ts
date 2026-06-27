import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { bookingsService } from "../services/bookings.service";
import { AppError } from "../types/errors";
import type { BookingsQueryInput } from "../validators/bookings.validators";
import { env } from "../config/env";

const getClient = (req: Request) => {
  if (!req.supabase) {
    throw new AppError(500, "Supabase request client is not available");
  }

  return req.supabase;
};

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  if (env.NODE_ENV === "development") {
    console.info("[booking-api] validated create booking body", req.body);
  }

  const booking = await bookingsService.create(getClient(req), req.body);

  const responseBody = {
    status: "success",
    data: { booking }
  };

  if (env.NODE_ENV === "development") {
    console.info("[booking-api] final response", {
      statusCode: 201,
      body: responseBody
    });
  }

  res.status(201).json(responseBody);
});

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as unknown as BookingsQueryInput;
  const bookings = await bookingsService.findAll(getClient(req), filters);

  res.status(200).json({
    status: "success",
    data: { bookings }
  });
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingsService.findById(getClient(req), req.params.id);

  res.status(200).json({
    status: "success",
    data: { booking }
  });
});

export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingsService.update(getClient(req), req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { booking }
  });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingsService.cancel(getClient(req), req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { booking }
  });
});

export const deleteBooking = asyncHandler(async (req: Request, res: Response) => {
  await bookingsService.delete(getClient(req), req.params.id);

  res.status(200).json({
    status: "success",
    message: "Booking deleted successfully"
  });
});
