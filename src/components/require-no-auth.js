import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/auth-store";

const RequireNoAuth = ({ children }) => {
	// const isAuthed = useAuthStore(state => state.isAuthed);
	const authedAt = useAuthStore(state => state.authedAt);
	// const user = useAuthStore(state => state.user);

	const justAuthed = Date.now() - authedAt < 1000;

	if (authedAt && !justAuthed) {
		return <Navigate to="/" replace />;
	} else {
		return children;
	}
};

export default RequireNoAuth;