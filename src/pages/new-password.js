import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { resetPassword } from "../data/user";
import { AuthContext } from "../contexts/auth";
import "./new-password.scss";

const NewPassword = () => {
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
	const [password, setPassword] = useState("");
	const [passwordConf, setPasswordConf] = useState("");
	const [errMsg, setErrMsg] = useState("");

	const updatePassword = () => {
		if (!password || password !== passwordConf) {
			console.log("not valid!");
			return;
		}
		setLoading(true);
		setErrMsg("");

		resetPassword(password).then((res) => {
			const csrf = res.headers['x-csrf-token'];

			dispatch({
				type: "LOGIN",
				payload: csrf
			}).then(() => {
				navigate("/");
			});
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
			updatePassword();
		}
	};

	return (
		<new-password>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className="form-wrapper">
					<h2>Enter New Password:</h2>
					<TextInput
						placeholder="New Password"
						onChange={({ target }) => setPassword(target.value)}
						value={password}
						required
						name="password"
						onKeyPress={onpress}
						isPassword
					/>
					<TextInput
						placeholder="Confirm Password"
						onChange={({ target }) => setPasswordConf(target.value)}
						value={passwordConf}
						required
						name="passwordConf"
						onKeyPress={onpress}
						isPassword
					/>
					<Button 
						onClick={() => updatePassword()}
						text={loading ? "Loading..." : "Confirm"}
						disabled={!password || password !== passwordConf || loading}
					/>
				</div>
			</div>
		</new-password>
	);
};

export default NewPassword