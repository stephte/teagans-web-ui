import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const RequireAuth = ({ authLevel, children }) => {
	const isAuthed = useAuthStore(state => state.isAuthed);
	const user = useAuthStore(state => state.user);
	const location = useLocation();

	if (isAuthed && user?.role >= (authLevel || 1)) {
		return children;
	} else {
		return <Navigate to="/login" replace state={{ path: location.pathname }} />
	}
};

export default RequireAuth;