'use client';

/* ===========================================================
   Types you already had
=========================================================== */
export type Listing = {
  id: number | string;
  image: string | null;

  // basics
  title: string;
  name?: string;
  propertyId?: string;
  description?: string;

  // location
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  location?: string; // "address, city, state, country"

  // stats
  bed?: number;
  bath?: number;
  sqft?: number;          // sizeInFt
  rooms?: number;
  price?: number;
  afterPriceLabel?: string;
  yearlyTaxRate?: number;

  // structure/floors
  floorsNo?: number;
  totalFloors?: number;
  floorDetails?: { floorNumber?: number; price?: number }[];

  // media
  photos?: { url: string; isFeatured?: boolean }[];
  videoSource?: string;
  videoEmbedId?: string;
  virtualTourUrl?: string;

  // availability / status
  forRent?: boolean;
  availability?: string;
  listedIn?: string;
  status?: string;
  featured?: boolean;     // kept for legacy UI; not used for hero now

  // extras
  amenities?: string[];
  tags?: string[];        // alias of amenities
  propertyType?: string;  // category
  yearBuilding?: number;  // yearBuilt
  ownerNotes?: string;

  // optional villa details
  garages?: number;
  garageSize?: number;
  basement?: string;
  extraDetails?: string;
  roofing?: string;
  exteriorMaterial?: string;

  // nearby
  nearby?: { label?: string; distance?: string; category?: string }[];

  // telemetry / map
  viewCount?: number;
  lat?: number;
  long?: number;
  features?: string[];    // alias of amenities
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

/* ===============================
   BE shapes (what server returns)
================================ */
type PhotoBE = { url: string; isFeatured?: boolean };
type FloorDetailBE = { floorNumber?: number; price?: number };
type NearbyBE = { label?: string; distance?: string; category?: string };

export type PropertyBE = {
  id?: number | string;
  _id?: string;
  propertyId?: string;

  // basics
  title: string;
  description?: string;
  name?: string;
  category?: string;
  listedIn?: string;       // e.g. "Active"
  status?: string;         // e.g. "Published"
  price?: number;
  afterPriceLabel?: string;
  yearlyTaxRate?: number;
  photos?: PhotoBE[];

  // location
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;

  // size / rooms
  sizeInFt?: number;
  lotSizeInFt?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;

  // structure / floors
  floorsNo?: number;
  totalFloors?: number;
  floorDetails?: FloorDetailBE[];

  // media
  videoSource?: string;
  videoEmbedId?: string;
  virtualTourUrl?: string;

  // dates
  yearBuilt?: number;
  availableFrom?: string;

  // availability
  propertyAvailability?: string;

  // extras
  amenities?: string[];
  garages?: number;
  garageSize?: number;
  basement?: string;
  extraDetails?: string;
  roofing?: string;
  exteriorMaterial?: string;
  ownerNotes?: string;

  // map
  lat?: number;
  long?: number;

  // nearby
  nearby?: NearbyBE[];

  // flags
  isFeatured?: boolean;
  viewCount?: number;

  // legacy that FE ignores
  structureType?: string;
};

/* ===========================================================
   Extra Blog types for new endpoints (non-breaking)
=========================================================== */
export type BlogAuthor = {
  id: string | number;
  username?: string;
  displayName?: string;
  avatarUrl?: string | null;
};

export type BlogBE = {
  id?: string | number;
  _id?: string;
  slug?: string;
  title: string;
  description: string;                 // final HTML from BE (should have real URLs)
  tags?: string[];
  headerImageUrl?: string | null;
  published?: boolean;
  publishedAt?: string | null;
  readTime?: number | null;
  author?: BlogAuthor | string | null;
  assets?: {
    header?: {
      url: string;
      width?: number;
      height?: number;
      contentType?: string;
      sizeBytes?: number;
    } | null;
    inline?: {
      localId?: string | null;
      url: string;
      alt?: string | null;
      contentType?: string | null;
      width?: number | null;
      height?: number | null;
      sizeBytes?: number | null;
    }[];
  };
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPost = {
  id: string | number;
  slug?: string;
  title: string;
  description: string; // HTML
  tags: string[];
  headerImageUrl?: string | null;
  published: boolean;
  publishedAt?: string | null;
  readTime?: number | null;
  author?: BlogAuthor | null;
  assets?: BlogBE['assets'];
  createdAt?: string;
  updatedAt?: string;
};

/* ===========================================================
   Base + shared helpers
=========================================================== */
const API_BASE = "/api";

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  Object.assign(headers, (init.headers as Record<string, string>) || {});

  const res = await fetch(url, { credentials: "include", headers, ...init });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.message || JSON.stringify(err);
    } catch {
      try {
        const textResponse = await res.text();
        msg = `HTTP ${res.status}: ${textResponse || res.statusText}`;
      } catch {
        msg = `HTTP ${res.status}: ${res.statusText}`;
      }
    }
    throw new Error(msg);
  }

  const contentType = res.headers.get('content-type') || '';
  const contentLength = res.headers.get('content-length');

  if (res.status === 204 || contentLength === '0' || !contentType.includes('application/json')) {
    try {
      const text = await res.text();
      if (!text || !text.trim()) return {} as T;
      return JSON.parse(text) as T;
    } catch {
      return {} as T;
    }
  }

  try {
    const data = await res.json();
    return data as T;
  } catch {
    const textResponse = await res.text();
    if (textResponse.trim() === "") return {} as T;
    throw new Error(`Invalid JSON response: ${textResponse}`);
  }
}

async function apiFetchForm<T>(path: string, form: FormData, method: 'POST' | 'PATCH' = 'POST'): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    credentials: "include",
    body: form, // Important: let the browser set multipart boundary
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

function toQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      v.forEach(x => x != null && qs.append(k, String(x)));
    } else {
      const s = typeof v === "string" ? v.trim() : String(v);
      if (!s || s === "undefined" || s === "null") continue;
      qs.append(k, s);
    }
  }
  const out = qs.toString();
  return out ? `?${out}` : "";
}

// Normalize photos for BE posting: keep only { url }, move featured first.
function normalizePhotos(input?: PhotoBE[]): { url: string }[] | undefined {
  if (!Array.isArray(input)) return undefined;

  const items = input
    .filter((p) => p && typeof p.url === "string" && p.url.trim() !== "")
    .map((p) => ({ ...p }));

  if (items.length === 0) return [];

  const featuredIdx = items.findIndex((p: any) => p.isFeatured === true);
  if (featuredIdx > 0) {
    const [feat] = items.splice(featuredIdx, 1);
    items.unshift(feat);
  }
  return items.map(({ url }) => ({ url }));
}

/* ========================
   Mapper (BE -> FE)
======================== */
function toListing(p: PropertyBE): Listing {
  const hero =
    (Array.isArray(p.photos) ? p.photos.find((ph) => ph?.url) : undefined) ??
    (Array.isArray(p.photos) ? p.photos[0] : undefined);

  const id = (p as any)._id ?? p.id ?? p.propertyId ?? "";

  const toNum = (v: any) =>
    typeof v === "number" ? v : Number(String(v ?? "").replace(/\$|,/g, ""));

  const clean = (s?: any) => (typeof s === "string" ? s.trim() : s);

  const locParts = [p.address, p.city, p.state, p.country]
    .map(clean)
    .filter((x) => typeof x === "string" && x && x !== "N/A");

  const availability =
    clean(p.propertyAvailability) ||
    (typeof p.listedIn === "string" && /active|available/i.test(p.listedIn)
      ? "Available"
      : undefined);

  const floorDetails = Array.isArray(p.floorDetails)
    ? p.floorDetails.map((fd) => ({
        floorNumber: typeof fd?.floorNumber === "number" ? fd.floorNumber : undefined,
        price: typeof fd?.price === "number" ? fd.price : toNum(fd?.price),
      }))
    : undefined;

  const nearby = Array.isArray(p.nearby)
    ? p.nearby.map((n) => ({
        label: clean(n?.label),
        distance: clean(n?.distance),
        category: clean(n?.category),
      }))
    : undefined;

  const mapped: Listing = {
    id,
    image: hero?.url ?? null,

    title: clean(p.title) || clean(p.name) || "Property",
    name: clean(p.name),
    propertyId: clean(p.propertyId),
    description: clean(p.description),

    address: clean(p.address),
    city: clean(p.city),
    state: clean(p.state),
    country: clean(p.country),
    zip: clean(p.zip),
    location: locParts.join(", "),

    bed: (p as any).bed ?? p.bedrooms,
    bath: (p as any).bath ?? p.bathrooms,
    sqft: p.sizeInFt,
    rooms: p.rooms,
    price: toNum(p.price),
    afterPriceLabel: clean(p.afterPriceLabel),
    yearlyTaxRate: typeof p.yearlyTaxRate === "number" ? p.yearlyTaxRate : toNum(p.yearlyTaxRate),

    floorsNo: p.floorsNo,
    totalFloors: p.totalFloors,
    floorDetails,

    photos: Array.isArray(p.photos)
      ? p.photos.filter((ph) => typeof ph?.url === "string" && /^https?:\/\//.test(ph.url))
      : undefined,
    videoSource: clean(p.videoSource),
    videoEmbedId: clean(p.videoEmbedId),
    virtualTourUrl: clean(p.virtualTourUrl),

    forRent: typeof p.listedIn === "string" ? /rent/i.test(p.listedIn) : undefined,
    availability,
    listedIn: clean(p.listedIn),
    status: clean(p.status),
    featured: typeof p.isFeatured === "boolean" ? p.isFeatured : false,

    amenities: p.amenities,
    tags: p.amenities,
    propertyType: p.category,
    yearBuilding: p.yearBuilt,
    ownerNotes: clean(p.ownerNotes),

    garages: p.garages,
    garageSize: p.garageSize,
    basement: clean(p.basement),
    extraDetails: clean(p.extraDetails),
    roofing: clean(p.roofing),
    exteriorMaterial: clean(p.exteriorMaterial),

    nearby,

    viewCount: typeof p.viewCount === "number" ? p.viewCount : undefined,
    lat: p.lat,
    long: p.long,
    features: p.amenities,
  };

  return mapped;
}

/* ===========================================================
   AUTH / ADMIN (exports)
=========================================================== */
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

/* ===========================================================
   PROPERTIES (exports)
=========================================================== */
export function getListings(params?: Record<string, any>) {
  const qs = toQueryString(params);
  return apiFetch<PropertyBE[]>(`/properties${qs}`).then((list) => list.map(toListing));
}

export function getListing(id: string | number) {
  return apiFetch<PropertyBE>(`/properties/${id}`).then(toListing);
}

export async function getPropertyViews(id: string | number): Promise<number | null> {
  try {
    const res = await apiFetch<any>(`/properties/${id}/views`);
    if (typeof res === 'number') return res;
    if (res?.count != null) return Number(res.count);
    if (res?.views != null) return Number(res.views);
    if (res?.data?.count != null) return Number(res.data.count);
    return null;
  } catch {
    return null;
  }
}

type ViewPingPayload = {
  route?: string;
  referrer?: string;
  ts?: number;
  source?: string;
  sessionId?: string;
};
export async function recordPropertyView(id: string | number, meta: ViewPingPayload = {}) {
  const path = `/properties/${id}/views`;
  const body = JSON.stringify({ ...meta, ts: meta.ts ?? Date.now() });

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      (navigator as any).sendBeacon?.(`${API_BASE}${path}`, blob);
      return;
    } catch {}
  }

  try {
    await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive: true,
      body,
    });
  } catch {}
}

export function createListing(payload: PropertyBE) {
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
  if (data.photos) next.photos = normalizePhotos(data.photos) as any;
  return apiFetch<PropertyBE>(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(next),
  }).then(toListing);
}

export function deleteListing(id: string | number) {
  return apiFetch<void>(`/properties/${id}`, { method: "DELETE" });
}

export function uploadListingPhoto(file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiFetchForm<{ url?: string; logo?: string }>(`/properties/photo`, form).then((res: any) => {
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

/* ===========================================================
   BLOGS — Public + Admin + Create/Delete
=========================================================== */

// Internal: map BE -> FE BlogPost
function toBlog(b: BlogBE): BlogPost {
  const id = (b as any)?._id ?? b?.id ?? '';
  const author =
    b?.author && typeof b.author === 'object'
      ? (b.author as BlogAuthor)
      : b?.author
      ? { id: b.author as any }
      : null;

  return {
    id,
    slug: b?.slug,
    title: String(b?.title ?? '').replace(/^"(.*)"$/, '$1').trim(),
    description: String(b?.description ?? ''),
    tags: Array.isArray(b?.tags) ? b!.tags! : [],
    headerImageUrl: b?.headerImageUrl ?? null,
    published: !!b?.published,
    publishedAt: b?.publishedAt ?? null,
    readTime: b?.readTime ?? null,
    author,
    assets: b?.assets,
    createdAt: b?.createdAt,
    updatedAt: b?.updatedAt,
  };
}

/* ----- Public reads ----- */
export async function getBlogs(params?: Record<string, any>): Promise<BlogPost[]> {
  const qs = toQueryString(params);
  const res = await apiFetch<any>(`/blogs${qs}`);
  const list = (res?.data ?? res ?? []) as BlogBE[];
  return Array.isArray(list) ? list.map(toBlog) : [];
}

export async function getBlog(idOrSlug: string | number): Promise<BlogPost | null> {
  const res = await apiFetch<any>(`/blogs/${idOrSlug}`);
  const data = (res?.data ?? res ?? null) as BlogBE | null;
  return data ? toBlog(data) : null;
}

/* ----- Admin reads ----- */
export async function adminGetBlogs(params?: Record<string, any>): Promise<BlogPost[]> {
  const qs = toQueryString(params);
  const res = await apiFetch<any>(`/admins/posts${qs}`);
  const list = (res?.data ?? res ?? []) as BlogBE[];
  return Array.isArray(list) ? list.map(toBlog) : [];
}

export async function adminGetBlog(id: string | number): Promise<BlogPost | null> {
  const res = await apiFetch<any>(`/admins/posts/${id}`);
  const data = (res?.data ?? res ?? null) as BlogBE | null;
  return data ? toBlog(data) : null;
}

/* ----- Admin create (multipart) ----- */
/** Create blog (admin). Expects FormData with:
 *  - title, description (HTML), published ("true"/"false")
 *  - optional headerImage (File)
 *  - optional tags[] (repeated)
 *  - optional images[] (Files) + imageLocalIds[] (strings; same order)
 */
export async function createBlog(form: FormData): Promise<BlogPost> {
  const res = await apiFetchForm<any>(`/admins/posts`, form, 'POST');
  const data = (res?.data ?? res) as BlogBE;
  return toBlog(data);
}

/* ----- Admin delete ----- */
export async function deleteBlog(id: string | number): Promise<void> {
  await apiFetch<any>(`/admins/posts/${id}`, { method: 'DELETE' });
}

/* ===========================================================
   TESTIMONIALS & CITIES (stubs retained)
=========================================================== */
export const getTestimonials = () => Promise.resolve([] as Testimonial[]);
export const getCities = () =>
  Promise.resolve([] as { id: number; name: string; image: string; count: number }[]);
