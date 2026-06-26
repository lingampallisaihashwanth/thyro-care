import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import type { RegisteredUser } from "../types";
import { syncProfile } from "../services/api";
import {
  clearSession,
  getCurrentUser,
  getRegisteredUser,
  saveRegisteredUser,
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      registerUser: async (newUser) => {
        const existingUser = getRegisteredUser();
        if (existingUser?.email.toLowerCase() === newUser.email.toLowerCase()) {
          throw new Error("An account with this email already exists.");
        }

        const normalizedUser = {
          ...newUser,
          fullName: newUser.fullName.trim(),
          phone: newUser.phone.trim(),
          email: newUser.email.trim().toLowerCase(),
        };

        const profile = await syncProfile(normalizedUser);
        const persistedUser: RegisteredUser = {
          ...normalizedUser,
          id: profile.id,
        };

        saveRegisteredUser(persistedUser);
        startSession(persistedUser.email);
        setUser(persistedUser);
      },
      loginUser: async (email, password) => {
        const registeredUser = getRegisteredUser();
        const normalizedEmail = email.trim().toLowerCase();

        if (!registeredUser || registeredUser.email.toLowerCase() !== normalizedEmail) {
          throw new Error("No registered account was found for this email.");
        }

        if (registeredUser.password !== password) {
          throw new Error("The email or password is incorrect.");
        }

        const profile = await syncProfile({
          fullName: registeredUser.fullName,
          phone: registeredUser.phone,
          email: registeredUser.email,
          dateOfBirth: registeredUser.dateOfBirth,
          gender: registeredUser.gender,
          address: registeredUser.address,
          profilePhoto: registeredUser.profilePhoto,
        });
        const persistedUser = updateRegisteredUser({ id: profile.id }) ?? registeredUser;

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
          throw new Error("No registered account was found.");
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
        });
        const updated = updateRegisteredUser({ ...updates, id: profile.id });
        if (updated) {
          setUser(updated);
        }
      },
      changePassword: (currentPassword, nextPassword) => {
        const registeredUser = getRegisteredUser();

        if (!registeredUser || registeredUser.password !== currentPassword) {
          throw new Error("The current password is incorrect.");
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
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
