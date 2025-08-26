'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * If you want parent-controlled state, accept props:
 * { search, onSearchChange, status, onStatusChange, sort, onSortChange }
 * For convenience, this component also works standalone and emits CustomEvents
 * that BlogDataTable listens to.
 */
export default function FilterHeader(props) {
  const router = useRouter();

  const [search, setSearch] = useState(props.search || '');
  const [status, setStatus] = useState(props.status || 'All'); // All | Published | Draft
  const [sort, setSort] = useState(props.sort || 'Newest');    // Newest | Oldest | A–Z

  // Emit changes both via props callbacks (if passed) and window events for decoupled use
  const emit = (type, detail) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blogDashboardFilter', { detail: { type, ...detail } }));
    }
  };

  const onSearchChange = (v) => {
    setSearch(v);
    props.onSearchChange ? props.onSearchChange(v) : emit('search', { search: v });
  };

  const onStatusChange = (v) => {
    setStatus(v);
    props.onStatusChange ? props.onStatusChange(v) : emit('status', { status: v });
  };

  const onSortChange = (v) => {
    setSort(v);
    props.onSortChange ? props.onSortChange(v) : emit('sort', { sort: v });
  };

  return (
    <div className="dashboard_search_meta d-md-flex align-items-center justify-content-xxl-end">
      {/* Search */}
      <div className="item1 mb15-sm">
        <div className="search_area">
          <input
            type="text"
            className="form-control bdrs12"
            placeholder="Search title or tags"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <label>
            <span className="flaticon-search" />
          </label>
        </div>
      </div>

      {/* Status */}
      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '56px' }} className="title-color">Status:</span>
          <select
            className="form-select show-tick"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Sort */}
      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '50px' }} className="title-color">Sort:</span>
          <select
            className="form-select show-tick"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>A–Z</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={() => router.push('/dashboard-add-blog')}
      >
        Add New Post <i className="fal fa-arrow-right-long" />
      </button>
    </div>
  );
}