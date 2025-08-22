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

/* ---------- helpers ---------- */
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
        {properties.slice(0, 6).map((property, idx) => {
          const id = pickId(property);
          const key = id
            ? `feature-${id}-${idx}`
            : `noid-${property?.city ?? "city"}-${property?.title ?? "title"}-${idx}`;

          const availability = deriveAvailability(property);
          const isSold = availability === "Sold";

          const showBed = Number.isFinite(property?.bed);
          const showBath = Number.isFinite(property?.bath);
          const showSqft = Number.isFinite(property?.sqft);

          return (
            <SwiperSlide key={key}>
              <div
                className={`listing-style1 ${isSold ? "is-sold" : "is-sale"} card-fixed`}
              >
                {id && (
                  <Link
                    href={`/single-v3/${encodeURIComponent(String(id))}`}
                    className="stretched"
                    aria-label={`Open ${property?.title ?? "property"}`}
                    prefetch={false}
                  >
                    <span aria-hidden="true" />
                  </Link>
                )}

                {/* ===== Image area ===== */}
                <div className="list-thumb position-relative">
                  <Image
                    fill
                    className="thumb-img"
                    src={property.image || "/images/listings/property_slide_1.jpg"}
                    alt={property.title || "property"}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />

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
                  {property.featured && (
                    <div className="featured-badge">
                      <span className="flaticon-electricity me-2" />
                      FEATURED
                    </div>
                  )}

                  {/* Price chip */}
                  {property.price != null && (
                    <div className="list-price">
                      ${Number(property.price).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* ===== Body ===== */}
                <div className="list-content">
                  {property?.title && <h6 className="list-title">{property.title}</h6>}
                  {property?.location && <p className="list-text">{property.location}</p>}

                  {(showBed || showBath || showSqft) && (
                    <div className="list-meta">
                      {showBed && (
                        <span className="meta">
                          <span className="flaticon-bed meta-icon" /> {property.bed} Bedroom
                          {property.bed === 1 ? "" : "s"}
                        </span>
                      )}
                      {showBath && (
                        <span className="meta">
                          <span className="flaticon-shower meta-icon" /> {property.bath} Bathroom
                          {property.bath === 1 ? "" : "s"}
                        </span>
                      )}
                      {showSqft && (
                        <span className="meta">
                          <span className="flaticon-expand meta-icon" /> {property.sqft.toLocaleString()} sq ft
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Controls */}
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

      <style jsx>{`
        .card-fixed {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 450px;
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,.06);
          transition: transform .18s ease, box-shadow .18s ease;
          cursor: pointer;
        }
        .card-fixed:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(0,0,0,.08);
        }

        .stretched { position: absolute; inset: 0; z-index: 10; }

        .list-thumb {
          position: relative;
          border-radius: 14px 14px 0 0;
          overflow: hidden;
          height: 260px;
          background: #f3f4f6;
          flex: 0 0 auto;
        }
        @media (max-width: 575px) {
          .list-thumb { height: 240px; }
        }
        .thumb-img { object-fit: cover; object-position: center; }

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
          backdrop-filter: saturate(140%) blur(4px);
          white-space: normal;
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
          width: auto;
          max-width: calc(100% - 24px);
        }

        .list-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 18px 18px 16px;
          flex: 1 1 auto;
          overflow: auto;
        }
        .list-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.35;
          word-break: break-word;
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
        }
        .meta-icon { font-size: 18px; }

        .listing-style1.is-sold { opacity: 0.95; }
      `}</style>
    </>
  );
}