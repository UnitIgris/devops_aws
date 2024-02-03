import React from "react";
import Icon from "components/Icon";
import {useSocketContext} from "../../../context/socketContext";

const attachButtons = [
	{ icon: "attachRooms", label: "Choose room" },
	{ icon: "attachContacts", label: "Choose contact" },
	{ icon: "attachDocument", label: "Choose document" },
	{ icon: "attachCamera", label: "Use camera" },
	{ icon: "attachImage", label: "Choose image" },
];

const ChatInput = ({
	showAttach,
	setShowAttach,
	newMessage,
	setNewMessage,
	submitNewMessage,
	chatId,
    loggedInUserId
}) => {
	const socket = useSocketContext();

	const detectEnterPress = (e) => {
		if (e.key === "Enter" || e.keyCode === 13) {
			submitNewMessage();
		}
	};

	const isTypingListener = (e) => {
		setNewMessage(e.target.value);

		if (e.target.value.length === 0) {
			socket.emit('stopTyping', chatId);
			return;
		}

		socket.emit('isTyping', {userId: loggedInUserId, chatId: chatId});
	};

	return (
		<div className="chat__input-wrapper">	
			<div className="pos-rel">
				<button aria-label="Attach" onClick={() => setShowAttach(!showAttach)}>
					<Icon
						id="attach"
						className={`chat__input-icon ${
							showAttach ? "chat__input-icon--pressed" : ""
						}`}
					/>
				</button>

				<div
					className={`chat__attach ${showAttach ? "chat__attach--active" : ""}`}
				>
					{attachButtons.map((btn) => (
						<button
							className="chat__attach-btn"
							aria-label={btn.label}
							key={btn.label}
						>
							<Icon id={btn.icon} className="chat__attach-icon" />
						</button>
					))}
				</div>
			</div>
			<input
				id={"messageInput"}
				className="chat__input"
				placeholder="Type a message"
				value={newMessage}
				onChange={(e) => isTypingListener(e)}
				onKeyDown={detectEnterPress}
			/>
			{newMessage ? (
				<button aria-label="Send message" onClick={submitNewMessage}>
					<Icon id="send" className="chat__input-icon" />
				</button>
			) : (
				null
			)}
		</div>
	);
};

export default ChatInput;
