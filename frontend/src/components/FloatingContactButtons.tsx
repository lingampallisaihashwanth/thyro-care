import { Mail, MessageCircle, Phone } from "lucide-react";

const actions = [
  {
    label: "WhatsApp",
    href: "https://wa.me/919985931929",
    icon: MessageCircle,
    className: "bg-thyro-green hover:bg-emerald-700",
  },
  {
    label: "Email",
    href: "mailto:thyrolaboratories99@gmail.com",
    icon: Mail,
    className: "bg-thyro-blue hover:bg-thyro-navy",
  },
  {
    label: "Call",
    href: "tel:9985931929",
    icon: Phone,
    className: "bg-thyro-red hover:bg-red-700",
  },
];

export const FloatingContactButtons = () => (
  <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
    {actions.map((action) => {
      const Icon = action.icon;

      return (
        <a
          key={action.label}
          href={action.href}
          target={action.href.startsWith("http") ? "_blank" : undefined}
          rel={action.href.startsWith("http") ? "noreferrer" : undefined}
          aria-label={action.label}
          className={`group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-soft transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-thyro-green sm:h-14 sm:w-14 ${action.className}`}
        >
          <Icon className="h-5 w-5" />
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-thyro-ink px-2.5 py-1.5 text-xs font-semibold text-white shadow-crisp group-hover:block">
            {action.label}
          </span>
        </a>
      );
    })}
  </div>
);
