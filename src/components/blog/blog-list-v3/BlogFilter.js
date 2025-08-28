"use client";
import { useBlogs } from "@/lib/useApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../Pagination";

const PER_PAGE = 9;

const fmtDay = (date) => {
  if (typeof date === "object" && date?.day) return String(date.day);
  if (!date) return "";
  try { return new Date(date).toLocaleDateString(undefined, { day: "2-digit" }); } catch { return ""; }
};
const fmtMonth = (date) => {
  if (typeof date === "object" && date?.month) return String(date.month);
  if (!date) return "";
  try { return new Date(date).toLocaleDateString(undefined, { month: "short" }); } catch { return ""; }
};

export default function BlogFilter() {
  const { data: blogs = [], isLoading, error } = useBlogs();

  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const dynamicCats = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => b?.category && set.add(String(b.category)));
    const arr = Array.from(set);
    return arr.length
      ? ["All", ...arr]
      : ["All", "Home Improvement", "Life & Style", "Finance", "Selling a Home", "Renting a Home", "Buying a Home"];
  }, [blogs]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return blogs;
    return blogs.filter((b) => b?.category === activeCategory);
  }, [blogs, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, blogs.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const paged = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const handleFilter = (category) => setActiveCategory(category);

  return (
    <>
      {/* category pills */}
      <ul className="nav nav-pills mb20">
        {dynamicCats.map((category) => (
          <li className="nav-item" role="presentation" key={category}>
            <button
              className={`nav-link mb-2 mb-lg-0 fw500 dark-color ${category === activeCategory ? "active" : ""}`}
              onClick={() => handleFilter(category)}
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
          <div className="col-12 py-5 text-center text-danger">{error?.message || "Failed to load blogs"}</div>
        )}
        {!isLoading && !error && paged.length === 0 && (
          <div className="col-12 py-5 text-center">No posts found.</div>
        )}

        {paged.map((blog) => {
          const href = `/blogs/${blog.slug ?? blog.id}`;
          const month = fmtMonth(blog.date ?? blog.createdAt);
          const day = fmtDay(blog.date ?? blog.createdAt);
          const imgSrc = blog.image || blog.headerImageUrl || "/images/blogs/placeholder.jpg";
          const title = blog.title || "blog";

          return (
            <div className="col-sm-6 col-lg-4" key={blog.id ?? blog._id}>
              <div className="blog-style1">
                {/* Fixed-size image area */}
                <div className="blog-thumb">
                  <Image
                    fill
                    sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
                    src={imgSrc}
                    alt={title}
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                </div>

                <div className="blog-content">
                  <div className="date">
                    <span className="month">{month}</span>
                    <span className="day">{day}</span>
                  </div>
                  {!!blog.tag && <span className="tag">{blog.tag}</span>}
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

      {/* local styles */}
      <style jsx>{`
        .blog-thumb {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 12px;
          overflow: hidden;
          background: #f5f5f5;
        }
        .blog-thumb :global(img) {
          object-fit: cover;
        }

        /* @media (min-width: 992px) { .blog-thumb { height: 260px; } }
           @media (min-width: 1400px){ .blog-thumb { height: 280px; } } */
      `}</style>
    </>
  );
}
