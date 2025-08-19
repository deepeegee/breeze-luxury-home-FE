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
type PhotoBE = { url: string; isFeatured?: boolean }; // BE ignores isFeatured on photo; we strip it when sending

export type PropertyBE = {
  id?: number | string;
  _id?: string;
  propertyId?: string;

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

  // some APIs return this at the property level
  isFeatured?: boolean;
};

// ------- base -------
const API_BASE = "/api";

// ------- helpers -------
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  Object.assign(headers, (init.headers as Record<string, string>) || {});

  console.log(`API Request to: ${url}`, { headers, method: init.method || "GET" });

  const res = await fetch(url, {
    credentials: "include",
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
      } catch {
        msg = `HTTP ${res.status}: ${res.statusText}`;
      }
    }
    console.error("API Error:", { status: res.status, message: msg, url });
    throw new Error(msg);
  }

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
    body: form,
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

// ------- query -------
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

// ------- photo sanitization (fixes 400) -------
function normalizePhotos(input?: PhotoBE[]): { url: string }[] | undefined {
  if (!Array.isArray(input)) return undefined;

  // keep only items with a valid url
  const items = input
    .filter((p) => p && typeof p.url === "string" && p.url.trim() !== "")
    .map((p) => ({ ...p })); // shallow copy

  if (items.length === 0) return [];

  // if any photo was marked isFeatured=true on the client, move it to the front
  const featuredIdx = items.findIndex((p: any) => p.isFeatured === true);
  if (featuredIdx > 0) {
    const [feat] = items.splice(featuredIdx, 1);
    items.unshift(feat);
  }

  // strip isFeatured from each photo before sending to BE
  const stripped = items.map(({ url }) => ({ url }));
  return stripped;
}

// ------- mapper -------
function toListing(p: PropertyBE): Listing {
  const featuredPhoto =
    p.photos?.find((ph) => ph.isFeatured) ?? p.photos?.[0];

  const id = (p as any)._id ?? p.id ?? p.propertyId ?? "";

  const toNum = (v: any) =>
    typeof v === "number" ? v : Number(String(v ?? "").replace(/\$|,/g, ""));

  const mapped: Listing = {
    id,
    image: featuredPhoto?.url ?? null,
    title: p.title || p.name || "Property",
    city: p.city,
    location: [p.address, p.city, p.state, p.country].filter(Boolean).join(", "),
    bed: (p as any).bed ?? p.bedrooms,
    bath: (p as any).bath ?? p.bathrooms,
    sqft: p.sizeInFt,
    price: toNum(p.price),
    description: p.description || undefined,
    forRent: typeof p.listedIn === "string" ? /rent/i.test(p.listedIn) : undefined,
    tags: p.amenities,
    propertyType: p.category,
    yearBuilding: p.yearBuilt,
    // prefer property-level isFeatured; else per-photo flag (older FE) ; else false
    featured:
      typeof p.isFeatured === "boolean"
        ? p.isFeatured
        : !!(p.photos && p.photos.some((ph) => ph.isFeatured)),
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
  return apiFetch<{ token?: string; user?: any }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (response && Object.keys(response).length === 0) {
      return { success: true, token: "http-only-cookie" } as any;
    }
    return response;
  });
}

export function registerAdmin(data: { name: string; email: string; password: string }) {
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAdminMe() {
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
  // sanitize photos for BE (strip isFeatured and move featured to front)
  const photos = normalizePhotos(payload.photos);

  return apiFetch<PropertyBE>(`/properties/create`, {
    method: "POST",
    body: JSON.stringify({ ...payload, photos }),
  }).then((res) => {
    const body: PropertyBE = res && Object.keys(res).length ? res : { ...payload, photos };
    return toListing(body);
  });
}

export function updateListing(id: string | number, data: Partial<PropertyBE>) {
  const next: Partial<PropertyBE> = { ...data };
  if (data.photos) {
    next.photos = normalizePhotos(data.photos) as any;
  }
  return apiFetch<PropertyBE>(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(next),
  }).then(toListing);
}

export function deleteListing(id: string | number) {
  return apiFetch<void>(`/properties/${id}`, { method: "DELETE" });
}

export function uploadListingPhoto(file: File) {
  // BE expects one of: file | image | photo | upload | picture
  const form = new FormData();
  form.append("file", file);
  return apiFetchForm<{ url?: string; logo?: string }>(`/properties/photo`, form).then((res: any) => {
    // Normalize to { url }
    const url =
      res?.url ||
      res?.logo ||
      res?.data?.url ||
      res?.data?.logo ||
      res?.Location ||
      res?.location ||
      res?.fileUrl ||
      res?.secure_url ||
      null;

    if (!url) throw new Error("No URL returned");
    return { url } as { url: string };
  });
}

/* ================
   BLOGS / TESTIMONIALS (stubs)
================ */
export const getBlogs = (params?: Record<string, any>) => Promise.resolve([] as any[]);
export const getBlog = (id: string | number) => Promise.resolve(null);
export const getTestimonials = () => Promise.resolve([] as any[]);
export const getCities = () => Promise.resolve([] as any[]);