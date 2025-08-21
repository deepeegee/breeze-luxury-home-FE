"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDeleteListing, useUpdateListing } from "@/lib/useApi";

/* ---------- helpers ---------- */

const featuredImage = (photos) => {
  if (!Array.isArray(photos) || photos.length === 0)
    return "/images/listings/list-1.jpg";
  const f = photos.find((p) => p && p.isFeatured);
  return (f && f.url) || (photos[0] && photos[0].url) || "/images/listings/list-1.jpg";
};

const fmtPrice = (n) => {
  if (typeof n !== "number") return "—";
  try {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  } catch {
    return `$${Number(n).toLocaleString()}`;
  }
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return String(d);
  }
};

const normalize = (s) => (s ?? "").toString().toLowerCase();

const isExternalUrl = (src) => /^https?:\/\//i.test(src);

function SafeThumb({ src, alt, width = 110, height = 94, className = "w-100" }) {
  if (isExternalUrl(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}

/** Map BE fields to availability label shown in UI */
function deriveAvailability(p = {}) {
  const raw = (
    p.availability || // preferred canonical
    p.status ||       // fallback
    p.listedIn || ""  // fallback
  ).toString().toLowerCase();

  if (raw.includes("sold")) return "Sold";
  if (raw.includes("available") || raw.includes("active") || raw.includes("publish"))
    return "For sale";
  return "For sale";
}

function availabilityClass(label) {
  return label === "Sold"
    ? "badge rounded-pill bg-danger-subtle text-danger-emphasis"
    : "badge rounded-pill bg-success-subtle text-success-emphasis";
}

/* ---------- component ---------- */

const PropertyDataTable = ({
  search = "",
  sort = "Best Match",
  availabilityFilter = "All", // "All" | "For sale" | "Sold"
}) => {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null); // the property object
  const [modalValue, setModalValue] = useState("Available"); // "Available" | "Sold"
  const [saving, setSaving] = useState(false);

  const { trigger: deleteListing } = useDeleteListing();
  const { trigger: updateListing } = useUpdateListing();

  // fetch from backend
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/properties", { credentials: "include" });
        if (!res.ok) {
          const msg = (await res.text()) || `HTTP ${res.status}`;
          throw new Error(msg);
        }
        const list = await res.json();
        if (alive) setRaw(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load properties");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // text filter
  const filteredByText = useMemo(() => {
    const q = normalize(search);
    if (!q) return raw;

    return raw.filter((p) => {
      const hay = [
        p?.title,
        p?.name,
        p?.address,
        p?.city,
        p?.state,
        p?.country,
        p?.category,
        p?.status,
        p?.listedIn,
        p?.availability,
      ]
        .filter(Boolean)
        .map(normalize)
        .join(" | ");

      return hay.includes(q);
    });
  }, [raw, search]);

  // availability filter
  const filtered = useMemo(() => {
    if (availabilityFilter === "All") return filteredByText;
    return filteredByText.filter((p) => deriveAvailability(p) === availabilityFilter);
  }, [filteredByText, availabilityFilter]);

  // sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];

    const byPriceAsc = (a, b) => (a?.price ?? 0) - (b?.price ?? 0);
    const byPriceDesc = (a, b) => (b?.price ?? 0) - (a?.price ?? 0);
    const byNewest = (a, b) =>
      new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();

    if (sort === "Price Low") return arr.sort(byPriceAsc);
    if (sort === "Price High") return arr.sort(byPriceDesc);
    if (sort === "Best Seller") return arr.sort(byNewest);

    if (search.trim()) {
      const q = normalize(search);
      return arr.sort((a, b) => {
        const aTitle = normalize(`${a?.title ?? ""} ${a?.address ?? ""}`);
        const bTitle = normalize(`${b?.title ?? ""} ${b?.address ?? ""}`);
        const aScore = aTitle.includes(q) ? 1 : 0;
        const bScore = bTitle.includes(q) ? 1 : 0;
        if (bScore !== aScore) return bScore - aScore;
        return byNewest(a, b);
      });
    }

    return arr.sort(byNewest);
  }, [filtered, sort, search]);

  const onDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this property?")) return;
    try {
      await deleteListing(id);
      setRaw((prev) => prev.filter((p) => p?.id !== id && p?._id !== id));
    } catch (e) {
      alert(e?.message || "Failed to delete");
    }
  };

  /** open modal for availability change */
  const openAvailabilityModal = (prop) => {
    const currentLabel = deriveAvailability(prop); // "For sale" / "Sold"
    setModalTarget(prop);
    setModalValue(currentLabel === "Sold" ? "Sold" : "Available"); // canonical values for API
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setModalTarget(null);
  };

  /** save from modal */
  const saveAvailability = async () => {
    if (!modalTarget) return;
    const id = modalTarget?.id ?? modalTarget?._id;
    if (!id) return;

    setSaving(true);

    // optimistic update
    const next = modalValue; // "Available" | "Sold"
    setRaw((prev) =>
      prev.map((x) =>
        (x?.id ?? x?._id) === id ? { ...x, availability: next } : x
      )
    );

    try {
      await updateListing({ id, data: { availability: next } });
      closeModal();
    } catch (e) {
      // revert on error
      setRaw((prev) =>
        prev.map((x) =>
          (x?.id ?? x?._id) === id ? { ...x, availability: modalTarget?.availability } : x
        )
      );
      alert(e?.message || "Failed to update availability");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading properties…</div>;
  if (error) return <div className="text-center text-danger py-5">Failed to load: {error}</div>;

  return (
    <>
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">Listing title</th>
            <th scope="col">Date Published</th>
            <th scope="col">Availability</th>
            <th scope="col">View</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {sorted.map((p) => {
            const id = p?.id ?? p?._id;
            const img = featuredImage(p?.photos);
            const locationParts = [p?.address, p?.city, p?.state, p?.country].filter(Boolean);
            const location = locationParts.join(", ");
            const created = fmtDate(p?.createdAt);
            const priceStr = fmtPrice(p?.price);
            const availLabel = deriveAvailability(p);

            return (
              <tr key={id}>
                <th scope="row">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div className="list-thumb">
                      <SafeThumb src={img} alt={p?.title || "property"} width={110} height={94} />
                    </div>
                    <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title">
                        <Link href={`/single-v3/${id}`}>{p?.title || p?.name || "Property"}</Link>
                      </div>
                      <p className="list-text mb-0">{location || "—"}</p>
                      <div className="list-price">
                        <a href="#">{priceStr}</a>
                      </div>
                    </div>
                  </div>
                </th>

                <td className="vam">{created}</td>

                <td className="vam">
                  <span className={availabilityClass(availLabel)}>{availLabel}</span>
                </td>

                <td className="vam">
                  <Link className="ud-btn btn-light" href={`/single-v3/${id}`}>
                    View
                  </Link>
                </td>

                <td className="vam">
                  <div className="d-flex">
                    <button
                      className="icon"
                      style={{ border: "none" }}
                      data-tooltip-id={`edit-${id}`}
                      onClick={() => openAvailabilityModal(p)}
                    >
                      <span className="fas fa-pen" />
                    </button>
                    <button
                      className="icon"
                      style={{ border: "none" }}
                      data-tooltip-id={`delete-${id}`}
                      onClick={() => onDelete(id)}
                    >
                      <span className="flaticon-bin" />
                    </button>

                    <ReactTooltip id={`edit-${id}`} place="top" content="Change availability" />
                    <ReactTooltip id={`delete-${id}`} place="top" content="Delete" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Availability Modal (custom lightweight) */}
      {modalOpen && (
        <div className="blh-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="blh-modal-title">
          <div className="blh-backdrop" onClick={closeModal} />
          <div className="blh-modal card default-box-shadow2">
            <div className="d-flex align-items-center justify-content-between mb2">
              <h6 id="blh-modal-title" className="mb-0">
                Update Availability
              </h6>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
            </div>

            <div className="mb15">
              <div className="text-muted fz14">Property</div>
              <div className="fw600">
                {modalTarget?.title || modalTarget?.name || "Property"}
              </div>
            </div>

            <div className="mb15">
              <div className="text-muted fz14 mb5">Set availability</div>

              <div className="form-check mb8">
                <input
                  className="form-check-input"
                  type="radio"
                  id="avail-available"
                  name="availability"
                  value="Available"
                  checked={modalValue === "Available"}
                  onChange={(e) => setModalValue(e.target.value)}
                  disabled={saving}
                />
                <label htmlFor="avail-available" className="form-check-label">
                  <span className="badge rounded-pill bg-success-subtle text-success-emphasis me-2">For sale</span>
                  <span className="text-muted"> (stores as “Available”)</span>
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="avail-sold"
                  name="availability"
                  value="Sold"
                  checked={modalValue === "Sold"}
                  onChange={(e) => setModalValue(e.target.value)}
                  disabled={saving}
                />
                <label htmlFor="avail-sold" className="form-check-label">
                  <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis me-2">Sold</span>
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="ud-btn btn-light" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button
                type="button"
                className="ud-btn btn-thm"
                onClick={saveAvailability}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>

          <style jsx>{`
            .blh-modal-wrap {
              position: fixed;
              inset: 0;
              z-index: 1050;
            }
            .blh-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(0,0,0,0.35);
              backdrop-filter: blur(2px);
            }
            .blh-modal {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: min(520px, 92vw);
              background: #fff;
              border-radius: 12px;
              padding: 16px 16px 14px;
            }
            .mb2 { margin-bottom: 8px; }
            .mb5 { margin-bottom: 5px; }
            .mb8 { margin-bottom: 8px; }
            .mb15 { margin-bottom: 15px; }
            .gap-2 { gap: 8px; }
          `}</style>
        </div>
      )}
    </>
  );
};

export default PropertyDataTable;