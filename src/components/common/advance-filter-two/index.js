"use client";
import Select from "react-select";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useEffect, useMemo, useState } from "react";
import { useListings } from "@/lib/useApi";

/** Normalize AMENITY_GROUPS into: [{ title: string, items: string[] }] */
function normalizeAmenityGroups(src) {
  if (!Array.isArray(src)) return [];
  if (src.length && typeof src[0] === "string") return [{ title: "Amenities", items: src }];
  if (src.length && Array.isArray(src[0])) {
    return src.map((arr, i) => ({ title: `Group ${i + 1}`, items: (arr || []).filter(Boolean) }));
  }
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
    backgroundColor: isSelected ? "#eb6753" : (isHovered || isFocused) ? "#eb675312" : undefined,
  }),
};

export default function AdvanceFilterModal({
  filterFunctions,
  amenitiesOptions = [],
  locationOptions = [], // strings or [{value,label}]
}) {
  const ff = {
    setPropertyTypes: filterFunctions?.setPropertyTypes ?? (() => {}),
    handlelocation: filterFunctions?.handlelocation ?? (() => {}),
    handlebedrooms: filterFunctions?.handlebedrooms ?? (() => {}),
    handlebathroms: filterFunctions?.handlebathroms ?? (() => {}),
    setCategories: filterFunctions?.setCategories ?? (() => {}),
    resetFilter: filterFunctions?.resetFilter ?? (() => {}),
    onFiltersChanged: filterFunctions?.onFiltersChanged ?? (() => {}),
    // current values (read)
    propertyTypes: filterFunctions?.propertyTypes ?? [],
    location: filterFunctions?.location ?? null,
    bedrooms: filterFunctions?.bedrooms ?? 0,
    bathroms: filterFunctions?.bathroms ?? 0,
    categories: filterFunctions?.categories ?? [],
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const amenityGroups = useMemo(() => normalizeAmenityGroups(amenitiesOptions), [amenitiesOptions]);

  // fetch and dedupe cities from BE
  const { data: listings = [] } = useListings();
  const beCities = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < listings.length; i++) {
      const city = String(listings[i]?.city ?? "").trim();
      if (city) set.add(city.toLowerCase() + "||" + city); // preserve original case
    }
    return Array.from(set).map((k) => k.split("||")[1]);
  }, [listings]);

  // normalize your hardcoded
  const hardCities = useMemo(() => {
    if (!Array.isArray(locationOptions)) return [];
    if (locationOptions.length && typeof locationOptions[0] === "object" && "value" in locationOptions[0]) {
      return locationOptions.map((o) => (o?.value ? String(o.value) : "")).filter(Boolean);
    }
    return locationOptions.map((c) => (c ? String(c) : "")).filter(Boolean);
  }, [locationOptions]);

  // merge + dedupe (case-insensitive) + sort
  const cityOptions = useMemo(() => {
    const map = new Map(); // key: lower, val: original
    [...hardCities, ...beCities].forEach((c) => {
      const lower = c.toLowerCase();
      if (!map.has(lower)) map.set(lower, c);
    });
    return Array.from(map.values())
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ value: c, label: c }));
  }, [hardCities, beCities]);

  const selectedTypeValue = ff.propertyTypes[0] || null;
  const selectedType = CAT_OPTIONS.find((o) => o.value === selectedTypeValue) || null;

  const selectedCity = useMemo(() => {
    if (!cityOptions.length) return null;
    return cityOptions.find((o) => o.value === ff.location) || null;
  }, [cityOptions, ff.location]);

  const triggerSearch = () => {
    // tiny debounce guard could be added if needed
    ff.onFiltersChanged();
  };

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
                  <PriceRange filterFunctions={{ ...ff, onFiltersChanged: triggerSearch }} />
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
                      className="select-custom w-100"
                      classNamePrefix="select"
                      isClearable
                      value={selectedType}
                      onChange={(opt) => {
                        const val = opt?.value ? [opt.value] : [];
                        ff.setPropertyTypes(val);
                        triggerSearch();
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
                  <Bedroom filterFunctions={{ ...ff, onFiltersChanged: triggerSearch }} />
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
                  <Bathroom filterFunctions={{ ...ff, onFiltersChanged: triggerSearch }} />
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  {mounted && (
                    <Select
                      placeholder={cityOptions.length ? "Select city" : "No cities available"}
                      options={cityOptions}
                      isDisabled={cityOptions.length === 0}
                      styles={customStyles}
                      className="select-custom w-100"
                      classNamePrefix="select"
                      value={selectedCity}
                      onChange={(opt) => {
                        ff.handlelocation(opt?.value ?? null);
                        triggerSearch();
                      }}
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
              selected={ff.categories}
              onChange={(next) => {
                ff.setCategories(next);
                triggerSearch();
              }}
            />
          </div>
        </div>

        <div className="modal-footer justify-content-between">
          <button className="reset-button" onClick={() => ff.resetFilter()}>
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

      {/* row layout fix for bed/bath; keep your visual style */}
      <style jsx>{`
        .radio-element {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }
        .radio-element .selection {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .radio-element .selection input {
          margin: 0;
          accent-color: #eb6753;
        }
      `}</style>
    </div>
  );
}
