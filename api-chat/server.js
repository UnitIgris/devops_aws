/** Import des modules nécessaires */
const express = require("express");
const cors = require("cors");
const checkTokenMiddleware = require("./jsonwebtoken/check");

const socketIO = require('socket.io');
const Message = require("./models/message");

/** Import de la connexion à la DB */
let DB = require("./db.config");

/** Démarrage serveur avec test DB */
DB.sequelize
	.authenticate()
	.then(() => console.log("Connexion à la base de données OK."))
	.catch((err) => {
		console.log("Erreur de la connexion à la base de données.", err);
		process.exit(1);
	});

/** Initialisation de l'API */
const app = express();
const server = app.listen(process.env.SERVER_PORT, () => {
	console.log(`Le serveur s'exécute sur le port ${process.env.SERVER_PORT}.`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Import des modules de routage */
const user_router = require("./routes/users");
const chat_router = require("./routes/chats");
const message_router = require("./routes/messages");

const auth_router = require("./routes/auth");

/** Mise en place du routage */
app.get("/", (req, res) => res.send("Bienvenue sur l'API CHAT !"));

app.use("/users", checkTokenMiddleware, user_router);
app.use("/chats", checkTokenMiddleware, chat_router);
app.use("/messages", checkTokenMiddleware, message_router);

app.use("/auth", auth_router);

app.get("*", (req, res) => res.status(501).send("Rien par ici."));

const io = socketIO(server, {
	cors: {
		origin: [
			"http://localhost:3000",
			`${process.env.REACT_APP_API_URL}`
		],
	}
});

io.on('connection', (socket) => {
	console.log('A user connected');

	socket.on('joinRoom', (chatId) => {
		console.log(`User joined room ${chatId}`)
		socket.join(chatId);
	});

	socket.on('newMessage', (data) => {
		io.to(data.chatId).emit('messageToDispatch', {message: data.message, chatId: data.chatId});
	});

	socket.on('updateMessage', (data) => {
		io.to(data.chatId).emit('updatedMessageToDispatch', {message: data.message, chatId: data.chatId});
	});

	socket.on('deleteMessage', (data) => {
		io.to(data.chatId).emit('deletedMessageToDispatch', {messageId: data.messageId, chatId: data.chatId});
	});

	socket.on('isTyping', (data) => {
		io.to(data.chatId).emit('isTypingDispatch', {userId: data.userId, chatId: data.chatId});
	});

	socket.on('stopTyping', (chatId) => {
		io.to(chatId).emit('stopTypingDispatch', chatId);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});