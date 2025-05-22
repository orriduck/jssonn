"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally render a placeholder or nothing
    return (
      <Button
        className="rounded-md p-2"
        aria-label="Toggle theme"
        style={{ width: 32, height: 32 }}
      />
    );
  }

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative rounded-md p-2 hover:bg-accent flex items-center justify-center"
      aria-label="Toggle theme"
      style={{ width: 32, height: 32 }}
      variant="ghost"
      size="icon"
    >
      <Sun
        className={
          "h-5 w-5 transition-all absolute" +
          (theme === "dark" ? " opacity-0 scale-0" : " opacity-100 scale-100")
        }
        aria-hidden={theme === "dark"}
      />
      <Moon
        className={
          "h-5 w-5 transition-all absolute" +
          (theme === "light" ? " opacity-0 scale-0" : " opacity-100 scale-100")
        }
        aria-hidden={theme === "light"}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
