export function applyListingFilters(listings, f) {
    if (!Array.isArray(listings)) return [];
  
    const wantAllAmenities = (propAmenities = [], selected = []) => {
      if (!selected.length) return true;
      const have = new Set(propAmenities.map((x) => String(x).trim().toLowerCase()));
      // require ALL selected amenities to be present; change to "some" if you prefer OR behavior
      return selected.every((label) => have.has(String(label).trim().toLowerCase()));
    };
  
    return listings.filter((p) => {
      const price = Number(p.price ?? 0);
      const bed   = Number(p.bed ?? p.bedrooms ?? 0);
      const bath  = Number(p.bath ?? p.bathrooms ?? 0);
      const type  = String(p.propertyType ?? p.category ?? "").trim();
      const city  = String(p.city ?? "").trim();
      const ams   = Array.isArray(p.amenities) ? p.amenities : [];
  
      // Location / city
      if (f.location && city !== f.location) return false;
  
      // Property type (one-of)
      if (Array.isArray(f.propertyTypes) && f.propertyTypes.length) {
        if (!f.propertyTypes.includes(type)) return false;
      }
  
      // Bedrooms (min)
      if (Number(f.bedrooms || 0) > 0 && bed < Number(f.bedrooms)) return false;
  
      // Bathrooms (min)
      if (Number(f.bathroms || 0) > 0 && bath < Number(f.bathroms)) return false;
  
      // Price range
      if (Array.isArray(f.priceRange) && f.priceRange.length === 2) {
        const [min, max] = f.priceRange;
        if (price < Number(min) || price > Number(max)) return false;
      }
  
      // Amenities (ALL-of)
      if (!wantAllAmenities(ams, f.categories || [])) return false;
  
      return true;
    });
  }
  