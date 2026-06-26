import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  LockKeyhole,
  Settings,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { EmptyState } from "../components/EmptyState";
import { StaticLogo } from "../components/Logo";
import { formatPrice } from "../data/tests";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage, getBookings, getNotifications, getReports } from "../services/api";
import type { Booking, Notification, Report } from "../types";

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10 digit phone number."),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    nextPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.nextPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type EditProfileValues = z.infer<typeof editProfileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type SettingsPanel = "edit" | "password";
type ProfileLocationState = {
  bookingSuccess?: string;
  booking?: Booking;
};

const bookingKey = (booking: Booking) =>
  booking.id ?? `${booking.userEmail}-${booking.testName}-${booking.createdAt}`;

const mergeBookings = (primary: Booking[], secondary: Booking[]) => {
  const merged = new Map<string, Booking>();

  [...primary, ...secondary].forEach((booking) => {
    merged.set(bookingKey(booking), booking);
  });

  return [...merged.values()];
};

const valueOrFallback = (value?: string, fallback = "Not Provided") =>
  value && value.trim() ? value : fallback;

const formatBookingDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

export const Profile = () => {
  const { user, updateUser, changePassword } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [reportsError, setReportsError] = useState("");
  const [notificationsError, setNotificationsError] = useState("");
  const [activePanel, setActivePanel] = useState<SettingsPanel>("edit");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const location = useLocation();

  const editForm = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    values: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      nextPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      let isActive = true;

      setApiLoading(true);
      setBookingsError("");
      setReportsError("");
      setNotificationsError("");

      Promise.allSettled([
        getBookings({ userEmail: user.email }),
        getReports(),
        getNotifications(),
      ])
        .then(([bookingsResult, reportsResult, notificationsResult]) => {
          if (!isActive) {
            return;
          }

          if (bookingsResult.status === "fulfilled") {
            setBookings((current) => mergeBookings(bookingsResult.value, current));
          } else {
            setBookingsError(getApiErrorMessage(bookingsResult.reason));
          }

          if (reportsResult.status === "fulfilled") {
            setReports(reportsResult.value);
          } else {
            setReportsError(getApiErrorMessage(reportsResult.reason));
          }

          if (notificationsResult.status === "fulfilled") {
            setNotifications(notificationsResult.value);
          } else {
            setNotificationsError(getApiErrorMessage(notificationsResult.reason));
          }
        })
        .finally(() => {
          if (isActive) {
            setApiLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }

    setBookings([]);
    setReports([]);
    setNotifications([]);
  }, [user]);

  useEffect(() => {
    const state = location.state as ProfileLocationState | null;
    if (state?.bookingSuccess) {
      setPageMessage(state.bookingSuccess);
    }
    if (state?.booking) {
      setBookings((current) => mergeBookings([state.booking as Booking], current));
    }

    if (location.hash) {
      const element = document.querySelector(location.hash);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, location.state]);

  if (!user) {
    return null;
  }

  const personalInfo = [
    { label: "Full Name", value: valueOrFallback(user.fullName) },
    { label: "Phone Number", value: valueOrFallback(user.phone) },
    { label: "Email", value: valueOrFallback(user.email) },
    { label: "Date Of Birth", value: valueOrFallback(user.dateOfBirth) },
    { label: "Gender", value: valueOrFallback(user.gender) },
    { label: "Address", value: valueOrFallback(user.address) },
    { label: "Profile Photo", value: user.profilePhoto ? "Uploaded" : "Not Uploaded" },
  ];

  const onEditProfile = async (values: EditProfileValues) => {
    setSettingsError("");
    setSettingsMessage("");
    try {
      await updateUser({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
      });
      setSettingsMessage("Profile updated in the database.");
    } catch (error) {
      setSettingsError(getApiErrorMessage(error));
    }
  };

  const onChangePassword = (values: PasswordValues) => {
    setSettingsError("");
    setSettingsMessage("");

    try {
      changePassword(values.currentPassword, values.nextPassword);
      passwordForm.reset();
      setSettingsMessage("Password changed.");
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : "Unable to change password.",
      );
    }
  };

  return (
    <main className="bg-slate-50">
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <StaticLogo />
            <h1 className="mt-6 text-4xl font-black text-thyro-navy">Profile</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Your personal information, bookings, reports, notifications, and
              account settings are managed here.
            </p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-full bg-thyro-blue text-2xl font-black text-white shadow-soft">
            {user.fullName.trim().charAt(0).toUpperCase() || "T"}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          {pageMessage && (
            <p className="rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
              {pageMessage}
            </p>
          )}

          <section
            id="personal-information"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-thyro-green">
                  Section 1
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  Personal Information
                </h2>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {personalInfo.map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-extrabold text-thyro-navy">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            id="bookings"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-thyro-green">
                  Section 2
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">My Bookings</h2>
              </div>
            </div>

            <div className="mt-6">
              {apiLoading ? (
                <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                  Loading bookings...
                </p>
              ) : bookingsError ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                  {bookingsError}
                </p>
              ) : bookings.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title="No bookings available"
                  text="Your booked tests will appear here after you submit a booking."
                />
              ) : (
                <div className="grid gap-4">
                  {bookings.map((booking) => (
                    <article
                      key={bookingKey(booking)}
                      className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Test Name
                        </p>
                        <h3 className="mt-1 text-lg font-black text-thyro-navy">
                          {booking.testName}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {booking.category} | {formatPrice(booking.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Booking Date
                        </p>
                        <p className="mt-1 font-bold text-slate-700">
                          {formatBookingDate(booking.bookingDate)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.preferredTimeSlot}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Booking Type
                        </p>
                        <p className="mt-1 font-bold text-slate-700">
                          {booking.bookingType}
                        </p>
                      </div>
                      <span className="inline-flex h-9 items-center justify-center rounded-full bg-thyro-sky px-4 text-sm font-extrabold text-thyro-blue">
                        {booking.status}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            id="reports"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-thyro-green">
                  Section 3
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">My Reports</h2>
              </div>
            </div>
            <div className="mt-6">
              {apiLoading ? (
                <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                  Loading reports...
                </p>
              ) : reportsError ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                  {reportsError}
                </p>
              ) : reports.length === 0 ? (
                <EmptyState icon={FileText} title="No reports available" />
              ) : (
                <div className="grid gap-4">
                  {reports.map((report) => (
                    <article
                      key={report.id}
                      className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Test Name
                        </p>
                        <h3 className="mt-1 text-lg font-black text-thyro-navy">
                          {report.testName}
                        </h3>
                        {report.resultSummary && (
                          <p className="mt-1 text-sm text-slate-500">
                            {report.resultSummary}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Generated
                        </p>
                        <p className="mt-1 font-bold text-slate-700">
                          {formatDateTime(report.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <span className="inline-flex h-9 items-center justify-center rounded-full bg-thyro-sky px-4 text-sm font-extrabold text-thyro-blue">
                          {report.status}
                        </span>
                        {report.reportUrl && (
                          <a
                            href={report.reportUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-thyro-green hover:text-emerald-700"
                          >
                            View report
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            id="notifications"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-thyro-green">
                  Section 4
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">Notifications</h2>
              </div>
            </div>
            <div className="mt-6">
              {apiLoading ? (
                <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                  Loading notifications...
                </p>
              ) : notificationsError ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                  {notificationsError}
                </p>
              ) : notifications.length === 0 ? (
                <EmptyState icon={Bell} title="No notifications available" />
              ) : (
                <div className="grid gap-4">
                  {notifications.map((notification) => (
                    <article
                      key={notification.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-black text-thyro-navy">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs font-bold uppercase text-slate-500">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-extrabold ${
                            notification.isRead
                              ? "bg-slate-100 text-slate-600"
                              : "bg-thyro-mint text-thyro-green"
                          }`}
                        >
                          {notification.isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            id="account-settings"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-thyro-green">
                  Section 5
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  Account Settings
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setActivePanel("edit");
                  setSettingsError("");
                  setSettingsMessage("");
                }}
                className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition ${
                  activePanel === "edit"
                    ? "bg-thyro-blue text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-thyro-sky"
                }`}
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePanel("password");
                  setSettingsError("");
                  setSettingsMessage("");
                }}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition ${
                  activePanel === "password"
                    ? "bg-thyro-blue text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-thyro-sky"
                }`}
              >
                <LockKeyhole className="h-4 w-4" />
                Change Password
              </button>
            </div>

            {settingsMessage && (
              <p className="mt-5 rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
                {settingsMessage}
              </p>
            )}
            {settingsError && (
              <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                {settingsError}
              </p>
            )}

            {activePanel === "edit" ? (
              <form
                onSubmit={editForm.handleSubmit(onEditProfile)}
                className="mt-6 grid gap-4 sm:grid-cols-2"
              >
                <label className="block text-sm">
                  <span className="font-bold text-slate-700">Full Name</span>
                  <input
                    className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                    {...editForm.register("fullName")}
                  />
                  {editForm.formState.errors.fullName && (
                    <span className="mt-1 block text-xs font-semibold text-thyro-red">
                      {editForm.formState.errors.fullName.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm">
                  <span className="font-bold text-slate-700">Phone Number</span>
                  <input
                    className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                    {...editForm.register("phone")}
                  />
                  {editForm.formState.errors.phone && (
                    <span className="mt-1 block text-xs font-semibold text-thyro-red">
                      {editForm.formState.errors.phone.message}
                    </span>
                  )}
                </label>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={editForm.formState.isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-thyro-green px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {editForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={passwordForm.handleSubmit(onChangePassword)}
                className="mt-6 grid gap-4 sm:grid-cols-3"
              >
                <label className="block text-sm">
                  <span className="font-bold text-slate-700">Current Password</span>
                  <input
                    type="password"
                    className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                    {...passwordForm.register("currentPassword")}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <span className="mt-1 block text-xs font-semibold text-thyro-red">
                      {passwordForm.formState.errors.currentPassword.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm">
                  <span className="font-bold text-slate-700">New Password</span>
                  <input
                    type="password"
                    className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                    {...passwordForm.register("nextPassword")}
                  />
                  {passwordForm.formState.errors.nextPassword && (
                    <span className="mt-1 block text-xs font-semibold text-thyro-red">
                      {passwordForm.formState.errors.nextPassword.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm">
                  <span className="font-bold text-slate-700">Confirm Password</span>
                  <input
                    type="password"
                    className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                    {...passwordForm.register("confirmPassword")}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <span className="mt-1 block text-xs font-semibold text-thyro-red">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </label>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-thyro-green px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};
