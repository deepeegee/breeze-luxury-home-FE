"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";

import {
  useListings,               // to auto-pick when no [id]
  usePropertyViews,          // selected property: all-time total
  usePropertyDailyViews,     // selected property: daily rows
  useGlobalViewsSummary,     // GLOBAL (all properties): totals + series
} from "@/lib/useApi";

import { toLocalDayKey, groupDailyToMonthly } from "@/lib/api";

import HoursBarChart from "./HoursBarChart";
import WeeklyLineChart from "./WeeklyLineChart";
import MonthlyPieChart from "./MonthlyPieChart";

const TZ = "Africa/Lagos";
const fmt = (n) => (Number.isFinite(Number(n)) ? Number(n).toLocaleString() : "0");

const PropertyViews = ({ propertyId: propId }) => {
  const params = useParams();
  const routeRawId = params && params.id;
  const routeId = Array.isArray(routeRawId) ? routeRawId[0] : routeRawId;

  // Listings for dashboard (no [id]) so we can pick one
  const { data: listings = [], isLoading: loadingListings } = useListings();

  // Chosen property id: prop > route > first listing
  const [chosenId, setChosenId] = useState(propId || routeId || null);
  useEffect(() => {
    if (!propId && !routeId && !chosenId && Array.isArray(listings) && listings.length) {
      setChosenId(String(listings[0].id));
    }
  }, [propId, routeId, chosenId, listings]);

  const id = propId || routeId || chosenId;

  // GLOBAL totals (all properties)
  const { data: globalSummary, isLoading: loadingGlobal } = useGlobalViewsSummary(TZ);
  const globalTotalAllTime = globalSummary?.totalViewsAllTime ?? 0;
  const globalToday = globalSummary?.todayViews ?? 0;

  // Selected property totals + series
  const { data: totalAllTime, isLoading: loadingTotal, error: errorTotal } = usePropertyViews(id);
  const { data: dailyRows, isLoading: loadingSeries, error: errorSeries } = usePropertyDailyViews(id);

  // Per-property: today / last 7 days / last 12 months
  const { todayCount, last7DaysTotal, last12MonthsTotal } = useMemo(() => {
    if (!Array.isArray(dailyRows) || dailyRows.length === 0) {
      return { todayCount: 0, last7DaysTotal: 0, last12MonthsTotal: 0 };
    }
    const todayKey = toLocalDayKey(new Date(), TZ);
    const todayRow = dailyRows.find((r) => toLocalDayKey(r.date, TZ) === todayKey);
    const todayCount = (todayRow && todayRow.viewCount) || 0;

    const dayKeyToCount = new Map();
    for (let i = 0; i < dailyRows.length; i++) {
      const k = toLocalDayKey(dailyRows[i].date, TZ);
      dayKeyToCount.set(k, (dayKeyToCount.get(k) || 0) + (dailyRows[i].viewCount || 0));
    }
    const last7Keys = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Keys.push(toLocalDayKey(d, TZ));
    }
    const last7DaysTotal = last7Keys.reduce((acc, k) => acc + (dayKeyToCount.get(k) || 0), 0);

    const monthly = groupDailyToMonthly(dailyRows, (r) => r.viewCount || 0, TZ);
    const last12 = monthly.slice(-12);
    const last12MonthsTotal = last12.reduce((acc, row) => acc + (row.total || 0), 0);

    return { todayCount, last7DaysTotal, last12MonthsTotal };
  }, [dailyRows]);

  const isLoading =
    loadingGlobal ||
    loadingTotal ||
    loadingSeries ||
    (routeId ? false : loadingListings);

  const error = errorTotal || errorSeries;

  if (!id) return <div>Loading property list…</div>;
  if (error) return <div>Error fetching data.</div>;

  const selectedTotal = Number(totalAllTime || 0);
  const showSelector = !routeId && Array.isArray(listings) && listings.length > 0;

  return (
    <div className="col-md-12">
      <div className="navtab-style1">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* GLOBAL summary (all properties) */}
            <h4 className="title fz17 mb20 m-0">
              All Properties Views {isLoading ? "(…)" : `(${fmt(globalTotalAllTime)})`}
            </h4>

            {/* Selected property summary */}
            <div className="badge bg-light text-dark rounded-pill px-3 py-2">
              Selected Property: {isLoading ? "…" : fmt(selectedTotal)} total • Today {fmt(globalToday)}
            </div>

            {/* Property picker only on dashboard (no [id]) */}
            {showSelector && (
              <div className="d-flex align-items-center">
                <label className="me-2 mb-0">Property:</label>
                <select
                  className="form-select"
                  value={id || ""}
                  onChange={(e) => setChosenId(e.target.value)}
                  disabled={loadingListings}
                  style={{ minWidth: 260 }}
                >
                  {listings.map((p) => (
                    <option key={String(p.id)} value={String(p.id)}>
                      {p.title || p.name || p.propertyId || String(p.id)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <ul className="nav nav-tabs border-bottom-0 mb30" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="hourly-tab" data-bs-toggle="tab" href="#hourly" role="tab" aria-controls="hourly" aria-selected="true">
                Hours
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="weekly-tab" data-bs-toggle="tab" href="#weekly" role="tab" aria-controls="weekly" aria-selected="false">
                Weekly
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="monthly-tab" data-bs-toggle="tab" href="#monthly" role="tab" aria-controls="monthly" aria-selected="false">
                Monthly
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content" id="myTabContent2">
          {/* We only have daily data; Hours uses today's total for the selected property */}
          <div className="tab-pane fade show active" id="hourly" role="tabpanel" aria-labelledby="hourly-tab" style={{ height: "500px", maxHeight: "100%" }}>
            <HoursBarChart propertyId={id} total={todayCount} />
          </div>

          <div className="tab-pane fade w-100" id="weekly" role="tabpanel" aria-labelledby="weekly-tab" style={{ height: "500px" }}>
            <div className="chart-container">
              <WeeklyLineChart propertyId={id} total={last7DaysTotal} />
            </div>
          </div>

          <div className="tab-pane fade" id="monthly" role="tabpanel" aria-labelledby="monthly-tab" style={{ height: "500px" }}>
            <MonthlyPieChart propertyId={id} total={last12MonthsTotal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyViews;
