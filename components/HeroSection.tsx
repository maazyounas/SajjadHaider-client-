"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Star, Users, Award, BookOpen, Sparkles } from "lucide-react";
import { subjects } from "@/lib/data";

const stats = [
  { icon: Award, value: "30+", label: "Years of Excellence" },
  { icon: Users, value: "15K+", label: "Students Taught" },
  { icon: Star, value: "95%", label: "A*/A Rate" },
  { icon: BookOpen, value: "30", label: "Subjects Offered" },
];

const featured = subjects.slice(0, 5);

export default function HeroSection() {
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setActiveCard((prev) => (prev + 1) % featured.length);
        setIsFlipped(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse position for parallax effect (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const current = featured[activeCard];

  // Calculate parallax offset (disabled on mobile)
  const parallaxX = !isMobile ? (mousePosition.x - 0.5) * 20 : 0;
  const parallaxY = !isMobile ? (mousePosition.y - 0.5) * 20 : 0;

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-linear-to-br from-navy-900 via-navy-800 to-navy-900 text-white"
    >
      {/* Animated background blobs (unchanged) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-blob-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-400/12 rounded-full blur-3xl animate-blob-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-teal-500/8 rounded-full blur-3xl animate-blob-pulse"
          style={{ animationDelay: "4s" }}
        />
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute w-full h-px bg-linear-to-r from-transparent via-teal-400/30 to-transparent hidden sm:block"
            style={{
              top: "25%",
              animation: "slideLeft 8s linear infinite",
            }}
          />
          <div
            className="absolute w-full h-px bg-linear-to-r from-transparent via-gold-400/20 to-transparent hidden sm:block"
            style={{
              top: "75%",
              animation: "slideLeft 10s linear infinite reverse",
            }}
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* LEFT SECTION – Content (centered on mobile) */}
          <div className="order-1 text-center sm:text-left animate-fade-in-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm hover:bg-teal-500/30 transition-all animate-glow-breathe">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shrink-0" />
              <span className="animate-subtle-bounce text-xs sm:text-sm">
                Admissions Open for March 2026
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-serif leading-tight mb-4 sm:mb-6">
              <div className="overflow-hidden">
                <span className="inline-block animate-slide-up-fade">
                  Unlock Your Path to{" "}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block text-gradient-gold animate-slide-up-fade animation-delay-100">
                  Academic Excellence
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block animate-slide-up-fade animation-delay-200">
                  and Lifelong Success
                </span>
              </div>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 animate-slide-up-fade animation-delay-300">
              Pakistan&apos;s leading Cambridge education academy. Expert
              faculty, proven results, and comprehensive O Level &amp; A Level
              preparation that transforms futures.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 items-center sm:items-start animate-slide-up-fade animation-delay-400">
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-teal text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:opacity-90 shadow-lg shadow-teal-500/30 transition-all duration-300 hover:shadow-teal-500/50 hover:scale-105 btn-glow w-full sm:w-auto"
              >
                Explore Subjects
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/appointment"
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 border-2 border-white/20 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 hover:border-teal-400 backdrop-blur-sm w-full sm:w-auto"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                <span>Book Consultation</span>
              </Link>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-scale-in card-hover"
                  style={{
                    animationDelay: `${0.5 + index * 0.1}s`,
                  }}
                >
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mx-auto mb-1 sm:mb-1.5" />
                  <div className="text-lg sm:text-2xl font-bold text-gradient-gold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/50 mt-0.5 line-clamp-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION – 3D Card (unchanged) */}
          <div className="order-2 flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              {/* 3D Card container */}
              <div
                className="perspective-1000"
                style={{
                  transform: !isMobile
                    ? `perspective(1000px) rotateX(${parallaxY * 5}deg) rotateY(${parallaxX * 5}deg)`
                    : "perspective(1000px)",
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div
                  className={`relative w-full aspect-3/4 preserve-3d transition-transform duration-500 ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Card Front */}
                  <div className="absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                    <div
                      className={`h-full w-full bg-linear-to-br ${
                        [
                          "from-teal-500 to-teal-700",
                          "from-blue-500 to-indigo-700",
                          "from-orange-500 to-red-700",
                          "from-purple-500 to-pink-700",
                          "from-emerald-500 to-green-700",
                        ][activeCard]
                      } p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden`}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent animate-shimmer opacity-40" />

                      {/* Content */}
                      <div className="relative z-10 space-y-2 sm:space-y-3 lg:space-y-4">
                        <div className="text-4xl sm:text-5xl lg:text-6xl animate-bounce" style={{ animationDuration: "2s" }}>
                          {current.icon}
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg lg:text-2xl font-bold font-serif mb-1 sm:mb-2 line-clamp-2">
                            {current.name}
                          </h3>
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {current.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="relative z-10 flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-white/20 gap-2">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-[9px] sm:text-xs font-semibold uppercase hover:bg-white/30 transition-all whitespace-nowrap">
                          {current.level === "igcse"
                            ? "IGCSE"
                            : current.level.toUpperCase()}
                        </span>
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-white/90 text-right">
                          PKR {current.fee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-linear-to-br from-navy-700 to-navy-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center border border-white/10">
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 lg:mb-4 animate-float">📚</div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif mb-2 sm:mb-3 lg:mb-4">
                      Loading next course…
                    </h3>
                    <div className="relative w-10 sm:w-12 lg:w-16 h-1 bg-linear-to-r from-teal-400/0 via-teal-400 to-teal-400/0 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-white/30 animate-shimmer"
                        style={{ animationDuration: "2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card indicators (dots) */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 lg:mt-8">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveCard(i);
                      setIsFlipped(false);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeCard
                        ? "w-6 sm:w-8 h-1.5 sm:h-2.5 bg-linear-to-r from-teal-400 to-teal-300 shadow-lg shadow-teal-500/50 animate-glow-breathe"
                        : "w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white/20 hover:bg-white/40 hover:scale-125"
                    }`}
                    aria-label={`Go to course ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating decoration elements (hidden on mobile) */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-linear-to-br from-gold-400/25 to-gold-400/5 rounded-3xl rotate-12 animate-infinity-float shadow-lg hidden sm:block" />
              <div
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-linear-to-br from-teal-400/25 to-teal-400/5 rounded-2xl -rotate-12 animate-infinity-float shadow-lg hidden sm:block"
                style={{ animationDelay: "1.5s" }}
              />

              {/* Sparkle effects (hidden on mobile) */}
              <Sparkles
                className="absolute top-1/4 right-0 w-5 h-5 sm:w-6 sm:h-6 text-gold-300/40 animate-pulse hidden sm:block"
                style={{ animationDelay: "0.5s" }}
              />
              <Sparkles
                className="absolute bottom-1/4 left-0 w-4 h-4 sm:w-5 sm:h-5 text-teal-300/40 animate-pulse hidden sm:block"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-teal-500/30 to-transparent" />
    </section>
  );
}