// src/lib/api.ts

export type Listing = {
  id: number | string;
  image: string | null;
  title: string;
  city?: string;
  description?: string;
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
  // Accept either id or _id from backend
  id?: number | string;
  _id?: string;
  propertyId?: string;

  title: string;
  description?: string;
  name?: string;
  category?: string;
  listedIn?: string; // e.g., "Active", "Rent", "Buy", etc (backend-defined)
  status?: string;   // e.g., "Pending", "Published"
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
const API_BASE = "/api";

// ------- helpers -------
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge with any additional headers from init
  Object.assign(headers, (init.headers as Record<string, string>) || {});

  console.log(`API Request to: ${url}`, { headers, method: init.method || "GET" });

  const res = await fetch(url, {
    credentials: "include", // include HTTP-only Auth cookie
    headers,
    ...init,
  });

  console.log(`API Response from: ${url}`, {
    status: res.status,
    ok: res.ok,
    statusText: res.statusText,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.message || JSON.stringify(err);
    } catch (parseErr) {
      console.error("Failed to parse error response:", parseErr);
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

  // Some endpoints may return no content
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") {
    console.log("Empty response body, returning empty object");
    return {} as T;
  }

  try {
    const data = await res.json();
    console.log(`API Response data from: ${url}`, data);
    return data as T;
  } catch (parseErr) {
    console.error("Failed to parse JSON response:", parseErr);
    try {
      const textResponse = await res.text();
      console.log("Response as text:", textResponse);
      if (textResponse.trim() === "") {
        return {} as T;
      }
      throw new Error(`Invalid JSON response: ${textResponse}`);
    } catch {
      throw new Error("Failed to parse response as JSON or text");
    }
  }
}

async function apiFetchForm<T>(path: string, form: FormData): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {};

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers,
    body: form, // let browser set boundary
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message || JSON.stringify(err);
    } catch {}
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

// ------- query sanitizer -------
function toQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    const s = typeof v === "string" ? v.trim() : String(v);
    if (!s || s === "undefined" || s === "null") continue;
    qs.append(k, s);
  }
  const out = qs.toString();
  return out ? `?${out}` : "";
}

// ------- mapper -------
function toListing(p: PropertyBE): Listing {
  const featuredPhoto = p.photos?.find((ph) => ph.isFeatured) ?? p.photos?.[0];
  const id = (p as any)._id ?? p.id ?? p.propertyId ?? "";

  const toNum = (v: any) =>
    typeof v === "number" ? v : Number(String(v ?? "").replace(/\$|,/g, ""));

  const mapped: Listing = {
    id,
    image: featuredPhoto?.url ?? null,
    title: p.title || p.name || "Property",
    city: p.city,
    location: [p.address, p.city, p.state, p.country].filter(Boolean).join(", "),
    bed: p.bedrooms,
    bath: p.bathrooms,
    sqft: p.sizeInFt,
    price: toNum(p.price),
    description: p.description || undefined,
    forRent: typeof p.listedIn === "string" ? /rent/i.test(p.listedIn) : undefined,
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
  // POST /auth/login
  return apiFetch<{ token?: string; user?: any }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    // Some backends return 201 with empty body and set token as http-only cookie
    if (response && Object.keys(response).length === 0) {
      return { success: true, token: "http-only-cookie" } as any;
    }
    return response;
  });
}

export function registerAdmin(data: { name: string; email: string; password: string }) {
  // POST /admins/register
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAdminMe() {
  // GET /admins/me
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/me`);
}

/* ================
   PROPERTIES
================ */
export function getListings(params?: Record<string, any>) {
  const qs = toQueryString(params);
  return apiFetch<PropertyBE[]>(`/properties${qs}`).then((list) => list.map(toListing));
}

export function getListing(id: string | number) {
  return apiFetch<PropertyBE>(`/properties/${id}`).then(toListing);
}

export function createListing(payload: PropertyBE) {
  // POST /properties/create
  return apiFetch<PropertyBE>(`/properties/create`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => {
    // If backend returns empty body, fall back to submitted payload
    const body: PropertyBE = res && Object.keys(res).length ? res : payload;
    return toListing(body);
  });
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
   BLOGS / TESTIMONIALS (stubs)
================ */
export const getBlogs = (params?: Record<string, any>) =>
  // Endpoint not implemented yet
  Promise.resolve([] as any[]);

export const getBlog = (id: string | number) =>
  // Endpoint not implemented yet
  Promise.resolve(null);

export const getTestimonials = () =>
  // Endpoint not implemented yet
  Promise.resolve([] as any[]);

export const getCities = () =>
  // Endpoint not implemented yet
  Promise.resolve([] as any[]);
