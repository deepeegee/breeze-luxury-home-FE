'use client';
import { useBlogs } from '@/lib/useApi';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Pagination from '../Pagination';

const PER_PAGE = 9;
const FALLBACK_IMG = '/images/blog/loadscreen.jpg';

const fmtDay = (d) => { try { return new Date(d).toLocaleDateString(undefined, { day: '2-digit' }); } catch { return ''; } };
const fmtMonth = (d) => { try { return new Date(d).toLocaleDateString(undefined, { month: 'short' }); } catch { return ''; } };

function ImageWithFallback({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMG);
  useEffect(() => { setImgSrc(src || FALLBACK_IMG); }, [src]);
  return <Image {...props} src={imgSrc || FALLBACK_IMG} alt={alt || 'thumbnail'} onError={() => setImgSrc(FALLBACK_IMG)} />;
}

/* Same list you enforce on admin */
const CATEGORY_PILLS = [
  'All',
  'Home Improvement',
  'Life & Style',
  'Finance',
  'Selling a Home',
  'Renting a Home',
  'Buying a Home',
  'Market Insights',
  'Investment Tips',
  'Uncategorized',
];

/* ✅ Normalize anything the BE sends into ONE clean category */
function getCategory(b) {
  const candidates = [];

  // prefer explicit category field if present
  if (b?.category) candidates.push(String(b.category));

  // single tag field
  if (b?.tag) candidates.push(String(b.tag));

  // tags as string (could already be CSV)
  if (typeof b?.tags === 'string') candidates.push(String(b.tags));

  // tagsCsv field
  if (b?.tagsCsv) candidates.push(String(b.tagsCsv));

  // tags as array
  if (Array.isArray(b?.tags)) candidates.push(...b.tags.map(String));

  // split all on commas, trim, dedupe
  const uniq = Array.from(
    new Set(
      candidates
        .join(',')               // merge all
        .split(',')              // split CSV
        .map(s => s.trim())
        .filter(Boolean)
    )
  );

  return uniq[0] || 'Uncategorized';
}

export default function BlogFilter() {
  const { data: blogs = [], isLoading, error } = useBlogs();

  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  // ✅ use normalized category for filtering
  const filtered = useMemo(() => {
    if (activeCategory === 'All') return blogs;
    return blogs.filter((b) => getCategory(b) === activeCategory);
  }, [blogs, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  useEffect(() => { setPage(1); }, [activeCategory, blogs.length]);
  useEffect(() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  const paged = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  return (
    <>
      {/* category pills */}
      <ul className="nav nav-pills mb20">
        {CATEGORY_PILLS.map((category) => (
          <li className="nav-item" role="presentation" key={category}>
            <button
              className={`nav-link mb-2 mb-lg-0 fw500 dark-color ${category === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          </li>
        ))}
      </ul>

      {/* grid */}
      <div className="row">
        {isLoading && <div className="col-12 py-5 text-center">Loading posts…</div>}
        {error && !isLoading && (
          <div className="col-12 py-5 text-center text-danger">{error?.message || 'Failed to load blogs'}</div>
        )}
        {!isLoading && !error && paged.length === 0 && (
          <div className="col-12 py-5 text-center">No posts found.</div>
        )}

        {paged.map((blog) => {
          const href = `/blogs/${blog.slug ?? blog.id}`;
          const month = fmtMonth(blog.date ?? blog.createdAt);
          const day = fmtDay(blog.date ?? blog.createdAt);
          const imgSrcCandidate = blog.headerImageUrl || blog.image || '';
          const title = blog.title || 'Blog post';

          const tag = getCategory(blog); // ✅ always clean single tag

          // Hide chip if it equals the active filter (except on "All")
          const showChip = activeCategory === 'All' ? true : (tag !== activeCategory);

          return (
            <div className="col-sm-6 col-lg-4" key={blog.id ?? blog._id}>
              <div className="blog-style1">
                <div className="blog-thumb">
                  <ImageWithFallback
                    fill
                    sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
                    src={imgSrcCandidate}
                    alt={title}
                    style={{ objectFit: 'cover' }}
                    priority={false}
                  />
                </div>

                <div className="blog-content">
                  <div className="date">
                    <span className="month">{month}</span>
                    <span className="day">{day}</span>
                  </div>

                  {showChip && <span className="tag">{tag}</span>}

                  <h6 className="title mt-1">
                    <Link href={href}>{title}</Link>
                  </h6>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* pagination */}
      <div className="mbp_pagination text-center">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} maxPagesToShow={5} />
      </div>

      <style jsx>{`
        .blog-thumb {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 12px;
          overflow: hidden;
          background: #f5f5f5;
        }
        .blog-thumb :global(img) { object-fit: cover; }

        .nav.nav-pills {
          flex-wrap: wrap;       /* allow pills to wrap to next line */
          margin-bottom: 24px;   /* add space below the pills section */
        }
      
        .nav.nav-pills .nav-item {
          margin-bottom: 8px;    /* vertical gap between rows of pills */
        }
      `}</style>
    </>
  );
}
