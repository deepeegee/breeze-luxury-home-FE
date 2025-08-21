// src/components/property/property-single-style/single-v3/PropertyGallery.js
"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";

const MAIN_H = 520; // left image height and the right grid total height
const MAX_CARDS = 6; // 1 main + 5 thumbs

// Treat example.com as fake/demo and skip it
const BAD_HOSTS = new Set(["example.com", "www.example.com"]);
const goodUrl = (u) => {
  if (typeof u !== "string" || !/^https?:\/\//i.test(u)) return false;
  try { return !BAD_HOSTS.has(new URL(u).hostname); } catch { return false; }
};

export default function PropertyGallery({ property }) {
  if (!property) return null;

  const urls = Array.isArray(property.photos)
    ? property.photos.map(ph => ph?.url).filter(goodUrl)
    : [];

  if (urls.length === 0) {
    return (
      <div className="col-12">
        <div className="alert alert-info mb-0">No images for this property.</div>
      </div>
    );
  }

  const main = urls[0];
  const restAll = urls.slice(1);
  const restVisible = restAll.slice(0, MAX_CARDS - 1); // show at most 5 thumbs
  const moreCount = Math.max(0, restAll.length - restVisible.length);

  return (
    <Gallery>
      {/* Left: main image (fixed height) */}
      <div className="col-sm-6">
        <div className="gallery-left bdrs12 overflow-hidden">
          <Item original={main} thumbnail={main} width={1600} height={1067}>
            {({ ref, open }) => (
              <Image
                ref={ref}
                onClick={open}
                src={main}
                alt={property?.title ? `${property.title} – main` : "Property main image"}
                width={1200}
                height={MAIN_H}
                className="w-100 h-100 object-cover"
                role="button"
                priority
              />
            )}
          </Item>
        </div>
      </div>

      {/* Right: 3x2 grid that matches left height */}
      <div className="col-sm-6">
        <div className="thumb-grid">
          {restVisible.map((src, i) => {
            const isLastTile = i === restVisible.length - 1 && moreCount > 0;
            return (
              <div className="thumb bdrs12 overflow-hidden" key={`${src}-${i}`}>
                <Item original={src} thumbnail={src} width={1600} height={1067}>
                  {({ ref, open }) => (
                    <div ref={ref} onClick={open} role="button" className="thumb-inner">
                      <Image
                        src={src}
                        alt={property?.title ? `${property.title} – image ${i + 2}` : `Property image ${i + 2}`}
                        width={800}
                        height={800}
                        className="w-100 h-100 object-cover"
                      />
                      {isLastTile && (
                        <div className="thumb-overlay">
                          <span>View more</span>
                        </div>
                      )}
                    </div>
                  )}
                </Item>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .gallery-left {
          height: ${MAIN_H}px;
        }
        .thumb-grid {
          height: ${MAIN_H}px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 10px;
        }
        .thumb { position: relative; }
        .thumb-inner, .thumb :global(img) { width: 100%; height: 100%; }
        .object-cover { object-fit: cover; }

        .thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: grid;
          place-items: center;
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 14px;
        }
      `}</style>
    </Gallery>
  );
}