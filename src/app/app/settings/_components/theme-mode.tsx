"use client";
import { useTheme } from "next-themes";

type Theme = "system" | "light" | "dark";

const ThemeMode = ({ themeMode }: { themeMode: Theme }) => {
  const { setTheme, theme } = useTheme();
  return(
    <div className="h-80 w-full">
    </div>
  )
};
