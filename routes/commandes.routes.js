const express = require('express');
const router = express.Router();
const CommentaireController = require('../controllers/commentaire.controllers');

// Routes pour les commentaires sur les guides
router.post('/guides', CommentaireController.ajouterCommentaireGuide);
router.get('/guides/:guide_id', CommentaireController.obtenirCommentairesGuide);
router.get('/guides/:guide_id/moyenne', CommentaireController.obtenirNoteMoyenneGuide);

// Routes pour les commentaires sur les monuments
router.post('/monuments', CommentaireController.ajouterCommentaireMonument);
router.get('/monuments/:monument_nom', CommentaireController.obtenirCommentairesMonument);
router.get('/monuments/:monument_nom/moyenne', CommentaireController.obtenirNoteMoyenneMonument);

// Routes pour les commentaires d'un visiteur
router.get('/visiteur/:visiteur_id', CommentaireController.obtenirCommentairesVisiteur);

module.exports = router;