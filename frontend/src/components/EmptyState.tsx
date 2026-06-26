import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  text?: string;
};

export const EmptyState = ({ icon: Icon, title, text }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-thyro-blue shadow-crisp">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-3 text-sm font-bold text-thyro-navy">{title}</p>
    {text && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
  </div>
);
