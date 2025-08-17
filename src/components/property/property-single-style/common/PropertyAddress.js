import React from "react";

const PropertyAddress = ({ property }) => {
  if (!property) return <div>Property address not available</div>;

  // Extract address components from property location
  const locationParts = property.location?.split(', ') || [];
  const address = locationParts[0] || property.address || "Address not specified";
  const city = property.city || "City not specified";
  const state = locationParts[2] || "State not specified";
  const country = locationParts[3] || "Country not specified";

  return (
    <>
      <div className="col-md-6 col-xl-4">
        <div className="d-flex justify-content-between">
          <div className="pd-list">
            <p className="fw600 mb10 ff-heading dark-color">Address</p>
            <p className="fw600 mb10 ff-heading dark-color">City</p>
            <p className="fw600 mb-0 ff-heading dark-color">State/county</p>
          </div>
          <div className="pd-list">
            <p className="text mb10">{address}</p>
            <p className="text mb10">{city}</p>
            <p className="text mb-0">{state}</p>
          </div>
        </div>
      </div>
      {/* End col */}

      {/* Map section commented out as requested */}
      {/* <div className="col-md-12">
        <iframe
          className="position-relative bdrs12 mt30 h250"
          loading="lazy"
          src={`https://maps.google.com/maps?q=${address}&t=m&z=14&output=embed&iwloc=near`}
          title={address}
          aria-label={address}
        />
      </div> */}
    </>
  );
};

export default PropertyAddress;
