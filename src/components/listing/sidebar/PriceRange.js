"use client";

import React, { useCallback, useEffect, useState } from "react";
import Slider from "rc-slider";
// Ensure rc-slider CSS is imported once in your app:
// import "rc-slider/assets/index.css";

function toNumber(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function fmtCompact(n) {
  const num = Number(n) || 0;
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return `₦${Number.isInteger(val) ? val.toFixed(0) : val.toFixed(1)}b`;
  }
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return `₦${Number.isInteger(val) ? val.toFixed(0) : val.toFixed(1)}m`;
  }
  return `₦${num.toLocaleString()}`;
}

export default function PriceRange({
  filterFunctions = {},
  min = 0,
  max = 2_000_000_000,   // ← defaults to ₦2b
  step = 1_000_000,      // ← ₦1m steps
}) {
  // Read initial values from parent/URL (TopFilterBar)
  const initialMin =
    toNumber(filterFunctions.minPrice ?? filterFunctions.priceRange?.[0], min);
  const initialMax =
    toNumber(filterFunctions.maxPrice ?? filterFunctions.priceRange?.[1], max);

  const clamp = (x) => Math.min(Math.max(x, min), max);

  const [range, setRange] = useState([clamp(initialMin), clamp(initialMax)]);

  // Stay in sync if URL or parent values change (back/forward etc.)
  useEffect(() => {
    const extMin = toNumber(
      filterFunctions.minPrice ?? filterFunctions.priceRange?.[0],
      range[0]
    );
    const extMax = toNumber(
      filterFunctions.maxPrice ?? filterFunctions.priceRange?.[1],
      range[1]
    );
    const next = [clamp(extMin), clamp(extMax)];
    if (next[0] !== range[0] || next[1] !== range[1]) setRange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFunctions.minPrice, filterFunctions.maxPrice, filterFunctions.priceRange]);

  // Push to URL when the user finishes adjusting
  const commit = useCallback(
    (val) => {
      const send =
        filterFunctions.setPriceRange || filterFunctions.handlepriceRange;
      if (typeof send === "function") {
        const [lo, hi] = val;
        send([lo ?? "", hi ?? ""]);
      }
    },
    [filterFunctions.setPriceRange, filterFunctions.handlepriceRange]
  );

  return (
    <div className="range-wrapper">
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={range}
        onChange={setRange}
        onChangeComplete={commit}  // ← modern callback
        allowCross={false}
      />
      <div className="d-flex align-items-center mt-2">
        <span id="slider-range-value1">{fmtCompact(range[0])}</span>
        <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
        <span id="slider-range-value2">{fmtCompact(range[1])}</span>
      </div>
    </div>
  );
}
