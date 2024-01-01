import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/app-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import { resetPassword } from "../data/user";
import { AuthContext } from "../contexts/auth";

const NewPassword = () => {
	const { authState, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

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
		<FormBox errMsg={errMsg} isLoading={loading}>
			<h2>Enter New Password:</h2>
			<AppInput
				placeholder="New Password"
				onChange={({ target }) => setPassword(target.value)}
				value={password}
				required
				name="password"
				onKeyPress={onpress}
				isPassword
			/>
			<AppInput
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
		</FormBox>
	);
};

export default NewPassword