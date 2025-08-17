export type Listing = {
  id: number | string;
  image: string | null;
  title: string;
  city?: string;
  location?: string;
  bed?: number;
  bath?: number;
  sqft?: number;
  price?: number;
  forRent?: boolean;
  tags?: string[];
  propertyType?: string;
  yearBuilding?: number;
  featured?: boolean;
  lat?: number;
  long?: number;
  features?: string[];
};
export type Blog = {
  id: number | string;
  image: string;
  date: { month: string; day: string; year?: number };
  tag: string;
  title: string;
  text?: string;
  category?: string | string[];
  content?: string;
};
export type Testimonial = {
  id: number | string;
  title: string;
  quote: string;
  stars: number;
  image: string;
  name: string;
  company: string;
};

// ------- BE shapes -------
type PhotoBE = { url: string; isFeatured?: boolean };
export type PropertyBE = {
  id: number | string;
  title: string;
  description?: string;
  name?: string;
  category?: string;
  listedIn?: string;
  status?: string;
  price?: number;
  photos?: PhotoBE[];
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  sizeInFt?: number;
  lotSizeInFt?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  availableFrom?: string;
  structureType?: string;
  floorsNo?: number;
  amenities?: string[];
  lat?: number;
  long?: number;
};

// ------- base -------
const API_BASE = "/api"; // proxied to https://breeze-luxury-homes.onrender.com

// ------- helpers -------
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = { 
    "Content-Type": "application/json"
  };
  
  // Merge with any additional headers from init
  Object.assign(headers, init.headers || {});
  
  console.log(`API Request to: ${url}`, { headers, method: init.method || 'GET' });
  
  const res = await fetch(url, {
    credentials: "include", // This will automatically include the HTTP-only Authentication cookie
    headers,
    ...init,
  });
  
  console.log(`API Response from: ${url}`, { 
    status: res.status, 
    ok: res.ok, 
    statusText: res.statusText
  });
  
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message || JSON.stringify(err);
    } catch (parseErr) {
      console.error('Failed to parse error response:', parseErr);
      // Try to get text response instead
      try {
        const textResponse = await res.text();
        msg = `HTTP ${res.status}: ${textResponse || res.statusText}`;
      } catch (textErr) {
        msg = `HTTP ${res.status}: ${res.statusText}`;
      }
    }
    console.error("API Error:", { status: res.status, message: msg, url });
    throw new Error(msg);
  }
  
  // Check if response has content
  const contentLength = res.headers.get('content-length');
  if (contentLength === '0') {
    console.log('Empty response body, returning empty object');
    return {} as T;
  }
  
  try {
    const data = await res.json();
    console.log(`API Response data from: ${url}`, data);
    return data;
  } catch (parseErr) {
    console.error('Failed to parse JSON response:', parseErr);
    // Try to get text response
    try {
      const textResponse = await res.text();
      console.log('Response as text:', textResponse);
      if (textResponse.trim() === '') {
        return {} as T;
      }
      throw new Error(`Invalid JSON response: ${textResponse}`);
    } catch (textErr) {
      throw new Error('Failed to parse response as JSON or text');
    }
  }
}

async function apiFetchForm<T>(path: string, form: FormData): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = {};
  
  const res = await fetch(url, {
    method: "POST",
    credentials: "include", // This will automatically include the HTTP-only Authentication cookie
    headers,
    body: form, // let browser set Content-Type boundary
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// ------- mapper -------
function toListing(p: PropertyBE): Listing {
  const featuredPhoto = p.photos?.find(ph => ph.isFeatured) ?? p.photos?.[0];
  const mapped = {
    id: p.id,
    image: featuredPhoto?.url ?? null,
    title: p.title || p.name || "Property",
    city: p.city,
    location: [p.address, p.city, p.state, p.country].filter(Boolean).join(", "),
    bed: p.bedrooms,
    bath: p.bathrooms,
    sqft: p.sizeInFt,
    price: p.price,
    forRent: p.listedIn?.toLowerCase() === "rent",
    tags: p.amenities,
    propertyType: p.category,
    yearBuilding: p.yearBuilt,
    featured: !!featuredPhoto?.isFeatured,
    lat: p.lat,
    long: p.long,
    features: p.amenities,
  };
  return mapped;
}

/* ================
   AUTH / ADMINS
================ */
export function login(email: string, password: string) {
  // POST /auth/login - using breeze-luxury-homes.onrender.com
  return apiFetch<{ token?: string; user?: any }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then(response => {
    // If response is empty but status was 201, the login was successful
    // and the token is set as an HTTP-only cookie by the backend
    if (Object.keys(response).length === 0) {
      return { success: true, token: 'http-only-cookie' };
    }
    return response;
  });
}
export function registerAdmin(data: { name: string; email: string; password: string }) {
  // POST /admins/register - using breeze-luxury-homes.onrender.com
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function getAdminMe() {
  // GET /admins/me - using breeze-luxury-homes.onrender.com
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/me`);
}

/* ================
   PROPERTIES
================ */
export function getListings(params?: Record<string, any>) {
  const qs = params ? `?${new URLSearchParams(params as any).toString()}` : "";
  return apiFetch<PropertyBE[]>(`/properties${qs}`).then(list => list.map(toListing));
}
export function getListing(id: string | number) {
  return apiFetch<PropertyBE>(`/properties/${id}`).then(toListing);
}
export function createListing(payload: PropertyBE) {
  // POST /properties/create
  return apiFetch<PropertyBE>(`/properties/create`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(toListing);
}
export function updateListing(id: string | number, data: Partial<PropertyBE>) {
  // PATCH /properties/:id
  return apiFetch<PropertyBE>(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }).then(toListing);
}
export function deleteListing(id: string | number) {
  return apiFetch<void>(`/properties/${id}`, { method: "DELETE" });
}
export function uploadListingPhoto(file: File) {
  // POST /properties/photo (multipart, field 'file')
  const form = new FormData();
  form.append("file", file);
  return apiFetchForm<{ url: string }>(`/properties/photo`, form);
}

/* ================
   BLOGS / TESTIMONIALS (placeholders; keep if FE imports them)
================ */
export const getBlogs = (params?: Record<string, any>) =>
  // Blogs endpoint doesn't exist yet - return empty array
  Promise.resolve([]);

export const getBlog = (id: string | number) =>
  // Blog endpoint doesn't exist yet - return null
  Promise.resolve(null);

export const getTestimonials = () =>
  // Testimonials endpoint doesn't exist yet - return empty array
  Promise.resolve([]);

export const getCities = () =>
  // Cities endpoint doesn't exist yet - return empty array
  Promise.resolve([]);
