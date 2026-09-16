import imageCompression from "browser-image-compression";

// Downscale longest edge to 1600px, re-encode as JPEG q≈0.82. EXIF orientation
// is normalised by the library. Files already smaller than the target are
// skipped internally by the library. On any failure, we return the original
// so uploads never break.
export async function compressBlogImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 1600,
      initialQuality: 0.82,
      fileType: "image/jpeg",
      useWebWorker: true,
      // 3 MB cap on output — the library iterates quality down to hit it.
      maxSizeMB: 3,
    });
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([compressed], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
