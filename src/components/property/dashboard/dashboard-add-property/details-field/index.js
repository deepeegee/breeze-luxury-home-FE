"use client";
import React from "react";
import MultiSelectField from "./MultiSelectField";
import StructureType from "./StructureType";

const DetailsFiled = () => {
  return (
    <div className="form-style1">
      <div className="row">
        {/* Size in ft */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Size in ft (only numbers)
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 2800"
              name="sizeInFt"
            />
          </div>
        </div>

        {/* Lot Size in ft */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Lot size in ft (only numbers)
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 4000"
              name="lotSizeInFt"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Rooms</label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 6"
              name="rooms"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Bedrooms
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 4"
              name="bedrooms"
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Bathrooms
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 4"
              name="bathrooms"
            />
          </div>
        </div>

        {/* (Removed) Custom ID — we already have Property ID in Description */}
        {/* <div className="col-sm-6 col-xl-4"> ... </div> */}

        {/* (Optional) Garages */}
        {/* If you later want these, give them names and handle in backend
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Garages</label>
            <input type="number" min={0} className="form-control" name="garages" />
          </div>
        </div>
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Garage size</label>
            <input type="number" min={0} className="form-control" name="garageSize" />
          </div>
        </div>
        */}

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
            />
          </div>
        </div>

        {/* Available from */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Available from (date)
            </label>
            <input
              type="date"
              className="form-control"
              name="availableFrom"
            />
          </div>
        </div>

        {/* Optional text fields */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Basement</label>
            <input
              type="text"
              className="form-control"
              placeholder="Optional"
              name="basement"
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
            />
          </div>
        </div>

        {/* Structure Type (single select → hidden input) */}
        <StructureType />
      </div>

      <div className="row">
        {/* Floors number (react-select → hidden input) */}
        <MultiSelectField />

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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsFiled;