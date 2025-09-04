import React from "react";
import Link from "next/link";

const CITIES = ["Lekki", "Ikoyi", "Victoria Island", "Ikeja", "Yaba"];

const MenuWidget = () => {
  const menuSections = [
    {
      title: "Quick Links",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        // { label: "Terms of Use", href: "/legal/terms" },
      ],
    },
    {
      title: "Discover",
      // city links pass a location param into the grid page
      links: CITIES.map((name) => ({
        label: name,
        href: `/properties?location=${encodeURIComponent(name)}`,
      })),
    },
  ];

  return (
    <>
      {menuSections.map((section, index) => (
        <div className="col-6" key={index}>
          <div className="link-style1 mb-3">
            <h6 className="text-white mb25">{section.title}</h6>
            <ul className="ps-0">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href} aria-label={link.label}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default MenuWidget;
