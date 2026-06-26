import { z } from "zod";
import type { BookingStatus, BookingType } from "../types/database";

const bookingTypeValues = [
  "Home Sample Collection",
  "Laboratory Visit",
  "Request Callback"
] as const satisfies readonly BookingType[];

const bookingStatusValues = [
  "Requested",
  "Confirmed",
  "Sample Collected",
  "Completed",
  "Cancelled"
] as const satisfies readonly BookingStatus[];

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "bookingDate must use YYYY-MM-DD format");

export const createBookingSchema = z.object({
  profileId: z.string().uuid().nullable().optional(),
  patientName: z.string().trim().min(1).max(160).optional(),
  userEmail: z.string().email(),
  phone: z.string().trim().max(30).nullable().optional(),
  testName: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(120),
  price: z.number().nonnegative().nullable().optional(),
  bookingType: z.enum(bookingTypeValues),
  bookingDate: dateSchema,
  preferredTimeSlot: z.string().trim().min(1).max(80),
  status: z.enum(bookingStatusValues).optional().default("Requested")
});

export const updateBookingSchema = createBookingSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one booking field is required"
  }
);

export const bookingsQuerySchema = z.object({
  profileId: z.string().uuid().optional(),
  userEmail: z.string().email().optional(),
  testName: z.string().trim().min(1).optional(),
  bookingDate: dateSchema.optional(),
  status: z.enum(bookingStatusValues).optional()
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingsQueryInput = z.infer<typeof bookingsQuerySchema>;
