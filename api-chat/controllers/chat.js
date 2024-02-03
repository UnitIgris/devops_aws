const DB = require("../db.config");
const Chat = DB.Chat;
const User = DB.User;
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const Message = DB.Message;

exports.getMyChats = (req, res) => {
	Chat.findAll({ include: Message })
		.then((chats) => res.json({ data: chats }))
		.catch((err) => res.status(500).json({ message: "Erreur de Base de Données.", error: err }));
};

exports.getChatByUsers = async (req, res) => {
	try {
		const { userIds } = req.body;

		// Vérifiez que userIds est défini et est une chaîne
		if (!userIds) {
			return res.status(400).json({ message: "Invalid userIds 1" });
		}

		// Convertissez la chaîne JSON en tableau d'entiers
		let userIdsArray;
		try {
			userIdsArray = JSON.parse(userIds);
		} catch (error) {
			return res.status(400).json({ message: "Invalid userIds 2" });
		}

		// Vérifiez que les identifiants sont du bon type (entier)
		const userIdsInt = userIdsArray.map((id) => parseInt(id)).filter((id) => !isNaN(id));

		if (userIdsInt.length !== userIdsArray.length) {
			// Certains identifiants ne sont pas des entiers valides
			const invalidUserIds = userIdsArray.filter((id) => !userIdsInt.includes(parseInt(id)));
			return res.status(400).json({ message: "Invalid userIds 3", invalidUserIds });
		}

		// Vérifiez si tous les utilisateurs existent
		const usersExist = await User.findAll({
			where: {
				id: userIdsInt,
			},
		});

		if (usersExist.length !== userIdsInt.length) {
			// Certains utilisateurs n'existent pas
			const invalidUserIds = userIdsInt.filter((id) => !usersExist.some((user) => user.id === id));
			return res.status(400).json({ message: "Invalid userIds 4", invalidUserIds });
		}

		// Vérifiez si un chat existe déjà entre les deux utilisateurs
		const existingChat = await Chat.findOne({
			where: {
				id: {
					[Op.in]: [
						sequelize.literal(
							`SELECT ChatId FROM Userchat WHERE UserId IN (${userIdsArray.join(
								","
							)}) GROUP BY ChatId HAVING COUNT(DISTINCT UserId) = ${userIdsArray.length}`
						),
					],
				},
			},
			include: {model: Message}
		});

		if (!existingChat) {
			return res.status(400).json({ message: "Aucun chat existe entre les utilisateurs", status: 400});
		}

		/** Chat trouvé & réponse */
		return res.json({ data: existingChat });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.createChat = async (req, res) => {
	try {
		const { userIds } = req.body;

		// Vérifiez que userIds est défini et est une chaîne
		if (!userIds || typeof userIds !== "string") {
			return res.status(400).json({ message: "Invalid userIds" });
		}

		// Convertissez la chaîne JSON en tableau d'entiers
		let userIdsArray;
		try {
			userIdsArray = JSON.parse(userIds);
		} catch (error) {
			return res.status(400).json({ message: "Invalid userIds" });
		}

		// Vérifiez que les identifiants sont du bon type (entier)
		const userIdsInt = userIdsArray.map((id) => parseInt(id)).filter((id) => !isNaN(id));

		if (userIdsInt.length !== userIdsArray.length) {
			// Certains identifiants ne sont pas des entiers valides
			const invalidUserIds = userIdsArray.filter((id) => !userIdsInt.includes(parseInt(id)));
			return res.status(400).json({ message: "Invalid userIds", invalidUserIds });
		}

		// Vérifiez si tous les utilisateurs existent
		const usersExist = await User.findAll({
			where: {
				id: userIdsInt,
			},
		});

		if (usersExist.length !== userIdsInt.length) {
			// Certains utilisateurs n'existent pas
			const invalidUserIds = userIdsInt.filter((id) => !usersExist.some((user) => user.id === id));
			return res.status(400).json({ message: "Invalid userIds", invalidUserIds });
		}

		// Vérifiez si un chat existe déjà entre les deux utilisateurs
		const existingChat = await Chat.findOne({
			where: {
				id: {
					[Op.in]: [
						sequelize.literal(
							`SELECT ChatId FROM Userchat WHERE UserId IN (${userIdsArray.join(
								","
							)}) GROUP BY ChatId HAVING COUNT(DISTINCT UserId) = ${userIdsArray.length}`
						),
					],
				},
			},
		});

		if (existingChat) {
			return res.status(400).json({ message: "Chat already exists between the users" });
		}

		// Créez le chat
		const chat = await Chat.create();

		// Associez les utilisateurs au chat via la table de liaison UserChat
		await chat.addUsers(userIdsInt);

		res.json({ message: "Chat created successfully", data: chat});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
