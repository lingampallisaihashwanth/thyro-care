import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(5001),
    SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
    SUPABASE_ANON_KEY: z
      .preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().min(1).optional()
      ),
    SUPABASE_SERVICE_ROLE_KEY: z
      .preprocess(
        (value) => (value === "" ? undefined : value),
        z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required")
      ),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    CORS_ORIGIN: z.string().optional()
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV === "production" && value.JWT_SECRET.length < 32) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["JWT_SECRET"],
        message: "JWT_SECRET must be at least 32 characters in production"
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${formattedErrors}`);
}

export const env = parsedEnv.data;
