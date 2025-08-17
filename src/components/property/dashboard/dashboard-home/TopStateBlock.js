"use client";
import React from "react";
import { useListings } from "@/lib/useApi";

const TopStateBlock = () => {
  const { data: properties, isLoading } = useListings();

  const statisticsData = [
    {
      text: "All Properties",
      title: isLoading ? "..." : properties?.length?.toString() || "0",
      icon: "flaticon-home",
    },
    {
      text: "Total Views",
      title: "192",
      icon: "flaticon-search-chart",
    },
    {
      text: "Total Visitor Reviews",
      title: "438",
      icon: "flaticon-review",
    },
    {
      text: "Total Favorites",
      title: "67",
      icon: "flaticon-like",
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
