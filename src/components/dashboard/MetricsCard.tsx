import React from "react";
import { Card } from "../ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  variant = "default",
}) => {
  const variantClasses = {
    default: "border-l-4 border-l-primary-500",
    success: "border-l-4 border-l-secondary-500",
    warning: "border-l-4 border-l-yellow-500",
    danger: "border-l-4 border-l-accent-500",
  };

  const changeIcon = {
    positive: <TrendingUp className="w-4 h-4 text-secondary-600" />,
    negative: <TrendingDown className="w-4 h-4 text-accent-600" />,
    neutral: <Minus className="w-4 h-4 text-gray-400" />,
  };

  const changeColor = {
    positive: "text-secondary-600",
    negative: "text-accent-600",
    neutral: "text-gray-500",
  };

  return (
    <Card className={variantClasses[variant]}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {/* Animação de moeda subindo apenas para Lucro Total */}
            {title.toLowerCase().includes("lucro") && (
              <span className="relative inline-block h-7 w-7">
                <svg
                  className="absolute bottom-0 left-0 animate-coin-bounce"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="14"
                    cy="14"
                    rx="13"
                    ry="13"
                    fill="#FFD700"
                    stroke="#F6C700"
                    strokeWidth="2"
                  />
                  <ellipse cx="14" cy="14" rx="8" ry="8" fill="#FFF8DC" />
                  <text
                    x="14"
                    y="18"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#F6C700"
                  >
                    $
                  </text>
                </svg>
              </span>
            )}
          </div>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {changeIcon[changeType]}
              <span
                className={`text-sm font-medium ml-1 ${changeColor[changeType]}`}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
