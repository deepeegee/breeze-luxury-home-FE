'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const pickId = (listing) => {
  // Try to get ID from various possible fields
  let possibleId = listing?.id ?? 
    listing?._id ?? 
    listing?.slug ?? 
    listing?.propertyId ?? 
    listing?.listingId ?? 
    listing?.uuid;
  
  // If no ID found, create a unique identifier from available fields
  if (!possibleId) {
    if (listing?.title && listing?.city) {
      // Create a slug-like ID from title and city
      possibleId = `${listing.city.toLowerCase().replace(/\s+/g, '-')}-${listing.title.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (listing?.title) {
      // Fallback to just title
      possibleId = listing.title.toLowerCase().replace(/\s+/g, '-');
    } else if (listing?.city) {
      // Fallback to just city
      possibleId = listing.city.toLowerCase().replace(/\s+/g, '-');
    }
  }
  
  return possibleId;
};

const FeaturedListings = ({ data = [], colstyle }) => {
  const router = useRouter();
  
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="col-12 text-center py-5">No properties found</div>;
  }

  return (
    <>
      {data.map((listing, idx) => {
        const id = pickId(listing);

        // unique key either from id or a composite fallback
        const key =
          id != null
            ? `listing-${String(id)}-${idx}`
            : `noid-${listing?.city ?? 'city'}-${listing?.title ?? 'title'}-${idx}`;

        if (!id && process.env.NODE_ENV !== 'production') {
          // surface the problem in dev tools so you know which field to use
          console.warn('Listing missing id-like field:', listing);
        }

        return (
          <div
            className={`${colstyle ? 'col-sm-12 col-lg-6' : 'col-sm-6 col-lg-4'}`}
            key={key}
          >
            {/* Make the whole card clickable if id exists */}
            <div
              className={colstyle ? 'listing-style1 listCustom listing-type' : 'listing-style1'}
              style={{ position: 'relative' }}
              onClick={() => {
                if (id) {
                  router.push(`/single-v3/${encodeURIComponent(String(id))}`);
                }
              }}
            >
              {id ? (
                <Link
                  href={`/single-v3/${encodeURIComponent(String(id))}`}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    cursor: 'pointer'
                  }}
                  aria-label={`Open ${listing?.title ?? 'property'}`}
                  prefetch={false}
                >
                  <span aria-hidden="true" />
                </Link>
              ) : (
                // Fallback link with a default route or show an error
                <div 
                  className="stretched-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    console.error('Cannot navigate: Property missing ID', listing);
                    alert(`Cannot open "${listing?.title || 'this property'}" - missing required ID field. Please contact support.`);
                  }}
                >
                  <span aria-hidden="true" />
                </div>
              )}

              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100 cover"
                  style={{ height: '230px' }}
                  src={listing.image}
                  alt={listing.title ?? 'listing'}
                />

                <div className="sale-sticker-wrap">
                  {!listing?.forRent && (
                    <div className="list-tag fz12">
                      <span className="flaticon-electricity me-2" />
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="list-price">
                  $
                  {typeof listing?.price === 'number'
                    ? listing.price.toLocaleString()
                    : String(listing?.price)}
                  {' / '}
                  <span>{listing?.forRent ? 'mo' : 'mo'}</span>
                </div>
              </div>

              <div className="list-content">
                <h6 className="list-title">{listing?.title ?? 'Untitled property'}</h6>
                <p className="list-text">{listing?.location}</p>

                <div className="list-meta d-flex align-items-center">
                  <span>
                    <span className="flaticon-bed" /> {listing?.bed} bed
                  </span>
                  <span>
                    <span className="flaticon-shower" /> {listing?.bath} bath
                  </span>
                  <span>
                    <span className="flaticon-expand" /> {listing?.sqft} sqft
                  </span>
                </div>

                <hr className="mt-2 mb-2" />

                <div className="list-meta2 d-flex justify-content-between align-items-center">
                  <span className="for-what">
                    {listing?.forRent ? 'For Rent' : 'For Sale'}
                  </span>
                  <div className="icons d-flex align-items-center">
                    <span className="flaticon-fullscreen" />
                    <span className="flaticon-new-tab" />
                    <span className="flaticon-like" />
                  </div>
                </div>

                {!id && (
                  <small className="text-danger d-block mt-2">
                    Cannot open details: listing is missing an id/slug.
                  </small>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FeaturedListings;