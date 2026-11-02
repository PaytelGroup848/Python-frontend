/**
 * Browser File Saver Utility
 * Handles clean client-side Blob/ArrayBuffer downloads across modern browsers.
 */

export function saveFile(
  data: Blob | Uint8Array | ArrayBuffer | string,
  filename: string,
  mimeType = "application/octet-stream"
): void {
  if (typeof window === "undefined") return;

  const blob =
    data instanceof Blob
      ? data
      : new Blob([data as any], { type: mimeType });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }
    URL.revokeObjectURL(url);
  }, 1000);
}
