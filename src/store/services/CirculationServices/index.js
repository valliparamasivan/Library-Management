import { clientAxios } from "@/config/ApiConfig";

export const searchBookOrUser = async ({ type, searchKey, loanFilter = "ALL" }) => {
  const { data } = await clientAxios.get("/search/book/user", {
    params: { type, searchKey, loanFilter },
  });
  return data;
};

export const getUserTransactions = async ({ userId, searchKey, type, startDate, endDate }) => {
  const params = { userId };
  if (type != null) params.type = type;
  if (searchKey) params.searchKey = searchKey;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const { data } = await clientAxios.get("/user/loans/transactions", { params });
  return data;
};

export const issueBook = async (params) => {
  const { data } = await clientAxios.post("/issueBook", params);
  return data;
};

export const scanBook = async ({ type, rfids, userId }) => {
  const { data } = await clientAxios.post("/scan/book", { rfids, userId }, { params: { type } });
  return data;
};

export const returnBook = async (params) => {
  const { data } = await clientAxios.post("/returnBook", params);
  return data;
};

export const renewBook = async (params) => {
  const { data } = await clientAxios.post("/renewBook", params);
  return data;
};

export const scanUser = async (params) => {
  const { data } = await clientAxios.post("/scan/user", params);
  return data;
};
