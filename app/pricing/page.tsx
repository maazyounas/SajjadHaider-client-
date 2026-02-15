"use client";

import Link from "next/link";
import { Check, Star, Zap, Crown } from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "",
    description: "Access basic course materials and resources",
    icon: Zap,
    color: "from-navy-500 to-navy-700",
    popular: false,
    features: [
      "Free notes for all subjects",
      "Selected past papers",
      "Basic quizzes",
      "Community access",
      "Email support",
    ],
    cta: "Get Started",
    href: "/courses",
  },
  {
    name: "Per Course",
    price: "4,999",
    period: "per course",
    description: "Full access to all materials for a single course",
    icon: Star,
    color: "from-teal-500 to-teal-700",
    popular: true,
    features: [
      "Everything in Free",
      "All premium notes",
      "All past papers with solutions",
      "Video lectures",
      "Advanced quizzes",
      "LMS portal access",
      "WhatsApp group access",
      "Priority support",
    ],
    cta: "Choose a Course",
    href: "/courses",
  },
  {
    name: "All Access",
    price: "24,999",
    period: "per year",
    description: "Unlimited access to every course and material",
    icon: Crown,
    color: "from-gold-500 to-gold-700",
    popular: false,
    features: [
      "Everything in Per Course",
      "All subjects included",
      "Unlimited downloads",
      "1-on-1 mentoring sessions",
      "Mock exam reviews",
      "Certificate of completion",
      "Early access to new content",
      "Dedicated support line",
    ],
    cta: "Get All Access",
    href: "/appointment",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Header />

      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-navy-800 mb-4">
              Simple, Transparent{" "}
              <span className="text-gradient-gold">Pricing</span>
            </h1>
            <p className="text-navy-500 max-w-2xl mx-auto text-lg">
              Choose the plan that fits your learning needs. All plans include
              free materials with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl bg-white border shadow-sm overflow-hidden card-hover",
                  plan.popular
                    ? "border-teal-500 shadow-lg shadow-teal-500/10 scale-[1.02]"
                    : "border-navy-100"
                )}
              >
                {plan.popular && (
                  <div className="bg-gradient-teal text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${plan.color} flex items-center justify-center mb-4`}
                  >
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-navy-800 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-navy-400 mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-navy-800">
                      PKR {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-navy-400 text-sm ml-1">
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  <Link
                    href={plan.href}
                    className={cn(
                      "block w-full py-3 rounded-xl font-semibold transition-all text-center",
                      plan.popular
                        ? "bg-gradient-teal text-white hover:opacity-90 shadow-md"
                        : "border-2 border-navy-200 text-navy-700 hover:bg-navy-50"
                    )}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm text-navy-600"
                      >
                        <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
