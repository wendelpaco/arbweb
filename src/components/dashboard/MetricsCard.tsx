import React from "react";
import { Card } from "../ui/Card";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  tooltip?: string;
  variant?: "default" | "success" | "warning" | "danger";
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  tooltip,
  variant = "default",
  loading = false,
}) => {
  const variantClasses = {
    default: "border-l-4 border-l-primary/70",
    success: "border-l-4 border-l-emerald-500",
    warning: "border-l-4 border-l-yellow-500",
    danger: "border-l-4 border-l-rose-500",
  };

  const changeIcon = {
    positive: (
      <TrendingUp className="w-4 h-4 text-emerald-500 animate-bounce" />
    ),
    negative: <TrendingDown className="w-4 h-4 text-rose-500 animate-bounce" />,
    neutral: <Minus className="w-4 h-4 text-muted-foreground" />,
  };

  const changeColor = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-rose-600 dark:text-rose-400",
    neutral: "text-muted-foreground",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            tabIndex={0}
            className={`group relative flex items-center justify-between gap-2 rounded-2xl border bg-card text-card-foreground shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 hover:shadow-lg hover:-translate-y-1 ${variantClasses[variant]} px-6 py-5 min-h-[110px] cursor-pointer`}
            aria-label={tooltip || title}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1 truncate">
                {title}
              </p>
              <div className="flex items-center space-x-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={String(value)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
                  >
                    {loading ? (
                      <span className="inline-block w-20 h-6 bg-muted animate-pulse rounded" />
                    ) : (
                      value
                    )}
                  </motion.p>
                </AnimatePresence>
                {/* Animação de moeda subindo para Lucro Total */}
                {title.toLowerCase().includes("lucro") && !loading && (
                  <motion.span
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative inline-block h-7 w-7"
                  >
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
                  </motion.span>
                )}
              </div>
              {change !== undefined && !loading && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center mt-2"
                >
                  {changeIcon[changeType]}
                  <span
                    className={`ml-1 text-xs font-semibold rounded-full px-2 py-0.5 bg-muted/60 ${changeColor[changeType]} animate-fadeIn`}
                  >
                    {change > 0 ? "+" : ""}
                    {change}%
                  </span>
                </motion.div>
              )}
            </div>
            {icon && (
              <div className="flex-shrink-0 ml-4">
                <div className="w-11 h-11 bg-muted rounded-xl flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-200">
                  {icon}
                </div>
              </div>
            )}
          </Card>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent side="top" className="max-w-xs">
            {tooltip}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
