"use client";
import { AMENITY_GROUPS } from "@/constants/propertyOptions";

const Amenities = () => {
  return (
    <>
      {AMENITY_GROUPS.map((group) => (
        <div className="col-md-12" key={group.label}>
          <div className="widget-wrapper mb20">
            <h6 className="list-title">{group.label}</h6>
            <div className="checkbox-style1">
              <div className="row">
                {group.items.map((label) => {
                  const id = `amenity-${group.label}-${label}`.replace(/\s+/g, "_");
                  return (
                    <div className="col-sm-6 col-lg-4" key={id}>
                      <div className="form-check d-flex align-items-center mb10">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={id}
                          name="amenity"
                          value={label}
                        />
                        <label className="form-check-label ms10" htmlFor={id}>
                          {label}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Amenities;
