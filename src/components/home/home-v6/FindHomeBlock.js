import React from "react";

const FindHomeBlock = () => {
  const blocks = [
    {
      icon: "flaticon-search-1", // swap to a shield/security icon if you have one
      number: "01",
      subtitle: "Verified & Secure Properties",
      text:
        "Every property we offer is thoroughly vetted, legally verified, and free from disputes or government encumbrances — giving you complete peace of mind.",
    },
    {
      icon: "flaticon-chat", // swap to a law/scale icon if available
      number: "02",
      subtitle: "Expert Legal & Market Insight",
      text:
        "With a strong background in property law and real estate, we ensure every transaction is transparent, compliant, and professionally handled.",
    },
    {
      icon: "flaticon-bird-house", // swap to a growth/chart icon if available
      number: "03",
      subtitle: "Tailored Investment Advisory",
      text:
        "We don’t just sell properties — we guide you with expert advice, portfolio management, and strategies that maximize returns on your investment.",
    },
    {
      icon: "flaticon-house-1", // swap to a map/pin icon if available
      number: "04",
      subtitle: "Trusted Service, Nationwide Reach",
      text:
        "From Lagos to other major states in Nigeria, we provide reliable real estate solutions backed by integrity, professionalism, and a commitment to client satisfaction.",
    },
  ];
  

  return (
    <>
      {blocks.map((block, index) => (
        <div className="col-sm-6" key={index}>
          <div className="iconbox-style6">
            <span className={`icon ${block.icon}`} />
            <h3 className="title mb-1">{block.number}</h3>
            <h6 className="subtitle">{block.subtitle}</h6>
            <p className="iconbox-text">{block.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default FindHomeBlock;
