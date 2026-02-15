"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  CreditCard,
  CalendarDays,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  pendingPayments: number;
  recentPayments: { _id: string; user?: { name: string }; course?: { name: string }; amount: number; status: string; createdAt: string }[];
  upcomingAppointments: { _id: string; studentName: string; classType: string; subject: string; date: string; time: string }[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Students", value: stats?.totalStudents ?? 0, icon: Users, color: "from-teal-500 to-teal-600" },
    { label: "Active Courses", value: stats?.activeCourses ?? 0, icon: BookOpen, color: "from-blue-500 to-indigo-600" },
    { label: "Total Revenue", value: `PKR ${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: "from-gold-500 to-gold-600" },
    { label: "Pending Payments", value: stats?.pendingPayments ?? 0, icon: CreditCard, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-navy-100 p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-navy-800">{stat.value}</div>
            <div className="text-xs text-navy-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-navy-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between">
            <h2 className="font-bold text-navy-800">Recent Payments</h2>
            <a href="/admin/payments" className="text-xs text-teal-600 hover:underline font-medium">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-navy-400 border-b border-navy-50">
                  <th className="text-left px-6 py-3 font-medium">Student</th>
                  <th className="text-left px-6 py-3 font-medium">Course</th>
                  <th className="text-right px-6 py-3 font-medium">Amount</th>
                  <th className="text-center px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {(stats?.recentPayments ?? []).map((p) => (
                  <tr key={p._id} className="hover:bg-navy-50/50">
                    <td className="px-6 py-3 text-sm font-medium text-navy-800">{p.user?.name || "N/A"}</td>
                    <td className="px-6 py-3 text-sm text-navy-500">{p.course?.name || "N/A"}</td>
                    <td className="px-6 py-3 text-sm text-right font-medium text-navy-800">PKR {p.amount.toLocaleString()}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === "approved" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(stats?.recentPayments ?? []).length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-navy-400">No payments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-navy-100">
          <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between">
            <h2 className="font-bold text-navy-800">Upcoming Appointments</h2>
            <a href="/admin/appointments" className="text-xs text-teal-600 hover:underline font-medium">View All</a>
          </div>
          <div className="divide-y divide-navy-50">
            {(stats?.upcomingAppointments ?? []).map((apt) => (
              <div key={apt._id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-navy-800">{apt.studentName}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-semibold">{apt.classType}</span>
                </div>
                <div className="text-xs text-navy-400">{apt.subject} • {apt.date} at {apt.time}</div>
              </div>
            ))}
            {(stats?.upcomingAppointments ?? []).length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-navy-400">No upcoming appointments</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-6">
        <h2 className="font-bold text-navy-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Course", href: "/admin/courses", icon: BookOpen },
            { label: "Review Payments", href: "/admin/payments", icon: CreditCard },
            { label: "Manage Users", href: "/admin/users", icon: Users },
            { label: "View Appointments", href: "/admin/appointments", icon: CalendarDays },
          ].map((action) => (
            <a key={action.label} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-navy-100 hover:bg-teal-50 hover:border-teal-200 transition-colors text-center">
              <action.icon className="w-6 h-6 text-teal-500" />
              <span className="text-sm font-medium text-navy-700">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
