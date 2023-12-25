import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

const RequireNoAuth = ({ authLevel, children }) => {
	const { authState } = useContext(AuthContext);
	const { isAuthed } = authState;

	if (isAuthed) {
		return <Navigate to="/" replace />
	} else {
		return children;
	}
};

export default RequireNoAuth;