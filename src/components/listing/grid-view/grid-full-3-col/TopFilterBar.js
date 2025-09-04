"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ListingStatus from "../../sidebar/ListingStatus";
import PropertyType from "../../sidebar/PropertyType";
import PriceRange from "../../sidebar/PriceRange";
import Bedroom from "../../sidebar/Bedroom";
import Bathroom from "../../sidebar/Bathroom";

/* ---------- canonical type mapping (exported) ---------- */
export const TYPE_MAP = new Map([
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

export const canonType = (s) => {
  const k = (s ?? "").toString().trim().toLowerCase();
  return TYPE_MAP.get(k) ?? s;
};

export default function TopFilterBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const getNum = (v, fallback = undefined) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

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

  /* ---------- handlers for child widgets (apply immediately) ---------- */
  const filterFunctions = useMemo(() => {
    // current values from URL
    const currBeds = getNum(sp.get("beds"), 0);
    const currBaths = getNum(sp.get("baths"), 0);

    // STATUS: write 'available' | 'sold' (blank for All)
    const currStatus = (sp.get("status") || "").toLowerCase(); // 'available' | 'sold' | ''
    const listingStatus =
      currStatus === "sold" ? "Sold" : currStatus === "available" ? "Available" : "All";

    // PRICE
    const currMin = getNum(sp.get("minPrice"), undefined);
    const currMax = getNum(sp.get("maxPrice"), undefined);

    const api = {
      // status (labels: 'All' | 'Available' | 'Sold')
      setStatus: (label) => {
        const val = (label || "").toLowerCase();
        const qVal = val.includes("sold") ? "sold" : val.includes("avail") ? "available" : "";
        updateQuery({ status: qVal });
      },
      // legacy compatibility
      handlelistingStatus: (label) => {
        const val = (label || "").toLowerCase();
        const qVal = val.includes("sold") ? "sold" : val.includes("avail") ? "available" : "";
        updateQuery({ status: qVal });
      },
      listingStatus,

      // property types
      setPropertyTypes: (types = []) => {
        const norm = (Array.isArray(types) ? types : [types]).map(canonType).filter(Boolean);
        updateQuery({ type: norm });
      },

      // price (₦-based)
      setPriceRange: ([min, max] = []) =>
        updateQuery({ minPrice: min ?? "", maxPrice: max ?? "" }),
      handlepriceRange: ([min, max] = []) =>
        updateQuery({ minPrice: min ?? "", maxPrice: max ?? "" }),
      minPrice: currMin,
      maxPrice: currMax,
      priceRange: [currMin ?? 0, currMax ?? 2_000_000_000],

      // beds/baths
      setBeds: (n) => updateQuery({ beds: n ?? "" }),
      setBaths: (n) => updateQuery({ baths: n ?? "" }),
      handlebedrooms: (n) => updateQuery({ beds: n ?? "" }),
      handlebathroms: (n) => updateQuery({ baths: n ?? "" }),
      bedrooms: currBeds,
      bathroms: currBaths,

      // search
      setQuery: (q) => updateQuery({ q }),

      // reset
      clearAll: () => router.push("?", { scroll: false }),
      resetFilter: () => router.push("?", { scroll: false }),
    };

    return api;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  /* ---------- derive compact trigger labels ---------- */
  const statusQ = (sp.get("status") || "").toLowerCase(); // 'available' | 'sold' | ''
  const statusLabel =
    statusQ === "sold" ? "Sold" : statusQ === "available" ? "Available" : "Status";

  const typeQ = sp.get("type"); // e.g. "A,B,C"
  const typeArr = typeQ ? typeQ.split(",") : [];
  const typeLabel =
    typeArr.length === 0
      ? "Property Type"
      : typeArr.length === 1
      ? canonType(typeArr[0])
      : `Property Type (${typeArr.length})`;

  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const priceLabel =
    minPrice || maxPrice
      ? `Price ${minPrice ? `₦${Number(minPrice).toLocaleString()}` : "Any"} – ${
          maxPrice ? `₦${Number(maxPrice).toLocaleString()}` : "Any"
        }`
      : "Price";

  const beds = sp.get("beds");
  const baths = sp.get("baths");
  const bbLabel =
    beds || baths ? `Beds/Baths ${beds ?? "Any"}/${baths ?? "Any"}` : "Beds / Baths";

  return (
    <>
      {/* LEFT: filters only */}
      <div className="col-xl-12">
        <div className="dropdown-lists">
          <ul className="p-0 text-center text-xl-start">
            {/* STATUS */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {statusLabel} <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu">
                <div className="widget-wrapper pb15 mb0 px20">
                  <h6 className="list-title mb10">Listing Status</h6>
                  <div className="radio-element">
                    <ListingStatus filterFunctions={filterFunctions} />
                  </div>
                </div>
              </div>
            </li>

            {/* PROPERTY TYPE */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {typeLabel} <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu">
                <div className="widget-wrapper pb15 mb0 px20">
                  <h6 className="list-title mb10">Property Type</h6>
                  <div className="checkbox-style1">
                    <PropertyType filterFunctions={filterFunctions} />
                  </div>
                </div>
              </div>
            </li>

            {/* PRICE */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {priceLabel} <i className="fa fa-angle-down ms-2" />
              </button>

              <div className="dropdown-menu dd3">
                <div className="widget-wrapper mb0 px20">
                  <h6 className="list-title mb10">Price Range</h6>
                  <div className="range-slider-style1">
                    <PriceRange filterFunctions={filterFunctions} />
                  </div>
                </div>
              </div>
            </li>

            {/* BEDS / BATHS */}
            <li className="list-inline-item position-relative">
              <button
                type="button"
                className="open-btn mb15 dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {bbLabel} <i className="fa fa-angle-down ms-2" />
              </button>
              <div className="dropdown-menu dd4 pb15">
                <div className="widget-wrapper px20">
                  <h6 className="list-title mb10">Bedrooms</h6>
                  <div className="d-flex">
                    <Bedroom filterFunctions={filterFunctions} />
                  </div>
                </div>

                <div className="widget-wrapper pb10 mb0 px20">
                  <h6 className="list-title mb10 mt10">Bathrooms</h6>
                  <div className="d-flex">
                    <Bathroom filterFunctions={filterFunctions} />
                  </div>
                </div>
              </div>
            </li>

            {/* ADVANCED */}
            <li className="list-inline-item">
              <button
                type="button"
                className="open-btn mb15"
                data-bs-toggle="modal"
                data-bs-target="#advanceSeachModal"
              >
                <i className="flaticon-settings me-2" /> More Filters
              </button>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .dropdown-menu {
          min-width: 260px;
        }
        .px20 {
          padding-left: 20px;
          padding-right: 20px;
        }
        .open-btn {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
