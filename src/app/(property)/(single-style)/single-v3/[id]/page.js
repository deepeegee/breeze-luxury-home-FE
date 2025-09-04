// src/components/property/property-single-style/single-v3/index.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Spinner from "@/components/common/Spinner";

import FloorPlans from "@/components/property/property-single-style/common/FloorPlans";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
import PropertyNearby from "@/components/property/property-single-style/common/PropertyNearby";
import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
// import VirtualTour360 from "@/components/property/property-single-style/common/VirtualTour360"; // per request
import ScheduleTour from "@/components/property/property-single-style/sidebar/ScheduleTour";
import PropertyGallery from "@/components/property/property-single-style/single-v3/PropertyGallery";
import FloatingWhatsAppButton from "@/components/property/property-single-style/common/FloatingWhatsAppButton";
import FeatureProperties from "@/components/home/home-v6/FeatureProperties";

import { useListing, useListings } from "@/lib/useApi";
import { recordPropertyView } from "@/lib/api";
import { makePropertySlug, slugFromProperty } from "@/lib/slugifyProperty";

const isHex24 = (s) => typeof s === "string" && /^[0-9a-f]{24}$/i.test(s);

// try to locate any possible video field
const getVideoUrl = (p = {}) =>
  p.videoUrl ||
  p.videoURL ||
  p.video ||
  (p.media && p.media.video) ||
  (Array.isArray(p.videos) && p.videos.find(Boolean)) ||
  p.youtube ||
  p.youtubeUrl ||
  p.youtubeURL ||
  "";

const getIdFrom = (p) => p?.id ?? p?._id ?? null;

const SingleV3 = () => {
  const router = useRouter();
  const params = useParams();
  const idOrSlug = String(params?.id ?? "");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // read any cached property (saved when clicking from a list)
  const [cached, setCached] = useState(null);
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = sessionStorage.getItem(`prop:${idOrSlug}`);
      if (raw) setCached(JSON.parse(raw));
    } catch {}
  }, [mounted, idOrSlug]);

  const treatAsId = isHex24(idOrSlug);

  // If it's NOT an ObjectId, we do a search and match locally by slug
  const q = useMemo(
    () => (treatAsId ? "" : decodeURIComponent(idOrSlug).replace(/-/g, " ")),
    [idOrSlug, treatAsId]
  );
  const { data: listByQuery = [], isLoading: loadingByQuery } = useListings(
    q ? { q } : undefined
  );

  const matchFromQuery = useMemo(() => {
    if (!Array.isArray(listByQuery)) return null;
    return listByQuery.find((p) => slugFromProperty(p) === idOrSlug) || null;
  }, [listByQuery, idOrSlug]);

  // ✅ Derive an ID we can use to fetch FULL details even on slug pages
  const derivedId = useMemo(() => {
    if (treatAsId) return idOrSlug;
    const mId = getIdFrom(matchFromQuery);
    return mId ? String(mId) : undefined;
  }, [treatAsId, idOrSlug, matchFromQuery]);

  // ✅ Fetch full record whenever we have an ID (from path or matched slug)
  const { data: byId, isLoading: loadingById } = useListing(derivedId);

  // ✅ Merge so detail fields (like propertyDocuments) appear when byId resolves
  const property = useMemo(() => {
    if (byId) return { ...(cached || {}), ...(matchFromQuery || {}), ...byId };
    if (matchFromQuery) return { ...(cached || {}), ...matchFromQuery };
    return cached;
  }, [cached, byId, matchFromQuery]);

  // keep cache fresh with full record
  useEffect(() => {
    if (byId) {
      try {
        sessionStorage.setItem(`prop:${idOrSlug}`, JSON.stringify(byId));
      } catch {}
    }
  }, [byId, idOrSlug]);

  // pretty URL when path is an id
  useEffect(() => {
    if (!mounted || !property) return;
    if (treatAsId) {
      const slug = makePropertySlug(property);
      router.replace(`/property/${encodeURIComponent(slug)}`);
    }
  }, [mounted, property, treatAsId, router]);

  // view tracking (debounced)
  useEffect(() => {
    if (!mounted || !property || typeof window === "undefined") return;
    const propertyId = String(property.id ?? property._id ?? "");
    if (!propertyId) return;
    const key = `viewed:${propertyId}`;
    const now = Date.now();
    const last = Number(sessionStorage.getItem(key) || "0");
    if (now - last < 60_000) return;
    sessionStorage.setItem(key, String(now));
    recordPropertyView(propertyId, {
      route: window.location.pathname,
      referrer: document.referrer || undefined,
      source: "single-v3",
    });
  }, [mounted, property]);

  // set document.title
  useEffect(() => {
    if (mounted && property && typeof window !== "undefined") {
      document.title = `${property.title ?? property.name ?? "Property"} - ${
        property.city ?? ""
      } | Breeze Luxury Homes`;
    }
  }, [property, mounted]);

  const isLoading = loadingById || loadingByQuery;
  if (isLoading && !property) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        <section className="pt60 pb90 bgc-white mt20">
          <div className="container">
            <div className="col-lg-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
                <Spinner />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        <section className="pt60 pb90 bgc-white mt20">
          <div className="container">
            <div className="col-lg-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
                <div className="text-center">Property not found.</div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const videoUrl = getVideoUrl(property);
  const hasVideo = !!videoUrl;

  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      <section className="pt60 pb90 bgc-white mt50">
        <div className="container">
          <div className="row">
            <PropertyHeader property={property} />
          </div>

        <div className="row mb30 mt20">
            <PropertyGallery property={property} />
          </div>

          <div className="row wrap">
            <div className="col-lg-8">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Overview</h4>
                <div className="row">
                  <OverView property={property} />
                </div>
              </div>

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Property Description</h4>
                <ProperytyDescriptions description={property?.description} />
              </div>

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
                <div className="row">
                  <PropertyFeaturesAminites property={property} />
                </div>
              </div>

              {/* Only show Video if BE provided it */}
              {hasVideo && (
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 ">
                  <h4 className="title fz17 mb30">Video</h4>
                  <div className="row">
                    <PropertyVideo property={property} />
                  </div>
                </div>
              )}

              {/* Virtual Tour removed per request */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">What&apos;s Nearby?</h4>
                <div className="row">
                  <PropertyNearby />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="column">
                <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative">
                  <h4 className="form-title mb5">Schedule a tour</h4>
                  <p className="text">Choose your preferred day</p>
                  <ScheduleTour />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt30 align-items-center justify-content-between">
            <div className="col-auto">
              <div className="main-title">
                <h2>Featured Properties</h2>
                <p className="paragraph">Properties for sell and rent</p>
              </div>
            </div>
            <div className="home6-listing-single-slider" data-aos="fade-up">
              <FeatureProperties />
            </div>
            <div className="col-auto mb30"></div>
          </div>
        </div>
      </section>

      <FloatingWhatsAppButton property={property} />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default SingleV3;
