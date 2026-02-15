"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  FileText,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  X,
  Upload,
  Loader2,
  Video,
  FileQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Material {
  _id: string;
  title: string;
  description: string;
  type: "free" | "premium";
  fileUrl?: string;
  filePublicId?: string;
  fileType?: string;
}

interface CourseData {
  _id: string;
  name: string;
  icon: string;
  level: string;
  resources: {
    notes: Material[];
    quizzes: Material[];
    pastPapers: Material[];
    videos: Material[];
  };
}

const emptyMaterialForm = {
  title: "",
  description: "",
  type: "free" as "free" | "premium",
};

export default function AdminMaterialsPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tab, setTab] = useState<"notes" | "quizzes" | "pastPapers" | "videos">("notes");

  // Upload modal state
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [form, setForm] = useState(emptyMaterialForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("sh_token") : null;

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      const list: CourseData[] = data.courses || [];
      setCourses(list);
      if (!selectedCourse && list.length > 0) setSelectedCourse(list[0]._id);
    } catch {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const course = courses.find((c) => c._id === selectedCourse);
  const materials: Material[] = course?.resources?.[tab] || [];

  const openAdd = () => {
    setEditingMaterial(null);
    setForm(emptyMaterialForm);
    setFile(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (m: Material) => {
    setEditingMaterial(m);
    setForm({ title: m.title, description: m.description, type: m.type });
    setFile(null);
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    setError("");
    try {
      let fileUrl = editingMaterial?.fileUrl || "";
      let filePublicId = editingMaterial?.filePublicId || "";
      let fileType = editingMaterial?.fileType || "";

      // Upload file if provided
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", `courses/${course._id}/${tab}`);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        fileUrl = uploadData.url;
        filePublicId = uploadData.publicId;
        fileType = uploadData.resourceType || "raw";
      }

      const body = {
        ...form,
        fileUrl: fileUrl || undefined,
        filePublicId: filePublicId || undefined,
        fileType: fileType || undefined,
        category: tab,
      };

      if (editingMaterial) {
        // Update
        const res = await fetch(`/api/courses/${course._id}/materials/${editingMaterial._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update");
      } else {
        // Add new
        const res = await fetch(`/api/courses/${course._id}/materials`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add material");
      }

      setShowModal(false);
      fetchCourses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!course || !confirm("Delete this material?")) return;
    try {
      const res = await fetch(`/api/courses/${course._id}/materials/${materialId}?category=${tab}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      fetchCourses();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const iconForType = (fileType?: string) => {
    if (fileType === "video") return <Video className="w-5 h-5 text-navy-400" />;
    if (fileType === "image") return <FileQuestion className="w-5 h-5 text-navy-400" />;
    return <FileText className="w-5 h-5 text-navy-400" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Material Management</h2>
          <p className="text-sm text-navy-400">
            Upload, edit, and organize course materials — free and premium.
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={!course}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-teal text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Upload Material
        </button>
      </div>

      {/* Subject selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white"
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.icon} {c.name} ({c.level === "igcse" ? "IGCSE" : c.level.toUpperCase()})
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {(["notes", "quizzes", "pastPapers", "videos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                tab === t
                  ? "bg-navy-800 text-white"
                  : "bg-white border border-navy-200 text-navy-500 hover:bg-navy-50"
              )}
            >
              {t === "pastPapers" ? "Past Papers" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Materials list */}
      <div className="bg-white rounded-xl border border-navy-100 divide-y divide-navy-50">
        {materials.length === 0 ? (
          <div className="px-6 py-12 text-center text-navy-400 text-sm">
            No materials in this category yet. Click &quot;Upload Material&quot; to add one.
          </div>
        ) : (
          materials.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-navy-50/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center">
                  {iconForType(item.fileType)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-navy-800">{item.title}</h3>
                  <p className="text-xs text-navy-400">{item.description}</p>
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:underline"
                    >
                      View file ↗
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                    item.type === "free"
                      ? "bg-green-100 text-green-700"
                      : "bg-gold-100 text-gold-700"
                  )}
                >
                  {item.type === "free" ? (
                    <Unlock className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {item.type}
                </span>
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-navy-400 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-navy-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-sm text-navy-400 text-center">
        {materials.length} item(s) in {tab === "pastPapers" ? "Past Papers" : tab}
      </p>

      {/* Upload / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-navy-100">
              <h3 className="text-lg font-bold text-navy-800">
                {editingMaterial ? "Edit Material" : "Upload Material"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-navy-100 rounded-lg">
                <X className="w-5 h-5 text-navy-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="Chapter 1 Notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="Covers kinematics and dynamics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Access Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "free" | "premium" })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  File {editingMaterial ? "(optional, replaces existing)" : ""}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-navy-200 rounded-xl cursor-pointer hover:border-teal-400 transition-colors"
                >
                  <Upload className="w-5 h-5 text-navy-400" />
                  <span className="text-sm text-navy-500">
                    {file ? file.name : "Click to select file"}
                  </span>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-navy-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-navy-600 hover:bg-navy-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="px-5 py-2 bg-gradient-teal text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingMaterial ? "Update" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
