import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  // Resolve the effective theme (if `system`, consult prefers-color-scheme)
  const resolvedTheme = (() => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light";
    }
    return theme;
  })();

  const sunVisible = resolvedTheme === "light";
  const moonVisible = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative rounded-full w-9 h-9"
    >
      {/* Show sun only on light (use conditional classes so visibility follows resolvedTheme) */}
      <Sun
        className={
          "absolute h-[1.2rem] w-[1.2rem] transition-all text-yellow-500 " +
          (sunVisible
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 pointer-events-none")
        }
      />

      {/* Show moon on dark OR when system preference is dark */}
      <Moon
        className={
          "absolute h-[1.2rem] w-[1.2rem] transition-all text-primary " +
          (moonVisible
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0 pointer-events-none")
        }
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
