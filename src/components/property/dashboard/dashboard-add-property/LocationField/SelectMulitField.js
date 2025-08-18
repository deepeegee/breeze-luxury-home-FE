"use client";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { State, City } from "country-state-city";

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

const SelectMulitField = () => {
  const [showSelect, setShowSelect] = useState(false);

  // Selected values
  const [stateIso, setStateIso] = useState("");   // e.g. "LA"
  const [stateName, setStateName] = useState(""); // e.g. "Lagos"
  const [cityName, setCityName] = useState("");   // e.g. "Ikoyi"

  useEffect(() => setShowSelect(true), []);

  // Load states once
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry("NG") || [];
    return states.map((s) => ({
      value: s.isoCode,
      label: s.name,
      data: s,
    }));
  }, []);

  // Load cities when state changes
  const cityOptions = useMemo(() => {
    if (!stateIso) return [];
    const cities = City.getCitiesOfState("NG", stateIso) || [];
    return cities.map((c) => ({ value: c.name, label: c.name }));
  }, [stateIso]);

  // Keep city consistent when state changes
  useEffect(() => {
    if (!stateIso) {
      setCityName("");
      setStateName("");
      return;
    }
    // If current city no longer valid, clear it
    if (cityName && !cityOptions.find((o) => o.value === cityName)) {
      setCityName("");
    }
  }, [stateIso, cityOptions, cityName]);

  return (
    <>
      {/* Hidden inputs collected by parent form */}
      <input type="hidden" name="state" value={stateName} />
      <input type="hidden" name="stateCode" value={stateIso} />
      <input type="hidden" name="city" value={cityName} />

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
                value={
                  stateIso
                    ? stateOptions.find((o) => o.value === stateIso) || null
                    : null
                }
                onChange={(opt) => {
                  const iso = opt?.value ?? "";
                  const name = opt?.data?.name ?? "";
                  setStateIso(iso);
                  setStateName(name);
                }}
                isClearable
              />
            )}
          </div>
        </div>
      </div>

      {/* City */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">City</label>
          <div className="location-area">
            {showSelect && (
              <Select
                placeholder={stateIso ? "Select city" : "Select state first"}
                options={cityOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                isDisabled={!stateIso}
                value={
                  cityName
                    ? cityOptions.find((o) => o.value === cityName) || null
                    : null
                }
                onChange={(opt) => setCityName(opt?.value ?? "")}
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
