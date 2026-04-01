import { clientAxios } from "@/config/ApiConfig";

export const policyCreate = async (params) => {
    const { data } = await clientAxios.post("/policy/create", params);
    return data;
};

export const employeeCreate = async (formData) => {
    const { data } = await clientAxios.post("/addEmployee", formData, { isMultipart: true });
    return data;
};

export const employeeUpdate = async ({ id, data: formData }) => {
    const { data } = await clientAxios.put(`/editEmployee/${id}`, formData, { isMultipart: true });
    return data;
};

export const policyUpdate = async (params) => {
    const { data } = await clientAxios.put("/policy/update", params);
    return data;
};

export const roleCreate = async (params) => {
    const { data } = await clientAxios.post("/addRole", params);
    return data;
};

export const roleUpdate = async (params) => {
    const { data } = await clientAxios.put("/editRole", params);
    return data;
};

export const getRoleById = async (id) => {
    const { data } = await clientAxios.get(`/role/${id}`);
    return data;
};

export const changeRoleStatus = async (roleId) => {
    const { data } = await clientAxios.put(`/role/changeStatus/${roleId}`);
    return data;
};

export const changeEmployeeStatus = async (employeeId) => {
    const { data } = await clientAxios.put(`/employee/changeStatus/${employeeId}`);
    return data;
};

export const getAllRolePermissions = async () => {
    const { data } = await clientAxios.get("/get_all_roles_permission");
    return data;
};

export const locationCreate = async (params) => {
    const { data } = await clientAxios.post("/addLocation", params);
    return data;
};

export const locationUpdate = async (params) => {
    const { data } = await clientAxios.put("/editLocation", params);
    return data;
};