import { api } from "./make-request";

export const createUser = (data) => {
	return api.post("/users/", data);
};

export const updateUser = (data) => {
	return api.patch(`/users/${data.id}`, data);
};

export const loginUser = (email, password) => {
	return api.post("/auth/login", { email, password });
};

export const logoutUser = () => {
	return api.post("/auth/logout");
};

export const sendPWReset = (email) => {
	return api.post("/auth/reset-password", { email });
};

export const confirmToken = (email, token) => {
	return api.post("/auth/confirm-reset-token", { email, token });
};

export const resetPassword = (password) => {
	return api.post("/auth/update-password", { password });
};

export const getUsers = (pageSize, pageNum) => {
	return api.get(`/users?limit=${pageSize}&page=${pageNum}`);
};

export const getUser = (id) => {
	return api.get(`/users/${id}`);
};

export const deleteUser = (id) => {
	return api.delete(`/users/${id}`);
};