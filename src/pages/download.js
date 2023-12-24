import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/text-input";
import CheckboxInput from "../components/checkbox-input";
import Button from "../components/button";
import { downloadVideo } from "../data/download";
import { AuthContext } from "../contexts/auth";
import "./download.scss";

const DownloadVid = () => {
	const { authState } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		// redirect back to home if already logged in
		if (authState && authState.isAuthed === false) {
			navigate("/");
		}
	}, [authState, authState?.isAuthed]);

	const [loading, setLoading] = useState(false);
	const [valid, setValid] = useState(false);
	const [url, setUrl] = useState("");
	const [isAudio, setAudio] = useState(false);

	useEffect(() => {
		setValid(Boolean(url));
	}, [url]);

	const download = () => {
		if (!valid) {
			console.log("not valid!");
			return;
		}
		setLoading(true);

		downloadVideo(url, isAudio)
			.then(() => setLoading(false))//.then((res) => res.blob()).then((blob) => {
			.catch((err) => {
				console.log("err!!");
				console.log(err);
				setLoading(false);
			});
	};

	const onpress = (e) => {
		if (e.key === 'Enter') {
			download();
		}
	};

	return (
		<download-page className="container">
			<div className="form-wrapper">
				<h2>Download Video:</h2>
				<TextInput
					placeholder="YouTube URL"
					onChange={({ target }) => {
						setUrl(target.value)
					}}
					value={url}
					required
					name="url"
					onKeyPress={onpress}
					diasbled={loading}
				/>
				<CheckboxInput
					value={isAudio}
					name="isAudio"
					onChange={() => setAudio(!isAudio)}
					text="Audio Only"
					disabled={loading}
				/>
				<Button
					onClick={() => download()}
					text={loading ? "..." : "Download"}
					disabled={!valid || loading}
				/>
			</div>
		</download-page>
	);
};

export default DownloadVid;