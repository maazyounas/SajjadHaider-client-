"use client";

import { useState, FormEvent } from "react";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  MapPin,
  Loader2,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const classTypes = [
  {
    id: "consultation",
    label: "Free Consultation",
    description: "30-min introductory session to discuss your learning goals",
    duration: "30 min",
  },
  {
    id: "trial",
    label: "Trial Class",
    description: "Full experience class to see if the academy is right for you",
    duration: "60 min",
  },
  {
    id: "regular",
    label: "Regular Class Booking",
    description: "Book a seat in upcoming regular class batches",
    duration: "90 min",
  },
];

export default function AppointmentPage() {
  const [step, setStep] = useState(0);
  const [classType, setClassType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("sh_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers,
        body: JSON.stringify({
          studentName: form.name,
          email: form.email,
          phone: form.phone,
          classType: classType,
          subject: form.subject,
          date,
          time,
          notes: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book appointment");
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen">
        <TopBar />
        <Header />
        <section className="py-20 bg-cream-50">
          <div className="max-w-lg mx-auto px-4 text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold font-serif text-navy-800 mb-4">
              Appointment Booked!
            </h1>
            <p className="text-navy-500 mb-2">
              Your{" "}
              {classTypes.find((c) => c.id === classType)?.label || "appointment"}{" "}
              has been scheduled.
            </p>
            <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-navy-100 shadow-sm my-4">
              <span className="flex items-center gap-1.5 text-navy-600 text-sm">
                <Calendar className="w-4 h-4 text-teal-500" />
                {date}
              </span>
              <span className="flex items-center gap-1.5 text-navy-600 text-sm">
                <Clock className="w-4 h-4 text-teal-500" />
                {time}
              </span>
            </div>
            <p className="text-sm text-navy-400 mt-4">
              We&apos;ll send a confirmation email with all the details shortly.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <TopBar />
      <Header />

      <section className="py-20 bg-cream-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-navy-800 mb-4">
              Book an{" "}
              <span className="text-gradient-gold">Appointment</span>
            </h1>
            <p className="text-navy-500 max-w-xl mx-auto">
              Schedule a consultation, trial class, or regular class booking at
              our campus.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {["Class Type", "Date & Time", "Your Details"].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      i <= step
                        ? "bg-teal-500 text-white"
                        : "bg-navy-100 text-navy-400"
                    )}
                  >
                    {i < step ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-[10px] text-navy-400 mt-1">{label}</span>
                </div>
                {i < 2 && (
                  <div
                    className={cn(
                      "w-16 h-0.5 mx-2",
                      i < step ? "bg-teal-500" : "bg-navy-100"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-8 animate-fade-in-up">
            {/* Step 0 */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-6">
                  Choose Class Type
                </h2>
                <div className="space-y-3">
                  {classTypes.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setClassType(ct.id)}
                      className={cn(
                        "w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-colors",
                        classType === ct.id
                          ? "border-teal-500 bg-teal-50"
                          : "border-navy-100 hover:border-navy-200"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                          classType === ct.id
                            ? "border-teal-500"
                            : "border-navy-300"
                        )}
                      >
                        {classType === ct.id && (
                          <div className="w-3 h-3 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-800">
                          {ct.label}
                        </h3>
                        <p className="text-sm text-navy-500 mt-0.5">
                          {ct.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-teal-600 mt-1">
                          <Clock className="w-3 h-3" /> {ct.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => classType && setStep(1)}
                  disabled={!classType}
                  className="w-full mt-6 py-3 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-6">
                  Select Date & Time
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setTime(slot)}
                          className={cn(
                            "py-2.5 rounded-lg text-sm font-medium transition-colors",
                            time === slot
                              ? "bg-teal-500 text-white"
                              : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 p-3 bg-navy-50 rounded-xl text-sm text-navy-500">
                  <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>
                    Campus: DHA Phase 6, Karachi — or attend online via Zoom
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 border border-navy-200 text-navy-700 font-semibold rounded-xl hover:bg-navy-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => date && time && setStep(2)}
                    disabled={!date || !time}
                    className="flex-1 py-3 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-navy-800 mb-6">
                  Your Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          placeholder="+92 3XX XXXXXXX"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Subject of Interest
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option>IGCSE Economics</option>
                      <option>IGCSE Business Studies</option>
                      <option>AS Economics</option>
                      <option>A2 Economics</option>
                      <option>IGCSE Physics</option>
                      <option>IGCSE Mathematics</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      Additional Notes
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                      placeholder="Any specific questions or requirements…"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-navy-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-navy-800 mb-2">
                    Booking Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm text-navy-600">
                    <div>
                      <span className="text-navy-400 text-xs">Type</span>
                      <p className="font-medium">
                        {classTypes.find((c) => c.id === classType)?.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-navy-400 text-xs">Date</span>
                      <p className="font-medium">{date}</p>
                    </div>
                    <div>
                      <span className="text-navy-400 text-xs">Time</span>
                      <p className="font-medium">{time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-navy-200 text-navy-700 font-semibold rounded-xl hover:bg-navy-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-teal text-white font-semibold rounded-xl hover:opacity-90 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Booking...</> : "Confirm Booking"}
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center mt-3">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
