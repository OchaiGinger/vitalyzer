import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import WhyVitalyzer from "@/components/WhyVitalyzer";
import Testimonials from "@/components/Testimonials";
import WorksWith from "@/components/WorksWith";
import Capabilities from "@/components/Capabilities";
import Performance from "@/components/Performance";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
        <Performance />
        <Stats />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}