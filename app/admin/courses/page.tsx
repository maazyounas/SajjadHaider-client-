"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Eye, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  isActive: boolean;
  resources: {
    notes: unknown[];
    quizzes: unknown[];
    pastPapers: unknown[];
    videos: unknown[];
  };
}

const emptyForm = {
  name: "",
  level: "igcse",
  category: "sciences",
  icon: "📘",
  description: "",
  tags: "",
  fee: 0,
  instructor: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CourseData | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("sh_token") : null;

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter((s) => {
    if (levelFilter !== "all" && s.level !== levelFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (c: CourseData) => {
    setEditing(c);
    setForm({
      name: c.name,
      level: c.level,
      category: c.category,
      icon: c.icon,
      description: c.description,
      tags: c.tags.join(", "),
      fee: c.fee,
      instructor: c.instructor,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const url = editing ? `/api/courses/${editing._id}` : "/api/courses";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save course");
      setShowModal(false);
      fetchCourses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Course Management</h2>
          <p className="text-sm text-navy-400">
            Manage all courses, add new subjects, or update existing ones.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-teal text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["all", "igcse", "as", "a2"].map((l) => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                levelFilter === l
                  ? "bg-navy-800 text-white"
                  : "bg-white text-navy-500 border border-navy-200 hover:bg-navy-50"
              )}
            >
              {l === "all" ? "All" : l === "igcse" ? "IGCSE" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-navy-400 border-b border-navy-100 bg-navy-50/50">
                  <th className="text-left px-6 py-3 font-medium">Course</th>
                  <th className="text-left px-6 py-3 font-medium">Level</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Instructor</th>
                  <th className="text-right px-6 py-3 font-medium">Fee</th>
                  <th className="text-center px-6 py-3 font-medium">Resources</th>
                  <th className="text-center px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((s) => {
                  const totalResources =
                    (s.resources?.notes?.length || 0) +
                    (s.resources?.quizzes?.length || 0) +
                    (s.resources?.pastPapers?.length || 0) +
                    (s.resources?.videos?.length || 0);

                  return (
                    <tr key={s._id} className="hover:bg-navy-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{s.icon}</span>
                          <span className="text-sm font-medium text-navy-800">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white",
                            s.level === "igcse"
                              ? "bg-teal-500"
                              : s.level === "as"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                          )}
                        >
                          {s.level === "igcse" ? "IGCSE" : s.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-navy-500 capitalize">
                        {s.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-navy-600">
                        {s.instructor}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-navy-800">
                        PKR {s.fee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-navy-500">
                        {totalResources}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/courses/${s._id}`}
                            className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(s)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-navy-400 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-navy-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-navy-400 text-center">
        Showing {filtered.length} of {courses.length} courses
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-navy-100">
              <h3 className="text-lg font-bold text-navy-800">
                {editing ? "Edit Course" : "Add New Course"}
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
                <label className="block text-sm font-medium text-navy-700 mb-1">Course Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="e.g. Physics"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  >
                    <option value="igcse">IGCSE</option>
                    <option value="as">AS Level</option>
                    <option value="a2">A2 Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  >
                    <option value="sciences">Sciences</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="humanities">Humanities</option>
                    <option value="languages">Languages</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    placeholder="📘"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Fee (PKR)</label>
                  <input
                    type="number"
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    placeholder="15000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Instructor</label>
                <input
                  type="text"
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="Sir Hamza"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                  placeholder="Course description…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="mechanics, waves, optics"
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
                disabled={saving || !form.name}
                className="px-5 py-2 bg-gradient-teal text-white text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
