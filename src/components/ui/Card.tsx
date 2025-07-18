import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const base =
    "rounded-xl shadow-premium p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors";
  const outlined =
    "border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-900";
  return (
    <div
      className={
        base +
        (variant === "outlined" ? " " + outlined : "") +
        (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </div>
  );
};
