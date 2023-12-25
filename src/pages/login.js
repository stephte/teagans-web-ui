import { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import TextInput from "../components/text-input";
import FormBox from "../components/form-box";
import Button from "../components/button";
import { loginUser } from "../data/user";
import { AuthContext } from "../contexts/auth";

const Login = () => {
	const { authState, dispatch } = useContext(AuthContext);
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
			to: "/create-user",
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

		let data = { ...loginData };
		loginUser(data).then((res) => {
			// get X-CSRF-Token header
			const csrf = res.headers['x-csrf-token'];

			dispatch({
				type: "LOGIN",
				payload: csrf
			});
			// wait to give the app time to get the current User data
			// can change this when a global state manager is implemented
			setTimeout(() => navigate(state?.path || "/"), 250);
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
		<FormBox errMsg={errMsg} subLinks={subLinks}>
			<h2>Login</h2>
			<TextInput
				placeholder="Email"
				onChange={updateData}
				value={loginData.email}
				required
				name="email"
				onKeyPress={onpress}
			/>
			<TextInput
				placeholder="Password"
				onChange={updateData}
				value={loginData.password}
				isPassword
				required
				name="password"
				onKeyPress={onpress}
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