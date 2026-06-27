import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";

let realtimeClient: SupabaseClient | null = null;

const getEnvValue = (key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const getRealtimeClient = () => {
  if (realtimeClient) {
    return realtimeClient;
  }

  const supabaseUrl = getEnvValue("VITE_SUPABASE_URL");
  const supabaseAnonKey = getEnvValue("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  realtimeClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return realtimeClient;
};

export const subscribeToBookingChanges = (
  userEmail: string,
  onChange: () => void,
) => {
  const client = getRealtimeClient();

  if (!client) {
    return () => undefined;
  }

  const normalizedEmail = userEmail.trim().toLowerCase();
  const channel: RealtimeChannel = client
    .channel(`bookings:${normalizedEmail}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `email=eq.${normalizedEmail}`,
      },
      onChange,
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
};
