import { CTASection } from "@/components/home(401)/cta";
import { Features } from "@/components/home(401)/features";

import { Footer } from "@/components/home(401)/footer";
import { HeroSection } from "@/components/home(401)/hero";
import { HowItWorks } from "@/components/home(401)/howitworks";
import { Navbar } from "@/components/home(401)/navbar";

function Home() {
  return (
    <div className="bg-background">
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Home;
