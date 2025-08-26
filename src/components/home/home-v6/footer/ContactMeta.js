import React from "react";

const ContactMeta = () => {
  const contactInfoList = [
    {
      id: 1,
      title:
        "7, Rasaki Balogun Street, Atlantic View Estate, Off Alpha Beach Road, Lekki Peninsula, Lagos, Nigeria",
      phone: "0814 882 7901",
      phoneHref: "tel:+2348148827901",
    },
    {
      id: 2,
      email: "info@breezeluxuryhomes.com",
      emailHref: "mailto:info@breezeluxuryhomes.com",
    },
  ];

  return (
    <div className="row mb-4 mb-lg-5">
      {contactInfoList.map((contact, index) => (
        <div className="col-12 mb-3" key={index}>
          <div className="contact-info">
            {contact.title && <p className="info-title">{contact.title}</p>}
            {contact.phone && (
              <h6 className="info-phone">
                <a href={contact.phoneHref}>{contact.phone}</a>
              </h6>
            )}
            {contact.email && (
              <h6 className="info-mail">
                <a href={contact.emailHref}>{contact.email}</a>
              </h6>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactMeta;
