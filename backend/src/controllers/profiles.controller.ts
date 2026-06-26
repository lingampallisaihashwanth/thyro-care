import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { profilesService } from "../services/profiles.service";
import { AppError } from "../types/errors";
import { env } from "../config/env";

const getClient = (req: Request) => {
  if (!req.supabase) {
    throw new AppError(500, "Supabase request client is not available");
  }

  return req.supabase;
};

export const syncProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profilesService.sync(getClient(req), req.body);

  if (env.NODE_ENV === "development") {
    console.info("[profile-api] profile save response", {
      success: true,
      profileId: profile.id
    });
  }

  res.status(200).json({
    status: "success",
    data: { profile }
  });
});
