import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { AppError } from "../types/errors";
import type { SyncProfileInput } from "../validators/profiles.validators";
import { throwSupabaseError } from "./supabase-error.service";

type Client = SupabaseClient<Database>;
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

const toProfileValues = (profile: SyncProfileInput) => ({
  full_name: profile.fullName,
  phone: profile.phone,
  email: profile.email.trim().toLowerCase()
});

export const profilesService = {
  async sync(client: Client, payload: SyncProfileInput) {
    const profileValues = toProfileValues(payload);
    const { data: existingProfile, error: lookupError } = await client
      .from("profiles")
      .select("id")
      .eq("email", profileValues.email)
      .maybeSingle();

    if (lookupError) {
      throwSupabaseError(lookupError, "Unable to find profile");
    }

    const result = existingProfile
      ? await client
          .from("profiles")
          .update(profileValues satisfies ProfileUpdate)
          .eq("id", existingProfile.id)
          .select("*")
          .single()
      : await client
          .from("profiles")
          .insert(profileValues satisfies ProfileInsert)
          .select("*")
          .single();

    if (result.error) {
      throwSupabaseError(result.error, "Unable to save profile");
    }

    if (!result.data) {
      throw new AppError(500, "Profile was not returned after saving");
    }

    return result.data;
  }
};
