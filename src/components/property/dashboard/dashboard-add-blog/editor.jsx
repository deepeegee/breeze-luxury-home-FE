'use client';
import React, { useCallback, useMemo, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Dropcursor from '@tiptap/extension-dropcursor';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import styles from "./Editor.module.css";


export default function Editor({
  initialHTML = '',
  onChange,
  onAddImage,
  className = '',
  maxChars = 20000, // status bar limit (optional)
}) {
  if (typeof window === 'undefined') return null;

  const fileInputRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: true,
        dropcursor: false,
      }),
      Underline,
      Typography,
      Link.configure({
        autolink: true,
        openOnClick: true,
        linkOnPaste: true,
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Tell your story…' }),
      Dropcursor.configure({ color: '#999', width: 2 }),
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount.configure({
        limit: typeof maxChars === 'number' ? maxChars : undefined,
      }),
    ],
    content: initialHTML || '<p></p>',
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'tt-editor prose prose-lg bg-white border rounded-3 px-3 py-3 w-100',
      },
      handlePaste(view, event) {
        if (!onAddImage) return false;
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type?.startsWith?.('image/')) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              insertLocalImage(file);
              return true;
            }
          }
        }
        return false;
      },
      handleDrop(_view, event, _slice, moved) {
        if (moved || !onAddImage) return false;
        const dt = event.dataTransfer;
        if (!dt?.files?.length) return false;
        const file = dt.files[0];
        if (file && file.type.startsWith('image/')) {
          event.preventDefault();
          insertLocalImage(file);
          return true;
        }
        return false;
      },
    },
  });

  const insertLocalImage = useCallback(
    async (file) => {
      if (!editor || !onAddImage) return;
      const { previewUrl, localId } = await onAddImage(file);
      editor
        .chain()
        .focus()
        .setImage({ src: previewUrl, alt: file.name, 'data-local-id': localId })
        .run();
    },
    [editor, onAddImage]
  );

  const openImagePicker = () => fileInputRef.current?.click();

  const groups = useMemo(
    () => [
      [
        {
          label: 'H1',
          isActive: () => editor?.isActive('heading', { level: 1 }),
          onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
          title: 'Heading 1',
        },
        {
          label: 'H2',
          isActive: () => editor?.isActive('heading', { level: 2 }),
          onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          title: 'Heading 2',
        },
        {
          label: 'H3',
          isActive: () => editor?.isActive('heading', { level: 3 }),
          onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
          title: 'Heading 3',
        },
      ],
      [
        {
          icon: 'bold',
          isActive: () => editor?.isActive('bold'),
          onClick: () => editor?.chain().focus().toggleBold().run(),
          title: 'Bold',
        },
        {
          icon: 'italic',
          isActive: () => editor?.isActive('italic'),
          onClick: () => editor?.chain().focus().toggleItalic().run(),
          title: 'Italic',
        },
        {
          icon: 'underline',
          isActive: () => editor?.isActive('underline'),
          onClick: () => editor?.chain().focus().toggleUnderline().run(),
          title: 'Underline',
        },
        {
          icon: 'strikethrough',
          isActive: () => editor?.isActive('strike'),
          onClick: () => editor?.chain().focus().toggleStrike().run(),
          title: 'Strikethrough',
        },
        {
          icon: 'highlighter',
          isActive: () => editor?.isActive('highlight'),
          onClick: () => editor?.chain().focus().toggleHighlight().run(),
          title: 'Highlight',
        },
      ],
      [
        {
          label: '•',
          isActive: () => editor?.isActive('bulletList'),
          onClick: () => editor?.chain().focus().toggleBulletList().run(),
          title: 'Bullet list',
        },
        {
          label: '1.',
          isActive: () => editor?.isActive('orderedList'),
          onClick: () => editor?.chain().focus().toggleOrderedList().run(),
          title: 'Numbered list',
        },
        {
          icon: 'quote-left',
          isActive: () => editor?.isActive('blockquote'),
          onClick: () => editor?.chain().focus().toggleBlockquote().run(),
          title: 'Blockquote',
        },
        {
          icon: 'code',
          isActive: () => editor?.isActive('codeBlock'),
          onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
          title: 'Code block',
        },
        {
          label: '—',
          isActive: () => false,
          onClick: () => editor?.chain().focus().setHorizontalRule().run(),
          title: 'Horizontal rule',
        },
      ],
      [
        {
          icon: 'align-left',
          isActive: () => editor?.isActive({ textAlign: 'left' }),
          onClick: () => editor?.chain().focus().setTextAlign('left').run(),
          title: 'Align left',
        },
        {
          icon: 'align-center',
          isActive: () => editor?.isActive({ textAlign: 'center' }),
          onClick: () => editor?.chain().focus().setTextAlign('center').run(),
          title: 'Align center',
        },
        {
          icon: 'align-right',
          isActive: () => editor?.isActive({ textAlign: 'right' }),
          onClick: () => editor?.chain().focus().setTextAlign('right').run(),
          title: 'Align right',
        },
        {
          icon: 'align-justify',
          isActive: () => editor?.isActive({ textAlign: 'justify' }),
          onClick: () => editor?.chain().focus().setTextAlign('justify').run(),
          title: 'Justify',
        },
      ],
    ],
    [editor]
  );

  if (!editor) return null;

  return (
    <div className={`tt-wrap ${className}`}>
      {/* Toolbar */}
      <div className="tt-toolbar border rounded-3 bg-white d-flex align-items-center flex-wrap gap-2 p-2 mb-3">
        {groups.map((btns, i) => (
          <div key={i} className="d-flex align-items-center gap-1 me-2">
            {btns.map((b, j) => (
              <button
                key={j}
                type="button"
                title={b.title}
                onClick={b.onClick}
                className={`tt-btn ${b.isActive?.() ? 'is-active' : ''}`}
              >
                {'icon' in b ? <i className={`far fa-${b.icon}`} /> : <span>{b.label}</span>}
              </button>
            ))}
            {i < groups.length - 1 && <div className="tt-sep" />}
          </div>
        ))}

        {/* Link */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button
            type="button"
            className={`tt-btn ${editor.isActive('link') ? 'is-active' : ''}`}
            title="Insert link"
            onClick={() => {
              const prev = editor.getAttributes('link')?.href || '';
              const href = window.prompt('Enter URL', prev || 'https://');
              if (!href) {
                editor.chain().focus().unsetLink().run();
              } else {
                editor.chain().focus().extendMarkRange('link').setLink({ href, target: '_blank' }).run();
              }
            }}
          >
            <i className="far fa-link" />
          </button>
          <button
            type="button"
            className="tt-btn"
            title="Remove link"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <i className="far fa-unlink" />
          </button>
          <div className="tt-sep" />
        </div>

        {/* Image */}
        <div className="d-flex align-items-center gap-1 me-2">
          <button type="button" className="tt-btn" title="Insert image" onClick={() => fileInputRef.current?.click()}>
            <i className="far fa-image" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                await insertLocalImage(file);
                e.currentTarget.value = '';
              }
            }}
          />
          <div className="tt-sep" />
        </div>

        {/* Undo/Redo on the right */}
        <div className="ms-auto d-flex align-items-center gap-1">
          <button type="button" className="tt-btn" title="Undo" onClick={() => editor.chain().focus().undo().run()}>
            <i className="far fa-rotate-left" />
          </button>
          <button type="button" className="tt-btn" title="Redo" onClick={() => editor.chain().focus().redo().run()}>
            <i className="far fa-rotate-right" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Status bar */}
      <div className="tt-status small text-muted d-flex align-items-center justify-content-between mt-2">
        <div>
          <strong>{editor.storage.characterCount.words()}</strong> words ·{' '}
          <span>{editor.storage.characterCount.characters()}</span>
          {typeof maxChars === 'number' ? ` / ${maxChars}` : ''}
        </div>
        <div className="opacity-75">Tip: paste or drag images, or use the image button</div>
      </div>
    </div>
  );
}
