import React from "react";

export default function FloorPlans({ property }) {
  // If property is not passed, set it as an empty object
  const safeProperty = property || {};

  // Loading state
  if (!safeProperty || !safeProperty.floorPlans) {
    return <p>Loading floor plans...</p>;
  }

  return (
    <div className="floor-plans">
      <h2>Floor Plans</h2>
      {safeProperty.floorPlans.length === 0 ? (
        <p>No floor plans available</p>
      ) : (
        <ul>
          {safeProperty.floorPlans.map((plan, index) => (
            <li key={index}>
              <img
                src={plan.imageUrl}
                alt={plan.title || "Floor plan"}
                width="300"
              />
              <p>{plan.title || "Untitled Plan"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
