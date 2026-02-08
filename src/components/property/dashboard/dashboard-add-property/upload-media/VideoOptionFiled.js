"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const videoField = [
  { value: "Youtube", label: "Youtube" },
  { value: "Facebook", label: "Facebook" },
  { value: "Vimeo", label: "Vimeo" },
  { value: "Other", label: "Other" },
];

const customStyles = {
  option: (styles, state) => {
    const { isFocused, isSelected, isHovered } = state || {};
    return {
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : (isHovered || isFocused)
        ? "#eb675312"
        : undefined,
    };
  },

  /* ✅ ensure it sits above modals/cards */
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
};


const VideoOptionFiled = (props) => {
  const { defaultProvider = "", defaultUrl = "" } = props || {};

  const [showSelect, setShowSelect] = useState(false);
  const [provider, setProvider] = useState(defaultProvider);
  const [videoUrl, setVideoUrl] = useState(defaultUrl);

  useEffect(() => {
    setShowSelect(true);
  }, []);

  return (
    <>
      {/* Hidden inputs for the parent form */}
      <input type="hidden" name="videoProvider" value={provider} />
      <input type="hidden" name="videoUrl" value={videoUrl} />

      <div className="col-sm-6 col-xl-4">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">Video from</label>
          <div className="location-area">
            {showSelect && (
              <Select
              options={videoField}
              styles={customStyles}
              className="select-custom pl-0"
              classNamePrefix="select"
              placeholder="Select a platform"
              isMulti={false}
              value={provider ? videoField.find((v) => v.value === provider) || null : null}
              onChange={(opt) => setProvider((opt && opt.value) || "")}
              isClearable
            
              /* ✅ prevent cropping */
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              menuPosition="fixed"
            />            
            )}
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-8">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">Video URL</label>
          <input
            type="url"
            className="form-control"
            placeholder="Paste the video link (YouTube/Vimeo/Facebook)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            autoComplete="off"
          />
          <div className="fz12 text-muted mt-2">
            Paste the full link. Users will see it embedded on the listing page.
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoOptionFiled;
