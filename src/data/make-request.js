import axios from "axios";
import { CSRF } from "../utilities/consts";

export const authApi = axios.create({ withCredentials: true });

authApi.interceptors.request.use((config) => {
	// input headers
	let headers = { ...config.headers };
	headers["X-CSRF-Token"] = localStorage.getItem(CSRF);
	config.headers = headers;

	return config
}, (err) => {
	return Promise.reject(err);
});

export const api = axios.create({ withCredentials: true });