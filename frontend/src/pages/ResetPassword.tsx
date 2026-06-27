import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { z } from "zod";
import { StaticLogo } from "../components/Logo";
import { PasswordInput } from "../components/PasswordInput";
import {
  preparePasswordRecoverySession,
  updatePasswordFromRecovery,
} from "../services/supabaseAuth";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [isPreparingSession, setIsPreparingSession] = useState(true);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const tr = (key: string, defaultValue: string) =>
    t(key, { defaultValue }) as string;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadRecoverySession = async () => {
      try {
        const recoverySession = await preparePasswordRecoverySession();

        if (isMounted) {
          setSession(recoverySession);
        }
      } catch (error) {
        if (isMounted) {
          setFormError(
            error instanceof Error
              ? error.message
              : tr("resetPassword.verifyError", "Unable to verify password reset link."),
          );
        }
      } finally {
        if (isMounted) {
          setIsPreparingSession(false);
        }
      }
    };

    void loadRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!session) {
      setFormError(
        tr(
          "resetPassword.invalidLink",
          "Password reset link is invalid or has expired. Please request a new link.",
        ),
      );
      return;
    }

    setFormError("");
    setSuccessMessage("");

    try {
      await updatePasswordFromRecovery(session, values.newPassword);
      setSuccessMessage(tr("resetPassword.success", "Your password has been reset successfully."));
      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { passwordReset: true },
        });
      }, 1200);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : tr("resetPassword.error", "Unable to reset password."),
      );
    }
  };

  const isFormDisabled = isPreparingSession || isSubmitting || !session;

  return (
    <main className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <StaticLogo />
          <h1 className="mt-8 text-4xl font-black text-thyro-navy">
            {tr("resetPassword.title", "Reset Password")}
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            {tr(
              "resetPassword.subtitle",
              "Create a new password for your account using the secure reset link from your email.",
            )}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-slate-200 bg-white p-6 pr-20 shadow-soft sm:p-6"
        >
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-thyro-navy">
            {tr("resetPassword.heading", "Choose a new password")}
          </h2>

          {isPreparingSession && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-md bg-thyro-sky px-4 py-3 text-sm font-bold text-thyro-blue">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {tr("resetPassword.verifying", "Verifying reset link...")}
            </p>
          )}

          <label className="mt-6 block text-sm">
            <span className="font-bold text-slate-700">
              {tr("profile.settings.newPassword", "New Password")}
            </span>
            <PasswordInput
              autoComplete="new-password"
              disabled={isFormDisabled}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <span className="mt-1 block text-xs font-semibold text-thyro-red">
                {errors.newPassword.message}
              </span>
            )}
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-bold text-slate-700">
              {tr("profile.settings.confirmPassword", "Confirm Password")}
            </span>
            <PasswordInput
              autoComplete="new-password"
              disabled={isFormDisabled}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="mt-1 block text-xs font-semibold text-thyro-red">
                {errors.confirmPassword.message}
              </span>
            )}
          </label>

          {formError && (
            <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
              {formError}
            </p>
          )}

          {successMessage && (
            <p className="mt-4 rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isFormDisabled}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-thyro-green px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting
              ? tr("resetPassword.resetting", "Resetting...")
              : tr("resetPassword.submit", "Reset password")}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            {tr("resetPassword.needLink", "Need a new link?")}{" "}
            <Link to="/forgot-password" className="font-bold text-thyro-blue">
              {tr("resetPassword.requestLink", "Request password reset")}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
