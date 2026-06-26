import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";

export type AuthenticatedUser = {
  id: string;
  email?: string;
  role?: string;
};

export type RequestSupabaseClient = SupabaseClient<Database>;

declare global {
  namespace Express {
    interface Request {
      accessToken?: string;
      user?: AuthenticatedUser;
      supabase?: RequestSupabaseClient;
    }
  }
}
