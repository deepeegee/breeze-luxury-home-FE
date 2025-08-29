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

export default function ProperteyFiltering() {
  const searchParams = useSearchParams();

  /* --------------------------------
   * URL → stable key → URLSearchParams
   * -------------------------------- */
  const searchKey = useMemo(() => (searchParams ? searchParams.toString() : ""), [searchParams]);
  const sp = useMemo(() => new URLSearchParams(searchKey), [searchKey]);

  /* --------------------------------
   * Build server query from URL params
   * -------------------------------- */
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
    put("category", get("type"));
    put("propertyId", get("propertyId"));
    // NOTE: we intentionally DO NOT push Buy/Rent → listedIn until BE supports it
    return out;
  }, [sp]);

  const hookParams = Object.keys(serverParams).length ? serverParams : undefined;

  /* --------------------------------
   * Data: properties from BE
   * -------------------------------- */
  const { data: listings = [], isLoading, error } = useListings(hookParams);

  /* --------------------------------
   * Local UI state (filters / sorting / paging)
   * -------------------------------- */
  const [filteredData, setFilteredData] = useState([]);
  const [sortedFilteredData, setSortedFilteredData] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(false);

  // filters
  const [listingStatus, setListingStatus] = useState("All"); // Buy | Rent | All
  const [propertyTypes, setPropertyTypes] = useState([]); // array of category strings
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState([]); // [min, max]
  const [yearBuild, setyearBuild] = useState([0, 2050]);
  const [categories, setCategories] = useState([]); // amenities selected
  const [searchQuery, setSearchQuery] = useState("");

  /* --------------------------------
   * Filter handlers (used by sidebar & modal)
   * -------------------------------- */
  const handlelistingStatus = (v) => setListingStatus(v);
  const handlepropertyTypes = (v) => {
    if (v === "All") {
      setPropertyTypes([]);
    } else {
      setPropertyTypes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    }
  };
  const handlepriceRange = (v) => setPriceRange(v);
  const handlebedrooms = (v) => setBedrooms(v);
  const handlebathroms = (v) => setBathroms(v);
  const handlelocation = (v) => setLocation(v || "All Cities");
  const handlesquirefeet = (v) => setSquirefeet(v);
  const handleyearBuild = (v) => setyearBuild(v);
  const handlecategories = (v) => {
    if (v === "All") {
      setCategories([]);
    } else {
      setCategories((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    }
  };

  const resetFilter = () => {
    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, 1000000]);
    setBedrooms(0);
    setBathroms(0);
    setLocation("All Cities");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setSearchQuery("");
    setPageNumber(1);
  };

  /* --------------------------------
   * Provide a single object of fns/values to children
   * (includes setCategories + onFiltersChanged)
   * -------------------------------- */
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
    setCategories, // ✅ so modal can directly set amenities
    resetFilter,

    // whenever a control changes, go back to page 1
    onFiltersChanged: () => setPageNumber(1),
  };

  /* --------------------------------
   * Initialize filters from URL on mount / URL change
   * -------------------------------- */
  useEffect(() => {
    const getNum = (k) => {
      const v = sp.get(k);
      if (v == null || v === "") return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };

    setSearchQuery(sp.get("q") || "");
    setLocation(sp.get("location") || "All Cities");

    const status = sp.get("status");
    setListingStatus(["Buy", "Rent", "All"].includes(status) ? status : "All");

    const type = sp.get("type");
    setPropertyTypes(
      type
        ? type
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    );

    const minP = getNum("minPrice");
    const maxP = getNum("maxPrice");
    setPriceRange([minP ?? 0, maxP ?? 1000000]);

    setBedrooms(getNum("beds") ?? 0);
    setBathroms(getNum("baths") ?? 0);

    const yMin = getNum("yearMin");
    const yMax = getNum("yearMax");
    setyearBuild([yMin ?? 0, yMax ?? 2050]);
  }, [sp]);

  /* --------------------------------
   * Helpers for filtering
   * -------------------------------- */
  const toNum = (v) => (typeof v === "number" ? v : Number(String(v || "").replace(/\$|,/g, "")));

  const deriveMode = (el) => {
    if (typeof el?.forRent === "boolean") return el.forRent ? "Rent" : "Buy";
    const direct = el?.listedIn ?? el?.listed ?? el?.rentOrBuy ?? el?.transactionType ?? el?.offerType;
    const purpose = el?.purpose ?? el?.status;
    const test = (v) => {
      if (!v) return null;
      const s = String(v).toLowerCase();
      if (/(rent|lease)/.test(s)) return "Rent";
      if (/(buy|sale|sell)/.test(s)) return "Buy";
      if (s === "rent" || s === "buy") return s === "rent" ? "Rent" : "Buy";
      return null;
    };
    return test(direct) || test(purpose);
  };

  /* --------------------------------
   * FILTER: recompute whenever data or filters change
   * -------------------------------- */
  useEffect(() => {
    if (isLoading) return;
    if (!Array.isArray(listings)) return;

    if (listings.length === 0) {
      setFilteredData((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    // base (Buy / Rent) — if unknown, include it (don’t over-filter)
    const base = listings.filter((el) => {
      if (listingStatus === "All") return true;
      const mode = deriveMode(el);
      if (!mode) return true; // keep if we can’t tell
      return listingStatus === mode;
    });

    const andFilters = [];

    // type/category (ANY of the selected categories? Here we require the prop type to be one of them)
    if (propertyTypes.length > 0) {
      andFilters.push(base.filter((el) => propertyTypes.includes(el.propertyType || el.category)));
    }

    // bedrooms / bathrooms
    if (bedrooms > 0) {
      andFilters.push(base.filter((el) => (el.bedrooms ?? el.bed ?? el.rooms ?? 0) >= bedrooms));
    }
    if (bathroms > 0) {
      andFilters.push(base.filter((el) => (el.bathrooms ?? el.bath ?? 0) >= bathroms));
    }

    // amenities / features (case-insensitive)
    if (categories.length > 0) {
      const norm = (s) => String(s ?? "").trim().toLowerCase();
      andFilters.push(
        base.filter((el) => {
          const have = new Set((el.amenities || el.features || []).map(norm));
          // AND logic: every selected amenity must be present
          return categories.every((c) => have.has(norm(c)));
          // If you prefer OR logic, replace with:
          // return categories.some((c) => have.has(norm(c)));
        })
      );
    }

    // city/location
    if (location && location !== "All Cities") {
      andFilters.push(base.filter((el) => String(el.city || "") === location));
    }

    // price range
    if (priceRange && (priceRange[0] > 0 || priceRange[1] < 1000000)) {
      andFilters.push(
        base.filter((el) => {
          const p = toNum(el.price);
          return p >= priceRange[0] && p <= priceRange[1];
        })
      );
    }

    // sqft/size
    if (squirefeet && squirefeet.length === 2 && squirefeet[1] > 0) {
      andFilters.push(
        base.filter((el) => {
          const size = el.sizeInFt ?? el.sqft ?? 0;
          return size >= squirefeet[0] && size <= squirefeet[1];
        })
      );
    }

    // year built
    if (yearBuild && yearBuild.length === 2 && (yearBuild[0] > 0 || yearBuild[1] < 2050)) {
      andFilters.push(
        base.filter((el) => {
          const y = el.yearBuilt ?? el.yearBuilding ?? 0;
          return y >= yearBuild[0] && y <= yearBuild[1];
        })
      );
    }

    // free text search (client-side)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
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
          ].some((v) => v && String(v).toLowerCase().includes(q))
        )
      );
    }

    const next =
      andFilters.length === 0 ? base : base.filter((item) => andFilters.every((arr) => arr.includes(item)));

    setFilteredData((prev) => {
      if (prev.length === next.length && prev.every((p, i) => (p._id ?? p.id ?? i) === (next[i]?._id ?? next[i]?.id ?? i))) {
        return prev;
      }
      return next;
    });
  }, [
    isLoading,
    listings,
    // filters:
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
  ]);

  /* --------------------------------
   * SORT
   * -------------------------------- */
  useEffect(() => {
    if (!Array.isArray(filteredData)) return;

    setPageNumber(1);

    let next = filteredData;
    if (currentSortingOption === "Newest") {
      next = [...filteredData].sort(
        (a, b) => (b.yearBuilt ?? b.yearBuilding ?? 0) - (a.yearBuilt ?? a.yearBuilding ?? 0)
      );
    } else if (currentSortingOption === "Price Low") {
      next = [...filteredData].sort((a, b) => toNum(a.price) - toNum(b.price));
    } else if (currentSortingOption === "Price High") {
      next = [...filteredData].sort((a, b) => toNum(b.price) - toNum(a.price));
    }

    setSortedFilteredData(next);
  }, [filteredData, currentSortingOption]);

  /* --------------------------------
   * PAGINATION
   * -------------------------------- */
  useEffect(() => {
    if (!Array.isArray(sortedFilteredData)) return;

    const start = (pageNumber - 1) * 9;
    const end = pageNumber * 9;
    const total = sortedFilteredData.length;

    setPageItems(sortedFilteredData.slice(start, end));
    setPageContentTrac([total === 0 ? 0 : start + 1, Math.min(end, total), total]);
  }, [pageNumber, sortedFilteredData]);

  /* --------------------------------
   * Render
   * -------------------------------- */
  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="text-center py-5">
        Error loading properties: {error.message}
      </div>
    );
  }

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
              // locationOptions can be omitted here; modal pulls cities from BE via useListings
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
