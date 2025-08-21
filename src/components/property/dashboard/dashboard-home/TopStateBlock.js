"use client";
import React from "react";
import { useListings, useTotalPropertyViews } from "@/lib/useApi";

const TopStateBlock = () => {
  const { data: properties, isLoading: loadingProps } = useListings();
  const { total, isLoading: loadingViews } = useTotalPropertyViews();

  const statisticsData = [
    {
      text: "All Properties",
      title: loadingProps ? "…" : String(properties?.length ?? 0),
      icon: "flaticon-home",
    },
    {
      text: "Total Views",
      title: loadingViews ? "…" : String(total),
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
