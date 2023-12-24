import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/text-input";
import Button from "../components/button";
import { confirmToken } from "../data/user";
import { AuthContext } from "../contexts/auth";
import { TOKEN_EMAIL } from "../utilities/consts";
import "./reset-token.scss";

const ResetToken = () => {
	const { authState, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	const email = localStorage.getItem(TOKEN_EMAIL);

	// redirect back to home if already logged in
	useEffect(() => {
		// redirect back to home if already logged in
		if (authState?.isAuthed) {
			navigate("/");
		}
	}, [authState?.isAuthed]);

	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [token, setToken] = useState("");

	const sendToken = () => {
		if (!token) {
			console.log("not valid!");
			return;
		}
		setLoading(true);
		setErrMsg("");

		confirmToken(email, token).then((res) => {
			console.log(res);
			localStorage.removeItem(TOKEN_EMAIL);
			navigate("/new-password");
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
			sendToken();
		}
	};

	return (
		<reset-token>
			<p className="error">{errMsg || <span>&nbsp;</span>}</p>
			<div className="container">
				<div className="form-wrapper">
					<p>
						If a user with the email '{email}' exists,
						then a password reset email is on the way
					</p>
					<TextInput
						placeholder="Reset Token"
						onChange={({ target }) => setToken(target.value)}
						value={token}
						required
						name="token"
						onKeyPress={onpress}
					/>
					<Button 
						onClick={() => sendToken()}
						text={loading ? "Loading..." : "Confirm"}
						disabled={!token || loading}
					/>
				</div>
			</div>
		</reset-token>
	);
};

export default ResetToken