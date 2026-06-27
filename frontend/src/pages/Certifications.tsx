import { Award, CalendarDays, FileBadge, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const certifications = [
  {
    titleKey: "certifications.government.title",
    authorityLabelKey: "certifications.authority",
    authorityKey: "certifications.government.authority",
    title: "Government Registered Diagnostic Centre",
    authorityLabel: "Authority",
    authority: "District Registration Authority - Nalgonda",
    registration: "1366/DRA/DMHO/NLG/2024",
    validity: "02-09-2025 to 01-09-2030",
    icon: ShieldCheck,
    accent: "green",
  },
  {
    titleKey: "certifications.biomedical.title",
    authorityLabelKey: "certifications.provider",
    authorityKey: "certifications.biomedical.authority",
    title: "Biomedical Waste Management",
    authorityLabel: "Provider",
    authority: "Roma Industries",
    registration: "RI/2068/NLG/2025",
    validity: "31-07-2026",
    icon: Award,
    accent: "blue",
  },
];

export const Certifications = () => {
  const { t } = useTranslation();
  const tr = (key: string, defaultValue: string) =>
    t(key, { defaultValue }) as string;

  return (
    <main className="bg-white">
    <section className="bg-thyro-mint px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase text-thyro-green">
          {tr("certifications.eyebrow", "Certifications")}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black text-thyro-navy">
          {tr(
            "certifications.heading",
            "Professional laboratory registrations and compliance.",
          )}
        </h1>
      </div>
    </section>

    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {certifications.map((certification) => {
          const Icon = certification.icon;
          const isGreen = certification.accent === "green";

          return (
            <article
              key={certification.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp"
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-lg ${
                  isGreen
                    ? "bg-thyro-mint text-thyro-green"
                    : "bg-thyro-sky text-thyro-blue"
                }`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-thyro-navy">
                {tr(certification.titleKey, certification.title)}
              </h2>
              <dl className="mt-6 space-y-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase text-slate-500">
                    {tr(certification.authorityLabelKey, certification.authorityLabel)}
                  </dt>
                  <dd className="mt-1 font-bold text-slate-700">
                    {tr(certification.authorityKey, certification.authority)}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                    <FileBadge className="h-4 w-4" />
                    {tr("certifications.registrationNumber", "Registration Number")}
                  </dt>
                  <dd className="mt-1 font-bold text-slate-700">
                    {certification.registration}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {tr("certifications.validity", "Validity")}
                  </dt>
                  <dd className="mt-1 font-bold text-slate-700">
                    {certification.validity}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
    </main>
  );
};
