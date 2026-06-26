import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z.string().min(10, "Phone number is required."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = () => {
    setSubmitted(true);
    reset();
  };

  return (
    <main className="bg-white">
      <section className="bg-thyro-sky px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase text-thyro-green">Contact</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black text-thyro-navy">
            THYRO LABORATORIES
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana -
            508207
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-thyro-navy">
                Visit Laboratory
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana -
                508207
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <a
                href="tel:9985931929"
                className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-thyro-navy shadow-crisp transition hover:border-thyro-red hover:text-thyro-red"
              >
                <Phone className="h-5 w-5" />
                Call
              </a>
              <a
                href="https://wa.me/919985931929"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-thyro-navy shadow-crisp transition hover:border-thyro-green hover:text-thyro-green"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
              <a
                href="mailto:thyrolaboratories99@gmail.com"
                className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-thyro-navy shadow-crisp transition hover:border-thyro-blue hover:text-thyro-blue"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-extrabold text-thyro-navy">Phone Numbers</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                9985931929
                <br />
                9966129009
                <br />
                9010855999
              </p>
              <h2 className="mt-5 font-extrabold text-thyro-navy">Email</h2>
              <p className="mt-2 text-sm text-slate-600">
                thyrolaboratories99@gmail.com
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-crisp">
              <iframe
                title="THYRO LABORATORIES location map"
                className="h-80 w-full"
                loading="lazy"
                src="https://maps.google.com/maps?q=Opposite%20Abhaya%20Hospital%20Doctors%20Colony%20Miryalaguda%20Telangana%20508207&t=&z=15&ie=UTF8&iwloc=&output=embed"
              />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-thyro-green">
                    Contact Form
                  </p>
                  <h2 className="text-xl font-black text-thyro-navy">
                    Send an enquiry
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-bold text-slate-700">Full Name</span>
                  <input
                    className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="mt-1 block text-xs font-semibold text-thyro-red">
                      {errors.name.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm">
                  <span className="font-bold text-slate-700">Phone Number</span>
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
              </div>

              <label className="mt-4 block text-sm">
                <span className="font-bold text-slate-700">Email</span>
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
                <span className="font-bold text-slate-700">Message</span>
                <textarea
                  rows={5}
                  className="mt-2 w-full resize-none rounded-md border border-slate-200 px-3 py-3 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky"
                  {...register("message")}
                />
                {errors.message && (
                  <span className="mt-1 block text-xs font-semibold text-thyro-red">
                    {errors.message.message}
                  </span>
                )}
              </label>

              {submitted && (
                <p className="mt-4 rounded-md bg-thyro-mint px-4 py-3 text-sm font-bold text-thyro-green">
                  Your enquiry is ready. Please use call, WhatsApp, or email for the
                  fastest response.
                </p>
              )}

              <button
                type="submit"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-thyro-blue px-6 text-sm font-bold text-white shadow-crisp transition hover:bg-thyro-navy"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};
