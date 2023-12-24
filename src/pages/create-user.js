import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { loginUser, createUser } from "../data/user";
import { AuthContext } from "../contexts/auth";
import "./create-user.scss";

const CreateUser = () => {
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
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConf: ""
	});

	useEffect(() => {
		let { firstName, lastName, email, password, passwordConf } = userData;
		setValid(firstName && lastName && email && password && (password === passwordConf));
	}, [userData]);

	const updateData = (e) => {
		e.preventDefault();

		let obj = { ...userData };
		obj[e.target.name] = e.target.value;
		setUserData(obj);
	};

	const createNewUser = () => {
		if (!valid) {
			console.log("not valid!");
			return;
		}
		setLoading(true);
		setErrMsg("");

		let data = { ...userData };
		createUser(data).then(() => {
			// get X-CSRF-Token header

			loginUser({ email: data.email, password: data.password}).then((res) => {
				const csrf = res.headers['x-csrf-token'];

				dispatch({
					type: "LOGIN",
					payload: csrf
				});
				navigate("/");
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
			createNewUser();
		}
	};

	return (
		<create-user>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className="form-wrapper">
					<h2>Create Account</h2>
					<TextInput
						placeholder="First Name"
						onChange={updateData}
						value={userData.firstName}
						required
						name="firstName"
						onKeyPress={onpress}
					/>
					<TextInput
						placeholder="Last Name"
						onChange={updateData}
						value={userData.lastName}
						required
						name="lastName"
						onKeyPress={onpress}
					/>
					<TextInput
						placeholder="Email"
						onChange={updateData}
						value={userData.email}
						required
						name="email"
						onKeyPress={onpress}
					/>
					<TextInput
						placeholder="Password"
						onChange={updateData}
						value={userData.password}
						isPassword
						required
						name="password"
						onKeyPress={onpress}
					/>
					<TextInput
						placeholder="Confirm Password"
						onChange={updateData}
						value={userData.passwordConf}
						isPassword
						required
						name="passwordConf"
						onKeyPress={onpress}
					/>
					<Button 
						onClick={() => createNewUser()}
						text={loading ? "Loading..." : "Create"}
						disabled={!valid || loading}
					/>
				</div>
			</div>
			<p className="sublink"><Link to="/login">Already have an account? Login.</Link></p>
		</create-user>
	);
};

export default CreateUser;