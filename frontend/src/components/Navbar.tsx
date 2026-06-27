import { Bell, LogIn, LogOut, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "./Logo";

const navLinks = [
  { key: "nav.home", label: "Home", to: "/" },
  { key: "nav.about", label: "About", to: "/about" },
  { key: "nav.tests", label: "Tests", to: "/tests" },
  { key: "nav.certifications", label: "Certifications", to: "/certifications" },
  { key: "nav.contact", label: "Contact", to: "/contact" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-thyro-blue text-white shadow-crisp"
      : "text-slate-700 hover:bg-thyro-sky hover:text-thyro-navy"
  }`;

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const initial = user?.fullName?.trim().charAt(0).toUpperCase() || "T";
  const tr = (key: string, defaultValue: string) =>
    t(key, { defaultValue }) as string;

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  const openProfile = () => {
    closeMobile();
    navigate("/profile");
  };

  const openNotifications = () => {
    closeMobile();
    navigate("/profile#notifications");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo compact={location.pathname !== "/" && mobileOpen} />

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {tr(link.key, link.label)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <button
                type="button"
                onClick={openNotifications}
                className="group relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-thyro-navy transition hover:border-thyro-green hover:bg-thyro-mint"
                aria-label={tr("nav.openNotifications", "Open notifications")}
              >
                <Bell className="h-5 w-5" />
                <span className="pointer-events-none absolute right-0 top-full mt-2 hidden rounded-md bg-thyro-ink px-2 py-1 text-xs text-white group-hover:block">
                  {tr("nav.notifications", "Notifications")}
                </span>
              </button>
              <button
                type="button"
                onClick={openProfile}
                className="group relative grid h-11 w-11 place-items-center rounded-full bg-thyro-blue text-sm font-bold text-white shadow-crisp transition hover:bg-thyro-navy"
                aria-label={tr("nav.openAccount", "Open account")}
              >
                {initial}
                <span className="pointer-events-none absolute right-0 top-full mt-2 hidden rounded-md bg-thyro-ink px-2 py-1 text-xs text-white group-hover:block">
                  {tr("nav.account", "Account")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-thyro-red hover:bg-red-50 hover:text-thyro-red"
              >
                <LogOut className="h-4 w-4" />
                {tr("nav.logout", "Logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-thyro-blue hover:bg-thyro-sky hover:text-thyro-blue"
              >
                <LogIn className="h-4 w-4" />
                {tr("nav.login", "Login")}
              </Link>
              <Link
                to="/register"
                className="inline-flex h-11 items-center rounded-full bg-thyro-green px-5 text-sm font-bold text-white shadow-crisp transition hover:bg-emerald-700"
              >
                {tr("nav.register", "Register")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-thyro-navy lg:hidden"
          aria-label={tr("nav.toggleMenu", "Toggle menu")}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-crisp lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                onClick={closeMobile}
              >
                {tr(link.key, link.label)}
              </NavLink>
            ))}

            <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-4">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={openNotifications}
                    className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-thyro-navy"
                    aria-label={tr("nav.openNotifications", "Open notifications")}
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={openProfile}
                    className="grid h-11 w-11 place-items-center rounded-full bg-thyro-blue text-sm font-bold text-white"
                    aria-label={tr("nav.openAccount", "Open account")}
                  >
                    {initial}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                    {tr("nav.logout", "Logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                  >
                    <LogIn className="h-4 w-4" />
                    {tr("nav.login", "Login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-thyro-green px-4 text-sm font-bold text-white"
                  >
                    {tr("nav.register", "Register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
