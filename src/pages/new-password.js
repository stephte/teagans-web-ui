import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/app-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import useAuthStore from "../stores/auth-store";

const NewPassword = () => {
	const resetPassword = useAuthStore(state => state.resetPassword);

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordConf, setPasswordConf] = useState("");
	const [errMsg, setErrMsg] = useState("");

	const updatePassword = () => {
		if (!password || password !== passwordConf) {
			return;
		}
		setLoading(true);
		setErrMsg("");

		resetPassword(password).then((res) => {
			navigate("/");
		}).catch((err) => {
			if (err?.response?.data?.error) {
				setErrMsg(err.response.data.error);
			} else {
				setErrMsg("Error with request");
			}
		}).finally(() => setLoading(false));
	};

	const onPress = (e) => {
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
				onKeyDown={onPress}
				type="password"
			/>
			<AppInput
				placeholder="Confirm Password"
				onChange={({ target }) => setPasswordConf(target.value)}
				value={passwordConf}
				required
				name="passwordConf"
				onKeyDown={onPress}
				type="password"
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