"use client";

import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const methods = [
  {
    icon: CreditCard,
    title: "Credit / Debit Card",
    description:
      "Pay securely with Visa, Mastercard, or any major card through our encrypted payment gateway.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Smartphone,
    title: "EasyPaisa / JazzCash",
    description:
      "Convenient mobile wallet payments. Send to our registered number and share the screenshot with admin.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Building2,
    title: "Bank Transfer",
    description:
      "Direct bank transfer to our account. Account details will be provided upon course selection.",
    color: "from-purple-500 to-violet-600",
  },
];

export default function PaymentMethods() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div
          ref={ref}
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-navy-800 mb-4">
            Payment <span className="text-gradient-gold">Methods</span>
          </h2>
          <p className="text-navy-500 max-w-2xl mx-auto">
            Multiple secure payment options for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((m, i) => (
            <div
              key={m.title}
              className={cn(
                "card-hover p-6 rounded-2xl bg-white border border-navy-100 shadow-sm text-center transition-all duration-500",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-linear-to-br ${m.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <m.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2">
                {m.title}
              </h3>
              <p className="text-sm text-navy-500 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
