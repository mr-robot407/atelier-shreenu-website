"use client";

import { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function CoverImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const res = await fetch(
      `/api/shreenu-editor/upload?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`
    );
    const { uploadUrl, publicUrl } = await res.json();
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    onChange(publicUrl);
    setUploading(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  return (
    <div>
      <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">
        Cover Image
      </label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-stone-200">
          <img
            src={value}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center gap-2 transition-colors ${
            dragging
              ? "border-burgundy bg-burgundy/5"
              : "border-stone-200 hover:border-stone-400 bg-stone-50"
          }`}
        >
          {uploading ? (
            <p className="text-sm text-stone-400">Uploading…</p>
          ) : (
            <>
              <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-stone-400">
                Drag & drop or <span className="text-burgundy font-medium">browse</span>
              </p>
              <p className="text-xs text-stone-300">JPG, PNG, WebP</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
