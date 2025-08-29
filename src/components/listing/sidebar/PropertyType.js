'use client';

import React, { useMemo } from "react";

// canonical property categories
const CAT_OPTIONS = [
  { value: "Fully-Detached Duplex", label: "Duplex" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Apartment", label: "Apartments" },
  { value: "Townhome", label: "Town home" },
  { value: "Office", label: "Offices" },
  { value: "Factory", label: "Factory" },
  { value: "Land & Plots", label: "Land & Plots" },
];

const PropertyType = ({ filterFunctions = {} }) => {
  const {
    setPropertyTypes = () => {},
    propertyTypes: selectedTypes = [],
    handlepropertyTypes = undefined, // optional alias
  } = filterFunctions || {};

  // convenience: use alias if exists
  const handleToggle = handlepropertyTypes || ((type) => {
    const isSelected = selectedTypes.includes(type);
    if (isSelected) {
      // remove type
      setPropertyTypes(selectedTypes.filter((t) => t !== type));
    } else {
      // add type
      setPropertyTypes([...selectedTypes, type]);
    }
  });

  const isAllChecked = selectedTypes.length === 0;

  return (
    <div>
      {/* All Option */}
      <label className="custom_checkbox">
        All
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={() => setPropertyTypes([])}
        />
        <span className="checkmark" />
      </label>

      {/* Property Type Options */}
      {CAT_OPTIONS.map((option) => {
        const checked = selectedTypes.includes(option.value);
        return (
          <label className="custom_checkbox" key={option.value}>
            {option.label}
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleToggle(option.value)}
            />
            <span className="checkmark" />
          </label>
        );
      })}
    </div>
  );
};

export default PropertyType;
