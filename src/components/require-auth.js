import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "../utilities/enums.ts";
import useAuthStore from "../stores/auth-store";

const RequireAuth = ({ authLevel, children }) => {
	const isAuthed = useAuthStore(state => state.isAuthed);
	const user = useAuthStore(state => state.user);
	const authExpiration = useAuthStore(state => state.authExpiration);
	const clearUser = useAuthStore(state => state.clear);

	const location = useLocation();

	const authValid = isAuthed && Date.now() <= authExpiration;

	if (authValid && user?.role >= (authLevel || UserRole.Regular)) {
		return children;
	} else if (authValid && user?.role < (authLevel || UserRole.Regular)) {
		return <Navigate to="/" replace />
	} else {
		if (isAuthed) {
			clearUser();
		}
		return <Navigate to="/login" replace state={{ path: location.pathname }} />
	}
};

export default RequireAuth;