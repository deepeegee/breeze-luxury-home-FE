"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import { useCreateListing } from "@/lib/useApi";

/* ---------- Helpers ---------- */
const numOrUndefined = (v) => {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

const posNumOrUndefined = (v) => {
  const n = numOrUndefined(v);
  return n != null && n > 0 ? n : undefined;
};

const posIntOrUndefined = (v) => {
  const n = numOrUndefined(v);
  return n != null && n >= 1 ? Math.floor(n) : undefined;
};

const toISODateOrUndefined = (d) => {
  if (!d) return undefined;
  try {
    const s = String(d).trim();
    if (!s) return undefined;
    return new Date(s).toISOString();
  } catch {
    return undefined;
  }
};

const parsePhotos = (json) => {
  if (!json) return undefined;
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return undefined;
    return arr
      .map((p) =>
        p && p.url ? { url: String(p.url), isFeatured: !!p.isFeatured } : null
      )
      .filter(Boolean);
  } catch {
    return undefined;
  }
};

const parseNearby = (json) => {
  if (!json) return undefined;
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return undefined;
    return arr
      .map((n) => ({
        label: (n?.label ?? "").trim(),
        distance: (n?.distance ?? "").trim(),
        category: (n?.category ?? "").trim(),
      }))
      .filter((n) => n.label); // keep rows with at least a label
  } catch {
    return undefined;
  }
};

const prune = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        !(typeof v === "string" && v.trim() === "")
    )
  );

const AddPropertyTabContent = () => {
  const router = useRouter();
  const { trigger: createListing } = useCreateListing();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);

      const title = fd.get("title");
      const price = numOrUndefined(fd.get("price"));

      if (!title || price == null) {
        setSubmitting(false);
        setSubmitError("Please provide at least Title and Price.");
        return;
      }

      const bedrooms = posIntOrUndefined(fd.get("bedrooms"));
      const bathrooms = posIntOrUndefined(fd.get("bathrooms"));
      if (bedrooms == null || bathrooms == null) {
        setSubmitting(false);
        setSubmitError("Please provide Bedrooms and Bathrooms (min 1).");
        return;
      }

      const sizeInFt = posNumOrUndefined(fd.get("sizeInFt"));
      const rooms = posIntOrUndefined(fd.get("rooms"));
      const floorsNo = posIntOrUndefined(fd.get("floorsNo"));
      const yearBuilt = numOrUndefined(fd.get("yearBuilt"));

      // NEW: read nearby JSON (hidden input from LocationField.NearbyEditor)
      const nearbyJson = fd.get("nearby");
      const nearby = parseNearby(nearbyJson);

      const payload = prune({
        title: String(title),
        description: fd.get("description"),
        name: fd.get("name"),
        category: fd.get("category"),
        listedIn: fd.get("listedIn"),
        status: fd.get("status"),
        price,
        photos: parsePhotos(fd.get("photos")),
        address: String(fd.get("address") ?? "N/A"), // Estate / Address
        country: String(fd.get("country") ?? "Nigeria"),
        state: String(fd.get("state") ?? "N/A"),
        city: String(fd.get("city") ?? "N/A"), // Neighborhood goes here
        sizeInFt,
        rooms,
        bedrooms,
        bathrooms,
        yearBuilt,
        availableFrom: toISODateOrUndefined(fd.get("availableFrom")),
        floorsNo,
        amenities: fd.getAll("amenities").map(String),
        nearby,           // ✅ send array to BE
        isFeatured,       // ✅ include featured flag
      });

      console.log("CREATE /properties/create payload:", payload);

      await createListing(payload);
      router.replace("/dashboard-my-properties");
    } catch (err) {
      console.error("Create listing failed:", err);
      setSubmitError(err?.message || "Failed to create listing.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <nav>
        <div className="nav nav-tabs" id="nav-tab2" role="tablist">
          <button
            className="nav-link active fw600 ms-3"
            id="nav-desc-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-desc"
            type="button"
            role="tab"
          >
            1. Description
          </button>
          <button
            className="nav-link fw600"
            id="nav-media-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-media"
            type="button"
            role="tab"
          >
            2. Media
          </button>
          <button
            className="nav-link fw600"
            id="nav-location-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-location"
            type="button"
            role="tab"
          >
            3. Location
          </button>
          <button
            className="nav-link fw600"
            id="nav-details-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-details"
            type="button"
            role="tab"
          >
            4. Detail
          </button>
          <button
            className="nav-link fw600"
            id="nav-amenities-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-amenities"
            type="button"
            role="tab"
          >
            5. Amenities
          </button>
        </div>
      </nav>

      <form id="addPropertyForm" onSubmit={onSubmit}>
        <div className="tab-content" id="nav-tabContent">
          {/* Description */}
          <div className="tab-pane fade show active" id="nav-desc" role="tabpanel">
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Property Description</h4>
              <PropertyDescription />

              {/* Featured Toggle */}
              <div className="form-check mt3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isFeatured">
                  Mark as Featured
                </label>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="tab-pane fade" id="nav-media" role="tabpanel">
            <UploadMedia />
          </div>

          {/* Location */}
          <div className="tab-pane fade" id="nav-location" role="tabpanel">
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Location</h4>
              <LocationField />
            </div>
          </div>

          {/* Details */}
          <div className="tab-pane fade" id="nav-details" role="tabpanel">
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Details</h4>
              <DetailsFiled />
              <p className="mt10 text-muted fz14">
                Only <strong>Floors no</strong>, <strong>Bedrooms</strong> and <strong>Bathrooms</strong> are required here.
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div className="tab-pane fade" id="nav-amenities" role="tabpanel">
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Select Amenities</h4>
              <div className="row">
                <Amenities />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt30 pt20 border-top">
          {submitError ? <div className="text-danger">{submitError}</div> : <div />}
          <div className="d-flex gap-2 my-3">
            <button
              type="button"
              className="ud-btn btn-light"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="ud-btn btn-thm" disabled={submitting}>
              {submitting ? "Creating…" : "Create Listing"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddPropertyTabContent;