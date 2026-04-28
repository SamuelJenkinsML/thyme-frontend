import type { Metadata } from "next";
import { CTASection } from "@/components/landing/cta-section";
import { SolutionsIndex } from "@/components/solutions/solutions-index";

export const metadata: Metadata = {
  title: "Solutions - Thyme",
  description:
    "Real-world teams using Thyme for fraud detection, price anomaly detection, travel personalization, and more.",
};

export default function SolutionsPage() {
  return (
    <>
      <SolutionsIndex />
      <CTASection />
    </>
  );
}
