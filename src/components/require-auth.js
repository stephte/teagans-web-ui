import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

const RequireAuth = ({ authLevel, children }) => {
	const { authState } = useContext(AuthContext);
	const location = useLocation();
	const { isAuthed, user } = authState;

	if (isAuthed && user?.role >= (authLevel || 1)) {
		return children;
	} else if (isAuthed === false) {
		return <Navigate to="/login" replace state={{ path: location.pathname }} />
	}
};

export default RequireAuth;