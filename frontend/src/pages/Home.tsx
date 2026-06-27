import {
  Award,
  Clock3,
  FlaskConical,
  Home as HomeIcon,
  Microscope,
  Phone,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import heroImage from "../assets/thyro-lab-hero.png";

const highlights = [
  { key: "home.highlights.registered", label: "Government Registered", icon: ShieldCheck },
  { key: "home.highlights.homeSample", label: "Home Sample Collection", icon: HomeIcon },
  { key: "home.highlights.fastReports", label: "Fast Reports", icon: Clock3 },
  { key: "home.highlights.reliable", label: "Reliable Diagnostics", icon: Award },
];

const services = [
  {
    titleKey: "home.services.pathology.title",
    textKey: "home.services.pathology.text",
    title: "Pathology Testing",
    text: "Routine and advanced diagnostic investigations for everyday care.",
    icon: TestTube2,
  },
  {
    titleKey: "home.services.hormone.title",
    textKey: "home.services.hormone.text",
    title: "Hormone Testing",
    text: "Thyroid and reproductive hormone tests with dependable reporting.",
    icon: FlaskConical,
  },
  {
    titleKey: "home.services.preventive.title",
    textKey: "home.services.preventive.text",
    title: "Preventive Profiles",
    text: "Diabetes, liver, kidney, lipid, vitamin, and infection screening.",
    icon: Microscope,
  },
];

const features = [
  { key: "home.features.automated", text: "Fully automated diagnostic laboratory" },
  { key: "home.features.fast", text: "Reports in just 2 hours for eligible tests" },
  { key: "home.features.booking", text: "Patient-friendly booking from tests page" },
  { key: "home.features.account", text: "Single account area for bookings, reports, and notifications" },
];

export const Home = () => {
  const { t } = useTranslation();
  const tr = (key: string, defaultValue: string) =>
    t(key, { defaultValue }) as string;

  return (
    <>
    <section className="relative isolate overflow-hidden bg-thyro-ink text-white">
      <img
        src={heroImage}
        alt={tr("home.hero.imageAlt", "Modern automated diagnostic laboratory")}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-thyro-ink via-thyro-ink/82 to-thyro-ink/30" />
      <div className="mx-auto flex min-h-[76svh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-thyro-green">
            {tr(
              "home.hero.eyebrow",
              "Fully Automated Diagnostic Laboratory",
            )}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
            THYRO LABORATORIES
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-white/88">
            {tr(
              "home.hero.tagline",
              "Fast | Accurate | Trusted Reports in Just 2 Hours",
            )}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/tests"
              className="inline-flex h-12 items-center justify-center rounded-full bg-thyro-green px-6 text-sm font-bold text-white shadow-soft transition hover:bg-emerald-700"
            >
              {tr("common.bookTest", "Book Test")}
            </Link>
            <a
              href="tel:9985931929"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-thyro-navy transition hover:bg-thyro-sky"
            >
              <Phone className="h-4 w-4" />
              {tr("common.callLaboratory", "Call Laboratory")}
            </a>
            <a
              href="https://wa.me/919985931929"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/45 px-6 text-sm font-bold text-white transition hover:bg-white/12"
            >
              {tr("common.whatsapp", "WhatsApp")}
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex min-h-16 items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  <Icon className="h-5 w-5 shrink-0 text-thyro-green" />
                  <span className="text-sm font-bold text-white">
                    {tr(item.key, item.label)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase text-thyro-green">
            {tr("home.services.eyebrow", "Services Overview")}
          </p>
          <h2 className="mt-3 text-3xl font-black text-thyro-navy">
            {tr(
              "home.services.heading",
              "Complete laboratory testing for Miryalaguda patients.",
            )}
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-thyro-navy">
                  {tr(service.titleKey, service.title)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {tr(service.textKey, service.text)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-thyro-green">
            {tr("home.features.eyebrow", "Features")}
          </p>
          <h2 className="mt-3 text-3xl font-black text-thyro-navy">
            {tr(
              "home.features.heading",
              "Designed for fast booking and calm account management.",
            )}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {tr(
              "home.features.text",
              "Patients can keep browsing public pages after login and manage everything from one profile area.",
            )}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-crisp"
            >
              <ShieldCheck className="h-5 w-5 shrink-0 text-thyro-green" />
              <span className="text-sm font-bold text-slate-700">
                {tr(feature.key, feature.text)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-thyro-green/25 bg-thyro-mint p-6">
          <p className="text-sm font-bold uppercase text-thyro-green">
            {tr("home.certification.eyebrow", "Certification Highlights")}
          </p>
          <h2 className="mt-3 text-2xl font-black text-thyro-navy">
            {tr(
              "home.certification.heading",
              "Government Registered Diagnostic Centre",
            )}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {tr(
              "home.certification.text",
              "Registered with District Registration Authority - Nalgonda.",
            )}
          </p>
          <Link
            to="/certifications"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-thyro-navy px-5 text-sm font-bold text-white transition hover:bg-thyro-blue"
          >
            {tr("home.certification.button", "View Certifications")}
          </Link>
        </div>
        <div className="rounded-lg border border-thyro-blue/25 bg-thyro-sky p-6">
          <p className="text-sm font-bold uppercase text-thyro-blue">
            {tr("home.contact.eyebrow", "Contact CTA")}
          </p>
          <h2 className="mt-3 text-2xl font-black text-thyro-navy">
            {tr("home.contact.heading", "Need help choosing a test?")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {tr(
              "home.contact.text",
              "Call THYRO LABORATORIES for test booking, home sample collection, or laboratory visit details.",
            )}
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-thyro-blue px-5 text-sm font-bold text-white transition hover:bg-thyro-navy"
          >
            {tr("home.contact.button", "Contact Laboratory")}
          </Link>
        </div>
      </div>
    </section>
    </>
  );
};
