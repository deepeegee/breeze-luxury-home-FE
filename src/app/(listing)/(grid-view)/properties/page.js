import { Suspense } from "react";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Spinner from "@/components/common/Spinner";
import ProperteyFiltering from "@/components/listing/grid-view/grid-full-3-col/ProperteyFiltering";
import React from "react";

export const metadata = {
  title: "Property Listings",
};

// This page depends on URL search params; avoid static prerender.
export const dynamic = "force-dynamic";

const GridFull3Col = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      <MobileMenu />
      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Listed Properties</h2>
                <a
                  className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                >
                  <span className="flaticon-settings" /> Filter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Suspense
        fallback={
          <section className="pt60 pb90 bgc-f7">
            <div className="container">
              <Spinner />
            </div>
          </section>
        }
      >
        <ProperteyFiltering />
      </Suspense>
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default GridFull3Col;