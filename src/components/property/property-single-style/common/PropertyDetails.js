import React from "react";

const PropertyDetails = ({ property }) => {
  if (!property) return <div>Property details not available</div>;

  const columns = [
    [
      {
        label: "Property ID",
        value: property.id || "N/A",
      },
      {
        label: "Price",
        value: property.price ? `$${property.price.toLocaleString()}` : "N/A",
      },
      {
        label: "Property Size",
        value: property.sqft ? `${property.sqft} Sq Ft` : "N/A",
      },
      {
        label: "Bathrooms",
        value: property.bath || "N/A",
      },
      {
        label: "Bedrooms",
        value: property.bed || "N/A",
      },
    ],
    [
      {
        label: "Garage",
        value: "2", // Default value since not in property data
      },
      {
        label: "Garage Size",
        value: "200 SqFt", // Default value since not in property data
      },
      {
        label: "Year Built",
        value: property.yearBuilding || "N/A",
      },
      {
        label: "Property Type",
        value: property.propertyType || "N/A",
      },
      {
        label: "Property Status",
        value: property.forRent ? "For Rent" : "For Sale",
      },
    ],
  ];

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`col-md-6 col-xl-4${
            columnIndex === 1 ? " offset-xl-2" : ""
          }`}
        >
          {column.map((detail, index) => (
            <div key={index} className="d-flex justify-content-between">
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">
                  {detail.label}
                </p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
