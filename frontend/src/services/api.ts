import axios, { AxiosError } from "axios";
import type {
  Booking,
  BookingStatus,
  BookingType,
  Notification,
  Report,
} from "../types";
import { API_URL } from "../config/api";

const API_BASE_URL = `${API_URL}/api`;

const API_AUTH_TOKEN_KEY = "thyro_api_auth_token";

type ApiSuccess<T> = {
  status: "success";
  data: T;
};

type ApiErrorBody = {
  status: "error";
  error?: {
    code?: string;
    message?: string;
  };
};

type BackendBooking = {
  id: string;
  profile_id: string | null;
  patient_name?: string;
  user_email: string;
  phone?: string | null;
  test_name: string;
  category: string;
  price: number | null;
  booking_type: BookingType;
  booking_date: string;
  preferred_time_slot: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string | null;
};

type BackendReport = {
  id: string;
  profile_id: string | null;
  booking_id: string | null;
  test_name: string;
  report_url: string | null;
  result_summary: string | null;
  status: Report["status"];
  created_at: string;
  updated_at: string | null;
};

type BackendNotification = {
  id: string;
  profile_id: string | null;
  user_email?: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string | null;
};

type BackendProfile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
};

export type SyncProfilePayload = {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
};

export type CreateBookingPayload = {
  profileId?: string | null;
  patientName?: string;
  userEmail: string;
  phone?: string | null;
  testName: string;
  category: string;
  price: number | null;
  bookingType: BookingType;
  bookingDate: string;
  preferredTimeSlot: string;
  status?: BookingStatus;
};

type GetBookingsFilters = {
  profileId?: string;
  userEmail?: string;
  testName?: string;
  bookingDate?: string;
  status?: BookingStatus;
};

type GetReportsFilters = {
  profileId?: string;
  bookingId?: string;
  status?: Report["status"];
};

type GetNotificationsFilters = {
  profileId?: string;
  unreadOnly?: boolean;
};

const mapBooking = (booking: BackendBooking): Booking => ({
  id: booking.id,
  profileId: booking.profile_id,
  patientName: booking.patient_name,
  userEmail: booking.user_email,
  phone: booking.phone,
  testName: booking.test_name,
  category: booking.category,
  price: booking.price,
  bookingType: booking.booking_type,
  bookingDate: booking.booking_date,
  preferredTimeSlot: booking.preferred_time_slot,
  status: booking.status,
  createdAt: booking.created_at,
  updatedAt: booking.updated_at,
});

const mapReport = (report: BackendReport): Report => ({
  id: report.id,
  profileId: report.profile_id,
  bookingId: report.booking_id,
  testName: report.test_name,
  reportUrl: report.report_url,
  resultSummary: report.result_summary,
  status: report.status,
  createdAt: report.created_at,
  updatedAt: report.updated_at,
});

const mapNotification = (notification: BackendNotification): Notification => ({
  id: notification.id,
  profileId: notification.profile_id,
  userEmail: notification.user_email,
  title: notification.title,
  message: notification.message,
  isRead: notification.is_read,
  createdAt: notification.created_at,
  updatedAt: notification.updated_at,
});

export const getApiAuthToken = () => {
  if (typeof window !== "undefined") {
    const storedToken = window.localStorage.getItem(API_AUTH_TOKEN_KEY);
    if (storedToken) {
      return storedToken;
    }
  }

  return import.meta.env.VITE_API_AUTH_TOKEN || "";
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getApiAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorBody | undefined;
    return response?.error?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Unable to complete request.";
};

export const createBooking = async (payload: CreateBookingPayload) => {
  const response = await apiClient.post<ApiSuccess<{ booking: BackendBooking }>>(
    "/bookings",
    payload,
  );

  const booking = mapBooking(response.data.data.booking);

  if (import.meta.env.DEV) {
    console.info("[api] booking creation response", {
      success: true,
      bookingId: booking.id,
      status: booking.status,
    });
  }

  return booking;
};

export const syncProfile = async (payload: SyncProfilePayload) => {
  const response = await apiClient.post<ApiSuccess<{ profile: BackendProfile }>>(
    "/profiles/sync",
    payload,
  );

  const profile = response.data.data.profile;

  if (import.meta.env.DEV) {
    console.info("[api] profile save response", {
      success: true,
      profileId: profile.id,
    });
  }

  return profile;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const response = await apiClient.put<ApiSuccess<{ booking: BackendBooking }>>(
    `/bookings/${bookingId}`,
    { status },
  );

  return mapBooking(response.data.data.booking);
};

export const getBookings = async (filters: GetBookingsFilters = {}) => {
  const response = await apiClient.get<ApiSuccess<{ bookings: BackendBooking[] }>>(
    "/bookings",
    { params: filters },
  );

  const bookings = response.data.data.bookings.map(mapBooking);

  if (import.meta.env.DEV) {
    console.info("[api] My Bookings fetch response", {
      success: true,
      count: bookings.length,
      filteredByEmail: Boolean(filters.userEmail),
      filteredByProfile: Boolean(filters.profileId),
    });
  }

  return bookings;
};

export const getReports = async (filters: GetReportsFilters = {}) => {
  const response = await apiClient.get<ApiSuccess<{ reports: BackendReport[] }>>(
    "/reports",
    { params: filters },
  );

  return response.data.data.reports.map(mapReport);
};

export const uploadReport = async (bookingId: string, file: File) => {
  const formData = new FormData();
  formData.append("bookingId", bookingId);
  formData.append("report", file);

  const response = await apiClient.post<ApiSuccess<{ report: BackendReport }>>(
    "/reports/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return mapReport(response.data.data.report);
};

export const getNotifications = async (
  filters: GetNotificationsFilters = {},
) => {
  const response = await apiClient.get<
    ApiSuccess<{ notifications: BackendNotification[] }>
  >("/notifications", { params: filters });

  return response.data.data.notifications.map(mapNotification);
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await apiClient.patch<
    ApiSuccess<{ notification: BackendNotification }>
  >(`/notifications/${notificationId}/read`);

  return mapNotification(response.data.data.notification);
};
