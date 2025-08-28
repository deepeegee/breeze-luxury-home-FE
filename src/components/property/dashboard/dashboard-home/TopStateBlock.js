"use client";
import React from "react";
import { useListings, useGlobalViewsSummary } from "@/lib/useApi";

const formatCount = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString() : "0";
};

const TopStateBlock = () => {
  const { data: properties, isLoading: loadingProps } = useListings();
  const { data: summary, isLoading: loadingViews } = useGlobalViewsSummary("Africa/Lagos");

  const totalViewsAllTime = summary?.totalViewsAllTime ?? 0;

  const statisticsData = [
    {
      text: "All Properties",
      title: loadingProps ? "…" : formatCount(properties?.length ?? 0),
      icon: "flaticon-home",
    },
    {
      text: "Total Views",
      title: loadingViews ? "…" : formatCount(totalViewsAllTime),
      icon: "flaticon-search-chart",
    },
  ];

  return (
    <>
      {statisticsData.map((data, index) => (
        <div key={index} className="col-sm-6 col-xxl-3">
          <div className="d-flex justify-content-between statistics_funfact">
            <div className="details">
              <div className="text fz25">{data.text}</div>
              <div className="title">{data.title}</div>
            </div>
            <div className="icon text-center">
              <i className={data.icon} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopStateBlock;
