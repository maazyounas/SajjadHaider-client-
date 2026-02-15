import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import SubjectsSection from "@/components/SubjectsSection";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

export default function CoursesPage() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Header />
      <SubjectsSection />
      <Footer />
      <FloatingElements />
    </main>
  );
}
