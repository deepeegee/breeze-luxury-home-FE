"use client";

import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";

import FloorPlans from "@/components/property/property-single-style/common/FloorPlans";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
import PropertyNearby from "@/components/property/property-single-style/common/PropertyNearby";
import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import VirtualTour360 from "@/components/property/property-single-style/common/VirtualTour360";
import ScheduleTour from "@/components/property/property-single-style/sidebar/ScheduleTour";
import PropertyGallery from "@/components/property/property-single-style/single-v3/PropertyGallery";
import FloatingWhatsAppButton from "@/components/property/property-single-style/common/FloatingWhatsAppButton";
import Spinner from "@/components/common/Spinner";
import FeatureProperties from "@/components/home/home-v6/FeatureProperties";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useListing } from "@/lib/useApi";
import { recordPropertyView } from "@/lib/api";

const SingleV3 = () => {
  const params = useParams();
  const id = String(params?.id ?? "");

  const { data: property, isLoading } = useListing(id);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !property || typeof window === "undefined") return;

    const propertyId = String(property.id ?? id);
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
  }, [mounted, property, id]);

  useEffect(() => {
    if (mounted && property && typeof window !== "undefined") {
      document.title = `${property.title} - ${property.city ?? ""} | Breeze Luxury Homes`;
    }
  }, [property, mounted]);

  if (isLoading || !property) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        {/* added mt20 here */}
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

  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      {/* added mt20 here */}
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

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 ">
                <h4 className="title fz17 mb30">Video</h4>
                <div className="row">
                  <PropertyVideo property={property} />
                </div>
              </div>

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">360° Virtual Tour</h4>
                <div className="row">
                  <VirtualTour360 property={property} />
                </div>
              </div>

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