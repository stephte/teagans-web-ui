import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { logoutUser } from "../data/user";
import Button from "../components/button";
import "./home.scss"

const Home = () => {
	const navigate = useNavigate();
	const { authState, dispatch } = useContext(AuthContext);

	return (
		<home-page>
			<h1>Welcome to Teagan's WebApp!</h1>
			{ authState?.isAuthed && <h3>Hi {authState.user?.firstName}!</h3> }
		</home-page>
	);
};

export default Home;