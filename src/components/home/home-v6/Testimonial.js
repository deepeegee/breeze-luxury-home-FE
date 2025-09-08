"use client";

import React, { useState, useEffect } from "react";
import styles from "./Testimonial.module.css"; // local scoped styles

const Testimonial = () => {
  const testimonials = [
    {
      id: "1st",
      initials: "CA",
      text:
        "Buying property in Nigeria used to scare me, but Breeze Luxury Homes made the process completely stress-free. Every detail was handled with transparency, and I finally own my dream home without any legal worries.",
      name: "Chinwe A.",
      designation: "Lagos",
    },
    {
      id: "2nd",
      initials: "OI",
      text:
        "As a diaspora investor, I needed a company I could trust. Breeze Luxury Homes gave me clear legal guidance and solid investment advice. Today, my portfolio is growing steadily, and I have peace of mind.",
      name: "Ose I.",
      designation: "London",
    },
    {
      id: "3rd",
      initials: "KO",
      text:
        "Professionalism at its best! From property search to paperwork, everything was smooth and reliable. They don’t just sell houses; they build trust.",
      name: "Kunle O.",
      designation: "Abuja",
    },
    {
      id: "4th",
      initials: "SE",
      text:
        "I got more than a home — I got a secure investment. The team ensured every document was verified and guided me through every step. I recommend them to anyone serious about real estate in Nigeria.",
      name: "Sarah E.",
      designation: "Port Harcourt",
    },
    {
      id: "5th",
      initials: "DM",
      text:
        "Breeze Luxury Homes truly stands out. Their legal background gave me confidence, and their customer service was top-notch. I feel safe recommending them to family and friends.",
      name: "David M.",
      designation: "Lagos",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // auto-switch every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className={styles.wrapper}>
      {/* Testimonial content */}
      <div className={styles.content}>
        {/* <span className={styles.quote}>“</span> */}
        <p className={styles.text}>{testimonials[activeIndex].text}</p>
        <h6 className={styles.name}>{testimonials[activeIndex].name}</h6>
        <p className={styles.design}>{testimonials[activeIndex].designation}</p>
      </div>

      {/* Circle initials switcher */}
      <div className={styles.switcher}>
        {testimonials.map((testimonial, idx) => (
          <button
            key={testimonial.id}
            onClick={() => setActiveIndex(idx)}
            className={`${styles.circle} ${
              idx === activeIndex ? styles.active : ""
            }`}
          >
            {testimonial.initials}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
