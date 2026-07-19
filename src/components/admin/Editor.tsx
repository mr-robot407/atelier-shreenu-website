"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { useRef, useState, useCallback } from "react";

// Augment only the commands that aren't already declared by the extension packages
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontFamily: { setFontFamily: (font: string) => ReturnType; unsetFontFamily: () => ReturnType };
  }
}

type Props = {
  content: string;
  onChange: (html: string) => void;
};

const BRAND_FONTS = [
  { label: "Default",             value: ""                    },
  { label: "Cormorant Garamond",  value: "Cormorant Garamond"  },
  { label: "Jost",                value: "Jost"                },
];

const IMAGE_SIZES = [
  { label: "S",    value: "25%",  aria: "Small (25%)"       },
  { label: "M",    value: "50%",  aria: "Medium (50%)"      },
  { label: "L",    value: "75%",  aria: "Large (75%)"       },
  { label: "100%", value: "100%", aria: "Full width (100%)" },
];

// ── Shared toolbar button ──────────────────────────────────────────────────
function Btn({
  label, active, onAction, ariaLabel, title,
}: {
  label: React.ReactNode;
  active?: boolean;
  onAction: () => void;
  ariaLabel?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onAction(); }}
      className={`min-w-[30px] h-8 px-2 rounded text-sm font-semibold transition-all duration-100 select-none cursor-pointer flex items-center justify-center ${
        active
          ? "bg-burgundy text-white shadow-sm"
          : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
      }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-stone-200 mx-1 shrink-0" />;
}

export default function Editor({ content, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<{ from: number; to: number } | null>(null);
  const fontSelection = useRef<{ from: number; to: number } | null>(null);
  const [, forceUpdate] = useState(0);
  const [linkPopover, setLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            "data-align": {
              default: "none",
              parseHTML: (el) => el.getAttribute("data-align") ?? "none",
              renderHTML: (attrs) =>
                attrs["data-align"] && attrs["data-align"] !== "none"
                  ? { "data-align": attrs["data-align"] }
                  : {},
            },
            "data-width": {
              default: "100%",
              parseHTML: (el) => el.getAttribute("data-width") ?? "100%",
              renderHTML: (attrs) => ({
                "data-width": attrs["data-width"] ?? "100%",
                style: `width: ${attrs["data-width"] ?? "100%"}`,
              }),
            },
          };
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "Write your post…" }),
    ],
    content,
    onUpdate({ editor }) { onChange(editor.getHTML()); },
    onTransaction() { forceUpdate((n) => n + 1); },
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none min-h-[400px] focus:outline-none px-6 py-5 text-stone-900 " +
          "[&_img[data-align=left]]:float-left [&_img[data-align=left]]:mr-6 " +
          "[&_img[data-align=right]]:float-right [&_img[data-align=right]]:ml-6 " +
          "[&_img[data-align=center]]:mx-auto [&_img[data-align=center]]:block",
      },
    },
  });

  // ── Upload ────────────────────────────────────────────────────────────────
  async function uploadImage(file: File) {
    const res = await fetch(
      `/api/shreenu-editor/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`
    );
    const { uploadUrl, publicUrl } = await res.json();
    await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    editor?.chain().focus().setImage({ src: publicUrl }).run();
  }

  // ── Link popover ──────────────────────────────────────────────────────────
  const openLinkPopover = useCallback(() => {
    if (editor) {
      const { from, to } = editor.state.selection;
      savedSelection.current = { from, to };
    }
    setLinkUrl(editor?.getAttributes("link").href ?? "");
    setLinkPopover(true);
    setTimeout(() => linkInputRef.current?.focus(), 50);
  }, [editor]);

  function applyLink() {
    if (!editor) return;
    if (linkUrl) {
      const chain = editor.chain().focus();
      if (savedSelection.current) chain.setTextSelection(savedSelection.current);
      chain.setLink({ href: linkUrl }).run();
    }
    setLinkPopover(false);
    setLinkUrl("");
    savedSelection.current = null;
  }

  function removeLink() {
    editor?.chain().focus().unsetLink().run();
    setLinkPopover(false);
    setLinkUrl("");
    savedSelection.current = null;
  }

  // ── Case transform ────────────────────────────────────────────────────────
  function transformCase(mode: "upper" | "lower" | "title") {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;
    const text = editor.state.doc.textBetween(from, to);
    const transformed =
      mode === "upper" ? text.toUpperCase()
      : mode === "lower" ? text.toLowerCase()
      : text.replace(/\b\w/g, (c) => c.toUpperCase());
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(transformed)
      .run();
  }

  // ── Image controls ────────────────────────────────────────────────────────
  function setImageAlign(align: "left" | "center" | "right" | "none") {
    editor?.chain().focus().updateAttributes("image", { "data-align": align }).run();
  }
  function setImageWidth(width: string) {
    editor?.chain().focus().updateAttributes("image", { "data-width": width }).run();
  }

  const isImageSelected = editor?.isActive("image") ?? false;
  const currentWidth   = editor?.getAttributes("image")["data-width"] ?? "100%";
  const currentAlign   = editor?.getAttributes("image")["data-align"] ?? "none";
  const currentFont    = editor?.getAttributes("textStyle").fontFamily ?? "";

  // Alignment: read from whichever block node is active
  const currentTextAlign: string =
    editor?.getAttributes("heading").textAlign ??
    editor?.getAttributes("paragraph").textAlign ??
    "left";

  if (!editor) return null;

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 px-3 py-2 bg-stone-50">

        {/* Font family — brand only */}
        <select
          value={currentFont}
          onMouseDown={() => {
            // Save selection before dropdown steals focus
            if (editor) {
              const { from, to } = editor.state.selection;
              fontSelection.current = { from, to };
            }
          }}
          onChange={(e) => {
            const val = e.target.value;
            // Restore selection, then apply font
            editor.commands.focus();
            if (fontSelection.current) {
              editor.commands.setTextSelection(fontSelection.current);
            }
            if (val === "") {
              editor.commands.unsetFontFamily();
            } else {
              editor.commands.setFontFamily(val);
            }
            fontSelection.current = null;
          }}
          className="h-8 text-[12px] text-stone-700 border border-stone-200 rounded px-2 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-burgundy hover:border-stone-400 transition-colors mr-1"
          title="Font family"
        >
          {BRAND_FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <Divider />

        {/* Bold / Italic */}
        <Btn label={<span className="font-bold">B</span>}   ariaLabel="Bold"   active={editor.isActive("bold")}   onAction={() => editor.chain().focus().toggleBold().run()} />
        <Btn label={<span className="italic">I</span>}      ariaLabel="Italic" active={editor.isActive("italic")} onAction={() => editor.chain().focus().toggleItalic().run()} />

        <Divider />

        {/* Headings */}
        <Btn label="H2" ariaLabel="Heading 2" active={editor.isActive("heading", { level: 2 })} onAction={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <Btn label="H3" ariaLabel="Heading 3" active={editor.isActive("heading", { level: 3 })} onAction={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />

        <Divider />

        {/* Paragraph alignment */}
        <Btn
          title="Align left"   ariaLabel="Align left"
          active={currentTextAlign === "left"}
          onAction={() => { editor.commands.focus(); editor.commands.setTextAlign("left"); }}
          label={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/></svg>}
        />
        <Btn
          title="Align center" ariaLabel="Align center"
          active={currentTextAlign === "center"}
          onAction={() => { editor.commands.focus(); editor.commands.setTextAlign("center"); }}
          label={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z"/></svg>}
        />
        <Btn
          title="Align right"  ariaLabel="Align right"
          active={currentTextAlign === "right"}
          onAction={() => { editor.commands.focus(); editor.commands.setTextAlign("right"); }}
          label={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/></svg>}
        />
        <Btn
          title="Justify"      ariaLabel="Justify"
          active={currentTextAlign === "justify"}
          onAction={() => { editor.commands.focus(); editor.commands.setTextAlign("justify"); }}
          label={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/></svg>}
        />

        <Divider />

        {/* tT — Case transform */}
        <div className="relative flex items-center gap-0.5">
          <Btn
            title="UPPERCASE"
            ariaLabel="Uppercase"
            onAction={() => transformCase("upper")}
            label={<span className="text-[11px] font-bold tracking-wide">AA</span>}
          />
          <Btn
            title="lowercase"
            ariaLabel="Lowercase"
            onAction={() => transformCase("lower")}
            label={<span className="text-[11px]">aa</span>}
          />
          <Btn
            title="Title Case"
            ariaLabel="Title case"
            onAction={() => transformCase("title")}
            label={
              <span className="text-[12px] font-semibold leading-none">
                T<span className="text-[9px] align-baseline">t</span>
              </span>
            }
          />
        </div>

        <Divider />

        {/* Lists + Blockquote */}
        <Btn
          ariaLabel="Bullet list"
          active={editor.isActive("bulletList")}
          onAction={() => editor.chain().focus().toggleBulletList().run()}
          label={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          }
        />
        <Btn
          ariaLabel="Ordered list"
          active={editor.isActive("orderedList")}
          onAction={() => editor.chain().focus().toggleOrderedList().run()}
          label={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          }
        />
        <Btn
          ariaLabel="Blockquote"
          active={editor.isActive("blockquote")}
          onAction={() => editor.chain().focus().toggleBlockquote().run()}
          label={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          }
        />

        <Divider />

        {/* Link + Image upload */}
        <Btn
          label="Link"
          ariaLabel="Insert link"
          active={editor.isActive("link") || linkPopover}
          onAction={() => { if (editor.isActive("link")) removeLink(); else openLinkPopover(); }}
        />
        <Btn
          ariaLabel="Upload image"
          onAction={() => fileInputRef.current?.click()}
          label={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5A.75.75 0 0121 5.25v13.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 18.75V5.25A.75.75 0 013.75 4.5z"/>
            </svg>
          }
        />

        {/* Image controls — appear only when image selected */}
        {isImageSelected && (
          <>
            <Divider />
            {/* Image alignment */}
            <Btn ariaLabel="Image left"   active={currentAlign === "left"}   onAction={() => setImageAlign("left")}
              label={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/></svg>} />
            <Btn ariaLabel="Image center" active={currentAlign === "center"} onAction={() => setImageAlign("center")}
              label={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z"/></svg>} />
            <Btn ariaLabel="Image right"  active={currentAlign === "right"}  onAction={() => setImageAlign("right")}
              label={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/></svg>} />
            <Divider />
            {/* Image size */}
            <span className="text-[10px] uppercase tracking-wider text-stone-400 ml-1 mr-0.5 select-none">Size</span>
            {IMAGE_SIZES.map((s) => (
              <Btn key={s.value} label={s.label} ariaLabel={s.aria}
                active={currentWidth === s.value}
                onAction={() => setImageWidth(s.value)} />
            ))}
          </>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
      </div>

      {/* ── Link popover ────────────────────────────────────────────────── */}
      {linkPopover && (
        <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-3 py-2">
          <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          <input ref={linkInputRef} type="url" value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") { setLinkPopover(false); setLinkUrl(""); } }}
            placeholder="https://example.com"
            className="flex-1 text-sm bg-white border border-stone-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
          <button type="button" onMouseDown={(e) => { e.preventDefault(); applyLink(); }}
            className="text-sm bg-burgundy text-white px-3 py-1.5 rounded hover:bg-deep-wine transition-colors">
            Apply
          </button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); setLinkPopover(false); setLinkUrl(""); }}
            className="text-sm text-stone-400 hover:text-stone-700 px-2 py-1.5">
            ✕
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
