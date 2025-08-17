"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useListings } from "@/lib/useApi";
import Spinner from "@/components/common/Spinner";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeatureProperties = () => {
  const { data: properties = [], isLoading, error } = useListings({ featured: true });
  
  console.log('FeatureProperties - properties:', properties);
  console.log('FeatureProperties - isLoading:', isLoading);
  console.log('FeatureProperties - error:', error);
  
  if (isLoading) return <Spinner />;
  if (error) {
    console.log('API Error:', error.message);
    return <div>Error loading properties: {error.message}</div>;
  }
  if (!properties.length) {
    return (
      <div className="text-center py-5">
        <h4>No Featured Properties Available</h4>
        <p>Please check back later or contact support if this persists.</p>
      </div>
    );
  }
  
  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".featurePro_next__active",
          prevEl: ".featurePro_prev__active",
        }}
        pagination={{
          el: ".featurePro_pagination__active",
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView={2}
        breakpoints={{
          300: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
        }}
      >
        {properties.slice(0, 6).map((property) => (
          <SwiperSlide key={property.id}>
            <div className="item">
              <div className="listing-style1">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={property.image || "/images/listings/property_slide_1.jpg"}
                    alt="property image"
                  />
                  <div className="sale-sticker-wrap">
                          {property.featured && (
                      <div className="list-tag fz12">
                            <span className="flaticon-electricity me-2" />
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="list-price">
                    ${property.price?.toLocaleString()} / <span>{property.forRent ? "mo" : "mo"}</span>
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                        <Link href="/grid-full-3-col">{property.title}</Link>
                  </h6>
                  <p className="list-text">{property.location}</p>
                  <div className="list-meta d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-bed" /> {property.bed} bed
                        </a>
                    <a href="#">
                      <span className="flaticon-shower" /> {property.bath} bath
                        </a>
                    <a href="#">
                      <span className="flaticon-expand" /> {property.sqft} sqft
                        </a>
                      </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">{property.forRent ? "For Rent" : "For Sale"}</span>
                            <div className="icons d-flex align-items-center">
                              <a href="#">
                                <span className="flaticon-fullscreen" />
                              </a>
                              <a href="#">
                                <span className="flaticon-new-tab" />
                              </a>
                              <a href="#">
                                <span className="flaticon-like" />
                              </a>
                            </div>
                          </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="row align-items-center justify-content-center mt30">
        <div className="col-auto">
          <button className="featurePro_prev__active swiper_button">
            <i className="far fa-arrow-left-long" />
          </button>
        </div>
        {/* End prev */}

        <div className="col-auto">
          <div className="pagination swiper--pagination featurePro_pagination__active" />
        </div>
        {/* End pagination */}

        <div className="col-auto">
          <button className="featurePro_next__active swiper_button">
            <i className="far fa-arrow-right-long" />
          </button>
        </div>
        {/* End Next */}
      </div>
    </>
  );
};

export default FeatureProperties;
