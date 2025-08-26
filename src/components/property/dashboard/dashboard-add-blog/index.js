'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from './editor';
import { useCreateBlog } from '@/lib/useApi';

function isHtmlEmpty(html) {
  if (!html) return true;
  const txt = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
  return txt.length === 0;
}

const AddBlogContent = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [tags, setTags] = useState('');
  const [headerFile, setHeaderFile] = useState(null);
  const [headerPreview, setHeaderPreview] = useState('');
  const [images, setImages] = useState({});
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const { trigger: createPost, isMutating } = useCreateBlog();

  const makeLocalId = () => 'img_' + Math.random().toString(36).slice(2) + Date.now().toString(36);

  const tagList = useMemo(
    () =>
      tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [tags]
  );

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (isHtmlEmpty(html)) return false;
    return true;
  }, [title, html]);

  async function handleAddInlineImage(file) {
    const localId = makeLocalId();
    setImages((prev) => ({ ...prev, [localId]: file }));
    const previewUrl = URL.createObjectURL(file);
    return { previewUrl, localId };
  }

  function resetForm() {
    setTitle('');
    setHtml('');
    setTags('');
    setImages({});
    if (headerPreview) URL.revokeObjectURL(headerPreview);
    setHeaderFile(null);
    setHeaderPreview('');
    setError('');
    setOk('');
  }

  async function handleSubmit({ publish }) {
    setError('');
    setOk('');

    if (!canSubmit) {
      setError('Please add a title and some content.');
      return;
    }

    try {
      const form = new FormData();
      form.append('title', title.trim());
      form.append('description', html);
      form.append('published', publish ? 'true' : 'false');

      form.append('tagsCsv', tags);
      tagList.forEach((t) => form.append('tags[]', t));

      if (headerFile) {
        form.append('headerImage', headerFile, headerFile.name);
      }

      Object.entries(images).forEach(([localId, file]) => {
        form.append('images', file, file.name);
        form.append('imageLocalIds', localId);
      });

      await createPost(form);
      setOk(publish ? 'Post published!' : 'Draft saved.');

      // 🔁 NEW: always go to blog list after success
      router.replace('/blog-list-v3');
    } catch (e) {
      setError(e?.message || 'Failed to save blog post.');
    }
  }

  return (
    <div className="container pt60 pb60">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="d-flex align-items-center justify-content-between mb20">
            <div className="d-flex gap-2">
              <button className="ud-btn btn-light" onClick={resetForm} type="button" disabled={isMutating}>
                Reset
              </button>
              <button
                className="ud-btn btn-outline-thm"
                onClick={() => handleSubmit({ publish: false })}
                disabled={!canSubmit || isMutating}
                type="button"
              >
                {isMutating ? 'Saving…' : 'Save Draft'}
              </button>
              <button
                className="ud-btn btn-thm"
                onClick={() => handleSubmit({ publish: true })}
                disabled={!canSubmit || isMutating}
                type="button"
              >
                {isMutating ? 'Publishing…' : 'Publish'} <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          </div>

          {(error || ok) && (
            <div className="mb20">
              {error && <div className="alert alert-danger mb-2">{error}</div>}
              {ok && <div className="alert alert-success mb-2">{ok}</div>}
            </div>
          )}

          <div className="row g-4 mb30">
            <div className="col-12 col-lg-8">
              <label className="form-label fw600">Title</label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a compelling title…"
                rows={2}
                className="form-control fz24 fw600"
                style={{ border: 'none', outline: 'none', resize: 'none' }}
              />
            </div>

            <div className="col-12 col-lg-4">
              <label className="form-label fw600">Header Image (optional)</label>
              <div className="border rounded p-3 d-flex flex-column align-items-start">
                {headerPreview ? (
                  <div className="w-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={headerPreview}
                      alt="Header preview"
                      style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    />
                    <div className="mt-2 d-flex gap-2">
                      <button
                        className="ud-btn btn-light"
                        type="button"
                        onClick={() => {
                          if (headerPreview) URL.revokeObjectURL(headerPreview);
                          setHeaderFile(null);
                          setHeaderPreview('');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="ud-btn btn-light mb0" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setHeaderFile(file);
                          setHeaderPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="mb20">
            <label className="form-label fw600">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. market, luxury, design"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            {tagList.length > 0 && (
              <div className="mt-2 d-flex flex-wrap gap-2">
                {tagList.map((t) => (
                  <span key={t} className="badge bg-light text-dark border">{t}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mb30">
            <label className="form-label fw600">Content</label>
            <Editor initialHTML="" onChange={setHtml} onAddImage={handleAddInlineImage} className="mb10" />
            <small className="text-muted">
              Paste, drag & drop, or pick images. They’ll upload with this post on Save/Publish.
            </small>
          </div>

          <div className="d-flex justify-content-end gap-2 mt30">
            <button
              className="ud-btn btn-outline-thm"
              onClick={() => handleSubmit({ publish: false })}
              disabled={!canSubmit || isMutating}
              type="button"
            >
              {isMutating ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              className="ud-btn btn-thm"
              onClick={() => handleSubmit({ publish: true })}
              disabled={!canSubmit || isMutating}
              type="button"
            >
              {isMutating ? 'Publishing…' : 'Publish'} <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlogContent;