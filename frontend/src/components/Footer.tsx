import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { StaticLogo } from "./Logo";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Tests", to: "/tests" },
  { label: "Certifications", to: "/certifications" },
  { label: "Contact", to: "/contact" },
];

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div>
        <StaticLogo />
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
          THYRO LABORATORIES Smart Booking & Management System for patient-friendly
          laboratory test booking and account management.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase text-thyro-navy">Contact</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-thyro-green" />
            <span>
              Opposite Abhaya Hospital, Doctors Colony, Miryalaguda, Telangana -
              508207
            </span>
          </p>
          <p className="flex gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-thyro-green" />
            <span>9985931929, 9966129009, 9010855999</span>
          </p>
          <p className="flex gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-thyro-green" />
            <span>thyrolaboratories99@gmail.com</span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase text-thyro-navy">Quick Links</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md py-1 font-medium text-slate-600 transition hover:text-thyro-blue"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs font-medium text-slate-500">
      Copyright 2026 THYRO LABORATORIES. All rights reserved.
    </div>
  </footer>
);
