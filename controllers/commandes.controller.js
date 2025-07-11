const CommentaireModel = require("../models/commentaire.model");

const CommentaireController = {
  // Ajouter un commentaire sur un guide
  async ajouterCommentaireGuide(req, res) {
    try {
      const { guide_id, commentaire, note } = req.body;
      const visiteur_id = req.cookies.visiteur_id || req.body.visiteur_id;

      if (!visiteur_id || !guide_id || !commentaire || !note) {
        return res.status(400).json({
          success: false,
          error:
            "Tous les champs sont requis (visiteur_id, guide_id, commentaire, note)",
        });
      }

      if (note < 1 || note > 5) {
        return res.status(400).json({
          success: false,
          error: "La note doit être comprise entre 1 et 5",
        });
      }

      const resultat = await CommentaireModel.ajouterCommentaireGuide({
        visiteur_id,
        guide_id,
        commentaire,
        note,
      });

      if (resultat.success) {
        res.status(201).json({
          success: true,
          message: "Commentaire sur le guide ajouté avec succès",
          data: resultat.data,
        });
      } else {
        res.status(400).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur ajout commentaire guide:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Ajouter un commentaire sur un monument
  async ajouterCommentaireMonument(req, res) {
    try {
      const { monument_nom, commentaire, note } = req.body;
      const visiteur_id = req.cookies.visiteur_id || req.body.visiteur_id;

      if (!visiteur_id || !monument_nom || !commentaire || !note) {
        return res.status(400).json({
          success: false,
          error:
            "Tous les champs sont requis (visiteur_id, monument_nom, commentaire, note)",
        });
      }

      if (note < 1 || note > 5) {
        return res.status(400).json({
          success: false,
          error: "La note doit être comprise entre 1 et 5",
        });
      }

      const resultat = await CommentaireModel.ajouterCommentaireMonument({
        visiteur_id,
        monument_nom,
        commentaire,
        note,
      });

      if (resultat.success) {
        res.status(201).json({
          success: true,
          message: "Commentaire sur le monument ajouté avec succès",
          data: resultat.data,
        });
      } else {
        res.status(400).json({
          success: false,
          error: resultat.error,
        });
      }
    } catch (error) {
      console.error("Erreur ajout commentaire monument:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Récupérer les commentaires d'un guide
  async obtenirCommentairesGuide(req, res) {
    try {
      const { guide_id } = req.params;

      if (!guide_id) {
        return res.status(400).json({
          success: false,
          error: "ID du guide requis",
        });
      }

      const resultat = await CommentaireModel.obtenirCommentairesGuide(
        guide_id
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
      console.error("Erreur récupération commentaires guide:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Récupérer les commentaires d'un monument
  async obtenirCommentairesMonument(req, res) {
    try {
      const { monument_nom } = req.params;

      if (!monument_nom) {
        return res.status(400).json({
          success: false,
          error: "Nom du monument requis",
        });
      }

      const resultat = await CommentaireModel.obtenirCommentairesMonument(
        decodeURIComponent(monument_nom)
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
      console.error("Erreur récupération commentaires monument:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Récupérer tous les commentaires d'un visiteur
  async obtenirCommentairesVisiteur(req, res) {
    try {
      const { visiteur_id } = req.params;
      const currentVisiteurId = req.cookies.visiteur_id;

      if (!visiteur_id) {
        return res.status(400).json({
          success: false,
          error: "ID du visiteur requis",
        });
      }

      // Vérifier que le visiteur peut voir ses propres commentaires
      if (visiteur_id !== currentVisiteurId) {
        return res.status(403).json({
          success: false,
          error: "Accès non autorisé",
        });
      }

      const resultat = await CommentaireModel.obtenirCommentairesVisiteur(
        visiteur_id
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
      console.error("Erreur récupération commentaires visiteur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Obtenir la note moyenne d'un guide
  async obtenirNoteMoyenneGuide(req, res) {
    try {
      const { guide_id } = req.params;

      if (!guide_id) {
        return res.status(400).json({
          success: false,
          error: "ID du guide requis",
        });
      }

      const resultat = await CommentaireModel.obtenirNoteMoyenneGuide(guide_id);

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
      console.error("Erreur calcul note moyenne guide:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },

  // Obtenir la note moyenne d'un monument
  async obtenirNoteMoyenneMonument(req, res) {
    try {
      const { monument_nom } = req.params;

      if (!monument_nom) {
        return res.status(400).json({
          success: false,
          error: "Nom du monument requis",
        });
      }

      const resultat = await CommentaireModel.obtenirNoteMoyenneMonument(
        decodeURIComponent(monument_nom)
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
      console.error("Erreur calcul note moyenne monument:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  },
};

module.exports = CommentaireController;