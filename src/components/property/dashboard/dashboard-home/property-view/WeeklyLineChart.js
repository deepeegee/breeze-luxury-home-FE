"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { usePropertyDailyViews } from "@/lib/useApi";
import { toLocalDayKey } from "@/lib/api";

const TZ = "Africa/Lagos";

const WeeklyLineChart = ({ propertyId }) => {
  // route fallback
  const params = useParams();
  const rawId = params?.id;
  const routeId = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = propertyId ?? routeId ?? null;

  // force re-render when a Bootstrap tab becomes visible
  const [renderKey, setRenderKey] = useState(0);
  useEffect(() => {
    const handler = () => setRenderKey((k) => k + 1);
    const els = typeof document !== "undefined" ? document.querySelectorAll('[data-bs-toggle="tab"]') : [];
    els.forEach((el) => el.addEventListener("shown.bs.tab", handler));
    return () => els.forEach((el) => el.removeEventListener("shown.bs.tab", handler));
  }, []);

  const { data: rows = [], isLoading } = usePropertyDailyViews(id || undefined);

  const data = useMemo(() => {
    // map daily rows -> local day key => count
    const dayKeyToCount = new Map();
    for (let i = 0; i < rows.length; i++) {
      const key = toLocalDayKey(rows[i].date, TZ);
      dayKeyToCount.set(key, (dayKeyToCount.get(key) ?? 0) + (rows[i].viewCount || 0));
    }
    // build the last 7 local days (oldest -> newest)
    const points = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toLocalDayKey(d, TZ);
      const label = d.toLocaleDateString(undefined, { weekday: "short", timeZone: TZ }); // Mon, Tue...
      points.push({ name: label, views: dayKeyToCount.get(key) ?? 0 });
    }
    return points;
  }, [rows]);

  return (
    <ResponsiveContainer key={renderKey} width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="views" stroke="#8884d8" name={isLoading ? "Loading…" : "Views"} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyLineChart;
