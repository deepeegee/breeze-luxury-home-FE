"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { usePropertyDailyViews } from "@/lib/useApi";
import { toLocalDayKey } from "@/lib/api";

const TZ = "Africa/Lagos";

const HoursBarChart = ({ propertyId }) => {
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
    const todayKey = toLocalDayKey(new Date(), TZ);
    const todayRow = rows.find((r) => toLocalDayKey(r.date, TZ) === todayKey);
    const total = todayRow?.viewCount || 0;

    const hours = Array.from({ length: 24 }, (_, h) => h);
    const mid = 14; // 2pm peak
    const sigma = 5;
    const weights = hours.map((h) => Math.exp(-((h - mid) ** 2) / (2 * sigma * sigma)));
    const sumW = weights.reduce((a, b) => a + b, 0) || 1;

    return hours.map((h, i) => ({
      name: `${String(h).padStart(2, "0")}:00`,
      views: Math.round((weights[i] / sumW) * total),
    }));
  }, [rows]);

  return (
    <ResponsiveContainer key={renderKey} width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeLeft="transparent" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Legend />
        <Bar dataKey="views" fill="#8884d8" name={isLoading ? "Loading…" : "Views"} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HoursBarChart;
