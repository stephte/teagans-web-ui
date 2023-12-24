import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { loginUser } from "../data/user";
import { AuthContext } from "../contexts/auth";
import "./login.scss";

const Login = () => {
	const { authState, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	// redirect back to home if already logged in
	useEffect(() => {
		// redirect back to home if already logged in
		if (authState?.isAuthed) {
			navigate("/");
		}
	}, [authState?.isAuthed]);

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
			// add code to redirect to where they were going,
			// if they were going somewhere	
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
		<login-page>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className="form-wrapper">
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
				</div>
			</div>
			<p className="sublink"><Link to="/forgot-password">Forgot Password?</Link></p>
			<p className="sublink"><Link to="/create-user">New? Create an Account!</Link></p>
		</login-page>
	);
};

export default Login;