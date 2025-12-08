import { UserPlus, Target, TrendingUp, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds with end-to-end encryption protecting your data from day one.",
    color: "reggae-gold",
  },
  {
    number: "02",
    icon: Target,
    title: "Set Your Habits",
    description:
      "Add the habits you want to build or break. Set daily, weekly, or custom frequencies.",
    color: "reggae-green",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Track & Reflect",
    description:
      "Check off completed habits, monitor your streaks, and journal your thoughts.",
    color: "reggae-blue",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Celebrate Growth",
    description:
      "Watch your contribution graph fill up and celebrate the person you're becoming.",
    color: "reggae-red",
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  "reggae-gold": { bg: "bg-reggae-gold", text: "text-primary-foreground" },
  "reggae-green": { bg: "bg-reggae-green", text: "text-primary-foreground" },
  "reggae-blue": { bg: "bg-reggae-blue", text: "text-primary-foreground" },
  "reggae-red": { bg: "bg-reggae-red", text: "text-primary-foreground" },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-reggae-green-light border border-reggae-green/20 mb-6">
            <span className="text-sm font-medium text-reggae-green">
              How It Works
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
            Your Journey to{" "}
            <span className="text-reggae-green">Better Habits</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple steps to transform your daily routine and build lasting
            change.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color];
            return (
              <div
                key={step.number}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}

                <div className="relative bg-card rounded-2xl p-6 border border-border shadow-soft text-center">
                  {/* Number Badge */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4 shadow-soft`}
                  >
                    <step.icon className={`w-8 h-8 ${colors.text}`} />
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground mb-3">
                    Step {step.number}
                  </span>

                  <h3 className="font-display font-semibold text-lg mb-2">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
