import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Image from "next/image";
import styles from "./about.module.css";

export const metadata = { title: "About — Breeze Luxury Homes Limited" };

const About = () => {
  // First two use flaticon, last two use image icons
  const whatWeDo = [
    {
      iconType: "flaticon",
      icon: "flaticon-security",
      title: "Verified Sales & Rentals",
      text: "Legally secure homes and investments vetted for clear title and approvals.",
    },
    {
      iconType: "flaticon",
      icon: "flaticon-bird-house",
      title: "Estate Development",
      text: "Modern communities planned for livability, infrastructure, and long-term value.",
    },
    {
      iconType: "img",
      icon: "/images/icon/law.png",
      title: "Real Estate Legal Support",
      text: "Contracts, due diligence, and filings handled with full transparency.",
    },
    {
      iconType: "img",
      icon: "/images/icon/portfolio.png",
      title: "Portfolio Management",
      text: "Protect and grow assets with structured, professional oversight.",
    },
  ];

  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      {/* Theme breadcrumb background via wrapper (CSS Modules-safe) */}
      <section className={`${styles.breadcrumbWrapper} breadcumb-section2 p-0`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h1 className={styles.breadcrumbTitle}>
                  About Breeze Luxury Homes Limited
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className={styles.aboutSection}>
        <div className="container">
          {/* INTRO + vertical label */}
          <div
            className={`${styles.sectionGap} ${styles.sideLabelWrap}`}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className={styles.vertLabel} aria-hidden>
              ABOUT&nbsp;US
            </div>
            <div className={styles.introText}>
              <p className={styles.paragraph}>
                Breeze Luxury Homes Limited is a fully registered and
                incorporated real estate and property development company
                headquartered in Lagos, Nigeria. We specialize in the sale,
                rental, and development of premium properties and estates across
                multiple states in Nigeria.
              </p>
              <p className={styles.paragraph}>
                Every property in our portfolio is thoroughly vetted to ensure
                it is free from legal disputes or government encumbrances. We
                deliver transparent, secure, and value-driven real estate
                solutions to individuals, investors, and institutions.
              </p>
              <p className={styles.paragraph}>
                Led by a Managing Director with a strong legal background and
                deep knowledge of property law, our transactions are carried out
                with full compliance, professional diligence, and client
                protection from offer to completion.
              </p>
            </div>
          </div>

          {/* VISION & MISSION — side-by-side (stack on mobile), icon on top, no boxes */}
          <div
            className={`${styles.sectionGap} ${styles.statementsRow}`}
            data-aos="fade-up"
            data-aos-delay="140"
          >
            <article className={styles.statementSimple}>
              <div className={styles.stmtIconWrap}>
                <Image
                  src="/images/icon/vision.png"
                  alt="Our Vision"
                  width={64}
                  height={64}
                  className={styles.stmtIcon}
                />
              </div>
              <h5 className="mb10 text-center">Our Vision</h5>
              <p className="mb-0 text-center">
                To become Nigeria’s most trusted real estate brand—known for
                legally secure investments, professional portfolio management,
                and the development of modern, luxury living across Africa.
              </p>
            </article>

            <article className={styles.statementSimple}>
              <div className={styles.stmtIconWrap}>
                <Image
                  src="/images/icon/mission.png"
                  alt="Our Mission"
                  width={64}
                  height={64}
                  className={styles.stmtIcon}
                />
              </div>
              <h5 className="mb10 text-center">Our Mission</h5>
              <p className="mb10 text-center">
                We empower clients with verified, risk-free properties and
                end-to-end legal support, combining market insight and
                development excellence to deliver transparent transactions and
                long-term value.
              </p>
              <div className={styles.chips}>
                <span className={styles.chip}>Verified Properties</span>
                <span className={styles.chip}>Legal Diligence</span>
                <span className={styles.chip}>Investor-Focused</span>
                <span className={styles.chip}>Sustainable Growth</span>
              </div>
            </article>
          </div>

          {/* WHAT WE DO — 4 flip cards, vertical label; responsive */}
          <div
            className={`${styles.sectionGap} ${styles.sideLabelWrap}`}
            data-aos="fade-up"
            data-aos-delay="170"
          >
            <div className={styles.vertLabel} aria-hidden>
              WHAT&nbsp;WE&nbsp;DO
            </div>

            <div>
              <div className={styles.flipGridNarrow}>
                {whatWeDo.map((item, i) => (
                  <div className={styles.flipItem} key={i}>
                    <div
                      className={styles.flipInner}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.title} details`}
                    >
                      {/* Front */}
                      <div className={`${styles.flipFace} ${styles.flipFront}`}>
                        {item.iconType === "flaticon" ? (
                          <span
                            className={`${styles.flipIcon} ${item.icon}`}
                            aria-hidden="true"
                          />
                        ) : (
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={30}
                            height={30}
                            className={styles.flipIconImage}
                          />
                        )}
                        <h6 className={styles.flipTitle}>{item.title}</h6>
                      </div>
                      {/* Back */}
                      <div className={`${styles.flipFace} ${styles.flipBack}`}>
                        <p className="mb-0 fz14">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COUNTERS — bigger top gap for hierarchy */}
          <div
            className={`${styles.sectionGapXL} ${styles.countersStrip}`}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className={styles.counter}>
              <div className={styles.counterNum}>250+</div>
              <div className={styles.counterLabel}>Verified Properties</div>
            </div>
            <div className={styles.counter}>
              <div className={styles.counterNum}>120+</div>
              <div className={styles.counterLabel}>Happy Investors</div>
            </div>
            <div className={styles.counter}>
              <div className={styles.counterNum}>15+</div>
              <div className={styles.counterLabel}>Cities Covered</div>
            </div>
          </div>

          {/* FAQ — tightened top/bottom gap */}
          <section
            className={`${styles.faqGap} ${styles.sideLabelWrap}`}
            data-aos="fade-up"
            data-aos-delay="240"
          >
            <div className={styles.vertLabel} aria-hidden>
              FAQ
            </div>
            <div>
              <div className={styles.accordion}>
                {[
                  {
                    q: "How are properties verified?",
                    a: "We run title checks, confirm seller authority, and validate planning approvals to ensure each listing is clean and dispute-free.",
                  },
                  {
                    q: "Do you handle legal documentation?",
                    a: "Yes. Our legal expertise covers contracts, due diligence, and regulatory filings — ensuring compliant, transparent transactions.",
                  },
                  {
                    q: "Can you advise on investment strategy?",
                    a: "Absolutely. We provide data-led guidance on location, pricing, cash flow, and exit strategies tailored to your goals.",
                  },
                ].map((item, i) => (
                  <details className={styles.acItem} key={i}>
                    <summary className={styles.acSummary}>
                      <span>{item.q}</span>
                      <i className="far fa-plus" aria-hidden />
                    </summary>
                    <div className={styles.acPanel}>
                      <p className="mb-0">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Pull CTA closer to FAQ */}
      <div className={styles.afterFaqTight}>
        <CallToActions />
      </div>

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
};

export default About;
