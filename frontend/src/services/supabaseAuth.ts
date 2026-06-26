import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { updateRegisteredPasswordForEmail } from "../utils/storage";

let supabaseAuthClient: SupabaseClient | null = null;

const getEnvValue = (key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const getSupabaseAuthClient = () => {
  if (supabaseAuthClient) {
    return supabaseAuthClient;
  }

  const supabaseUrl = getEnvValue("VITE_SUPABASE_URL");
  const supabaseAnonKey = getEnvValue("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Password reset is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return supabaseAuthClient;
};

const getResetRedirectUrl = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.origin}/reset-password`;
};

const getUrlErrorMessage = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    url.searchParams.get("error_description") ||
    hashParams.get("error_description") ||
    url.searchParams.get("error") ||
    hashParams.get("error") ||
    ""
  );
};

const cleanRecoveryUrl = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(null, "", window.location.pathname);
};

export const sendPasswordResetEmail = async (email: string) => {
  const supabase = getSupabaseAuthClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: getResetRedirectUrl(),
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const preparePasswordRecoverySession = async () => {
  const supabase = getSupabaseAuthClient();
  const urlError = getUrlErrorMessage();

  if (urlError) {
    throw new Error(urlError);
  }

  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw new Error(error.message);
      }

      cleanRecoveryUrl();
    } else if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        throw new Error(error.message);
      }

      cleanRecoveryUrl();
    }
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session) {
    throw new Error("Password reset link is invalid or has expired. Please request a new link.");
  }

  return data.session;
};

export const updatePasswordFromRecovery = async (
  session: Session,
  nextPassword: string,
) => {
  const supabase = getSupabaseAuthClient();
  const { error } = await supabase.auth.updateUser({ password: nextPassword });

  if (error) {
    throw new Error(error.message);
  }

  if (session.user.email) {
    updateRegisteredPasswordForEmail(session.user.email, nextPassword);
  }

  await supabase.auth.signOut();
};
