// Menu burger mobile
document.querySelector(".burger").onclick = function () {
  document.querySelector("nav ul").classList.toggle("show");
};

document.querySelectorAll("nav ul li a").forEach((link) => {
  link.onclick = () =>
    document.querySelector("nav ul").classList.remove("show");
});

// (Optionnel) Alertes pour les boutons valider - seulement si les éléments existent
const validerCommentGuide = document.getElementById("validerCommentGuide");
if (validerCommentGuide) {
  validerCommentGuide.onclick = () => {
    alert("Commentaire sur le guide envoyé !");
  };
}

const validerNoteGuide = document.getElementById("validerNoteGuide");
if (validerNoteGuide) {
  validerNoteGuide.onclick = () => {
    alert("Note du guide envoyée !");
  };
}

const validerCommentMonument = document.getElementById(
  "validerCommentMonument"
);
if (validerCommentMonument) {
  validerCommentMonument.onclick = () => {
    alert("Commentaire sur le monument envoyé !");
  };
}

const validerNoteMonument = document.getElementById("validerNoteMonument");
if (validerNoteMonument) {
  validerNoteMonument.onclick = () => {
    alert("Note du monument envoyée !");
  };
}
