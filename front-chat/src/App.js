import React, { useEffect, useState } from "react";
import "./App.css";
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Sidebar from "components/Sidebar";
import Chat from "pages/Chat";
import NeedAuth from "./NeedAuth";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


const userPrefersDark =
	window.matchMedia &&
	window.matchMedia("(prefers-color-scheme: dark)").matches;

function App() {
	const [appLoaded, setAppLoaded] = useState(false);
	const [startLoadProgress, setStartLoadProgress] = useState(false);

	useEffect(() => {
		if (userPrefersDark) document.body.classList.add("dark-theme");
		stopLoad();
	}, []);

	const stopLoad = () => {
		setStartLoadProgress(true);
		setTimeout(() => setAppLoaded(true), 3000);
	};

	if (!appLoaded) return <Loader done={startLoadProgress} />;

	return (
		<div className="app">
			<p className="app__mobile-message"> LOADER APP. </p>
			<Router>
				<Routes>
					<Route path="/" element={
						<NeedAuth>
							<div className="app-content">
								<Sidebar />
								<Home />
							</div>
						</NeedAuth>
					} />
					<Route path="/chat/:id" element={
						<NeedAuth>
							<div className="app-content">
								<Sidebar />
								<Chat />
							</div>
						</NeedAuth>
					} />

					<Route path="/se-connecter" element={<Login />} />
					<Route path="/inscription" element={<SignUp />} />
				</Routes>

			</Router>
		</div>
	);
}

export default App;
