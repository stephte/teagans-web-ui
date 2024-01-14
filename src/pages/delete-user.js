import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormBox from "../components/form-box";
import Button from "../components/button";
import { getUser, logoutUser, deleteUser } from "../data/user";
import { AuthContext } from "../contexts/auth";

const DeleteUser = () => {
	const { authState, dispatch } = useContext(AuthContext);
	const navigate = useNavigate()
	const { id } = useParams();

	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		if (id) {
			getUser(id).then((res) => {
				setUserData({ ...res.data });
			}).catch((err) => {
				setErrMsg(err.response?.data?.error || "Error getting user data");
			});
		}
	}, [id]);

	const confirmDelete = () => {
		if (id && authState?.user?.id && userData?.email) {
			setLoading(true);
			deleteUser(userData.id)
				.then(() => {
					if (id === "current" || authState.user.id === id) {
						logoutUser().finally(() => {
							dispatch({
								type: 'LOGOUT'
							});
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
				disabled={!id || !authState?.user?.id || !userData?.email || loading}
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