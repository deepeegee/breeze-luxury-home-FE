// ===============================
// Bathroom.jsx (clean, consistent)
// ===============================
"use client";

import React from "react";

export default function Bathroom({ filterFunctions }) {
  const options = [
    { id: "baths-any", label: "Any", value: 0 },
    { id: "baths-1", label: "1+", value: 1 },
    { id: "baths-2", label: "2+", value: 2 },
    { id: "baths-3", label: "3+", value: 3 },
    { id: "baths-4", label: "4+", value: 4 },
    { id: "baths-5", label: "5+", value: 5 },
  ];

  const current = Number(filterFunctions?.baths ?? 0);

  return (
    <>
      {options.map((opt) => (
        <div className="selection" key={opt.id}>
          <input
            id={opt.id}
            name="baths"
            type="radio"
            checked={current === opt.value}
            onChange={() => filterFunctions?.setBaths(opt.value)}
          />
          <label htmlFor={opt.id}>{opt.label}</label>
        </div>
      ))}
    </>
  );
}
