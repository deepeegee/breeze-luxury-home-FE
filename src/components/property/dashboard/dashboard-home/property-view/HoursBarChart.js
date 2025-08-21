"use client";
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HoursBarChart = ({ total = 0 }) => {
  const data = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const mid = 14; // peak ~2pm
    const sigma = 5;
    const weights = hours.map((h) => Math.exp(-((h - mid) ** 2) / (2 * sigma * sigma)));
    const sumW = weights.reduce((a, b) => a + b, 0) || 1;
    return hours.map((h, i) => ({
      name: `${h}:00`,
      views: Math.round((weights[i] / sumW) * total),
    }));
  }, [total]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeLeft="transparent" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Legend />
        <Bar dataKey="views" fill="#8884d8" name="Views" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HoursBarChart;
