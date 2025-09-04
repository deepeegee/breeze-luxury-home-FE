'use client';

import React from 'react';

const OPTIONS = [
  { idSuffix: 'all', label: 'All' },
  { idSuffix: 'available', label: 'Available' },
  { idSuffix: 'sold', label: 'Sold' },
];

export default function ListingStatus({
  value,                 // preferred: current selected label: 'All'|'Available'|'Sold'
  onChange,              // preferred: (label) => void
  name = 'listingStatus',
  filterFunctions,       // legacy compatibility: { listingStatus, handlelistingStatus }
}) {
  const current = value ?? filterFunctions?.listingStatus ?? 'All';

  const emitChange = (label) => {
    if (onChange) onChange(label);
    else if (filterFunctions?.handlelistingStatus) filterFunctions.handlelistingStatus(label);
    else if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('ListingStatus: no onChange/handlelistingStatus provided.');
    }
  };

  return (
    <fieldset aria-label="Listing status filter" style={{ border: 0, padding: 0, margin: 0 }}>
      {OPTIONS.map((opt) => {
        const id = `${name}-${opt.idSuffix}`;
        return (
          <div className="form-check d-flex align-items-center mb10" key={id}>
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={id}
              value={opt.label}
              checked={current === opt.label}
              onChange={() => emitChange(opt.label)}
            />
            <label className="form-check-label ms-2" htmlFor={id}>
              {opt.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}
