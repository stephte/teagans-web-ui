import { useEffect, useContext } from "react";
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import { getCurrentUser } from "../data/user";
import RequireAuth from "./require-auth";
import RequireNoAuth from "./require-no-auth";
import Home from "../pages/home";
import Login from "../pages/login";
import CreateUser from "../pages/create-user";
import ForgotPassword from "../pages/forgot-password";
import NewPassword from "../pages/new-password";
import ResetToken from "../pages/reset-token";
import NotFound from "../pages/not-found";
import NavBar from "./navbar";
import DownloadVid from "../pages/download";


const AppRoutes = () => {
	const { authState, dispatch } = useContext(AuthContext);

	// find and set the user when app loads/reloads
	// would be better to do this in a state manager that doesn't
	// empty out upon refresh... but this will do for the moment
	useEffect(() => {
		if (authState && !authState.user) {
			getCurrentUser()
				.then((res) => {
					dispatch({
			      type: "USER",
			      payload: res.data
			    });
		  	})
		  	.catch(() => {});
		}
  }, [authState?.isAuthed, dispatch]);

	return (
		<>
			<NavBar />
			<Routes>
				{/*no authed routes*/}
				<Route path="/login" element={<RequireNoAuth> <Login /> </RequireNoAuth>} />
				<Route path="/create-user" element={<RequireNoAuth> <CreateUser /> </RequireNoAuth>} />
				<Route path="/forgot-password" element={<RequireNoAuth> <ForgotPassword /> </RequireNoAuth>} />
				<Route path="/reset-token" element={<RequireNoAuth> <ResetToken /> </RequireNoAuth>} />
				<Route path="/new-password" element={<RequireNoAuth> <NewPassword /> </RequireNoAuth>} />

				{/*authed routes*/}
				<Route path="/download" element={<RequireAuth> <DownloadVid /> </RequireAuth>} />

				{/*dont care routes*/}
				<Route path="/" element={<Home />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
};

export default AppRoutes;
