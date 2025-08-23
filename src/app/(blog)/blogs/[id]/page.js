'use client';

import Details from "@/components/blog/blog-single/Details";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import { useBlog } from "@/lib/useApi";
import { useParams } from "next/navigation";

export default function BlogSingle() {
  const params = useParams();
  const { data: blog, isLoading, error } = useBlog(params.id);

  if (isLoading) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        <section className="our-blog pt50">
          <div className="container">
            <p>Loading blog...</p>
          </div>
        </section>
        <section className="footer-style1 pt60 pb-0">
          <Footer />
        </section>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <DefaultHeader />
        <MobileMenu />
        <section className="our-blog pt50">
          <div className="container">
            <p>Blog not found.</p>
          </div>
        </section>
        <section className="footer-style1 pt60 pb-0">
          <Footer />
        </section>
      </>
    );
  }

  return (
    <>
      <DefaultHeader />
      <MobileMenu />
      <section className="our-blog pt50">
        <Details blog={blog} />
      </section>
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
}
