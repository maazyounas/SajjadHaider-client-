"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Download,
  Loader2,
  FileText,
  Film,
  Image as ImageIcon,
  Crown,
  MessageCircle,
  Tag,
  User,
  Presentation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), { ssr: false });
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false });
const ImageViewer = dynamic(() => import("@/components/ImageViewer"), { ssr: false });
const PPTViewer = dynamic(() => import("@/components/PPTViewer"), { ssr: false });


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
interface CourseData {
  _id: string; name: string; slug: string; description: string;
  thumbnail: string; icon: string; tags: string[];
  instructor: string; classId: { _id: string; name: string; slug: string; icon: string };
}

interface MaterialTypeData {
  _id: string; name: string; slug: string; icon: string;
}

interface MaterialData {
  _id: string; materialTypeId: string; title: string; description: string;
  fileUrl: string; fileType: string; fileName: string;
}

interface PremiumContentData {
  _id: string; title: string; description: string; price: number;
  features: { videoCount?: number; pastPaperCount?: number; quizCount?: number; notesCount?: number; otherFeatures?: string[] };
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [materialTypes, setMaterialTypes] = useState<MaterialTypeData[]>([]);
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [premiums, setPremiums] = useState<PremiumContentData[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [viewingMaterial, setViewingMaterial] = useState<MaterialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState<PremiumContentData | null>(null);

  useEffect(() => {
    fetch(`/api/courses/${id}?withMaterials=1`)
      .then(r => r.json())
      .then(data => {
        setCourse(data.course);
        setMaterialTypes(data.materialTypes || []);
        setMaterials(data.materials || []);
        setPremiums(data.premiumContent || []);
        if (data.materialTypes?.length > 0) setActiveTab(data.materialTypes[0]._id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Course Not Found</h1>
          <Link href="/" className="text-teal-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const activeMaterials = materials.filter(m => m.materialTypeId === activeTab);

  const getFileIcon = (type: string) => {
    if (type?.includes("video")) return <Film className="w-5 h-5 text-purple-500" />;
    if (type?.includes("image")) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (type?.includes("presentation") || type?.includes("powerpoint") || ["ppt", "pptx"].some(ext => type?.toLowerCase().includes(ext)))
      return <Presentation className="w-5 h-5 text-orange-600" />;
    return <FileText className="w-5 h-5 text-orange-500" />;
  };

  const isVideo = (type: string) => type?.includes("video");
  const isPDF = (type: string) => type?.includes("pdf") || type?.toLowerCase().endsWith(".pdf");
  const isImage = (type: string) => type?.includes("image") || ["jpg", "jpeg", "png", "gif", "webp"].some(ext => type?.toLowerCase().includes(ext));
  const isPPT = (type: string) => type?.includes("presentation") || type?.includes("powerpoint") || ["ppt", "pptx"].some(ext => type?.toLowerCase().includes(ext));

  const openBuyModal = (premium: PremiumContentData) => {
    setSelectedPremium(premium);
    setShowBuyModal(true);
  };

  const handleDownload = (e: React.MouseEvent, url: string, fileName: string) => {
    e.stopPropagation();
    if (!url) return;

    let downloadUrl = url;
    if (url.includes("cloudinary.com")) {
      downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-navy-50">
      {/* ── Hero Section ── */}
      <div className="relative bg-navy-900 pt-12 sm:pt-14 pb-0">
        {/* Subtle background overlay using the thumbnail */}
        {course.thumbnail && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={course.thumbnail}
              alt=""
              fill
              sizes="100vw"
              className="w-full h-full object-cover opacity-10 blur-sm scale-105"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-b from-navy-950/80 via-navy-900/90 to-navy-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/#subjects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-300 hover:text-teal-200 mb-5 sm:mb-6 px-3 py-1.5 rounded-full border border-teal-400/20 bg-teal-500/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>

          {/* Class badge */}
          {course.classId && (
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 backdrop-blur-md border border-teal-500/20 rounded-full">
                <span className="text-lg">{course.classId.icon}</span>
                <span className="text-teal-300 text-[11px] sm:text-sm font-bold tracking-widest uppercase">
                  {course.classId.name}
                </span>
              </div>
            </div>
          )}

          {/* ── Thumbnail Banner: 80% width, centered ── */}
          {course.thumbnail && (
            <div className="w-full sm:w-4/5 mx-auto relative">
              <div className="relative rounded-t-2xl overflow-hidden shadow-2xl aspect-16/7 sm:aspect-16/6">
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 80vw"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay at bottom so text below feels connected */}
                <div className="absolute inset-0 bg-linear-to-t from-navy-900/60 via-transparent to-transparent" />
                {/* Emoji icon badge */}
                <div className="absolute bottom-3 left-4 sm:bottom-5 sm:left-6 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-2xl sm:text-4xl shadow-2xl border border-white/20">
                  {course.icon}
                </div>
              </div>
            </div>
          )}

          {/* ── Course name + description row (below image) ── */}
          {/* On mobile: stacked. On sm+: name left ~40%, description right ~60% */}
          <div className="w-full sm:w-4/5 mx-auto bg-navy-800/60 backdrop-blur-sm border-x border-b border-white/10 rounded-b-2xl px-4 sm:px-8 py-5 sm:py-7 mb-0">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
              {/* Course name */}
              <div className="sm:w-2/5 shrink-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white tracking-tight leading-tight drop-shadow-xl">
                  {course.name}
                </h1>
                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-2.5 mt-3 sm:mt-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center border-2 border-navy-900 shadow-xl shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold block">Expert Instructor</span>
                      <span className="text-white font-bold text-sm sm:text-base">{course.instructor}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical divider (hidden on mobile) */}
              <div className="hidden sm:block w-px bg-white/10 self-stretch shrink-0" />

              {/* Description */}
              {course.description && (
                <div className="flex-1">
                  <p className="text-white/75 leading-relaxed text-sm sm:text-base">
                    {course.description}
                  </p>
                  {/* Tags */}
                  {course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {course.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-300 text-xs font-bold rounded-lg border border-teal-500/20"
                        >
                          <Tag className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fallback: no thumbnail — use old centered layout */}
          {!course.thumbnail && (
            <div className="pb-10 text-center">
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-3xl bg-white/5 flex items-center justify-center text-5xl sm:text-7xl border-2 border-white/10 shadow-2xl backdrop-blur-md mx-auto mb-6">
                {course.icon}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-serif text-white mb-4">{course.name}</h1>
              {course.description && (
                <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base">{course.description}</p>
              )}
              {course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 justify-center">
                  {course.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-300 text-xs font-bold rounded-lg border border-teal-500/20">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-20 sm:pb-12">
        <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
          {/* Left column — materials */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Material type tabs */}
            {materialTypes.length > 0 && (
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-navy-200">
                {materialTypes.map(mt => (
                  <button
                    key={mt._id}
                    onClick={() => { setActiveTab(mt._id); setViewingMaterial(null); }}
                    className={cn(
                      "snap-start flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                      activeTab === mt._id
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                        : "bg-white text-navy-600 border border-navy-100 hover:border-teal-300 hover:bg-teal-50/50"
                    )}
                  >
                    <span>{mt.icon}</span> {mt.name}
                  </button>
                ))}
              </div>
            )}

            {/* Inline viewer */}
            {viewingMaterial && (
              <div id="material-viewer" className="space-y-3 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-bold text-navy-800 text-sm sm:text-base wrap-break-word">{viewingMaterial.title}</h3>
                  <button
                    onClick={() => setViewingMaterial(null)}
                    className="text-xs text-navy-500 hover:text-navy-700 px-2 py-1 rounded hover:bg-navy-100 self-start sm:self-auto"
                  >
                    Close Viewer
                  </button>
                </div>
                <div className="w-full overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
                  {isVideo(viewingMaterial.fileType) ? (
                    <VideoPlayer src={viewingMaterial.fileUrl} title={viewingMaterial.title} />
                  ) : isPDF(viewingMaterial.fileType) ? (
                    <PDFViewer src={viewingMaterial.fileUrl} title={viewingMaterial.title} />
                  ) : isPPT(viewingMaterial.fileType) ? (
                    <PPTViewer src={viewingMaterial.fileUrl} title={viewingMaterial.title} />
                  ) : isImage(viewingMaterial.fileType) ? (
                    <ImageViewer src={viewingMaterial.fileUrl} title={viewingMaterial.title} />
                  ) : (
                    <div className="p-8 sm:p-10 text-center">
                      <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-navy-100">
                        <FileText className="w-8 h-8 text-navy-400" />
                      </div>
                      <h4 className="text-navy-800 font-bold mb-2">Ready to Study</h4>
                      <p className="text-sm text-navy-500 mb-6 max-w-xs mx-auto">
                        This file format is available for download and offline study.
                      </p>
                      <button
                        onClick={(e) => handleDownload(e, viewingMaterial.fileUrl, viewingMaterial.fileName || viewingMaterial.title)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-teal text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-teal-500/20"
                      >
                        <Download className="w-4 h-4" /> Download Material
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Materials list */}
            {activeMaterials.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                {activeMaterials.map(mat => (
                  <div
                    key={mat._id}
                    className={cn(
                      "group bg-white rounded-2xl border p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                      viewingMaterial?._id === mat._id
                        ? "border-teal-400 ring-4 ring-teal-500/10 shadow-lg"
                        : "border-navy-100 hover:border-teal-300"
                    )}
                    onClick={() => {
                      if (!mat.fileUrl) return;
                      setViewingMaterial(mat);
                      setTimeout(() => {
                        document.getElementById("material-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 100);
                    }}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      viewingMaterial?._id === mat._id
                        ? "bg-teal-500 text-white"
                        : "bg-navy-50 text-navy-600 group-hover:bg-teal-50"
                    )}>
                      {getFileIcon(mat.fileType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-navy-800 text-sm sm:text-base">{mat.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {mat.fileType && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 bg-navy-50 px-1.5 py-0.5 rounded">
                            {mat.fileType.split("/")[1] || "file"}
                          </span>
                        )}
                        {mat.description && (
                          <p className="text-xs text-navy-400 truncate max-w-full sm:max-w-xs">{mat.description}</p>
                        )}
                      </div>
                    </div>

                    {mat.fileUrl && (
                      <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-3 shrink-0 self-stretch sm:self-center">
                        <span className={cn(
                          "w-full sm:w-auto text-center text-xs font-bold px-3 py-2 sm:py-1.5 rounded-lg transition-colors border whitespace-nowrap",
                          viewingMaterial?._id === mat._id
                            ? "bg-teal-500 text-white border-teal-500"
                            : "bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-100"
                        )}>
                          {isVideo(mat.fileType) ? "▶ Play" : isPDF(mat.fileType) ? "📄 View" : isPPT(mat.fileType) ? "📽️ Slides" : isImage(mat.fileType) ? "🖼️ Preview" : "Open"}
                        </span>
                        <button
                          onClick={(e) => handleDownload(e, mat.fileUrl, mat.fileName || mat.title)}
                          className="h-10 w-10 sm:h-auto sm:w-auto p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all border border-orange-100 grid place-items-center"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : materialTypes.length > 0 ? (
              <div className="bg-white rounded-xl border border-navy-100 p-8 sm:p-12 text-center">
                <p className="text-navy-400 text-sm sm:text-base">No materials available in this section yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-navy-100 p-8 sm:p-12 text-center">
                <p className="text-navy-400 text-sm sm:text-base">No materials available for this course yet. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Right column — premium + contact */}
          <div className="space-y-4 sm:space-y-6">
            {premiums.map(p => (
              <div key={p._id} className="bg-white rounded-xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-linear-to-r from-amber-400 to-amber-500 px-4 sm:px-5 py-3 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm sm:text-base">Premium Course</span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-navy-800 mb-1 text-base sm:text-lg">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm text-navy-500 mb-3 line-clamp-2">{p.description}</p>
                  )}
                  <div className="space-y-2 mb-4">
                    {(p.features.videoCount ?? 0) > 0 && (
                      <div className="flex items-center gap-2 text-sm"><span className="text-navy-600">{p.features.videoCount} Video Lectures</span></div>
                    )}
                    {(p.features.pastPaperCount ?? 0) > 0 && (
                      <div className="flex items-center gap-2 text-sm"><span className="text-navy-600">{p.features.pastPaperCount} Past Papers</span></div>
                    )}
                    {(p.features.quizCount ?? 0) > 0 && (
                      <div className="flex items-center gap-2 text-sm"><span className="text-navy-600">{p.features.quizCount} Quizzes</span></div>
                    )}
                    {(p.features.notesCount ?? 0) > 0 && (
                      <div className="flex items-center gap-2 text-sm"><span className="text-navy-600">{p.features.notesCount} Notes</span></div>
                    )}
                    {(p.features.otherFeatures ?? []).map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm"><span className="text-navy-600">{f}</span></div>
                    ))}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">
                    PKR {p.price.toLocaleString()}
                  </div>
                  <button
                    onClick={() => openBuyModal(p)}
                    className="w-full py-3 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 shadow-md transition-all"
                  >
                    Get Premium Access
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <h4 className="font-bold text-navy-800 mb-2">Need Help?</h4>
              <p className="text-sm text-navy-500 mb-4">Reach out to us for any questions about this course.</p>
              <a
                href={buildWhatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <Link
                href="/#contact"
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 border border-navy-200 text-navy-600 text-sm font-semibold rounded-xl hover:bg-navy-50 transition-colors"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && selectedPremium && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-center animate-fade-in-up">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-800 mb-2">{selectedPremium.title}</h3>
            <p className="text-2xl font-bold text-teal-600 mb-4">PKR {selectedPremium.price.toLocaleString()}</p>
            <div className="bg-navy-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-navy-700 mb-2">How to Purchase:</p>
              <ol className="text-sm text-navy-600 space-y-2 list-decimal list-inside">
                <li>Contact us via WhatsApp</li>
                <li>Share the course name and your details</li>
                <li>Complete the payment</li>
                <li>Get instant access to all premium materials</li>
              </ol>
            </div>
            <a
              href={buildWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors mb-3"
            >
              <MessageCircle className="w-5 h-5" /> Contact on WhatsApp
            </a>
            <button onClick={() => setShowBuyModal(false)} className="text-sm text-navy-400 hover:text-navy-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
