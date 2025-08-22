import React from "react";

const ContactMeta = () => {
  const contactInfoList = [
    {
      id: 1,
      title: "7, Rasaki Balogun Street, Atlantic View Estate, Off Alpha Beach Road, Lekki Peninsula, Lagos, Nigeria",
      phone: "0814 882 7901",
      phoneHref: "tel:+2348148827901", // Updated phoneHref to use "tel" URI
    },
    {
      id: 2,
      title: "Need Live Support?",
      email: "info@breezeluxuryhomes.com",
      emailHref: "mailto:info@breezeluxuryhomes.com", 
    },
  ];

  return (
    <div className="row mb-4 mb-lg-5">
      {contactInfoList.map((contact, index) => (
        <div className="col-auto" key={index}>
          <div className="contact-info">
            <p className="info-title">{contact.title}</p>
            {contact.phone && (
              <h6 className="info-phone">
                <a href={contact.phoneLink}>{contact.phone}</a>
              </h6>
            )}
            {contact.mail && (
              <h6 className="info-mail">
                <a href={contact.mailLink}>{contact.mail}</a>
              </h6>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactMeta;
