"use client";
import React from "react";
import SelectMulitField from "./SelectMulitField"; // keep this import name to match your file

const LocationField = () => {
  return (
    <div className="form-style1">
      {/* Country is fixed */}
      <input type="hidden" name="country" value="Nigeria" />

      <div className="row">
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 5 Parkview Estate"
              name="address"
              required
            />
          </div>
        </div>

        {/* Nigeria-only State & City (from package) */}
        <SelectMulitField />

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Zip / Postal Code</label>
            <input type="text" className="form-control" placeholder="Optional" name="zip" />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Neighborhood</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Ikoyi, Lekki Phase 1"
              name="neighborhood"
            />
          </div>
        </div>
      </div>
  </div>
  );
};

export default LocationField;