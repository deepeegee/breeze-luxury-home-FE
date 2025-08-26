"use client";

import MainMenu from "@/components/common/MainMenu";
//import LoginSignupModal from "@/components/common/login-signup-modal";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DefaultHeader = () => {
  const [navbar, setNavbar] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavbar(window.scrollY >= 10);
    onScroll(); // set initial state on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`header-nav nav-homepage-style at-home3 main-menu ${
          navbar ? "sticky slideInDown animated" : ""
        }`}
      >
        <nav className="posr" aria-label="Main">
          <div className="container posr menu_bdrt1">
            {/* Three columns: LEFT (logo), MIDDLE (stretches; menu), RIGHT (actions) */}
            <div className="row align-items-center">
              {/* LEFT: Logo */}
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <div className="logos mr40">
                    <Link
                      className="header-logo logo1"
                      href="/"
                      aria-label="Home"
                    >
                      <Image
                        width={160}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Breeze Luxury Homes Logo"
                        priority
                      />
                    </Link>
                    <Link
                      className="header-logo logo2"
                      href="/"
                      aria-label="Home"
                    >
                      <Image
                        width={160}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Breeze Luxury Homes Logo"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* MIDDLE: Menu (stretches & pushes to right) */}
              <div className="col d-flex justify-content-end">
                <MainMenu />
              </div>

              {/* RIGHT: Actions (kept; currently hidden) */}
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  {/* Login / Register — HIDDEN */}
                  {/*
                  <a
                    href="#"
                    className="login-info d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#loginSignupModal"
                    role="button"
                  >
                    <i className="far fa-user-circle fz16 me-2" />
                    <span className="d-none d-xl-block">Login / Register</span>
                  </a>
                  */}

                  {/* Add Property — HIDDEN */}
                  {/*
                  <Link
                    className="ud-btn btn-white add-property bdrs60 mx-2 mx-xl-4"
                    href="/dashboard-add-property"
                  >
                    Add Property
                    <i className="fal fa-arrow-right-long" />
                  </Link>
                  */}

                  {/* Hamburger / Sidebar trigger — HIDDEN */}
                  {/*
                  <a
                    className="sidemenu-btn filter-btn-right"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/dark-nav-icon.svg"
                      alt="Open sidebar"
                    />
                    <Image
                      width={25}
                      height={9}
                      className="img-2"
                      src="/images/dark-nav-icon.svg"
                      alt="Open sidebar"
                    />
                  </a>
                  */}
                </div>
              </div>
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}

      {/* Signup Modal (kept; trigger hidden above) */}
      {/* <div className="signup-modal">
        <div
          className="modal fade"
          id="loginSignupModal"
          tabIndex={-1}
          aria-labelledby="loginSignupModalLabel"
          aria-hidden={true}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <LoginSignupModal />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default DefaultHeader;
