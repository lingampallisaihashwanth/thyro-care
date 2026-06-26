import { z } from "zod";
import type { ReportStatus } from "../types/database";

const reportStatusValues = [
  "Pending",
  "Ready",
  "Delivered",
  "Cancelled"
] as const satisfies readonly ReportStatus[];

export const reportsQuerySchema = z.object({
  profileId: z.string().uuid().optional(),
  bookingId: z.string().uuid().optional(),
  status: z.enum(reportStatusValues).optional()
});

export type ReportsQueryInput = z.infer<typeof reportsQuerySchema>;
