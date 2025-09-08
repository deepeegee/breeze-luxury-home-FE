"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HeroContent = () => {
  const router = useRouter();

  // --- Tabs removed for now (kept for later) ---
  // const [activeTab, setActiveTab] = useState("buy");
  // const handleTabClick = (tab) => setActiveTab(tab);
  // const tabs = [
  //   { id: "buy", label: "Buy" },
  //   { id: "rent", label: "Rent" },
  // ];
  // ------------------------------------------------

  const [keyword, setKeyword] = useState("");

  const goToResults = () => {
    const qs = new URLSearchParams();
    if (keyword.trim()) qs.set("q", keyword.trim());

    // --- Remove Buy/Rent from search parameters (kept for later) ---
    // qs.set("status", activeTab === "rent" ? "Rent" : "Buy");
    // ---------------------------------------------------------------

    router.push(`/properties?${qs.toString()}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goToResults();
  };

  return (
    <div className="advance-search-tab mt60 mt30-md mb25 animate-up-3">
      {/* --- Tab header removed (kept for later)
      <ul className="nav nav-tabs p-0 m-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      --- */}

      {/* Rounded wrapper to restore the missing top-left radius */}
      <div
        className="tab-content"
        style={{
          borderRadius: 12,      // ensure all corners are rounded
          overflow: "hidden",    // keep inner content from poking out
        }}
      >
        {/* We render a single pane now */}
        <div className="tab-pane active">
          <div
            className="advance-content-style1"
            style={{
              // Defensive: some themes put radius on this layer instead
              borderRadius: 12,
              overflow: "hidden",
              background: "white", // helps if the theme expects a bg
            }}
          >
            <div className="row">
              <div className="col-md-8 col-lg-9">
                <div className="advance-search-field position-relative text-start">
                  <form className="form-search position-relative" onSubmit={onSubmit}>
                    <div className="box-search">
                      <span className="icon flaticon-home-1" />
                      <input
                        className="form-control bgc-f7 bdrs12"
                        type="text"
                        name="search"
                        placeholder="Enter an address, neighborhood, city, or ZIP code"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-md-4 col-lg-3">
                <div className="d-flex align-items-center justify-content-start justify-content-md-center mt-3 mt-md-0">
                  {/* <button
                    className="advance-search-btn"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#advanceSeachModal"
                  >
                    <span className="flaticon-settings" /> Advanced
                  </button> */}
                  <button
                    className="advance-search-icon ud-btn btn-thm ms-4"
                    type="button"
                    onClick={goToResults}
                    aria-label="Search"
                  >
                    <span className="flaticon-search" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Original tab panes kept for later
        {tabs.map((tab) => (
          <div
            className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
            key={tab.id}
          >
            ...
          </div>
        ))}
        --- */}
      </div>
    </div>
  );
};

export default HeroContent;
