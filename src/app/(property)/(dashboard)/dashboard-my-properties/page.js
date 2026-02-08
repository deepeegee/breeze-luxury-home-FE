"use client";

import { useState } from "react";
import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Pagination from "@/components/property/Pagination";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import FilterHeader from "@/components/property/dashboard/dashboard-my-properties/FilterHeader";
import PropertyDataTable from "@/components/property/dashboard/dashboard-my-properties/PropertyDataTable";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";

const DashboardMyProperties = () => {
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  // filters & sort (these were previously undefined)
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("All"); // "All" | "For sale" | "Sold"
  const [sort, setSort] = useState("Best Match");

  // When filters change, it's nice to jump back to page 1
  const handleSearchChange = (v) => {
    setSearch(v);
    setCurrentPage(1);
  };
  const handleAvailabilityChange = (v) => {
    setAvailability(v);
    setCurrentPage(1);
  };
  const handleSortChange = (v) => {
    setSort(v);
    setCurrentPage(1);
  };

  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb40">
                <div className="col-xxl-3">
                  <div className="dashboard_title_area">
                    <h2>My Properties</h2>
                  </div>
                </div>

                <div className="col-xxl-9">
                  <FilterHeader
                    search={search}
                    onSearchChange={handleSearchChange}
                    availability={availability}
                    onAvailabilityChange={handleAvailabilityChange}
                    sort={sort}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <PropertyDataTable
                        search={search}
                        availability={availability}
                        sort={sort}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        setTotalItems={setTotalItems}
                      />

                      <div className="mt30">
                        <Pagination
                          currentPage={currentPage}
                          totalItems={totalItems}
                          itemsPerPage={itemsPerPage}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMyProperties;
