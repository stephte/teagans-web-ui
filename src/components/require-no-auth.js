import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const RequireNoAuth = ({ children }) => {
	const authedAt = useAuthStore(state => state.authedAt);

	const justAuthed = Date.now() - authedAt < 1000;

	if (authedAt && !justAuthed) {
		return <Navigate to="/" replace />;
	} else {
		return children;
	}
};

export default RequireNoAuth;