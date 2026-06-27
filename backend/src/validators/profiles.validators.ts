import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).nullable().optional();

const languagePreferenceValues = ["en", "te", "hi", "ta", "kn", "ml"] as const;

export const syncProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(1).max(30),
  email: z.string().email(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateOfBirth must use YYYY-MM-DD format")
    .nullable()
    .optional(),
  gender: optionalText(40),
  address: optionalText(500),
  profilePhoto: optionalText(2_000),
  languagePreference: z.enum(languagePreferenceValues).nullable().optional()
});

export type SyncProfileInput = z.infer<typeof syncProfileSchema>;
