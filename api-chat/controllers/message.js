/** Import des module nécessaires */
const DB = require("../db.config");
const Message = DB.Message;
const Chat = DB.Chat;
const User = DB.User;

exports.getMyMessages = async (req, res) => {
	try {
		const userId = req.decodedToken.id;
		const user = await User.findByPk(userId);

		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable." });
		}
		// Récupérer tous les messages de l'utilisateur
		const messages = await Message.findAll({
			include: [
				{
					model: User,
					attributes: ["id", "firstname", "lastname", "email"],
				},
				{
					model: Chat,
					attributes: ["id"],
				},
			],
			where: {
				UserId: userId,
			},
		});
		return res.json({ data: messages });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.getMessage = async (req, res) => {
	try {
		let messageId = parseInt(req.params.id);

		/** Validation des données reçues */
		if (!messageId) {
			return res.json(400).json({ message: "Paramètres manquants." });
		}

		let message = await Message.findOne({ where: { id: messageId } });

		/** Vérification de l'existance du message */
		if (message === null) {
			return res.status(404).json({ message: "Message introuvable." });
		}

		/** Message trouvé & réponse */
		return res.json({ data: message });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.updateMessage = async (req, res) => {
	try {
		let messageId = parseInt(req.params.id);
		const userId = req.decodedToken.id;
		const { content } = req.body;

		/** Vérification de la presence et cohérence du champ id */
		if (!messageId || !content) {
			return res.status(400).json({ message: "Données manquantes." });
		}

		let message = await Message.findOne({
			where: { id: messageId },
		});

		/** Vérification de l'existance du message */
		if (message === null) {
			return res.status(404).json({ message: `Message introuvable` });
		}

		/** Vérification si l'utilisateur est l'auteur du message */
		if (message.UserId !== parseInt(userId)) {
			return res.status(403).json({ message: "Accès non autorisé." });
		}

		/** Création du message & réponse */
		await message.update({ content });

		return res.json({ message: "le message à été mis à jour.", data: message });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.createMessage = async (req, res) => {
	try {
		
		const { content, chatId } = req.body;
		const userId = req.decodedToken.id;

	

		/** Validation des données */
		if (!content || !chatId) {
			return res.status(400).json({ message: "Données manquantes." });
		}

		const chat = await Chat.findOne({ where: { id: chatId } });

		/** Vérification de l'existance du chat */
		if (!chat) {
			return res.status(404).json({ message: "Chat introuvable." });
		}

		const user = await User.findOne({ where: { id: userId } });

		/** Vérification de l'existance du chat */
		if (!user) {
			return res.status(404).json({ message: "Utilisateur introuvable." });
		}

		/** Vérification si l'utilisateur est bien dans le chat */
		const userInChat = await chat.hasUser(userId);

		if (!userInChat) {
			return res.status(403).json({ message: `L'utilisateur n'appartient pas au chat.` });
		}

		/** Creation du message */
		const message = await Message.create({
			content,
		});
		await chat.addMessage(message);
		await user.addMessage(message);

		return res.json({ message: "Message Crée.", data: message });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.deleteMessage = async (req, res) => {
	try {
		let messageId = parseInt(req.params.id);
		const userId = req.decodedToken.id;

		/** Vérification si le champ id est présent et cohérent */
		if (!messageId) {
			return res.status(400).json({ message: "Données manquantes." });
		}

		/** Vérification de l'existance du message */
		const message = await Message.findOne({ where: { id: messageId } });

		if (!message) {
			return res.status(404).json({ message: "Message introuvable." });
		}

		/** Vérification si l'utilisateur est l'auteur du message */
		if (message.UserId !== parseInt(userId)) {
			return res.status(403).json({ message: "Accès non autorisé." });
		}

		/** Suppression du message & réponse */
		message.destroy();

		res.status(204).json({ message: "Message supprimé." });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};
