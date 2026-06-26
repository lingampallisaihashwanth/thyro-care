import type { PostgrestError } from "@supabase/supabase-js";
import { AppError } from "../types/errors";

const statusByPostgresCode: Record<string, number> = {
  "23503": 400,
  "23505": 409,
  "42501": 403,
  PGRST204: 400,
  PGRST301: 401
};

const messageByPostgresCode: Record<string, string> = {
  "42501":
    "Supabase rejected this write because row-level security blocked it. Add SUPABASE_SERVICE_ROLE_KEY on the backend or create an insert policy for bookings."
};

export const throwSupabaseError = (
  error: PostgrestError,
  fallbackMessage = "Database operation failed"
): never => {
  const statusCode = statusByPostgresCode[error.code] ?? 500;
  const message = messageByPostgresCode[error.code] ?? fallbackMessage;

  throw new AppError(statusCode, message, "SUPABASE_ERROR", {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  });
};
