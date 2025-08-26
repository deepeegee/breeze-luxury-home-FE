// src/components/property/property-single-style/single-v3/PropertyGallery.js
"use client";

import { useMemo, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import NextImage from "next/image";

const MAX_CARDS = 6;
const isHttpUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

export default function PropertyGallery({ property }) {
  if (!property) return null;

  const urls = useMemo(
    () =>
      Array.isArray(property?.photos)
        ? property.photos.map((ph) => ph?.url).filter(isHttpUrl)
        : [],
    [property]
  );

  const [dims, setDims] = useState({});
  const rememberSize = (url) => (e) => {
    const w = e.currentTarget.naturalWidth;
    const h = e.currentTarget.naturalHeight;
    if (!w || !h) return;
    setDims((prev) => (prev[url]?.w ? prev : { ...prev, [url]: { w, h } }));
  };

  // Function to get gallery dimensions (larger for PhotoSwipe)
  const getGalleryDimensions = (url) => {
    const originalDims = dims[url];
    if (!originalDims) {
      // Default large dimensions for gallery
      return { w: 1920, h: 1280 };
    }
    
    // Scale up the original dimensions while maintaining aspect ratio
    const aspectRatio = originalDims.w / originalDims.h;
    const minWidth = 1200;
    
    if (originalDims.w < minWidth) {
      return {
        w: minWidth,
        h: Math.round(minWidth / aspectRatio)
      };
    }
    
    return originalDims;
  };

  if (urls.length === 0) {
    return (
      <div className="col-12">
        <div className="alert alert-info mb-0">No images for this property.</div>
      </div>
    );
  }

  const main = urls[0];
  const restAll = urls.slice(1);
  const restVisible = restAll.slice(0, MAX_CARDS - 1);
  const moreCount = Math.max(0, restAll.length - restVisible.length);

  return (
    <Gallery options={{ wheelToZoom: true }}>
      <div className="gallery-wrapper">
        <div className="row g-3 g-lg-4 align-items-start">
          {/* LEFT — reduced even further */}
          <div className="col-lg-6">
            <div className="left-wrap bdrs12 overflow-hidden">
              {dims[main] ? (
                <Item
                  original={main}
                  thumbnail={main}
                  width={getGalleryDimensions(main).w}
                  height={getGalleryDimensions(main).h}
                >
                  {({ ref, open }) => (
                    <div ref={ref} onClick={open} role="button" className="clickable">
                      <NextImage
                        src={main}
                        alt={property?.title ? `${property.title} – main` : "Property main image"}
                        width={dims[main].w}
                        height={dims[main].h}
                        sizes="(max-width: 991px) 100vw, 46vw"
                        priority
                        onLoad={rememberSize(main)}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  )}
                </Item>
              ) : (
                <Item
                  original={main}
                  thumbnail={main}
                  width={1920}
                  height={1280}
                >
                  {({ ref, open }) => (
                    <div ref={ref} onClick={open} role="button" className="clickable">
                      <NextImage
                        src={main}
                        alt={property?.title ? `${property.title} – main` : "Property main image"}
                        width={1600}
                        height={1067}
                        sizes="(max-width: 991px) 100vw, 46vw"
                        priority
                        onLoad={rememberSize(main)}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  )}
                </Item>
              )}
            </div>
          </div>

          {/* RIGHT — switched to 3-column grid for balance */}
          <div className="col-lg-6">
            <div className="thumb-grid">
              {restVisible.map((src, i) => {
                const d = dims[src];
                const isLastTile = i === restVisible.length - 1 && moreCount > 0;

                return (
                  <div className="thumb bdrs12 overflow-hidden" key={`${src}-${i}`}>
                    {d ? (
                      <Item 
                        original={src} 
                        thumbnail={src} 
                        width={getGalleryDimensions(src).w} 
                        height={getGalleryDimensions(src).h}
                      >
                        {({ ref, open }) => (
                          <div ref={ref} onClick={open} role="button" className="thumb-inner clickable">
                            <NextImage
                              src={src}
                              alt={
                                property?.title
                                  ? `${property.title} – image ${i + 2}`
                                  : `Property image ${i + 2}`
                              }
                              width={d.w}
                              height={d.h}
                              sizes="(max-width: 575px) 50vw, (max-width: 991px) 30vw, 14vw"
                              onLoad={rememberSize(src)}
                              style={{ width: "100%", height: "auto", display: "block" }}
                            />
                            {isLastTile && (
                              <div className="thumb-overlay">
                                <span>View more</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Item>
                    ) : (
                      <Item 
                        original={src} 
                        thumbnail={src} 
                        width={1920} 
                        height={1280}
                      >
                        {({ ref, open }) => (
                          <div ref={ref} onClick={open} role="button" className="thumb-inner clickable">
                            <NextImage
                              src={src}
                              alt={
                                property?.title
                                  ? `${property.title} – image ${i + 2}`
                                  : `Property image ${i + 2}`
                              }
                              width={1200}
                              height={900}
                              sizes="(max-width: 575px) 50vw, (max-width: 991px) 30vw, 14vw"
                              onLoad={rememberSize(src)}
                              style={{ width: "100%", height: "auto", display: "block" }}
                            />
                            {isLastTile && (
                              <div className="thumb-overlay">
                                <span>View more</span>
                              </div>
                            )}
                          </div>
                        )}
                      </Item>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Shrink entire gallery block and center it */
        .gallery-wrapper {
          max-width: 900px;
          margin: 0 auto;
        }

        .left-wrap {
          background: #f3f4f6;
          border-radius: 12px;
        }

        .clickable {
          cursor: zoom-in;
        }

        /* 3-column thumbnails for lighter look */
        .thumb-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .thumb {
          background: #f3f4f6;
          border-radius: 12px;
        }

        .thumb-inner {
          position: relative;
        }

        /* Keep aspect ratio everywhere */
        .left-wrap :global(img),
        .thumb-inner :global(img) {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: grid;
          place-items: center;
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 14px;
        }

        @media (max-width: 991.98px) {
          .gallery-wrapper {
            max-width: 100%;
          }
          .thumb-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 575.98px) {
          .thumb-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </Gallery>
  );
}