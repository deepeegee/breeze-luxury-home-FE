"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useListings } from "@/lib/useApi";
import Spinner from "@/components/common/Spinner";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* ---------- helpers (same as grid) ---------- */
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

function deriveAvailability(p = {}) {
  const raw = (p.availability || p.status || p.listedIn || "").toString().toLowerCase();
  if (raw.includes("sold")) return "Sold";
  if (raw.includes("available") || raw.includes("active") || raw.includes("publish")) return "For sale";
  return "For sale";
}

/* pretty-case for labels (same as grid) */
const pretty = (s) =>
  (s ?? "")
    .toString()
    .trim()
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export default function FeatureProperties() {
  const { data: allProperties = [], isLoading, error } = useListings();
  const properties = allProperties.filter((p) => p.featured === true);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading properties: {error.message}</div>;
  if (!properties.length) {
    return (
      <div className="text-center py-5">
        <p>No Featured Properties Available</p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".featurePro_next__active",
          prevEl: ".featurePro_prev__active",
        }}
        pagination={{
          el: ".featurePro_pagination__active",
          clickable: true,
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        slidesPerView={2}
        breakpoints={{
          300: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 2, spaceBetween: 30 },
          1200: { slidesPerView: 2, spaceBetween: 30 },
        }}
      >
        {properties.slice(0, 6).map((listing, idx) => {
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

          const propertyType =
            (listing?.propertyType && pretty(listing.propertyType)) ||
            (listing?.category && pretty(listing.category)) ||
            "";

          const propertyName = listing?.name ? pretty(listing.name) : "";

          return (
            <SwiperSlide key={key}>
              {id ? (
                <Link
                  href={`/single-v3/${encodeURIComponent(String(id))}`}
                  className="card-link"
                  aria-label={`Open ${listing?.title ?? "property"}`}
                  prefetch={false}
                >
                  <div className={`listing-style1 ${isSold ? "is-sold" : "is-sale"} card-fixed`}>
                    {/* ===== Image area (same as grid) ===== */}
                    <div className="list-thumb">
                      {(listing.image || "/images/listings/property_slide_1.jpg") && (
                        <Image
                          fill
                          className="thumb-img"
                          src={listing.image || "/images/listings/property_slide_1.jpg"}
                          alt={listing.title ?? propertyName ?? "property"}
                          sizes="(max-width: 768px) 100vw, 50vw"
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

                      {/* Price chip (₦ like grid) */}
                      {listing?.price != null && (
                        <div className="list-price">₦{Number(listing.price).toLocaleString()}</div>
                      )}
                    </div>

                    {/* ===== Body (same as grid) ===== */}
                    <div className="list-content">
                      {(listing?.title || propertyName) && (
                        <h6 className="list-title">{listing?.title || propertyName || "Property"}</h6>
                      )}

                      {propertyType && <span className="type-chip">{propertyType}</span>}

                      {propertyName && propertyName !== listing?.title && (
                        <div className="name-line">{propertyName}</div>
                      )}

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
                </Link>
              ) : (
                <div className={`listing-style1 ${isSold ? "is-sold" : "is-sale"} card-fixed no-link`}>
                  {/* Same content but without link wrapper */}
                  <div className="list-thumb">
                    {(listing.image || "/images/listings/property_slide_1.jpg") && (
                      <Image
                        fill
                        className="thumb-img"
                        src={listing.image || "/images/listings/property_slide_1.jpg"}
                        alt={listing.title ?? propertyName ?? "property"}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={false}
                      />
                    )}

                    <span
                      className={`status-badge ${isSold ? "sold" : "sale"}`}
                      aria-label={availability}
                      title={availability}
                    >
                      <i className={`fas ${isSold ? "fa-ban" : "fa-check-circle"} me-2`} />
                      {isSold ? "SOLD" : "FOR SALE"}
                    </span>

                    {listing?.featured && (
                      <div className="featured-badge" aria-label="Featured property">
                        <span className="flaticon-electricity me-2" />
                        FEATURED
                      </div>
                    )}

                    {listing?.price != null && (
                      <div className="list-price">₦{Number(listing.price).toLocaleString()}</div>
                    )}
                  </div>

                  <div className="list-content">
                    {(listing?.title || propertyName) && (
                      <h6 className="list-title">{listing?.title || propertyName || "Property"}</h6>
                    )}

                    {propertyType && <span className="type-chip">{propertyType}</span>}

                    {propertyName && propertyName !== listing?.title && (
                      <div className="name-line">{propertyName}</div>
                    )}

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
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Controls (unchanged) */}
      <div className="row align-items-center justify-content-center mt30">
        <div className="col-auto">
          <button className="featurePro_prev__active swiper_button" aria-label="Previous">
            <i className="far fa-arrow-left-long" />
          </button>
        </div>
        <div className="col-auto">
          <div className="pagination swiper--pagination featurePro_pagination__active" />
        </div>
        <div className="col-auto">
          <button className="featurePro_next__active swiper_button" aria-label="Next">
            <i className="far fa-arrow-right-long" />
          </button>
        </div>
      </div>

      {/* === UPDATED styling for better clickability === */}
      <style jsx>{`
        /* Link wrapper for entire card */
        .card-link {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .card-link:hover,
        .card-link:focus {
          text-decoration: none;
          color: inherit;
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(0,0,0,.08);
        }

        /* Equal-height card frame */
        .card-fixed {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 560px; /* uniform height */
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        
        /* Remove hover effects from card when wrapped in link */
        .card-link .card-fixed {
          transition: none;
        }
        .card-link .card-fixed:hover {
          transform: none;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
        }

        /* No-link fallback */
        .no-link {
          cursor: default;
        }
        .no-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(0,0,0,.08);
        }

        /* Media area */
        .list-thumb {
          position: relative; /* required for <Image fill> */
          height: 260px;      /* fixed media height = no layout shift */
          background: #f3f4f6;
          border-radius: 14px 14px 0 0;
          overflow: hidden;
          flex: 0 0 auto;
        }
        @media (max-width: 575px) { .list-thumb { height: 240px; } }

        /* Ensure no image distortion / shrinking */
        .thumb-img { object-fit: cover; object-position: center; }
        .list-thumb :global(img) {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
        }

        /* Badges */
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
          white-space: normal;
          pointer-events: none; /* Allow clicks to pass through */
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
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,.65);
          color: #fff;
          padding: 8px 10px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          line-height: 1.1;
          width: auto;
          max-width: calc(100% - 24px);
          pointer-events: none; /* Allow clicks to pass through */
        }

        .list-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 18px 18px 16px;
          flex: 1 1 auto;
          overflow: auto; /* fixed card height; content scrolls if very long */
        }
        .list-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.35;
          word-break: break-word;
        }

        /* Type chip */
        .type-chip {
          align-self: flex-start;
          background: #eef2ff;
          color: #1e40af;
          border: 1px solid #c7d2fe;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: .2px;
          padding: 6px 10px;
          border-radius: 999px;
          pointer-events: none; /* Allow clicks to pass through */
        }

        /* Name line */
        .name-line {
          align-self: flex-start;
          padding: 6px 10px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-weight: 700;
          font-size: 13px;
          line-height: 1.2;
          pointer-events: none; /* Allow clicks to pass through */
        }

        .list-text {
          margin: 0;
          font-size: 15px;
          color: #475569;
          line-height: 1.4;
          word-break: break-word;
        }

        .list-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 18px;
        }
        .meta {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          line-height: 1.3;
          pointer-events: none; /* Allow clicks to pass through */
        }
        .meta-icon { font-size: 18px; }

        .listing-style1.is-sold { opacity: 0.95; }
      `}</style>
    </>
  );
}