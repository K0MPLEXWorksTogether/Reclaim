import { Shield, Lock, Eye, Server } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your data is encrypted before it leaves your device. Only you can read it.",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Architecture",
    description:
      "We can't see your habits, journals, or any personal data. Ever.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Built on enterprise-grade security with regular audits and compliance.",
  },
];

export function SecuritySection() {
  return (
    <section
      id="security"
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-reggae-green-light rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-reggae-gold-light rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reggae-blue-light border border-reggae-blue/20 mb-6">
                <Shield className="w-4 h-4 text-reggae-blue" />
                <span className="text-sm font-medium text-reggae-blue">
                  Privacy First
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
                Your Privacy is <span className="text-reggae-blue">Sacred</span>
              </h2>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                In a world of data breaches and surveillance, HabitRoots stands
                different. Your personal journey deserves absolute privacy.
              </p>

              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-reggae-blue-light border border-reggae-blue/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-reggae-blue" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
              <div className="reggae-card p-8 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-reggae flex items-center justify-center mx-auto mb-6 animate-float shadow-glow">
                  <Shield className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">
                  Military-Grade Security
                </h3>
                <p className="text-muted-foreground mb-6">
                  Encryption protects every piece of your data
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-reggae-green font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Encrypted & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
