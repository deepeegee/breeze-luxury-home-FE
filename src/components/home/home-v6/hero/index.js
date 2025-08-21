"use client";
import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";
import Category from "./Category";

const Hero = () => {
  return (
    <>
      <div className="inner-banner-style6 compact-hero">
        <h2 className="hero-title text-white animate-up-1">
          Find the perfect place to{" "}
          <br className="d-none d-xl-block" />
          Live with your family
        </h2>

        <p className="hero-text text-white fz15 animate-up-2">
          Let’s find a home that’s perfect for you
        </p>

        <HeroContent />
      </div>

      {/* Advance Feature Modal */}
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div>

      <p className="h6 fw600 text-white fz14 animate-up-4 my-2">
        Or browse featured categories:
      </p>
      <Category />

      <style jsx>{`
        .compact-hero {
          padding-top: 36px;      /* keeps text clear of the navbar */
        }
        .hero-title {
          /* smaller, responsive */
          font-size: clamp(26px, 4.6vw, 44px);
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .hero-text {
          font-size: clamp(12px, 2vw, 14px);
          opacity: 0.95;
          margin-bottom: 12px;
        }
      `}</style>
    </>
  );
};

export default Hero;
