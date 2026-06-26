import { z } from "zod";

export const notificationsQuerySchema = z.object({
  profileId: z.string().uuid().optional(),
  unreadOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true")
});

export type NotificationsQueryInput = z.infer<typeof notificationsQuerySchema>;
