"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useListings } from "@/lib/useApi";

function useResolvedProperty(passed) {
  const params = useParams();
  const routeId = String(params?.id ?? "");
  const { data: listings = [] } = useListings();

  return useMemo(() => {
    if (passed) return passed;
    if (!routeId || !listings.length) return null;

    const norm = (v) => v?.toString().trim();
    const slug = (v) => v?.toString().toLowerCase().replace(/\s+/g, "-");

    return (
      listings.find((l) => {
        const lid = l.id ?? l._id ?? l.slug ?? l.propertyId ?? l.listingId ?? l.uuid;
        if (norm(lid) === routeId) return true;

        if (l.title && l.city) {
          const gen = `${slug(l.city)}-${slug(l.title)}`;
          if (gen === routeId) return true;
        }
        return false;
      }) || null
    );
  }, [passed, routeId, listings]);
}

export default function PropertyNearby({ property: propertyProp }) {
  const property = useResolvedProperty(propertyProp);
  if (!property) return null;

  // accept both whatsNearby and nearby, fallback to empty array
  const raw = property.whatsNearby || property.nearby || [];
  const items = Array.isArray(raw)
    ? raw.filter((x) => x && (x.label || x.name))
    : [];

  if (items.length === 0) {
    return (
      <div className="col-md-12">
        <div className="bdr1 bdrs12 p20 text-muted">
          No nearby places provided.
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-12">
      <div className="row">
        {items.map((it, i) => {
          const label = it.label || it.name || "—";
          const distance = it.distance || "";
          const category = it.category || "";

          return (
            <div className="col-12 col-md-6 mb15" key={`${label}-${i}`}>
              <div className="bdr1 bdrs12 p15 h-100 d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="fw600">{label}</div>
                  {(distance || category) && (
                    <div className="text-muted fz14">
                      {category && <span className="me-2">{category}</span>}
                      {distance && <span>• {distance}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
