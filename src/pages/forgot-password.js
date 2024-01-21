import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../components/app-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import { sendPWReset } from "../data/user";
import { TOKEN_EMAIL } from "../utilities/consts";

const ForgotPassword = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [email, setEmail] = useState("");

	const pwReset = () => {
		if (!email) {
			return;
		}
		setLoading(true);
		setErrMsg("");

		sendPWReset(email).then((res) => {
			sessionStorage.setItem(TOKEN_EMAIL, email);
			navigate("/reset-token");
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
			pwReset();
		}
	};

	return (
		<FormBox errMsg={errMsg} isLoading={loading}>
			<h2>Enter Email:</h2>
			<AppInput
				placeholder="Email"
				onChange={({ target }) => setEmail(target.value)}
				value={email}
				required
				name="email"
				onKeyPress={onpress}
			/>
			<Button 
				onClick={() => pwReset()}
				text={loading ? "Loading..." : "Submit"}
				disabled={!email || loading}
			/>
		</FormBox>
	);
};

export default ForgotPassword;