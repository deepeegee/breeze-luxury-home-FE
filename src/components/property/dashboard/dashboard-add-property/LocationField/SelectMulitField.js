"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import NaijaStates from "naija-state-local-government";

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#eb6753" : isFocused ? "#eb675312" : undefined,
  }),
};

function getLgasSafely(stateName) {
  if (!stateName) return [];
  const lgaResp = (NaijaStates.lgas ?? NaijaStates.lga)?.(stateName);
  if (Array.isArray(lgaResp)) return lgaResp;
  if (Array.isArray(lgaResp?.lgas)) return lgaResp.lgas;
  return [];
}

const SelectMulitField = () => {
  const [showSelect, setShowSelect] = useState(false);

  // Selected values
  const [stateName, setStateName] = useState(""); // e.g. "Lagos"
  const [lgaName, setLgaName] = useState("");     // e.g. "Ikorodu"

  useEffect(() => setShowSelect(true), []);

  // States
  const stateOptions = useMemo(() => {
    const list = (NaijaStates.states && NaijaStates.states()) || [];
    return list
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ value: name, label: name }));
  }, []);

  // LGAs for the chosen state
  const lgaOptions = useMemo(() => {
    if (!stateName) return [];
    const lgas = getLgasSafely(stateName);
    return lgas
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ value: name, label: name }));
  }, [stateName]);

  // Reset LGA if invalid after state change
  useEffect(() => {
    if (!stateName) {
      setLgaName("");
      return;
    }
    if (lgaName && !lgaOptions.find((o) => o.value === lgaName)) {
      setLgaName("");
    }
  }, [stateName, lgaOptions, lgaName]);

  return (
    <>
      {/* Hidden inputs collected by parent form */}
      <input type="hidden" name="state" value={stateName} />
      <input type="hidden" name="stateCode" value="" />
      <input type="hidden" name="lga" value={lgaName} />
      {/* Submit LGA as city */}
      <input type="hidden" name="city" value={lgaName} />

      {/* State */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">State</label>
          <div className="location-area">
            {showSelect && (
              <Select
                placeholder="Select state"
                options={stateOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                value={stateName ? stateOptions.find((o) => o.value === stateName) : null}
                onChange={(opt) => setStateName(opt?.value ?? "")}
                isClearable
              />
            )}
          </div>
        </div>
      </div>

      {/* LGA */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">LGA</label>
          <div className="location-area">
            {showSelect && (
              <Select
                placeholder={stateName ? "Select LGA" : "Select state first"}
                options={lgaOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                isDisabled={!stateName}
                value={lgaName ? lgaOptions.find((o) => o.value === lgaName) : null}
                onChange={(opt) => setLgaName(opt?.value ?? "")}
                isClearable
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectMulitField;
