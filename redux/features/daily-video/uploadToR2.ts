// Direct browser -> Cloudflare R2 upload against a presigned PUT url.
// Kept out of RTK Query so we can report progress and hit the R2 origin directly.

export function uploadToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Upload failed (network error)"));
    xhr.send(file);
  });
}

// Reads a local video's duration without uploading it.
export function readVideoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    try {
      const el = document.createElement("video");
      el.preload = "metadata";
      el.onloadedmetadata = () => {
        URL.revokeObjectURL(el.src);
        resolve(Number.isFinite(el.duration) ? Math.round(el.duration) : undefined);
      };
      el.onerror = () => resolve(undefined);
      el.src = URL.createObjectURL(file);
    } catch {
      resolve(undefined);
    }
  });
}
