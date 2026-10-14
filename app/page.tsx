import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import WhyVitalyzer from "@/components/WhyVitalyzer";
import Testimonials from "@/components/Testimonials";
import WorksWith from "@/components/WorksWith";
import Capabilities from "@/components/Capabilities";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Statement />
        <WhyVitalyzer />
        <Testimonials />
        <WorksWith />
        <Capabilities />
      </main>
    </>
  );
}