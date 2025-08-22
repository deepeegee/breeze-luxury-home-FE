import React from "react";
import Link from "next/link";

const POPULAR_SEARCH = [
  "Apartments for Rent",
  "Houses for Sale",
  "Land for Sale",
];

const CITIES = ["Lekki", "Ikoyi", "Victoria Island", "Ikeja", "Yaba"];

const MenuWidget = () => {
  const menuSections = [
    {
      title: "Popular Search",
      links: POPULAR_SEARCH.map((label) => ({ label, href: "/grid-full-3-col" })),
    },
    {
      title: "Quick Links",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Terms of Use", href: "/legal/terms" },
        { label: "Privacy Policy", href: "/legal/privacy" },
      ],
    },
    {
      title: "Discover",
      // city links pass a location param into the grid page
      links: CITIES.map((name) => ({
        label: name,
        href: `/grid-full-3-col?location=${encodeURIComponent(name)}`,
      })),
    },
  ];

  return (
    <>
      {menuSections.map((section, index) => (
        <div className="col-auto" key={index}>
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
