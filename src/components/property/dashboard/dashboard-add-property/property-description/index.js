"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { CATEGORY_OPTIONS } from "@/constants/propertyOptions";

const PropertyDescription = () => {
  const listedInOptions = [
    { value: "Active", label: "Active" },
    { value: "Processing", label: "Processing" },
  ];
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Published", label: "Published" },
  ];

  // Local state to mirror react-select values into hidden inputs
  const [category, setCategory] = useState("");
  const [listedIn, setListedIn] = useState("");
  const [status, setStatus] = useState("");

  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => setShowSelect(true), []);

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : isHovered || isFocused
        ? "#eb675312"
        : undefined,
    }),
  };

  return (
    <div className="form-style1">
      {/* Hidden inputs so the parent <form> can capture react-select values */}
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="listedIn" value={listedIn} />
      <input type="hidden" name="status" value={status} />

      <div className="row">
        {/* Title */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Property title"
              name="title"
              required
            />
          </div>
        </div>
        
        {/* Marketing / display name (optional) */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Name (optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Sky Tower Apartment"
              name="name"
            />
          </div>
        </div>
        {/* Description */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Description
            </label>
            <textarea
              cols={30}
              rows={5}
              placeholder="Describe the property..."
              name="description"
            />
          </div>
        </div>

        {/* Property ID (optional but useful) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Property ID (optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., BL001"
              name="propertyId"
            />
          </div>
        </div>

        {/* Select Category */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Select Category
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  inputId="category"
                  options={CATEGORY_OPTIONS}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="Select category"
                  value={
                    category
                      ? CATEGORY_OPTIONS.find((o) => o.value === category) ||
                        null
                      : null
                  }
                  onChange={(opt) => setCategory(opt?.value ?? "")}
                  isClearable
                />
              )}
            </div>
          </div>
        </div>

        {/* Listed in */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Listed in
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  inputId="listedIn"
                  options={listedInOptions}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="Select listing state"
                  value={
                    listedIn
                      ? listedInOptions.find((o) => o.value === listedIn) ||
                        null
                      : null
                  }
                  onChange={(opt) => setListedIn(opt?.value ?? "")}
                  isClearable
                />
              )}
            </div>
          </div>
        </div>

        {/* Property Status */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Property Status
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  inputId="status"
                  options={statusOptions}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="Select status"
                  value={
                    status
                      ? statusOptions.find((o) => o.value === status) || null
                      : null
                  }
                  onChange={(opt) => setStatus(opt?.value ?? "")}
                  isClearable
                />
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Price (₦ or $)
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="e.g., 1200000"
              name="price"
              required
            />
          </div>
        </div>

        {/* Yearly Tax Rate (optional) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Yearly Tax Rate
            </label>
            <input
              type="number"
              min={0}
              className="form-control"
              placeholder="Optional"
              name="yearlyTaxRate"
            />
          </div>
        </div>

        {/* After Price Label (optional) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              After Price Label
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., /year"
              name="afterPriceLabel"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;
