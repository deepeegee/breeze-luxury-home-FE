"use client";
import React from "react";
import { AMENITY_GROUPS } from "@/constants/propertyOptions";

// safer id to handle punctuation/special chars (e.g. curly apostrophes)
const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Amenities = () => {
  return (
    <div className="row">
      {AMENITY_GROUPS.map((group) => (
        <div key={group.label} className="col-12 mb20">
          <h6 className="list-title mb10">{group.label}</h6>
          <div className="checkbox-style1">
            <div className="row">
              {group.items.map((label) => {
                const id = `amenity-${slug(group.label)}-${slug(label)}`;
                return (
                  <div key={id} className="col-sm-6 col-lg-4 col-xxl-3">
                    <label className="custom_checkbox" htmlFor={id}>
                      {label}
                      <input
                        id={id}
                        type="checkbox"
                        name="amenities"
                        value={label}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Amenities;