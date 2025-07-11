const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir les fichiers statiques
app.use(express.static("public"));
app.use("/assets", express.static("assets"));

// AJOUTE CES REDIRECTIONS POUR LES URLs SANS .html
app.get("/login", (req, res) => {
  res.redirect("/login.html");
});

app.get("/loginguide", (req, res) => {
  res.redirect("/loginguide.html");
});

app.get("/event", (req, res) => {
  res.redirect("/event.html");
});

app.get("/commentaire", (req, res) => {
  res.redirect("/commentaire.html");
});

// Routes API
const routes = require("./routes/");
app.use("/", routes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
