import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata = {
  title: "About — Breeze Luxury Homes Limited",
};

const About = () => {
  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      {/* Breadcrumb (custom, no theme background) */}
      <section className={styles.breadcrumbSection}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className={styles.breadcrumb}>
                <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
                  <ol className={styles.breadcrumbList}>
                    <li><Link href="/">Home</Link></li>
                    <li aria-current="page">About</li>
                  </ol>
                </nav>
                <h1 className={styles.breadcrumbTitle}>
                  About Breeze Luxury Homes Limited
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className={`our-about pb90 ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutGrid} data-aos="fade-up" data-aos-delay="300">

            {/* Main content */}
            <div className={styles.main}>
              <p className={styles.paragraph}>
                Breeze Luxury Homes Limited is a fully registered and incorporated real estate and
                property development company headquartered in Lagos, Nigeria. We specialize in the
                sale, rental, and development of premium properties and estates, offering our
                services across various states in Nigeria.
              </p>

              <h6 className={styles.subtitle}>Our expertise spans:</h6>
              <ul className={`${styles.list} ${styles.listSplit}`}>
                <li>Verified property sales and rentals</li>
                <li>Estate development</li>
                <li>Real estate legal support</li>
                <li>Portfolio management</li>
                <li>Real estate investment advisory</li>
              </ul>

              <p className={styles.paragraph}>
                Every property in our portfolio is carefully vetted to ensure it is free from legal
                disputes or government-related issues. We take pride in delivering transparent,
                secure, and high-value real estate solutions to individuals, investors, and
                institutions.
              </p>

              <p className={styles.paragraph}>
                Our Managing Director brings a strong legal background and in-depth knowledge of
                real estate and property law, ensuring that every transaction is carried out with
                full compliance, professional diligence, and client protection.
              </p>

              <p className={styles.paragraph}>
                Whether you're purchasing your first home, expanding your investment portfolio, or
                seeking sound real estate advice, Breeze Luxury Homes Limited is your reliable
                partner for smart and secure property solutions.
              </p>
            </div>

            {/* Side cards */}
            <aside className={styles.side}>
              <div className={styles.card}>
                <h5 className="mb10">Vision Statement</h5>
                <p className={styles.paragraph}>
                  To become Nigeria’s most trusted real estate brand, known for legally secure
                  investments, professional portfolio management, and the development of modern,
                  luxury living spaces across Africa.
                </p>
              </div>

              <div className={styles.card}>
                <h5 className="mb10">Mission Statement</h5>
                <ul className={styles.list}>
                  <li>To deliver verified, risk-free properties and real estate solutions that exceed client expectations.</li>
                  <li>To combine legal insight, market expertise, and development excellence in every transaction.</li>
                  <li>To provide investors with professional portfolio management and tailored advisory services.</li>
                  <li>To promote transparency, integrity, and innovation in the real estate sector.</li>
                  <li>To support the growth of secure, sustainable, and high-value communities across Nigeria.</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Banner */}
          {/* <div className="row mt40" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-12">
              <div className="about-page-img">
                <Image
                  width={1206}
                  height={515}
                  priority
                  className="w-100 h-100 cover"
                  src="/images/about/about-page-banner.jpg"
                  alt="About Breeze Luxury Homes banner"
                />
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <CallToActions />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default About;
