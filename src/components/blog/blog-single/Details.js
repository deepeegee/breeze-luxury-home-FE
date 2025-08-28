'use client';

import Image from "next/image";

export default function Details({ blog }) {
  return (
    <div className="container ">
      <div className="row" data-aos="fade-up" data-aos-delay="100">
        <div className="col-lg-12">
          <h2 className="blog-title mt50">
            {blog?.title || "Untitled Blog"}
          </h2>
          <div className="blog-single-meta">
            <div className="post-author d-sm-flex align-items-center">
              <Image
                width={40}
                height={40}
                className="mr10"
                src={blog?.author?.image || "/images/blog/author-1.png"}
                alt="author"
              />
              <span className="pr15 bdrr1">
                {blog?.author?.name || "Admin"}
              </span>
              <span className="ml15 pr15 bdrr1">
                {blog?.tags?.join(", ") || "Uncategorized"}
              </span>
              <span className="ml15">
                {blog?.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString()
                  : "Draft"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {blog?.image && (
        <div className="mx-auto maxw1600 mt60" data-aos="fade-up" data-aos-delay="300">
          <div className="row">
            <div className="col-lg-12">
              <div className="large-thumb">
                <Image
                  width={1200}
                  height={600}
                  priority
                  className="w-100 h-100 cover"
                  src={blog.image}
                  alt={blog.title}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog content */}
      <div className="mt40">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog?.description || "" }}
        />
      </div>
    </div>
  );
}
