import { clientAxios } from "@/config/ApiConfig";

export const bookCategoryCreate = async (params) => {
  const { data } = await clientAxios.post("/addBookCategory", params);
  return data;
};

export const bookTypeCreate = async (params) => {
  const { data } = await clientAxios.post("/addBookType", params);
  return data;
};

export const languageCreate = async (params) => {
  const { data } = await clientAxios.post("/settings/add/language", params);
  return data;
};

export const bookCreate = async (formData) => {
  const { data } = await clientAxios.post("/book/addBook", formData, {
    isMultipart: true,
  });
  return data;
};

export const bookUpdate = async (formData) => {
  const { data } = await clientAxios.put("/book/editBook", formData, {
    isMultipart: true,
  });
  return data;
};

export const bookAddQuantity = async (params) => {
  const { data } = await clientAxios.put("/book/addQuantity", params);
  return data;
};


export const bookChangeStatus = async (bookId) => {
  const { data } = await clientAxios.put(`/book/changeStatus/${bookId}`);
  return data;
};

export const getShelfDropdown = async (locationId) => {
  const params = locationId ? { locationId } : {};
  const { data } = await clientAxios.get("/shelf/dropdown", { params });
  return data;
};

export const getRowDropdown = async (shelfId) => {
  const params = shelfId ? { shelfId } : {};
  const { data } = await clientAxios.get("/row/dropdown", { params });
  return data;
};

export const assignLocation = async (params) => {
  const { data } = await clientAxios.post("/assign/save/location", params);
  return data;
};

export const editLocation = async (params) => {
  const { data } = await clientAxios.put("/edit/save/location", params);
  return data;
};
