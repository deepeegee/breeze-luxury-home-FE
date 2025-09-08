"use client";
import React, { useMemo, useState } from "react";
import SelectMulitField from "./SelectMulitField";

/* ---------------------- Nearby editor ---------------------- */
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
    setItems((prev) => [...prev, { label: "", distance: "", category: "" }]);

  const remove = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="mt10">
      {/* Hidden field sent with the form.
          NOTE: name is NOW "nearby" to match BE (PropertyBE.nearby). */}
      <input type="hidden" name="nearby" value={json} readOnly />

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

/* ---------------------- Location field ---------------------- */
const LocationField = () => {
  return (
    <div className="form-style1">
      {/* Country is fixed */}
      <input type="hidden" name="country" value="Nigeria" />

      <div className="row">
        {/* Estate / Address */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Estate / Address
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Victoria Garden City"
              name="address"
              required
              autoComplete="off"
            />
          </div>
        </div>



        {/* <div className="col-sm-6 col-xl-4">
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
        </div> */}

        {/* Neighborhood → this maps to BE 'city' */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Neighborhood
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Lekki Phase 1"
              name="city" 
              autoComplete="off"
            />
          </div>
        </div>
        {/* State selector (keep your component; hide LGA and treat city elsewhere) */}
        {/* If your SelectMulitField supports props, use them; otherwise it will just ignore them */}
        <SelectMulitField showState={true} showCity={false} showLga={false} />
        {/* LGA is now redundant – keep commented in case you want it back */}
        {/*
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">LGA</label>
            <input type="text" className="form-control" name="lga" placeholder="(unused)" disabled />
          </div>
        </div>
        */}

        {/* What's Nearby */}
        <div className="col-12">
          <NearbyEditor />
        </div>
      </div>
    </div>
  );
};

export default LocationField;
