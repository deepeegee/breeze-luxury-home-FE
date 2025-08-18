"use client";

import MainMenu from "@/components/common/MainMenu";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "MAIN",
      items: [
        { icon: "flaticon-discovery", text: "Dashboard", href: "/dashboard-home" },
        { icon: "flaticon-chat-1", text: "Message", href: "/dashboard-message" },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        { icon: "flaticon-new-tab", text: "Add New Property", href: "/dashboard-add-property" },
        { icon: "flaticon-home", text: "My Properties", href: "/dashboard-my-properties" },
        { icon: "flaticon-like", text: "My Favorites", href: "/dashboard-my-favourites" },
        { icon: "flaticon-search-2", text: "Saved Search", href: "/dashboard-saved-search" },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        { icon: "flaticon-protection", text: "My Package", href: "/dashboard-my-package" },
        { icon: "flaticon-user", text: "My Profile", href: "/dashboard-my-profile" },
        { icon: "flaticon-exit", text: "Logout", href: "/login" },
      ],
    },
  ];

  return (
    <>
      <header className="header-nav nav-homepage-style light-header position-fixed menu-home4 main-menu">
        <nav className="posr" aria-label="Dashboard">
          <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
            {/* Three columns: LEFT (logo + toggle), MIDDLE (stretches; menu), RIGHT (widgets) */}
            <div className="row align-items-center">
              {/* LEFT */}
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <div className="dashboard_header_logo position-relative me-2 me-xl-5">
                    <Link className="logo" href="/" aria-label="Home">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Breeze Luxury Homes Logo"
                        priority
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* MIDDLE (stretches on lg and up, pushes menu to the right) */}
              <div className="d-none d-lg-flex col-lg justify-content-end">
                <MainMenu />
              </div>

              {/* RIGHT */}
              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-end header_right_widgets">
                  <ul className="mb0 d-flex justify-content-center justify-content-sm-end p-0">
                    <li className="d-none d-sm-block">
                      <Link className="text-center mr15" href="/login" aria-label="Messages">
                        <span className="flaticon-email" />
                      </Link>
                    </li>

                    <li className="d-none d-sm-block">
                      <a className="text-center mr20 notif" href="#" aria-label="Notifications">
                        <span className="flaticon-bell" />
                      </a>
                    </li>

                    <li className="user_setting">
                      <div className="dropdown">
                        <a className="btn" href="#" data-bs-toggle="dropdown" aria-label="Account menu">
                          <Image
                            width={44}
                            height={44}
                            src="/images/resource/user.png"
                            alt="User avatar"
                          />
                        </a>
                        <div className="dropdown-menu">
                          <div className="user_setting_content">
                            {menuItems.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <p
                                  className={`fz15 fw400 ff-heading ${
                                    sectionIndex === 0 ? "mb20" : "mt30"
                                  }`}
                                >
                                  {section.title}
                                </p>
                                {section.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    className={`dropdown-item ${
                                      pathname === item.href ? "-is-active" : ""
                                    }`}
                                    href={item.href}
                                  >
                                    <i className={`${item.icon} mr10`} />
                                    {item.text}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
    </>
  );
};

export default DashboardHeader;
