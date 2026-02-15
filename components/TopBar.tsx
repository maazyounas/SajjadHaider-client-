"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-navy-900 text-white/80 text-sm hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="tel:+923001234567" className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span>+92 321 2954720</span>
          </a>
          <a href="mailto:info@shacademy.com" className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span>info@shacademy.com</span>
          </a>
          <span className="hidden lg:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Islamabad, Pakistan</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="hover:text-teal-400 transition-colors">
            Student Portal Login
          </a>
        </div>
      </div>
    </div>
  );
}
