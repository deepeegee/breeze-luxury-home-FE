"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";

/* ---------------- helpers ---------------- */

const FALLBACKS = [
  "/images/listings/listing-single-9.jpg",
  "/images/listings/listing-single-2.jpg",
  "/images/listings/listing-single-3.jpg",
  "/images/listings/listing-single-4a.jpg",
  "/images/listings/listing-single-5.jpg",
];

// Treat these as “fake/demo” hosts (payload samples)
const BAD_HOSTS = new Set(["example.com", "www.example.com"]);

const ORIG_W = 1600, ORIG_H = 1067; // lightbox dimensions (safe defaults)
const MAIN_W = 610,  MAIN_H = 507;
const THUMB_W = 270, THUMB_H = 250;

function hostOf(u) {
  try { return new URL(u).hostname; } catch { return null; }
}
function isHttpUrl(u) {
  return typeof u === "string" && /^https?:\/\//i.test(u);
}
function isGoodUrl(u) {
  if (!isHttpUrl(u)) return false;
  const h = hostOf(u);
  return h && !BAD_HOSTS.has(h);
}

function pushUrl(arr, maybe) {
  if (!maybe) return;
  if (typeof maybe === "string") arr.push(maybe);
  else if (maybe && typeof maybe === "object") {
    const u = maybe.url || maybe.src;
    if (u) arr.push(u);
  }
}

function collectAllUrls(p) {
  const out = [];

  // photos (featured first)
  if (Array.isArray(p?.photos)) {
    const sorted = [...p.photos].sort(
      (a, b) => (b?.isFeatured ? 1 : 0) - (a?.isFeatured ? 1 : 0)
    );
    sorted.forEach(x => pushUrl(out, x?.url ? x : x?.src ? x : x));
  }

  // common alternative fields
  const arrays = [p?.gallery, p?.images, p?.media?.photos, p?.media?.images];
  arrays.forEach(arr => Array.isArray(arr) && arr.forEach(x => pushUrl(out, x)));

  // single image-ish fields
  [p?.image, p?.cover, p?.thumbnail, p?.heroImage, p?.mainImage].forEach(u => pushUrl(out, u));

  // de-dupe while preserving order
  const seen = new Set();
  return out.filter(u => {
    const key = String(u);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickGallery(property) {
  const raw = collectAllUrls(property);

  const valid = raw.filter(isGoodUrl);
  if (valid.length) {
    return { urls: valid, usedFallbacks: false };
  }

  // payload had only fake/example images -> show placeholders (this sample case only)
  const hadFakes = raw.some(u => BAD_HOSTS.has(hostOf(u)));
  if (hadFakes) {
    return { urls: FALLBACKS, usedFallbacks: true };
  }

  // truly no images -> render nothing (no placeholders)
  return { urls: [], usedFallbacks: false };
}

/* ---------------- component ---------------- */

export default function PropertyGallery({ property }) {
  if (!property) return null;

  const { urls, usedFallbacks } = pickGallery(property);

  // No images and no “example” placeholders requested -> render nothing
  if (!urls.length && !usedFallbacks) return null;

  const main = urls[0] ?? FALLBACKS[0];
  const rest = urls.slice(1);

  return (
    <Gallery>
      <div className="col-sm-6">
        <div className="sp-img-content mb15-lg">
          <div className="popup-img preview-img-1 sp-v3 sp-img">
            <Item original={main} thumbnail={main} width={ORIG_W} height={ORIG_H}>
              {({ ref, open }) => (
                <Image
                  src={main}
                  width={MAIN_W}
                  height={MAIN_H}
                  ref={ref}
                  onClick={open}
                  alt={property?.title ? `${property.title} – main` : "Property main image"}
                  role="button"
                  className="w-100 h-100 cover"
                />
              )}
            </Item>
          </div>
        </div>
      </div>

      <div className="col-sm-6">
        <div className="row">
          {rest.map((src, i) => (
            <div className="col-4 ps-sm-0" key={`${src}-${i}`}>
              <div className="sp-img-content at-sp-v3">
                <div className="popup-img preview-img-4 sp-img mb10">
                  <Item original={src} thumbnail={src} width={ORIG_W} height={ORIG_H}>
                    {({ ref, open }) => (
                      <Image
                        width={THUMB_W}
                        height={THUMB_H}
                        className="w-100 h-100 cover"
                        ref={ref}
                        onClick={open}
                        role="button"
                        src={src}
                        alt={property?.title ? `${property.title} – image ${i + 2}` : `Property image ${i + 2}`}
                      />
                    )}
                  </Item>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Gallery>
  );
}