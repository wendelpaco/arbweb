import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";

interface ProfitChartProps {
  data: {
    date: string;
    profit: number;
  }[];
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p
            className={`text-sm font-bold ${
              payload[0].value >= 0 ? "text-secondary-600" : "text-accent-600"
            }`}
          >
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })
            }
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#059669"
            strokeWidth={3}
            dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: "#059669",
              strokeWidth: 2,
              fill: "#ffffff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
