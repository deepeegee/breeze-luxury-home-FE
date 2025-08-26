'use client';

import { useBlogs } from '@/lib/useApi';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

/** pick a thumbnail: header image, then first inline asset, else placeholder */
function thumbFrom(post) {
  const header = post && post.headerImageUrl;
  const inline =
    post && post.assets && Array.isArray(post.assets.inline) && post.assets.inline.length
      ? post.assets.inline[0].url
      : undefined;
  return header || inline || '/images/blogs/placeholder.jpg';
}

function fmtMonthDay(iso) {
  if (!iso) return { month: '', day: '' };
  try {
    const d = new Date(iso);
    return {
      month: d.toLocaleDateString(undefined, { month: 'short' }),
      day: d.toLocaleDateString(undefined, { day: '2-digit' }),
    };
  } catch {
    return { month: '', day: '' };
  }
}

/** turn HTML into a short text excerpt; strips images entirely */
function excerptFromHtml(html, max) {
  const limit = typeof max === 'number' ? max : 120;
  if (!html) return '';
  // remove <figure> blocks and <img> tags
  const noImgs = html
    .replace(/<\s*figure[^>]*>.*?<\s*\/\s*figure\s*>/gis, '')
    .replace(/<\s*img[^>]*>/gi, '');
  // strip remaining tags
  const text = noImgs.replace(/<\/?[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length <= limit ? text : text.slice(0, limit).trimEnd() + '…';
}

export default function Blog() {
  const { data: blogs = [], isLoading, error } = useBlogs();

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="col-sm-6 col-lg-4" key={`sk-${i}`}>
            <div className="blog-style1">
              <div className="blog-img skeleton" style={{ width: '100%', height: 271, borderRadius: 12 }} />
              <div className="blog-content pt10">
                <div className="skeleton" style={{ width: 120, height: 18, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '80%', height: 22 }} />
              </div>
            </div>
          </div>
        ))}
        <style jsx>{`
          .skeleton {
            background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
            background-size: 400% 100%;
            animation: shimmer 1.2s ease-in-out infinite;
            border-radius: 8px;
          }
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </>
    );
  }

  if (error) {
    return (
      <div className="col-12 text-center text-danger py-4">
        {(error && error.message) || 'Failed to load blog posts.'}
      </div>
    );
  }

  return (
    <>
      {blogs.map((post) => {
        const id = (post && (post.id || post._id)) || '';
        const slug = post && post.slug;
        const href = slug ? `/blogs/${slug}` : `/blogs/${id}`;
        const img = thumbFrom(post);
        const when = post && (post.publishedAt || post.createdAt);
        const date = fmtMonthDay(when);
        const tag = post && Array.isArray(post.tags) && post.tags.length ? post.tags[0] : null;
        const excerpt = excerptFromHtml((post && post.description) || '', 120);

        return (
          <div className="col-sm-6 col-lg-4" key={id}>
            <div className="blog-style1">
              <div className="blog-img">
                <Image
                  width={386}
                  height={271}
                  className="w-100 h-100 cover bdrs12"
                  src={img}
                  alt={(post && post.title) || 'blog'}
                />
              </div>
              <div className="blog-content">
                <div className="date">
                  <span className="month">{date.month}</span>
                  <span className="day">{date.day}</span>
                </div>
                {tag ? <span className="tag">{tag}</span> : null}
                <h6 className="title mt-1">
                  <Link href={href}>{post && post.title}</Link>
                </h6>
                {excerpt ? <p className="blog-excerpt">{excerpt}</p> : null}
              </div>
            </div>
          </div>
        );
      })}

      {/* defensive CSS to keep any leftover inline <img> tiny in this list */}
      <style jsx>{`
        .blog-style1 .blog-img img,
        .blog-style1 .blog-img :global(img) {
          object-fit: cover;
        }
        .bdrs12 { border-radius: 12px; }

        /* if any HTML sneaks into the list card, clamp images */
        .blog-style1 .blog-content :global(img) {
          max-width: 100%;
          height: auto;
          max-height: 140px;
          width: auto;
          object-fit: contain;
          display: block;
          border-radius: 8px;
          margin: 8px 0 0;
        }

        .blog-excerpt {
          margin-top: 6px;
          color: #6c757d;
          font-size: 0.95rem;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
