import React from "react";
import { clsx } from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

    const variantClasses = {
      default:
        "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
      filled:
        "border-gray-300 bg-gray-50 focus:ring-primary-500 focus:border-primary-500 focus:bg-white",
    };

    const errorClasses =
      "border-accent-500 focus:ring-accent-500 focus:border-accent-500";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              baseClasses,
              variantClasses[variant],
              error && errorClasses,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-accent-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
