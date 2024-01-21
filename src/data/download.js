import { api } from "./make-request";

export const downloadVideo = (url, isAudio) => {
	let encodedUrl = encodeURIComponent(url);
	return api.get("/download", { 
			params: { url: encodedUrl, audioOnly: isAudio },
			responseType: "blob"
		}).then(res => {
			const blobUrl = window.URL.createObjectURL(res.data);
		    const link = document.createElement("a");
		    link.href = blobUrl;

		    let filename = res.headers["content-disposition"]?.split("filename=")[1] || "ytvideo.mp4";
		    link.setAttribute("download", filename);

		    document.body.appendChild(link);
		    link.click();
		    link.parentNode.removeChild(link);
		});
};
