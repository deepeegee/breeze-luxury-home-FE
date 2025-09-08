"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { CATEGORY_OPTIONS, DOCUMENT_GROUPS } from "@/constants/propertyOptions";

const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
              autoComplete="off"
            />
          </div>
        </div>

        {/* Marketing / display name (optional) */}
        {/* <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Name (optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Sky Tower Apartment"
              name="name"
              autoComplete="off"
            />
          </div>
        </div> */}

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
              Price (₦)
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
        {/* Listed In */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Listed In
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  inputId="listedIn"
                  options={[
                    { value: "All Listing", label: "All Listing" },
                    { value: "Active", label: "Active" },
                    { value: "Sold", label: "Sold" },
                  ]}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  placeholder="Select listed state"
                  /* mirror into hidden input via local state (like category/status) */
                  value={
                    listedIn
                      ? [
                          { value: "All Listing", label: "All Listing" },
                          { value: "Active", label: "Active" },
                          { value: "Sold", label: "Sold" },
                        ].find((o) => o.value === listedIn) || null
                      : null
                  }
                  onChange={(opt) => setListedIn(opt?.value ?? "")}
                  isClearable
                />
              )}
            </div>
          </div>
        </div>

        {/* Property Documents (embedded) */}
        <div className="col-12">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Property Documents
            </label>

            <div className="row">
              {DOCUMENT_GROUPS.map((group) => (
                <div key={group.label} className="col-12 mb20">
                  <h6 className="list-title mb10">{group.label}</h6>
                  <div className="checkbox-style1">
                    <div className="row">
                      {group.items.map((label) => {
                        const id = `doc-${slug(group.label)}-${slug(label)}`;
                        return (
                          <div key={id} className="col-sm-6 col-lg-4 col-xxl-3">
                            <label className="custom_checkbox" htmlFor={id}>
                              {label}
                              <input
                                id={id}
                                type="checkbox"
                                name="documents" // backend receives as documents[]
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

              {/* Optional free-text for uncommon docs */}
              <div className="col-12 mt10">
                <label className="heading-color ff-heading fw600 mb10">
                  Other Document (optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type any additional document"
                  name="documentsOther"
                />
              </div>
            </div>
          </div>
        </div>

        {/* (Optional fields you commented out earlier remain omitted) */}
      </div>
    </div>
  );
};

export default PropertyDescription;
