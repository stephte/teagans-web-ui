import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { sendPWReset } from "../data/user";
import { AuthContext } from "../contexts/auth";
import { TOKEN_EMAIL } from "../utilities/consts";
import "./forgot-password.scss";

const ForgotPassword = () => {
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
	const [errMsg, setErrMsg] = useState("");
	const [email, setEmail] = useState("");

	const pwReset = () => {
		if (!email) {
			console.log("not valid!");
			return;
		}
		setLoading(true);
		setErrMsg("");

		sendPWReset(email).then((res) => {
			console.log(res);
			localStorage.setItem(TOKEN_EMAIL, email);
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
		<forgot-password>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className="form-wrapper">
					<h2>Enter Email:</h2>
					<TextInput
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
				</div>
			</div>
		</forgot-password>
	);
};

export default ForgotPassword;