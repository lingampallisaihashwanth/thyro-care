import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const inputClasses =
  "h-12 w-full rounded-md border border-slate-200 px-3 pr-12 outline-none transition focus:border-thyro-blue focus:ring-4 focus:ring-thyro-sky";

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const Icon = isVisible ? EyeOff : Eye;

    return (
      <div className="relative mt-2">
        <input
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={[inputClasses, className].filter(Boolean).join(" ")}
          {...props}
        />
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          disabled={disabled}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-thyro-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon className="h-4 w-4" />
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
