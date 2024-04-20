import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/app-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import { confirmToken } from "../data/user";
import { TOKEN_EMAIL } from "../utilities/consts";

const ResetToken = () => {
	const navigate = useNavigate();

	const email = sessionStorage.getItem(TOKEN_EMAIL);

	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [token, setToken] = useState("");

	const sendToken = () => {
		if (!token) {
			return;
		}
		setLoading(true);
		setErrMsg("");

		confirmToken(email, token).then((res) => {
			sessionStorage.removeItem(TOKEN_EMAIL);
			navigate("/new-password");
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
			sendToken();
		}
	};

	return (
		<FormBox errMsg={errMsg} isLoading={loading}>
			<p>
				If a user with the email '{email}' exists,
				then an email with the reset token is on its way.
			</p>
			<AppInput
				placeholder="Reset Token"
				onChange={({ target }) => setToken(target.value)}
				value={token}
				required
				name="token"
				onKeyDown={onPress}
			/>
			<Button 
				onClick={() => sendToken()}
				text={loading ? "Loading..." : "Confirm"}
				disabled={!token || loading}
			/>
		</FormBox>
	);
};

export default ResetToken