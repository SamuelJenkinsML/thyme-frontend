import { FloatingParticles } from "@/components/landing/floating-particles";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <FloatingParticles />
      <Navbar />
      <div className="relative z-10">{children}</div>
      <Footer />
    </div>
  );
}
