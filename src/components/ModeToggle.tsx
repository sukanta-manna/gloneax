/********************************************************************* 
Author: Sukanta Manna  
Purpose: Mode toggle.
**********************************************************************/
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Add this type declaration at the top of your file
declare global {
  interface Window {
    setTheme?: (theme: "light" | "dark") => void;
  }
}

export function ModeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);

    if (typeof window.setTheme === "function") {
      window.setTheme(nextTheme);
    } else {
      localStorage.setItem("theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
}