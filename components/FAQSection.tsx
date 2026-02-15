"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do online classes work?",
    a: "Our online classes are conducted live via Zoom with interactive whiteboards, screen sharing, and real-time Q&A. All sessions are recorded and made available for review. You get the same quality of teaching as our physical classes.",
  },
  {
    q: "What materials are included?",
    a: "Every course includes comprehensive notes, topic-wise quizzes, past papers with marking schemes, and video explanations. Free materials are available to all users, while premium materials require a course subscription.",
  },
  {
    q: "Which exam boards do you cover?",
    a: "We primarily cover Cambridge International Examinations (CIE) for both IGCSE/O Level and AS/A Level. Our materials and teaching are aligned with the latest Cambridge syllabi and marking criteria.",
  },
  {
    q: "Can international students enroll?",
    a: "Absolutely! We welcome students from around the world. Our online classes are designed to accommodate different time zones, and all materials are accessible digitally from anywhere.",
  },
  {
    q: "How do you track student progress?",
    a: "We use a combination of regular assessments, mock exams, and personalised progress reports. Parents receive monthly updates, and students can track their performance through our student portal.",
  },
  {
    q: "What are the fees and payment options?",
    a: "Fees vary by subject and level. We offer pay-per-course pricing with multiple payment options including credit/debit cards, EasyPaisa/JazzCash, and bank transfers. Visit our Pricing page for detailed information.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-cream-50/30 to-white relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl animate-blob-pulse" />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-gold-400/3 rounded-full blur-3xl animate-blob-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header section */}
        <div
          ref={ref}
          className={cn(
            "text-center mb-10 sm:mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 text-xs sm:text-sm font-medium mb-4 animate-glow-breathe">
            <HelpCircle className="w-4 h-4 animate-subtle-bounce" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-navy-800 mb-3 sm:mb-4">
            Frequently Asked{" "}
            <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-navy-500 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about SH Academy and our programs. Can
            not find your answer? Reach out to our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "border border-navy-100 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-500 transform hover:border-teal-200",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
                openIndex === i &&
                  "border-teal-300 bg-teal-50/30 shadow-lg shadow-teal-500/10",
              )}
              style={{
                transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={cn(
                  "w-full flex items-center justify-between p-4 sm:p-5 text-left transition-all duration-300 group",
                  openIndex === i
                    ? "bg-gradient-to-r from-teal-50/50 to-transparent"
                    : "hover:bg-navy-50/50",
                )}
              >
                <span
                  className={cn(
                    "font-semibold pr-4 text-sm sm:text-base transition-colors duration-300",
                    openIndex === i
                      ? "text-teal-700"
                      : "text-navy-800 group-hover:text-navy-900",
                  )}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-navy-400 shrink-0 transition-all duration-300",
                    openIndex === i && "rotate-180 text-teal-500",
                  )}
                />
              </button>

              {/* Answer section with smooth collapse/expand */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-96" : "max-h-0",
                )}
              >
                <div
                  className={cn(
                    "px-4 sm:px-5 pb-4 sm:pb-5 border-t border-teal-200/50 transition-all duration-300",
                    openIndex === i ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    animation:
                      openIndex === i ? "slideUpFade 0.4s ease-out" : "none",
                  }}
                >
                  <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                    {faq.a}
                  </p>

                  {/* Helpful action buttons */}
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs">
                    <span className="text-navy-400">Was this helpful?</span>
                    <button className="px-2 sm:px-3 py-1 rounded-full text-navy-500 hover:bg-white hover:text-teal-600 transition-all duration-200 text-[11px] sm:text-xs font-medium border border-navy-200 hover:border-teal-300">
                      Yes
                    </button>
                    <button className="px-2 sm:px-3 py-1 rounded-full text-navy-500 hover:bg-white hover:text-navy-700 transition-all duration-200 text-[11px] sm:text-xs font-medium border border-navy-200 hover:border-navy-300">
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA after FAQ */}
        <div
          className={cn(
            "mt-10 sm:mt-12 p-6 sm:p-8 rounded-lg sm:rounded-2xl bg-gradient-to-r from-navy-800/5 to-teal-500/5 border border-teal-200/30 text-center transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{
            transitionDelay: isVisible ? `${faqs.length * 80 + 200}ms` : "0ms",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-gold-400 animate-subtle-bounce" />
            <p className="text-sm sm:text-base font-semibold text-navy-800">
              Still have questions?
            </p>
          </div>
          <p className="text-xs sm:text-sm text-navy-600 mb-4">
            Our support team is here to help. Reach out anytime via WhatsApp,
            email, or phone call.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-teal text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 transform inline-block btn-glow"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:support@shacademy.com"
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-navy-800 text-white font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:bg-navy-700 transition-all duration-300 hover:shadow-lg hover:shadow-navy-800/30 hover:scale-105 transform inline-block"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
