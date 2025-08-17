import { useBlogs } from "@/lib/useApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestPost = () => {
  const { data: blogs = [], isLoading, error } = useBlogs({ limit: 5, sort: 'date_desc' });
  const posts = blogs.slice(0, 5);

  return (
    <div className="sidebar-widget mb30">
      <h6 className="widget-title">Latest Posts</h6>
      {posts.map((post, index) => (
        <div
          className="list-news-style d-flex align-items-center mt20 mb20"
          key={index}
        >
          <div className="news-img flex-shrink-0">
            <Image width={90} height={80} src={post.image} alt="blog" />
          </div>
          <div className="news-content flex-shrink-1 ms-3">
            <p className="new-text mb0 fz14">
              <Link href={`/blogs/${post.id}`}>{post.content || post.title}</Link>
            </p>
            <a className="body-light-color" href="#">
              {post?.date?.day} {post?.date?.month}, {post?.date?.year}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestPost;
