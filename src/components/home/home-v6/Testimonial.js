"use client";

import Image from "next/image";
import React from "react";
import { useTestimonials } from "@/lib/useApi";
import Spinner from "@/components/common/Spinner";

const Testimonial = () => {
  const { data: apiTestimonials = [], isLoading, error } = useTestimonials();
  
  if (isLoading) return <Spinner />;
  if (error) {
    console.error("Testimonial error details:", error);
    return <div>Error loading testimonials: {error.message}</div>;
  }
  if (!apiTestimonials.length) return <div>No testimonials found</div>;
  
  const testimonials = apiTestimonials.map(t => ({ 
    id: String(t.id), 
    imageSrc: t.image, 
    text: t.quote, 
    name: t.name, 
    designation: t.company 
  }));
  return (
    <>
      <div className="tab-content" id="pills-tabContent">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`tab-pane fade ${
              testimonial.id === "2nd" ? "show active" : ""
            }`}
            id={`pills-${testimonial.id}`}
            role="tabpanel"
            aria-labelledby={`pills-${testimonial.id}-tab`}
          >
            <div className="testi-content text-center">
              <span className="icon fas fa-quote-left" />
              <h4 className="testi-text">{testimonial.text}</h4>
              <h6 className="name">{testimonial.name}</h6>
              <p className="design">{testimonial.designation}</p>
            </div>
          </div>
        ))}
      </div>
      {/* End tab-content */}
      <div className="tab-list position-relative">
        <ul
          className="nav nav-pills justify-content-center"
          id="pills-tab"
          role="tablist"
        >
          {testimonials.map((testimonial) => (
            <li className="nav-item" role="presentation" key={testimonial.id}>
              <button
                className={`nav-link ${
                  testimonial.id === "1st" ? "ps-0" : ""
                } ${testimonial.id === "2nd" ? "active" : ""} ${
                  testimonial.id === "5th" ? "pe-0" : ""
                }`}
                id={`pills-${testimonial.id}-tab`}
                data-bs-toggle="pill"
                data-bs-target={`#pills-${testimonial.id}`}
                type="button"
                role="tab"
                aria-controls={`pills-${testimonial.id}`}
                aria-selected={testimonial.id === "2nd" ? "true" : "false"}
              >
                <Image
                  width={70}
                  height={71}
                  src={testimonial.imageSrc}
                  alt=""
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Testimonial;
