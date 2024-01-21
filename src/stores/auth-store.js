import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, getUser, logoutUser, resetPassword } from "../data/user";
import { CSRF } from "../utilities/consts";
import { getExpTimestamp } from "../utilities/functions";

const defaultState = {
	user: null,
	isAuthed: false,
	authExpiration: 0,
	authedAt: 0
};

// use localStorage for this
const useAuthStore = create(
	persist(
		(set, get) => ({
			...defaultState,
			login: (email, password, user = null) => {
				return loginUser(email, password).then((loginRes) => {
					// store X-CSRF-Token header
					localStorage.setItem(CSRF, loginRes.headers['x-csrf-token']);

					console.log(loginRes);

					const authData = {
						isAuthed: true,
						authExpiration: getExpTimestamp(loginRes.headers['expires']),
						authedAt: Date.now()
					};

					if (user) {
						set({
							user,
							...authData
						});
					} else {
						getUser("current")
							.then((userRes) => {
								set({
									user: userRes.data,
									...authData
								});
							});
					}
					console.log("state set")
				});
			},
			logout: () => {
				return logoutUser()
					.then(() => {
						get().clear();
					});
			},
			resetPassword: (password) => {
				return resetPassword(password)
					.then((res) => {
						localStorage.setItem(CSRF, res.headers['x-csrf-token']);

						getUser("current")
							.then((userRes) => {
								set({
									user: userRes.data,
									isAuthed: true,
									authExpiration: getExpTimestamp(res.headers['expires']),
									authedAt: Date.now()
								});
							});
					});
			},
			updateUser: (userData) => set({ user: userData }),
			clear: () => {
				localStorage.removeItem(CSRF);
				set({ ...defaultState });
			}
		}),
		{
			name: "auth-storage"
			// storage: createJSONStorage(() => localStorage) // dont need to specify, as localStorage is the default
		}
	)
);

export default useAuthStore;