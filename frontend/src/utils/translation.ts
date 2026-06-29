import type { TFunction } from "i18next";
import type {
  BookingStatus,
  BookingType,
  LabTest,
  Notification,
  ReportStatus,
  TestCategory,
} from "../types";

type Translator = TFunction<"translation", undefined>;

const knownBookingStatuses: BookingStatus[] = [
  "Requested",
  "Pending",
  "Confirmed",
  "Sample Collection Scheduled",
  "Sample Collected",
  "Processing",
  "Report Ready",
  "Completed",
  "Cancelled",
];

export const translateTestCategory = (
  t: Translator,
  category: TestCategory | string,
) => t(`tests.categories.${category}`, { defaultValue: category }) as string;

export const translateTestName = (t: Translator, testName: string) =>
  t(`tests.items.${testName}.name`, { defaultValue: testName }) as string;

export const translateTestDescription = (t: Translator, test: LabTest) =>
  t(`tests.items.${test.name}.description`, {
    defaultValue: test.description,
  }) as string;

export const translateReportTime = (t: Translator, reportTime: string) =>
  t(`tests.reportTimes.${reportTime}`, { defaultValue: reportTime }) as string;

export const formatTranslatedPrice = (
  t: Translator,
  price: number | null,
) =>
  price === null
    ? (t("tests.price.contact") as string)
    : (t("tests.price.inr", { price }) as string);

export const translateBookingType = (t: Translator, type: BookingType) =>
  t(`booking.types.${type}`, { defaultValue: type }) as string;

export const translateBookingStatus = (
  t: Translator,
  status: BookingStatus | string,
) => t(`booking.status.${status}`, { defaultValue: status }) as string;

export const translateReportStatus = (
  t: Translator,
  status: ReportStatus | string,
) => t(`reports.status.${status}`, { defaultValue: status }) as string;

export const translateKnownMessage = (t: Translator, message: string) => {
  const staticMessages: Record<string, string> = {
    "Unable to complete request.": "errors.request",
    "Password reset is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.":
      "errors.passwordResetConfig",
    "Password reset link is invalid or has expired. Please request a new link.":
      "errors.invalidResetLink",
    "An account with this email already exists.": "auth.errors.duplicateEmail",
    "No registered account was found for this email.": "auth.errors.noAccount",
    "The email or password is incorrect.": "auth.errors.incorrectPassword",
    "No registered account was found.": "auth.errors.noRegisteredAccount",
    "The current password is incorrect.": "auth.errors.currentPassword",
  };
  const key = staticMessages[message];
  return key ? (t(key) as string) : message;
};

export const translateNotificationTitle = (
  t: Translator,
  notification: Notification,
) =>
  t(`notifications.titles.${notification.title}`, {
    defaultValue: notification.title,
  }) as string;

export const translateNotificationMessage = (
  t: Translator,
  notification: Notification,
) => {
  const bookingCreatedMatch = notification.message.match(
    /^Your (.+) booking is (.+)\.$/,
  );

  if (notification.title === "Booking created" && bookingCreatedMatch) {
    const [, testName, statusText] = bookingCreatedMatch;
    const matchingStatus = knownBookingStatuses.find(
      (status) => status.toLowerCase() === statusText.toLowerCase(),
    );

    return t("notifications.messages.bookingCreated", {
      testName: translateTestName(t, testName),
      status: matchingStatus
        ? translateBookingStatus(t, matchingStatus)
        : statusText,
    }) as string;
  }

  return translateKnownMessage(t, notification.message);
};

export const languageToLocale = (language: string) => {
  if (language.startsWith("te")) {
    return "te-IN";
  }

  if (language.startsWith("hi")) {
    return "hi-IN";
  }

  return "en-IN";
};
