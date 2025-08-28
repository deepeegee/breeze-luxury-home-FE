'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import {
  /* Properties */
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  uploadListingPhoto,

  // ✅ updated views/analytics helpers
  getPropertyViews,                 // number (all-time for a property)
  getPropertyDailyViewsSeries,      // per-property daily rows
  getPropertyViewsToday,            // number (today for a property)
  getGlobalDailyViewsSeries,        // global daily rows
  getGlobalViewsSummary,            // { totalViewsAllTime, todayViews, daily, monthly }
  recordPropertyView,

  /* Blogs (PUBLIC + ADMIN + MUTATIONS) */
  getBlogs,
  getBlog,
  adminGetBlogs,
  adminGetBlog,
  createBlog,
  deleteBlog,

  /* Testimonials / Cities */
  getTestimonials,
  getCities,

  /* Auth/Admin */
  login,
  registerAdmin,
  getAdminMe,

  /* types from api.ts */
  type Listing,
  type PropertyBE,
  type BlogPost,
  type PropertyDailyViewRow,
  type GlobalDailyViewRow,
} from '@/lib/api';

/* small adapter to normalize SWR return shape */
function adapt<T>(swr: any, fallback: T) {
  return {
    data: (swr?.data ?? fallback) as T,
    isLoading: !!swr?.isLoading,
    error: (swr?.error as Error) ?? null,
    mutate: swr?.mutate as (() => Promise<any>) | undefined,
  };
}

/* =========================
   Properties / Listings
========================= */

export function useListings(params?: Record<string, any>) {
  const key = params ? (['properties', JSON.stringify(params)] as const) : (['properties'] as const);
  const swr = useSWR(key, () => getListings(params));
  return adapt<Listing[]>(swr, []);
}

export function useListing(id?: string | number) {
  const key = id != null ? (['property', String(id)] as const) : null;
  const swr = useSWR(key, () => getListing(id as string | number));
  return adapt<Listing | null>(swr, null);
}

/* =========================
   Views (Per-Property)
========================= */

/** All-time views (sum of daily rows) for a property */
export function usePropertyViews(id?: string | number) {
  const key = id != null ? (['property-views-total', String(id)] as const) : null;
  const swr = useSWR<number | null>(key, () => getPropertyViews(id as string | number));
  return adapt<number | null>(swr, null);
}

/** Today's views for a property (Africa/Lagos by default) */
export function usePropertyViewsToday(id?: string | number, tz = 'Africa/Lagos') {
  const key = id != null ? (['property-views-today', String(id), tz] as const) : null;
  const swr = useSWR<number>(key, () => getPropertyViewsToday(id as string | number, tz));
  return adapt<number>(swr, 0);
}

/** Daily series for a property (for charts) */
export function usePropertyDailyViews(id?: string | number) {
  const key = id != null ? (['property-views-series', String(id)] as const) : null;
  const swr = useSWR<PropertyDailyViewRow[]>(key, () => getPropertyDailyViewsSeries(id as string | number));
  return adapt<PropertyDailyViewRow[]>(swr, []);
}

/**
 * (Replaced) Old hook tried to aggregate across all properties using a hardcoded id
 * If you still need a site-wide sum across selected properties, pass ids in.
 */
export function useTotalPropertyViews(ids?: (string | number)[]) {
  const key =
    Array.isArray(ids) && ids.length
      ? (['total-property-views', ids.map(String).sort().join(',')] as const)
      : null;

  const swr = useSWR<number>(
    key,
    async () => {
      const totals = await Promise.all(ids!.map((id) => getPropertyViews(id)));
      return totals.reduce((acc, n) => acc + (n ?? 0), 0);
    }
  );

  return adapt<number>(swr, 0);
}

/** Fire-and-forget ping if your BE supports POST /properties/:id/views */
export function useRecordPropertyView() {
  return useSWRMutation<void, any, [string], { id: string | number; meta?: any }>(
    ['record-property-view'],
    async (_key, { arg }) => {
      await recordPropertyView(arg.id, arg.meta);
    }
  );
}

/* =========================
   Global Analytics (Admin)
========================= */

/** Raw global daily rows from /properties/analytics/views/daily */
export function useGlobalDailyViews() {
  const swr = useSWR<GlobalDailyViewRow[]>(['global-views-daily'] as const, () => getGlobalDailyViewsSeries());
  return adapt<GlobalDailyViewRow[]>(swr, []);
}

/** Ready-to-render dashboard summary: totals + daily + monthly */
export function useGlobalViewsSummary(tz = 'Africa/Lagos') {
  const key = ['global-views-summary', tz] as const;
  const swr = useSWR(key, () => getGlobalViewsSummary(tz));
  return adapt<{
    totalViewsAllTime: number;
    todayViews: number;
    daily: { x: string; y: number; propertiesViewed: number }[];
    monthly: { month: string; total: number }[];
  }>(swr, { totalViewsAllTime: 0, todayViews: 0, daily: [], monthly: [] });
}

/* =========
   Listings mutations
========= */

export function useCreateListing() {
  return useSWRMutation<Listing, any, [string], PropertyBE>(
    ['create-property'],
    async (_key, { arg }) => createListing(arg)
  );
}

export function useUpdateListing() {
  return useSWRMutation<Listing, any, [string], { id: string | number; data: Partial<PropertyBE> }>(
    ['update-property'],
    async (_key, { arg }) => updateListing(arg.id, arg.data)
  );
}

export function useDeleteListing() {
  return useSWRMutation<void, any, [string], string | number>(
    ['delete-property'],
    async (_key, { arg }) => deleteListing(arg)
  );
}

export function useUploadListingPhoto() {
  return useSWRMutation<{ url: string }, any, [string], File>(
    ['upload-listing-photo'],
    async (_key, { arg }) => uploadListingPhoto(arg)
  );
}

/* =========
   Blogs (Public)
========= */

export function useBlogs(params?: Record<string, any>) {
  const key = params ? (['blogs', JSON.stringify(params)] as const) : (['blogs'] as const);
  const swr = useSWR(key, () => getBlogs(params));
  return adapt<BlogPost[]>(swr, []);
}

export function useBlog(idOrSlug?: string | number) {
  const key = idOrSlug != null ? (['blog', String(idOrSlug)] as const) : null;
  const swr = useSWR(key, () => getBlog(idOrSlug as string | number));
  return adapt<BlogPost | null>(swr, null);
}

/* =========
   Blogs (Admin)
========= */

export function useAdminBlogs(params?: Record<string, any>) {
  const key = params ? (['admin-blogs', JSON.stringify(params)] as const) : (['admin-blogs'] as const);
  const swr = useSWR(key, () => adminGetBlogs(params));
  return adapt<BlogPost[]>(swr, []);
}

export function useAdminBlog(id?: string | number) {
  const key = id != null ? (['admin-blog', String(id)] as const) : null;
  const swr = useSWR(key, () => adminGetBlog(id as string | number));
  return adapt<BlogPost | null>(swr, null);
}

export function useCreateBlog() {
  return useSWRMutation<BlogPost, any, [string], FormData>(
    ['create-blog'],
    async (_key, { arg }) => {
      if (!(arg instanceof FormData)) throw new Error('useCreateBlog expects FormData as arg');
      return createBlog(arg);
    }
  );
}

export function useDeleteBlog() {
  return useSWRMutation<{ ok: true }, any, [string], string | number>(
    ['delete-blog'],
    async (_key, { arg }) => {
      if (!arg) throw new Error('Missing blog id');
      await deleteBlog(arg);
      return { ok: true };
    }
  );
}

/* =================
   Testimonials
================= */

export function useTestimonials() {
  const swr = useSWR(['testimonials'] as const, () => getTestimonials());
  return adapt<{
    id: string | number;
    title: string;
    quote: string;
    stars: number;
    image: string;
    name: string;
    company: string;
  }[]>(swr, []);
}

/* =========
   Cities
========= */

export function useCities() {
  const swr = useSWR(['cities'] as const, () => getCities());
  return adapt<{ id: number; name: string; image: string; count: number }[]>(swr, []);
}

/* ===============
   Auth / Admin
=============== */

export function useLogin() {
  return useSWRMutation<any, any, [string], { email: string; password: string }>(
    ['login'],
    async (_key, { arg }) => login(arg.email, arg.password)
  );
}

export function useRegisterAdmin() {
  return useSWRMutation<any, any, [string], { name: string; email: string; password: string }>(
    ['register-admin'],
    async (_key, { arg }) => registerAdmin(arg)
  );
}

export function useAdminMe() {
  const swr = useSWR(['admin-me'] as const, () => getAdminMe());
  return adapt<{ id: string | number; name: string; email: string } | null>(swr, null);
}
