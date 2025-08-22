import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
// import Office from "@/components/pages/contact/Office";
import Link from "next/link";
import { Fragment } from "react";
import FormWithToast from "@/components/pages/contact/FormWithToast";

export const metadata = {
  title: "Contact — Breeze Luxury Homes Limited",
};

const Contact = () => {
  return (
    <Fragment>
      <DefaultHeader />
      <MobileMenu />

      {/* Contact: text & form side-by-side (text first on mobile) */}
      <section>
        <div className="container">
          <div className="row g-4 align-items-start">
            {/* Text: first on mobile, right of form on desktop */}
            <div className="col-12 col-lg-6 order-1 order-lg-2">
              <h2 className="mb30 text-capitalize">
                We’d love to hear <br className="d-none d-lg-block" />
                from you.
              </h2>
              <p className="text">
                Whether you’re buying, selling, renting, or investing, our team is here to help
                with verified properties, legal support, and expert advisory tailored to your goals.
              </p>
              <p className="text mb0">
                Prefer to talk in person? Visit our <strong>Lagos Head Office</strong> — we’re open{" "}
                <strong>Mon–Fri, 9:00am–5:00pm</strong>. You can also{" "}
                <Link href="/grid-full-3-col">browse verified listings</Link> or{" "}
                <Link href="/contact">book a free consultation</Link>.
              </p>
            </div>

            {/* Form: second on mobile, left on desktop */}
            <div className="col-12 col-lg-6 order-2 order-lg-1 position-relative">
              <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                <h4 className="form-title mb25">Have questions? Get in touch!</h4>
                <FormWithToast />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit our Office */}
      <section className="pt0 pb90 pb10-md">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-auto" data-aos="fade-up" data-aos-delay="300">
              <div className="main-title text-center">
                <h2 className="title">Visit Our Office (Lagos HQ)</h2>
                <p className="paragraph">
                  Come see us in Lagos for property viewings, documentation checks, and investment
                  advisory. We’re happy to host walk-ins or scheduled appointments.
                </p>
              </div>
            </div>
          </div>
{/* 
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <Office />
          </div> */}
        </div>
      </section>

      <CallToActions />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </Fragment>
  );
};

export default Contact;
