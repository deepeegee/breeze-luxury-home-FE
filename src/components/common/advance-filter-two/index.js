"use client";
import Select from "react-select";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useEffect, useMemo, useState } from "react";

/** Normalize AMENITY_GROUPS into: [{ title: string, items: string[] }] */
function normalizeAmenityGroups(src) {
  if (!Array.isArray(src)) return [];
  // Array of strings
  if (src.length && typeof src[0] === "string") {
    return [{ title: "Amenities", items: src }];
  }
  // Array of arrays
  if (src.length && Array.isArray(src[0])) {
    return src.map((arr, i) => ({
      title: `Group ${i + 1}`,
      items: (arr || []).filter(Boolean),
    }));
  }
  // Array of objects: { title/label/name, items/amenities/values }
  return src.map((g, i) => {
    const title = g?.title || g?.label || g?.name || `Group ${i + 1}`;
    const items = Array.isArray(g?.items)
      ? g.items
      : Array.isArray(g?.amenities)
      ? g.amenities
      : Array.isArray(g?.values)
      ? g.values
      : [];
    return { title, items: items.filter(Boolean) };
  });
}

// Our property types
const CAT_OPTIONS = [
  { value: "Fully-Detached Duplex", label: "Duplex" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Apartment", label: "Apartments" },
  { value: "Townhome", label: "Town home" },
  { value: "Office", label: "Offices" },
  { value: "Factory", label: "Factory" },
  { value: "Land & Plots", label: "Land & Plots" },
];

const customStyles = {
  option: (styles, { isFocused, isSelected, isHovered }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#eb6753"
      : isHovered || isFocused
      ? "#eb675312"
      : undefined,
  }),
};

export default function AdvanceFilterModal({
  filterFunctions,
  amenitiesOptions = [],
  locationOptions = [],
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const amenityGroups = useMemo(
    () => normalizeAmenityGroups(amenitiesOptions),
    [amenitiesOptions]
  );

  // Build select options for cities
  const cityOptions = useMemo(() => {
    if (!Array.isArray(locationOptions)) return [];
    if (locationOptions.length && typeof locationOptions[0] === "object" && "value" in locationOptions[0]) {
      return locationOptions;
    }
    return locationOptions.map((c) => ({ value: c, label: c }));
  }, [locationOptions]);

  const currentCity =
    cityOptions.find((o) => o.value === filterFunctions?.location) ||
    cityOptions[0] ||
    { value: "All Cities", label: "All Cities" };

  const selectedTypeValue = filterFunctions?.propertyTypes?.[0] || null;
  const selectedType =
    CAT_OPTIONS.find((o) => o.value === selectedTypeValue) || null;

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title">More Filter</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>

        <div className="modal-body pb-0">
          {/* Price */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Price Range</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>

          {/* Type / Beds */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Type</h6>
                <div className="form-style2 input-group">
                  {mounted && (
                    <Select
                      placeholder="Select type"
                      options={CAT_OPTIONS}
                      styles={customStyles}
                      className="select-custom"
                      classNamePrefix="select"
                      isClearable
                      value={selectedType}
                      onChange={(opt) => {
                        const val = opt?.value ? [opt.value] : [];
                        filterFunctions?.setPropertyTypes?.(val);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bedrooms</h6>
                <div className="radio-element">
                  <Bedroom filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>

          {/* Baths / Location */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bathrooms</h6>
                <div className="radio-element">
                  <Bathroom filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  {mounted && (
                    <Select
                      options={cityOptions}
                      styles={customStyles}
                      className="select-custom filterSelect"
                      classNamePrefix="select"
                      value={currentCity}
                      onChange={(opt) =>
                        filterFunctions?.handlelocation?.(opt?.value || "All Cities")
                      }
                      isClearable
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper mb0">
                <h6 className="list-title mb10">Amenities</h6>
              </div>
            </div>
            <Amenities
              groups={amenityGroups}
              selected={filterFunctions?.categories || []}
              onChange={(next) => {
                if (filterFunctions?.setCategories) filterFunctions.setCategories(next);
              }}
            />
          </div>
        </div>

        <div className="modal-footer justify-content-between">
          <button className="reset-button" onClick={() => filterFunctions?.resetFilter?.()}>
            <span className="flaticon-turn-back" />
            <u>Reset all filters</u>
          </button>
          <div className="btn-area">
            <button type="button" className="ud-btn btn-thm" data-bs-dismiss="modal">
              <span className="flaticon-search align-text-top pr10" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}