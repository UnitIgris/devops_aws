import Icon from "components/Icon";
import React from "react";
import formatTime from "../../../utils/formatTime";
import {useDeleteMessage} from "../../../hooks/useApi";
import {useSocketContext} from "../../../context/socketContext";

const Convo = ({ messages, setMessages, loggedInUserId , setEditMode, setEditedMessageId, setNewMessage, chatId }) => {
	const socket = useSocketContext();

	const DeleteMessage = (messageId) => {
		useDeleteMessage(messageId).then(() => {
			setMessages(messages.filter((message) => message.id !== messageId));
			socket.emit('deleteMessage', {messageId: messageId, chatId: chatId});
		});
	}

	const UpdateMessage = (messageId, content) => {
		setEditMode(true);
		setEditedMessageId(messageId);
		setNewMessage(content);

		// setTimeout pour assurer que le champ de saisie est rendu avant de définir la sélection
		setTimeout(() => {
			const input = document.getElementById("messageInput");
			input.selectionStart = input.selectionEnd = input.value.length;
			input.focus();
		}, 0);
	}

	return (
		<div className="chat__msg-group">
			{messages && messages.map((message, msgIndex) => (
				<React.Fragment key={msgIndex}>
					{ message.UserId !== loggedInUserId ? (
						<div className="chat__msg chat__msg--rxd">
							<div>
								<span>{message.content}</span>
								<span className="chat__msg-filler"></span>
							</div>
							<span className="chat__msg-footer-left">
									{message.createdAt !== message.updatedAt ?
										formatTime(message.updatedAt) + " (modifié)" :
										formatTime(message.createdAt)
									}
							</span>
						</div>
						) : (
							<div className="chat__msg chat__msg--sent">
								<div>
									<span>{message.content}</span>
									<span className="chat__msg-filler"></span>
									<div aria-label="Message options" className="chat__msg-options">
										<div>
											<Icon id="downArrow" className="chat__msg-options-icon" />
											<div className="chat__msg-options-menu">
												<button onClick={() => DeleteMessage(message.id)}>Supprimer</button>
												<button onClick={() => UpdateMessage(message.id, message.content)}>Modifier</button>
											</div>
										</div>
									</div>
								</div>
								<span className="chat__msg-footer-right">
									{message.createdAt !== message.updatedAt ?
										formatTime(message.updatedAt) + " (modifié)" :
										formatTime(message.createdAt)
									}
								</span>
							</div>
						)}
				</React.Fragment>
			))}
		</div>
	);
};

export default Convo;
