"use client";
import ModalVideo from "@/components/common/ModalVideo";
import React, { useState } from "react";

const PropertyVideo = ({ property }) => {
  const [isOpen, setOpen] = useState(false);
  
  // Use property video ID if available, otherwise fallback to default
  const videoId = property?.videoId || "7EHnQ0VM4KY";

  return (
    <>
      <ModalVideo setIsOpen={setOpen} isOpen={isOpen} videoId={videoId} />
      <div className="col-md-12">
        <div className="property_video bdrs12 w-100">
          <button
            className="video_popup_btn mx-auto popup-img"
            onClick={() => setOpen(true)}
            style={{ border: "none", background: "transparent" }}
          >
            <span className="flaticon-play" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PropertyVideo;
