import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HeroSection from "@/components/HeroSection";
import FeaturesStrip from "@/components/FeaturesStrip";
import SubjectsSection from "@/components/SubjectsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import PaymentMethods from "@/components/PaymentMethods";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Header />
      <AnnouncementBanner />
      <HeroSection />
      <SubjectsSection />
      <FeaturesStrip />
      
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
      <PaymentMethods />
      <FAQSection />
      <Footer />
      <FloatingElements />
    </main>
  );
}
