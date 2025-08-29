"use client";

import React, { useMemo } from "react";

const fmtInt = (n) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : null;
const fmtMoney = (n) =>
  typeof n === "number" && Number.isFinite(n) ? `₦${n.toLocaleString()}` : null;

const has = (v) => {
  if (v === 0) return true;
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "" && v !== "N/A";
  if (typeof v === "number") return Number.isFinite(v);
  return true;
};

const PropertyDetails = ({ property }) => {
  // Always call hooks; use safe fallback
  const p = property ?? {};

  // Build the details array inside a memo so its identity is stable
  const details = useMemo(() => {
    const arr = [];

    if (has(p.propertyId || p.id)) {
      arr.push({
        label: "Property ID",
        value: String(p.propertyId || p.id),
      });
    }

    if (has(p.price)) {
      arr.push({ label: "Price", value: fmtMoney(p.price) ?? p.price });
    }

    // “Size in ft” → “Land Size”
    if (has(p.sqft)) {
      arr.push({
        label: "Land Size",
        value: `${fmtInt(p.sqft) ?? p.sqft} sq ft`,
      });
    }

    if (has(p.bath)) {
      arr.push({ label: "Bathrooms", value: fmtInt(p.bath) ?? p.bath });
    }

    if (has(p.bed)) {
      arr.push({ label: "Bedrooms", value: fmtInt(p.bed) ?? p.bed });
    }

    if (has(p.garages)) {
      arr.push({ label: "Garage", value: fmtInt(p.garages) ?? p.garages });
    }

    if (has(p.garageSize)) {
      arr.push({
        label: "Garage Size",
        value: `${fmtInt(p.garageSize) ?? p.garageSize} sq ft`,
      });
    }

    if (has(p.yearBuilding)) {
      arr.push({ label: "Year Built", value: p.yearBuilding });
    }

    if (has(p.propertyType)) {
      arr.push({ label: "Property Type", value: p.propertyType });
    }

    // Status: prefer explicit availability, else derive from forRent if present
    if (has(p.availability)) {
      arr.push({ label: "Property Status", value: p.availability });
    } else if (typeof p.forRent === "boolean") {
      arr.push({ label: "Property Status", value: p.forRent ? "For Rent" : "For Sale" });
    }

    return arr;
  }, [
    p.propertyId,
    p.id,
    p.price,
    p.sqft,
    p.bath,
    p.bed,
    p.garages,
    p.garageSize,
    p.yearBuilding,
    p.propertyType,
    p.availability,
    p.forRent,
  ]);

  // Split into two columns (roughly even) – depends only on 'details'
  const { left, right } = useMemo(() => {
    const mid = Math.ceil(details.length / 2);
    return { left: details.slice(0, mid), right: details.slice(mid) };
  }, [details]);

  // Nothing to show? Render nothing (after hooks have been called)
  if (details.length === 0) return null;

  return (
    <div className="row">
      {[left, right].map((column, columnIndex) => (
        <div key={`col-${columnIndex}`} className="col-md-6 col-xl-4">
          {column.map((detail) => (
            <div key={detail.label} className="d-flex justify-content-between">
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">{detail.label}</p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
