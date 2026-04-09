export const preserveFiltersInURL = (currentParams, updates, filterKeys = ["rack", "dc"]) => {
  const params = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  filterKeys.forEach((filterKey) => {
    if (!updates.hasOwnProperty(filterKey) && currentParams.has(filterKey)) {
      params.set(filterKey, currentParams.get(filterKey));
    }
  });

  return params.toString();
};

export const removeOnlyFilters = (currentParams, filterKeys = ["rack", "dc"]) => {
  const params = new URLSearchParams(currentParams);

  filterKeys.forEach((filterKey) => {
    params.delete(filterKey);
  });

  return params.toString();
};

export const getCurrentFilters = (currentParams, filterKeys = ["rack", "dc"]) => {
  const filters = {};
  filterKeys.forEach((filterKey) => {
    filters[filterKey] = currentParams.get(filterKey) || "";
  });
  return filters;
};

/**
 * Build a renderable URL for a stored customer/user profile image. Mirrors the
 * helper inlined in CustomerHeader / CustomerProfileSection so every page that
 * shows a user avatar resolves the same value the same way.
 *
 * Behavior, in order:
 *   - returns null when no value is provided
 *   - passes through fully-formed sources (data:, http(s):, blob:)
 *   - strips the legacy "/uploads/profile/" prefix and any leading slash
 *   - prefers S3_URL / NEXT_PUBLIC_S3_URL when set (prod/CDN deployments)
 *   - otherwise falls back to BASE_URL / NEXT_PUBLIC_API_URL so local/dev
 *     loads the file from the API's /profile-image/** resource handler
 *   - returns the raw value as a last resort (very unlikely path)
 */
export const getProfileImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("data:") || image.startsWith("http") || image.startsWith("blob:")) {
    return image;
  }
  const cleanImage = image.replace(/^\/?uploads\/profile\//, "").replace(/^\//, "");
  const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || "";
  if (s3Url) return `${s3Url}/profile-image/${cleanImage}`;
  const apiBase = process.env.BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (apiBase) return `${apiBase.replace(/\/$/, "")}/profile-image/${cleanImage}`;
  return image;
};

/**
 * Same shape as getProfileImageUrl, but resolves to the API's `/books-image/**`
 * resource handler (mapped to uploads/books/ in WebSecurityConfig). Used by
 * inventory list, book details, RFID, and loan pages so book covers also
 * fall back to BASE_URL when S3 isn't configured.
 */
export const getBookImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("data:") || image.startsWith("http") || image.startsWith("blob:")) {
    return image;
  }
  const cleanImage = image.replace(/^\/?uploads\/books\//, "").replace(/^\//, "");
  const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || "";
  if (s3Url) return `${s3Url}/books-image/${cleanImage}`;
  const apiBase = process.env.BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (apiBase) return `${apiBase.replace(/\/$/, "")}/books-image/${cleanImage}`;
  return image;
};
