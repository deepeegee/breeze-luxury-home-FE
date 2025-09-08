"use client";
import React from "react";
import MultiSelectField from "./MultiSelectField";

const DetailsFiled = () => {
  return (
    <div className="form-style1" autoComplete="off">
      <div className="row">
        {/* Land size */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Land size (sq ft)
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 5000"
              name="sizeInFt"
              autoComplete="off"
            />
          </div>
        </div>
        <MultiSelectField />

        {/* Bedrooms */}
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
              autoComplete="off"
            />
          </div>
        </div>

        {/* Bathrooms */}
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
              autoComplete="off"
            />
          </div>
        </div>

        {/* Year built */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Year built (numeric)
            </label>
            <input
              type="number"
              min={1800}
              max={3000}
              className="form-control"
              placeholder="e.g., 2023"
              name="yearBuilt"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Available from */}
        {/* <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Available from (date)
            </label>
            <input
              type="date"
              className="form-control"
              name="availableFrom"
              autoComplete="off"
            />
          </div>
        </div> */}

        {/* Optional text fields */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Basement</label>
            <input
              type="text"
              className="form-control"
              placeholder="Optional"
              name="basement"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Extra details
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Optional"
              name="extraDetails"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Roofing</label>
            <input
              type="text"
              className="form-control"
              placeholder="Optional"
              name="roofing"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Exterior Material
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Optional"
              name="exteriorMaterial"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Floors */}

        {/* Notes */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Owner/Agent notes (not visible on front end)
            </label>
            <textarea
              cols={30}
              rows={5}
              placeholder="Optional internal notes..."
              name="internalNotes"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsFiled;
