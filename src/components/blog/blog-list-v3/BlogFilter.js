"use client";
import { useBlogs } from "@/lib/useApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BlogFilter = () => {
  const { data: blogs = [], isLoading, error } = useBlogs();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  const handleFilter = (category) => {
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) => blog.category === category);
      setFilteredBlogs(filtered);
    }
    setActiveCategory(category);
  };

  const categories = [
    "All",
    "Home Improvement",
    "Life & Style",
    "Finance",
    "Selling a Home",
    "Renting a Home",
    "Buying a Home",
  ];

  return (
    <>
      <ul className="nav nav-pills mb20">
        {categories.map((category, index) => (
          <li className="nav-item" role="presentation" key={index}>
            <button
              className={`nav-link mb-2 mb-lg-0 fw500 dark-color ${
                category === activeCategory ? "active" : ""
              }`}
              onClick={() => handleFilter(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>

      <div className="row">
        {filteredBlogs.map((blog) => (
          <div className="col-sm-6 col-lg-4" key={blog.id}>
            <div className="blog-style1">
              <div className="blog-img">
                <Image
                  width={386}
                  height={271}
                  className="w-100 h-100 cover"
                  src={blog.image}
                  alt="blog"
                />
              </div>
              <div className="blog-content">
                <div className="date">
                  <span className="month">{blog.date?.month}</span>
                  <span className="day">{blog.date?.day}</span>
                </div>
                <a className="tag" href="#">
                  {blog.tag}
                </a>
                <h6 className="title mt-1">
                  <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogFilter;
