import { Link } from "react-router-dom";
import useAuthStore from "../stores/auth-store";
import "./home.scss"

const Home = () => {
	const user = useAuthStore(state => state.user);

	return (
		<home-page>
			<h1>Welcome to Teagan's WebApp!</h1>
			{ user && <h3>Hi {user?.firstName}!</h3> }
			<div className="content">
				<p>
					This is where I (Teagan Stephenson) fiddle around with things I want to create that may be useful, for practice, or just for fun.
					Currently, simply creating an account will get you access to my Task Management board and YouTube video downloading.
				</p>
				<p>
					The task management board was created because I realized how much more focused and productive I was when I had lists
					of what I needed to get done in front of me, and also thought it was a great way to learn how to implement drag'n'drop in the UI!
				</p>
				<p>
					I created the YouTube video downloader because I thought it would be 'nifty' and potentially useful.
				</p>
				<br/>
				<p>
					This UI is done with <b>React</b>, and the API behind it is written in <b>Go</b>, with custom built JWT authentication securing requests in the background.
				</p>
				<p className="links"><Link to="https://github.com/stephte/teagans-web-api">Click here to find the API code in GitHub</Link>, or <Link to="https://github.com/stephte/teagans-web-ui">here to find the UI code</Link>.</p>
			</div>
		</home-page>
	);
};

export default Home;