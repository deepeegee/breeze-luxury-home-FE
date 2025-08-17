'use client'

import React from "react";

const PropertyType = ({ filterFunctions = {} }) => {
  // safe fallbacks so we never read .length on undefined
  const {
    propertyTypes = [],
    setPropertyTypes = () => {},
    handlepropertyTypes = () => {},
  } = filterFunctions || {};

  const options = [
    { label: "Houses" },
    { label: "Apartments" },
    { label: "Office" },
    { label: "Villa" },
  ];

  const isAllChecked = propertyTypes.length === 0;

  return (
    <>
      <label className="custom_checkbox">
        All
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={() => setPropertyTypes([])}
        />
        <span className="checkmark" />
      </label>

      {options.map((option, index) => {
        const checked = propertyTypes.includes(option.label);
        return (
          <label className="custom_checkbox" key={index}>
            {option.label}
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handlepropertyTypes(option.label)}
            />
            <span className="checkmark" />
          </label>
        );
      })}
    </>
  );
};

export default PropertyType;
