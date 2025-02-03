import { clsx, type ClassValue } from "clsx";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useImageLogo() {
  const { theme } = useTheme();
  const logoSrc = theme === "light" ? "/logo-white.jpg" : "/logo-2.svg";
  return logoSrc;
}

export function truncateContent(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength);
}
