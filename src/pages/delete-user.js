import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormBox from "../components/form-box";
import Button from "../components/button";
import { getUser, deleteUser } from "../data/user";
import useAuthStore from "../stores/auth-store";

const DeleteUser = () => {
	const currentUser = useAuthStore(state => state.user);
	const logoutUser = useAuthStore(state => state.logout);
	const navigate = useNavigate();
	const { id } = useParams();

	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		if (id && currentUser && (id === 'current' || id === currentUser.id)) {
			setUserData({ ...currentUser });
		} else if (id) {
			getUser(id).then((res) => {
				setUserData({ ...res.data });
			}).catch((err) => {
				setErrMsg(err.response?.data?.error || "Error getting user data");
			});
		}
	}, [id, currentUser]);

	const confirmDelete = () => {
		if (id && currentUser?.id && userData?.email) {
			setLoading(true);
			deleteUser(userData.id)
				.then(() => {
					if (id === "current" || currentUser.id === id) {
						logoutUser().finally(() => {
							navigate("/");
						});
					} else {
						navigate("/users");
					}
				})
				.catch((err) => {
					if (err?.response?.data?.error) {
						setErrMsg(err.response.data.error);
					} else {
						setErrMsg("Error with request");
						console.log(err);
					}
					setLoading(false);
				})
		}
	};

	return (
		<FormBox errMsg={errMsg} isLoading={loading}>
			<p>Are you sure you want to delete the following account?</p>
			<p>{userData?.email}</p>
			<Button 
				onClick={() => confirmDelete()}
				text={loading ? "Loading..." : "Delete"}
				disabled={!id || !currentUser?.id || !userData?.email || loading}
			/>
			<Button 
				onClick={() => navigate(`/users/${id}`)}
				text={loading ? "..." : "Cancel"}
				disabled={loading}
			/>
		</FormBox>
	);
};

export default DeleteUser;