import axios from "axios";
import { useNavigate } from "react-router-dom";
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

// TODO: find out how to auto redirect to login for any authed request that gets 401
// (except for the default 'users.current' call)

// api.interceptors.response.use((res) => {
// 	console.log("in interceptor response");
// 	return res;
// }, (err) => {
// 	if (err.response?.data?.relogin) {
// 		// update this to get where they were going and add to url params
// 		console.log('err');
// 		console.log(err);
// 		console.log('this');
// 		console.log(this);
// 		// window.location.replace("/login");
// 	}
// 	return Promise.reject(err);
// });

// export authApi;
export const api = axios.create({ withCredentials: true });