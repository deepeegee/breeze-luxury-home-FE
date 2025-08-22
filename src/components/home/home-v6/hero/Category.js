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
                <span className="icon-wrap" aria-hidden="true">
                  {t.iconImg ? (
                    <Image
                      src={t.iconImg}
                      alt=""
                      width={22}
                      height={22}
                      className="icon-img"
                      priority={false}
                    />
                  ) : (
                    <i className={`icon ${t.icon}`} />
                  )}
                </span>

                <div className="label-container">
                  <div className="label-text">{t.label}</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        :root {
          --brand: var(--color-primary, var(--bs-primary, #0d6efd));
          --ink: #0f172a;
          --ink-muted: #475569;
          --icon: #1f2937;
          --chip-bg: #f1f5f9;
        }

        .property-types-wrap { margin-top: 24px; }

        /* Card base */
        .pt-card {
          gap: 10px;
          min-height: 48px;
          padding: clamp(10px, 2.5vw, 16px); /* tighter on small, comfy on lg */
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }
        .pt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          text-decoration: none;
        }
        /* Focus ring (keyboard) */
        :global(.pt-card:focus-visible) {
          outline: 0;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 30%, transparent);
        }

        /* Icon stays neutral */
        .icon-wrap {
          width: clamp(26px, 5.8vw, 32px);
          height: clamp(26px, 5.8vw, 32px);
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--chip-bg);
          flex: 0 0 auto;
        }
        .icon { font-size: clamp(18px, 4.8vw, 22px); color: var(--icon); }
        .icon-img { object-fit: contain; width: 100%; height: 100%; }

        /* Text scales & wraps */
        .label-container {
          min-width: 0; /* allow text to shrink/wrap */
          display: flex;
          align-items: center;
        }
        .label-text {
          font-weight: 600;
          font-size: clamp(14px, 3.8vw, 16px);
          line-height: 1.15;
          color: var(--ink);
          /* Desktop: single line ellipsis; Mobile: allow 2 lines */
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          white-space: normal;
        }

        /* Only apply hover color on hover-capable devices */
        @media (hover: hover) and (pointer: fine) {
          :global(.pt-card:hover) .label-text { color: var(--brand) !important; }
        }

        /* ======= Responsive layout tweaks ======= */
        /* XS phones: if width gets super tight (<360px), stack 1 per row */
        @media (max-width: 360px) {
          .property-types-wrap :global(.row > [class*="col-"]) {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        /* Phones: let labels take two lines for long text */
        @media (max-width: 576px) {
          .label-text { -webkit-line-clamp: 2; }
          .pt-card { gap: 8px; }
        }

        /* Tablets: comfy spacing, three in a row already via col-md-4 */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .pt-card { padding: 14px; }
        }

        /* Reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
          .pt-card { transition: none; }
        }
      `}</style>
    </div>
  );
}