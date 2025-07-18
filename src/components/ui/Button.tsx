import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "md",
  loading = false,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };
  const variants = {
    default:
      "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 border border-primary-600 dark:border-primary-700",
    outline:
      "bg-transparent text-primary-700 border border-primary-500 hover:bg-primary-50 dark:text-primary-200 dark:border-primary-400 dark:hover:bg-gray-800",
    danger:
      "bg-accent-600 text-white hover:bg-accent-700 border border-accent-600",
  };
  return (
    <button
      className={
        base +
        " " +
        sizes[size] +
        " " +
        variants[variant] +
        (className ? " " + className : "")
      }
      {...props}
      disabled={loading || props.disabled}
    >
      {loading && (
        <svg
          className="animate-spin mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
