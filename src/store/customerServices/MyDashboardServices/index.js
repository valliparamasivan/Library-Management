import { clientAxios } from "@/config/ApiConfig";

export const renewBook = async (params) => {
    const { data } = await clientAxios.post("/renewBook", params);
    return data;
};