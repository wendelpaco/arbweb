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
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
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
