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
  getPropertyViews,
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

export function usePropertyViews(id?: string | number) {
  const key = id != null ? (['property-views', String(id)] as const) : null;
  const swr = useSWR<number | null>(key, () => getPropertyViews(id as string | number));
  return adapt<number | null>(swr, null);
}

export function useTotalPropertyViews() {
  const { data: listings } = useListings();

  const idsKey =
    Array.isArray(listings) && listings.length
      ? listings.map((p) => String(p.id)).sort().join(',')
      : '';

  const swr = useSWR<number>(
    idsKey ? (['total-property-views', idsKey] as const) : null,
    async () => {
      const ids = (listings ?? []).map((p) => p.id).filter((x) => x != null);
      const counts = await Promise.all(
        ids.map(async (id) => {
          try {
            const n = await getPropertyViews(id as string | number);
            return typeof n === 'number' && Number.isFinite(n) ? n : 0;
          } catch {
            return 0;
          }
        })
      );
      return counts.reduce((a, b) => a + b, 0);
    }
  );

  return {
    total: swr.data ?? 0,
    isLoading: !!swr.isLoading,
    error: (swr.error as Error) ?? null,
    mutate: swr.mutate,
  };
}

export function useRecordPropertyView() {
  return useSWRMutation<void, any, [string], { id: string | number; meta?: any }>(
    ['record-property-view'],
    async (_key, { arg }) => {
      await recordPropertyView(arg.id, arg.meta);
    }
  );
}

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
  return adapt<
    { id: string | number; title: string; quote: string; stars: number; image: string; name: string; company: string }[]
  >(swr, []);
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
