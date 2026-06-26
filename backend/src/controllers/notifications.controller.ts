import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { notificationsService } from "../services/notifications.service";
import { AppError } from "../types/errors";
import type { NotificationsQueryInput } from "../validators/notifications.validators";

const getClient = (req: Request) => {
  if (!req.supabase) {
    throw new AppError(500, "Supabase request client is not available");
  }

  return req.supabase;
};

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as unknown as NotificationsQueryInput;
  const notifications = await notificationsService.findAll(getClient(req), filters);

  res.status(200).json({
    status: "success",
    data: { notifications }
  });
});

export const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationsService.markAsRead(
      getClient(req),
      req.params.id,
      typeof req.query.profileId === "string" ? req.query.profileId : undefined
    );

    res.status(200).json({
      status: "success",
      data: { notification }
    });
  }
);
