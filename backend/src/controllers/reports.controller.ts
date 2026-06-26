import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { reportsService } from "../services/reports.service";
import { AppError } from "../types/errors";
import type { ReportsQueryInput } from "../validators/reports.validators";

const getClient = (req: Request) => {
  if (!req.supabase) {
    throw new AppError(500, "Supabase request client is not available");
  }

  return req.supabase;
};

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as unknown as ReportsQueryInput;
  const reports = await reportsService.findAll(getClient(req), filters);

  res.status(200).json({
    status: "success",
    data: { reports }
  });
});

export const uploadReport = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(400, "Report PDF file is required", "REPORT_FILE_REQUIRED");
  }

  const bookingId = typeof req.body.bookingId === "string" ? req.body.bookingId : "";
  if (!bookingId) {
    throw new AppError(400, "bookingId is required", "BOOKING_ID_REQUIRED");
  }

  const report = await reportsService.uploadPdf(getClient(req), bookingId, req.file);

  res.status(201).json({
    status: "success",
    data: { report }
  });
});

export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportsService.findById(getClient(req), req.params.id);

  res.status(200).json({
    status: "success",
    data: { report }
  });
});
