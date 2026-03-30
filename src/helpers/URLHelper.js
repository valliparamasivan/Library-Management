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
