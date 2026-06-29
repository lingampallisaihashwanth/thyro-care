import type { Booking, LanguagePreference, RegisteredUser } from "../types";

const STORAGE_KEYS = {
  user: "thyro_registered_user",
  sessionEmail: "thyro_session_email",
  bookings: "thyro_bookings",
  languagePreference: "thyro_language_preference",
};

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getRegisteredUser = () =>
  readJson<RegisteredUser | null>(STORAGE_KEYS.user, null);

export const saveRegisteredUser = (user: RegisteredUser) => {
  writeJson(STORAGE_KEYS.user, user);
};

export const updateRegisteredUser = (updates: Partial<RegisteredUser>) => {
  const current = getRegisteredUser();
  if (!current) {
    return null;
  }

  const updated = { ...current, ...updates };
  saveRegisteredUser(updated);
  return updated;
};

export const updateRegisteredPasswordForEmail = (
  email: string,
  password: string,
) => {
  const current = getRegisteredUser();
  if (!current || current.email.toLowerCase() !== email.trim().toLowerCase()) {
    return null;
  }

  return updateRegisteredUser({ password });
};

export const startSession = (email: string) => {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.sessionEmail, email);
  }
};

export const clearSession = () => {
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEYS.sessionEmail);
  }
};

export const getCurrentUser = () => {
  if (!canUseStorage()) {
    return null;
  }

  const sessionEmail = window.localStorage.getItem(STORAGE_KEYS.sessionEmail);
  const user = getRegisteredUser();
  return user && sessionEmail === user.email ? user : null;
};

export const getBookings = () => readJson<Booking[]>(STORAGE_KEYS.bookings, []);

export const getBookingsForUser = (email: string) =>
  getBookings().filter((booking) => booking.userEmail === email);

export const addBooking = (booking: Booking) => {
  const bookings = getBookings();
  writeJson(STORAGE_KEYS.bookings, [...bookings, booking]);
};

export const getCachedLanguagePreference = () => {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.languagePreference);
};

export const saveCachedLanguagePreference = (language: LanguagePreference) => {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.languagePreference, language);
  }
};
