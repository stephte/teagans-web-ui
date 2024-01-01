import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getUsers } from "../data/user";
import Button from "../components/button";
import "./users.scss";

const UserBox = ({ id, firstName, lastName, email, role }) => {
	const navigate = useNavigate();

	return (
		<div
			className="panel"
			onClick={() => {
				navigate(`/users/${id}`);
			}}
		>
			<p>First Name: <b>{firstName}</b></p>
			<p>Last Name: <b>{lastName}</b></p>
			<p>Email: <b>{email}</b></p>
			<p>Role: <b>{role}</b></p>
		</div>
	);
};

const Users = () => {
	const [queryParams, setQueryParams] = useSearchParams();
	const [users, setUsers] = useState([]);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		// get users
		getUsers(queryParams.get("limit") || "", queryParams.get("page") || "").then((res) => {
			setUsers(res.data.rows);
			const { limit, page, sort } = res.data;
			setQueryParams({ limit, page, sort });
			setTotalPages(res.data.totalPages);
		})
	}, [queryParams]);

	const nextAv = () => {
		return +queryParams.get("page") < totalPages;
	};

	const prevAv = () => {
		return +queryParams.get("page") > 1;
	};

	return (
		<users-page>
			{/*put page-size/num/info here*/}
			<div className="pagination-details">
				<span>page size: {queryParams.get("limit")}</span>
				<span>total pages: {totalPages}</span>
				<span>page num: {queryParams.get("page")}</span>
				<span
					className={prevAv() ? "clickable" : "disabled"}
					onClick={() => {
						if (!prevAv()) return;
						queryParams.set("page", +queryParams.get("page") - 1);
						setQueryParams(queryParams);
					}}
				>
					prev page
				</span>
				<span
					className={nextAv() ? "clickable" : "disabled"}
					onClick={() => {
						if (!nextAv()) return;
						queryParams.set("page", +queryParams.get("page") + 1);
						setQueryParams(queryParams);
					}}
				>
					next page
				</span>
			</div>
			{users.map((user) => {
				return (
					<UserBox key={user.id} {...user} />
				);
			})}
		</users-page>
	);
};

export default Users;