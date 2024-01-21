import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const RequireNoAuth = ({ children }) => {
	const isAuthed = useAuthStore(state => state.isAuthed);

	if (isAuthed) {
		return <Navigate to="/" replace />
	} else {
		return children;
	}
};

export default RequireNoAuth;