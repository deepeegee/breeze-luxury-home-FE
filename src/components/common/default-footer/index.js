import Image from "next/image";
import Link from "next/link";
import ContactMeta from "./ContactMeta";
import Social from "./Social";
import Subscribe from "./Subscribe";
import MenuWidget from "./MenuWidget";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <>
      <div className="container">
        <div className="row mb60">
          <div className="col-lg-5">
            <div className="footer-widget text-center text-lg-start">
              <Link className="footer-logo" href="/">
                <Image
                  width={150}
                  height={84}
                  className="mb40"
                  src="/images/header-logo4.png"
                  alt="Breeze Luxury Homes Logo"
                />
              </Link>

              {/* Contact info with smaller margins */}
              <ContactMeta compact />

              {/* Social widget with proper spacing */}
              <div className="social-widget mt-3 text-center text-lg-start">
                <h6 className="text-white mb15">Follow us on social media</h6>
                <Social />
              </div>
            </div>
          </div>
          {/* End .col-lg-5 */}
          <div className="col-lg-7">
            <div className="footer-widget mb-3 mb-lg-4">
              {/* Subscription area */}
              <div className="mailchimp-widget mt-2">
                <Subscribe />
              </div>

              {/* Menu section */}
              <div className="row justify-content-between mt-3">
                <MenuWidget />
              </div>
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}

      <Copyright />
      {/* End copyright */}
    </>
  );
};

export default Footer;
