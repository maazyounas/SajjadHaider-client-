"use client";

import { useState, FormEvent } from "react";
import { Phone, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const benefits = [
  "Personalised learning pathways",
  "Experienced Cambridge faculty",
  "Flexible online & in-person classes",
  "Free trial session available",
  "24/7 academic support",
  "Proven track record of results",
];

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-linear-to-b from-cream-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-8 sm:gap-12 items-start transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* ═══════════════════════════════════════ */}
          {/* LEFT — Info Section */}
          {/* ═══════════════════════════════════════ */}
          <div className="animate-fade-in-left">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-navy-800 mb-4">
              Start Your{" "}
              <span className="text-gradient-gold">Journey Today</span>
            </h2>
            <p className="text-navy-500 mb-8 leading-relaxed text-sm sm:text-base">
              Take the first step towards academic excellence. Get in touch with
              us for a free consultation and personalised learning plan.
            </p>

            {/* Benefits list with staggered animations */}
            <ul className="space-y-3 mb-8">
              {benefits.map((b, i) => (
                <li
                  key={b}
                  className={cn(
                    "flex items-center gap-3 text-navy-600 text-sm transition-all duration-500 transform",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[-20px]"
                  )}
                  style={{
                    transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                  }}
                >
                  <div className="relative">
                    <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-sm opacity-0 animate-glow-wave" />
                  </div>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons with hover effects */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="tel:+923001234567"
                className="group inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-navy-800 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-navy-700 transition-all duration-300 hover:shadow-lg hover:shadow-navy-800/30 transform hover:scale-105"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:bounce" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* RIGHT — Form Section */}
          {/* ═══════════════════════════════════════ */}
          <div
            className={cn(
              "bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl border border-navy-100 p-6 sm:p-8 transition-all duration-500 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            )}
          >
            <h3 className="text-lg sm:text-xl font-bold text-navy-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-teal rounded-full" />
              Enquiry Form
            </h3>

            {submitted ? (
              <div
                className="text-center py-12 animate-scale-in"
                style={{ animationDuration: "0.5s" }}
              >
                <div className="w-16 h-16 bg-linear-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                  <CheckCircle className="w-8 h-8 text-green-500 animate-scale-in" />
                </div>
                <h4 className="text-lg font-bold text-navy-800 mb-2">
                  Thank You!
                </h4>
                <p className="text-navy-500 text-sm leading-relaxed">
                  We&apos;ll get back to you within 24 hours with your personalised learning plan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="animate-slide-up-fade animation-delay-100">
                    <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-1.5">
                      Student Name *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 hover:border-navy-300"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="animate-slide-up-fade animation-delay-200">
                    <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-1.5">
                      Parent/Guardian Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 hover:border-navy-300"
                      placeholder="Full name"
                    />
                  </div>
                </div>

                {/* Contact fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="animate-slide-up-fade animation-delay-300">
                    <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 hover:border-navy-300"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="animate-slide-up-fade animation-delay-400">
                    <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-1.5">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 hover:border-navy-300"
                      placeholder="+92 3XX XXXXXXX"
                    />
                  </div>
                </div>

                {/* Subject selection */}
                <div className="animate-slide-up-fade animation-delay-500">
                  <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-1.5">
                    Subject of Interest
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white transition-all duration-300 hover:border-navy-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232d4a8a' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.5rem',
                    }}>
                    <option value="">Select a subject</option>
                    <option>IGCSE Economics</option>
                    <option>IGCSE Business Studies</option>
                    <option>AS Economics</option>
                    <option>A2 Economics</option>
                    <option>IGCSE Mathematics</option>
                    <option>IGCSE Physics</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Mode selection */}
                <div className="animate-slide-up-fade animation-delay-600">
                  <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-2.5">
                    Preferred Mode
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {["Online", "In-Person", "Both"].map((mode) => (
                      <label
                        key={mode}
                        className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="mode"
                          value={mode}
                          className="accent-teal-500 w-4 h-4 cursor-pointer transition-all"
                        />
                        <span className="group-hover:text-teal-600 transition-colors">
                          {mode}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message field */}
                <div className="animate-slide-up-fade animation-delay-700">
                  <label className="block text-xs sm:text-sm font-medium text-navy-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none transition-all duration-300 hover:border-navy-300"
                    placeholder="Any questions or comments…"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 bg-gradient-teal text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:opacity-90 shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-teal-500/50 hover:scale-105 transform inline-flex items-center justify-center gap-2 group animate-slide-up-fade animation-delay-800 btn-glow"
                >
                  Submit Enquiry
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}