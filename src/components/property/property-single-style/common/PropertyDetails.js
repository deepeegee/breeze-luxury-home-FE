"use client";
import React, { useMemo } from "react";

const fmtInt = (n) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : null;
const fmtMoney = (n) =>
  typeof n === "number" && Number.isFinite(n)
    ? `$${n.toLocaleString()}`
    : null;

const has = (v) => {
  if (v === 0) return true;
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "" && v !== "N/A";
  if (typeof v === "number") return Number.isFinite(v);
  return true;
};

const PropertyDetails = ({ property }) => {
  if (!property) return <div>Property details not available</div>;

  const details = [];

  // ID (prefer propertyId if present)
  if (has(property.propertyId || property.id)) {
    details.push({
      label: "Property ID",
      value: String(property.propertyId || property.id),
    });
  }

  if (has(property.price)) {
    details.push({ label: "Price", value: fmtMoney(property.price) });
  }

  // “Size in ft” → “Land Size”
  if (has(property.sqft)) {
    details.push({
      label: "Land Size",
      value: `${fmtInt(property.sqft) ?? property.sqft} sq ft`,
    });
  }

  if (has(property.bath)) {
    details.push({ label: "Bathrooms", value: fmtInt(property.bath) ?? property.bath });
  }

  if (has(property.bed)) {
    details.push({ label: "Bedrooms", value: fmtInt(property.bed) ?? property.bed });
  }

  if (has(property.garages)) {
    details.push({ label: "Garage", value: fmtInt(property.garages) ?? property.garages });
  }

  if (has(property.garageSize)) {
    details.push({
      label: "Garage Size",
      value: `${fmtInt(property.garageSize) ?? property.garageSize} sq ft`,
    });
  }

  if (has(property.yearBuilding)) {
    details.push({ label: "Year Built", value: property.yearBuilding });
  }

  if (has(property.propertyType)) {
    details.push({ label: "Property Type", value: property.propertyType });
  }

  // Status: prefer explicit availability, else derive from forRent if present
  if (has(property.availability)) {
    details.push({ label: "Property Status", value: property.availability });
  } else if (typeof property.forRent === "boolean") {
    details.push({ label: "Property Status", value: property.forRent ? "For Rent" : "For Sale" });
  }

  // Nothing to show? return null to avoid empty container
  if (details.length === 0) return null;

  // Split into two columns (roughly even)
  const { left, right } = useMemo(() => {
    const mid = Math.ceil(details.length / 2);
    return { left: details.slice(0, mid), right: details.slice(mid) };
  }, [details]);

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
