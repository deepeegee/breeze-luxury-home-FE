// src/components/property/property-single-style/common/PropertyFeaturesAminites.jsx
"use client";

import React from "react";

const toArray = (v) => (Array.isArray(v) ? v : []);

// normalize → label string
const asLabel = (x) =>
  typeof x === "string" ? x : (x && typeof x.label === "string" ? x.label : "");

// trim + collapse spaces
const clean = (s) => s.replace(/\s+/g, " ").trim();

// Dedupe case-insensitively (keep first appearance’s casing)
const dedupe = (items) => {
  const seen = new Set();
  const out = [];
  for (const raw of items) {
    const label = clean(asLabel(raw));
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
};

/** Split items into N fairly balanced columns */
const splitIntoCols = (items, cols = 3) => {
  const out = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => out[i % cols].push(item));
  return out;
};

const PropertyFeaturesAminites = ({ property }) => {
  const amenities = toArray(property?.amenities);
  const features = toArray(property?.features);

  // Combine + dedupe (prevents duplicates across amenities & features)
  const mainList = dedupe([...amenities, ...features]);

  // Additional details (own header, only if present)
  const rawPairs = [
    ["Basement", property?.basement],
    ["Extra Details", property?.extraDetails],
    ["Exterior Material", property?.exteriorMaterial],
    ["Roofing", property?.roofing],
  ];
  const details = rawPairs
    .map(([label, val]) => [label, typeof val === "string" ? clean(val) : ""])
    .filter(([, val]) => !!val);

  if (mainList.length === 0 && details.length === 0) {
    return (
      <div className="col-12">
        <p className="text-muted">
          No features, amenities, or additional details available for this property.
        </p>
      </div>
    );
  }

  const mainCols = splitIntoCols(mainList, 3);
  const detailCols = splitIntoCols(details, 2);

  return (
    <div className="col-12">
      {/* ===== Features & Amenities grid (no inner header; parent has it) ===== */}
      {mainList.length > 0 && (
        <div className="mb20">
          <div className="row">
            {mainCols.map((col, idx) => (
              <div key={`amen-col-${idx}`} className="col-sm-6 col-md-4">
                <div className="pd-list">
                  {col.map((item, i) => (
                    <p key={`amen-${idx}-${i}`} className="text mb10">
                      <i className="fas fa-circle fz6 align-middle pe-2" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Additional Property Details (own sub-header) ===== */}
      {details.length > 0 && (
        <div className="mb10">
          <h4 className="title fz17 mb20">Additional Property Details</h4>
          <div className="row">
            {detailCols.map((col, idx) => (
              <div key={`detail-col-${idx}`} className="col-sm-6">
                <div className="pd-list">
                  {col.map(([label, val], i) => (
                    <p key={`detail-${idx}-${i}`} className="text mb10">
                      <i className="fas fa-circle fz6 align-middle pe-2" />
                      <strong>{label}:</strong> {val}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFeaturesAminites;
