/** Import des modules nécessaires */
const jwt = require("jsonwebtoken");
const DB = require("../db.config");
const User = DB.User;
bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		/** Validation des données reçues */
		if (!email || !password) {
			return res.status(400).json({ message: "Email ou mot de passe erroné." });
		}

		let user = await User.findOne({ where: { email: email }, raw: true });

		/** Vérification de l'existance de l'Utilisateur */
		if (user === null) {
			return res.status(404).json({ message: `Utilisateur Introuvable.` });
		}

		bcrypt.compare(password, user.password)
			.then(test => {
				if(!test){
					return res.status(401).json({ message: 'Mot de passe érroné'})
				}

				// Génération du token
				const token = jwt.sign({
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email
				}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING})

				return res.json({access_token: token,user_id:user})


			})
			.catch(err => res.status(500).json({message: 'Login process failed', error: err}))

	} catch (err) {
		res.status(500).json({ message: "Erreur de Base de Données.", error: err });
	}
};

exports.register = async (req, res) => {
	try {
		const { firstname, lastname, email, password } = req.body;

		/** Validation des données reçues */
		if (!firstname || !lastname || !email || !password) {
			return res.status(400).json({ message: "Données manquantes." });
		}

		let user = await User.findOne({ where: { email: email }, raw: true });

		/** Vérification de l'existance de l'Utilisateur (email) */
		if (user !== null) {
			return res.status(409).json({ message: `L'adresse email ${email} est déja utilisée.` });
		}

		/** Création du compte & réponse */
		await User.create(req.body);

		return res.json({ message: "Votre compte a bien été crée.", data: user });
	} catch (err) {
		res.status(500).json({ message: "Erreur de base de données", error: err });
	}
};
