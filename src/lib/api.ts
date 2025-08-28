'use client';

/* ===========================================================
   Types (kept compatible with your app)
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
  city?: string;      // ← neighborhood is mapped here from the form
  state?: string;
  country?: string;
  zip?: string;
  location?: string;  // ← "address, city, state"

  // stats
  bed?: number;
  bath?: number;
  sqft?: number;
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
  featured?: boolean;

  // extras
  amenities?: string[];
  tags?: string[];
  propertyType?: string;
  yearBuilding?: number;
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

/* ===============================
   BE shapes (server returns)
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
  listedIn?: string;
  status?: string;
  price?: number;
  afterPriceLabel?: string;
  yearlyTaxRate?: number;
  photos?: PhotoBE[];

  // location
  address?: string;  // estate / address
  country?: string;
  state?: string;
  city?: string;     // neighborhood comes in here
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

  // timestamps
  createdAt?: string;
  updatedAt?: string;
};

/* ========= NEW: analytics types ========= */
export type PropertyDailyViewRow = {
  _id: string;
  propertyId: string;     // mongo _id of property
  date: string;           // ISO day (UTC midnight)
  createdAt: string;
  updatedAt: string;
  viewCount: number;
};

export type GlobalDailyViewRow = {
  totalViews: number;     // sum across all properties
  propertiesViewed: number; // distinct properties with ≥1 view that day
  date: string;           // ISO day (UTC midnight)
};

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
  description: string;                 // HTML from BE
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
   Base + helpers
=========================================================== */
const API_BASE = '/api'; // proxy base you set

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {};
  if (!(init.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  Object.assign(headers, (init.headers as Record<string, string>) || {});

  const res = await fetch(url, { credentials: 'include', headers, ...init });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.message || JSON.stringify(err);
    } catch {
      try {
        msg = `HTTP ${res.status}: ${await res.text()}`;
      } catch {}
    }
    throw Object.assign(new Error(msg), { status: res.status, url });
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const txt = await res.text();
    return (txt ? (JSON.parse(txt) as T) : ({} as T));
  }
  return (await res.json()) as T;
}

async function apiFetchForm<T>(path: string, form: FormData, method: 'POST' | 'PATCH' = 'POST'): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { method, credentials: 'include', body: form });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.message || JSON.stringify(err);
    } catch {}
    throw Object.assign(new Error(msg), { status: res.status, url });
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return ({} as T);
  return (await res.json()) as T;
}

function toQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) v.forEach((x) => x != null && qs.append(k, String(x)));
    else {
      const s = typeof v === 'string' ? v.trim() : String(v);
      if (!s || s === 'undefined' || s === 'null') return;
      qs.append(k, s);
    }
  });
  const out = qs.toString();
  return out ? `?${out}` : '';
}

function normalizePhotos(input?: PhotoBE[]): { url: string }[] | undefined {
  if (!Array.isArray(input)) return undefined;
  const items = input.filter((p) => p && typeof p.url === 'string' && p.url.trim()).map((p) => ({ ...p }));
  if (!items.length) return [];
  const idx = items.findIndex((p: any) => p.isFeatured === true);
  if (idx > 0) {
    const [feat] = items.splice(idx, 1);
    items.unshift(feat);
  }
  return items.map(({ url }) => ({ url }));
}

/* ========= date/aggregation utils (for charts & "today") ========= */
export function toLocalDayKey(d: string | Date, tz = 'Africa/Lagos') {
  const date = typeof d === 'string' ? new Date(d) : d;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const dd = parts.find(p => p.type === 'day')?.value;
  return `${y}-${m}-${dd}`; // YYYY-MM-DD
}
export function toMonthKey(d: string | Date, tz = 'Africa/Lagos') {
  const date = typeof d === 'string' ? new Date(d) : d;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit'
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  return `${y}-${m}`; // YYYY-MM
}
export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export function groupDailyToMonthly<T extends { date: string }>(
  rows: T[],
  pick: (row: T) => number,
  tz = 'Africa/Lagos'
) {
  const map = new Map<string, number>();

  // accumulate totals per month
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const key = toMonthKey(r.date, tz);
    const prev = map.has(key) ? (map.get(key) as number) : 0;
    map.set(key, prev + pick(r));
  }

  // convert map → array without using iterators/spread
  const out: { month: string; total: number }[] = [];
  map.forEach((total, month) => {
    out.push({ month, total });
  });

  // sort ascending by month key
  out.sort((a, b) => a.month.localeCompare(b.month));
  return out;
}


/* ========================
   Mappers (BE -> FE)
======================== */
function toListing(p: PropertyBE): Listing {
  const hero = Array.isArray(p.photos) ? p.photos.find((ph) => ph?.url) || p.photos[0] : undefined;
  const id = (p as any)._id ?? p.id ?? p.propertyId ?? '';

  const toNum = (v: any) =>
    typeof v === 'number' ? v : Number(String(v ?? '').replace(/\$|,/g, ''));

  const clean = (s?: any) => (typeof s === 'string' ? s.trim() : s);

  // LOCATION STRING: show only Estate/Address, Neighborhood(as city), State
  const locParts = [p.address, p.city, p.state]
    .map(clean)
    .filter((x) => typeof x === 'string' && x && x !== 'N/A');

  const availability =
    clean(p.propertyAvailability) ||
    (typeof p.listedIn === 'string' && /active|available/i.test(p.listedIn) ? 'Available' : undefined);

  const floorDetails = Array.isArray(p.floorDetails)
    ? p.floorDetails.map((fd) => ({
        floorNumber: typeof fd?.floorNumber === 'number' ? fd.floorNumber : undefined,
        price: typeof fd?.price === 'number' ? fd.price : toNum(fd?.price),
      }))
    : undefined;

  const nearby = Array.isArray(p.nearby)
    ? p.nearby.map((n) => ({ label: clean(n?.label), distance: clean(n?.distance), category: clean(n?.category) }))
    : undefined;

  return {
    id,
    image: hero?.url ?? null,

    title: clean(p.title) || clean(p.name) || 'Property',
    name: clean(p.name),
    propertyId: clean(p.propertyId),
    description: clean(p.description),

    address: clean(p.address),
    city: clean(p.city),     // neighborhood value ends up here
    state: clean(p.state),
    country: clean(p.country),
    zip: clean(p.zip),
    location: locParts.join(', '),

    bed: (p as any).bed ?? p.bedrooms,
    bath: (p as any).bath ?? p.bathrooms,
    sqft: p.sizeInFt,
    rooms: p.rooms,
    price: toNum(p.price),
    afterPriceLabel: clean(p.afterPriceLabel),
    yearlyTaxRate: typeof p.yearlyTaxRate === 'number' ? p.yearlyTaxRate : toNum(p.yearlyTaxRate),

    floorsNo: p.floorsNo,
    totalFloors: p.totalFloors,
    floorDetails,

    photos: Array.isArray(p.photos)
      ? p.photos.filter((ph) => typeof ph?.url === 'string' && /^https?:\/\//.test(ph.url))
      : undefined,
    videoSource: clean(p.videoSource),
    videoEmbedId: clean(p.videoEmbedId),
    virtualTourUrl: clean(p.virtualTourUrl),

    forRent: typeof p.listedIn === 'string' ? /rent/i.test(p.listedIn) : undefined,
    availability,
    listedIn: clean(p.listedIn),
    status: clean(p.status),
    featured: typeof p.isFeatured === 'boolean' ? p.isFeatured : false,

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

    viewCount: typeof p.viewCount === 'number' ? p.viewCount : undefined,
    lat: p.lat,
    long: p.long,
    features: p.amenities,
  };
}

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
    tags: Array.isArray(b?.tags) ? b.tags : [],
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

/* ===========================================================
   AUTH / ADMIN
=========================================================== */
export function login(email: string, password: string) {
  return apiFetch<{ token?: string; user?: any; success?: boolean }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    // ✅ If the server set an HTTP-only cookie and returns empty or {success:true},
    // treat it as a success and surface a sentinel token so the UI can branch.
    if (!response || Object.keys(response).length === 0) {
      return { success: true, token: 'http-only-cookie' } as any;
    }
    if (response.success && !response.token) {
      return { ...response, token: 'http-only-cookie' } as any;
    }
    return response;
  });
}

export function registerAdmin(data: { name: string; email: string; password: string }) {
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getAdminMe() {
  return apiFetch<{ id: string | number; name: string; email: string }>(`/admins/me`);
}

/* ===========================================================
   PROPERTIES — endpoints used by FE
=========================================================== */
export function getListings(params?: Record<string, any>) {
  const qs = toQueryString(params);
  return apiFetch<PropertyBE[]>(`/properties${qs}`).then((list) => list.map(toListing));
}

/**
 * IMPORTANT:
 * Calling GET /properties/:id on your BE ALSO increments today's view count.
 * Keep this as the detail fetch you already use.
 */
export function getListing(id: string | number) {
  return apiFetch<PropertyBE>(`/properties/${id}`).then(toListing);
}

export function createListing(payload: PropertyBE) {
  const photos = normalizePhotos(payload.photos);
  return apiFetch<PropertyBE>(`/properties/create`, {
    method: 'POST',
    body: JSON.stringify({ ...payload, photos }),
  }).then((res) => toListing(res && Object.keys(res).length ? res : { ...payload, photos }));
}

export function updateListing(id: string | number, data: Partial<PropertyBE>) {
  const next: Partial<PropertyBE> = { ...data };
  if (data.photos) next.photos = normalizePhotos(data.photos) as any;
  return apiFetch<PropertyBE>(`/properties/${id}`, { method: 'PATCH', body: JSON.stringify(next) }).then(toListing);
}

export function deleteListing(id: string | number) {
  return apiFetch<void>(`/properties/${id}`, { method: 'DELETE' });
}

export function uploadListingPhoto(file: File) {
  const form = new FormData();
  form.append('file', file);
  return apiFetchForm<any>(`/properties/photo`, form).then((res) => {
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
    if (!url) throw new Error('No URL returned');
    return { url } as { url: string };
  });
}

/* ========= NEW/UPDATED: views & analytics ========= */

/**
 * Per-property daily series.
 * BE route: GET /properties/:id/views
 * NOTE: :id is the Mongo _id (e.g. "68ae08d7..."), not the human propertyId like "BL001".
 */
export async function getPropertyDailyViewsSeries(id: string | number): Promise<PropertyDailyViewRow[]> {
  const rows = await apiFetch<PropertyDailyViewRow[]>(`/properties/${id}/views`);
  return Array.isArray(rows) ? rows : [];
}

/**
 * Back-compat helper returning a single number.
 * Now defined as the ALL-TIME total for that property (sum of daily rows).
 */
export async function getPropertyViews(id: string | number): Promise<number | null> {
  try {
    const rows = await getPropertyDailyViewsSeries(id);
    return sum(rows.map(r => r.viewCount));
  } catch {
    return null;
  }
}

/** Convenience: today's views for a property (default TZ Africa/Lagos) */
export async function getPropertyViewsToday(id: string | number, tz = 'Africa/Lagos'): Promise<number> {
  const rows = await getPropertyDailyViewsSeries(id);
  const todayKey = toLocalDayKey(new Date(), tz);
  const hit = rows.find(r => toLocalDayKey(r.date, tz) === todayKey);
  return hit?.viewCount ?? 0;
}

/** Global daily analytics across all properties. GET /properties/analytics/views/daily */
export async function getGlobalDailyViewsSeries(): Promise<GlobalDailyViewRow[]> {
  const rows = await apiFetch<GlobalDailyViewRow[]>(`/properties/analytics/views/daily`);
  return Array.isArray(rows) ? rows : [];
}

/**
 * Global summary ready for admin dashboard.
 * Returns totals + daily series (x=YYYY-MM-DD, y=totalViews) + monthly buckets.
 */
export async function getGlobalViewsSummary(tz = 'Africa/Lagos'): Promise<{
  totalViewsAllTime: number;
  todayViews: number;
  daily: { x: string; y: number; propertiesViewed: number }[];
  monthly: { month: string; total: number }[];
}> {
  const dailyRows = await getGlobalDailyViewsSeries();
  const totalViewsAllTime = sum(dailyRows.map(d => d.totalViews));

  const todayKey = toLocalDayKey(new Date(), tz);
  const todayViews = dailyRows.find(d => toLocalDayKey(d.date, tz) === todayKey)?.totalViews ?? 0;

  const daily = dailyRows
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(d => ({ x: toLocalDayKey(d.date, tz), y: d.totalViews, propertiesViewed: d.propertiesViewed }));

  const monthly = groupDailyToMonthly(dailyRows, d => d.totalViews, tz);

  return { totalViewsAllTime, todayViews, daily, monthly };
}

/**
 * Pings a view endpoint without blocking navigation.
 * If your BE needs POST /properties/:id/views for manual pings, keep this;
 * otherwise, GET /properties/:id already increments when you fetch details.
 */
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

/* ===========================================================
   BLOGS — Admin + Public
=========================================================== */

/** Admin create (multipart): POST /admins/posts */
export async function createBlog(form: FormData): Promise<BlogPost> {
  const res = await apiFetchForm<any>(`/admins/posts`, form, 'POST');
  const data = (res?.data ?? res) as BlogBE;
  return toBlog(data);
}

/** Admin list: GET /admins/posts */
export async function adminGetBlogs(params?: Record<string, any>): Promise<BlogPost[]> {
  const qs = toQueryString(params);
  const res = await apiFetch<any>(`/admins/posts${qs}`);
  const list = (res?.data ?? res ?? []) as BlogBE[];
  return Array.isArray(list) ? list.map(toBlog) : [];
}

/** Admin single */
export async function adminGetBlog(id: string | number): Promise<BlogPost | null> {
  const res = await apiFetch<any>(`/admins/posts/${id}`);
  const data = (res?.data ?? res ?? null) as BlogBE | null;
  return data ? toBlog(data) : null;
}

/** Drafts: GET /posts/drafts */
export async function getDraftPosts(): Promise<BlogPost[]> {
  try {
    const res = await apiFetch<any>(`/posts/drafts`);
    const list = (res?.data ?? res ?? []) as BlogBE[];
    return Array.isArray(list) ? list.map(toBlog) : [];
  } catch (e: any) {
    if (e?.status === 404) return [];
    throw e;
  }
}

/** Public list: GET /posts (+ optional ?tag=) */
export async function getPosts(params?: { tag?: string; page?: number; limit?: number }): Promise<BlogPost[]> {
  const qs = toQueryString(params);
  try {
    const res = await apiFetch<any>(`/posts${qs}`);
    const list = (res?.data ?? res ?? []) as BlogBE[];
    return Array.isArray(list) ? list.map(toBlog) : [];
  } catch (e: any) {
    // fallback to /posts/tag/:tag if /posts?tag= isn't supported
    if (params?.tag && e?.status === 404) {
      return getPostsByTag(params.tag);
    }
    throw e;
  }
}

/** Public single: GET /posts/:id (or slug if BE supports it) */
export async function getPost(idOrSlug: string | number): Promise<BlogPost | null> {
  try {
    const res = await apiFetch<any>(`/posts/${idOrSlug}`);
    const data = (res?.data ?? res ?? null) as BlogBE | null;
    return data ? toBlog(data) : null;
  } catch (e: any) {
    // fallback to search when slug-like id 404s
    if (typeof idOrSlug === 'string' && e?.status === 404) {
      const results = await searchPosts(idOrSlug);
      return results[0] ?? null;
    }
    throw e;
  }
}

/** By author: GET /posts/author/:authorId */
export async function getPostsByAuthor(authorId: string | number): Promise<BlogPost[]> {
  const res = await apiFetch<any>(`/posts/author/${authorId}`);
  const list = (res?.data ?? res ?? []) as BlogBE[];
  return Array.isArray(list) ? list.map(toBlog) : [];
}

/** By tag (path): GET /posts/tag/:tag */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const res = await apiFetch<any>(`/posts/tag/${encodeURIComponent(tag)}`);
  const list = (res?.data ?? res ?? []) as BlogBE[];
  return Array.isArray(list) ? list.map(toBlog) : [];
}

/** Search: GET /posts/search/:term */
export async function searchPosts(term: string): Promise<BlogPost[]> {
  const safe = encodeURIComponent(term);
  try {
    const res = await apiFetch<any>(`/posts/search/${safe}`);
    const list = (res?.data ?? res ?? []) as BlogBE[];
    return Array.isArray(list) ? list.map(toBlog) : [];
  } catch (e: any) {
    if (e?.status === 404) {
      const all = await getPosts();
      const q = term.toLowerCase();
      return all.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    throw e;
  }
}

/** Admin delete */
export async function deleteBlog(id: string | number): Promise<void> {
  await apiFetch<any>(`/admins/posts/${id}`, { method: 'DELETE' });
}

/* Convenience aliases to match existing imports elsewhere */
export const getBlogs = getPosts;
export const getBlog = getPost;

/* Simple stubs to satisfy existing imports */
export const getTestimonials = () => Promise.resolve([] as Testimonial[]);
export const getCities = () =>
  Promise.resolve([] as { id: number; name: string; image: string; count: number }[]);
