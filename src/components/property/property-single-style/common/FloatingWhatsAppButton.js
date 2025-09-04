"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import "./FloatingWhatsAppButton.css";

const BUSINESS_WA = "2348148827901"; // 2348148827901

const formatNaira = (n) =>
  typeof n === "number" && Number.isFinite(n) ? `₦${n.toLocaleString("en-NG")}` : "";

export default function FloatingWhatsAppButton({ property, label = "Chat on WhatsApp" }) {
  const pathname = usePathname();

  // If this is the global button (no `property` passed) and we're on a property page,
  // hide this instance so the page-specific one can render without duplicates.
  if (!property && pathname?.startsWith("/property")) return null;

  const message = useMemo(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (property) {
      const title = property.title || property.name || "a property";
      const location =
        property.location ||
        [property.city, property.state].filter(Boolean).join(", ");
      const price = formatNaira(property.price);

      return [
        "Hello Breeze Luxury Homes.",
        "I'm interested in this property:",
        `• Title: ${title}`,
        location ? `• Location: ${location}` : null,
        price ? `• Price: ${price}` : null,
        url ? `• Link: ${url}.` : null,
        "",
        "Please share more details. Thank you!",
      ]
        .filter(Boolean)
        .join("\n");
    }

    // Generic message for non-property pages
    const pageTitle =
      (typeof document !== "undefined" && document.title) || "your listings";
    return [
      "Hello Breeze Luxury Homes.",
      "I'd like to get more information about your available properties.",
      "Please assist. Thank you!",
    ]
      .filter(Boolean)
      .join("\n");
  }, [property]);

  // Open direct chat with business number (not share link)
  const waHref = `https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(message)}`;

  return (
    <div className="floating-whatsapp-btn">
      <a
        href={waHref}
        className="whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
      >
        <i className="fab fa-whatsapp" />
      </a>
    </div>
  );
}
