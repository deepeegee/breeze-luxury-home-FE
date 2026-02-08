"use client";
import React, { useMemo, useState } from "react";
import ModalVideo from "@/components/common/ModalVideo";

function safeStr(v) {
  return typeof v === "string" ? v.trim() : "";
}

function getVideoProvider(property) {
  return safeStr(property?.videoProvider);
}

function getVideoUrl(property) {
  return safeStr(property?.videoUrl);
}

function isHttpUrl(s) {
  return /^https?:\/\//i.test(s);
}

function getYouTubeIdFromUrl(url) {
  try {
    const u = new URL(url);
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id || null;
    }
    // youtube.com/watch?v=<id>
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // youtube.com/embed/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const embedIndex = parts.indexOf("embed");
    if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];
    // youtube.com/shorts/<id>
    const shortsIndex = parts.indexOf("shorts");
    if (shortsIndex !== -1 && parts[shortsIndex + 1]) return parts[shortsIndex + 1];
  } catch {}
  return null;
}

function getVimeoIdFromUrl(url) {
  try {
    const u = new URL(url);
    // vimeo.com/<id> or player.vimeo.com/video/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    // find first numeric segment
    const hit = parts.find((p) => /^\d+$/.test(p));
    return hit || null;
  } catch {}
  return null;
}

function buildEmbedSrc(provider, url) {
  const p = safeStr(provider).toLowerCase();
  const u = safeStr(url);
  if (!u) return null;

  if (p === "youtube") {
    const id = getYouTubeIdFromUrl(u);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }

  if (p === "vimeo") {
    const id = getVimeoIdFromUrl(u);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }

  if (p === "facebook") {
    // Facebook embed uses the full URL
    // https://www.facebook.com/plugins/video.php?href=<encoded>&show_text=false&autoplay=true
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      u
    )}&show_text=false&autoplay=true`;
  }

  if (p === "direct") {
    // direct file link; ModalVideo will render <video>
    return u;
  }

  // Fallback: try to iframe the provided URL (only if it is http(s))
  return isHttpUrl(u) ? u : null;
}

function buildPreviewThumb(provider, url) {
  const p = safeStr(provider).toLowerCase();
  const u = safeStr(url);
  if (!u) return null;

  if (p === "youtube") {
    const id = getYouTubeIdFromUrl(u);
    // prefer HQ, browser will fall back if missing
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  // Vimeo thumbnails require an API call, skip for now
  return null;
}

const PropertyVideo = ({ property }) => {
  const [isOpen, setOpen] = useState(false);

  const provider = useMemo(() => getVideoProvider(property), [property]);
  const videoUrl = useMemo(() => getVideoUrl(property), [property]);

  const embedSrc = useMemo(
    () => buildEmbedSrc(provider, videoUrl),
    [provider, videoUrl]
  );

  const previewThumb = useMemo(
    () => buildPreviewThumb(provider, videoUrl),
    [provider, videoUrl]
  );

  if (!videoUrl) return null;

  // Card text
  const providerLabel = provider || "Video";
  const caption =
    providerLabel.toLowerCase() === "direct"
      ? "Watch property video"
      : `Watch on ${providerLabel}`;

  return (
    <>
      <ModalVideo
        isOpen={isOpen}
        setIsOpen={setOpen}
        provider={provider}
        url={videoUrl}
        embedSrc={embedSrc}
        title={property?.title || "Property video"}
      />

      <div className="col-md-12">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-100"
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            textAlign: "left",
          }}
        >
          <div
            className="bdrs12 overflow-hidden position-relative"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              backgroundColor: "#0f0f10",
              backgroundImage: previewThumb ? `url(${previewThumb})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* dark overlay for readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)",
              }}
            />

            {/* play button */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span
                  className="flaticon-play"
                  style={{ color: "#fff", fontSize: 22, marginLeft: 3 }}
                />
              </div>
            </div>

            {/* bottom label */}
            <div
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                bottom: 12,
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.9 }}>{caption}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Click to play
              </div>
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default PropertyVideo;
