"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

/* Tiptap core & extensions */
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";

/* UI primitives from the template */
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

/* Template nodes & styles */
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

/* Template UI bits */
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

/* Upload helper (fallback) */
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

/* Base styles */
import "@/components/tiptap-templates/simple/simple-editor.scss";

/* ---------- Toolbar content (single line on desktop) ---------- */
const MainToolbarContent = () => (
  <>
    <Spacer />
    <ToolbarGroup>
      <UndoRedoButton action="undo" />
      <UndoRedoButton action="redo" />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
      <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
      <BlockquoteButton />
      <CodeBlockButton />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <MarkButton type="bold" />
      <MarkButton type="italic" />
      <MarkButton type="strike" />
      <MarkButton type="code" />
      <MarkButton type="underline" />
      <ColorHighlightPopover />
      <LinkPopover />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <MarkButton type="superscript" />
      <MarkButton type="subscript" />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <TextAlignButton align="left" />
      <TextAlignButton align="center" />
      <TextAlignButton align="right" />
      <TextAlignButton align="justify" />
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup>
      <ImageUploadButton text="Add" />
    </ToolbarGroup>
    <Spacer />
  </>
);

/* ---- small util: prefix bare links with https:// and set target/rel ---- */
function normalizeLinks(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const anchors = doc.querySelectorAll("a[href]");
    anchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      // ignore hashes, mailto, tel, absolute http(s), and root/relative paths starting with /
      const isAbsolute =
        /^(https?:|mailto:|tel:|#)/i.test(href) || href.startsWith("/");
      if (!isAbsolute) {
        a.setAttribute("href", `https://${href}`);
      }
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
    return doc.body.innerHTML || html;
  } catch {
    return html;
  }
}

function SimpleEditor({
  initialHTML = "",
  onChange,
  onAddImage,   // your compression/FormData pipeline
  className = "",
}) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area",
        class: `simple-editor ${className || ""}`.trim(),
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
      }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 10,
        upload: async (file) => {
          // IMPORTANT: must return a STRING URL, not an object
          if (typeof onAddImage === "function") {
            const { previewUrl } = await onAddImage(file);
            return previewUrl; // <-- string
          }
          const result = await handleImageUpload(file);
          return typeof result === "string" ? result : (result?.url ?? "");
        },
        onError: (err) => console.error("Image upload failed:", err),
      }),
    ],
    content: initialHTML || "<p></p>",
    onUpdate({ editor }) {
      const raw = editor.getHTML();
      const normalized = normalizeLinks(raw);
      onChange?.(normalized);
    },
  });

  return (
    <div className="simple-editor-wrapper simple-editor-force-light">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar>
          <MainToolbarContent />
        </Toolbar>
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
      </EditorContext.Provider>

      {/* Styles – single line toolbar on desktop, wrap on small screens, light theme */}
      <style jsx global>{`
        .simple-editor-wrapper,
        .simple-editor-content,
        .simple-editor {
          width: 100%;
          max-width: 100%;
        }
        .simple-editor-wrapper {
          padding-right: 4px;
        }
        .simple-editor-content {
          overflow-x: hidden;
        }

        .simple-editor-force-light,
        .simple-editor-force-light .ProseMirror {
          background: #ffffff !important;
          color: #111111 !important;
        }
        .simple-editor-force-light .ProseMirror a {
          color: #0d6efd !important;
        }

        .simple-editor-wrapper .tiptap-toolbar,
        .simple-editor-wrapper .toolbar {
          position: static !important;
          inset: auto !important;
          transform: none !important;

          width: 100%;
          max-width: 100%;
          padding: 8px 12px;
          gap: 8px;

          display: flex;
          white-space: nowrap;   /* single line by default */
          flex-wrap: nowrap;
          overflow: visible;

          background: #ffffff !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          margin-bottom: 12px;
          box-shadow: none !important;
        }

        @media (max-width: 991.98px) {
          .simple-editor-wrapper .toolbar {
            flex-wrap: wrap;     /* wrap only on small screens */
            white-space: normal;
            row-gap: 10px;
          }
        }

        .simple-editor-wrapper .tiptap-button,
        .simple-editor-wrapper .toolbar button,
        .simple-editor-wrapper .toolbar [role="button"] {
          color: #111 !important;
          background: #fff !important;
          border-color: #e5e7eb !important;
          padding: 6px 8px;
        }
        .simple-editor-wrapper .tiptap-button .tiptap-button-icon,
        .simple-editor-wrapper .toolbar svg {
          color: #111 !important;
          fill: #111 !important;
          stroke: #111 !important;
        }

        .simple-editor-wrapper [class*="overlay"],
        .simple-editor-wrapper [data-portal="true"],
        .simple-editor-wrapper .tiptap-toolbar--mobile,
        .simple-editor-wrapper .toolbar--overlay {
          display: none !important;
        }

        .simple-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default SimpleEditor;
