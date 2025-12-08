import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-hero">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-reggae-gold-light rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-reggae-green-light rounded-full blur-3xl opacity-40" />
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-reggae-red-light rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reggae-gold-light border border-reggae-gold/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-reggae-gold" />
            <span className="text-sm font-medium text-foreground">
              End-to-End Encrypted
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Grow Your Habits,{" "}
            <span className="text-gradient-reggae">Root Your Life</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            A soothing habit tracker that helps you build positive routines,
            break addictions, and reflect through journaling—all with complete
            privacy.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              className="rounded-full px-8 h-12 font-semibold bg-primary hover:bg-primary/90 shadow-soft group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 font-semibold border-2"
            >
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-center">
              <div className="font-display font-bold text-3xl md:text-4xl text-reggae-green mb-1">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-3xl md:text-4xl text-reggae-gold mb-1">
                1M+
              </div>
              <div className="text-sm text-muted-foreground">
                Habits Tracked
              </div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-3xl md:text-4xl text-reggae-red mb-1">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
