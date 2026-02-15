"use client";

import {
  Award,
  Star,
  Monitor,
  HeadphonesIcon,
  FileCheck,
  Globe,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Award,
    title: "Cambridge Examiner Insight",
    description:
      "Our faculty includes experienced Cambridge examiners who provide insider knowledge on exam techniques and marking criteria.",
    color: "from-teal-400 to-teal-600",
  },
  {
    icon: Star,
    title: "95% A*/A Success Rate",
    description:
      "Consistent outstanding results with the majority of students achieving A* and A grades across all subjects.",
    color: "from-gold-400 to-gold-600",
  },
  {
    icon: Monitor,
    title: "Online + In-Person",
    description:
      "Flexible learning options — attend classes physically at our campus or join live online sessions from anywhere.",
    color: "from-blue-400 to-indigo-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Student Support",
    description:
      "Round-the-clock academic support through WhatsApp groups, forums, and one-on-one doubt-clearing sessions.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: FileCheck,
    title: "Original Materials",
    description:
      "Proprietary course materials, revision guides, and practice papers crafted specifically for Cambridge syllabi.",
    color: "from-orange-400 to-red-500",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Join a community of 15,000+ alumni studying at top universities worldwide, including Oxbridge and Ivy League.",
    color: "from-emerald-400 to-green-600",
  },
];

export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4">
        <div
          ref={ref}
          className={cn(
            "text-center mb-14 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-navy-800 mb-4">
            Why Choose <span className="text-gradient-gold">SH Academy</span>
          </h2>
          <p className="text-navy-500 max-w-2xl mx-auto">
            Discover what sets us apart and why families across Pakistan trust us
            with their children&apos;s academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "card-hover p-6 rounded-2xl bg-white border border-navy-100 shadow-sm transition-all duration-500",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center mb-4 shadow-md`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-navy-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
