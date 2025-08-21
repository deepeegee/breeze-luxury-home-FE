"use client";
import React from "react";

const fmtInt = (n) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : null;

const has = (v) => {
  if (v === 0) return true; // 0 is a valid number in some cases
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "" && v !== "N/A";
  if (typeof v === "number") return Number.isFinite(v);
  return true;
};

const OverView = ({ property }) => {
  if (!property) return <div>Property not found</div>;

  const items = [];

  if (has(property.bed))
    items.push({ icon: "flaticon-bed", label: "Bedroom", value: fmtInt(property.bed) ?? property.bed });

  if (has(property.bath))
    items.push({ icon: "flaticon-shower", label: "Bath", value: fmtInt(property.bath) ?? property.bath });

  if (has(property.yearBuilding))
    items.push({ icon: "flaticon-event", label: "Year Built", value: property.yearBuilding });

  if (has(property.garages))
    items.push({ icon: "flaticon-garage", label: "Garage", value: fmtInt(property.garages) ?? property.garages, xs: true });

  // You said “Size in ft” → “Land Size”
  if (has(property.sqft))
    items.push({
      icon: "flaticon-expand",
      label: "Land Size",
      value: `${fmtInt(property.sqft) ?? property.sqft} sq ft`,
      xs: true,
    });

  if (has(property.propertyType))
    items.push({ icon: "flaticon-home-1", label: "Property Type", value: property.propertyType });

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item) => (
        <div
          key={item.label}
          className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
        >
          <div className="overview-element d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
