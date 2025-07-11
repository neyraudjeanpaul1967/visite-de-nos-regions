document.addEventListener("DOMContentLoaded", function () {
  // Vérifier si l'utilisateur est connecté
  const userData = localStorage.getItem("user");
  let currentUser = null;

  if (userData) {
    try {
      currentUser = JSON.parse(userData);
    } catch (error) {
      console.error("Erreur parsing user data:", error);
    }
  }

  // Gestion du commentaire sur le guide
  const btnCommentGuide = document.getElementById("validerCommentGuide");
  if (btnCommentGuide) {
    btnCommentGuide.addEventListener("click", async function () {
      if (!currentUser) {
        alert("Vous devez être connecté pour laisser un commentaire");
        return;
      }

      const guideSelect = document.getElementById("guideSelect");
      const commentaireGuide = document.getElementById("commentaireGuide");

      if (!guideSelect || !commentaireGuide) {
        alert("Erreur: éléments du formulaire introuvables");
        return;
      }

      const guide_id = guideSelect.value;
      const commentaire = commentaireGuide.value.trim();

      if (!guide_id || !commentaire) {
        alert("Veuillez sélectionner un guide et saisir un commentaire");
        return;
      }

      try {
        const response = await fetch("/api/commentaires/guides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visiteur_id: currentUser.id,
            guide_id: guide_id,
            commentaire: commentaire,
            note: 5, // Note par défaut
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Commentaire sur le guide envoyé avec succès !");
          commentaireGuide.value = "";
          guideSelect.value = "";
        } else {
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi du commentaire");
      }
    });
  }

  // Gestion de la note du guide
  const btnNoteGuide = document.getElementById("validerNoteGuide");
  if (btnNoteGuide) {
    btnNoteGuide.addEventListener("click", async function () {
      if (!currentUser) {
        alert("Vous devez être connecté pour noter un guide");
        return;
      }

      const guideSelectNote = document.getElementById("guideSelectNote");
      const noteGuide = document.getElementById("noteGuide");

      if (!guideSelectNote || !noteGuide) {
        alert("Erreur: éléments du formulaire introuvables");
        return;
      }

      const guide_id = guideSelectNote.value;
      const note = parseInt(noteGuide.value);

      if (!guide_id || !note) {
        alert("Veuillez sélectionner un guide et une note");
        return;
      }

      if (note < 1 || note > 5) {
        alert("La note doit être comprise entre 1 et 5");
        return;
      }

      try {
        const response = await fetch("/api/commentaires/guides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visiteur_id: currentUser.id,
            guide_id: guide_id,
            commentaire: `Note attribuée: ${note}/5`,
            note: note,
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Note du guide envoyée avec succès !");
          noteGuide.value = "";
          guideSelectNote.value = "";
        } else {
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi de la note");
      }
    });
  }

  // Gestion du commentaire sur le monument
  const btnCommentMonument = document.getElementById("validerCommentMonument");
  if (btnCommentMonument) {
    btnCommentMonument.addEventListener("click", async function () {
      if (!currentUser) {
        alert("Vous devez être connecté pour laisser un commentaire");
        return;
      }

      const monumentSelect = document.getElementById("monumentSelect");
      const commentaireMonument = document.getElementById(
        "commentaireMonument"
      );

      if (!monumentSelect || !commentaireMonument) {
        alert("Erreur: éléments du formulaire introuvables");
        return;
      }

      const monument_nom = monumentSelect.value;
      const commentaire = commentaireMonument.value.trim();

      if (!monument_nom || !commentaire) {
        alert("Veuillez sélectionner un monument et saisir un commentaire");
        return;
      }

      try {
        const response = await fetch("/api/commentaires/monuments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visiteur_id: currentUser.id,
            monument_nom: monument_nom,
            commentaire: commentaire,
            note: 5, // Note par défaut
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Commentaire sur le monument envoyé avec succès !");
          commentaireMonument.value = "";
          monumentSelect.value = "";
        } else {
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi du commentaire");
      }
    });
  }

  // Gestion de la note du monument
  const btnNoteMonument = document.getElementById("validerNoteMonument");
  if (btnNoteMonument) {
    btnNoteMonument.addEventListener("click", async function () {
      if (!currentUser) {
        alert("Vous devez être connecté pour noter un monument");
        return;
      }

      const monumentSelectNote = document.getElementById("monumentSelectNote");
      const noteMonument = document.getElementById("noteMonument");

      if (!monumentSelectNote || !noteMonument) {
        alert("Erreur: éléments du formulaire introuvables");
        return;
      }

      const monument_nom = monumentSelectNote.value;
      const note = parseInt(noteMonument.value);

      if (!monument_nom || !note) {
        alert("Veuillez sélectionner un monument et une note");
        return;
      }

      if (note < 1 || note > 5) {
        alert("La note doit être comprise entre 1 et 5");
        return;
      }

      try {
        const response = await fetch("/api/commentaires/monuments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visiteur_id: currentUser.id,
            monument_nom: monument_nom,
            commentaire: `Note attribuée: ${note}/5`,
            note: note,
          }),
        });

        const result = await response.json();

        if (result.success) {
          alert("Note du monument envoyée avec succès !");
          noteMonument.value = "";
          monumentSelectNote.value = "";
        } else {
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'envoi de la note");
      }
    });
  }

  // Charger les commentaires existants au chargement de la page
  chargerCommentaires();

  async function chargerCommentaires() {
    if (currentUser) {
      try {
        const response = await fetch(
          `/api/commentaires/visiteur/${currentUser.id}`
        );
        const result = await response.json();

        if (result.success) {
          afficherCommentaires(result.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires:", error);
      }
    }
  }

  function afficherCommentaires(commentaires) {
    // Créer une section pour afficher les commentaires existants
    const commentairesSection = document.getElementById(
      "commentairesExistants"
    );
    if (commentairesSection) {
      let html = "<h3>Mes commentaires</h3>";

      // Commentaires sur les guides
      if (commentaires.guides && commentaires.guides.length > 0) {
        html += "<h4>Commentaires sur les guides:</h4>";
        commentaires.guides.forEach((comment) => {
          html += `
                        <div class="commentaire-item">
                            <p><strong>Guide:</strong> ${
                              comment.guides
                                ? comment.guides.nom +
                                  " " +
                                  comment.guides.prenom
                                : "Guide inconnu"
                            }</p>
                            <p><strong>Commentaire:</strong> ${
                              comment.commentaire
                            }</p>
                            <p><strong>Note:</strong> ${comment.note}/5</p>
                            <p><small>Date: ${new Date(
                              comment.date_creation
                            ).toLocaleDateString()}</small></p>
                        </div>
                    `;
        });
      }

      // Commentaires sur les monuments
      if (commentaires.monuments && commentaires.monuments.length > 0) {
        html += "<h4>Commentaires sur les monuments:</h4>";
        commentaires.monuments.forEach((comment) => {
          html += `
                        <div class="commentaire-item">
                            <p><strong>Monument:</strong> ${
                              comment.monument_nom
                            }</p>
                            <p><strong>Commentaire:</strong> ${
                              comment.commentaire
                            }</p>
                            <p><strong>Note:</strong> ${comment.note}/5</p>
                            <p><small>Date: ${new Date(
                              comment.date_creation
                            ).toLocaleDateString()}</small></p>
                        </div>
                    `;
        });
      }

      if (
        commentaires.guides.length === 0 &&
        commentaires.monuments.length === 0
      ) {
        html += "<p>Vous n'avez pas encore laissé de commentaires.</p>";
      }

      commentairesSection.innerHTML = html;
    }
  }

  // Fonction utilitaire pour afficher des messages d'état
  function showMessage(message, type = "info") {
    // Créer un élément de message temporaire
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            background-color: ${
              type === "success"
                ? "#4CAF50"
                : type === "error"
                ? "#f44336"
                : "#2196F3"
            };
        `;

    document.body.appendChild(messageDiv);

    // Supprimer le message après 3 secondes
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }

  // Remplacer les alertes par des messages plus élégants (optionnel)
  function showAlert(message, type = "info") {
    showMessage(message, type);
  }

  // Gestion de l'état de connexion
  function checkUserStatus() {
    const userData = localStorage.getItem("user");
    const statusElement = document.getElementById("userStatus");

    if (statusElement) {
      if (userData) {
        try {
          const user = JSON.parse(userData);
          statusElement.innerHTML = `<p>Connecté en tant que: <strong>${user.prenom} ${user.nom}</strong></p>`;
          statusElement.style.color = "green";
        } catch (error) {
          statusElement.innerHTML = "<p>Erreur de connexion</p>";
          statusElement.style.color = "red";
        }
      } else {
        statusElement.innerHTML =
          "<p>Vous devez être connecté pour laisser des commentaires</p>";
        statusElement.style.color = "orange";
      }
    }
  }

  // Vérifier le statut au chargement
  checkUserStatus();

  // Écouter les changements de statut utilisateur
  window.addEventListener("userStatusChanged", function () {
    checkUserStatus();
    chargerCommentaires();
  });
});
