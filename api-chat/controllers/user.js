/** Import des module nécessaires */
const DB = require("../db.config");
const User = DB.User;

exports.getAllUsers = (req, res) => {
	User.findAll()
		.then((users) => res.json({ data: users }))
		.catch((err) => res.status(500).json({ message: "Erreur de Base de Données.", error: err }));
};

exports.getUser = async (req, res) => {
	try {
		let userId = parseInt(req.params.id);

		/** Validation des données reçues */
		if (!userId) {
			return res.json(400).json({ message: "Paramètres manquants." });
		}

		let user = await User.findOne({ where: { id: userId } });

		/** Vérification de l'existance de l'utilisateur */
		if (user === null) {
			return res.status(404).json({ message: "Utilisateur introuvable." });
		}

		/** Utilisateur trouvé & réponse */
		return res.json({ data: user });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.updateMyProfile = async (req, res) => {
	try {
		const { lastname, firstname, email } = req.body;

		/** Validation des données reçues */
		if (!email || !firstname || !lastname) {
			return res.status(400).json({ message: "Paramètres manquants" });
		}

		let user = await User.findOne({ where: { email: email }, raw: true });
		if (user !== null && user.id !== req.decodedToken.id) {
			return res.status(409).json({ message: "Adresse Email déja utilisée" });
		}

		let updatedUser = {
			lastname: lastname,
			firstname: firstname,
			email: email,
		};

		await User.update(updatedUser, { where: { id: req.decodedToken.id } });
		return res.json({ message: "le profil à été mis à jour." });
	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};
