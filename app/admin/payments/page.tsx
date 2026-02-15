"use client";

import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  course: { _id: string; name: string } | null;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  screenshotUrl?: string;
  adminNote?: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("sh_token") : null;

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayments(data.payments || []);
    } catch {
      console.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (
      search &&
      !(p.user?.name || "").toLowerCase().includes(q) &&
      !p._id.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
      setSelectedPayment(null);
      fetchPayments();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading("");
    }
  };

  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const approvedCount = payments.filter((p) => p.status === "approved").length;
  const totalRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-800">Payment Management</h2>
        <p className="text-sm text-navy-400">
          Review, approve, or reject payment requests and manage LMS access.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-navy-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy-800">{pendingCount}</div>
            <div className="text-xs text-navy-400">Pending Review</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy-800">{approvedCount}</div>
            <div className="text-xs text-navy-400">Approved</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy-800">
              PKR {totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-navy-400">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search by student or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                statusFilter === s
                  ? "bg-navy-800 text-white"
                  : "bg-white border border-navy-200 text-navy-500 hover:bg-navy-50"
              )}
            >
              {s === "all" ? "All" : s}
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
                <th className="text-left px-6 py-3 font-medium">Student</th>
                <th className="text-left px-6 py-3 font-medium">Course</th>
                <th className="text-left px-6 py-3 font-medium">Method</th>
                <th className="text-right px-6 py-3 font-medium">Amount</th>
                <th className="text-center px-6 py-3 font-medium">Date</th>
                <th className="text-center px-6 py-3 font-medium">Status</th>
                <th className="text-center px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-navy-50/50">
                  <td className="px-6 py-3">
                    <div className="text-sm font-medium text-navy-800">
                      {p.user?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-navy-400">{p.user?.email}</div>
                  </td>
                  <td className="px-6 py-3 text-sm text-navy-600">
                    {p.course?.name || "Deleted Course"}
                  </td>
                  <td className="px-6 py-3 text-sm text-navy-500 capitalize">{p.method}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-navy-800">
                    PKR {p.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center text-sm text-navy-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        p.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAction(p._id, "approved")}
                            disabled={actionLoading === p._id}
                            className="p-2 hover:bg-green-50 rounded-lg text-green-500 hover:text-green-700 disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(p._id, "rejected")}
                            disabled={actionLoading === p._id}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedPayment(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-navy-800 mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Student", selectedPayment.user?.name || "Unknown"],
                ["Email", selectedPayment.user?.email || "—"],
                ["Course", selectedPayment.course?.name || "—"],
                ["Method", selectedPayment.method],
                ["Amount", `PKR ${selectedPayment.amount.toLocaleString()}`],
                ["Date", new Date(selectedPayment.createdAt).toLocaleDateString()],
                ["Status", selectedPayment.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-navy-400">{label}</span>
                  <span className="font-medium text-navy-800 capitalize">{value}</span>
                </div>
              ))}
            </div>

            {/* Screenshot preview */}
            {selectedPayment.screenshotUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-navy-700 mb-2">Payment Screenshot</p>
                <a
                  href={selectedPayment.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-teal-600 text-sm hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Screenshot
                </a>
              </div>
            )}

            {selectedPayment.status === "pending" && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleAction(selectedPayment._id, "approved")}
                  disabled={actionLoading === selectedPayment._id}
                  className="flex-1 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-50"
                >
                  Approve &amp; Grant Access
                </button>
                <button
                  onClick={() => handleAction(selectedPayment._id, "rejected")}
                  disabled={actionLoading === selectedPayment._id}
                  className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full mt-3 py-2.5 border border-navy-200 text-navy-700 font-semibold rounded-xl hover:bg-navy-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
