import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppInput from "../components/app-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import { loginUser, createUser, getUser, updateUser } from "../data/user";
import { AuthContext } from "../contexts/auth";

const CreateEditUser = () => {
	const { authState, dispatch } = useContext(AuthContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [valid, setValid] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [hasChanged, setHasChanged] = useState(false);
	const [userRole, setUserRole] = useState(1); // used to keep track of original user role
	const [editEnabled, setEditEnabled] = useState(false);
	const [roleEnabled, setRoleEnabled] = useState(false);
	const [subLinks, setSublinks] = useState([]);
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConf: "",
		role: 1
	});

	useEffect(() => {
		let { firstName, lastName, email, password, passwordConf } = userData;
		const currentRole = authState?.user?.role || 1;
		setValid(editEnabled && firstName && lastName && email && currentRole >= userData.role && ((id) || (password && (password === passwordConf))));
	}, [id, userData, editEnabled]);

	useEffect(() => {
		if (id) {
			getUser(id).then((res) => {
				setUserData({ ...res.data });
				setUserRole(res.data.role);
			}).catch((err) => {
				setErrMsg(err.response?.data?.error || "Error getting user data");
			});
		} else if (!id) {
			setUserData({
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				passwordConf: "",
				role: 1
			});
			setUserRole(1);
		}
	}, [id]);

	useEffect(() => {
		const currentRole = authState?.user?.role || 1;
		setEditEnabled(!id || (id === "current" || id === authState?.user?.id) || (currentRole > 2 || (currentRole >= 2 && userRole <= 1)));
		if (currentRole) {
			setRoleEnabled(currentRole >= 3 || (currentRole >= 2 && userRole <= 1));
		}
	}, [id, userRole, authState?.user])

	useEffect(() => {
		if (id && editEnabled) {
			setSublinks([
				{
					to: `/delete-user/${id}`,
					text: "Delete User"
				}
			]);
		} else if (!id && !authState?.isAuthed) {
			setSublinks([
				{
					to: "/login",
					text: "Already have an account? Login."
				}
			]);
		} else {
			setSublinks([]);
		}
	}, [id, editEnabled, authState?.isAuthed]);


	const updateData = ({ target }) => {
		const value = target.type === "number" ? +target.value : target.value;
		let obj = { ...userData };

		obj[target.name] = value;
		setUserData(obj);
		setHasChanged(true);
	};

	const submit = () => {
		if (!valid) {
			console.log("not valid!");
			return;
		}
		setLoading(true);
		setErrMsg("");

		let data = { ...userData };
		if (id) {
			update(data);
		} else {
			createNewUser(data);
		}
	};

	const update = (data) => {
		updateUser(data)
			.then((res) => {
				if (id === "current") {
					dispatch({
						type: "USER",
						payload: res.data
					});
				}
				setUserData({ ...res.data });
				setUserRole(res.data.role);
				setHasChanged(false);
			})
			.catch(handleErrRes).finally(() => setLoading(false));
	};

	const createNewUser = (data) => {
		createUser(data)
			.then((userRes) => {
				if (authState.isAuthed) {
					navigate("/users");
					setLoading(false);
				} else {
					loginUser({ email: data.email, password: data.password})
						.then((loginRes) => {
							const csrf = loginRes.headers['x-csrf-token'];

							dispatch({
								type: "USER",
								payload: userRes.data
							})
							dispatch({
								type: "LOGIN",
								payload: csrf
							});
							setLoading(false);
							navigate("/");
						}).catch(handleErrRes);
				}
			}).catch((err) => {
				handleErrRes(err);
				setLoading(false);
			});
	};

	const handleErrRes = (err) => {
		if (err?.response?.data?.error) {
			setErrMsg(err.response.data.error);
		} else {
			setErrMsg("Error with request");
			console.log(err);
		}
	};

	const onpress = (e) => {
		if (e.key === 'Enter') {
			submit();
		}
	};

	return (
		<FormBox errMsg={errMsg} subLinks={subLinks} isLoading={loading}>
			<h2>{id ? "Edit User" : "Create Account"}</h2>
			<AppInput
				placeholder="First Name"
				onChange={updateData}
				value={userData.firstName}
				required
				name="firstName"
				onKeyPress={onpress}
				disabled={!editEnabled}
			/>
			<AppInput
				placeholder="Last Name"
				onChange={updateData}
				value={userData.lastName}
				required
				name="lastName"
				onKeyPress={onpress}
				disabled={!editEnabled}
			/>
			<AppInput
				placeholder="Email"
				onChange={updateData}
				value={userData.email}
				required
				name="email"
				onKeyPress={onpress}
				disabled={!editEnabled}
			/>
			{(id || authState?.isAuthed) && (authState?.user?.role || 1) > 1 &&
				(
					<AppInput
						placeholder="Role"
						onChange={updateData}
						value={userData.role}
						required
						name="role"
						onKeyPress={onpress}
						type="number"
						min={1}
						max={authState?.user?.role || 1}
						disabled={!roleEnabled}
					/>
				)
			}
			{!id &&
				(
					<>
						<AppInput
							placeholder="Password"
							onChange={updateData}
							value={userData.password}
							isPassword
							type="password"
							required
							name="password"
							onKeyPress={onpress}
						/>
						<AppInput
							placeholder="Confirm Password"
							onChange={updateData}
							value={userData.passwordConf}
							isPassword
							type="password"
							required
							name="passwordConf"
							onKeyPress={onpress}
						/>
					</>
				)
			}
			<Button
				onClick={() => submit()}
				text={loading ? "Loading..." : id ? "Update" : "Create"}
				disabled={!hasChanged || !valid || loading}
			/>
		</FormBox>
	);
};

export default CreateEditUser;