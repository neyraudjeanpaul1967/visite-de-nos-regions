const express = require("express");
const router = express.Router();

// CORRIGE LE NOM DU FICHIER - enlève le 's' à la fin
const VisiteurController = require("../controllers/login.controller");

// Routes pour les visiteurs
router.post("/inscription", VisiteurController.inscrireVisiteur);
router.post("/connexion", VisiteurController.connecterVisiteur);
router.post("/deconnexion", VisiteurController.deconnecterVisiteur);
router.get("/", VisiteurController.obtenirTousLesVisiteurs);
router.get("/:id", VisiteurController.obtenirVisiteurParId);
router.get(
  "/localite/:localite",
  VisiteurController.obtenirVisiteursParLocalite
);

module.exports = router;