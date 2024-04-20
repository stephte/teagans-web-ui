import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserRole } from "../utilities/enums.ts";
import AppInput from "../components/app-input";
import Button from "../components/button";
import FormBox from "../components/form-box";
import { createUser, getUser, updateUser } from "../data/user";
import useAuthStore from "../stores/auth-store";
import AppSelect from "../components/app-select.js";

const CreateEditUser = () => {
	const currentUser = useAuthStore(state => state.user);
	const isAuthed = useAuthStore(state => state.isAuthed);
	const updateCurrentUser = useAuthStore(state => state.updateUser);
	const loginUser = useAuthStore((authState) => authState.login);

	const { id } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [valid, setValid] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [hasChanged, setHasChanged] = useState(false);
	const [userRole, setUserRole] = useState(UserRole.Regular); // used to keep track of original user role
	const [editEnabled, setEditEnabled] = useState(false);
	const [roleEnabled, setRoleEnabled] = useState(false);
	const [subLinks, setSublinks] = useState([]);
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConf: "",
		role: UserRole.Regular
	});

	useEffect(() => {
		let { firstName, lastName, email, password, passwordConf } = userData;
		const currentRole = currentUser?.role || UserRole.Regular;
		setValid(editEnabled && firstName && lastName && email && currentRole >= userData.role && ((id) || (password && (password === passwordConf))));
	}, [id, userData, editEnabled, currentUser?.role]);

	useEffect(() => {
		if (currentUser && (id === "current" || id === currentUser.id)) {
			setUserData({ ...currentUser });
			setUserRole(currentUser.role);
		} else if (id) {
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
				role: UserRole.Regular
			});
			setUserRole(UserRole.Regular);
		}
	}, [id, currentUser]);

	useEffect(() => {
		const currentRole = currentUser?.role || UserRole.Regular;
		setEditEnabled(!id || (id === "current" || id === currentUser?.id) || (currentRole > UserRole.Admin || (currentRole >= UserRole.Admin && userRole <= UserRole.Regular)));
		if (currentRole) {
			setRoleEnabled(currentRole >= UserRole.SuperAdmin || (currentRole >= UserRole.Admin && userRole <= UserRole.Regular));
		}
	}, [id, userRole, currentUser])

	useEffect(() => {
		if (id && editEnabled) {
			setSublinks([
				{
					to: `/delete-user/${id}`,
					text: "Delete User"
				}
			]);
		} else if (!id && !isAuthed) {
			setSublinks([
				{
					to: "/login",
					text: "Already have an account? Login."
				}
			]);
		} else {
			setSublinks([]);
		}
	}, [id, editEnabled, isAuthed]);


	const updateData = ({ target }) => {
		const name = target.name;
		let value = target.value;

		if (name === "role") {
			value = UserRole[value];
		} else if (target.type === "number") {
			value = +value;
		}

		let obj = { ...userData };
		obj[name] = value;

		setUserData(obj);
		setHasChanged(true);
	};

	const submit = () => {
		if (!valid) {
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
					updateCurrentUser(res.data);
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
				if (isAuthed) {
					navigate("/users");
					setLoading(false);
				} else {
					loginUser(data.email, data.password, userRes.data)
						.then(() => {
							navigate("/");
							setLoading(false);
						}).catch((err) => {
							handleErrRes(err);
						});
				}
			}).catch((err) => {
				handleErrRes(err);
			});
	};

	const handleErrRes = (err) => {
		console.log(err);
		if (err?.response?.data?.error) {
			setErrMsg(err.response.data.error);
		} else {
			setErrMsg("Error with request");
		}
		setLoading(false);
	};

	const onPress = (e) => {
		if (e.key === 'Enter') {
			submit();
		}
	};

	return (
		<FormBox errMsg={errMsg} subLinks={subLinks} isLoading={loading}>
			<h2>{id ? "Edit User" : "Create Account"}</h2>
			<AppInput
				label="First Name"
				placeholder="First Name"
				onChange={updateData}
				value={userData.firstName}
				required
				name="firstName"
				onKeyDown={onPress}
				disabled={!editEnabled}
			/>
			<AppInput
				label="Last Name"
				placeholder="Last Name"
				onChange={updateData}
				value={userData.lastName}
				required
				name="lastName"
				onKeyDown={onPress}
				disabled={!editEnabled}
			/>
			<AppInput
				label="Email"
				placeholder="Email"
				onChange={updateData}
				value={userData.email}
				required
				name="email"
				onKeyDown={onPress}
				disabled={!editEnabled}
			/>
			{(id || isAuthed) && (currentUser?.role || UserRole.Regular) > UserRole.Regular &&
				(
					<AppSelect
						label="User Role"
						onChange={updateData}
						selectedValue={UserRole[userData.role]}
						name="role"
						enumObj={UserRole}
						disabled={!roleEnabled}
					/>
				)
			}
			{!id &&
				(
					<>
						<AppInput
							label="Password"
							placeholder="Password"
							onChange={updateData}
							value={userData.password}
							type="password"
							required
							name="password"
							onKeyDown={onPress}
						/>
						<AppInput
							label="Confirm Password"
							placeholder="Confirm Password"
							onChange={updateData}
							value={userData.passwordConf}
							type="password"
							required
							name="passwordConf"
							onKeyDown={onPress}
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