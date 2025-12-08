import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reggae-card p-8 md:p-16 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-warm opacity-50" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Start Free Today</span>
              </div>

              <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
                Ready to Transform Your{" "}
                <span className="text-gradient-reggae">Daily Routine?</span>
              </h2>

              <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of people who have already started their journey
                to better habits. Your future self will thank you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-14 font-semibold text-lg bg-primary hover:bg-primary/90 shadow-soft group"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
