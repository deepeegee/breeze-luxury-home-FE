// src/components/property/property-single-style/common/PropertyHeader.jsx
"use client";

import React, { useMemo, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const BUSINESS_WA = "2348148827901";

/* ---------- helpers ---------- */
function deriveAvailability(p = {}) {
  const raw = (p.availability || p.status || p.listedIn || "")
    .toString()
    .toLowerCase();
  if (raw.includes("sold")) return "Sold";
  if (raw.includes("available") || raw.includes("active") || raw.includes("publish")) return "For sale";
  if (typeof p.forRent === "boolean") return p.forRent ? "For rent" : "For sale";
  return "For sale";
}

function availabilityClasses(avail) {
  if (avail === "Sold") return "text-danger";
  if (avail === "For rent") return "text-info";
  return "text-success";
}

const formatNaira = (n) =>
  typeof n === "number" && Number.isFinite(n)
    ? `₦${n.toLocaleString("en-NG")}`
    : "";

/** Normalize documents from various BE shapes -> string[] */
function normalizeDocuments(p = {}) {
  const candidates = [
    p.propertyDocuments,
    p.documents,
    p.legalDocuments,
    p.docs,
  ];

  const out = [];

  for (const v of candidates) {
    if (!v) continue;

    // Array of strings?
    if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === "string" && item.trim()) out.push(item.trim());
        // Array of objects? pick label/name/title if present
        else if (item && typeof item === "object") {
          const s =
            item.label ||
            item.name ||
            item.title ||
            item.text ||
            item.value ||
            "";
          if (typeof s === "string" && s.trim()) out.push(s.trim());
        }
      }
      continue;
    }

    // CSV string
    if (typeof v === "string" && v.trim()) {
      v.split(/[;,]/).forEach((part) => {
        const s = part.trim();
        if (s) out.push(s);
      });
    }
  }

  // de-dupe case-insensitively but keep first-cased original
  const seen = new Set();
  const deduped = [];
  for (const s of out) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(s);
  }
  return deduped;
}

/* ---------- component ---------- */
const PropertyHeader = ({ property }) => {
  const hasProperty = !!property;
  const p = property ?? {};

  const availability = deriveAvailability(p);
  const availClass = availabilityClasses(availability);

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    []
  );

  // Build a property-specific contact message (to chat with your biz number)
  const waContactHref = useMemo(() => {
    const title = p.title || p.name || "a property";
    const location = p.location || [p.city, p.state].filter(Boolean).join(", ");
    const price = formatNaira(p.price);

    const lines = [
      "Hello Breeze Luxury Homes",
      "I'm interested in this property:",
      `• Title: ${title}`,
      location ? `• Location: ${location}` : null,
      price ? `• Price: ${price}` : null,
      pageUrl ? `• Link: ${pageUrl}` : null,
      "",
      "Please share more details. Thank you!",
    ].filter(Boolean);

    return `https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [p.title, p.name, p.location, p.city, p.state, p.price, pageUrl]);

  // Share-with-a-friend message
  const waShareHref = useMemo(() => {
    const title = p.title || p.name || "this property";
    const location = p.location || [p.city, p.state].filter(Boolean).join(", ");
    const price = formatNaira(p.price);

    const lines = [
      "Check out this property on Breeze Luxury Homes:",
      title,
      location ? `Location: ${location}` : null,
      price ? `Price: ${price}` : null,
      pageUrl || "",
    ].filter(Boolean);

    return `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [p.title, p.name, p.location, p.city, p.state, p.price, pageUrl]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* no-op */
    }
  };

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const propertyType = p.propertyType || p.category || "";

  // 🔹 Documents from BE (robust)
  const docs = useMemo(() => normalizeDocuments(p), [p]);

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          {/* Title */}
          <h2 className="sp-lg-title">
            {hasProperty ? p.title : "Property not found"}
          </h2>

          {/* Address + availability + year */}
          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
              {p.location || "—"}
            </p>

            <span className={`ff-heading fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm ${availClass}`}>
              <i className="fas fa-circle fz10 pe-2" />
              {availability}
            </span>

            <span className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm">
              <i className="far fa-clock pe-2" />
              {p.yearBuilding ? `Built in ${p.yearBuilding}` : "Year not specified"}
            </span>
          </div>

          {/* NEW: identity row (name + type) BEFORE bed/bath */}
          <div className="id-row mb10">
            {/* <div className="id-pill name">{p.name || "—"}</div> */}
            {propertyType ? (
              <div className="id-pill type">
                <i className="far fa-building me-2" />
                {propertyType}
              </div>
            ) : null}
          </div>

          {/* Bed / Bath / Size */}
          <div className="property-meta d-flex align-items-center">
            <span className="text fz15" aria-label="Bedrooms">
              <i className="flaticon-bed pe-2 align-text-top" />
              {p.bed ?? "—"} bed
            </span>

            <span className="text ml20 fz15" aria-label="Bathrooms">
              <i className="flaticon-shower pe-2 align-text-top" />
              {p.bath ?? "—"} bath
            </span>

            {Number.isFinite(p?.sqft) && (
              <span className="text ml20 fz15" aria-label="Area">
                <i className="flaticon-expand pe-2 align-text-top" />
                {Number(p.sqft).toLocaleString()} sq ft
              </span>
            )}
          </div>

          {/* 🔹 Documents row — shows when BE provides docs */}
          {docs.length > 0 && (
            <div className="mt15 pt15 border-top">
              <div className="fz13 text-uppercase fw600 mb5 text-muted">Documents</div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                {docs.map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="badge bg-success-subtle text-success-emphasis fz12 px-2 py-1"
                  >
                    <i className="far fa-file-alt pe-2 align-text-top" />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Local styles for the identity pills */}
          <style jsx>{`
            .id-row {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 10px;
            }
            .id-pill {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 10px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 13px;
              line-height: 1.1;
              border: 1px solid transparent;
            }
            .id-pill.name {
              background: #f8fafc;
              color: #0f172a;
              border-color: #e2e8f0;
            }
            .id-pill.type {
              background: #eef2ff;
              color: #1e40af;
              border-color: #c7d2fe;
            }
          `}</style>
        </div>
      </div>

      {/* Right column */}
      <div className="col-lg-4">
        <div className="single-property-content position-relative">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end position-relative">
              {/* WhatsApp (contact us about THIS property) */}
              <a
                className="icon mr10"
                href={waContactHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message us on WhatsApp about this property"
                data-tooltip-id="tip-wa"
              >
                <i className="fab fa-whatsapp" style={{ fontSize: 18, color: "#25D366" }} />
              </a>

              {/* Share toggle */}
              <button
                type="button"
                className="icon mr10"
                aria-haspopup="true"
                aria-expanded={shareOpen ? "true" : "false"}
                onClick={() => setShareOpen((s) => !s)}
                data-tooltip-id="tip-share"
              >
                <span className="flaticon-share-1" />
              </button>

              {/* Print */}
              <button type="button" className="icon" onClick={onPrint} data-tooltip-id="tip-print">
                <span className="flaticon-printer" />
              </button>

              {/* Tooltips */}
              <ReactTooltip id="tip-wa" place="bottom" content="Message us on WhatsApp" />
              <ReactTooltip id="tip-share" place="bottom" content="More share options" />
              <ReactTooltip id="tip-print" place="bottom" content="Print this property" />
            </div>

            <h3 className="price mb-0">
              {typeof p.price === "number" ? formatNaira(p.price) : "—"}
            </h3>
          </div>

          {/* Share sheet */}
          {shareOpen && (
            <div
              className="position-absolute bgc-white bdr1 bdrs12 p15 default-box-shadow2"
              style={{ right: 0, top: 58, zIndex: 20, minWidth: 280 }}
              role="dialog"
              aria-label="Share this property"
            >
              <div className="d-flex align-items-center justify-content-between mb10">
                <div className="fw600">Share</div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShareOpen(false)}
                />
              </div>

              {/* Copy link row (keep button square-ish, no pill) */}
              <div className="d-flex align-items-center gap-2 mb10" style={{ minWidth: 0 }}>
                <input
                  type="text"
                  className="form-control form-control-sm flex-grow-1"
                  readOnly
                  value={pageUrl}
                  title={pageUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  style={{ minWidth: 0 }}
                />
                <button
                  type="button"
                  onClick={() => onCopy()}
                  className="ud-btn btn-light btn-sm text-nowrap flex-shrink-0"
                  style={{
                    padding: "8px 12px",
                    fontSize: 12,
                    lineHeight: 1.2,
                    borderRadius: "0.375rem",
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* 1) Contact us (business WA) */}
              <a
                className="ud-btn btn-outline-thm btn-sm w-100 d-inline-flex align-items-center justify-content-center mb10"
                href={waContactHref}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-id="tip-wa-sheet-1"
              >
                <i className="fab fa-whatsapp me-2" />
                Message us on WhatsApp
              </a>
              <ReactTooltip id="tip-wa-sheet-1" place="bottom" content="Open WhatsApp chat with Breeze" />

              {/* 2) Share with a friend */}
              <a
                className="ud-btn btn-thm btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                href={waShareHref}
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip-id="tip-wa-sheet-2"
              >
                <i className="fab fa-whatsapp me-2" />
                Share via WhatsApp
              </a>
              <ReactTooltip id="tip-wa-sheet-2" place="bottom" content="Share this property" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyHeader;
