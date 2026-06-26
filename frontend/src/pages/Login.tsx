import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { StaticLogo } from "../components/Logo";
import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LocationState = {
  from?: {
    pathname?: string;
  };
  passwordReset?: boolean;
};

export const Login = () => {
  const { user, loginUser } = useAuth();
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const from = state?.from?.pathname || "/profile";
  const passwordResetMessage = state?.passwordReset
    ? "Your password has been reset successfully. Please login with your new password."
    : "";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    setFormError("");

    try {
      await loginUser(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to login.");
    }
  };

  return (
    <main className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <StaticLogo />
          <h1 className="mt-8 text-4xl font-black text-thyro-navy">Login</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Access your profile to view personal information, bookings, reports,
            notifications, and account settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-slate-200 bg-white p-6 pr-20 shadow-soft sm:p-6"
        >
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-thyro-navy">
            Welcome back
          </h2>

          <label className="mt-6 block text-sm">
            <span className="flex items-center gap-2 font-bold text-slate-700">
              <Mail className="h-4 w-4 text-thyro-green" />
              Email
            </span>
            <input
              type="email"
              className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
              {...register("email")}
            />
            {errors.email && (
              <span className="mt-1 block text-xs font-semibold text-thyro-red">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="mt-4 block text-sm">
            <span className="flex items-center gap-2 font-bold text-slate-700">
              <LockKeyhole className="h-4 w-4 text-thyro-green" />
              Password
            </span>
            <PasswordInput autoComplete="current-password" {...register("password")} />
            {errors.password && (
              <span className="mt-1 block text-xs font-semibold text-thyro-red">
                {errors.password.message}
              </span>
            )}
          </label>

          <div className="mt-3 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-bold text-thyro-blue transition hover:text-thyro-navy"
            >
              Forgot Password?
            </Link>
          </div>

          {formError && (
            <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
              {formError}
            </p>
          )}

          {passwordResetMessage && !formError && (
            <p className="mt-4 rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
              {passwordResetMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-thyro-blue px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-thyro-navy disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            New to THYRO LABORATORIES?{" "}
            <Link to="/register" className="font-bold text-thyro-green">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
