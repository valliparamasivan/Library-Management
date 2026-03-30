import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { HEADER } from "@/helpers/ConstantHelper";
import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

const baseConfiguration = {
  baseURL: process.env.BASE_URL,
  mode: "cors",
  headers: {
    "Content-Type": HEADER.CONTENT_TYPE,
    "Access-Control-Allow-Origin": "*",
  },
  timeout: HEADER.TIMEOUT,
};

// Client-side Axios instance
export const clientAxios = axios.create(baseConfiguration);

clientAxios.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.token) {
      config.headers.Authorization = `Bearer ${session?.user?.token}`;
    }
    if (config.isMultipart) {
      config.headers["Content-Type"] = HEADER.MULTIPART_CONTENT_TYPE;
    }
    return config;
  },
  (error) => Promise.reject(error?.response?.data),
);

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = `/?unauthorised=true`;
    }

    return Promise.reject({
      ...error,
      response: error.response,
      data: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
  },
);

// Server-side Axios instance
export const serverAxios = axios.create(baseConfiguration);

serverAxios.interceptors.request.use(
  async (config) => {
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session?.user?.token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error?.response?.data),
);

serverAxios.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data),
);
