"use client";

import { BookOpen, Brain, FileText, Target } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Notes",
    description: "Detailed chapter-wise notes by Cambridge examiners",
  },
  {
    icon: Brain,
    title: "Interactive Quizzes",
    description: "Test your knowledge with topic-wise MCQ quizzes",
  },
  {
    icon: FileText,
    title: "Past Papers + Solutions",
    description: "Complete past papers with detailed mark schemes",
  },
  {
    icon: Target,
    title: "Exam Techniques",
    description: "Proven strategies to maximize your exam scores",
  },
];

export default function FeaturesStrip() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative overflow-hidden border-y border-navy-700 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-12 sm:py-16">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 animate-pulse-slow rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 animate-pulse-slower rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-teal-400/5 blur-3xl" />
      </div>

      {/* Grid overlay for texture (optional) */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

      <div
        ref={ref}
        className={cn(
          "relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 transition-all duration-700 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-4 lg:gap-8",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        {features.map((feat, i) => (
          <div
            key={feat.title}
            className={cn(
              "group relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-teal-400/50 hover:bg-white/15 hover:shadow-xl hover:shadow-teal-500/20 sm:gap-3 sm:p-4 sm:rounded-2xl",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-50"
            )}
            style={{
              transitionDelay: isVisible ? `${i * 100}ms` : "0ms",
            }}
          >
            {/* Icon container – gradient with shine */}
            <div
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-teal-400/40 sm:h-14 sm:w-14 sm:rounded-xl",
                "before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100" // subtle shine
              )}
            >
              <feat.icon className="relative z-10 h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-6 sm:h-7 sm:w-7" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="mb-0.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-teal-200 line-clamp-2 sm:text-base">
                {feat.title}
              </h3>
              <p className="text-xs leading-snug text-white/80 transition-colors duration-300 group-hover:text-white/90 sm:text-sm sm:leading-relaxed">
                {feat.description}
              </p>
            </div>

            {/* Animated border overlay (desktop only) */}
            <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-teal-400/0 transition-all duration-300 group-hover:border-teal-400/30 sm:rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
    </section>
  );
}