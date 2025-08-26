"use client";
import React, { useState } from "react";
import Slider from "rc-slider";

const PriceRange = ({ filterFunctions = {} }) => {
  const {
    priceRange = [0, 100000],
    handlepriceRange = () => {},
  } = filterFunctions;

  const [price, setPrice] = useState(priceRange);

  const handleOnChange = (value) => {
    setPrice(value);
    handlepriceRange([value[0] || 0, value[1]]);
  };

  return (
    <div className="range-wrapper">
      <Slider
        range
        max={100000}
        min={0}
        value={price} // controlled instead of defaultValue
        onChange={handleOnChange}
        id="slider"
      />
      <div className="d-flex align-items-center">
        <span id="slider-range-value1">₦{price[0]}</span>
        <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
        <span id="slider-range-value2">₦{price[1]}</span>
      </div>
    </div>
  );
};

export default PriceRange;