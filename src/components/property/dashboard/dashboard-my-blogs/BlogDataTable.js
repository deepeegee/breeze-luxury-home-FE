"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ---------- helpers ---------- */
const thumbFrom = (post) =>
  post?.headerImageUrl ||
  (Array.isArray(post?.assets?.inline) && post.assets.inline[0]?.url) ||
  "/images/blogs/placeholder.jpg";

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return String(d);
  }
};

const normalize = (s) => (s ?? "").toString().toLowerCase();
const isExternalUrl = (src) => /^https?:\/\//i.test(src);

function SafeThumb({ src, alt, width = 110, height = 94, className = "w-100" }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      referrerPolicy={isExternalUrl(src) ? "no-referrer" : undefined}
      loading="lazy"
      style={{ objectFit: "cover", borderRadius: 8 }}
    />
  );
}

const statusPill = (published) =>
  published
    ? "badge rounded-pill bg-success-subtle text-success-emphasis"
    : "badge rounded-pill bg-secondary-subtle text-secondary-emphasis";

/* ---------- table ---------- */

const BlogDataTable = ({
  search = "",
  status = "All",            // "All" | "Published" | "Draft"
  sort = "Newest",           // "Newest" | "Oldest" | "A–Z"
  currentPage = 1,
  itemsPerPage = 10,
  setTotalItems = () => {},
}) => {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  // fetch list (ADMIN)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admins/posts", { credentials: "include" });
        if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        if (alive) setRaw(list);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load blogs");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 1) text filter
  const filteredByText = useMemo(() => {
    const q = normalize(search);
    if (!q) return raw;
    return raw.filter((p) => {
      const hay = [
        p?.title,
        p?.slug,
        p?.description,
        Array.isArray(p?.tags) ? p.tags.join(",") : "",
      ].filter(Boolean).join(" | ").toLowerCase();
      return hay.includes(q);
    });
  }, [raw, search]);

  // 2) status filter
  const filtered = useMemo(() => {
    if (status === "All") return filteredByText;
    const wantPublished = status === "Published";
    return filteredByText.filter((p) => !!p?.published === wantPublished);
  }, [filteredByText, status]);

  // 3) sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "Oldest") {
      return arr.sort(
        (a, b) =>
          new Date(a?.publishedAt || a?.createdAt || 0) -
          new Date(b?.publishedAt || b?.createdAt || 0)
      );
    }
    if (sort === "A–Z") {
      return arr.sort((a, b) => normalize(a?.title).localeCompare(normalize(b?.title)));
    }
    // default: Newest (prefer publishedAt)
    return arr.sort(
      (a, b) =>
        new Date(b?.publishedAt || b?.createdAt || 0) -
        new Date(a?.publishedAt || a?.createdAt || 0)
    );
  }, [filtered, sort]);

  // ✅ Inform parent AFTER render when total changes
  useEffect(() => {
    setTotalItems(sorted.length);
  }, [sorted.length, setTotalItems]);

  // 4) pagination (client-side) — compute slice only
  const paged = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sorted.slice(start, end);
  }, [sorted, currentPage, itemsPerPage]);

  const onDelete = async (id) => {
    if (!id) return;
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/admins/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      setRaw((prev) => prev.filter((p) => (p?.id ?? p?._id) !== id));
    } catch (e) {
      alert(e?.message || "Failed to delete");
    }
  };

  const togglePublish = async (post) => {
    const id = post?.id ?? post?._id;
    if (!id) return;
    const next = !post?.published;

    // optimistic
    setSavingId(id);
    setRaw((prev) =>
      prev.map((p) => ((p?.id ?? p?._id) === id ? { ...p, published: next } : p))
    );

    try {
      const res = await fetch(`/api/admins/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ published: next }),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
    } catch (e) {
      // revert
      setRaw((prev) =>
        prev.map((p) => ((p?.id ?? p?._id) === id ? { ...p, published: !next } : p))
      );
      alert(e?.message || "Failed to update");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="text-center py-5">Loading blogs…</div>;
  if (error) return <div className="text-center text-danger py-5">Failed to load: {error}</div>;

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          <th scope="col">View</th>
          <th scope="col">Action</th>
        </tr>
      </thead>

      <tbody className="t-body">
        {paged.map((p) => {
          const id = p?.id ?? p?._id;
          const slug = p?.slug;
          const img = thumbFrom(p);
          const when = p?.publishedAt || p?.createdAt;
          const created = fmtDate(when);
          const isPublished = !!p?.published;

          const uniqueTags = (() => {
            const bucket = [];
            if (Array.isArray(p?.tags)) bucket.push(...p.tags);
            if (typeof p?.tags === "string") bucket.push(p.tags);
            if (p?.tag) bucket.push(p.tag);
            if (p?.tagsCsv) bucket.push(...String(p.tagsCsv).split(","));
            if (p?.category) bucket.push(p.category);
            return Array.from(new Set(bucket.map((s) => String(s).trim()).filter(Boolean)));
          })();

          return (
            <tr key={id}>
              <th scope="row">
                <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                  <div className="list-thumb">
                    <SafeThumb src={img} alt={p?.title || "blog"} width={110} height={94} />
                  </div>
                  <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                    <div className="h6 list-title">
                      <Link href={slug ? `/blogs/${slug}` : `/blogs/${id}`}>
                        {p?.title || "Untitled post"}
                      </Link>
                    </div>

                    {uniqueTags.length > 0 && (
                      <p className="list-text mb-0">
                        {uniqueTags.slice(0, 4).map((t, i) => (
                          <span key={`${t}-${i}`} className="badge bg-light text-dark border me-1">
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              </th>

              <td className="vam">{created}</td>

              <td className="vam">
                <span className={statusPill(isPublished)}>
                  {isPublished ? "Published" : "Draft"}
                </span>
              </td>

              <td className="vam">
                <Link className="ud-btn btn-light" href={slug ? `/blogs/${slug}` : `/blogs/${id}`}>
                  View
                </Link>
              </td>

              <td className="vam">
                <div className="d-flex gap-2">
                  <button
                    className="ud-btn btn-light"
                    type="button"
                    onClick={() => togglePublish(p)}
                    disabled={savingId === id}
                  >
                    {savingId === id ? "Saving…" : isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button className="ud-btn btn-light" type="button" onClick={() => onDelete(id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>

      <style jsx>{`
        .list-thumb img {
          object-fit: cover;
          border-radius: 8px;
        }
      `}</style>
    </table>
  );
};

export default BlogDataTable;
