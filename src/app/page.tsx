"use client"

import { useAtom } from "jotai";
import { Button } from "@radix-ui/themes";
import Homepage from "@/components/Homepage/Homepage";
import { darkModeAtom } from "@/store"; // Import the atom from the store

export default function Home() {
  const [isDark, setIsDark] = useAtom(darkModeAtom);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);

    // Add smooth transition when toggling dark mode
    document.documentElement.classList.add("transition-all", "duration-500");
    document.documentElement.classList.toggle("dark", !isDark);
  };

  return (
    <div className="min-h-screen w-full">
      <Homepage />

      <Button variant="classic" onClick={toggleTheme}>
        Toggle Dark Mode
      </Button>
    </div>
  );
}
