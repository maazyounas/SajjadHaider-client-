"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { buildWhatsAppHref } from "@/lib/whatsapp";

// WhatsApp SVG icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const navItems = [
  { label: "Courses", href: "/#subjects" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "FAQs", href: "/#faq" },
];

// Defined outside component so it's stable
const SECTIONS = ["home", "subjects", "about", "faq", "contact"];

export default function Header({ initialSettings }: { initialSettings?: Record<string, string> }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(
    () => (typeof window !== "undefined" ? window.scrollY > 20 : false)
  );
  const [activeSection, setActiveSection] = useState("home");
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings || {});
  const headerRef = useRef<HTMLElement>(null);

  const isHomepage = pathname === "/";
  const whatsappHref = buildWhatsAppHref(settings.whatsappNumber);

  const scrollToSectionWithOffset = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerHeight = headerRef.current?.offsetHeight ?? 40;
    const extraOffset = 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (initialSettings) return;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error("Failed to fetch settings", err));
  }, [initialSettings]);

  const handleScroll = useCallback(() => {
    // Apply scroll detection for ALL screen sizes (fixes mobile transparent navbar issue)
    setIsScrolled(window.scrollY > 20);

    if (isHomepage) {
      const reversed = [...SECTIONS].reverse();
      let found = "home";
      for (const section of reversed) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            found = section;
            break;
          }
        }
      }
      setActiveSection(found);
    }
  }, [isHomepage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isHomepage) return;
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace("#", "");
    const timer = window.setTimeout(() => {
      scrollToSectionWithOffset(id);
      setActiveSection(id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isHomepage, scrollToSectionWithOffset]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      setActiveSection(id);
      scrollToSectionWithOffset(id);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isHomepage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("home");
    } else {
      router.push("/");
    }
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (!isHomepage) return false;
    const section = href.replace("/#", "");
    return section === activeSection;
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-navy-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-teal flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                "text-xl font-bold font-serif transition-colors",
                isScrolled ? "text-navy-800" : "text-navy-900"
              )}
            >
              {settings.academyName || "SH Academy"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (isHomepage && item.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "text-teal-600 bg-teal-50"
                    : "text-navy-600 hover:text-teal-600 hover:bg-navy-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={buildWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-green-600 hover:bg-green-50"
            >
              <WhatsAppIcon className="w-5 h-5" /> WhatsApp
            </a>

            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-navy-800 text-white text-sm font-semibold rounded-lg hover:bg-navy-700 transition-colors"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/#contact"
              onClick={(e) => {
                if (isHomepage) {
                  e.preventDefault();
                  handleNavClick("/#contact");
                }
              }}
              className="px-5 py-2.5 bg-gradient-teal text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md transition-all"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-navy-600 hover:bg-navy-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-2xl border border-navy-100 mt-2 mb-4 p-4 animate-scale-in">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (isHomepage && item.href.startsWith("/#")) {
                      e.preventDefault();
                    }
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-teal-50 text-teal-600"
                      : "text-navy-600 hover:bg-navy-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-navy-100 mt-3 pt-3 space-y-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-5 sm:px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-bold text-sm sm:text-base text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" /> WhatsApp
              </a>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-navy-600 hover:bg-navy-50 rounded-xl"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/#contact"
                onClick={(e) => {
                  if (isHomepage) e.preventDefault();
                  handleNavClick("/#contact");
                }}
                className="block px-4 py-3 bg-gradient-teal text-white text-center text-sm font-semibold rounded-xl"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
