export type TestCategory =
  | "Hormone Tests"
  | "Diabetes"
  | "Blood Tests"
  | "Vitamin Tests"
  | "Liver Tests"
  | "Kidney Tests"
  | "Heart & Risk Markers"
  | "Infection Tests";

export type LabTest = {
  name: string;
  category: TestCategory;
  price: number | null;
  description: string;
  reportTime: string;
};

export type RegisteredUser = {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  languagePreference?: LanguagePreference;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  profilePhoto?: string;
};

export type BookingType =
  | "Home Sample Collection"
  | "Laboratory Visit"
  | "Request Callback";

export type BookingStatus =
  | "Requested"
  | "Pending"
  | "Confirmed"
  | "Sample Collection Scheduled"
  | "Sample Collected"
  | "Processing"
  | "Report Ready"
  | "Completed"
  | "Cancelled";

export type LanguagePreference = "en" | "te" | "hi" | "ta" | "kn" | "ml";

export type Booking = {
  id?: string;
  profileId?: string | null;
  patientName?: string;
  userEmail: string;
  phone?: string | null;
  testName: string;
  category: TestCategory | string;
  price: number | null;
  bookingType: BookingType;
  bookingDate: string;
  preferredTimeSlot: string;
  status: BookingStatus;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export type ReportStatus = "Pending" | "Ready" | "Delivered" | "Cancelled";

export type Report = {
  id: string;
  profileId: string | null;
  bookingId: string | null;
  testName: string;
  reportUrl: string | null;
  resultSummary: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string | null;
};

export type Notification = {
  id: string;
  profileId: string | null;
  userEmail?: string | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string | null;
};
