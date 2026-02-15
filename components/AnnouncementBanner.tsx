"use client";

export default function AnnouncementBanner() {
  return (
    <div className="bg-linear-to-r from-gold-400 via-gold-300 to-gold-400 animate-shimmer text-navy-900">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold">
        <span className="animate-pulse">🎓</span>
        <span>
          New Batch Starting March 2026 — Register Now &amp; Get 15% Early Bird
          Discount!
        </span>
        <span className="animate-pulse">🎓</span>
      </div>
    </div>
  );
}
