"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useUploadListingPhoto } from "@/lib/useApi";

const UploadPhotoGallery = () => {
  const [photos, setPhotos] = useState([]); // [{ url, isFeatured? }]
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { trigger: uploadFile } = useUploadListingPhoto();

  const setFeatured = (index) => {
    setPhotos((prev) => prev.map((p, i) => ({ ...p, isFeatured: i === index })));
  };

  const handleDelete = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1);
      if (removed[0]?.isFeatured && next.length > 0) {
        next[0].isFeatured = true;
      }
      return next;
    });
  };

  const handleUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);

    const incoming = [];
    for (const file of Array.from(fileList)) {
      try {
        const res = await uploadFile(file); // expects { url }
        if (res?.url) incoming.push({ url: res.url });
      } catch (e) {
        console.error("Upload failed for:", file.name, e);
      }
    }

    setPhotos((prev) => {
      const next = [...prev, ...incoming];
      if (prev.length === 0 && next.length > 0) next[0].isFeatured = true;
      return next;
    });

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <>
      {/* Hidden field collected by the parent form on submit */}
      <input type="hidden" name="photos" value={JSON.stringify(photos)} readOnly />

      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="icon mb30">
          <span className="flaticon-upload" />
        </div>
        <h4 className="title fz17 mb10">Upload/Drag photos of your property</h4>
        <p className="text mb25">Photos must be JPEG or PNG format and at least 2048×768</p>

        <button
          type="button"
          className="ud-btn btn-white"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading…" : "Browse Files"}
        </button>

        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {/* Display uploaded images */}
      <div className="row profile-box position-relative d-md-flex align-items-end mb50">
        {photos.map((photo, index) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb20" key={photo.url || index}>
            <div className="profile-img mb10 position-relative">
              <Image
                width={212}
                height={194}
                className="w-100 bdrs12 cover"
                src={photo.url}
                alt={`Photo ${index + 1}`}
              />

              {/* Delete */}
              <button
                style={{ border: "none" }}
                className="tag-del"
                title="Delete Image"
                onClick={() => handleDelete(index)}
                type="button"
                data-tooltip-id={`delete-${index}`}
              >
                <span className="fas fa-trash-can" />
              </button>
              <ReactTooltip id={`delete-${index}`} place="right" content="Delete Image" />

              {/* Featured toggle */}
              <button
                type="button"
                className={`position-absolute top-0 end-0 m-2 btn btn-sm ${
                  photo.isFeatured ? "btn-thm" : "btn-outline-secondary"
                }`}
                onClick={() => setFeatured(index)}
                data-tooltip-id={`featured-${index}`}
                title="Set as Featured"
              >
                <i className="fas fa-star" />
              </button>
              <ReactTooltip id={`featured-${index}`} place="left" content="Set as Featured" />
            </div>
            <div className="text-center fz12">
              {photo.isFeatured ? <strong>Featured</strong> : "Set as featured"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UploadPhotoGallery;
