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

/** A thumbnail that fills its parent .thumb-box (object-fit: cover; no stretching). */
function SafeThumb({ src, alt }) {
  if (isExternalUrl(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        decoding="async"
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 576px) 112px, (max-width: 1200px) 140px, 160px"
      priority={false}
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
  );
}

const availabilityClass = (label) => {
  const s = (label || "").toString().toLowerCase();
  if (s.includes("sold")) return "badge rounded-pill bg-danger-subtle text-danger-emphasis";
  if (s.includes("available")) return "badge rounded-pill bg-success-subtle text-success-emphasis";
  return "badge rounded-pill bg-secondary-subtle text-secondary-emphasis";
};

/* ---------- component ---------- */

const PropertyDataTable = ({
  search = "",
  sort = "Best Match",
  currentPage = 1,
  itemsPerPage = 10,
  setTotalItems = () => {},
}) => {
  const [raw, setRaw] = useState([]);           // array of properties (page or full set)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({            // server pagination metadata (if provided)
    total: 0,
    serverPaginated: false,
  });

  // modal state
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);
  const [availabilityValue, setAvailabilityValue] = useState("Available");
  const [saving, setSaving] = useState(false);

  const { trigger: deleteListing } = useDeleteListing();
  const { trigger: updateListing } = useUpdateListing();

  // Map UI sort to API sort values
  const apiSort = useMemo(() => {
    if (sort === "Price Low") return "price_asc";
    if (sort === "Price High") return "price_desc";
    if (sort === "Best Seller") return "newest"; // re-using "Best Seller" to mean newest as you had
    // "Best Match" (default) -> let server decide or default to newest
    return "relevance";
  }, [sort]);

  // fetch from backend (server pagination if supported)
  useEffect(() => {
    const ac = new AbortController();
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(itemsPerPage));
        if (search?.trim()) params.set("q", search.trim());
        if (apiSort) params.set("sort", apiSort);

        const res = await fetch(`/api/properties?${params.toString()}`, {
          credentials: "include",
          signal: ac.signal,
        });

        if (!res.ok) {
          // fallback: try old endpoint without pagination
          const fallback = await fetch(`/api/properties`, {
            credentials: "include",
            signal: ac.signal,
          });
          if (!fallback.ok) {
            throw new Error((await res.text()) || `HTTP ${res.status}`);
          }
          const arr = await fallback.json();
          const list = Array.isArray(arr) ? arr : [];
          setRaw(list);
          setMeta({ total: list.length, serverPaginated: false });
          return;
        }

        // Accept several shapes from API:
        // 1) { data: [...], total: n }
        // 2) { items: [...], total: n }
        // 3) [...]
        const json = await res.json();
        let data = [];
        let total = 0;
        let serverPaginated = false;

        if (Array.isArray(json)) {
          data = json;
          total = json.length;
          serverPaginated = false;
        } else {
          data = Array.isArray(json.data) ? json.data
               : Array.isArray(json.items) ? json.items
               : Array.isArray(json.results) ? json.results
               : [];
          total = Number(json.total ?? json.count ?? json.totalCount ?? data.length) || 0;
          serverPaginated = !!(json.total ?? json.count ?? json.totalCount);
        }

        setRaw(data);
        setMeta({ total, serverPaginated });
      } catch (e) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => ac.abort();
  }, [currentPage, itemsPerPage, search, apiSort]);

  // inform parent about total items
  useEffect(() => {
    if (meta.serverPaginated) setTotalItems(meta.total);
    else {
      // client-side: total is after text filter (below), so update from that
      // we update again after computing filtered/sorted length in a second effect
      setTotalItems(meta.total || 0);
    }
  }, [meta.serverPaginated, meta.total, setTotalItems]);

  // text filter (client-side, in case server didn't handle it)
  const filteredByText = useMemo(() => {
    const q = normalize(search);
    if (!q) return raw;
    return raw.filter((p) => {
      const hay = [
        p?.title, p?.name, p?.address, p?.city, p?.state, p?.country,
        p?.category, p?.status, p?.listedIn, p?.propertyAvailability,
      ].filter(Boolean).map((x) => x.toString().toLowerCase()).join(" | ");
      return hay.includes(q);
    });
  }, [raw, search]);

  // sorting (client-side as a safety net; if server already sorted, this keeps order consistent)
  const sorted = useMemo(() => {
    const arr = [...filteredByText];
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
  }, [filteredByText, sort, search]);

  // client-side pagination slice (only if server didn't paginate)
  const pageSlice = useMemo(() => {
    if (meta.serverPaginated) return sorted;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sorted.slice(start, end);
  }, [sorted, meta.serverPaginated, currentPage, itemsPerPage]);

  // when client-paginating, update parent's total from sorted length
  useEffect(() => {
    if (!meta.serverPaginated) {
      setTotalItems(sorted.length);
    }
  }, [meta.serverPaginated, sorted.length, setTotalItems]);

  const onDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this property?")) return;
    try {
      await deleteListing(id);
      // remove locally
      if (meta.serverPaginated) {
        setRaw((prev) => prev.filter((p) => (p?.id ?? p?._id) !== id));
        setMeta((m) => ({ ...m, total: Math.max(0, (m.total || 1) - 1) }));
        setTotalItems((t) => Math.max(0, t - 1));
      } else {
        // remove from full set (affects subsequent pagination)
        setRaw((prev) => prev.filter((p) => (p?.id ?? p?._id) !== id));
      }
    } catch (e) {
      alert(e?.message || "Failed to delete");
    }
  };

  /** open modal for availability change */
  const openAvailabilityModal = (prop) => {
    const cur = prop?.propertyAvailability || "Available";
    setModalTarget(prop);
    setAvailabilityValue(cur);
    setAvailabilityModalOpen(true);
  };

  const closeAvailabilityModal = () => {
    if (saving) return;
    setAvailabilityModalOpen(false);
    setModalTarget(null);
  };

  /** save availability from modal */
  const saveAvailability = async () => {
    if (!modalTarget) return;
    const id = modalTarget?.id ?? modalTarget?._id;
    if (!id) return;
    setSaving(true);

    const next = availabilityValue;

    // optimistic update
    const updateOne = (x) =>
      (x?.id ?? x?._id) === id ? { ...x, propertyAvailability: next } : x;

    setRaw((prev) => prev.map(updateOne));

    try {
      await updateListing({ id, data: { propertyAvailability: next } });
      closeAvailabilityModal();
    } catch (e) {
      // revert on error
      setRaw((prev) =>
        prev.map((x) =>
          (x?.id ?? x?._id) === id
            ? { ...x, propertyAvailability: modalTarget?.propertyAvailability }
            : x
        )
      );
      alert(e?.message || "Failed to update availability");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading properties…</div>;
  if (error) return <div className="text-center text-danger py-5">Failed to load: {error}</div>;

  const rows = pageSlice;

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
          {rows.map((p) => {
            const id = p?.id ?? p?._id;
            const img = featuredImage(p?.photos);
            const location = [p?.address, p?.city, p?.state, p?.country].filter(Boolean).join(", ");
            const created = fmtDate(p?.createdAt);
            const priceStr = fmtPrice(p?.price);
            const availabilityLabel = p?.propertyAvailability || "Available";

            return (
              <tr key={id}>
                <th scope="row">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div className="list-thumb">
                      {/* Responsive thumbnail box */}
                      <div className="thumb-box">
                        <SafeThumb src={img} alt={p?.title || "property"} />
                      </div>
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
                  <span className={availabilityClass(availabilityLabel)}>{availabilityLabel}</span>
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

      {availabilityModalOpen && (
        <div className="blh-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="blh-status-title">
          <div className="blh-backdrop" onClick={closeAvailabilityModal} />
          <div className="blh-modal card default-box-shadow2">
            <div className="d-flex align-items-center justify-content-between mb2">
              <h6 id="blh-status-title" className="mb-0">Update Availability</h6>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeAvailabilityModal} />
            </div>

            <div className="mb15">
              <div className="text-muted fz14">Property</div>
              <div className="fw600">
                {modalTarget?.title || modalTarget?.name || "Property"}
              </div>
            </div>

            <div className="mb15">
              <div className="text-muted fz14 mb5">Set availability</div>

              {["Available", "Sold"].map((opt) => (
                <div className="form-check mb8" key={opt}>
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`availability-${opt}`}
                    name="availability"
                    value={opt}
                    checked={availabilityValue === opt}
                    onChange={(e) => setAvailabilityValue(e.target.value)}
                    disabled={saving}
                  />
                  <label htmlFor={`availability-${opt}`} className="form-check-label">
                    <span className={availabilityClass(opt)} style={{ marginRight: 8 }}>{opt}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="ud-btn btn-light" onClick={closeAvailabilityModal} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="ud-btn btn-thm" onClick={saveAvailability} disabled={saving}>
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
        </div>
      )}

      {/* ✅ Single merged style block */}
      <style jsx>{`
        /* Thumbnail styles */
        .thumb-box {
          position: relative;
          width: 160px;
          aspect-ratio: 4 / 3;
          border-radius: 10px;
          overflow: hidden;
          background: #f3f4f6;
          flex: 0 0 auto;
        }
        @media (max-width: 1200px) {
          .thumb-box { width: 140px; }
        }
        @media (max-width: 576px) {
          .thumb-box { width: 112px; }
        }
        .listing-style1.dashboard-style {
          gap: 14px;
        }
        @media (min-width: 1400px) {
          .listing-style1.dashboard-style { gap: 16px; }
        }
        .list-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Modal styles merged here */
        .blh-modal-wrap { position: fixed; inset: 0; z-index: 1050; }
        .blh-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.35); backdrop-filter: blur(2px); }
        .blh-modal { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(520px, 92vw); background: #fff; border-radius: 12px; padding: 16px 16px 14px; }
        .mb2 { margin-bottom: 8px; }
        .mb5 { margin-bottom: 5px; }
        .mb8 { margin-bottom: 8px; }
        .mb15 { margin-bottom: 15px; }
        .gap-2 { gap: 8px; }
      `}</style>
    </>
  );
};

export default PropertyDataTable;