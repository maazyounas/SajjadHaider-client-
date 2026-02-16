import Link from "next/link";
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Heart,
} from "lucide-react";

const popularSubjects = [
  { name: "IGCSE Economics", href: "/courses/igcse-economics" },
  { name: "IGCSE Business", href: "/courses/igcse-business" },
  { name: "AS Economics", href: "/courses/as-economics" },
  { name: "IGCSE Physics", href: "/courses/igcse-physics" },
  { name: "IGCSE Mathematics", href: "/courses/igcse-maths" },
];

const resources = [
  { name: "Free Notes", href: "/courses" },
  { name: "Past Papers", href: "/courses" },
  { name: "Video Lectures", href: "/courses" },
  { name: "Pricing Plans", href: "/pricing" },
  { name: "Book Appointment", href: "/appointment" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-600 hover:bg-blue-50" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-600 hover:bg-pink-50" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-600 hover:bg-red-50" },
];

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-navy-900 via-navy-900 to-navy-950 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand Section */}
            <div className="animate-fade-in-left" style={{ animationDelay: "0ms" }}>
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-gradient-teal rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-teal flex items-center justify-center shadow-lg group-hover:shadow-teal-500/50 group-hover:scale-110 transition-all duration-300">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold font-serif group-hover:text-gold-300 transition-colors duration-300">
                  SH Academy
                </span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Empowering students with world-class O Level and A Level education.
                <span className="block mt-1 text-white/40">30+ years of excellence in Cambridge examinations.</span>
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className={`group w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${social.color}`}
                    style={{
                      animation: `slideUpFade 0.5s ease-out forwards`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    <social.icon className="w-4 h-4 transition-all duration-300 group-hover:rotate-12" />
                  </a>
                ))}
              </div>
            </div>

            {/* Popular Subjects */}
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-teal-400 mb-5 flex items-center gap-2">
                <div className="w-1 h-4 bg-linear-to-b from-teal-400 to-teal-600 rounded-full" />
                Popular Subjects
              </h3>
              <ul className="space-y-2.5">
                {popularSubjects.map((s, i) => (
                  <li key={s.name} style={{ animationDelay: `${200 + i * 50}ms` }}>
                    <Link
                      href={s.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-teal-400 transition-all duration-300"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-teal-400 mb-5 flex items-center gap-2">
                <div className="w-1 h-4 bg-linear-to-b from-teal-400 to-teal-600 rounded-full" />
                Resources
              </h3>
              <ul className="space-y-2.5">
                {resources.map((r, i) => (
                  <li key={r.name} style={{ animationDelay: `${250 + i * 50}ms` }}>
                    <Link
                      href={r.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-teal-400 transition-all duration-300"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-fade-in-right" style={{ animationDelay: "200ms" }}>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-teal-400 mb-5 flex items-center gap-2">
                <div className="w-1 h-4 bg-linear-to-b from-teal-400 to-teal-600 rounded-full" />
                Contact Us
              </h3>
              <ul className="space-y-3.5">
                {[
                  { icon: Phone, text: "+92 300 123 4567", href: "tel:+923001234567" },
                  { icon: Mail, text: "info@shacademy.com", href: "mailto:info@shacademy.com" },
                  { icon: MapPin, text: "DHA Phase 6, Karachi, Pakistan", href: "#" },
                ].map((item, i) => (
                  <li key={i} style={{ animationDelay: `${300 + i * 50}ms` }}>
                    <a
                      href={item.href}
                      className="group flex items-start gap-3 text-sm text-white/60 hover:text-teal-400 transition-all duration-300"
                    >
                      <div className="w-4 h-4 mt-0.5 text-teal-400 shrink-0 transition-all duration-300 group-hover:scale-125">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span>{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-center items-center justify-between gap-4 text-xs sm:text-sm text-white/40">
            <p className="flex items-center gap-1.5">
              &copy; {new Date().getFullYear()} Sajjad Haider. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Animated top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-teal-500/30 to-transparent" />
    </footer>
  );
}