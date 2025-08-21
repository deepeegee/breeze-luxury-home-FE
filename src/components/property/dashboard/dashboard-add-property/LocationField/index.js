"use client";
import React, { useMemo, useState } from "react";
import SelectMulitField from "./SelectMulitField";

// Clean items before sending
function cleanItems(arr) {
  return arr
    .map((x) => ({
      label: (x.label ?? "").trim(),
      distance: (x.distance ?? "").trim(),
      category: (x.category ?? "").trim(),
    }))
    .filter((x) => x.label); // send only rows that have labels
}

function NearbyEditor() {
  const [items, setItems] = useState([
    { label: "", distance: "", category: "" },
    { label: "", distance: "", category: "" },
    { label: "", distance: "", category: "" },
  ]);

  const json = useMemo(() => JSON.stringify(cleanItems(items)), [items]);

  const update = (idx, key, val) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: val } : it))
    );

  const add = () =>
    setItems((prev) => [
      ...prev,
      { label: "", distance: "", category: "" },
    ]);

  const remove = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="mt10">
      {/* hidden field sent with the form */}
      <input type="hidden" name="whatsNearby" value={json} readOnly />

      <label className="heading-color ff-heading fw600 mb10">
        What’s Nearby (optional)
      </label>

      <div className="bdr1 bdrs12 p15">
        {items.map((it, idx) => (
          <div className="row g-2 align-items-end mb10" key={idx}>
            <div className="col-md-5">
              <label className="fz12 text-muted mb5">Place / Label</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Springfield Primary School"
                value={it.label}
                onChange={(e) => update(idx, "label", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="fz12 text-muted mb5">Distance</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 1.2 km"
                value={it.distance}
                onChange={(e) => update(idx, "distance", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="fz12 text-muted mb5">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Education / Hospital / Transit"
                value={it.category}
                onChange={(e) => update(idx, "category", e.target.value)}
              />
            </div>
            <div className="col-md-1 d-flex">
              <button
                type="button"
                className="ud-btn btn-light w-100"
                aria-label="Remove row"
                onClick={() => remove(idx)}
                disabled={items.length <= 1}
                title="Remove"
              >
                <span className="fas fa-trash-alt" />
              </button>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-end">
          <button type="button" className="ud-btn btn-thm" onClick={add}>
            <span className="fas fa-plus me-2" />
            Add more
          </button>
        </div>
      </div>
      <div className="fz12 text-muted mt5">
        Tip: only “Place / Label” is required per row; the rest is optional.
      </div>
    </div>
  );
}

const LocationField = () => {
  return (
    <div className="form-style1">
      {/* Country is fixed */}
      <input type="hidden" name="country" value="Nigeria" />

      <div className="row">
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 5 Parkview Estate"
              name="address"
              required
            />
          </div>
        </div>

        {/* Nigeria-only State & City */}
        <SelectMulitField />

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Zip / Postal Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Optional"
              name="zip"
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Neighborhood
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Ikoyi, Lekki Phase 1"
              name="neighborhood"
            />
          </div>
        </div>

        {/* What's Nearby */}
        <div className="col-12">
          <NearbyEditor />
        </div>
      </div>
    </div>
  );
};

export default LocationField;