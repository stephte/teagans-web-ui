import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { logoutUser } from "../data/user";
import Logo from "../images/sea-turtle.svg";
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
			authLevel: 1
		},
		{
			text: "Users",
			link: "users",
			authLevel: 2
		},
		{
			text: "AddUser",
			link: "add-user",
			authLevel: 2
		},
		{
			text: "Account",
			link: "users/current",
			authLevel: 1
		}
	];

	const filteredBtns = btns.filter(btn => !btn.authLevel || (btn.authLevel && authState?.user?.role >= btn.authLevel));

	const logout = () => {
		logoutUser().then((res) => {
			if (res) {
				dispatch({ type: "LOGOUT" });
				navigate("/login");
			}
		})
	};

	return (
		<nav-bar>
			<NavLink to="/" id="logobox">
				<img src={Logo} alt="Logo" width="50" height="50" />
			</NavLink>
			<ul>
				{
					filteredBtns.map((btn, ndx) => {
						let css = "";
						if (ndx === filteredBtns.length-1) {
							css = "borderright";
						}
						return <NavBtn {...btn} css={css} key={btn.text} />;
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
		</nav-bar>
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
