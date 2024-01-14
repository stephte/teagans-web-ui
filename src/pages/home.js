import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import "./home.scss"

const Home = () => {
	const { authState } = useContext(AuthContext);

	return (
		<home-page>
			<h1>Welcome to Teagan's WebApp!</h1>
			{ authState?.isAuthed && <h3>Hi {authState.user?.firstName}!</h3> }
		</home-page>
	);
};

export default Home;