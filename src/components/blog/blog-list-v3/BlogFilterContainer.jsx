'use client';

import React, { useState } from 'react';
import BlogFilter from './BlogFilter';

export default function BlogFilterContainer() {
  const [q, setQ] = useState('');       // search text
  const [tag, setTag] = useState('');   // active tag (optional)
  const [page, setPage] = useState(1);  // current page

  // reset to page 1 whenever filters change
  const onSearch = (nextQ) => {
    setQ(nextQ);
    setPage(1);
  };
  const onSelectTag = (nextTag) => {
    setTag(nextTag);
    setPage(1);
  };

  return (
    <section className="our-blog pt-0">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-12 navpill-style1">
            <BlogFilter
              q={q}
              onSearch={onSearch}
              tag={tag}
              onSelectTag={onSelectTag}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}