import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, LogIn, MapPin, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { formatPrice } from "../data/tests";
import { useAuth } from "../hooks/useAuth";
import { createBooking, getApiErrorMessage, syncProfile } from "../services/api";
import type { Booking, BookingType, LabTest } from "../types";

const bookingTypes: BookingType[] = [
  "Home Sample Collection",
  "Laboratory Visit",
  "Request Callback",
];

const timeSlots = [
  "07:00 AM - 09:00 AM",
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "03:00 PM - 05:00 PM",
  "05:00 PM - 07:00 PM",
];

const bookingSchema = z.object({
  bookingType: z.enum([
    "Home Sample Collection",
    "Laboratory Visit",
    "Request Callback",
  ]),
  bookingDate: z.string().min(1, "Preferred date is required."),
  preferredTimeSlot: z.string().min(1, "Preferred time slot is required."),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingModalProps = {
  test: LabTest;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export const BookingModal = ({ test, onClose, onBooked }: BookingModalProps) => {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingType: "Home Sample Collection",
      bookingDate: "",
      preferredTimeSlot: "",
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!user) {
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    try {
      let profileId = user.id;

      if (!profileId) {
        try {
          const profile = await syncProfile({
            fullName: user.fullName,
            phone: user.phone,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            profilePhoto: user.profilePhoto,
          });
          profileId = profile.id;
        } catch (profileError) {
          console.error("[booking-flow] profile sync failed; continuing by email", {
            message: getApiErrorMessage(profileError),
          });
        }
      }

      const booking = await createBooking({
        profileId,
        patientName: user.fullName,
        userEmail: user.email,
        phone: user.phone,
        testName: test.name,
        category: test.category,
        price: test.price,
        bookingType: values.bookingType,
        bookingDate: values.bookingDate,
        preferredTimeSlot: values.preferredTimeSlot,
        status: "Requested",
      });

      setSubmitSuccess("Booking submitted successfully.");
      onBooked(booking);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-thyro-ink/55 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-bold uppercase text-thyro-green">Selected Test</p>
            <h2 id="booking-title" className="mt-1 text-2xl font-extrabold text-thyro-navy">
              {test.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {test.category} | {formatPrice(test.price)} | Report: {test.reportTime}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-thyro-red hover:text-thyro-red"
            aria-label="Close booking form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!user ? (
          <div className="p-5 sm:p-6">
            <div className="rounded-lg border border-thyro-blue/20 bg-thyro-sky p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-thyro-blue shadow-crisp">
                  <LogIn className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-thyro-navy">
                    Login or register to continue booking.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Booking details are auto-filled from your registered account, so
                    patient contact information is not entered again on this form.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-thyro-blue px-5 text-sm font-bold text-white transition hover:bg-thyro-navy"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-thyro-green px-5 text-sm font-bold text-thyro-green transition hover:bg-thyro-mint"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <p className="flex items-center gap-2 text-sm font-bold text-thyro-navy">
                  <UserRound className="h-4 w-4 text-thyro-green" />
                  Account Details
                </p>
              </div>
              <label className="block text-sm">
                <span className="font-semibold text-slate-600">Full Name</span>
                <input
                  value={user.fullName}
                  readOnly
                  className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-slate-700"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-600">Phone Number</span>
                <input
                  value={user.phone}
                  readOnly
                  className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-slate-700"
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-600">Email</span>
                <input
                  value={user.email}
                  readOnly
                  className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-slate-700"
                />
              </label>
            </div>

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-thyro-navy">
                <MapPin className="h-4 w-4 text-thyro-green" />
                Booking Type
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {bookingTypes.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700 transition has-[:checked]:border-thyro-green has-[:checked]:bg-thyro-mint"
                  >
                    <input
                      type="radio"
                      value={type}
                      className="h-4 w-4 accent-thyro-green"
                      {...register("bookingType")}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="flex items-center gap-2 font-bold text-thyro-navy">
                  <CalendarClock className="h-4 w-4 text-thyro-green" />
                  Preferred Date
                </span>
                <input
                  type="date"
                  min={today()}
                  className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 text-slate-700 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                  {...register("bookingDate")}
                />
                {errors.bookingDate && (
                  <span className="mt-1 block text-xs font-semibold text-thyro-red">
                    {errors.bookingDate.message}
                  </span>
                )}
              </label>

              <label className="block text-sm">
                <span className="font-bold text-thyro-navy">Preferred Time Slot</span>
                <select
                  className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 text-slate-700 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                  {...register("preferredTimeSlot")}
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.preferredTimeSlot && (
                  <span className="mt-1 block text-xs font-semibold text-thyro-red">
                    {errors.preferredTimeSlot.message}
                  </span>
                )}
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              {(submitError || submitSuccess) && (
                <div className="sm:mr-auto">
                  {submitError && (
                    <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                      {submitError}
                    </p>
                  )}
                  {submitSuccess && (
                    <p className="rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
                      {submitSuccess}
                    </p>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full bg-thyro-green px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Booking..." : "Book Test"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
