import React from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={
        "input-field bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 rounded-md focus:ring-primary-500 focus:border-primary-500 transition-colors " +
        className
      }
      {...props}
    />
  );
};
