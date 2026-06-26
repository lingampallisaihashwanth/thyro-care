import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import type { Database } from "../types/database";
import { AppError } from "../types/errors";
import { throwSupabaseError } from "./supabase-error.service";
import type { ReportsQueryInput } from "../validators/reports.validators";

type Client = SupabaseClient<Database>;
type ReportRow = Database["public"]["Tables"]["reports"]["Row"];

const REPORTS_BUCKET = "reports";

const toReportResponse = (report: ReportRow) => ({
  id: report.id,
  profile_id: null,
  booking_id: report.booking_id,
  test_name: "",
  report_url: report.report_url,
  result_summary: null,
  status: report.report_url ? "Ready" : "Pending",
  created_at: report.uploaded_at,
  updated_at: null
});

export const reportsService = {
  async uploadPdf(client: Client, bookingId: string, file: Express.Multer.File) {
    if (file.mimetype !== "application/pdf") {
      throw new AppError(400, "Only PDF reports can be uploaded", "INVALID_REPORT_FILE");
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${bookingId}/${randomUUID()}-${safeName}`;

    const bucket = await client.storage.getBucket(REPORTS_BUCKET);
    if (bucket.error && bucket.error.message.includes("not found")) {
      const createBucket = await client.storage.createBucket(REPORTS_BUCKET, {
        public: true
      });

      if (createBucket.error) {
        throw new AppError(500, "Unable to create reports storage bucket", "REPORT_BUCKET_ERROR", {
          message: createBucket.error.message
        });
      }
    } else if (bucket.error) {
      throw new AppError(500, "Unable to access reports storage bucket", "REPORT_BUCKET_ERROR", {
        message: bucket.error.message
      });
    }

    const upload = await client.storage.from(REPORTS_BUCKET).upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

    if (upload.error) {
      throw new AppError(500, "Unable to upload report PDF", "REPORT_UPLOAD_ERROR", {
        message: upload.error.message
      });
    }

    const { data: publicUrl } = client.storage
      .from(REPORTS_BUCKET)
      .getPublicUrl(storagePath);

    const { data, error } = await client
      .from("reports")
      .insert({
        booking_id: bookingId,
        report_url: publicUrl.publicUrl
      })
      .select("*")
      .single();

    if (error) {
      throwSupabaseError(error, "Unable to save report");
    }

    if (!data) {
      throw new AppError(500, "Report was not returned after upload");
    }

    return toReportResponse(data);
  },

  async findAll(client: Client, filters: ReportsQueryInput = {}) {
    let query = client
      .from("reports")
      .select("*");

    if (filters.profileId) {
      throw new AppError(
        400,
        "Filtering reports by profileId is not supported by the current Supabase schema",
        "UNSUPPORTED_FILTER"
      );
    }

    if (filters.bookingId) {
      query = query.eq("booking_id", filters.bookingId);
    }

    if (filters.status) {
      throw new AppError(
        400,
        "Filtering reports by status is not supported by the current Supabase schema",
        "UNSUPPORTED_FILTER"
      );
    }

    const { data, error } = await query;

    if (error) {
      throwSupabaseError(error, "Unable to fetch reports");
    }

    return (data ?? []).map((report) => toReportResponse(report));
  },

  async findById(client: Client, id: string) {
    const { data, error } = await client
      .from("reports")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throwSupabaseError(error, "Unable to fetch report");
    }

    if (!data) {
      throw new AppError(404, "Report not found", "REPORT_NOT_FOUND");
    }

    return toReportResponse(data);
  }
};
