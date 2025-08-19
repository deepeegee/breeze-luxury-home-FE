"use client";
import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useUploadListingPhoto } from "@/lib/useApi";

/* ---------- helpers ---------- */

function extractUrl(raw, xhr) {
  try {
    if (typeof raw === "string") {
      const s = raw.trim();
      if (/^https?:\/\//i.test(s)) return s;
      try { return extractUrl(JSON.parse(s), xhr); } catch {}
    }
    if (raw && typeof raw === "object") {
      const candidates = [
        raw.url,
        raw.logo,                  // ✅ support { logo: "https://..." }
        raw.fileUrl,
        raw.secure_url,
        raw.Location,
        raw.location,
        raw?.data?.url,
        raw?.data?.logo,          // ✅ nested
        raw?.data?.fileUrl,
        raw?.data?.secure_url,
        raw?.result?.url,
      ];
      for (const c of candidates) {
        if (typeof c === "string" && /^https?:\/\//i.test(c)) return c;
      }
      if (Array.isArray(raw.photos) && raw.photos[0]?.url) return raw.photos[0].url;
    }
    if (Array.isArray(raw)) {
      const first = raw.find(
        (x) => (typeof x === "string" && /^https?:\/\//i.test(x)) || x?.url || x?.logo
      );
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
      if (first?.logo) return first.logo;
      if (raw[0]?.data?.url) return raw[0].data.url;
      if (raw[0]?.data?.logo) return raw[0].data.logo;
    }
    const fromHeader =
      xhr?.getResponseHeader?.("Location") || xhr?.getResponseHeader?.("X-File-Url");
    if (fromHeader && /^https?:\/\//i.test(fromHeader)) return fromHeader;
  } catch {}
  return null;
}

function xhrUploadWithProgress({ url, file, onProgress }) {
  const tryFields = ["file", "image", "photo", "upload", "picture"];
  return new Promise(async (resolve, reject) => {
    let lastErr = null;
    for (const field of tryFields) {
      try {
        const result = await new Promise((res, rej) => {
          const form = new FormData();
          form.append(field, file);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", url);
          xhr.withCredentials = true;
          xhr.responseType = "json";

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && typeof onProgress === "function") {
              const pct = Math.round((e.loaded / e.total) * 100);
              onProgress(pct);
            }
          };

          xhr.onload = () => {
            const ok = xhr.status >= 200 && xhr.status < 300;
            if (!ok) return rej(new Error(`HTTP ${xhr.status}: ${xhr.statusText || "Upload failed"}`));
            const raw =
              xhr.response ??
              (() => { try { return JSON.parse(xhr.responseText); } catch { return xhr.responseText; } })();
            const urlNorm = extractUrl(raw, xhr);
            if (!urlNorm) {
              console.debug("Upload response (unparsed):", { raw, headers: xhr.getAllResponseHeaders?.() });
              return rej(new Error("No URL returned"));
            }
            res({ url: urlNorm });
          };

          xhr.onerror = () => rej(new Error("Network error"));
          xhr.send(form);
        });
        return resolve(result);
      } catch (e) { lastErr = e; }
    }
    reject(lastErr || new Error("Upload failed"));
  });
}

/* ---------- component ---------- */

const UploadPhotoGallery = () => {
  // Photos posted back to parent form
  const [photos, setPhotos] = useState([]); // [{ url, isFeatured?, taskId? }]
  // Upload tasks shown in the queue
  const [tasks, setTasks] = useState([]);   // [{ id, fileName, status, progress, startedAt, completedAt, durationMs, url?, error?, file }]
  const fileInputRef = useRef(null);

  const { trigger: uploadFileFallback } = useUploadListingPhoto();

  const anyUploading   = useMemo(() => tasks.some((t) => t.status === "uploading"), [tasks]);
  const uploadedCount  = useMemo(() => tasks.filter((t) => t.status === "done").length, [tasks]);
  const errorCount     = useMemo(() => tasks.filter((t) => t.status === "error").length, [tasks]);
  const totalCount     = tasks.length;

  const formatMs = (ms) => {
    if (ms == null) return "";
    if (ms < 1000) return `${ms} ms`;
    const s = ms / 1000;
    return `${s.toFixed(s < 10 ? 2 : 1)} s`;
  };

  const setFeatured = (index) => {
    setPhotos((prev) => prev.map((p, i) => ({ ...p, isFeatured: i === index })));
  };

  // 🔧 When a thumbnail is deleted:
  // - remove it from `photos`
  // - remove the matching task from `tasks` (so the queue row & counters update)
  const handleDelete = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);

      // if featured removed, promote first remaining
      if (removed?.isFeatured && next.length > 0) next[0].isFeatured = true;

      // also remove the matching task (by taskId or url)
      setTasks((prevTasks) =>
        prevTasks.filter(
          (t) =>
            (removed?.taskId && t.id !== removed.taskId) ||
            (!removed?.taskId && removed?.url && t.url !== removed.url)
        )
      );

      return next;
    });
  };

  async function handleUpload(fileList) {
    if (!fileList || fileList.length === 0) return;

    const batch = Array.from(fileList).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fileName: file.name,
      status: "queued",
      progress: 0,
      startedAt: null,
      completedAt: null,
      durationMs: null,
      url: null,
      error: null,
      file,
    }));

    setTasks((prev) => [...prev, ...batch]);

    await Promise.allSettled(
      batch.map(async (task) => {
        const startedAt = Date.now();
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: "uploading", startedAt } : t))
        );

        try {
          // 1) XHR with progress
          const { url } = await xhrUploadWithProgress({
            url: "/api/properties/photo",
            file: task.file,
            onProgress: (pct) =>
              setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, progress: pct } : t))
              ),
          });

          const completedAt = Date.now();
          const durationMs = completedAt - startedAt;

          setTasks((prev) =>
            prev.map((t) =>
              t.id === task.id ? { ...t, status: "done", progress: 100, completedAt, durationMs, url } : t
            )
          );

          setPhotos((prev) => {
            const next = [...prev, { url, taskId: task.id }];   // ✅ remember which task created this photo
            if (prev.length === 0 && next.length > 0) next[0].isFeatured = true;
            return next;
          });

          return;
        } catch (err) {
          // 2) fallback helper (no progress)
          try {
            const res = await uploadFileFallback(task.file);
            const fallbackUrl =
              res?.url ||
              res?.logo ||              // ✅ accept { logo: "..." }
              res?.data?.url ||
              res?.data?.logo ||
              res?.Location ||
              res?.location ||
              res?.fileUrl ||
              res?.secure_url ||
              null;

            if (!fallbackUrl) throw new Error("No URL returned (fallback)");

            const completedAt = Date.now();
            const durationMs = completedAt - startedAt;

            setTasks((prev) =>
              prev.map((t) =>
                t.id === task.id
                  ? { ...t, status: "done", progress: 100, completedAt, durationMs, url: fallbackUrl }
                  : t
              )
            );

            setPhotos((prev) => {
              const next = [...prev, { url: fallbackUrl, taskId: task.id }]; // ✅ keep taskId
              if (prev.length === 0 && next.length > 0) next[0].isFeatured = true;
              return next;
            });
          } catch (fallbackErr) {
            const completedAt = Date.now();
            const durationMs = completedAt - startedAt;
            setTasks((prev) =>
              prev.map((t) =>
                t.id === task.id
                  ? { ...t, status: "error", completedAt, durationMs, error: fallbackErr?.message || "Upload failed" }
                  : t
              )
            );
            console.error("Upload failed:", task.fileName, err);
          }
        }
      })
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleDrop = (e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); };
  const handleDragOver = (e) => e.preventDefault();
  const handleButtonClick = () => fileInputRef.current?.click();

  return (
    <>
      {/* Hidden field collected by parent form */}
      <input type="hidden" name="photos" value={JSON.stringify(photos)} readOnly />

      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb20 px-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="icon mb20">
          <span className="flaticon-upload" />
        </div>
        <h4 className="title fz17 mb10">Upload/Drag photos of your property</h4>
        <p className="text mb20">JPEG/PNG, at least 2048×768. You can select multiple images.</p>

        <div className="d-flex align-items-center justify-content-center gap-2 mb10">
          <button type="button" className="ud-btn btn-white" onClick={handleButtonClick} disabled={anyUploading}>
            {anyUploading ? "Uploading…" : "Browse Files"}
          </button>
          {totalCount > 0 && (
            <span className="text-muted fz14">
              {uploadedCount} uploaded{errorCount ? ` • ${errorCount} failed` : ""} / {totalCount} total
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {/* Upload queue */}
      {tasks.length > 0 && (
        <div className="mb20">
          <div className="bdr1 bdrs12 p15 bgc-f7">
            <strong className="fz14 d-block mb10">Uploads</strong>
            <ul className="list-unstyled mb-0">
              {tasks.map((t, i) => (
                <li key={t.id} className="py-2">
                  <div className="d-flex justify-content-between align-items-center mb5">
                    <div className="fz12 text-muted">Image {i + 1}:</div>
                    <div className="fz12 text-truncate" style={{ maxWidth: 260 }}>{t.fileName}</div>
                    <div className="fz12">
                      {t.status === "done" && (
                        <span className="badge bg-success-subtle text-success-emphasis">
                          Completed in {formatMs(t.durationMs)}
                        </span>
                      )}
                      {t.status === "uploading" && (
                        <span className="badge bg-warning-subtle text-warning-emphasis">{t.progress}%…</span>
                      )}
                      {t.status === "error" && (
                        <span className="badge bg-danger-subtle text-danger-emphasis">
                          Failed in {formatMs(t.durationMs)} — {t.error}
                        </span>
                      )}
                      {t.status === "queued" && (
                        <span className="badge bg-secondary-subtle text-secondary-emphasis">Queued</span>
                      )}
                    </div>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div
                      className={`progress-bar ${t.status === "error" ? "bg-danger" : ""}`}
                      role="progressbar"
                      style={{ width: `${t.status === "done" ? 100 : t.progress}%` }}
                      aria-valuenow={t.status === "done" ? 100 : t.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Thumbnails */}
      <div className="row profile-box position-relative d-md-flex align-items-end mb30">
        {photos.map((photo, index) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb20" key={photo.url || index}>
            <div className="profile-img mb10 position-relative">
              <Image width={212} height={194} className="w-100 bdrs12 cover" src={photo.url} alt={`Photo ${index + 1}`} />

              {/* Delete */}
              <button
                style={{ border: "none" }}
                className="tag-del"
                title="Delete Image"
                onClick={() => handleDelete(index)}
                type="button"
                data-tooltip-id={`delete-${index}`}
              >
                <span className="fas fa-trash-can" />
              </button>
              <ReactTooltip id={`delete-${index}`} place="right" content="Delete Image" />

              {/* Featured toggle */}
              <button
                type="button"
                className={`position-absolute top-0 end-0 m-2 btn btn-sm ${
                  photo.isFeatured ? "btn-thm" : "btn-outline-secondary"
                }`}
                onClick={() => setFeatured(index)}
                data-tooltip-id={`featured-${index}`}
                title="Set as Featured"
              >
                <i className="fas fa-star" />
              </button>
              <ReactTooltip id={`featured-${index}`} place="left" content="Set as Featured" />
            </div>

            <div className="text-center fz12">
              <div><strong>Image {index + 1}</strong></div>
              {photo.isFeatured ? <div><strong>Featured</strong></div> : <div>Set as featured</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UploadPhotoGallery;