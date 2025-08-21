"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ---------- id util ---------- */
const pickId = (listing) => {
  let possibleId =
    listing?.id ??
    listing?._id ??
    listing?.slug ??
    listing?.propertyId ??
    listing?.listingId ??
    listing?.uuid;

  if (!possibleId) {
    if (listing?.title && listing?.city) {
      possibleId = `${listing.city.toLowerCase().replace(/\s+/g, "-")}-${listing.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
    } else if (listing?.title) {
      possibleId = listing.title.toLowerCase().replace(/\s+/g, "-");
    } else if (listing?.city) {
      possibleId = listing.city.toLowerCase().replace(/\s+/g, "-");
    }
  }
  return possibleId;
};

/* ---------- availability mapping (BE -> UI) ---------- */
function deriveAvailability(p = {}) {
  const raw = (
    p.availability ||
    p.status ||
    p.listedIn ||
    ""
  ).toString().toLowerCase();

  if (raw.includes("sold")) return "Sold";
  if (raw.includes("available") || raw.includes("active") || raw.includes("publish"))
    return "For sale";
  return "For sale";
}

export default function FeaturedListings({ data = [], colstyle }) {
  const router = useRouter();

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="col-12 text-center py-5">No properties found</div>;
  }

  return (
    <>
      {data.map((listing, idx) => {
        const id = pickId(listing);
        const key =
          id != null
            ? `listing-${String(id)}-${idx}`
            : `noid-${listing?.city ?? "city"}-${listing?.title ?? "title"}-${idx}`;

        const availability = deriveAvailability(listing);
        const isSold = availability === "Sold";

        const showBed = Number.isFinite(listing?.bed);
        const showBath = Number.isFinite(listing?.bath);
        const showSqft = Number.isFinite(listing?.sqft);

        return (
          <div
            className={`${colstyle ? "col-sm-12 col-lg-6" : "col-sm-6 col-lg-4"}`}
            key={key}
          >
            <div
              className={`listing-style1 ${isSold ? "is-sold" : "is-sale"} card-fixed`}
              onClick={() => {
                if (id) router.push(`/single-v3/${encodeURIComponent(String(id))}`);
              }}
            >
              {/* Full-card overlay link if id exists */}
              {id ? (
                <Link
                  href={`/single-v3/${encodeURIComponent(String(id))}`}
                  className="stretched"
                  aria-label={`Open ${listing?.title ?? "property"}`}
                  prefetch={false}
                >
                  <span aria-hidden="true" />
                </Link>
              ) : null}

              {/* ===== Image area (taller) ===== */}
              <div className="list-thumb position-relative">
                {listing.image && (
                  <Image
                    fill
                    className="thumb-img"
                    src={listing.image}
                    alt={listing.title ?? "property"}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                )}

                {/* Status badge */}
                <span
                  className={`status-badge ${isSold ? "sold" : "sale"}`}
                  aria-label={availability}
                  title={availability}
                >
                  <i className={`fas ${isSold ? "fa-ban" : "fa-check-circle"} me-2`} />
                  {isSold ? "SOLD" : "FOR SALE"}
                </span>

                {/* FEATURED badge */}
                {listing?.featured && (
                  <div className="featured-badge" aria-label="Featured property">
                    <span className="flaticon-electricity me-2" />
                    FEATURED
                  </div>
                )}

                {/* Price chip (compact, auto width) */}
                {listing?.price != null && (
                  <div className="list-price">
                    ₦{Number(listing.price).toLocaleString()}
                  </div>
                )}
              </div>

              {/* ===== Body (ample space; no truncation) ===== */}
              <div className="list-content">
                {listing?.title && <h6 className="list-title">{listing.title}</h6>}
                {listing?.location && <p className="list-text">{listing.location}</p>}

                {(showBed || showBath || showSqft) && (
                  <div className="list-meta">
                    {showBed && (
                      <span className="meta">
                        <span className="flaticon-bed meta-icon" /> {listing.bed} Bedroom
                        {listing.bed === 1 ? "" : "s"}
                      </span>
                    )}
                    {showBath && (
                      <span className="meta">
                        <span className="flaticon-shower meta-icon" /> {listing.bath} Bathroom
                        {listing.bath === 1 ? "" : "s"}
                      </span>
                    )}
                    {showSqft && (
                      <span className="meta">
                        <span className="flaticon-expand meta-icon" /> {listing.sqft.toLocaleString()} sq ft
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        /* ===== Equal-height card frame ===== */
        .card-fixed {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 480px;                 /* fixed height for ALL cards */
          border-radius: 14px;
          overflow: hidden;              /* keep visuals crisp; body manages overflow internally */
          background: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          transition: transform .18s ease, box-shadow .18s ease;
          cursor: pointer;
        }
        .card-fixed:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(0,0,0,.08);
        }

        /* overlay link */
        .stretched { position: absolute; inset: 0; z-index: 10; }

        /* ===== Media area (larger) ===== */
        .list-thumb {
          position: relative;
          border-radius: 14px 14px 0 0;
          overflow: hidden;
          height: 260px;                 /* taller to balance content */
          background: #f3f4f6;
          flex: 0 0 auto;
        }
        @media (max-width: 575px) {
          .list-thumb { height: 240px; }
        }
        .thumb-img { object-fit: cover; object-position: center; }

        /* ===== Badges: large, clean, standard ===== */
        .status-badge,
        .featured-badge {
          position: absolute;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .2px;
          padding: 9px 14px;
          border-radius: 999px;
          color: #fff;
          box-shadow: 0 8px 22px rgba(0,0,0,.18);
          -webkit-backdrop-filter: saturate(140%) blur(4px);
          backdrop-filter: saturate(140%) blur(4px);
          white-space: normal;           /* allow full words */
        }
        .status-badge { top: 12px; left: 12px; }
        .status-badge.sale { background: linear-gradient(135deg,#22c55e,#16a34a); }
        .status-badge.sold { background: linear-gradient(135deg,#ef4444,#dc2626); }

        .featured-badge {
          top: 12px; right: 12px;
          background: linear-gradient(135deg,#2563eb,#1d4ed8);
          border: 1px solid rgba(29,78,216,.25);
        }

        .list-price {
          position: absolute;
          background: rgba(0,0,0,.65);
          color: #fff;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          line-height: 1.1;
          width: auto;                   /* only as wide as needed */
          max-width: calc(100% - 24px);
        }

        .list-content{
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px 18px 16px;       /* room to breathe */
          flex: 1 1 auto;                /* fill remaining height */
          overflow: auto;                /* ensures complete text remains visible within fixed card */
        }
        .list-title{
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.35;
          /* no clamps, no ellipsis */
          word-break: break-word;
        }
        .list-text{
          margin: 0;
          font-size: 15px;
          color: #475569;
          line-height: 1.4;
          /* no clamps, no ellipsis */
          word-break: break-word;
        }

        .list-meta{
          display: flex;
          flex-wrap: wrap;
          gap: 12px 18px;
        }
        .meta{
          font-size: 15px;               /* larger, more presence */
          font-weight: 700;
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          line-height: 1.3;
          white-space: normal;           /* allow wrapping if needed */
        }
        .meta-icon{ font-size: 18px; }

        /* subtle visual for sold */
        .listing-style1.is-sold { opacity: 0.95; }
      `}</style>
    </>
  );
}
