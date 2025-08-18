"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";

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

const MultiSelectField = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [floorsNo, setFloorsNo] = useState("");

  useEffect(() => setShowSelect(true), []);

  const floorOptions = useMemo(() => {
    // 1–20 floors (tweak as needed)
    return Array.from({ length: 20 }, (_, i) => {
      const n = i + 1;
      return { value: String(n), label: `${n}` };
    });
  }, []);

  return (
    <>
      {/* Hidden input collected by parent form */}
      <input type="hidden" name="floorsNo" value={floorsNo} />

      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">Floors no</label>
          <div className="location-area">
            {showSelect && (
              <Select
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                placeholder="Select number of floors"
                options={floorOptions}
                isMulti={false}
                value={floorsNo ? floorOptions.find((o) => o.value === floorsNo) : null}
                onChange={(opt) => setFloorsNo(opt?.value ?? "")}
                isClearable
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiSelectField;