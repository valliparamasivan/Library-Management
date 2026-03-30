import { clientAxios } from "@/config/ApiConfig";

export const addFavorite = async (params) => {
  const { data } = await clientAxios.post("/addFavoriteBook", params);
  return data;
};

export const removeFavorite = async (params) => {
  const { data } = await clientAxios.delete("/removeFavoriteBook", { data: params });
  return data;
};

export const getReservedBook = async (bookId) => {
  const { data } = await clientAxios.get(`/reserved/book/${bookId}`);
  return data;
};

export const addReservedBook = async (params) => {
  const { data } = await clientAxios.post("/addReservedBook", params);
  return data;
};

export const addReview = async (params) => {
  const { data } = await clientAxios.post("/rating/add", params);
  return data;
};