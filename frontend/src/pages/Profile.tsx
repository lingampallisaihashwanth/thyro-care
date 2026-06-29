import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  ClipboardList,
  Download,
  FileText,
  Languages,
  LockKeyhole,
  MessageCircle,
  Phone,
  Settings,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { EmptyState } from "../components/EmptyState";
import { StaticLogo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { normalizeLanguage, supportedLanguages } from "../i18n";
import {
  cancelBooking,
  getApiErrorMessage,
  getBookings,
  getNotifications,
  getReports,
} from "../services/api";
import { subscribeToBookingChanges } from "../services/supabaseRealtime";
import type { Booking, BookingStatus, LanguagePreference, Notification, Report } from "../types";
import { saveCachedLanguagePreference } from "../utils/storage";
import {
  formatTranslatedPrice,
  languageToLocale,
  translateBookingStatus,
  translateBookingType,
  translateKnownMessage,
  translateNotificationMessage,
  translateNotificationTitle,
  translateReportStatus,
  translateTestCategory,
  translateTestName,
} from "../utils/translation";

const createEditProfileSchema = (
  tr: (key: string, defaultValue: string) => string,
) =>
  z.object({
    fullName: z.string().min(2, tr("validation.fullName", "Full name is required.")),
    phone: z.string().regex(/^[0-9]{10}$/, tr("validation.phone10", "Enter a 10 digit phone number.")),
  });

const createPasswordSchema = (
  tr: (key: string, defaultValue: string) => string,
) =>
  z
    .object({
      currentPassword: z.string().min(1, tr("validation.currentPassword", "Current password is required.")),
      nextPassword: z.string().min(6, tr("validation.nextPasswordMin", "New password must be at least 6 characters.")),
      confirmPassword: z.string().min(1, tr("validation.confirmNewPassword", "Confirm your new password.")),
    })
    .refine((values) => values.nextPassword === values.confirmPassword, {
      message: tr("validation.passwordsMatch", "Passwords do not match."),
      path: ["confirmPassword"],
    });

type EditProfileValues = z.infer<ReturnType<typeof createEditProfileSchema>>;
type PasswordValues = z.infer<ReturnType<typeof createPasswordSchema>>;
type SettingsPanel = "edit" | "password";
type ProfileLocationState = {
  bookingSuccess?: string;
  booking?: Booking;
};
type BookingDialogState =
  | { type: "confirm-cancel"; booking: Booking }
  | { type: "cannot-cancel"; booking: Booking }
  | null;

const contactLinks = {
  call: "tel:9985931929",
  whatsapp: "https://wa.me/919985931929",
};

const upcomingStatuses = new Set<BookingStatus>([
  "Requested",
  "Pending",
  "Confirmed",
  "Sample Collection Scheduled",
  "Sample Collected",
  "Processing",
]);

const previousStatuses = new Set<BookingStatus>([
  "Completed",
  "Cancelled",
  "Report Ready",
]);

const cancellableStatuses = new Set<BookingStatus>(["Requested", "Pending"]);

const bookingKey = (booking: Booking) =>
  booking.id ?? `${booking.userEmail}-${booking.testName}-${booking.createdAt}`;

const valueOrFallback = (value: string | null | undefined, fallback: string) =>
  value && value.trim() ? value : fallback;

const parseBookingDate = (booking: Booking) => {
  const parsed = new Date(`${booking.bookingDate}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
};

const formatBookingDate = (date: string, locale: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const formatDateTime = (
  value: string | null | undefined,
  locale: string,
  fallback: string,
) => {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

export const Profile = () => {
  const { user, updateUser, changePassword } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [languageMessage, setLanguageMessage] = useState("");
  const [languageError, setLanguageError] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [bookingDialog, setBookingDialog] = useState<BookingDialogState>(null);
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguagePreference>(
    () => normalizeLanguage(user?.languagePreference),
  );
  const userEmail = user?.email ?? "";
  const tr = (key: string, defaultValue: string) =>
    t(key, { defaultValue }) as string;
  const editProfileSchema = useMemo(
    () => createEditProfileSchema(tr),
    [i18n.language],
  );
  const passwordSchema = useMemo(
    () => createPasswordSchema(tr),
    [i18n.language],
  );
  const currentLocale = languageToLocale(i18n.language);
  const notProvided = tr("common.notProvided", "Not Provided");
  const notAvailable = tr("common.notAvailable", "Not Available");

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
    setSelectedLanguage(normalizeLanguage(user?.languagePreference));
  }, [user?.languagePreference]);

  const loadProfileData = useCallback(async () => {
    if (!userEmail) {
      return;
    }

    setApiLoading(true);
    setBookingsError("");
    setReportsError("");
    setNotificationsError("");

    try {
      const [bookingsResult, reportsResult, notificationsResult] =
        await Promise.allSettled([
          getBookings({ userEmail }),
          getReports(),
          getNotifications(),
        ]);

      if (bookingsResult.status === "fulfilled") {
        setBookings(bookingsResult.value);
      } else {
        setBookingsError(
          translateKnownMessage(t, getApiErrorMessage(bookingsResult.reason)),
        );
      }

      if (reportsResult.status === "fulfilled") {
        setReports(reportsResult.value);
      } else {
        setReportsError(
          translateKnownMessage(t, getApiErrorMessage(reportsResult.reason)),
        );
      }

      if (notificationsResult.status === "fulfilled") {
        setNotifications(notificationsResult.value);
      } else {
        setNotificationsError(
          translateKnownMessage(t, getApiErrorMessage(notificationsResult.reason)),
        );
      }
    } finally {
      setApiLoading(false);
    }
  }, [t, userEmail]);

  useEffect(() => {
    if (!userEmail) {
      setBookings([]);
      setReports([]);
      setNotifications([]);
      return;
    }

    void loadProfileData();
  }, [loadProfileData, userEmail]);

  useEffect(() => {
    if (!userEmail) {
      return undefined;
    }

    return subscribeToBookingChanges(userEmail, () => {
      void loadProfileData();
    });
  }, [loadProfileData, userEmail]);

  useEffect(() => {
    const state = location.state as ProfileLocationState | null;
    if (state?.bookingSuccess) {
      setPageMessage(state.bookingSuccess);
    }
    if (state?.booking) {
      setBookings((current) => {
        const next = new Map<string, Booking>();
        [state.booking as Booking, ...current].forEach((booking) => {
          next.set(bookingKey(booking), booking);
        });
        return [...next.values()];
      });
      void loadProfileData();
    }

    if (location.hash) {
      const element = document.querySelector(location.hash);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loadProfileData, location.hash, location.state]);

  const reportsByBookingId = useMemo(() => {
    const reportMap = new Map<string, Report>();

    reports.forEach((report) => {
      if (report.bookingId && report.reportUrl) {
        reportMap.set(report.bookingId, report);
      }
    });

    return reportMap;
  }, [reports]);

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((booking) => upcomingStatuses.has(booking.status))
        .sort((a, b) => {
          const first = parseBookingDate(a) ?? Number.MAX_SAFE_INTEGER;
          const second = parseBookingDate(b) ?? Number.MAX_SAFE_INTEGER;
          return first - second;
        }),
    [bookings],
  );

  const previousBookings = useMemo(
    () =>
      bookings
        .filter((booking) => previousStatuses.has(booking.status))
        .sort((a, b) => {
          const first = parseBookingDate(a) ?? 0;
          const second = parseBookingDate(b) ?? 0;
          return second - first;
        }),
    [bookings],
  );

  if (!user) {
    return null;
  }

  const currentLanguage = selectedLanguage;
  const selectableLanguages = supportedLanguages.filter(
    (language) => language.isSelectable,
  );

  const personalInfo = [
    { label: tr("profile.personal.fullName", "Full Name"), value: valueOrFallback(user.fullName, notProvided) },
    { label: tr("profile.personal.phoneNumber", "Phone Number"), value: valueOrFallback(user.phone, notProvided) },
    { label: tr("profile.personal.email", "Email"), value: valueOrFallback(user.email, notProvided) },
    { label: tr("profile.personal.dateOfBirth", "Date Of Birth"), value: valueOrFallback(user.dateOfBirth, notProvided) },
    { label: tr("profile.personal.gender", "Gender"), value: valueOrFallback(user.gender, notProvided) },
    { label: tr("profile.personal.address", "Address"), value: valueOrFallback(user.address, notProvided) },
    {
      label: tr("profile.personal.profilePhoto", "Profile Photo"),
      value: user.profilePhoto ? tr("profile.personal.uploaded", "Uploaded") : tr("profile.personal.notUploaded", "Not Uploaded"),
    },
  ];

  const onEditProfile = async (values: EditProfileValues) => {
    setSettingsError("");
    setSettingsMessage("");
    try {
      await updateUser({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
      });
      setSettingsMessage(tr("profile.messages.profileUpdated", "Profile updated in the database."));
    } catch (error) {
      setSettingsError(translateKnownMessage(t, getApiErrorMessage(error)));
    }
  };

  const onChangePassword = (values: PasswordValues) => {
    setSettingsError("");
    setSettingsMessage("");

    try {
      changePassword(values.currentPassword, values.nextPassword);
      passwordForm.reset();
      setSettingsMessage(tr("profile.messages.passwordChanged", "Password changed."));
    } catch (error) {
      setSettingsError(
        error instanceof Error
          ? translateKnownMessage(t, error.message)
          : tr("profile.errors.changePassword", "Unable to change password."),
      );
    }
  };

  const onLanguageChange = async (language: LanguagePreference) => {
    setLanguageError("");
    setLanguageMessage("");
    setSelectedLanguage(language);
    saveCachedLanguagePreference(language);
    await i18n.changeLanguage(language);

    try {
      await updateUser({ languagePreference: language });
      setLanguageMessage(i18n.t("profile.messages.languageSaved") as string);
    } catch (error) {
      setLanguageError(translateKnownMessage(t, getApiErrorMessage(error)));
    }
  };

  const openCancelDialog = (booking: Booking) => {
    setCancelError("");

    if (cancellableStatuses.has(booking.status)) {
      setBookingDialog({ type: "confirm-cancel", booking });
      return;
    }

    if (booking.status === "Confirmed") {
      setBookingDialog({ type: "cannot-cancel", booking });
    }
  };

  const confirmCancelBooking = async () => {
    if (bookingDialog?.type !== "confirm-cancel") {
      return;
    }

    const bookingId = bookingDialog.booking.id;
    if (!bookingId) {
      setCancelError(tr("profile.bookings.cancelMissingId", "Unable to cancel this booking because the booking ID is missing."));
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      const cancelledBooking = await cancelBooking(bookingId, user.email);
      setBookings((current) =>
        current.map((booking) =>
          bookingKey(booking) === bookingKey(cancelledBooking)
            ? cancelledBooking
            : booking,
        ),
      );
      await loadProfileData();
      setPageMessage(tr("profile.bookings.cancelSuccess", "Booking cancelled successfully."));
      setBookingDialog(null);
    } catch (error) {
      setCancelError(translateKnownMessage(t, getApiErrorMessage(error)));
    } finally {
      setIsCancelling(false);
    }
  };

  const renderBookingCard = (booking: Booking) => {
    const report = booking.id ? reportsByBookingId.get(booking.id) : undefined;
    const canShowCancel =
      cancellableStatuses.has(booking.status) || booking.status === "Confirmed";

    return (
      <article
        key={bookingKey(booking)}
        className="grid gap-4 rounded-lg border border-slate-200 p-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-start"
      >
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">
            {tr("profile.bookings.testName", "Test Name")}
          </p>
          <h3 className="mt-1 text-lg font-black text-thyro-navy">
            {translateTestName(t, booking.testName)}
          </h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {translateTestCategory(t, booking.category)} | {formatTranslatedPrice(t, booking.price)}
          </p>
          <p className="mt-3 text-xs font-bold uppercase text-slate-500">
            {tr("profile.bookings.bookingId", "Booking ID")}
          </p>
          <p className="mt-1 break-all text-sm font-bold text-slate-700">
            {valueOrFallback(booking.id, notProvided)}
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {tr("profile.bookings.bookingDate", "Booking Date")}
            </p>
            <p className="mt-1 font-bold text-slate-700">
              {formatBookingDate(booking.bookingDate, currentLocale)}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {tr("profile.bookings.preferredTimeSlot", "Preferred Time Slot")}
            </p>
            <p className="mt-1 font-bold text-slate-700">
              {booking.preferredTimeSlot}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {tr("profile.bookings.bookingMode", "Booking Mode")}
            </p>
            <p className="mt-1 font-bold text-slate-700">
              {translateBookingType(t, booking.bookingType)}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {tr("profile.bookings.createdDate", "Created Date")}
            </p>
            <p className="mt-1 font-bold text-slate-700">
              {formatDateTime(booking.createdAt, currentLocale, notAvailable)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <p className="text-xs font-bold uppercase text-slate-500">
            {tr("profile.bookings.bookingStatus", "Booking Status")}
          </p>
          <span className="inline-flex min-h-9 items-center justify-center rounded-full bg-thyro-sky px-4 py-2 text-sm font-extrabold text-thyro-blue">
            {translateBookingStatus(t, booking.status)}
          </span>
          {report?.reportUrl && (
            <a
              href={report.reportUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-thyro-green px-4 text-sm font-bold text-thyro-green transition hover:bg-thyro-mint"
            >
              <Download className="h-4 w-4" />
              {tr("profile.bookings.downloadReport", "Download Report")}
            </a>
          )}
          {canShowCancel && (
            <button
              type="button"
              onClick={() => openCancelDialog(booking)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-thyro-red px-4 text-sm font-bold text-thyro-red transition hover:bg-red-50"
            >
              {tr("profile.bookings.cancelBooking", "Cancel Booking")}
            </button>
          )}
        </div>
      </article>
    );
  };

  const renderBookingSection = (
    title: string,
    emptyTitle: string,
    sectionBookings: Booking[],
    showBookTestButton = false,
  ) => (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-xl font-black text-thyro-navy">{title}</h3>
      <div className="mt-4">
        {sectionBookings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <p className="text-sm font-bold text-thyro-navy">{emptyTitle}</p>
            {showBookTestButton && (
              <button
                type="button"
                onClick={() => navigate("/tests")}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-thyro-green px-5 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700"
              >
                {tr("profile.bookings.bookTest", "Book Test")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">{sectionBookings.map(renderBookingCard)}</div>
        )}
      </div>
    </div>
  );

  return (
    <main className="bg-slate-50">
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <StaticLogo />
            <h1 className="mt-6 text-4xl font-black text-thyro-navy">
              {tr("profile.title", "Profile")}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {tr(
                "profile.subtitle",
                "Your personal information, bookings, reports, notifications, and account settings are managed here.",
              )}
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
                  {tr("profile.sections.section1", "Section 1")}
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.personal.title", "Personal Information")}
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
            id="language-preference"
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-thyro-green">
                  {tr("profile.sections.section2", "Section 2")}
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.language.title", "Language Preference")}
                </h2>
              </div>
            </div>

            <label className="mt-6 block max-w-md text-sm">
              <span className="font-bold text-slate-700">
                {tr("profile.language.selectLabel", "Preferred Language")}
              </span>
              <select
                value={currentLanguage}
                onChange={(event) =>
                  void onLanguageChange(event.target.value as LanguagePreference)
                }
                className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
              >
                {selectableLanguages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {tr(`profile.language.labels.${language.code}`, language.label)}
                  </option>
                ))}
              </select>
            </label>

            {languageMessage && (
              <p className="mt-4 rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
                {languageMessage}
              </p>
            )}
            {languageError && (
              <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                {languageError}
              </p>
            )}
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
                  {tr("profile.sections.section3", "Section 3")}
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.bookings.title", "My Bookings")}
                </h2>
              </div>
            </div>

            <div className="mt-6">
              {apiLoading ? (
                <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                  {tr("profile.bookings.loading", "Loading bookings...")}
                </p>
              ) : bookingsError ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                  {bookingsError}
                </p>
              ) : (
                <div className="grid gap-5">
                  {renderBookingSection(
                    tr("profile.bookings.upcoming", "Upcoming Bookings"),
                    tr("profile.bookings.noUpcoming", "No upcoming bookings found."),
                    upcomingBookings,
                    true,
                  )}
                  {renderBookingSection(
                    tr("profile.bookings.previous", "Previous Bookings"),
                    tr("profile.bookings.noPrevious", "No previous bookings available."),
                    previousBookings,
                  )}
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
                  {tr("profile.sections.section4", "Section 4")}
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.reports.title", "My Reports")}
                </h2>
              </div>
            </div>
            <div className="mt-6">
              {apiLoading ? (
                <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                  {tr("profile.reports.loading", "Loading reports...")}
                </p>
              ) : reportsError ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                  {reportsError}
                </p>
              ) : reports.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title={tr("profile.reports.empty", "No reports available")}
                />
              ) : (
                <div className="grid gap-4">
                  {reports.map((report) => (
                    <article
                      key={report.id}
                      className="grid gap-4 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          {tr("profile.bookings.testName", "Test Name")}
                        </p>
                        <h3 className="mt-1 text-lg font-black text-thyro-navy">
                          {translateTestName(t, report.testName)}
                        </h3>
                        {report.resultSummary && (
                          <p className="mt-1 text-sm text-slate-500">
                            {translateKnownMessage(t, report.resultSummary)}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          {tr("profile.reports.generated", "Generated")}
                        </p>
                        <p className="mt-1 font-bold text-slate-700">
                          {formatDateTime(report.createdAt, currentLocale, notAvailable)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <span className="inline-flex h-9 items-center justify-center rounded-full bg-thyro-sky px-4 text-sm font-extrabold text-thyro-blue">
                          {translateReportStatus(t, report.status)}
                        </span>
                        {report.reportUrl && (
                          <a
                            href={report.reportUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-thyro-green hover:text-emerald-700"
                          >
                            {tr("profile.reports.viewReport", "View report")}
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
                  {tr("profile.sections.section5", "Section 5")}
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.notifications.title", "Notifications")}
                </h2>
              </div>
            </div>
            <div className="mt-6">
              {apiLoading ? (
                <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                  {tr("profile.notifications.loading", "Loading notifications...")}
                </p>
              ) : notificationsError ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                  {notificationsError}
                </p>
              ) : notifications.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title={tr("profile.notifications.empty", "No notifications available")}
                />
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
                            {translateNotificationTitle(t, notification)}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {translateNotificationMessage(t, notification)}
                          </p>
                          <p className="mt-2 text-xs font-bold uppercase text-slate-500">
                            {formatDateTime(notification.createdAt, currentLocale, notAvailable)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-extrabold ${
                            notification.isRead
                              ? "bg-slate-100 text-slate-600"
                              : "bg-thyro-mint text-thyro-green"
                          }`}
                        >
                          {notification.isRead
                            ? tr("profile.notifications.read", "Read")
                            : tr("profile.notifications.unread", "Unread")}
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
                  {tr("profile.sections.section6", "Section 6")}
                </p>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.settings.title", "Account Settings")}
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
                {tr("profile.settings.editProfile", "Edit Profile")}
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
                {tr("profile.settings.changePassword", "Change Password")}
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
                  <span className="font-bold text-slate-700">
                    {tr("profile.personal.fullName", "Full Name")}
                  </span>
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
                  <span className="font-bold text-slate-700">
                    {tr("profile.personal.phoneNumber", "Phone Number")}
                  </span>
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
                    {editForm.formState.isSubmitting
                      ? tr("profile.settings.saving", "Saving...")
                      : tr("profile.settings.saveChanges", "Save Changes")}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={passwordForm.handleSubmit(onChangePassword)}
                className="mt-6 grid gap-4 sm:grid-cols-3"
              >
                <label className="block text-sm">
                  <span className="font-bold text-slate-700">
                    {tr("profile.settings.currentPassword", "Current Password")}
                  </span>
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
                  <span className="font-bold text-slate-700">
                    {tr("profile.settings.newPassword", "New Password")}
                  </span>
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
                  <span className="font-bold text-slate-700">
                    {tr("profile.settings.confirmPassword", "Confirm Password")}
                  </span>
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
                    {tr("profile.settings.updatePassword", "Update Password")}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </section>

      {bookingDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-thyro-ink/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            {bookingDialog.type === "confirm-cancel" ? (
              <>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.dialogs.cancelTitle", "Cancel Booking")}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {tr(
                    "profile.dialogs.cancelMessage",
                    "Are you sure you want to cancel this booking?",
                  )}
                </p>
                {cancelError && (
                  <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
                    {cancelError}
                  </p>
                )}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={() => setBookingDialog(null)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {tr("profile.dialogs.no", "No")}
                  </button>
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={() => void confirmCancelBooking()}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-thyro-red px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isCancelling
                      ? tr("profile.dialogs.cancelling", "Cancelling...")
                      : tr("profile.dialogs.yesCancel", "Yes, Cancel")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-thyro-navy">
                  {tr("profile.dialogs.cannotCancelTitle", "Cannot Cancel Booking")}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {tr(
                    "profile.dialogs.cannotCancelMessage",
                    "This booking has already been confirmed by THYRO LABORATORIES. Once a booking is confirmed, it cannot be cancelled online. Please contact the laboratory for further assistance.",
                  )}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <a
                    href={contactLinks.call}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-thyro-red px-4 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    <Phone className="h-4 w-4" />
                    {tr("profile.dialogs.call", "Call Laboratory")}
                  </a>
                  <a
                    href={contactLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-thyro-green px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {tr("profile.dialogs.whatsapp", "WhatsApp Laboratory")}
                  </a>
                  <button
                    type="button"
                    onClick={() => setBookingDialog(null)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    {tr("profile.dialogs.close", "Close")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
