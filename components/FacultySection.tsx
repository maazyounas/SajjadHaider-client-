"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Loader2, User } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface FacultyMember {
  _id: string;
  name: string;
  designation: string;
  experience: string;
  bio: string;
  image: string;
  subjects: string[];
}

export default function FacultySection() {
  const { ref, isVisible } = useScrollAnimation();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faculty", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setFaculty(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching faculty:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="faculty"
      className="relative overflow-hidden border-y border-navy-700 bg-gradient-navy py-16 sm:py-20"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={ref}
          className={cn(
            "text-center mb-10 sm:mb-12 transition-all duration-1000",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10",
          )}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm hover:bg-teal-500/30 transition-all animate-glow-breathe">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full animate-pulse shrink-0" />
            <span className="animate-subtle-bounce text-xs sm:text-sm">
              Expert Educators
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white px-2">
            Meet Our <span className="text-gradient-gold">Faculty</span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-white/60 text-sm sm:text-base px-4">
            Learn from the industry&apos;s best. Our expert faculty members are
            dedicated to your success with years of proven academic excellence.
          </p>
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <div className="flex justify-center py-16 sm:py-20">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-teal-400 animate-spin" />
          </div>
        ) : faculty.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white/5 rounded-3xl border border-white/10">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-sm sm:text-base">Faculty listing coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {faculty.map((member, i) => (
              <div
                key={member._id}
                className={cn(
                  "group relative transition-all duration-700 h-full",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20",
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Card Glow Effect */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-teal-500/0 via-teal-500/0 to-gold-400/0 rounded-3xl blur opacity-0 group-hover:opacity-100 group-hover:from-teal-500/20 group-hover:to-gold-400/20 transition duration-500" />

                <div className="relative h-full bg-navy-800/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col shadow-xl hover:shadow-2xl">
                  {/* Image Container */}
                  <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-navy-700 flex items-center justify-center">
                        <User className="w-16 h-16 sm:w-20 sm:h-20 text-white/10" />
                      </div>
                    )}
                    {/* Overlay Gradient – darker for better text contrast */}
                    <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/40 to-transparent opacity-70" />

                    {/* Experience Badge – responsive size */}
                    {member.experience && (
                      <div className="absolute bottom-4 right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-teal-500/90 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                        {member.experience}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 lg:p-8 flex-1 flex flex-col">
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-serif group-hover:text-teal-400 transition-colors line-clamp-1">
                        {member.name}
                      </h3>
                      <p className="text-teal-500 text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1">
                        {member.designation}
                      </p>
                    </div>

                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Subjects – wrap nicely on mobile */}
                    <div className="mt-auto pt-4 sm:pt-6 border-t border-white/10 flex flex-wrap gap-1.5 sm:gap-2">
                      {member.subjects.map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] sm:text-[10px] font-bold text-white/70 uppercase tracking-tighter hover:bg-teal-500/20 hover:text-teal-400 hover:border-teal-500/30 transition-all"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
