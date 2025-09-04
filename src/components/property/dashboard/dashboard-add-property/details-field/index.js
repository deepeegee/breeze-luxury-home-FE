"use client";
import React from "react";
import MultiSelectField from "./MultiSelectField";

const DetailsFiled = () => {
  return (
    <div className="form-style1">
      <div className="row">
        {/* Land size (posts as sizeInFt for BE) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Land size (sq ft)</label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 5000"
              name="sizeInFt"  // keep key for BE
            />
          </div>
        </div>

        {/* Rooms (optional) */}
        {/* <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Rooms</label>
            <input
              type="number"
              min={1}
              className="form-control"
              placeholder="e.g., 6"
              name="rooms"
            />
          </div>
        </div> */}

        {/* Bedrooms (required) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Bedrooms</label>
            <input
              type="number"
              min={1}
              className="form-control"
              placeholder="e.g., 4"
              name="bedrooms"
              required
            />
          </div>
        </div>

        {/* Bathrooms (required) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Bathrooms</label>
            <input
              type="number"
              min={1}
              className="form-control"
              placeholder="e.g., 4"
              name="bathrooms"
              required
            />
          </div>
        </div>

        {/* Year built (optional) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Year built (numeric)</label>
            <input
              type="number"
              min={1800}
              max={3000}
              className="form-control"
              placeholder="e.g., 2023"
              name="yearBuilt"
            />
          </div>
        </div>

        {/* Available from (optional) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Available from (date)</label>
            <input type="date" className="form-control" name="availableFrom" />
          </div>
        </div>

        {/* Optional text fields */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Basement</label>
            <input type="text" className="form-control" placeholder="Optional" name="basement" />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Extra details</label>
            <input type="text" className="form-control" placeholder="Optional" name="extraDetails" />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Roofing</label>
            <input type="text" className="form-control" placeholder="Optional" name="roofing" />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Exterior Material</label>
            <input type="text" className="form-control" placeholder="Optional" name="exteriorMaterial" />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Floors number (optional) */}
        <MultiSelectField />

        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Owner/Agent notes (not visible on front end)
            </label>
            <textarea cols={30} rows={5} placeholder="Optional internal notes..." name="internalNotes" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsFiled;
