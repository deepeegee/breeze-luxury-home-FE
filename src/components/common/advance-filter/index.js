"use client";
import Select from "react-select";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORY_OPTIONS } from "@/constants/propertyOptions";

const AdvanceFilterModal = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [type, setType] = useState("");
  const [loc, setLoc] = useState("");
  const router = useRouter();

  useEffect(() => { setShowSelect(true); }, []);

  const locationOptions = [
    { value: "All Cities", label: "All Cities" },
    { value: "Lagos", label: "Lagos" },
    { value: "Victoria Island", label: "Victoria Island" },
    { value: "Lekki", label: "Lekki" },
    { value: "Ajah", label: "Ajah" },
    { value: "Abuja", label: "Abuja" },
    // add/adjust to your market
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : (isHovered || isFocused) ? "#eb675312" : undefined,
    }),
  };

  const onReset = () => {
    setType("");
    setLoc("");
    router.push("/grid-full-3-col");
  };

  const onSearch = (e) => {
    e?.preventDefault?.();
    const qs = new URLSearchParams();

    // Price from slider labels rendered by <PriceRange/>
    const minTxt = document.getElementById("slider-range-value1")?.textContent || "";
    const maxTxt = document.getElementById("slider-range-value2")?.textContent || "";
    const minPrice = (minTxt.match(/\d+/g) || []).join("");
    const maxPrice = (maxTxt.match(/\d+/g) || []).join("");
    if (minPrice) qs.set("minPrice", minPrice);
    if (maxPrice) qs.set("maxPrice", maxPrice);

    // Category (Select Category) and Location
    if (type) qs.set("type", type);
    if (loc && loc !== "All Cities") qs.set("location", loc);

    // Bedrooms / Bathrooms (radio groups rendered by components)
    const bedLabel = document.querySelector('input[name="xbeds"]:checked')?.nextElementSibling?.textContent || "";
    const bathLabel = document.querySelector('input[name="ybath"]:checked')?.nextElementSibling?.textContent || "";
    const beds = parseInt((bedLabel.match(/\d+/) || [0])[0], 10) || 0;
    const baths = parseInt((bathLabel.match(/\d+/) || [0])[0], 10) || 0;
    if (beds) qs.set("beds", String(beds));
    if (baths) qs.set("baths", String(baths));

    const amenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked'))
      .map(el => el.value);
    if (amenities.length) qs.set("amenities", amenities.join(","));

    router.push(`/grid-full-3-col?${qs.toString()}`);
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title" id="exampleModalLabel">
            More Filter
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>

        <div className="modal-body pb-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Price Range</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Select Category */}
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Select Category</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select
                      placeholder="Select category"
                      options={CATEGORY_OPTIONS}
                      styles={customStyles}
                      className="select-custom"
                      classNamePrefix="select"
                      onChange={(opt) => setType(opt?.value ?? "")}
                      value={type ? CATEGORY_OPTIONS.find((o) => o.value === type) : null}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Property ID (optional) */}
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Property ID</h6>
                <div className="form-style2">
                  <input type="text" className="form-control" placeholder="e.g., BL001"
                         onBlur={(e)=> {
                           const val = e.target.value.trim()
                           if (val) {
                             // keep in URL if used; ProperteyFiltering ignores server-side, but you can wire it
                             const qs = new URLSearchParams(window.location.search);
                             qs.set("propertyId", val);
                           }
                         }}/>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Bedrooms */}
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bedrooms</h6>
                <div className="d-flex">
                  <Bedroom />
                </div>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bathrooms</h6>
                <div className="d-flex">
                  <Bathroom />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Location */}
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select
                      placeholder="Select location"
                      options={locationOptions}
                      styles={customStyles}
                      className="select-custom"
                      classNamePrefix="select"
                      onChange={(opt) => setLoc(opt?.value ?? "")}
                      value={loc ? locationOptions.find((o) => o.value === loc) : locationOptions[0]}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Square Feet (optional UI only; not yet bound to URL) */}
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Square Feet</h6>
                <div className="space-area">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-style1">
                      <input type="text" className="form-control" placeholder="Min." />
                    </div>
                    <span className="dark-color">-</span>
                    <div className="form-style1">
                      <input type="text" className="form-control" placeholder="Max" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper mb0">
                <h6 className="list-title mb10">Amenities</h6>
              </div>
            </div>
            <Amenities />
          </div>
        </div>

        <div className="modal-footer justify-content-between">
          <button className="reset-button" onClick={onReset}>
            <span className="flaticon-turn-back" />
            <u>Reset all filters</u>
          </button>
          <div className="btn-area">
            <button data-bs-dismiss="modal" type="submit" className="ud-btn btn-thm" onClick={onSearch}>
              <span className="flaticon-search align-text-top pr10" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceFilterModal;
