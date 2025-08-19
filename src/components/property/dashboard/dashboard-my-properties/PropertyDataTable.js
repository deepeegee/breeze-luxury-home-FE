"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDeleteListing } from "@/lib/useApi";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "pending-style style1";
    case "Published":
      return "pending-style style2";
    case "Processing":
      return "pending-style style3";
    default:
      return "";
  }
};

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

// If true, use <img> to avoid next/image domain restriction
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

const PropertyDataTable = ({ search = "", sort = "Best Match" }) => {
  const [raw, setRaw] = useState([]); // backend properties (keep as-is)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { trigger: deleteListing } = useDeleteListing();

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
    return () => {
      alive = false;
    };
  }, []);

  // text filter
  const filtered = useMemo(() => {
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
      ]
        .filter(Boolean)
        .map(normalize)
        .join(" | ");

      return hay.includes(q);
    });
  }, [raw, search]);

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

  if (loading) return <div className="text-center py-5">Loading properties…</div>;
  if (error) return <div className="text-center text-danger py-5">Failed to load: {error}</div>;

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Listing title</th>
          <th scope="col">Date Published</th>
          <th scope="col">Status</th>
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
          const status = p?.status || "Pending";
          const created = fmtDate(p?.createdAt);
          const priceStr = fmtPrice(p?.price);

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
                <span className={getStatusStyle(status)}>{status}</span>
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
                    onClick={() => alert("Edit flow not implemented yet.")}
                  >
                    <span className="fas fa-pen fa" />
                  </button>
                  <button
                    className="icon"
                    style={{ border: "none" }}
                    data-tooltip-id={`delete-${id}`}
                    onClick={() => onDelete(id)}
                  >
                    <span className="flaticon-bin" />
                  </button>

                  <ReactTooltip id={`edit-${id}`} place="top" content="Edit" />
                  <ReactTooltip id={`delete-${id}`} place="top" content="Delete" />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PropertyDataTable;