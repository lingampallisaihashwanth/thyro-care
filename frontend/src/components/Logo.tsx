import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

const LogoMark = () => (
  <svg
    className="h-11 w-11 shrink-0"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="96" height="96" rx="22" fill="#F7FBFF" />
    <path
      d="M49.1 10.6C38.1 24 25.4 39.1 25.4 55.3C25.4 72.1 35.9 84.5 49.1 84.5C62.3 84.5 72.8 72.1 72.8 55.3C72.8 39.1 60.1 24 49.1 10.6Z"
      fill="#D94141"
    />
    <path
      d="M49.1 17.8C40.1 29.1 30.2 42.2 30.2 55.4C30.2 69.1 38.4 79.6 49.1 79.6C59.8 79.6 68 69.1 68 55.4C68 42.2 58.1 29.1 49.1 17.8Z"
      fill="#FFFFFF"
      opacity="0.18"
    />
    <path
      d="M36 56.5H61.5"
      stroke="#12355B"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <path
      d="M44.1 33.6H57.2"
      stroke="#1768AC"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <path
      d="M50.6 33.6V58"
      stroke="#1768AC"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <path
      d="M43.7 58V67.5H58.9"
      stroke="#12355B"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="61.2" cy="67.5" r="7.1" fill="#1F9D72" />
    <circle cx="61.2" cy="67.5" r="3.2" fill="#F7FBFF" />
    <path
      d="M35.3 45.1C37.6 39.5 43 35.9 49.1 35.9C55.3 35.9 60.8 39.8 63 45.6"
      stroke="#1F9D72"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Logo = ({ compact = false, className = "" }: LogoProps) => {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-thyro-green ${className}`}
      aria-label={t("brand.homeAria") as string}
    >
      <LogoMark />
      {!compact && (
        <span className="min-w-0">
          <span className="block text-base font-extrabold leading-tight text-thyro-navy sm:text-lg">
            THYRO LABORATORIES
          </span>
          <span className="block text-[11px] font-semibold uppercase leading-tight text-thyro-green sm:text-xs">
            {t("brand.subtitle") as string}
          </span>
        </span>
      )}
    </Link>
  );
};

export const StaticLogo = ({ compact = false, className = "" }: LogoProps) => {
  const { t } = useTranslation();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark />
      {!compact && (
        <span>
          <span className="block text-base font-extrabold leading-tight text-thyro-navy sm:text-lg">
            THYRO LABORATORIES
          </span>
          <span className="block text-[11px] font-semibold uppercase leading-tight text-thyro-green sm:text-xs">
            {t("brand.subtitle") as string}
          </span>
        </span>
      )}
    </div>
  );
};
