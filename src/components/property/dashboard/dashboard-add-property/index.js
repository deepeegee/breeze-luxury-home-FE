// src/components/property/dashboard/dashboard-add-property/index.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import { useCreateListing } from "@/lib/useApi";
import { toast } from "react-hot-toast";

/* ---------- Helpers ---------- */
const strOrUndefined = (v) => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s : undefined;
};

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

// Parse a date string; only return ISO if valid, else undefined (keep field optional)
const isoDateOrUndefined = (raw) => {
  if (typeof raw !== "string") return undefined;
  const s = raw.trim();
  if (!s) return undefined;
  const ms = Date.parse(s);
  if (Number.isNaN(ms)) return undefined;
  return new Date(ms).toISOString();
};

const parsePhotos = (json) => {
  if (!json) return undefined;
  try {
    const arr = JSON.parse(String(json));
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
    const arr = JSON.parse(String(json));
    if (!Array.isArray(arr)) return undefined;
    return arr
      .map((n) => ({
        label: (n?.label ?? "").trim(),
        distance: (n?.distance ?? "").trim(),
        category: (n?.category ?? "").trim(),
      }))
      .filter((n) => n.label);
  } catch {
    return undefined;
  }
};

// Keep empty string for whitelisted keys (e.g., 'name'), prune blank/undefined otherwise
const pruneExceptEmpty = (obj, keepEmptyKeys = []) =>
  Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if (v === undefined || v === null) return false;
      if (typeof v === "string") {
        const t = v.trim();
        if (t === "") return keepEmptyKeys.includes(k);
        return true;
      }
      return true;
    })
  );

// Turn any error into toast lines
const toastErrors = (err) => {
  const lines = [];
  const data = err?.response?.data;

  if (Array.isArray(data?.errors)) {
    data.errors.forEach((e) =>
      lines.push(typeof e === "string" ? e : e?.message || JSON.stringify(e))
    );
  } else if (Array.isArray(data?.message)) {
    data.message.forEach((m) =>
      lines.push(typeof m === "string" ? m : JSON.stringify(m))
    );
  } else if (typeof data?.message === "string") {
    lines.push(...data.message.split(/,\s*/));
  } else if (typeof err?.message === "string") {
    lines.push(...err.message.split(/,\s*/));
  } else {
    lines.push("Failed to create listing.");
  }

  lines.filter(Boolean).forEach((m) => toast.error(m, { duration: 5000 }));
};

// Collect property documents robustly
const collectPropertyDocuments = (fd, formEl) => {
  // 1) Normal FormData names (both styles)
  let docs = [
    ...fd.getAll("propertyDocuments"),
    ...fd.getAll("propertyDocuments[]"),
  ]
    .map(String)
    .filter(Boolean);

  // 2) Fallback to DOM (in case inputs are outside the form boundaries or custom)
  if (!docs.length && formEl && typeof document !== "undefined") {
    const selectors = [
      'input[name="propertyDocuments"]:checked',
      'input[name="propertyDocuments[]"]:checked',
      // common alternates just in case
      'input[name="documents"]:checked',
      'input[name="documents[]"]:checked',
    ];
    const nodes = document.querySelectorAll(selectors.join(","));
    docs = Array.from(nodes)
      .map((el) => String(el.value))
      .filter(Boolean);
  }

  // 3) Optional hidden JSON mirror (if you add one in the UI)
  if (!docs.length) {
    const json = fd.get("propertyDocumentsJson");
    if (typeof json === "string" && json.trim()) {
      try {
        const arr = JSON.parse(json);
        if (Array.isArray(arr)) {
          docs = arr.map(String).filter(Boolean);
        }
      } catch {}
    }
  }

  return docs.length ? docs : undefined;
};

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
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);

      const title = fd.get("title");
      const price = numOrUndefined(fd.get("price"));
      if (!title || price == null) {
        const msg = "Please provide at least Title and Price.";
        setSubmitting(false);
        setSubmitError(msg);
        toast.error(msg);
        return;
      }

      const bedrooms = posIntOrUndefined(fd.get("bedrooms"));
      const bathrooms = posIntOrUndefined(fd.get("bathrooms"));
      if (bedrooms == null || bathrooms == null) {
        const msg = "Please provide Bedrooms and Bathrooms (min 1).";
        setSubmitting(false);
        setSubmitError(msg);
        toast.error(msg);
        return;
      }

      // Always keep name as a string (empty allowed)
      const rawName = fd.get("name");
      const name = typeof rawName === "string" ? rawName : "";

      // Date: only include if valid; otherwise omit entirely
      const availableFromISO = isoDateOrUndefined(fd.get("availableFrom"));

      // Documents (robust)
      const propertyDocuments = collectPropertyDocuments(fd, formEl);

      // Numeric / optional
      const sizeInFt = posNumOrUndefined(fd.get("sizeInFt"));
      const rooms = posIntOrUndefined(fd.get("rooms"));
      const floorsNo = posIntOrUndefined(fd.get("floorsNo"));
      const yearBuilt = numOrUndefined(fd.get("yearBuilt"));
      const nearby = parseNearby(fd.get("nearby"));
      const description = String(fd.get("description") ?? "");

      // Optional text fields from DetailsFiled
      const basement = strOrUndefined(fd.get("basement"));
      const extraDetails = strOrUndefined(fd.get("extraDetails"));
      const roofing = strOrUndefined(fd.get("roofing"));
      const exteriorMaterial = strOrUndefined(fd.get("exteriorMaterial"));
      const internalNotes = strOrUndefined(fd.get("internalNotes"));
      const videoProvider = strOrUndefined(fd.get("videoProvider"));
      const videoUrl = strOrUndefined(fd.get("videoUrl"));
      
      const base = {
        title: String(title),
        description,
        name, // keep even if "", to satisfy “name must be a string”
        category: fd.get("category"),
        listedIn: fd.get("listedIn"),
        status: fd.get("status"),
        price,
        photos: parsePhotos(fd.get("photos")),
        address: String(fd.get("address") ?? "N/A"),
        country: String(fd.get("country") ?? "Nigeria"),
        state: String(fd.get("state") ?? "N/A"),
        city: String(fd.get("city") ?? "N/A"),
        sizeInFt,
        rooms,
        bedrooms,
        bathrooms,
        yearBuilt,
        floorsNo,
        amenities: fd.getAll("amenities").map(String),

        // NEW: extra optional fields
        basement,
        extraDetails,
        roofing,
        exteriorMaterial,
        internalNotes,

        nearby,
        isFeatured,
        videoUrl,
        videoProvider,

        ...(propertyDocuments ? { propertyDocuments } : {}),
        ...(availableFromISO ? { availableFrom: availableFromISO } : {}),
      };

      // Keep empty string for 'name'; remove empty/undefined everywhere else
      const payload = pruneExceptEmpty(base, ["name"]);

      await createListing(payload);
      toast.success("Listing created successfully!");
      router.replace("/dashboard-my-properties");
    } catch (err) {
      console.error("Create listing failed:", err);
      toastErrors(err);
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
