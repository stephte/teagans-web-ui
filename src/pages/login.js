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
			console.log("not valid!");
			return;
		}
		setLoading(true);
		setErrMsg("");

		const { email, password } = loginData;
		loginUser(email, password)
			.then(() => {
				navigate(state?.path || "/");
			}).catch((err) => {
				if (err?.response?.data?.error) {
					setErrMsg(err.response.data.error);
				} else {
					setErrMsg("Error with request");
					console.log(err);
				}
			}).finally(() => setLoading(false));
	};

	const onpress = (e) => {
		if (e.key === 'Enter') {
			login();
		}
	};

	return (
		<FormBox errMsg={errMsg} subLinks={subLinks} isLoading={loading}>
			<h2>Login</h2>
			<AppInput
				placeholder="Email"
				onChange={updateData}
				value={loginData.email}
				required
				name="email"
				onKeyPress={onpress}
			/>
			<AppInput
				placeholder="Password"
				onChange={updateData}
				value={loginData.password}
				required
				name="password"
				onKeyPress={onpress}
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