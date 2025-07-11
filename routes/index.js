const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Import des routes - CORRIGE LE NOM DU FICHIER
const visiteursRoutes = require("./login.route");
const commentairesRoutes = require("./commentaires.routes"); // Ajouter .routes

// Utiliser les routes
router.use("/api/visiteurs", visiteursRoutes);
router.use("/api/commentaires", commentairesRoutes);

// API pour rechercher ville et monuments
router.get("/api/ville-monuments", async (req, res) => {
  const ville = req.query.ville;
  if (!ville) return res.status(400).json({ error: "Ville requise" });

  try {
    const villeResponse = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
        ville
      )}&fields=nom,code,departement&boost=population&limit=1`
    );
    const villeData = await villeResponse.json();
    if (!villeData.length)
      return res.status(404).json({ error: "Ville non trouvée" });
    const villeObj = villeData[0];

    const monumentsResponse = await fetch(
      `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=${encodeURIComponent(
        villeObj.nom
      )}&rows=20`
    );
    const monumentsData = await monumentsResponse.json();

    res.json({
      ville: villeObj,
      monuments: (monumentsData.records || []).map((record) => ({
        nom:
          record.fields.tico ||
          record.fields.denomination ||
          record.fields.appellation ||
          "Monument sans nom",
        type: "Monument historique",
        adresse:
          record.fields.adrs || record.fields.lieu || "Adresse non spécifiée",
        periode:
          record.fields.scle || record.fields.epoque || "Période non spécifiée",
        protection: record.fields.ppro || "Type de protection non spécifié",
      })),
    });
  } catch (error) {
    console.error("Erreur API ville-monuments:", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
});

// Route de test
router.get("/test", (req, res) => {
  res.json({ message: "API fonctionnelle" });
});

module.exports = router;
