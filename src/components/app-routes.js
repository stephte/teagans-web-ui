import { useEffect, useContext } from "react";
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import { getCurrentUser } from "../data/user";
import Home from "../pages/home";
import Login from "../pages/login";
import CreateUser from "../pages/create-user";
import ForgotPassword from "../pages/forgot-password";
import NewPassword from "../pages/new-password";
import ResetToken from "../pages/reset-token";
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
				<Route path="/login" element={<Login />} />
				<Route path="/create-user" element={<CreateUser />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-token" element={<ResetToken />} />
				<Route path="/new-password" element={<NewPassword />} />
				<Route path="/download" element={<DownloadVid />} />
				<Route path="/" element={<Home />} />
			</Routes>
		</>
	);
};

export default AppRoutes;
