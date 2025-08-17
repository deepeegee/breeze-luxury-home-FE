"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";

const PropertyGallery = ({ property }) => {
  if (!property) return <div>Property not found</div>;

  // Use property image as main image, fallback to default
  const mainImage = property.image || "/images/listings/listing-single-9.jpg";
  
  // Create gallery images array - use property image + some default images
  const images = [
    { src: mainImage, alt: "Main property image" },
    { src: "/images/listings/listing-single-2.jpg", alt: "Property view 1" },
    { src: "/images/listings/listing-single-3.jpg", alt: "Property view 2" },
    { src: "/images/listings/listing-single-4a.jpg", alt: "Property view 3" },
    { src: "/images/listings/listing-single-5.jpg", alt: "Property view 4" },
  ];
  return (
    <>
      <Gallery>
        <div className="col-sm-6">
          <div className="sp-img-content mb15-lg">
            <div className="popup-img preview-img-1 sp-v3 sp-img">
              <Item
                original={mainImage}
                thumbnail={mainImage}
                width={610}
                height={507}
              >
                {({ ref, open }) => (
                  <Image
                    src={mainImage}
                    width={610}
                    height={507}
                    ref={ref}
                    onClick={open}
                    alt="Property main image"
                    role="button"
                    className="w-100 h-100 cover"
                  />
                )}
              </Item>
            </div>
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6">
          <div className="row">
            {images.map((image, index) => (
              <div className="col-4 ps-sm-0" key={index}>
                <div className="sp-img-content at-sp-v3">
                  <div className="popup-img preview-img-4 sp-img mb10">
                    <Item
                      original={image.src}
                      thumbnail={image.src}
                      width={270}
                      height={250}
                    >
                      {({ ref, open }) => (
                        <Image
                          width={270}
                          height={250}
                          className="w-100 h-100 cover"
                          ref={ref}
                          onClick={open}
                          role="button"
                          src={image.src}
                          alt={image.alt}
                        />
                      )}
                    </Item>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Gallery>
    </>
  );
};

export default PropertyGallery;
