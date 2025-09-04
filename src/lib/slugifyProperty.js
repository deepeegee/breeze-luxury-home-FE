// src/lib/slugifyProperty.js
export function slugify(text, max = 80) {
    const s = String(text ?? "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")   // strip diacritics
      .replace(/[^a-z0-9]+/g, "-")       // non-alnum => dash
      .replace(/^-+|-+$/g, "")           // trim dashes
      .slice(0, max)
      .replace(/^-+|-+$/g, "");
    return s || "property";
  }
  
  // Build a readable slug WITHOUT any ids.
  // Priority: "city + (title || name)" → fallback to (title || name) → fallback to category → "property"
  export function makePropertySlug(p = {}) {
    const titleish = p.title || p.name || "";
    const cityish = p.city || p.state || p.country || "";
    const base = (cityish && titleish)
      ? `${cityish} ${titleish}`
      : (titleish || p.category || "property");
    return slugify(base, 90);
  }
  
  // Create a slug *from a property object* (used for equality check)
  export function slugFromProperty(p = {}) {
    return makePropertySlug(p);
  }
  