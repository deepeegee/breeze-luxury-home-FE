"use client";
import React from "react";
import HoursBarChart from "./HoursBarChart";
import WeeklyLineChart from "./WeeklyLineChart";
import MonthlyPieChart from "./MonthlyPieChart";
import { useTotalPropertyViews } from "@/lib/useApi";

const PropertyViews = () => {
  const { total, isLoading } = useTotalPropertyViews();

  return (
    <div className="col-md-12">
      <div className="navtab-style1">
        <div className="d-sm-flex align-items-center justify-content-between">
          <h4 className="title fz17 mb20">
            Property Views {isLoading ? "(loading…)" : `(${total.toLocaleString()})`}
          </h4>
          <ul className="nav nav-tabs border-bottom-0 mb30" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="hourly-tab" data-bs-toggle="tab" href="#hourly" role="tab" aria-controls="hourly" aria-selected="true">Hours</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="weekly-tab" data-bs-toggle="tab" href="#weekly" role="tab" aria-controls="weekly" aria-selected="false">Weekly</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="monthly-tab" data-bs-toggle="tab" href="#monthly" role="tab" aria-controls="monthly" aria-selected="false">Monthly</a>
            </li>
          </ul>
        </div>

        <div className="tab-content" id="myTabContent2">
          <div className="tab-pane fade show active" id="hourly" role="tabpanel" aria-labelledby="hourly-tab" style={{ height: "500px", maxHeight: "100%" }}>
            <HoursBarChart total={total} />
          </div>

          <div className="tab-pane fade w-100" id="weekly" role="tabpanel" aria-labelledby="weekly-tab" style={{ height: "500px" }}>
            <div className="chart-container">
              <WeeklyLineChart total={total} />
            </div>
          </div>

          <div className="tab-pane fade" id="monthly" role="tabpanel" aria-labelledby="monthly-tab" style={{ height: "500px" }}>
            <MonthlyPieChart total={total} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyViews;