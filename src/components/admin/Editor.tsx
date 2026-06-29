"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState, useEffect } from "react";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

function ToolbarBtn({
  label,
  active,
  onAction,
  ariaLabel,
}: {
  label: React.ReactNode;
  active?: boolean;
  onAction: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onMouseDown={(e) => {
        e.preventDefault();
        onAction();
      }}
      className={`
        min-w-[32px] h-8 px-2.5 rounded text-sm font-semibold
        transition-all duration-100 select-none cursor-pointer
        flex items-center justify-center
        ${
          active
            ? "bg-burgundy text-white shadow-sm"
            : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
        }
      `}
    >
      {label}
    </button>
  );
}

export default function Editor({ content, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useState(0);
  const [linkPopover, setLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your post…" }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onTransaction() {
      forceUpdate((n) => n + 1);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none min-h-[400px] focus:outline-none px-6 py-5 text-stone-900",
      },
    },
  });

  async function uploadImage(file: File) {
    const res = await fetch(
      `/api/shreenu-editor/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`
    );
    const { uploadUrl, publicUrl } = await res.json();
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    editor?.chain().focus().setImage({ src: publicUrl }).run();
  }

  useEffect(() => {
    if (linkPopover) setTimeout(() => linkInputRef.current?.focus(), 50);
  }, [linkPopover]);

  function applyLink() {
    if (linkUrl) editor?.chain().focus().setLink({ href: linkUrl }).run();
    setLinkPopover(false);
    setLinkUrl("");
  }

  function removeLink() {
    editor?.chain().focus().unsetLink().run();
    setLinkPopover(false);
    setLinkUrl("");
  }

  if (!editor) return null;

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 px-3 py-2 bg-stone-50">

        {/* Text format group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200 mr-2">
          <ToolbarBtn
            label={<span className="font-bold">B</span>}
            ariaLabel="Bold"
            active={editor.isActive("bold")}
            onAction={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarBtn
            label={<span className="italic">I</span>}
            ariaLabel="Italic"
            active={editor.isActive("italic")}
            onAction={() => editor.chain().focus().toggleItalic().run()}
          />
        </div>

        {/* Heading group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200 mr-2">
          <ToolbarBtn
            label="H2"
            ariaLabel="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onAction={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarBtn
            label="H3"
            ariaLabel="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onAction={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />
        </div>

        {/* List group */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-stone-200 mr-2">
          <ToolbarBtn
            label={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
            ariaLabel="Bullet list"
            active={editor.isActive("bulletList")}
            onAction={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarBtn
            label={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            }
            ariaLabel="Ordered list"
            active={editor.isActive("orderedList")}
            onAction={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarBtn
            label={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>
            }
            ariaLabel="Blockquote"
            active={editor.isActive("blockquote")}
            onAction={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </div>

        {/* Link + Image */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            label="Link"
            ariaLabel="Insert link"
            active={editor.isActive("link") || linkPopover}
            onAction={() => {
              if (editor.isActive("link")) {
                removeLink();
              } else {
                setLinkUrl("");
                setLinkPopover((v) => !v);
              }
            }}
          />
          <ToolbarBtn
            label={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5A.75.75 0 0121 5.25v13.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 18.75V5.25A.75.75 0 013.75 4.5z" />
              </svg>
            }
            ariaLabel="Upload image"
            onAction={() => fileInputRef.current?.click()}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Link popover */}
      {linkPopover && (
        <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3 py-2">
          <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink();
              if (e.key === "Escape") { setLinkPopover(false); setLinkUrl(""); }
            }}
            placeholder="https://example.com"
            className="flex-1 text-sm bg-white border border-stone-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
          <button
            type="button"
            onClick={applyLink}
            className="text-sm bg-burgundy text-white px-3 py-1.5 rounded hover:bg-deep-wine transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => { setLinkPopover(false); setLinkUrl(""); }}
            className="text-sm text-stone-400 hover:text-stone-700 px-2 py-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor body */}
      <EditorContent editor={editor} />
    </div>
  );
}
