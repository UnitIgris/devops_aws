import React, {useEffect, useState} from "react";
import "./styles/main.css";
import logo from "assets/images/wa-icon.png";
import Contact from "./Contact";
import {useGetUsers} from "../../hooks/useApi";
import Cookies from "js-cookie";

const Sidebar = () => {
	const [contacts, setContacts] = useState([]);
	const loggedInUserId = Cookies.get("user_id");

	useEffect(() => {
		GetUsersList();
	}, []);

	const GetUsersList = (event) => {
		useGetUsers().then((response) => {
			let contacts = response.data.data.filter((user) => user.id !== parseInt(loggedInUserId));
			setContacts(contacts);
		}).catch(error => {
			console.error(error.response.data.message);
		});
	};

	return (
		<aside className="sidebar">
			<header className="header">
				<div className="sidebar__avatar-wrapper">
					<img src={logo} alt="Karen Okonkwo" className="avatar" />
				</div>
				Whatsapp 2.0
			</header>
			
			<div className="sidebar__contacts">
				{contacts.map((contact, index) => (
					<Contact key={index} contact={contact} />
				))}
			</div>
		</aside>
	);
};

export default Sidebar;
