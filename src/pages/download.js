import { useState, useEffect } from "react";
import AppInput from "../components/app-input";
import CheckboxInput from "../components/checkbox-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import { downloadVideo } from "../data/download";

const DownloadVid = () => {
	const [loading, setLoading] = useState(false);
	const [valid, setValid] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [url, setUrl] = useState("");
	const [isAudio, setAudio] = useState(false);

	useEffect(() => {
		setValid(Boolean(url));
	}, [url]);

	const download = () => {
		if (!valid) {
			return;
		}
		setLoading(true);
		setErrMsg("");

		downloadVideo(url, isAudio)
			.catch((err) => {
				if (err?.response?.data?.error) {
					setErrMsg(err.response.data.error);
				} else {
					setErrMsg("Invalid YouTube URL");
					console.log(err);
				}
			}).finally(() => setLoading(false));
	};

	const onpress = (e) => {
		if (e.key === 'Enter') {
			download();
		}
	};

	return (
		<FormBox errMsg={errMsg} isLoading={loading}>
			<h2>Download YouTube Video:</h2>
			<AppInput
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
		</FormBox>
	);
};

export default DownloadVid;