import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
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

      <section>
        <div className="container">
          <h2 className="title mb20">Contact Us</h2>
          <div className="row g-4 align-items-start">
            {/* Text + Visit Our Office */}
            <div className="col-12 col-lg-6 order-1 order-lg-2">
              <h2 className="mb30 text-capitalize">
                We’d love to hear <br className="d-none d-lg-block" />
                from you.
              </h2>
              <p className="text">
                Whether you’re buying, selling, renting, or investing, our team
                is here to help with verified properties, legal support, and
                expert advisory tailored to your goals.
              </p>
              <p className="text mb40">
                Prefer to talk in person? Visit our{" "}
                <strong>Lagos Office</strong> — we’re open{" "}
                <strong>Mon–Fri, 9:00am–5:00pm</strong>. You can also{" "}
                <Link href="/properties">browse verified listings</Link> or{" "}
                <Link href="/contact">book a free consultation</Link>.
              </p>

              {/* Visit Our Office section */}
              <div className="main-title mb-2">
                <h3 className="title">Visit Our Office</h3>
                <p className="paragraph">
                  Come see us in Lagos for property viewings, documentation
                  checks, and investment advisory. We’re happy to host walk-ins
                  or scheduled appointments.
                </p>
              </div>

              {/* Contact details directly included here */}
              <div className="row mb-4 mb-lg-5">
                <div className="col-12">
                  <div className="contact-info">
                    <p className="info-title">
                      <strong>
                        7, Rasaki Balogun Street, Atlantic View Estate, Off
                        Alpha Beach Road, Lekki Peninsula, Lagos, Nigeria
                      </strong>
                    </p>
                    <h6 className="info-phone">
                      <a href="tel:+2348148827901">0814 882 7901</a>
                    </h6>
                    <h6 className="info-mail">
                      <a href="mailto:info@breezeluxuryhomes.com">
                        info@breezeluxuryhomes.com
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="col-12 col-lg-6 order-2 order-lg-1 position-relative">
              <div className="home8-contact-form default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white">
                <h4 className="form-title mb25">
                  Have questions? Get in touch!
                </h4>
                <FormWithToast />
              </div>
            </div>
          </div>
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
