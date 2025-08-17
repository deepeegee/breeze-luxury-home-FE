module.exports = [
  {
    label: "Home",
    subMenu: [
      { path: "/", label: "Home" },
    ],
  },
  {
    label: "Listings",
    subMenu: [
      {
        label: "Grid View",
        subMenu: [
          { label: "Grid Full Width 3 Cols", path: "/grid-full-3-col" },
        ],
      },
    ],
  },

  {
    label: "Dashboard",
    subMenu: [
      { label: "Dashboard Home", path: "/dashboard-home" },
      { label: "Message", path: "/dashboard-message" },
      { label: "New Property", path: "/dashboard-add-property" },
      { label: "My Properties", path: "/dashboard-my-properties" },
      { label: "My Favorites", path: "/dashboard-my-favourites" },
      { label: "Saved Search", path: "/dashboard-saved-search" },
      { label: "Reviews", path: "/dashboard-reviews" },
      { label: "My Package", path: "/dashboard-my-package" },
      { label: "My Profile", path: "/dashboard-my-profile" },
    ],
  },
  {
    label: "Blog",
    subMenu: [
      { path: "/blog-list-v3", label: "Blog List V3" },
    ],
  },

  {
    label: "Pages",
    subMenu: [
      { path: "/about", label: "About" },
      { path: "/contact", label: "Contact" },
      { path: "/compare", label: "Compate" },
      { path: "/pricing", label: "Pricing" },
      { path: "/faq", label: "Faq" },
      { path: "/login", label: "Login" },
      { path: "/register", label: "Register" },
      { path: "/404", label: "404" },
      { path: "/invoice", label: "Invoice" },
    ],
  },
];
