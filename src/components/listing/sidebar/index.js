"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBox from "./SearchBox";
import ListingStatus from "./ListingStatus";
import PropertyType from "./PropertyType";
import PriceSlider from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Location from "./Location";
import SquareFeet from "./SquareFeet";
import YearBuilt from "./YearBuilt";
import OtherFeatures from "./OtherFeatures";

/* ---------- canonical type mapping ---------- */
const TYPE_MAP = new Map([
  ["fully-detached duplex", "Fully-Detached Duplex"],
  ["duplex", "Fully-Detached Duplex"],
  ["bungalow", "Bungalow"],
  ["apartment", "Apartment"],
  ["apartments", "Apartment"],
  ["townhome", "Townhome"],
  ["town home", "Townhome"],
  ["office", "Office"],
  ["offices", "Office"],
  ["factory", "Factory"],
  ["land & plots", "Land & Plots"],
  ["land and plots", "Land & Plots"],
  ["land", "Land & Plots"],
]);

const canonType = (s) => {
  const k = (s ?? "").toString().trim().toLowerCase();
  return TYPE_MAP.get(k) ?? s;
};

const ListingSidebar = () => {
  const router = useRouter();
  const sp = useSearchParams();

  const updateQuery = (patch) => {
    const next = new URLSearchParams(sp?.toString() || "");
    Object.entries(patch).forEach(([k, v]) => {
      if (
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0)
      ) {
        next.delete(k);
      } else {
        next.set(k, Array.isArray(v) ? v.join(",") : String(v));
      }
    });
    router.push(`?${next.toString()}`, { scroll: false });
  };

  /* ---------- filter functions for all widgets ---------- */
  const filterFunctions = useMemo(
    () => ({
      setStatus: (label) => {
        const val = (label || "").toString().toLowerCase();
        const qVal = val.includes("sold")
          ? "sold"
          : val.includes("sale") || val.includes("avail")
          ? "for-sale"
          : "";
        updateQuery({ status: qVal });
      },
      setPropertyTypes: (types = []) => {
        const norm = (Array.isArray(types) ? types : [types])
          .map(canonType)
          .filter(Boolean);
        updateQuery({ type: norm });
      },
      setPriceRange: ([min, max] = []) =>
        updateQuery({ minPrice: min ?? "", maxPrice: max ?? "" }),
      setBeds: (n) => updateQuery({ beds: n ?? "" }),
      setBaths: (n) => updateQuery({ baths: n ?? "" }),
      setQuery: (q) => updateQuery({ q }),
      setLocation: (loc) => updateQuery({ location: loc }),
      setSquareFeet: ([min, max] = []) =>
        updateQuery({ minSqft: min ?? "", maxSqft: max ?? "" }),
      setYearBuilt: ([min, max] = []) =>
        updateQuery({ minYear: min ?? "", maxYear: max ?? "" }),
      setOtherFeatures: (features = []) =>
        updateQuery({ features: features.join(",") }),
      clearAll: () => router.push("?", { scroll: false }),
    }),
    [sp]
  );

  return (
    <div className="list-sidebar-style1">
      <div className="widget-wrapper">
        <h6 className="list-title">Find your home</h6>
        <SearchBox filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Listing Status</h6>
        <ListingStatus filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Property Type</h6>
        <PropertyType filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Price Range</h6>
        <PriceSlider filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Bedrooms</h6>
        <Bedroom filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Bathrooms</h6>
        <Bathroom filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Location</h6>
        <Location filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Square Feet</h6>
        <SquareFeet filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Year Built</h6>
        <YearBuilt filterFunctions={filterFunctions} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Other Features</h6>
        <OtherFeatures filterFunctions={filterFunctions} />
      </div>
    </div>
  );
};

export default ListingSidebar;