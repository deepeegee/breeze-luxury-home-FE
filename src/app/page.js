import MobileMenu from "@/components/common/mobile-menu";
import Hero from "@/components/home/home-v6/hero";
import Footer from "@/components/home/home-v6/footer";
import Header from "@/components/home/home-v6/Header";
import Image from "next/image";
import FindHomeBlock from "@/components/home/home-v6/FindHomeBlock";
import Pricing from "@/components/home/home-v6/Pricing";
import FeatureProperties from "@/components/home/home-v6/FeatureProperties";
import Testimonial from "@/components/home/home-v6/Testimonial";
import About from "@/components/home/home-v6/About";
import ExploreCities from "@/components/home/home-v6/ExploreCities";
import Link from "next/link";
import Wrapper from "./layout-wrapper/wrapper";

export const metadata = {
  title: "Breeze Luxury Homes - Real Estate NextJS Template",
};

const HomePage = () => {
  return (
    <Wrapper>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Home Banner Style V6 */}
      <section className="home-banner-style6 p0">
        <div className="home-style1">
          <div className="container">
            <div className="row">
              <div className="col-xl-10">
                <Hero />
              </div>
            </div>
          </div>
          {/* End .container */}
        </div>
      </section>
      {/* End Home Banner Style V6 */}

      {/* Explore Apartment Home */}
      <section className="pb90 pb30-md">
        <div className="container">
          <div className="row">
            <div className="col-xl-6" data-aos="fade-up" data-aos-delay="100">
              <div className="about-box2">
                <h4 className="title">
                  The New Way to Find <br className="d-none d-xl-block" /> Your
                  Home
                </h4>
                <p className="text fz15">
                  From as low as $10 per day with{" "}
                  <br className="d-none d-xl-block" /> limited time offer
                  discounts.
                </p>
                <Link href="/grid-full-3-col" className="ud-btn btn-thm">
                  How İt Works
                  <i className="fal fa-arrow-right-long" />
                </Link>
                <Image
                  width={296}
                  height={318}
                  className="img-1 cover"
                  src="/images/about/home6-about-1.png"
                  alt="about"
                />
              </div>
            </div>
            {/* End .col-6 */}

            <div className="col-xl-6" data-aos="fade-up" data-aos-delay="300">
              <div className="row">
                <FindHomeBlock />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Explore Apartment Home */}
      
      {/* Featured Properties */}
      <section className="pt0 pb80 pb30-md">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto" data-aos-delay="300ms">
              <div className="main-title text-center">
                <h2>Featured Properties</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="col-lg-12">
            <div className="home6-listing-single-slider" data-aos="fade-up">
              <FeatureProperties />
            </div>
          </div>
          {/* End .col-12 */}
        </div>
        {/* End .container */}
      </section>
      {/* End Featured Properties */}
      
      {/* Property Cities */}
      <section className="pt0 pb90 pb50-md">
        <div className="container">
          <div className="row  justify-content-between align-items-center">
            <div className="col-auto">
              <div
                className="main-title"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h2 className="title">Explore Cities</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
                </p>
              </div>
            </div>
            {/* End header */}

            <div className="col-auto mb30">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <button className="cities_prev__active swiper_button">
                    <i className="far fa-arrow-left-long" />
                  </button>
                </div>
                {/* End prev */}

                <div className="col-auto">
                  <div className="pagination swiper--pagination cities_pagination__active" />
                </div>
                {/* End pagination */}

                <div className="col-auto">
                  <button className="cities_next__active swiper_button">
                    <i className="far fa-arrow-right-long" />
                  </button>
                </div>
                {/* End Next */}
              </div>
            </div>
            {/* End .col for navigation and pagination */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
              <div className="property-city-slider">
                <ExploreCities />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End property cities */}

      {/* <!-- About Us --> */}
      <section className="pb40-md bgc-f7">
        <div className="container">
          <About />
        </div>
      </section>
      {/*  <!-- End About Us --> */}

      {/* Our Testimonials */}
      <section className="our-testimonial">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 mx-auto"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="main-title text-center">
                <h2>Testimonials</h2>
                <p className="paragraph">
                  10,000+ unique online course list designs
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div
              className="col-lg-8 m-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="testimonial-style2">
                <Testimonial />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* Start Our Footer */}
      <section className="footer-style1 at-home6 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </Wrapper>
  );
};

export default HomePage;
