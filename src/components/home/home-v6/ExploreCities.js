"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCities } from "@/lib/useApi";
import Spinner from "@/components/common/Spinner";

const ExploreCities = () => {
  const { data: cities = [], isLoading, error } = useCities();
  
  if (isLoading) return <Spinner text="Loading cities..." />;
  if (error) return <div>Error loading cities</div>;
  if (!cities.length) return <div>No cities found</div>;

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".cities_next__active",
          prevEl: ".cities_prev__active",
        }}
        pagination={{
          el: ".cities_pagination__active",
          clickable: true,
        }}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {cities.map((city) => (
          <SwiperSlide key={city.id}>
            <div className="item">
              <Link href="/grid-full-3-col">
                <div className="feature-style2 mb30">
                  <div className="feature-img">
                    <Image
                      width={279}
                      height={279}
                      className="w-100 h-100 cover"
                      src={city.image || "/images/listings/city-listing-1.jpg"}
                      alt="city listings"
                    />
                  </div>
                  <div className="feature-content pt20">
                    <h6 className="title mb-1">{city.name}</h6>
                    <p className="text fz15">{city.count} Properties</p>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ExploreCities;
