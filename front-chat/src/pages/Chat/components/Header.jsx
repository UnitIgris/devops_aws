import React, {useContext, useEffect, useState} from "react";
import {jwtAuthTokenContext} from "../../../context/jwtAuthTokenContext";
import Cookies from "js-cookie";
import {useLocation} from "react-router-dom";
import pp from "assets/images/default-pp.jpeg";
import {useGetUser} from "../../../hooks/useApi";

const Header = ({ interlocutorId, openProfileSidebar }) => {
	const [authToken, setAuthToken] = useContext(jwtAuthTokenContext);
	const location = useLocation();
	const [interlocutor, setInterlocutor] = useState({});

	useEffect(() => {
		GetInterlocutor();
	}, [interlocutorId]);

	const GetInterlocutor = () => {
		useGetUser(interlocutorId).then((response) => {
			setInterlocutor(response.data.data);
		});
	}

	const disconnectUser = () => {
		Cookies.remove('authToken');
		Cookies.remove('user_id');
		setAuthToken('');
		if (location.pathname === '/') {
			window.location.reload();
		}
	}

	return (
		<header className="header chat__header">
			<div className="chat__avatar-wrapper">
				<img src={pp} alt={interlocutor.firstname} className="avatar" />
			</div>

			<div className="chat__contact-wrapper">
				<h2 className="chat__contact-name"> {interlocutor.firstname} {interlocutor.lastname}</h2>
				{/*<p className="chat__contact-desc">*/}
				{/*	{user.typing ? "typing..." : "online"}*/}
				{/*</p>*/}
			</div>

			<div className="menu-actions">
				<button onClick={openProfileSidebar}>
					Profil
				</button>
				<button onClick={disconnectUser}>
					Se déconnecter
				</button>
			</div>

		</header>
	);
};

export default Header;
