import Image from "next/image";
import React from "react";

const VirtualTour360 = ({ property }) => {
  // Use property virtual tour image if available, otherwise fallback to default
  const virtualTourImage = property?.virtualTourImage || "/images/listings/listing-single-7.jpg";
  const virtualTourAlt = property?.title ? `${property.title} Virtual Tour` : "virtual image";

  return (
    <>
      <div className="col-md-12">
        <Image
          width={736}
          height={373}
          src={virtualTourImage}
          alt={virtualTourAlt}
          className="w-100 bdrs12 h-100 cover"
        />
      </div>
    </>
  );
};

export default VirtualTour360;
