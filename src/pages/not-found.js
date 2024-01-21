import useAuthStore from "../stores/auth-store";
import "./not-found.scss"

const NotFound = () => {
	const currentUser = useAuthStore(state => state.user);
	const isAuthed = useAuthStore(state => state.isAuthed);

	return (
		<not-found>
			<h2>Page does not exist :(</h2>
			{isAuthed &&
				<h3>Really {currentUser?.firstName}? You're better than this.</h3>
			}
		</not-found>
	);
};

export default NotFound;