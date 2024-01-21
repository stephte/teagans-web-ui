import useAuthStore from "../stores/auth-store";
import "./home.scss"

const Home = () => {
	const user = useAuthStore(state => state.user);

	return (
		<home-page>
			<h1>Welcome to Teagan's WebApp!</h1>
			{ user && <h3>Hi {user?.firstName}!</h3> }
		</home-page>
	);
};

export default Home;