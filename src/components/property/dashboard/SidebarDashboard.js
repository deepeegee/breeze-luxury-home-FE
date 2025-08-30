"use client";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  const sidebarItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard-home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard-add-property",
          icon: "flaticon-new-tab",
          text: "Add New Property",
        },
        {
          href: "/dashboard-my-properties",
          icon: "flaticon-home",
          text: "My Properties",
        },
        {
          href: "/dashboard-add-blog",
          icon: "/images/edit.png", // Image from public folder
          text: "Add New Blog",
        },
        {
          href: "/dashboard-my-blogs",
          icon: "/images/blogging.png", // Image from public folder
          text: "My Blogs",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard-my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "Logout",
        },
      ],
    },
  ];

  return (
    <div className="dashboard__sidebar d-none d-lg-block">
      <div className="dashboard_sidebar_list">
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"}`}>{section.title}</p>
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="sidebar_list_item">
                {item.text === "Logout" ? (
                  <button
                    onClick={handleLogout}
                    className="logout-button items-center border-0 bg-transparent w-100 text-start"
                    style={{
                      cursor: 'pointer',
                      padding: '14.5px 20px',
                      marginLeft: 'auto', /* Push Logout button further right */
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`items-center ${pathname === item.href ? "-is-active" : ""}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14.5px 20px',
                      textDecoration: 'none',
                      color: pathname === item.href ? 'white' : '#000',  // Change color on active
                      marginBottom: '5px',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* If icon is an image (for blogs), render as <img> */}
                    {item.icon.includes(".png") ? (
                      <img src={item.icon} alt={item.text} className="sidebar-icon" style={{ width: '20px', height: '20px', objectFit: 'contain', marginRight: '15px' }} />
                    ) : (
                      <i className={`${item.icon} mr15`} style={{ fontSize: '20px' }} />
                    )}
                    {item.text}
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Embedded CSS for Cloning SCSS Styling */}
      <style jsx>{`
        .sidebar-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
          margin-right: 15px;
        }

        .dashboard_sidebar_list .sidebar_list_item a:hover,
        .dashboard_sidebar_list .sidebar_list_item a:active,
        .dashboard_sidebar_list .sidebar_list_item a:focus,
        .dashboard_sidebar_list .sidebar_list_item a.-is-active {
          background-color: #181a20;
          color: white;
        }

        .dashboard_sidebar_list .sidebar_list_item a {
          display: flex;
          align-items: center;
          padding: 14.5px 20px;
          text-decoration: none;
          color: #000;
          margin-bottom: 5px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .dashboard_sidebar_list .sidebar_list_item a i {
          font-size: 20px;
        }

        .logout-button {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 14.5px 20px;
          margin-left: auto;
        }

        .logout-button:hover {
          background-color: #F7931E ;
          color: #F7931E;
        }

        .logout-button i {
          margin-right: 15px;
        }
      `}</style>
    </div>
  );
};

export default SidebarDashboard;
