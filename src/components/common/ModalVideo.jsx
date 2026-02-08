"use client";
import React, { useEffect, useState } from "react";

const ModalVideo = ({ isOpen, setIsOpen, provider, url, embedSrc, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) setIsLoaded(false);
  }, [isOpen]);

  const closeModal = () => setIsOpen(false);

  if (!isOpen) return null;

  const p = (provider || "").toLowerCase();
  const isDirect = p === "direct";

  return (
    <div style={overlayStyle} onClick={closeModal} role="dialog" aria-modal="true">
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} type="button" style={closeButtonStyle} aria-label="Close video">
          ×
        </button>

        <div style={responsiveContainerStyle}>
          {/* Loader overlay */}
          {!isLoaded && (
            <div style={loaderStyle}>
              <div style={spinnerStyle} />
              <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
                Loading video
              </div>
            </div>
          )}

          {isDirect ? (
            <video
              src={url}
              controls
              autoPlay
              playsInline
              onCanPlay={() => setIsLoaded(true)}
              style={videoStyle}
            />
          ) : (
            <iframe
              src={embedSrc || url}
              title={title || "Video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoaded(true)}
              style={iframeStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.82)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1200,
  padding: 16,
};

const modalStyle = {
  position: "relative",
  width: "min(1100px, 96vw)",
  backgroundColor: "#0b0b0c", // dark surface, no white flash
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.45)",
};

const closeButtonStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  width: 38,
  height: 38,
  borderRadius: 999,
  fontSize: 26,
  lineHeight: "38px",
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  cursor: "pointer",
  zIndex: 3,
};

const responsiveContainerStyle = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  backgroundColor: "#000",
};

const iframeStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: "0",
};

const videoStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: "0",
  backgroundColor: "#000",
};

const loaderStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  zIndex: 2,
};

const spinnerStyle = {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "3px solid rgba(255,255,255,0.25)",
  borderTopColor: "rgba(255,255,255,0.95)",
  animation: "spin 0.9s linear infinite",
};

export default ModalVideo;
