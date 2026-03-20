import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

// Simple client-side only theme toggle component
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize on client side
  useEffect(() => {
    setMounted(true);
    
    // Get the current theme
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);
  
  // Handle theme toggle
  const toggleTheme = () => {
    if (!mounted) return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply the theme to the document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save the theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  // Don't render anything until mounted (to avoid hydration mismatch)
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white opacity-0"
      >
        <div className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
