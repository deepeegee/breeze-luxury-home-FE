"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import ListingSidebar from "../../sidebar";
import AdvanceFilterModal from "@/components/common/advance-filter-two";
import TopFilterBar from "./TopFilterBar";
import FeaturedListings from "./FeaturedListings";
import PaginationTwo from "../../PaginationTwo";
import Spinner from "@/components/common/Spinner";

import { useListings } from "@/lib/useApi";
import { AMENITY_GROUPS } from "@/constants/propertyOptions";

/* ──────────────────────────────────────────────────────────────
  Constants / helpers
────────────────────────────────────────────────────────────── */
const PRICE_MAX = 2_000_000_000; // ₦2B ceiling

const DUPLEX_VARIANTS = [
  "Fully-Detached Duplex",
  "Semi-Detached Duplex",
  "Terraced Duplex",
  "Terrace Duplex",
  "Detached Duplex",
  "Contemporary Duplex",
  "Duplex",
];

const norm = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const toNum = (v) =>
  typeof v === "number"
    ? v
    : Number(String(v || "").replace(/[₦,\s]/g, "").replace(/ngn/i, ""));

function matchesAvailabilityLabel(el, label) {
  if (label === "All") return true;
  const raw = (
    el.propertyAvailability ??
    el.availability ??
    el.status ??
    el.listedIn ??
    ""
  )
    .toString()
    .toLowerCase();

  const isSold = /sold/.test(raw);
  const isAvailable = /available|active|publish/.test(raw) && !isSold;

  return label === "Sold" ? isSold : isAvailable;
}

function extractTypeCandidates(el) {
  // Be VERY permissive: take every likely field the BE might use
  const cands = [
    el.propertyType,
    el.category,
    el.propertyCategory,
    el.type,
    el.property_type,
    el.listingType,
    el.kind,
  ]
    .map((x) => (x == null ? "" : String(x)))
    .filter(Boolean);

  // Also split on slashes/commas in case BE sends "Duplex / Contemporary"
  const splitCands = cands.flatMap((s) =>
    s.split(/[\/|,]+/).map((t) => t.trim())
  );

  // Deduplicate, normalized
  const set = new Set(splitCands.map(norm));
  return Array.from(set); // array of normalized type strings
}

function buildWantedTypeSet(propertyTypes = [], urlHasDuplexGroup = false) {
  const wanted = new Set(propertyTypes.map(norm));
  if (urlHasDuplexGroup || [...wanted].some((t) => t.includes("duplex"))) {
    for (const v of DUPLEX_VARIANTS) wanted.add(norm(v));
    wanted.add("duplex"); // sentinel: match any type that contains "duplex"
  }
  return wanted;
}

/* ──────────────────────────────────────────────────────────────
  Component
────────────────────────────────────────────────────────────── */
export default function ProperteyFiltering() {
  const searchParams = useSearchParams();

  // Stable key to avoid re-renders
  const searchKey = useMemo(
    () => (searchParams ? searchParams.toString() : ""),
    [searchParams]
  );
  const sp = useMemo(() => new URLSearchParams(searchKey), [searchKey]);

  // Build server query (INTENTIONALLY do NOT send category/type)
  const serverParams = useMemo(() => {
    const get = (k) => sp.get(k);
    const out = {};
    const put = (k, v) => {
      if (v == null) return;
      const s = String(v).trim();
      if (!s || s === "undefined" || s === "null") return;
      out[k] = s;
    };
    put("q", get("q"));
    put("city", get("location"));
    put("minPrice", get("minPrice"));
    put("maxPrice", get("maxPrice"));
    put("bedrooms", get("beds"));
    put("bathrooms", get("baths"));
    // 🚫 DO NOT: put("category", get("type"));
    put("propertyId", get("propertyId"));
    return out;
  }, [sp]);

  const hookParams = Object.keys(serverParams).length ? serverParams : undefined;

  // Data
  const { data: listings = [], isLoading, error } = useListings(hookParams);

  // UI state
  const [filteredData, setFilteredData] = useState([]);
  const [sortedFilteredData, setSortedFilteredData] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(false);

  // filters
  const [listingStatus, setListingStatus] = useState("All"); // 'All' | 'Available' | 'Sold'
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState([]); // [min, max]
  const [yearBuild, setyearBuild] = useState([0, 2050]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Handlers
  const handlelistingStatus = (v) => {
    setListingStatus(v);
    setPageNumber(1);
  };
  const handlepropertyTypes = (v) => {
    if (v === "All") setPropertyTypes([]);
    else
      setPropertyTypes((prev) =>
        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
      );
    setPageNumber(1);
  };
  const handlepriceRange = (v) => {
    setPriceRange(v);
    setPageNumber(1);
  };
  const handlebedrooms = (v) => {
    setBedrooms(v);
    setPageNumber(1);
  };
  const handlebathroms = (v) => {
    setBathroms(v);
    setPageNumber(1);
  };
  const handlelocation = (v) => {
    setLocation(v || "All Cities");
    setPageNumber(1);
  };
  const handlesquirefeet = (v) => {
    setSquirefeet(v);
    setPageNumber(1);
  };
  const handleyearBuild = (v) => {
    setyearBuild(v);
    setPageNumber(1);
  };
  const handlecategories = (v) => {
    if (v === "All") setCategories([]);
    else
      setCategories((prev) =>
        prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
      );
    setPageNumber(1);
  };

  const resetFilter = () => {
    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, PRICE_MAX]);
    setBedrooms(0);
    setBathroms(0);
    setLocation("All Cities");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setSearchQuery("");
    setPageNumber(1);
  };

  const filterFunctions = {
    // handlers
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathroms,
    handlelocation,
    handlesquirefeet,
    handleyearBuild,
    handlecategories,
    // values
    priceRange,
    listingStatus,
    propertyTypes,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    // helpers
    setPropertyTypes,
    setSearchQuery,
    setCategories,
    resetFilter,
    onFiltersChanged: () => setPageNumber(1),
  };

  /* Initialize filters from URL (incl. duplex group support) */
  useEffect(() => {
    const getNum = (k) => {
      const v = sp.get(k);
      if (v == null || v === "") return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };
    const getCSV = (k) => {
      const v = sp.get(k);
      if (!v) return [];
      return v
        .split(",")
        .map((s) => {
          try {
            return decodeURIComponent(s.trim());
          } catch {
            return s.trim();
          }
        })
        .filter(Boolean);
    };

    setSearchQuery(sp.get("q") || "");
    setLocation(sp.get("location") || "All Cities");

    const statusQ = (sp.get("status") || "").toLowerCase();
    setListingStatus(
      statusQ === "sold" ? "Sold" : statusQ === "available" ? "Available" : "All"
    );

    const fromType = getCSV("type");
    const typeGroup = (sp.get("typeGroup") || "").toLowerCase();

    if (typeGroup === "duplex") {
      // always include all duplex variants
      setPropertyTypes([...new Set([...fromType, ...DUPLEX_VARIANTS])]);
    } else {
      setPropertyTypes(fromType);
    }

    const minP = getNum("minPrice");
    const maxP = getNum("maxPrice");
    setPriceRange([minP ?? 0, maxP ?? PRICE_MAX]);

    setBedrooms(getNum("beds") ?? 0);
    setBathroms(getNum("baths") ?? 0);

    const yMin = getNum("yearMin");
    const yMax = getNum("yearMax");
    setyearBuild([yMin ?? 0, yMax ?? 2050]);
  }, [sp]);

  /* FILTER */
  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(listings)) return;

    if (listings.length === 0) {
      setFilteredData((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    // base by availability
    const base = listings.filter((el) =>
      matchesAvailabilityLabel(el, listingStatus)
    );

    const andFilters = [];

    // types (robust matching + duplex group)
    const urlHasDuplexGroup = (sp.get("typeGroup") || "").toLowerCase() === "duplex";
    const wantedTypes = buildWantedTypeSet(propertyTypes, urlHasDuplexGroup);

    if (wantedTypes.size > 0) {
      andFilters.push(
        base.filter((el) => {
          const candidates = extractTypeCandidates(el); // normalized strings
          if (candidates.length === 0) return false;

          // exact normalized match against any wanted
          for (const c of candidates) {
            if (wantedTypes.has(c)) return true;
          }
          // duplex fuzzy: any candidate that *contains* “duplex”
          if (wantedTypes.has("duplex") && candidates.some((c) => c.includes("duplex"))) {
            return true;
          }
          return false;
        })
      );
    }

    // bedrooms / bathrooms
    if (bedrooms > 0) {
      andFilters.push(
        base.filter(
          (el) => (el.bedrooms ?? el.bed ?? el.rooms ?? 0) >= bedrooms
        )
      );
    }
    if (bathroms > 0) {
      andFilters.push(
        base.filter((el) => (el.bathrooms ?? el.bath ?? 0) >= bathroms)
      );
    }

    // amenities (AND)
    if (categories.length > 0) {
      const wantedAmen = new Set(categories.map(norm));
      andFilters.push(
        base.filter((el) => {
          const have = new Set(
            (el.amenities || el.features || []).map((x) => norm(x))
          );
          for (const w of wantedAmen) {
            if (!have.has(w)) return false;
          }
          return true;
        })
      );
    }

    // city
    if (location && location !== "All Cities") {
      const locKey = norm(location);
      andFilters.push(base.filter((el) => norm(el.city) === locKey));
    }

    // price
    if (priceRange && (priceRange[0] > 0 || priceRange[1] < PRICE_MAX)) {
      andFilters.push(
        base.filter((el) => {
          const p = toNum(el.price);
          return Number.isFinite(p) && p >= priceRange[0] && p <= priceRange[1];
        })
      );
    }

    // sqft
    if (squirefeet && squirefeet.length === 2 && squirefeet[1] > 0) {
      andFilters.push(
        base.filter((el) => {
          const size = el.sizeInFt ?? el.sqft ?? 0;
          return size >= squirefeet[0] && size <= squirefeet[1];
        })
      );
    }

    // year
    if (yearBuild && yearBuild.length === 2 && (yearBuild[0] > 0 || yearBuild[1] < 2050)) {
      andFilters.push(
        base.filter((el) => {
          const y = el.yearBuilt ?? el.yearBuilding ?? 0;
          return y >= yearBuild[0] && y <= yearBuild[1];
        })
      );
    }

    // free text
    if ((searchQuery || "").trim()) {
      const q = norm(searchQuery);
      andFilters.push(
        base.filter((el) =>
          [
            el.title,
            el.name,
            el.description,
            el.address,
            el.city,
            el.state,
            el.country,
            el.propertyId,
            el.category,
            el.propertyType,
          ]
            .map(norm)
            .some((v) => v.includes(q))
        )
      );
    }

    const next =
      andFilters.length === 0
        ? base
        : base.filter((item) => andFilters.every((arr) => arr.includes(item)));

    setFilteredData((prev) => {
      const sameLen = prev.length === next.length;
      const sameIds =
        sameLen &&
        prev.every(
          (p, i) =>
            (p._id ?? p.id ?? i) === (next[i]?._id ?? next[i]?.id ?? i)
        );
      return sameIds ? prev : next;
    });
  }, [
    isLoading,
    listings,
    // filters
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    searchQuery,
    sp, // so typeGroup param reacts
  ]);

  /* SORT */
  useEffect(() => {
    if (!Array.isArray(filteredData)) return;

    setPageNumber(1);

    let next = filteredData;
    if (currentSortingOption === "Newest") {
      next = [...filteredData].sort(
        (a, b) =>
          (b.yearBuilt ?? b.yearBuilding ?? 0) -
          (a.yearBuilt ?? a.yearBuilding ?? 0)
      );
    } else if (currentSortingOption === "Price Low") {
      next = [...filteredData].sort((a, b) => toNum(a.price) - toNum(b.price));
    } else if (currentSortingOption === "Price High") {
      next = [...filteredData].sort((a, b) => toNum(b.price) - toNum(a.price));
    }

    setSortedFilteredData(next);
  }, [filteredData, currentSortingOption]);

  /* PAGINATION */
  useEffect(() => {
    if (!Array.isArray(sortedFilteredData)) return;

    const start = (pageNumber - 1) * 9;
    const end = pageNumber * 9;
    const total = sortedFilteredData.length;

    setPageItems(sortedFilteredData.slice(start, end));
    setPageContentTrac([
      total === 0 ? 0 : start + 1,
      Math.min(end, total),
      total,
    ]);
  }, [pageNumber, sortedFilteredData]);

  /* Render */
  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div className="text-center py-5">
        Error loading properties: {error.message}
      </div>
    );

  return (
    <section className="pt0 pb90 bgc-f7">
      <div className="container">
        {/* Mobile filter sidebar */}
        <div className="offcanvas offcanvas-start p-0" tabIndex="-1" id="listingSidebarFilter">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Listing Filter</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body p-0">
            <ListingSidebar filterFunctions={filterFunctions} />
          </div>
        </div>

        {/* Advanced Modal */}
        <div className="advance-feature-modal">
          <div className="modal fade" id="advanceSeachModal" tabIndex={-1}>
            <AdvanceFilterModal
              filterFunctions={filterFunctions}
              amenitiesOptions={AMENITY_GROUPS}
            />
          </div>
        </div>

        <div className="row">
          <TopFilterBar
            pageContentTrac={pageContentTrac || [0, 0, 0]}
            colstyle={colstyle}
            setColstyle={setColstyle}
            filterFunctions={filterFunctions}
            setCurrentSortingOption={setCurrentSortingOption}
          />
        </div>

        <div className="row">
          <FeaturedListings colstyle={colstyle} data={pageItems || []} />
          {sortedFilteredData.length === 0 && (
            <div className="text-center py-5">No properties match your search.</div>
          )}
        </div>

        <div className="row">
          <PaginationTwo
            pageCapacity={9}
            data={sortedFilteredData || []}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        </div>
      </div>
    </section>
  );
}
