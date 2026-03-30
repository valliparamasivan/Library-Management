"use client";

export const formatToType = (format) => {
  const map = { csv: 1, pdf: 2, xlsx: 3 };
  return map[format] ?? 1;
};

export const getFilenameFromHeaders = (response, fallbackName) => {
  try {
    const header = response?.headers?.["content-disposition"] || response?.headers?.get?.("content-disposition");
    if (!header) return fallbackName;
    const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(header);
    const fileNameEncoded = match?.[1] || match?.[2];
    if (!fileNameEncoded) return fallbackName;
    try {
      return decodeURIComponent(fileNameEncoded);
    } catch {
      return fileNameEncoded;
    }
  } catch {
    return fallbackName;
  }
};

export const saveBlobResponse = (response, fallbackName) => {
  const resolvedName = getFilenameFromHeaders(response, fallbackName);
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = resolvedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
