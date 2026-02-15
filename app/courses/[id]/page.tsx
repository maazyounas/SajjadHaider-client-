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
  { key: "notes", label: "Notes", icon: BookOpen },
  { key: "quizzes", label: "Quizzes", icon: Brain },
  { key: "pastPapers", label: "Past Papers", icon: FileText },
  { key: "videos", label: "Videos", icon: Play },
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
      <main className="min-h-screen">
        <TopBar />
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-navy-800 mb-4">
            Course Not Found
          </h1>
          <p className="text-navy-500 mb-6">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:opacity-90"
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

  return (
    <main className="min-h-screen bg-cream-50">
      <TopBar />
      <Header />

      <div className={`bg-linear-to-r ${categoryColors[course.category]} py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">{course.icon}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase text-white">
                  {course.level === "igcse" ? "IGCSE" : course.level.toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-2">{course.name}</h1>
              <p className="text-white/80 max-w-xl">{course.description}</p>
              <div className="flex items-center gap-4 mt-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{course.instructor}</span>
                <span>{levelLabels[course.level]}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 min-w-60">
              <div className="text-sm text-white/70 mb-1">Course Fee</div>
              <div className="text-3xl font-bold text-white mb-3">PKR {course.fee.toLocaleString()}</div>
              {hasAccess ? (
                <div className="flex items-center gap-2 text-green-300 text-sm font-medium"><Unlock className="w-4 h-4" />Full Access Granted</div>
              ) : (
                <button onClick={() => setShowPurchase(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-white text-navy-800 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                  <ShoppingCart className="w-4 h-4" />Purchase Course
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm border border-navy-100">
          {tabConfig.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.key ? "bg-teal-500 text-white shadow-md" : "text-navy-500 hover:bg-navy-50")}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((item: Material) => {
            const isLocked = item.type === "premium" && !hasAccess;
            return (
              <div key={item._id} className={cn("p-5 rounded-xl border bg-white transition-all", isLocked ? "border-navy-100 opacity-75" : "border-navy-100 card-hover")}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-navy-800">{item.title}</h3>
                  {item.type === "free" ? (
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">FREE</span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-gold-100 text-gold-700 text-xs font-bold rounded-full flex items-center gap-1">
                      {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}PREMIUM
                    </span>
                  )}
                </div>
                <p className="text-sm text-navy-500 mb-3">{item.description}</p>
                {isLocked ? (
                  <button onClick={() => setShowPurchase(true)} className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700">
                    <Lock className="w-3.5 h-3.5" />Unlock with purchase
                  </button>
                ) : item.fileUrl ? (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700">
                    {activeTab === "videos" ? <><ExternalLink className="w-3.5 h-3.5" />Watch Now</> : <><Download className="w-3.5 h-3.5" />Download</>}
                  </a>
                ) : (
                  <span className="text-xs text-navy-400 italic">File not yet uploaded</span>
                )}
              </div>
            );
          })}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12 text-navy-400">
            <p>No {activeTab === "pastPapers" ? "past papers" : activeTab} available yet.</p>
          </div>
        )}

        {!hasAccess && (
          <div className="mt-10 p-8 rounded-2xl bg-gradient-navy text-white text-center">
            <h3 className="text-2xl font-bold font-serif mb-3">Unlock All Premium Materials</h3>
            <p className="text-white/70 max-w-lg mx-auto mb-6">Get lifetime access to all notes, past papers, video lectures, and quizzes for this course.</p>
            <button onClick={() => setShowPurchase(true)} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 shadow-lg">
              <ShoppingCart className="w-5 h-5" />Purchase for PKR {course.fee.toLocaleString()}
            </button>
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
