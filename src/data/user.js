import { api, authApi } from "./make-request";

export const createUser = (data) => {
	return api.post(`${process.env.REACT_APP_API_URL}/users/`, data);
};

export const updateUser = (data) => {
	return authApi.patch(`${process.env.REACT_APP_API_URL}/users/${data.id}`, data);
};

export const loginUser = (data) => {
	return api.post(`${process.env.REACT_APP_API_URL}/auth/login`, data);
};

export const logoutUser = () => {
	return api.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
};

export const sendPWReset = (email) => {
	return api.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, { email });
};

export const confirmToken = (email, token) => {
	return api.post(`${process.env.REACT_APP_API_URL}/auth/confirm-reset-token`, { email, token });
};

export const resetPassword = (password) => {
	return authApi.post(`${process.env.REACT_APP_API_URL}/auth/update-password`, { password });
};

export const getUsers = (pageSize, pageNum) => {
	return authApi.get(`${process.env.REACT_APP_API_URL}/users?limit=${pageSize}&page=${pageNum}`);
};

export const getUser = (id) => {
	return authApi.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
};

export const deleteUser = (id) => {
	return authApi.delete(`${process.env.REACT_APP_API_URL}/users/${id}`);
};