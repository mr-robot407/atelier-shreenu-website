"use client";

import { useRef, useState, useEffect } from "react";

type Props = { value: string; onChange: (url: string) => void };

const OUTPUT_W = 1600;
const MIN_CROP = 0.05; // minimum crop dimension as fraction of image
const HS = 10;         // handle size in px

// Crop box in normalised coords (0–1 relative to the displayed image)
type Box = { x: number; y: number; w: number; h: number };
type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "move";

type DragState = {
  handle: Handle;
  startMx: number;
  startMy: number;
  startBox: Box;
  dW: number; // container display width at drag start
  dH: number;
};

const HANDLES: { id: Handle; u: number; v: number; cursor: string }[] = [
  { id: "nw", u: 0,   v: 0,   cursor: "nw-resize" },
  { id: "n",  u: 0.5, v: 0,   cursor: "n-resize"  },
  { id: "ne", u: 1,   v: 0,   cursor: "ne-resize" },
  { id: "e",  u: 1,   v: 0.5, cursor: "e-resize"  },
  { id: "se", u: 1,   v: 1,   cursor: "se-resize" },
  { id: "s",  u: 0.5, v: 1,   cursor: "s-resize"  },
  { id: "sw", u: 0,   v: 1,   cursor: "sw-resize" },
  { id: "w",  u: 0,   v: 0.5, cursor: "w-resize"  },
];

function c01(v: number) { return Math.max(0, Math.min(1, v)); }

function applyDrag(drag: DragState, mx: number, my: number): Box {
  const { handle, startMx, startMy, startBox, dW, dH } = drag;
  const dx = (mx - startMx) / dW;
  const dy = (my - startMy) / dH;
  let { x, y, w, h } = startBox;
  const r = x + w, b = y + h;

  switch (handle) {
    case "move":
      x = c01(x + dx); x = Math.min(x, 1 - w);
      y = c01(y + dy); y = Math.min(y, 1 - h);
      break;
    case "nw":
      x = c01(x + dx); w = Math.max(MIN_CROP, r - x); if (x + w > 1) x = 1 - w;
      y = c01(y + dy); h = Math.max(MIN_CROP, b - y); if (y + h > 1) y = 1 - h;
      break;
    case "ne":
      w = Math.max(MIN_CROP, c01(w + dx));
      y = c01(y + dy); h = Math.max(MIN_CROP, b - y); if (y + h > 1) y = 1 - h;
      break;
    case "sw":
      x = c01(x + dx); w = Math.max(MIN_CROP, r - x); if (x + w > 1) x = 1 - w;
      h = Math.max(MIN_CROP, c01(h + dy));
      break;
    case "se":
      w = Math.max(MIN_CROP, c01(w + dx));
      h = Math.max(MIN_CROP, c01(h + dy));
      break;
    case "n":
      y = c01(y + dy); h = Math.max(MIN_CROP, b - y); if (y + h > 1) y = 1 - h;
      break;
    case "s":
      h = Math.max(MIN_CROP, c01(h + dy));
      break;
    case "w":
      x = c01(x + dx); w = Math.max(MIN_CROP, r - x); if (x + w > 1) x = 1 - w;
      break;
    case "e":
      w = Math.max(MIN_CROP, c01(w + dx));
      break;
  }
  if (x + w > 1) w = 1 - x;
  if (y + h > 1) h = 1 - y;
  return { x, y, w, h };
}

type CropData = {
  file: File;
  objectUrl: string;
  naturalW: number;
  naturalH: number;
  box: Box;
};

export default function CoverImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);
  const [cursor, setCursor] = useState("default");
  const [uploading, setUploading] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [crop, setCrop] = useState<CropData | null>(null);

  useEffect(() => {
    return () => { if (crop?.objectUrl) URL.revokeObjectURL(crop.objectUrl); };
  }, [crop?.objectUrl]);

  function displaySize() {
    const el = containerRef.current;
    return { dW: el?.clientWidth ?? 600, dH: el?.clientHeight ?? 400 };
  }

  function initCrop(file: File) {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setCrop({
        file, objectUrl,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
        box: { x: 0.1, y: 0.1, w: 0.8, h: 0.8 },
      });
    };
    img.src = objectUrl;
  }

  // ── Pointer handlers on the container ──────────────────────────────────
  function startDrag(handle: Handle, mx: number, my: number) {
    if (!crop) return;
    const { dW, dH } = displaySize();
    drag.current = { handle, startMx: mx, startMy: my, startBox: { ...crop.box }, dW, dH };
    setCursor(HANDLES.find((h) => h.id === handle)?.cursor ?? "move");
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !crop) return;
    const box = applyDrag(drag.current, e.clientX, e.clientY);
    setCrop((c) => c ? { ...c, box } : c);
  }

  function onPointerUp() {
    drag.current = null;
    setCursor("default");
  }

  // ── Canvas extraction & upload ──────────────────────────────────────────
  async function applyCrop() {
    if (!crop) return;
    setUploading(true);

    const { box, naturalW, naturalH, objectUrl, file } = crop;
    const srcX = box.x * naturalW;
    const srcY = box.y * naturalH;
    const srcW = box.w * naturalW;
    const srcH = box.h * naturalH;
    const outH = Math.round(OUTPUT_W * (srcH / srcW));

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_W;
    canvas.height = outH;
    const ctx = canvas.getContext("2d")!;

    const img = new window.Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("Image failed to load for canvas crop"));
      img.src = objectUrl;
    });
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_W, outH);

    const blob = await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), "image/jpeg", 0.92)
    );
    const croppedFile = new File(
      [blob],
      file.name.replace(/\.[^.]+$/, ".jpg"),
      { type: "image/jpeg" }
    );
    const res = await fetch(
      `/api/shreenu-editor/upload?filename=${encodeURIComponent(croppedFile.name)}&contentType=image%2Fjpeg`
    );
    const { uploadUrl, publicUrl } = await res.json();
    await fetch(uploadUrl, { method: "PUT", body: croppedFile, headers: { "Content-Type": "image/jpeg" } });

    URL.revokeObjectURL(objectUrl);
    setCrop(null);
    onChange(publicUrl);
    setUploading(false);
  }

  function cancelCrop() {
    if (crop) URL.revokeObjectURL(crop.objectUrl);
    setCrop(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDropping(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) initCrop(file);
  }

  // ── Crop UI ──────────────────────────────────────────────────────────────
  if (crop) {
    const { box, naturalW, naturalH } = crop;

    // container uses natural aspect ratio, capped at 450px tall
    const aspectRatio = `${naturalW} / ${naturalH}`;

    // In percent relative to the container for overlay positioning
    const bx = box.x * 100;
    const by = box.y * 100;
    const bw = box.w * 100;
    const bh = box.h * 100;

    return (
      <div>
        <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">
          Cover Image — Crop
        </label>
        <p className="text-[11px] text-stone-400 mb-2">
          Drag corners or edges to crop · Drag inside the box to move
        </p>

        {/* Crop frame */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg bg-stone-900 select-none"
          style={{ width: "100%", aspectRatio, maxHeight: 450, cursor }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Full image */}
          <img
            src={crop.objectUrl}
            alt="Crop"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          />

          {/* Dark overlay — 4 rectangles around the crop box */}
          <div className="absolute pointer-events-none" style={{ inset: 0, background: "transparent" }}>
            {/* top */}
            <div className="absolute bg-black/55" style={{ top: 0, left: 0, right: 0, height: `${by}%` }} />
            {/* bottom */}
            <div className="absolute bg-black/55" style={{ top: `${by + bh}%`, left: 0, right: 0, bottom: 0 }} />
            {/* left */}
            <div className="absolute bg-black/55" style={{ top: `${by}%`, left: 0, width: `${bx}%`, height: `${bh}%` }} />
            {/* right */}
            <div className="absolute bg-black/55" style={{ top: `${by}%`, left: `${bx + bw}%`, right: 0, height: `${bh}%` }} />
          </div>

          {/* Crop box border + interior move area */}
          <div
            className="absolute border border-white/80"
            style={{
              left: `${bx}%`, top: `${by}%`,
              width: `${bw}%`, height: `${bh}%`,
              cursor: "move",
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.setPointerCapture(e.pointerId);
              startDrag("move", e.clientX, e.clientY);
            }}
          >
            {/* Rule-of-thirds inside crop box */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
            </div>

            {/* 8 handles */}
            {HANDLES.map(({ id, u, v, cursor: hc }) => (
              <div
                key={id}
                className="absolute bg-white border border-stone-400 rounded-sm z-20"
                style={{
                  width: HS, height: HS,
                  left: `calc(${u * 100}% - ${HS / 2}px)`,
                  top:  `calc(${v * 100}% - ${HS / 2}px)`,
                  cursor: hc,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startDrag(id, e.clientX, e.clientY);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={applyCrop}
            disabled={uploading}
            className="text-sm bg-burgundy text-white px-4 py-2 rounded hover:bg-deep-wine transition-colors disabled:opacity-40"
          >
            {uploading ? "Uploading…" : "Apply Crop & Upload"}
          </button>
          <button
            type="button"
            onClick={cancelCrop}
            disabled={uploading}
            className="text-sm text-stone-500 hover:text-stone-900 px-4 py-2 rounded border border-stone-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Existing image ────────────────────────────────────────────────────────
  if (value) {
    return (
      <div>
        <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">
          Cover Image
        </label>
        <div className="relative rounded-lg overflow-hidden border border-stone-200">
          <img src={value} alt="Cover" className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition-colors">
              Replace
            </button>
            <button type="button" onClick={() => onChange("")}
              className="bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition-colors">
              Remove
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) initCrop(f); e.target.value = ""; }} />
      </div>
    );
  }

  // ── Dropzone ──────────────────────────────────────────────────────────────
  return (
    <div>
      <label className="block text-xs text-stone-400 mb-1 uppercase tracking-wider">Cover Image</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDropping(true); }}
        onDragLeave={() => setDropping(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center gap-2 transition-colors ${
          dropping ? "border-burgundy bg-burgundy/5" : "border-stone-200 hover:border-stone-400 bg-stone-50"
        }`}
      >
        <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-stone-400">Drag & drop or <span className="text-burgundy font-medium">browse</span></p>
        <p className="text-xs text-stone-300">JPG, PNG, WebP</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) initCrop(f); e.target.value = ""; }} />
    </div>
  );
}
