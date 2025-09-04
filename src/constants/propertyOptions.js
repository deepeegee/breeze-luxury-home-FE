// src/constants/propertyOptions.ts (or .js)
export const CATEGORY_OPTIONS = [
  "Apartment",
  "Fully-Detached Duplex", // ← keep hyphen to match BE
  "Land",
  "Hotel",
  "Farm",
  "Off-plan",
  "Semi-Detached Duplex",
  "Contemporary Duplex",
  "Terrace Duplex",
].map((v) => ({ value: v, label: v }));


export const DOCUMENT_GROUPS = [
  {
    label: "Title & Ownership",
    items: [
      "Certificate of Occupancy (C of O)",
      "Right of Occupancy (R of O)",
      "Governor's Consent",
      "Deed of Assignment (Registered)",
      "Deed of Conveyance",
      "Deed of Lease / Sub-Lease",
      "Power of Attorney (Registered)",
    ],
  },
  {
    label: "Survey & Land",
    items: [
      "Registered Survey Plan",
      "Beacon/Perimeter Survey",
      "Excision",
      "Gazette",
      "Allocation Letter",
    ],
  },
  {
    label: "Building & Approvals",
    items: [
      "Approved Building Plan",
      "Building Approval/Permit",
      "Certificate of Completion/Fitness",
    ],
  },
  {
    label: "Financial & Transaction",
    items: [
      "Offer Letter / Contract of Sale",
      "Receipts / Payment Acknowledgements",
      "Stamped/Registered Land Registry Receipts",
      "Valuation Report (Optional)",
    ],
  },
  {
    label: "Legal / Other (If Applicable)",
    items: [
      "Court Judgment / Probate",
      "Deed of Rectification",
      "Estate Deed / Deed of Sub-Division",
    ],
  },
];

export const AMENITY_GROUPS = [
  {
    label: "Premium Features",
    items: [
      "Ensuite Bedrooms",
      "Boys Quarters",
      "Penthouse",
      "Rooftop Terrace",
      "Swimming Pool",
      "Cinema Room",
      "Gym",
      "Fitness Center",
      "Study Room",
      "Home Office",
      "Walk-in Closet",
      "Dressing Room",
      "Double Volume Ceilings",
      "Multiple Lounges",
      "Private Balcony",
      "Ample Parking",
      "Garage",
    ],
  },
  {
    label: "Smart Home & Security",
    items: [
      "Smart Home System",
      "Video Doorbell",
      "Fingerprint Smart Locks",
      "Intercom System",
      "Alarm System",
      "Central Sound System",
      "Satellite TV System",
      "Inverter & Solar Power",
      "Generator Set",
    ],
  },
  {
    label: "Kitchen & Dining",
    items: [
      "Fully Fitted Kitchen",
      "Kitchen Island",
      "Breakfast Bar",
      "Pantry Store",
      "Double-door Refrigerator Space",
      "Modern Kitchen Appliances",
      "Dishwasher",
      "Water Purifier System",
    ],
  },
  {
    label: "Bathrooms & Toilets",
    items: [
      "Luxury Sanitary Wares",
      "Rainfall Shower",
      "His & Hers Sinks",
      "Water Heaters All Bathrooms",
    ],
  },
  {
    label: "Estate & Utilities",
    items: [
      "Gated Estate",
      "Access Control Gates",
      "24/7 Electricity",
      "Central Water Supply",
      "Borehole",
      "Good Drainage System",
      "Well-paved Roads",
      "Street Lighting",
      "Recreational Facilities",
    ],
  },
  {
    label: "Interior Finishes",
    items: [
      "POP Ceilings",
      "Chandelier Lighting",
      "LED Mood Lighting",
      "TV Console",
      "Modern Floor Tiles",
      "Stamped Concrete Floors",
      "Glass Balustrades",
      "Decorative Wall Panels",
      "Built-in Storage",
    ],
  },
  {
    label: "Exterior Enhancements",
    items: [
      "Landscaping & Green Area",
      "Outdoor Kitchen",
      "Electric Fence",
      "Carport/Shade",
      "Bush Bar/Relaxation Hut",
    ],
  },
  {
    label: "Convenience",
    items: [
      "Laundry Room",
      "Washing Machine Space",
      "Storage Room",
      "Multiple Water Tanks",
      "Automated Gate",
      "Waste Disposal System",
    ],
  },
];

export const AMENITIES = AMENITY_GROUPS.flatMap((g) => g.items);
