"use client";
import Link from "next/link";
import Image from "next/image";

const TYPES = [
  { value: "Fully-Detached Duplex", label: "Duplex", icon: "flaticon-home" },
  { value: "Bungalow", label: "Bungalow", icon: "flaticon-house-1" },
  { value: "Apartment", label: "Apartments", iconImg: "/images/apartment.svg" },
  { value: "Townhome", label: "Town home", iconImg: "/images/cabin.svg" },
  { value: "Office", label: "Offices", icon: "flaticon-corporation" },
  { value: "Factory", label: "Factory", iconImg: "/images/factory.svg" },
  { value: "Land & Plots", label: "Land & Plots", icon: "flaticon-map" },
  { value: "All Properties", label: "View All Properties", icon: "flaticon-search" },
];

export default function Category() {
  return (
    <div className="property-types-wrap animate-up-4">
      <div className="row gy-3">
        {TYPES.map((t) => {
          const href =
            t.value === "All Properties"
              ? "/grid-full-3-col"
              : `/grid-full-3-col?type=${encodeURIComponent(t.value)}`;

          return (
            <div key={t.value} className="col-6 col-md-4 col-lg-3">
              <Link
                href={href}
                className="pt-card d-flex align-items-center p20 bdr1 bdrs12 bgc-f7 hover-bg-white"
                aria-label={t.label}
              >
                {/* ICON WRAPPER — stays neutral, never changes */}
                <span className="icon-wrap">
                  {t.iconImg ? (
                    <Image
                      src={t.iconImg}
                      alt={t.label}
                      width={20}
                      height={20}
                      className="icon-img"
                    />
                  ) : (
                    <i className={`icon ${t.icon}`} />
                  )}
                </span>

                {/* TEXT WRAPPER — hover only applies here */}
                <div className="label-container">
                  <div className="fw600 label-text">{t.label}</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        :root {
          --brand-color: var(--color-primary, var(--bs-primary, #0d6efd));
          --icon-color: #1f2937;
        }

        .property-types-wrap {
          margin-top: 24px;
        }

        .fw600 {
          font-weight: 600;
          font-size: 16px;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .pt-card {
          min-width: 220px;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .pt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
          text-decoration: none;
        }

        /* ✅ Only text changes color on hover */
        :global(.pt-card:hover) .label-text {
          color: var(--brand-color) !important;
        }

        /* ✅ Icons stay unchanged */
        .icon-wrap {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          margin-right: 10px;
        }

        .icon {
          font-size: 20px;
          color: var(--icon-color);
          transition: none !important; /* No hover effects */
        }

        :global(.pt-card:hover) .icon {
          color: var(--icon-color) !important;
        }

        .icon-img {
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
