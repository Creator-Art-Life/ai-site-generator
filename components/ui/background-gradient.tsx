"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0% 0%",
    },
    animate: {
      backgroundPosition: ["0% 0%", "10% 10%", "0% 0%"],
    },
  };

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "200% 200%" : undefined,
        }}
        className={cn(
          "absolute top-0 left-0 w-1/4 h-1/2 rounded-tl-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0%_0%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_10%_10%,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_5%_5%,#ffc414,transparent)]"
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
