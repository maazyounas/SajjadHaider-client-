"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Edit2, Trash2, Shield, ShieldOff, Loader2, X, Ban, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  subscribedCourses: { _id: string; name: string }[];
  status: "active" | "suspended";
  createdAt: string;
}

const emptyForm = { name: "", email: "", password: "", role: "student" as "student" | "admin" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<UserData | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("sh_token") : null;

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (u: UserData) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        // Update user
        const body: Record<string, string> = { name: form.name, email: form.email, role: form.role };
        if (form.password) body.password = form.password;
        const res = await fetch(`/api/users/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update user");
      } else {
        // Create user via signup API
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user");
        // If role should be admin, update after creation
        if (form.role === "admin" && data.user?._id) {
          await fetch(`/api/users/${data.user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ role: "admin" }),
          });
        }
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = async (u: UserData) => {
    const newRole = u.role === "admin" ? "student" : "admin";
    if (!confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/users/${u._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchUsers();
    } catch {
      alert("Failed to change role");
    }
  };

  const toggleStatus = async (u: UserData) => {
    const newStatus = u.status === "active" ? "suspended" : "active";
    if (!confirm(`${newStatus === "suspended" ? "Suspend" : "Activate"} ${u.name}?`)) return;
    try {
      const res = await fetch(`/api/users/${u._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      fetchUsers();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (u: UserData) => {
    if (!confirm(`Delete user ${u.name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/users/${u._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
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
          <h2 className="text-xl font-bold text-navy-800">User Management</h2>
          <p className="text-sm text-navy-400">
            View and manage registered students and admin accounts.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-teal text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["all", "student", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                roleFilter === r
                  ? "bg-navy-800 text-white"
                  : "bg-white border border-navy-200 text-navy-500 hover:bg-navy-50"
              )}
            >
              {r === "all" ? "All" : r + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-navy-400 border-b border-navy-100 bg-navy-50/50">
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-6 py-3 font-medium">Role</th>
                <th className="text-center px-6 py-3 font-medium">Courses</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-center px-6 py-3 font-medium">Status</th>
                <th className="text-center px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-navy-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-navy-800">
                          {u.name}
                        </div>
                        <div className="text-xs text-navy-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-navy-600">
                    {u.subscribedCourses?.length || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-navy-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-navy-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleRole(u)}
                        className="p-2 hover:bg-purple-50 rounded-lg text-navy-400 hover:text-purple-600"
                        title={u.role === "admin" ? "Demote to student" : "Promote to admin"}
                      >
                        {u.role === "admin" ? (
                          <ShieldOff className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleStatus(u)}
                        className={cn(
                          "p-2 rounded-lg",
                          u.status === "active"
                            ? "hover:bg-yellow-50 text-navy-400 hover:text-yellow-600"
                            : "hover:bg-green-50 text-navy-400 hover:text-green-600"
                        )}
                        title={u.status === "active" ? "Suspend" : "Activate"}
                      >
                        {u.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-2 hover:bg-red-50 rounded-lg text-navy-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-navy-400 text-center">
        {filtered.length} user(s) found
      </p>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-navy-100">
              <h3 className="text-lg font-bold text-navy-800">
                {editing ? "Edit User" : "Add New User"}
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
                <label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Password {editing ? "(leave blank to keep current)" : ""}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder={editing ? "••••••••" : "Min 6 characters"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as "student" | "admin" })}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
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
                disabled={saving || !form.name || !form.email || (!editing && !form.password)}
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
