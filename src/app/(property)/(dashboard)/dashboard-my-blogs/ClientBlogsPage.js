"use client";

import { useState } from "react";
import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import FilterHeader from "@/components/property/dashboard/dashboard-my-blogs/FilterHeader";
import BlogDataTable from "@/components/property/dashboard/dashboard-my-blogs/BlogDataTable";
import Pagination from "@/components/property/Pagination";

export default function ClientBlogsPage() {
  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  // filters & sort
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");   // "All" | "Published" | "Draft"
  const [sort, setSort] = useState("Newest");    // "Newest" | "Oldest" | "A–Z"

  // reset to page 1 on changes
  const onSearchChange = (v) => { setSearch(v); setCurrentPage(1); };
  const onStatusChange = (v) => { setStatus(v); setCurrentPage(1); };
  const onSortChange   = (v) => { setSort(v);   setCurrentPage(1); };

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
                    <h2>My Blogs</h2>
                    <p className="text">All your posts at a glance.</p>
                  </div>
                </div>
                <div className="col-xxl-9">
                  <FilterHeader
                    search={search}
                    onSearchChange={onSearchChange}
                    status={status}
                    onStatusChange={onStatusChange}
                    sort={sort}
                    onSortChange={onSortChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <BlogDataTable
                        search={search}
                        status={status}
                        sort={sort}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        setTotalItems={setTotalItems}
                      />
                      <div className="mt30">
                        <Pagination
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
}
