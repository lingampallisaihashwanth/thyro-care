export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookingStatus =
  | "Requested"
  | "Confirmed"
  | "Sample Collected"
  | "Completed"
  | "Cancelled";

export type BookingType =
  | "Home Sample Collection"
  | "Laboratory Visit"
  | "Request Callback";

export type ReportStatus = "Pending" | "Ready" | "Delivered" | "Cancelled";

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
};

export type Booking = {
  id: string;
  profile_id: string | null;
  patient_name: string;
  email: string;
  phone: string | null;
  test_name: string;
  category: string;
  price: number | null;
  booking_type: BookingType;
  appointment_date: string | null;
  preferred_time_slot: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Report = {
  id: string;
  booking_id: string | null;
  report_url: string | null;
  uploaded_at: string;
};

export type Notification = {
  id: string;
  user_email: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Profile, "id" | "created_at">>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Booking, "id" | "created_at">>;
        Relationships: [];
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, "id" | "uploaded_at"> & {
          id?: string;
          uploaded_at?: string;
        };
        Update: Partial<Omit<Report, "id" | "uploaded_at">>;
        Relationships: [];
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Notification, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
