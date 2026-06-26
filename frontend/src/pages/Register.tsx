import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, Phone, UserRound, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { StaticLogo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required."),
    phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10 digit phone number."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const { user, registerUser } = useAuth();
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError("");

    try {
      await registerUser({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });
      navigate("/profile", { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to register.");
    }
  };

  return (
    <main className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <StaticLogo />
          <h1 className="mt-8 text-4xl font-black text-thyro-navy">Register</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Create your local account for booking laboratory tests and managing your
            profile information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
        >
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-thyro-navy">
            Create account
          </h2>

          <label className="mt-6 block text-sm">
            <span className="flex items-center gap-2 font-bold text-slate-700">
              <UserRound className="h-4 w-4 text-thyro-green" />
              Full Name
            </span>
            <input
              className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
              {...register("fullName")}
            />
            {errors.fullName && (
              <span className="mt-1 block text-xs font-semibold text-thyro-red">
                {errors.fullName.message}
              </span>
            )}
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <Phone className="h-4 w-4 text-thyro-green" />
                Phone Number
              </span>
              <input
                className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                {...register("phone")}
              />
              {errors.phone && (
                <span className="mt-1 block text-xs font-semibold text-thyro-red">
                  {errors.phone.message}
                </span>
              )}
            </label>

            <label className="block text-sm">
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
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <LockKeyhole className="h-4 w-4 text-thyro-green" />
                Password
              </span>
              <input
                type="password"
                className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                {...register("password")}
              />
              {errors.password && (
                <span className="mt-1 block text-xs font-semibold text-thyro-red">
                  {errors.password.message}
                </span>
              )}
            </label>

            <label className="block text-sm">
              <span className="font-bold text-slate-700">Confirm Password</span>
              <input
                type="password"
                className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="mt-1 block text-xs font-semibold text-thyro-red">
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>
          </div>

          {formError && (
            <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-thyro-red">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-thyro-green px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-thyro-blue">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
