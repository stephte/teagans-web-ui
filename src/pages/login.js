import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppInput from "../components/app-input";
import FormBox from "../components/form-box";
import Button from "../components/button";
import useAuthStore from "../stores/auth-store";

const Login = () => {
	const loginUser = useAuthStore(authState => authState.login);

	const navigate = useNavigate();
	const { state } = useLocation();

	const [loading, setLoading] = useState(false);
	const [valid, setValid] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [loginData, setLoginData] = useState({
		email: "",
		password: ""
	});

	useEffect(() => {
		let { email, password } = loginData;
		setValid(email && password);
	}, [loginData]);

	const subLinks = [
		{
			to: "/forgot-password",
			text: "Forgot Password?"
		},
		{
			to: "/create-account",
			text: "New? Create an Account!"
		}
	];

	const updateData = (e) => {
		e.preventDefault();

		let obj = { ...loginData };
		obj[e.target.name] = e.target.value;
		setLoginData(obj);
	};

	const login = () => {
		if (!valid) {
			return;
		}
		setLoading(true);
		setErrMsg("");

		const { email, password } = loginData;
		loginUser(email, password)
			.then(() => {
				// add small delay if navigating somewhere, to allow auth state to settle
				if (state?.path) {
					setTimeout(() => {
						setLoading(false);
						navigate(state.path);
					}, 900);
				} else {
					navigate("/");
				}
			}).catch((err) => {
				if (err?.response?.data?.error) {
					setErrMsg(err.response.data.error);
				} else {
					setErrMsg("Error with request");
				}
				setLoading(false);
			});
	};

	const onPress = (e) => {
		if (e.key === 'Enter') {
			login();
		}
	};

	return (
		<FormBox errMsg={errMsg} subLinks={subLinks} isLoading={loading}>
			<h2>Login</h2>
			<AppInput
				label="Email"
				placeholder="Email"
				onChange={updateData}
				value={loginData.email}
				required
				name="email"
				onKeyDown={onPress}
			/>
			<AppInput
				label="Password"
				placeholder="Password"
				onChange={updateData}
				value={loginData.password}
				required
				name="password"
				onKeyDown={onPress}
				type="password"
			/>
			<Button 
				onClick={() => login()}
				text={loading ? "Loading..." : "Login"}
				disabled={!valid || loading}
			/>
		</FormBox>
	);
};

export default Login;