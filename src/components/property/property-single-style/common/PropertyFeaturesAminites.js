import React from "react";

const PropertyFeaturesAminites = ({ property }) => {
  if (!property || !property.features || !Array.isArray(property.features)) {
    return (
      <div className="col-12">
        <p className="text-muted">No features or amenities available for this property.</p>
      </div>
    );
  }

  // Group features into rows of 4 for better layout
  const featuresAmenitiesData = [];
  for (let i = 0; i < property.features.length; i += 4) {
    featuresAmenitiesData.push(property.features.slice(i, i + 4));
  }

  // If no features, show a message
  if (featuresAmenitiesData.length === 0) {
    return (
      <div className="col-12">
        <p className="text-muted">No features or amenities available for this property.</p>
      </div>
    );
  }

  return (
    <>
      {featuresAmenitiesData.map((row, rowIndex) => (
        <div key={rowIndex} className="col-sm-6 col-md-4">
          <div className="pd-list">
            {row.map((item, index) => (
              <p key={index} className="text mb10">
                <i className="fas fa-circle fz6 align-middle pe-2" />
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;
