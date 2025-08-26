import MobileMenu from "@/components/common/mobile-menu";
import Hero from "@/components/home/home-v6/hero";
import Footer from "@/components/home/home-v6/footer";
import Header from "@/components/home/home-v6/Header";
import Image from "next/image";
import FindHomeBlock from "@/components/home/home-v6/FindHomeBlock";
import FeatureProperties from "@/components/home/home-v6/FeatureProperties";
import Testimonial from "@/components/home/home-v6/Testimonial";
import About from "@/components/home/home-v6/About";
import ExploreCities from "@/components/home/home-v6/ExploreCities";
import Link from "next/link";
import Wrapper from "./layout-wrapper/wrapper";
import styles from "./HomePage.module.css";

export const metadata = {
  title: "Breeze Luxury Homes",
};

const HomePage = () => {
  return (
    <Wrapper>
      {/* Main Header Nav */}
      <Header />

      {/* Mobile Nav */}
      <MobileMenu />

      {/* Hero */}
      <section className={`home-banner-style6 p0 ${styles.mobileHeroSection}`}>
        <div className={`home-style1 ${styles.mobileHeroContainer}`}>
          <div className="container">
            <div className="row">
              <div className="col-xl-10">
                <Hero />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us + Steps */}
      <section className="pb90 pb30-md">
        <div className="container">
          <div className="row g-4">
            {/* WHY CHOOSE US */}
            <div className="col-xl-6" data-aos="fade-up" data-aos-delay="100">
              <div className={`about-box2 ${styles.whyWrap}`}>
                <h4 className="title">Why choose us as your Real Estate Broker</h4>

                <p className={`text fz15 ${styles.whyLead}`}>
                  Breeze Luxury Homes Limited is a trusted real estate and development company in
                  Nigeria, offering verified properties, legal support, portfolio management, and
                  smart investment advisory — all delivered with professionalism and integrity.
                </p>
                <div className={styles.whyCtas}>
                  <Link href="/grid-full-3-col" className="ud-btn btn-thm">
                    Browse Verified Listings <i className="fal fa-arrow-right-long" />
                  </Link>
                </div>
              </div>
            </div>

            {/* STEPS */}
            <div className="col-xl-6" data-aos="fade-up" data-aos-delay="300">
              <div className="row">
                <FindHomeBlock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="pt0 pb80 pb30-md">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto" data-aos-delay="300ms">
              <div className="main-title text-center">
                <h2>Featured Properties</h2>
                <p className="paragraph">Properties for sell and rent</p>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="home6-listing-single-slider" data-aos="fade-up">
              <FeatureProperties />
            </div>
          </div>
        </div>
      </section>

      {/* Property Cities */}
      <section className="pt0 pb90 pb50-md">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-auto">
              <div className="main-title" data-aos="fade-up" data-aos-delay="100">
                <h2 className="title">Explore Cities</h2>
                <p className="paragraph">
                  Discover top-performing cities with high-growth potential. Whether you're buying
                  your first home or expanding your investment portfolio, these locations offer the
                  perfect blend of lifestyle, infrastructure, and long-term value.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="property-city-slider">
                <ExploreCities />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="pb40-md bgc-f7">
        <div className="container">
          <About />
        </div>
      </section>

      {/* Testimonials */}
      <section className="our-testimonial">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto" data-aos="fade-up" data-aos-delay="0">
              <div className="main-title text-center">
                <h2>Testimonials</h2>
                <p className="paragraph">Hear from our happy clients</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 m-auto" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-style2">
                <Testimonial />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="footer-style1 at-home6 pt60 pb-0">
        <Footer />
      </section>
    </Wrapper>
  );
};

export default HomePage;
