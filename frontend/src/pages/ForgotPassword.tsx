import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { StaticLogo } from "../components/Logo";
import { sendPasswordResetEmail } from "../services/supabaseAuth";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = () => {
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(values.email);
      setSuccessMessage(
        "A password reset link has been sent to your registered email address.",
      );
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to send password reset email.",
      );
    }
  };

  return (
    <main className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div>
          <StaticLogo />
          <h1 className="mt-8 text-4xl font-black text-thyro-navy">
            Forgot Password
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Enter your registered email address and we will send a secure reset
            link through Supabase Authentication.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-slate-200 bg-white p-6 pr-20 shadow-soft sm:p-6"
        >
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
            <Send className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-thyro-navy">
            Reset your password
          </h2>

          <label className="mt-6 block text-sm">
            <span className="flex items-center gap-2 font-bold text-slate-700">
              <Mail className="h-4 w-4 text-thyro-green" />
              Email
            </span>
            <input
              type="email"
              disabled={isSubmitting}
              className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky disabled:cursor-not-allowed disabled:bg-slate-50"
              {...register("email")}
            />
            {errors.email && (
              <span className="mt-1 block text-xs font-semibold text-thyro-red">
                {errors.email.message}
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
            disabled={isSubmitting}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-thyro-blue px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-thyro-navy disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <Link to="/login" className="font-bold text-thyro-blue">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
