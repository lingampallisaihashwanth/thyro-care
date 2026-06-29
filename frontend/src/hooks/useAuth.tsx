import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { RegisteredUser } from "../types";
import { syncProfile } from "../services/api";
import i18n, { defaultLanguage, normalizeLanguage } from "../i18n";
import {
  clearSession,
  getCachedLanguagePreference,
  getCurrentUser,
  getRegisteredUser,
  saveRegisteredUser,
  saveCachedLanguagePreference,
  startSession,
  updateRegisteredUser,
} from "../utils/storage";

type NewUser = Pick<RegisteredUser, "fullName" | "phone" | "email" | "password">;

type AuthContextValue = {
  user: RegisteredUser | null;
  registerUser: (user: NewUser) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<RegisteredUser>) => Promise<void>;
  changePassword: (currentPassword: string, nextPassword: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<RegisteredUser | null>(() => getCurrentUser());

  useEffect(() => {
    const nextLanguage = normalizeLanguage(
      user?.languagePreference ?? getCachedLanguagePreference(),
    );
    saveCachedLanguagePreference(nextLanguage);
    void i18n.changeLanguage(nextLanguage);
  }, [user?.languagePreference]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      registerUser: async (newUser) => {
        const existingUser = getRegisteredUser();
        if (existingUser?.email.toLowerCase() === newUser.email.toLowerCase()) {
          throw new Error(i18n.t("auth.errors.duplicateEmail") as string);
        }

        const normalizedUser = {
          ...newUser,
          fullName: newUser.fullName.trim(),
          phone: newUser.phone.trim(),
          email: newUser.email.trim().toLowerCase(),
          languagePreference: defaultLanguage,
        };

        const profile = await syncProfile(normalizedUser);
        const persistedUser: RegisteredUser = {
          ...normalizedUser,
          id: profile.id,
          languagePreference: normalizeLanguage(profile.language_preference),
        };

        saveCachedLanguagePreference(
          normalizeLanguage(persistedUser.languagePreference),
        );
        saveRegisteredUser(persistedUser);
        startSession(persistedUser.email);
        setUser(persistedUser);
      },
      loginUser: async (email, password) => {
        const registeredUser = getRegisteredUser();
        const normalizedEmail = email.trim().toLowerCase();

        if (!registeredUser || registeredUser.email.toLowerCase() !== normalizedEmail) {
          throw new Error(i18n.t("auth.errors.noAccount") as string);
        }

        if (registeredUser.password !== password) {
          throw new Error(i18n.t("auth.errors.incorrectPassword") as string);
        }

        const profile = await syncProfile({
          fullName: registeredUser.fullName,
          phone: registeredUser.phone,
          email: registeredUser.email,
          dateOfBirth: registeredUser.dateOfBirth,
          gender: registeredUser.gender,
          address: registeredUser.address,
          profilePhoto: registeredUser.profilePhoto,
          languagePreference: registeredUser.languagePreference,
        });
        const persistedUser =
          updateRegisteredUser({
            id: profile.id,
            languagePreference: normalizeLanguage(
              profile.language_preference ?? registeredUser.languagePreference,
            ),
          }) ?? registeredUser;

        saveCachedLanguagePreference(
          normalizeLanguage(persistedUser.languagePreference),
        );
        startSession(persistedUser.email);
        setUser(persistedUser);
      },
      logout: () => {
        clearSession();
        setUser(null);
      },
      updateUser: async (updates) => {
        const registeredUser = getRegisteredUser();
        if (!registeredUser) {
          throw new Error(i18n.t("auth.errors.noRegisteredAccount") as string);
        }

        const nextUser = { ...registeredUser, ...updates };
        const profile = await syncProfile({
          fullName: nextUser.fullName,
          phone: nextUser.phone,
          email: nextUser.email,
          dateOfBirth: nextUser.dateOfBirth,
          gender: nextUser.gender,
          address: nextUser.address,
          profilePhoto: nextUser.profilePhoto,
          languagePreference: nextUser.languagePreference,
        });
        const updated = updateRegisteredUser({
          ...updates,
          id: profile.id,
          languagePreference: normalizeLanguage(
            profile.language_preference ?? nextUser.languagePreference,
          ),
        });
        if (updated) {
          saveCachedLanguagePreference(normalizeLanguage(updated.languagePreference));
          setUser(updated);
        }
      },
      changePassword: (currentPassword, nextPassword) => {
        const registeredUser = getRegisteredUser();

        if (!registeredUser || registeredUser.password !== currentPassword) {
          throw new Error(i18n.t("auth.errors.currentPassword") as string);
        }

        const updated = updateRegisteredUser({ password: nextPassword });
        if (updated) {
          setUser(updated);
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(i18n.t("auth.errors.authProvider") as string);
  }

  return context;
};
