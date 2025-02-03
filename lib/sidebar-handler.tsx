"use client";

import { throttle } from "lodash";
import { useEffect } from "react";

export const SidebarHandler = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sidebarWidth = 256,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  sidebarWidth?: number;
}) => {
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      // Открытие при приближении к левому краю
      if (e.clientX <= 10 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }

      // Закрытие при выходе за сайдбар + 60px
      if (isSidebarOpen && e.clientX > sidebarWidth + 60) {
        setIsSidebarOpen(false);
      }
    }, 100);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isSidebarOpen, sidebarWidth, setIsSidebarOpen]);

  return null;
};
