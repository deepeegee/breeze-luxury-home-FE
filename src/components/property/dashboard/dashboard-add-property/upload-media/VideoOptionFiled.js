"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const videoField = [
  { value: "Youtube", label: "Youtube" },
  { value: "Facebook", label: "Facebook" },
  { value: "Vimeo", label: "Vimeo" },
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

const VideoOptionFiled = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [provider, setProvider] = useState("");

  useEffect(() => {
    setShowSelect(true);
  }, []);

  return (
    <>
      {/* Hidden input mirrors the selected provider for the parent form */}
      <input type="hidden" name="videoProvider" value={provider} />

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
                value={provider ? videoField.find((v) => v.value === provider) ?? null : null}
                onChange={(opt) => setProvider(opt?.value ?? "")}
                isClearable
              />
            )}
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-4">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">Embed Video ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., YouTube video ID"
            name="videoId"
          />
        </div>
      </div>
    </>
  );
};

export default VideoOptionFiled;