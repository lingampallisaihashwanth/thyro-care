import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  BookingsQueryInput,
  CreateBookingInput,
  UpdateBookingInput
} from "../validators/bookings.validators";
import type { Database } from "../types/database";
import { AppError } from "../types/errors";
import { throwSupabaseError } from "./supabase-error.service";
import { env } from "../config/env";
import { notificationsService } from "./notifications.service";

type Client = SupabaseClient<Database>;
type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

const toBookingInsert = (booking: CreateBookingInput) => ({
  profile_id: booking.profileId ?? null,
  patient_name: booking.patientName ?? booking.userEmail,
  email: booking.userEmail,
  phone: booking.phone ?? null,
  test_name: booking.testName,
  category: booking.category,
  price: booking.price ?? null,
  booking_type: booking.bookingType,
  appointment_date: booking.bookingDate,
  preferred_time_slot: booking.preferredTimeSlot,
  status: booking.status
});

const toBookingUpdate = (booking: UpdateBookingInput): BookingUpdate => ({
  ...(booking.profileId !== undefined ? { profile_id: booking.profileId } : {}),
  ...(booking.patientName !== undefined ? { patient_name: booking.patientName } : {}),
  ...(booking.userEmail !== undefined ? { email: booking.userEmail } : {}),
  ...(booking.phone !== undefined ? { phone: booking.phone } : {}),
  ...(booking.testName !== undefined ? { test_name: booking.testName } : {}),
  ...(booking.category !== undefined ? { category: booking.category } : {}),
  ...(booking.price !== undefined ? { price: booking.price } : {}),
  ...(booking.bookingType !== undefined ? { booking_type: booking.bookingType } : {}),
  ...(booking.bookingDate !== undefined
    ? { appointment_date: booking.bookingDate }
    : {}),
  ...(booking.preferredTimeSlot !== undefined
    ? { preferred_time_slot: booking.preferredTimeSlot }
    : {}),
  ...(booking.status !== undefined ? { status: booking.status } : {})
});

const toBookingResponse = (booking: BookingRow) => ({
  id: booking.id,
  profile_id: booking.profile_id,
  patient_name: booking.patient_name,
  user_email: booking.email,
  phone: booking.phone,
  test_name: booking.test_name,
  category: booking.category,
  price: booking.price,
  booking_type: booking.booking_type,
  booking_date: booking.appointment_date ?? "",
  preferred_time_slot: booking.preferred_time_slot,
  status: booking.status,
  created_at: booking.created_at,
  updated_at: booking.updated_at
});

export const bookingsService = {
  async create(client: Client, payload: CreateBookingInput) {
    const insertPayload = toBookingInsert(payload);

    if (env.NODE_ENV === "development") {
      console.info("[booking-api] Supabase insert payload", insertPayload);
    }

    const { data, error } = await client
      .from("bookings")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      if (env.NODE_ENV === "development") {
        console.error("[booking-api] Supabase error", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      }

      throwSupabaseError(error, "Unable to create booking");
    }

    if (!data) {
      throw new AppError(500, "Booking was not returned after creation");
    }

    await notificationsService.create(client, {
      user_email: payload.userEmail,
      title: "Booking created",
      message: `Your ${payload.testName} booking is ${payload.status.toLowerCase()}.`,
      is_read: false
    });

    return toBookingResponse(data);
  },

  async findAll(client: Client, filters: BookingsQueryInput = {}) {
    let query = client
      .from("bookings")
      .select("*");

    if (filters.profileId) {
      query = query.eq("profile_id", filters.profileId);
    }

    if (filters.userEmail) {
      query = query.eq("email", filters.userEmail);
    }

    if (filters.testName) {
      query = query.eq("test_name", filters.testName);
    }

    if (filters.bookingDate) {
      query = query.eq("appointment_date", filters.bookingDate);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false
    });

    if (error) {
      throwSupabaseError(error, "Unable to fetch bookings");
    }

    return (data ?? []).map((booking) => toBookingResponse(booking));
  },

  async findById(client: Client, id: string) {
    const { data, error } = await client
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throwSupabaseError(error, "Unable to fetch booking");
    }

    if (!data) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return toBookingResponse(data);
  },

  async update(client: Client, id: string, payload: UpdateBookingInput) {
    const updatePayload = toBookingUpdate(payload);

    if (Object.keys(updatePayload).length === 0) {
      throw new AppError(
        400,
        "No Supabase-backed booking fields were provided for update",
        "EMPTY_UPDATE"
      );
    }

    const { data, error } = await client
      .from("bookings")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throwSupabaseError(error, "Unable to update booking");
    }

    if (!data) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return toBookingResponse(data);
  },

  async delete(client: Client, id: string) {
    const { data, error } = await client
      .from("bookings")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throwSupabaseError(error, "Unable to delete booking");
    }

    if (!data) {
      throw new AppError(404, "Booking not found", "BOOKING_NOT_FOUND");
    }

    return data;
  }
};
