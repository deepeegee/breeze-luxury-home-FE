"use client";
import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const WeeklyLineChart = ({ total = 0 }) => {
  const data = useMemo(() => {
    const weights = [0.9, 1, 1.1, 0.95, 1.2, 1.6, 2]; // favor recent days
    const sum = weights.reduce((a, b) => a + b, 0);
    const values = weights.map((w) => Math.round((w / sum) * total));
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return labels.map((name, i) => ({ name, views: values[i] }));
  }, [total]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyLineChart;
