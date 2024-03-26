import { NavLink, useNavigate } from "react-router-dom";
import { UserRole } from "../utilities/enums.ts";
import Logo from "../images/sea-turtle.svg";
import Button from "./button";
import useAuthStore from "../stores/auth-store.js";
import "./navbar.scss";

// interface Btn {
// 	text: string;
// 	link: string;
// 	authLevel: UserRole | null;
// }

// TODO: make any overflowing buttons collapse into hamburger menu
const NavBar = () => {
	const isAuthed = useAuthStore(state => state.isAuthed);
	const user = useAuthStore(state => state.user);
	const logoutUser = useAuthStore(state => state.logout);

	const navigate = useNavigate();

	// authLevel of -1 means button shows only if user is not logged in
	// authLevel omitted or of falsy value will display button for everyone
	const btns = [
		{
			text: "Download",
			link: "download",
			authLevel: UserRole.Regular
		},
		{
			text: "Users",
			link: "users",
			authLevel: UserRole.Admin
		},
		{
			text: "AddUser",
			link: "add-user",
			authLevel: UserRole.Admin
		},
		{
			text: "Account",
			link: "users/current",
			authLevel: UserRole.Regular
		},
		{
			text: "Create",
			link: "create-account",
			authLevel: -1
		},
		{
			text: "Tasks",
			link: "tasks",
			authLevel: UserRole.Regular
		},
	];

	const filteredBtns = btns.filter(btn => {
		return (
			!btn.authLevel ||
			(btn.authLevel < UserRole.Regular && isAuthed === false) ||
			(btn.authLevel && btn.authLevel >= UserRole.Regular && user?.role >= btn.authLevel)
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
