"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import { useCreateListing } from "@/lib/useApi";

const AddPropertyTabContent = () => {
  const router = useRouter();
  const { trigger: createListing } = useCreateListing();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const toNum = (v) => {
    if (v == null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const toISODateOrUndefined = (d) => {
    if (!d) return undefined;
    try {
      return new Date(d).toISOString();
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

  const prune = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) =>
          v !== undefined &&
          v !== null &&
          !(typeof v === "string" && v.trim() === "")
      )
    );

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);

      const title = fd.get("title");
      const price = toNum(fd.get("price"));

      if (!title || !price) {
        setSubmitting(false);
        setSubmitError("Please provide at least Title and Price.");
        return;
      }

      // Enforce rooms >= 1 to satisfy backend validator
      const roomsRaw = toNum(fd.get("rooms"));
      const rooms = roomsRaw == null ? 1 : Math.max(1, roomsRaw);

      const payload = prune({
        // Description
        title: String(title),
        description: fd.get("description"),
        name: fd.get("name"),
        category: fd.get("category"),
        listedIn: fd.get("listedIn"),
        status: fd.get("status"),
        price,

        // Media
        photos: parsePhotos(fd.get("photos")),
        // videoProvider: fd.get("videoProvider") || undefined,
        // videoId: fd.get("videoId") || undefined,
        // virtualTour: fd.get("virtualTour") || undefined,

        // Location
        address: String(fd.get("address") ?? "N/A"),
        country: String(fd.get("country") ?? "Nigeria"),
        state: String(fd.get("state") ?? "N/A"),
        city: String(fd.get("city") ?? "N/A"),
        // lat: toNum(fd.get("lat")),
        // long: toNum(fd.get("long")),

        // Details
        sizeInFt: toNum(fd.get("sizeInFt")),
        lotSizeInFt: toNum(fd.get("lotSizeInFt")),
        rooms, // ✅ enforce >= 1
        bedrooms: toNum(fd.get("bedrooms")),
        bathrooms: toNum(fd.get("bathrooms")),
        yearBuilt: toNum(fd.get("yearBuilt")),
        availableFrom: toISODateOrUndefined(fd.get("availableFrom")),
        structureType: fd.get("structureType"),
        floorsNo: toNum(fd.get("floorsNo")),

        // Amenities
        amenities: fd.getAll("amenities").map(String),
      });

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
            aria-controls="nav-desc"
            aria-selected="true"
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
            aria-controls="nav-media"
            aria-selected="false"
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
            aria-controls="nav-location"
            aria-selected="false"
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
            aria-controls="nav-details"
            aria-selected="false"
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
            aria-controls="nav-amenities"
            aria-selected="false"
          >
            5. Amenities
          </button>
        </div>
      </nav>

      <form id="addPropertyForm" onSubmit={onSubmit}>
        <div className="tab-content" id="nav-tabContent">
          {/* Description */}
          <div
            className="tab-pane fade show active"
            id="nav-desc"
            role="tabpanel"
            aria-labelledby="nav-desc-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Property Description</h4>
              <PropertyDescription />
            </div>
          </div>

          {/* Media */}
          <div
            className="tab-pane fade"
            id="nav-media"
            role="tabpanel"
            aria-labelledby="nav-media-tab"
          >
            <UploadMedia />
          </div>

          {/* Location */}
          <div
            className="tab-pane fade"
            id="nav-location"
            role="tabpanel"
            aria-labelledby="nav-location-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Location</h4>
              <LocationField />
            </div>
          </div>

          {/* Details */}
          <div
            className="tab-pane fade"
            id="nav-details"
            role="tabpanel"
            aria-labelledby="nav-details-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Details</h4>
              <DetailsFiled />
            </div>
          </div>

          {/* Amenities */}
          <div
            className="tab-pane fade"
            id="nav-amenities"
            role="tabpanel"
            aria-labelledby="nav-amenities-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Select Amenities</h4>
              <div className="row">
                <Amenities />
              </div>
            </div>
          </div>
        </div>

        {/* Submit action bar */}
        <div className="d-flex align-items-center justify-content-between mt30 pt20 border-top">
          {submitError ? (
            <div className="text-danger">{submitError}</div>
          ) : (
            <div />
          )}

          <div className="d-flex gap-2">
            <button
              type="button"
              className="ud-btn btn-light"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ud-btn btn-thm"
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create Listing"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddPropertyTabContent;