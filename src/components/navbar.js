import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { logoutUser } from "../data/user";
import Logo from "../images/turtlelogo.png";
import Button from "./button";
import "./navbar.scss";

const NavBar = () => {
	const { authState, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	// authLevels:
	// 1 = regular
	// 2 = admin
	// 3 = super admin
	const btns = [
		{
			text: "Download",
			link: "download",
			css: "borderright",
			authLevel: 2
		}
	];

	const logout = () => {
		logoutUser().then((res) => {
			if (res) {
				dispatch({ type: "LOGOUT" });
				navigate("/login");
			}
		})
	};

	return (
		<div className="nav-bar">
			<NavLink to="/" id="logobox">
				<img src={Logo} alt="Logo" width="50" height="50" />
			</NavLink>
			<ul>
				{
					btns.map((btn) => {
						if (!btn.authLevel || (btn.authLevel && authState?.user?.role >= btn.authLevel)) {
							return <NavBtn {...btn} key={btn.text} />;
						}
						return null;
					})
				}
			</ul>
			<div className="btnWrapper">
				<Button className="navlogin"
					onClick={() => {
						if (authState?.isAuthed) {
							logout();
						} else {
							navigate("/login");
						}
					}}
					text={authState?.isAuthed ? "Logout" : "Login"}
					disabled={!authState}
				/>
			</div>
		</div>
	);
};

const NavBtn = (props) => {
	const { link, text, css } = props;

	return (
		<NavLink to={`/${link}`}>
			<li className={`${css}`}>
				{text}
			</li>
		</NavLink>
	);
};

export default NavBar;
