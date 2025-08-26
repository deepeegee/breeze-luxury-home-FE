import React from "react";

const ContactInfo = () => {
  const contactInfo = [
    {
      id: 1,
      title: "7, Rasaki Balogun Street, Atlantic View Estate, Off Alpha Beach Road, Lekki Peninsula, Lagos, Nigeria",
      phone: "0814 882 7901",
      phoneHref: "tel:+2348148827901", // Updated phoneHref to use "tel" URI
    },
    {
      id: 2,
      email: "info@breezeluxuryhomes.com",
      emailHref: "mailto:info@breezeluxuryhomes.com", 
    },
  ];

  return (
    <>
      {contactInfo.map((info) => (
        <div className="col-auto" key={info.id}>
          <div className="contact-info">
            <p className="info-title dark-color">{info.title}</p>
            {info.phone && (
              <h6 className="info-phone dark-color">
                <a href={info.phoneHref}>{info.phone}</a>
              </h6>
            )}
            {info.email && (
              <h6 className="info-mail dark-color">
                <a href={info.emailHref}>{info.email}</a>
              </h6>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
