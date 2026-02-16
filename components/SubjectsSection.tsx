"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { levelLabels, categoryColors } from "@/lib/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface CourseData {
  _id: string;
  name: string;
  level: string;
  category: string;
  icon: string;
  description: string;
  tags: string[];
  fee: number;
  instructor: string;
}

const levelFilters = ["all", "igcse", "as", "a2"];
const categoryFilters = [
  "all",
  "economics",
  "business",
  "sciences",
  "humanities",
  "languages",
];

export default function SubjectsSection() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((s) => {
    if (levelFilter !== "all" && s.level !== levelFilter) return false;
    if (catFilter !== "all" && s.category !== catFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <section id="courses" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gold-400/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Heading with scroll animation */}
        <div
          ref={ref}
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <h2 className="text-3xl sm:text-4xl  font-bold font-serif text-navy-800 mb-4">
            Our <span className="text-gradient-gold">Courses</span>
          </h2>
          <p className="text-navy-500 max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive range of IGCSE, AS, and A2 Level courses
            taught by experienced Cambridge educators.
          </p>
        </div>

        {/* Filters section with staggered animation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 animate-slide-up-fade animation-delay-200">
          {/* Level Filters */}
          <div className="flex flex-wrap gap-2">
            {levelFilters.map((l, i) => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 relative overflow-hidden",
                  levelFilter === l
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/40 scale-105"
                    : "bg-navy-50 text-navy-600 hover:bg-navy-100 hover:shadow-md",
                )}
                style={{
                  animationName: isVisible ? "slideUpFade" : "none",
                  animationDuration: "0.6s",
                  animationTimingFunction: "ease-out",
                  animationFillMode: "forwards",
                  animationDelay: `${300 + i * 50}ms`,
                }}
              >
                <span className="relative z-10">
                  {l === "all" ? "All Levels" : levelLabels[l]}
                </span>
                {levelFilter === l && (
                  <span className="absolute inset-0 bg-white/10 animate-shimmer" />
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              placeholder="Search subjects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent w-64 transition-all duration-300 hover:border-navy-300 focus:shadow-lg focus:shadow-teal-400/20"
            />
          </div>
        </div>

        {/* Category tabs with staggered reveal */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryFilters.map((c, i) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize transform hover:scale-105 relative overflow-hidden",
                  catFilter === c
                    ? "bg-navy-800 text-white shadow-md shadow-navy-800/30 scale-105"
                    : "bg-navy-50 text-navy-500 hover:bg-navy-100",
                )}
                style={{
                  animationName: isVisible ? "slideUpFade" : "none",
                  animationDuration: "0.6s",
                  animationTimingFunction: "ease-out",
                  animationFillMode: "forwards",
                  animationDelay: `${400 + i * 40}ms`,
                }}
              >
              <span className="relative z-10">
                {c === "all" ? "All Categories" : c}
              </span>
              {catFilter === c && (
                <span className="absolute inset-0 bg-white/10 animate-shimmer" />
              )}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-teal-500/20 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Courses Grid with staggered reveal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((subject, i) => (
                <Link
                  key={subject._id}
                  href={`/courses/${subject._id}`}
                  className={cn(
                    "group block rounded-2xl overflow-hidden border border-navy-100 bg-white shadow-sm transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-2",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12",
                  )}
                  onMouseEnter={() => setHoveredCard(subject._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                  }}
                >
                  {/* Animated gradient bar */}
                  <div
                    className={`h-1 bg-linear-to-r ${
                      categoryColors[subject.category]
                    } relative overflow-hidden`}
                  >
                    <div
                      className="absolute inset-0 bg-white/30 animate-shimmer"
                      style={{
                        animationDelay: `${i * 200}ms`,
                      }}
                    />
                  </div>

                  <div className="p-6">
                    {/* Header with icon and level badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="text-4xl transition-all duration-300 transform group-hover:scale-125"
                        style={{
                          animationName: isVisible ? "slideUpFade" : "none",
                          animationDuration: "0.6s",
                          animationTimingFunction: "ease-out",
                          animationFillMode: "forwards",
                          animationDelay: `${i * 80}ms`,
                        }}
                      >
                        {subject.icon}
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white transition-all duration-300 transform hover:scale-110",
                          subject.level === "igcse"
                            ? "bg-teal-500 shadow-md shadow-teal-500/30"
                            : subject.level === "as"
                              ? "bg-blue-500 shadow-md shadow-blue-500/30"
                              : "bg-purple-500 shadow-md shadow-purple-500/30",
                        )}
                      >
                        {subject.level === "igcse"
                          ? "IGCSE"
                          : subject.level.toUpperCase()}
                      </span>
                    </div>

                    {/* Title and description */}
                    <h3 className="text-lg font-bold text-navy-800 mb-1 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-navy-500 mb-4 line-clamp-2 group-hover:text-navy-600 transition-colors">
                      {subject.description}
                    </p>

                    {/* Tags with staggered reveal on hover */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {subject.tags.map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-navy-50 text-navy-500 text-[11px] rounded-md font-medium transition-all duration-300 transform hover:bg-teal-50 hover:text-teal-600"
                          style={{
                            animationName:
                              hoveredCard === subject._id ? "slideUpFade" : "none",
                            animationDuration: "0.3s",
                            animationTimingFunction: "ease-out",
                            animationFillMode: "forwards",
                            animationDelay: `${tagIndex * 30}ms`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer with pricing and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-navy-100 group-hover:border-teal-200 transition-colors">
                      <div className="transition-all duration-300 group-hover:translate-y-0 hover:scale-105">
                        <span className="text-xs text-navy-400">From</span>
                        <span className="text-lg font-bold text-navy-800 ml-1 group-hover:text-teal-600 transition-colors">
                          PKR {subject.fee.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-500 transition-all duration-300 transform group-hover:scale-110 shadow-sm group-hover:shadow-lg group-hover:shadow-teal-500/30">
                        <ArrowRight className="w-4 h-4 text-teal-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-teal-500/0 via-teal-500/0 to-teal-500/0 group-hover:from-teal-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                </Link>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                className={cn(
                  "text-center py-16 transition-all duration-500",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                )}
              >
                <div className="text-5xl mb-4 animate-float">🔍</div>
                <p className="text-lg text-navy-400 font-medium">
                  No courses found matching your filters.
                </p>
                <p className="text-sm text-navy-300 mt-2">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
