const VisiteurModel = require("../models/login.model");

const VisiteurController = {
  // Inscription visiteur
  async inscrireVisiteur(req, res) {
    try {
      const { nom, prenom, email, password, telephone, localite } = req.body;

      if (!nom || !prenom || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Les champs nom, prénom, email et mot de passe sont requis",
        });
      }

      // Vérifier si l'email existe déjà
      const emailExiste = await VisiteurModel.verifierEmailExiste(email);
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          error: "Cet email est déjà utilisé",
        });
      }

      const resultat = await VisiteurModel.creerVisiteur({
        nom,
        prenom,
        email,
        password,
        telephone,
        localite,
      });

      if (resultat.success) {
        res.status(201).json({
          success: true,
          message: "Visiteur inscrit avec succès",
          data: resultat.data,
        });
      } else {
        res.status(400).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur inscription visiteur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Connexion visiteur
  async connecterVisiteur(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email et mot de passe requis",
        });
      }

      const resultat = await VisiteurModel.connecterVisiteur(email, password);

      if (resultat.success) {
        // Définir le cookie de session
        res.cookie("visiteur_id", resultat.data.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24 heures
        });

        res.json({
          success: true,
          message: "Connexion réussie",
          data: resultat.data,
        });
      } else {
        res.status(401).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur connexion visiteur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Déconnexion visiteur
  async deconnecterVisiteur(req, res) {
    try {
      res.clearCookie("visiteur_id");
      res.json({
        success: true,
        message: "Déconnexion réussie",
      });
    } catch (error) {
      console.error("Erreur déconnexion visiteur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Obtenir tous les visiteurs
  async obtenirTousLesVisiteurs(req, res) {
    try {
      const resultat = await VisiteurModel.obtenirTousLesVisiteurs();

      if (resultat.success) {
        res.json({
          success: true,
          data: resultat.data,
        });
      } else {
        res.status(400).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur récupération visiteurs:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Obtenir un visiteur par ID
  async obtenirVisiteurParId(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID visiteur requis",
        });
      }

      const resultat = await VisiteurModel.obtenirVisiteurParId(id);

      if (resultat.success) {
        res.json({
          success: true,
          data: resultat.data,
        });
      } else {
        res.status(404).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur récupération visiteur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Obtenir les visiteurs par localité
  async obtenirVisiteursParLocalite(req, res) {
    try {
      const { localite } = req.params;

      if (!localite) {
        return res.status(400).json({
          success: false,
          error: "Localité requise",
        });
      }

      const resultat = await VisiteurModel.obtenirVisiteursParLocalite(
        localite
      );

      if (resultat.success) {
        res.json({
          success: true,
          data: resultat.data,
        });
      } else {
        res.status(400).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur récupération visiteurs par localité:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },
};

module.exports = VisiteurController;
