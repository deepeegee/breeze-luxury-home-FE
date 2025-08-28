"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

import { usePropertyDailyViews } from "@/lib/useApi";
import { groupDailyToMonthly } from "@/lib/api";

const TZ = "Africa/Lagos";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#83a6ed", "#d885f5", "#f59e0b", "#22c55e", "#ef4444"];

const MonthlyPieChart = ({ propertyId }) => {
  const params = useParams();
  const rawId = params?.id;
  const routeId = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = propertyId ?? routeId ?? null;

  const [renderKey, setRenderKey] = useState(0);
  useEffect(() => {
    const handler = () => setRenderKey((k) => k + 1);
    const els = typeof document !== "undefined" ? document.querySelectorAll('[data-bs-toggle="tab"]') : [];
    els.forEach((el) => el.addEventListener("shown.bs.tab", handler));
    return () => els.forEach((el) => el.removeEventListener("shown.bs.tab", handler));
  }, []);

  const { data: rows = [], isLoading } = usePropertyDailyViews(id || undefined);

  const data = useMemo(() => {
    const monthly = groupDailyToMonthly(rows, (r) => r.viewCount || 0, TZ);
    const last12 = monthly.slice(-12);
    const fmt = new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric", timeZone: "UTC" });
    const labeled = last12.map((m) => {
      const [y, mm] = m.month.split("-"); // YYYY-MM
      const dt = new Date(Date.UTC(Number(y), Number(mm) - 1, 1));
      return { name: fmt.format(dt), value: m.total || 0 };
    });
    return labeled.length ? labeled : [{ name: "No Data", value: 0 }];
  }, [rows]);

  return (
    <ResponsiveContainer key={renderKey} width="100%" height="100%">
      <PieChart>
        <Legend />
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => (Number.isFinite(Number(v)) ? Number(v).toLocaleString() : v)} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPieChart;
