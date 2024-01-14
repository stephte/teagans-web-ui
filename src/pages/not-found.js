import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import "./not-found.scss"

const NotFound = () => {
	const { authState } = useContext(AuthContext);

	return (
		<not-found>
			<h2>Page does not exist :(</h2>
			{authState?.isAuthed &&
				<h3>Really {authState.user?.firstName}? You're better than this.</h3>
			}
		</not-found>
	);
};

export default NotFound;