"use client";

import React from 'react';
import './FloatingWhatsAppButton.css';

const FloatingWhatsAppButton = ({ property }) => {
  if (!property) return null;

  const handleWhatsAppClick = () => {
    const message = `Check out this property: ${property.title} - ${property.location} - $${property.price?.toLocaleString()}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="floating-whatsapp-btn">
      <button
        onClick={handleWhatsAppClick}
        className="whatsapp-btn"
        aria-label="Share property on WhatsApp"
        title="Share on WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </button>
    </div>
  );
};

export default FloatingWhatsAppButton; 