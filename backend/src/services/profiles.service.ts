import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { AppError } from "../types/errors";
import type { SyncProfileInput } from "../validators/profiles.validators";
import { throwSupabaseError } from "./supabase-error.service";

type Client = SupabaseClient<Database>;
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

let supportsProfileLanguagePreference: boolean | null = null;

const hasProfileLanguagePreference = async (client: Client) => {
  if (supportsProfileLanguagePreference !== null) {
    return supportsProfileLanguagePreference;
  }

  const { error } = await client
    .from("profiles")
    .select("language_preference")
    .limit(1);

  supportsProfileLanguagePreference = !error;

  return supportsProfileLanguagePreference;
};

const toProfileValues = (
  profile: SyncProfileInput,
  includeLanguagePreference: boolean
) => {
  const values: Record<string, string | null> = {
    full_name: profile.fullName,
    phone: profile.phone,
    email: profile.email.trim().toLowerCase()
  };

  if (includeLanguagePreference && profile.languagePreference) {
    values.language_preference = profile.languagePreference;
  }

  return values;
};

export const profilesService = {
  async sync(client: Client, payload: SyncProfileInput) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const profileValues = toProfileValues(
      payload,
      await hasProfileLanguagePreference(client)
    );
    const { data: existingProfile, error: lookupError } = await client
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      throwSupabaseError(lookupError, "Unable to find profile");
    }

    const result = existingProfile
      ? await client
          .from("profiles")
          .update(profileValues as ProfileUpdate)
          .eq("id", existingProfile.id)
          .select("*")
          .single()
      : await client
          .from("profiles")
          .insert(profileValues as ProfileInsert)
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
