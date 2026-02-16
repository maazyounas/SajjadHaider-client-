"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, MessageCircle, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Pricing", href: "/pricing" },
  { label: "Appointment", href: "/appointment" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-navy-100/50"
          : "bg-white/80 backdrop-blur-sm shadow-sm border-b border-navy-50"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-teal rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center shadow-lg group-hover:shadow-teal-500/50 group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="overflow-hidden">
              <span className="text-lg sm:text-xl font-bold text-navy-800 font-serif tracking-tight block transition-all duration-300 group-hover:text-teal-600">
                SH Academy
              </span>
              <span className="hidden sm:block text-[10px] text-navy-400 -mt-0.5 transition-colors duration-300 group-hover:text-teal-500">
                Excellence in Education
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.href)}
                onMouseLeave={() => setHoveredNav(null)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group",
                  pathname === item.href
                    ? "text-teal-600 bg-teal-50"
                    : "text-navy-600 hover:text-teal-600"
                )}
                style={{
                  animation: `slideUpFade 0.5s ease-out forwards`,
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Animated background */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-lg bg-teal-50 transition-all duration-300 -z-10",
                    hoveredNav === item.href ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                />

                {/* Bottom border animation */}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-linear-to-r from-transparent via-teal-600 to-transparent animate-shimmer" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span>WhatsApp</span>
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="group relative px-4 py-2 text-sm font-medium text-navy-700 bg-navy-100 hover:bg-navy-200 rounded-lg transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      Dashboard
                    </span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative px-5 py-2.5 text-sm font-semibold text-white bg-gradient-teal rounded-lg hover:opacity-90 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/40 transform hover:scale-105 overflow-hidden btn-glow"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Enroll Now
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-navy-700 hover:bg-navy-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
          >
            {isOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-navy-100 animate-fade-in-up">
            <nav className="flex flex-col gap-1 pt-4">
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform",
                    pathname === item.href
                      ? "text-teal-600 bg-linear-to-r from-teal-50 to-transparent border-l-2 border-teal-600"
                      : "text-navy-600 hover:bg-navy-50 hover:text-teal-600"
                  )}
                  style={{
                    animation: `slideUpFade 0.4s ease-out forwards`,
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile action buttons */}
              <div className="border-t border-navy-100 mt-3 pt-3 space-y-2">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-green-500 to-emerald-500 rounded-lg hover:opacity-90 transition-all duration-300"
                  style={{
                    animation: `slideUpFade 0.4s ease-out forwards`,
                    animationDelay: `${navItems.length * 50}ms`,
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>

                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-navy-700 to-navy-600 rounded-lg hover:opacity-90 transition-all duration-300"
                      >
                        <Sparkles className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-teal rounded-lg hover:opacity-90 transition-all duration-300 shadow-md"
                  >
                    Enroll Now
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}