"use client";
import { useEffect } from "react";

export default function useThemeByHour() {
  useEffect(() => {
    const hour = new Date().getHours();
    const isDark = hour >= 19 || hour < 7; // 19:00 - 06:59
    document.body.classList.add(isDark ? "dark-theme" : "light-theme");

    // cleanup: remover clases al desmontar
    return () => {
      document.body.classList.remove("dark-theme", "light-theme");
    };
  }, []);
}
