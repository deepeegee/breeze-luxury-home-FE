"use client";
import Link from "next/link";
import Image from "next/image";

/** Strings we want to match for all duplex variants */
const DUPLEX_VARIANTS = [
  "Fully-Detached Duplex",
  "Semi-Detached Duplex",
  "Terraced Duplex",
  "Terrace Duplex",
  "Detached Duplex",
  "Contemporary Duplex",
  "Duplex",
];

const TYPES = [
  // Duplex card → send a group + a multi-type fallback + q=duplex
  { label: "Duplex", icon: "flaticon-home", multiType: DUPLEX_VARIANTS },

  { value: "Bungalow", label: "Bungalow", icon: "flaticon-house-1" },
  { value: "Apartment", label: "Apartments", iconImg: "/images/apartment.svg" },
  // Townhome removed
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
          let href = "/properties";

          if (t.label === "View All Properties" || t.value === "All Properties") {
            href = "/properties";
          } else if (Array.isArray(t.multiType) && t.multiType.length) {
            // Be compatible with both “typeGroup=duplex” and a comma list of variants
            const typeParam = t.multiType.map(encodeURIComponent).join(",");
            href = `/properties?typeGroup=duplex&type=${typeParam}&q=duplex`;
          } else if (t.value) {
            href = `/properties?type=${encodeURIComponent(t.value)}`;
          }

          return (
            <div key={t.label} className="col-6 col-md-4 col-lg-3">
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

      {/* styles kept minimal and identical to your previous structure */}
      <style jsx>{`
        :root {
          --brand: var(--color-primary, var(--bs-primary, #0d6efd));
          --ink: #0f172a;
          --icon: #1f2937;
          --chip-bg: #f1f5f9;
        }
        .property-types-wrap { margin-top: 24px; }
        .pt-card { gap: 8px; min-height: 36px; padding: 8px; transition: transform .18s, box-shadow .18s, background .18s; }
        .pt-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.06); text-decoration: none; }
        :global(.pt-card:focus-visible) { outline: 0; box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 30%, transparent); }
        .icon-wrap { width: 24px; height: 24px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: var(--chip-bg); flex: 0 0 auto; }
        .icon { font-size: 14px; color: var(--icon); }
        .icon-img { object-fit: contain; width: 100%; height: 100%; }
        .label-container { min-width: 0; display: flex; align-items: center; }
        .label-text { font-weight: 600; font-size: 12px; line-height: 1.15; color: var(--ink); display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; -webkit-line-clamp: 2; white-space: normal; }
        @media (hover: hover) and (pointer: fine) { :global(.pt-card:hover) .label-text { color: var(--brand) !important; } }
        @media (max-width: 360px) {
          .property-types-wrap :global(.row > [class*="col-"]) { flex: 0 0 100%; max-width: 100%; }
          .pt-card { padding: 6px; gap: 6px; }
          .icon-wrap { width: 20px; height: 20px; }
          .icon { font-size: 12px; }
          .label-text { font-size: 11px; }
        }
        @media (min-width: 361px) and (max-width: 576px) {
          .pt-card { padding: 8px; gap: 7px; }
          .icon-wrap { width: 22px; height: 22px; }
          .icon { font-size: 13px; }
          .label-text { font-size: 12px; }
        }
        @media (min-width: 577px) and (max-width: 991.98px) {
          .pt-card { padding: 12px; gap: 9px; min-height: 42px; }
          .icon-wrap { width: 28px; height: 28px; }
          .icon { font-size: 16px; }
          .label-text { font-size: 14px; -webkit-line-clamp: 1; }
        }
        @media (min-width: 992px) {
          .pt-card { padding: 16px; gap: 10px; min-height: 48px; }
          .icon-wrap { width: 32px; height: 32px; }
          .icon { font-size: 18px; }
          .label-text { font-size: 16px; }
        }
        @media (prefers-reduced-motion: reduce) { .pt-card { transition: none; } }
      `}</style>
    </div>
  );
}
