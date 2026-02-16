"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  FileText,
  Play,
  Lock,
  Unlock,
  Download,
  ShoppingCart,
  User,
  Loader2,
  ExternalLink,
  Sparkles,
  Star,
  Clock,
} from "lucide-react";
import { levelLabels, categoryColors } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import CoursePurchaseModal from "@/components/CoursePurchaseModal";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface Material {
  _id: string;
  title: string;
  description: string;
  type: "free" | "premium";
  fileUrl?: string;
  fileType?: string;
}

interface CourseDetail {
  _id: string;
  name: string;
  level: string;
  category: string;
  icon: string;
  description: string;
  tags: string[];
  fee: number;
  instructor: string;
  resources: {
    notes: Material[];
    quizzes: Material[];
    pastPapers: Material[];
    videos: Material[];
  };
}

const tabConfig = [
  { key: "notes", label: "Notes", icon: BookOpen, color: "from-blue-500 to-indigo-600" },
  { key: "quizzes", label: "Quizzes", icon: Brain, color: "from-purple-500 to-pink-600" },
  { key: "pastPapers", label: "Past Papers", icon: FileText, color: "from-orange-500 to-red-600" },
  { key: "videos", label: "Videos", icon: Play, color: "from-teal-500 to-emerald-600" },
] as const;

type TabKey = (typeof tabConfig)[number]["key"];

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { hasCourseAccess } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("notes");
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((data) => setCourse(data.course || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50">
        <TopBar />
        <Header />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-teal-500/20 animate-pulse" />
          </div>
          <p className="text-navy-500 font-medium mt-6">Loading course details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-cream-50">
        <TopBar />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="mb-6 text-6xl animate-float">📚</div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-navy-800 mb-4">
            Course Not Found
          </h1>
          <p className="text-navy-500 mb-8 text-base">
            The course you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-teal text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 transform"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const hasAccess = hasCourseAccess(course._id);
  const resources = course.resources[activeTab];
  const currentTabConfig = tabConfig.find(t => t.key === activeTab)!;

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-blob-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl animate-blob-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <TopBar />
      <Header />

      {/* Hero Section */}
      <div className={`bg-gradient-navy relative overflow-hidden py-12 sm:py-16 lg:py-20`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Back Button */}
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-all duration-300 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
            <span>Back to Courses</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-2 animate-fade-in-left">
              <div className="flex items-start gap-4 sm:gap-6 mb-6">
                <div className="text-5xl sm:text-6xl lg:text-7xl animate-bounce" style={{ animationDuration: "2.5s" }}>
                  {course.icon}
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase text-white border border-white/30 shadow-lg",
                      "transition-all duration-300 hover:bg-white/30"
                    )}>
                      {course.level === "igcse" ? "IGCSE" : course.level.toUpperCase()}
                    </span>
                    {hasAccess && (
                      <span className="px-3 py-1.5 bg-green-500/30 backdrop-blur-sm rounded-full text-xs font-bold uppercase text-green-300 border border-green-400/50 flex items-center gap-1.5 animate-glow-breathe">
                        <Unlock className="w-3 h-3" />
                        Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white mb-4 leading-tight">
                {course.name}
              </h1>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                {course.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-white/70 text-sm mb-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <User className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <BookOpen className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">{levelLabels[course.level]}</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <Star className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">Expert Led</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/70 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    style={{
                      animation: `slideUpFade 0.6s ease-out forwards`,
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Sidebar - Course Card */}
            <div className="animate-slide-in-right">
              <div className="sticky top-24 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-2xl hover:border-teal-300/50 transition-all duration-500 transform hover:scale-105 group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-teal-500/0 group-hover:from-teal-500/10 group-hover:to-teal-500/5 rounded-2xl transition-all duration-500" />

                <div className="relative z-10">
                  <div className="text-sm text-white/60 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Course Fee
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-1">
                    PKR <span className="text-gradient-gold">{course.fee.toLocaleString()}</span>
                  </div>
                  <p className="text-white/50 text-xs mb-6">Lifetime access to all materials</p>

                  {hasAccess ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-300 text-sm font-semibold bg-green-500/20 rounded-xl px-4 py-3 border border-green-400/30 animate-glow-breathe">
                        <Unlock className="w-5 h-5" />
                        <span>Full Access Granted</span>
                      </div>
                      <p className="text-xs text-white/50 text-center">You can access all premium materials</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPurchase(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/50 transform hover:scale-105 btn-glow group/btn"
                    >
                      <ShoppingCart className="w-5 h-5 transition-transform group-hover/btn:translate-y-[-2px]" />
                      <span>Purchase Course</span>
                    </button>
                  )}

                  {!hasAccess && (
                    <p className="text-xs text-white/50 text-center mt-4">
                      ✓ Lifetime access<br />
                      ✓ All materials included<br />
                      ✓ Expert support
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-navy-100 hover:shadow-xl transition-all duration-300">
            {tabConfig.map((tab, idx) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform",
                  activeTab === tab.key
                    ? cn(
                      `bg-gradient-to-r ${tab.color} text-white shadow-lg`,
                      "scale-105 shadow-lg"
                    )
                    : "text-navy-600 hover:bg-navy-50 hover:text-navy-800"
                )}
                style={{
                  animation: activeTab === tab.key ? `slideUpFade 0.4s ease-out` : "none",
                }}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div>
          {resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {resources.map((item: Material, idx: number) => {
                const isLocked = item.type === "premium" && !hasAccess;
                return (
                  <div
                    key={item._id}
                    className={cn(
                      "group relative p-5 sm:p-6 rounded-lg sm:rounded-2xl border transition-all duration-500 transform overflow-hidden",
                      isLocked
                        ? "bg-gradient-to-br from-navy-50 to-white border-navy-100 opacity-60"
                        : "bg-gradient-to-br from-white to-navy-50/30 border-navy-100 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 hover:scale-105"
                    )}
                    style={{
                      animation: `slideUpFade 0.6s ease-out forwards`,
                      animationDelay: `${idx * 100}ms`,
                    }}
                  >
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/0 via-transparent to-teal-500/0 group-hover:from-teal-500/5 group-hover:to-teal-500/10 transition-all duration-500" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <h3 className="font-semibold text-navy-800 group-hover:text-teal-600 transition-colors duration-300 text-sm sm:text-base line-clamp-2">
                          {item.title}
                        </h3>
                        {item.type === "free" ? (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            FREE
                          </span>
                        ) : (
                          <span className={cn(
                            "px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap shadow-sm flex items-center gap-1",
                            isLocked
                              ? "bg-gradient-to-r from-gold-100 to-orange-100 text-gold-700"
                              : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                          )}>
                            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            PREMIUM
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-navy-600 mb-4 leading-relaxed line-clamp-2 group-hover:text-navy-700 transition-colors">
                        {item.description}
                      </p>

                      {/* Action Button */}
                      {isLocked ? (
                        <button
                          onClick={() => setShowPurchase(true)}
                          className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-all duration-300 group/btn hover:gap-3"
                        >
                          <Lock className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                          <span>Unlock with purchase</span>
                        </button>
                      ) : item.fileUrl ? (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-all duration-300 group/btn hover:gap-3 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100"
                        >
                          {activeTab === "videos" ? (
                            <>
                              <Play className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                              <span>Watch Now</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                              <span>Download</span>
                            </>
                          )}
                        </a>
                      ) : (
                        <span className="text-xs text-navy-400 italic">Coming soon...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="text-5xl sm:text-6xl mb-4 animate-float">📚</div>
              <p className="text-navy-500 font-medium mb-2">No materials available</p>
              <p className="text-navy-400 text-sm">
                {activeTab === "pastPapers" ? "Past papers" : activeTab} will be available soon.
              </p>
            </div>
          )}
        </div>

        {/* Premium CTA */}
        {!hasAccess && (
          <div className="mt-12 sm:mt-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-2xl opacity-90" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 rounded-2xl text-center">
              <div className="flex justify-center mb-6">
                <Sparkles className="w-8 h-8 text-gold-400 animate-subtle-bounce" />
              </div>

              <h3 className="text-2xl sm:text-4xl font-bold font-serif text-white mb-3">
                Unlock All <span className="text-gradient-gold">Premium Materials</span>
              </h3>
              <p className="text-white/70 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
                Get lifetime access to comprehensive notes, past papers, interactive quizzes, video lectures, and expert guidance tailored to your learning style.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-5 h-5 rounded-full bg-teal-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                  Lifetime access
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-5 h-5 rounded-full bg-teal-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                  Expert support
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-5 h-5 rounded-full bg-teal-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                  Money-back guarantee
                </div>
              </div>

              <button
                onClick={() => setShowPurchase(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-teal-500/40 hover:shadow-teal-500/60 transform hover:scale-105 btn-glow group"
              >
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:translate-y-[-2px]" />
                <span>Purchase for PKR {course.fee.toLocaleString()}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <CoursePurchaseModal
        courseId={course._id}
        courseName={course.name}
        courseIcon={course.icon}
        courseLevel={course.level}
        courseInstructor={course.instructor}
        courseDescription={course.description}
        courseFee={course.fee}
        open={showPurchase}
        onClose={() => setShowPurchase(false)}
      />
    </main>
  );
}