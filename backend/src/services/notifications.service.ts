import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { AppError } from "../types/errors";
import { throwSupabaseError } from "./supabase-error.service";
import type { NotificationsQueryInput } from "../validators/notifications.validators";

type Client = SupabaseClient<Database>;
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];

const toNotificationResponse = (notification: NotificationRow) => ({
  id: notification.id,
  profile_id: null,
  user_email: notification.user_email,
  title: notification.title,
  message: notification.message,
  is_read: notification.is_read,
  created_at: notification.created_at,
  updated_at: null
});

export const notificationsService = {
  async create(client: Client, payload: NotificationInsert) {
    const { data, error } = await client
      .from("notifications")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throwSupabaseError(error, "Unable to create notification");
    }

    if (!data) {
      throw new AppError(500, "Notification was not returned after creation");
    }

    return toNotificationResponse(data);
  },

  async findAll(client: Client, filters: NotificationsQueryInput = { unreadOnly: false }) {
    let query = client
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.profileId) {
      throw new AppError(
        400,
        "Filtering notifications by profileId is not supported by the current Supabase schema",
        "UNSUPPORTED_FILTER"
      );
    }

    if (filters.unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
      throwSupabaseError(error, "Unable to fetch notifications");
    }

    return (data ?? []).map((notification) => toNotificationResponse(notification));
  },

  async markAsRead(client: Client, id: string, profileId?: string) {
    let query = client
      .from("notifications")
      .update({
        is_read: true
      })
      .eq("id", id);

    if (profileId) {
      throw new AppError(
        400,
        "Filtering notifications by profileId is not supported by the current Supabase schema",
        "UNSUPPORTED_FILTER"
      );
    }

    const { data, error } = await query.select("*").maybeSingle();

    if (error) {
      throwSupabaseError(error, "Unable to mark notification as read");
    }

    if (!data) {
      throw new AppError(404, "Notification not found", "NOTIFICATION_NOT_FOUND");
    }

    return toNotificationResponse(data);
  }
};
