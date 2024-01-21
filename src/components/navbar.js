import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../images/sea-turtle.svg";
import Button from "./button";
import useAuthStore from "../stores/auth-store";
import "./navbar.scss";

const NavBar = () => {
	const isAuthed = useAuthStore(state => state.isAuthed);
	const user = useAuthStore(state => state.user);
	const logoutUser = useAuthStore(state => state.logout);

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
		},
		{
			text: "Create",
			link: "create-account",
			authLevel: -1
		}
	];

	const filteredBtns = btns.filter(btn => {
		return (
			!btn.authLevel ||
			(btn.authLevel < 0 && isAuthed === false) ||
			(btn.authLevel && btn.authLevel > 0 && user?.role >= btn.authLevel)
		);
	});

	const logout = () => {
		logoutUser()
			.then(() => {
				navigate("/login");
			})
	};

	return (
		<nav-bar>
			<NavLink to="/" id="logobox">
				<img src={Logo} alt="Logo" width="50" height="50" />
			</NavLink>
			<Menu btns={filteredBtns} />
			<div className="btnWrapper">
				<Button className="navlogin"
					onClick={() => {
						if (isAuthed) {
							logout();
						} else {
							navigate("/login");
						}
					}}
					text={isAuthed ? "Logout" : "Login"}
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

const Menu = ({ btns }) => {
	return (
		<ul>
			{
				btns.map((btn, ndx) => {
					let css = "";
					if (ndx === btns.length-1) {
						css = "borderright";
					}
					return <NavBtn {...btn} css={css} key={btn.text} />;
				})
			}
		</ul>
	);
};

// const HamburgerMenu = ({ btns }) => {
// 	<div className="hammenu">

// 	</div>
// };

export default NavBar;
