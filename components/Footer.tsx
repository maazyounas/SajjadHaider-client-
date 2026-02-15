import Link from "next/link";
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
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

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-serif">SH Academy</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Empowering students with world-class O Level and A Level education.
              30+ years of excellence in Cambridge examinations.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal-500 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Popular Subjects */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-400 mb-4">
              Popular Subjects
            </h3>
            <ul className="space-y-2.5">
              {popularSubjects.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="text-sm text-white/60 hover:text-teal-400 transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-400 mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resources.map((r) => (
                <li key={r.name}>
                  <Link
                    href={r.href}
                    className="text-sm text-white/60 hover:text-teal-400 transition-colors"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-400 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <Phone className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
                <span>+92 300 123 4567</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <Mail className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
                <span>info@shacademy.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
                <span>DHA Phase 6, Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} SH Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
