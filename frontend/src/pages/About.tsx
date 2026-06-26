import {
  Activity,
  Droplets,
  FlaskConical,
  HeartPulse,
  MapPin,
  Microscope,
  Stethoscope,
  UserRound,
} from "lucide-react";

const services = [
  { label: "Pathology Testing", icon: Microscope },
  { label: "Hormone Testing", icon: FlaskConical },
  { label: "Diabetes Testing", icon: Activity },
  { label: "Vitamin Testing", icon: Droplets },
  { label: "Liver Testing", icon: Stethoscope },
  { label: "Kidney Testing", icon: HeartPulse },
  { label: "Infectious Disease Testing", icon: FlaskConical },
];

export const About = () => (
  <main className="bg-white">
    <section className="bg-thyro-sky px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase text-thyro-green">About</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black text-thyro-navy">
          THYRO LABORATORIES
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          THYRO LABORATORIES is a fully automated diagnostic laboratory located
          opposite Abhaya Hospital, Doctors Colony, Miryalaguda.
        </p>
      </div>
    </section>

    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-crisp">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-thyro-mint text-thyro-green">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-thyro-navy">
            Laboratory Location
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana -
            508207
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-lg bg-slate-50 p-4">
            <UserRound className="h-5 w-5 text-thyro-blue" />
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Owner</p>
              <p className="font-extrabold text-thyro-navy">L. Lakshmaiah</p>
            </div>
          </div>
        </aside>

        <div>
          <p className="text-sm font-bold uppercase text-thyro-green">Services</p>
          <h2 className="mt-3 text-3xl font-black text-thyro-navy">
            Diagnostic services focused on practical patient needs.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.label}
                  className="flex min-h-20 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-crisp"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-thyro-sky text-thyro-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-slate-700">{service.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  </main>
);
