import React from "react";
import UploadPhotoGallery from "./UploadPhotoGallery";
import VideoOptionFiled from "./VideoOptionFiled";

const UploadMedia = () => {
  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <h4 className="title fz17 mb30">Upload photos of your property</h4>

      <div className="form-style1">
        <div className="row">
          <div className="col-lg-12">
            <UploadPhotoGallery />
          </div>
        </div>

        <div className="row">
          <h4 className="title fz17 mb30">Video Option</h4>
          <VideoOptionFiled />
        </div>

        <div className="row">
          <h4 className="title fz17 mb30">Virtual Tour</h4>
          <div className="col-sm-6 col-xl-12">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">
                Virtual Tour
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Paste virtual tour URL (e.g., Matterport)"
                name="virtualTour"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;