"use client";
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const MonthlyPieChart = ({ total = 0 }) => {
  // Placeholder split; replace with real buckets if your API provides them
  const data = useMemo(() => {
    const weights = [1, 1.2, 1.4, 1.6];
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map((w, i) => ({
      name: `Slice ${i + 1}`,
      value: Math.max(0, Math.round((w / sum) * total)),
    }));
  }, [total]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Legend />
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPieChart;
