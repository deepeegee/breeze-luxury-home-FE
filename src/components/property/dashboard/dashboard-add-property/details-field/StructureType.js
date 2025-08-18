"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const structureTypeOptions = [
  { value: "Brick", label: "Brick" },
  { value: "Wood", label: "Wood" },
  { value: "Concrete", label: "Concrete" },
  { value: "Other", label: "Other" },
];

const customStyles = {
  option: (styles, { isFocused, isSelected, isHovered }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#eb6753"
      : (isHovered || isFocused)
      ? "#eb675312"
      : undefined,
  }),
};

const StructureType = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => setShowSelect(true), []);

  return (
    <div className="col-sm-6 col-xl-4">
      <input type="hidden" name="structureType" value={value} />
      <div className="mb20">
        <label className="heading-color ff-heading fw600 mb10">Structure type</label>
        <div className="location-area">
          {showSelect && (
            <Select
              styles={customStyles}
              className="select-custom pl-0"
              classNamePrefix="select"
              placeholder="Select structure type"
              options={structureTypeOptions}
              isMulti={false}
              value={value ? structureTypeOptions.find((o) => o.value === value) : null}
              onChange={(opt) => setValue(opt?.value ?? "")}
              isClearable
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StructureType;