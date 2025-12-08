import {
  Plus,
  BarChart3,
  CheckSquare,
  RotateCcw,
  BookOpen,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Plus,
    title: "Habit Creation",
    description:
      "Create and customize habits that align with your goals. Set frequencies, reminders, and track what matters to you.",
    color: "reggae-gold",
  },
  {
    icon: BarChart3,
    title: "Contribution Graph",
    description:
      "Visualize your progress with a beautiful contribution graph. See your consistency grow day by day, week by week.",
    color: "reggae-green",
  },
  {
    icon: CheckSquare,
    title: "Habit Checklist",
    description:
      "Simple daily checklists to mark your habits complete. Satisfying taps that build momentum and keep you motivated.",
    color: "reggae-blue",
  },
  {
    icon: RotateCcw,
    title: "Addiction Tracker",
    description:
      "Track your journey breaking free from addictions. Streak counter with a reset button for honest accountability.",
    color: "reggae-red",
  },
  {
    icon: BookOpen,
    title: "Daily Journal",
    description:
      "Reflect on your day with a private journal. Write your thoughts, celebrate wins, and learn from challenges.",
    color: "reggae-gold",
  },
  {
    icon: Shield,
    title: "E2E Encryption",
    description:
      "Your data is yours alone. End-to-end encryption ensures complete privacy for all your habits and journal entries.",
    color: "reggae-green",
  },
];

const colorClasses: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "reggae-gold": {
    bg: "bg-reggae-gold-light",
    text: "text-reggae-gold",
    border: "border-reggae-gold/20",
  },
  "reggae-green": {
    bg: "bg-reggae-green-light",
    text: "text-reggae-green",
    border: "border-reggae-green/20",
  },
  "reggae-blue": {
    bg: "bg-reggae-blue-light",
    text: "text-reggae-blue",
    border: "border-reggae-blue/20",
  },
  "reggae-red": {
    bg: "bg-reggae-red-light",
    text: "text-reggae-red",
    border: "border-reggae-red/20",
  },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <span className="text-sm font-medium text-secondary-foreground">
              Features
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
            Everything You Need to{" "}
            <span className="text-gradient-reggae">Thrive</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete toolkit for building better habits, breaking bad ones,
            and reflecting on your journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <div
                key={feature.title}
                className="reggae-card p-6 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
