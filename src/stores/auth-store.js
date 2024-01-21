import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, getUser, logoutUser, resetPassword } from "../data/user";
import { CSRF } from "../utilities/consts";

// use localStorage for this
const useAuthStore = create(
	persist(
		(set, get) => ({
			user: null,
			isAuthed: false,
			login: (email, password, user = null) => {
				return loginUser(email, password).then((loginRes) => {
					// store X-CSRF-Token header
					localStorage.setItem(CSRF, loginRes.headers['x-csrf-token']);

					if (user) {
						set({
							user,
							isAuthed: true
						});
					} else {
						getUser("current")
							.then((userRes) => {
								set({
									user: userRes.data,
									isAuthed: true
								});
							});
					}
				});
			},
			logout: () => {
				return logoutUser()
					.then(() => {
						localStorage.removeItem(CSRF);
						set({
							user: null,
							isAuthed: false
						});
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
									isAuthed: true
								});
							});
					});
			},
			updateUser: (userData) => set({ user: userData })
		}),
		{
			name: "auth-storage"
			// storage: createJSONStorage(() => localStorage) // dont need to specify, as localStorage is the default
		}
	)
);

export default useAuthStore;