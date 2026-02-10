// ===============================
// Bedroom.jsx (clean, consistent)
// ===============================
"use client";

import React from "react";

export default function Bedroom({ filterFunctions }) {
  const options = [
    { id: "beds-any", label: "Any", value: 0 },
    { id: "beds-1", label: "1+", value: 1 },
    { id: "beds-2", label: "2+", value: 2 },
    { id: "beds-3", label: "3+", value: 3 },
    { id: "beds-4", label: "4+", value: 4 },
    { id: "beds-5", label: "5+", value: 5 },
  ];

  const current = Number(filterFunctions?.beds ?? 0);

  return (
    <>
      {options.map((opt) => (
        <div className="selection" key={opt.id}>
          <input
            id={opt.id}
            name="beds"
            type="radio"
            checked={current === opt.value}
            onChange={() => filterFunctions?.setBeds(opt.value)}
          />
          <label htmlFor={opt.id}>{opt.label}</label>
        </div>
      ))}
    </>
  );
}
