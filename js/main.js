import { registerUser, registerGuides } from "../js/auth.js";
import { rechercherVilleEtMonuments } from "../js//api-france.js";
import { rechercherMonuments } from './api-monuments.js';

  // Gestion de l'inscription
let inscriptionForm = document.getElementById('inscriptionForm');
if (inscriptionForm) {
inscriptionForm.addEventListener('submit', (e) => {
    e.preventDefault();
        const validationMessage = document.getElementById('validationMessage');

        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const telephone = document.getElementById('telephone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        

        // Validation des champs
        if (!nom || !prenom || !email || !password) {
            validationMessage.textContent = 'Veuillez remplir tous les champs';
            validationMessage.className = 'validation-message error';
            return;
        }

        // Validation de l'email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            validationMessage.textContent = 'Veuillez entrer une adresse email valide';
            validationMessage.className = 'validation-message error';
            return;
        }

        // Validation du mot de passe (minimum 8 caractères)
        if (password.length < 8) {
            validationMessage.textContent = 'Le mot de passe doit contenir au moins 8 caractères';
            validationMessage.className = 'validation-message error';
            
            return;
        }

        // Si tout est valide
        validationMessage.textContent = 'Informations validées ! Vous pouvez maintenant vous inscrire.';
        validationMessage.className = 'validation-message success';
        registerUser(email, password, nom, prenom, telephone)
    });
}

let inscriptionGuidesForm = document.getElementById('inscriptionGuidesForm');
if (inscriptionGuidesForm) {
inscriptionGuidesForm.addEventListener('submit', (e) => {
    e.preventDefault();
        const validationMessage = document.getElementById('validationMessage');

        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const telephone = document.getElementById('telephone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const ville = document.getElementById('ville').value;
        const disponibilite = document.getElementById('disponibilite').value;
        const prix = document.getElementById('prix').value;

        // Validation des champs
        if (!nom || !prenom || !email || !password) {
            validationMessage.textContent = 'Veuillez remplir tous les champs';
            validationMessage.className = 'validation-message error';
            return;
        }

        // Validation de l'email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            validationMessage.textContent = 'Veuillez entrer une adresse email valide';
            validationMessage.className = 'validation-message error';
            return;
        }

        // Validation du mot de passe (minimum 8 caractères)
        if (password.length < 8) {
            validationMessage.textContent = 'Le mot de passe doit contenir au moins 8 caractères';
            validationMessage.className = 'validation-message error';
            
            return;
        }

        // Si tout est valide
        validationMessage.textContent = 'Informations validées ! Vous pouvez maintenant vous inscrire.';
        validationMessage.className = 'validation-message success';
        registerGuides(email, password, nom, prenom,ville,disponibilite,prix, telephone)
    });
}



const searchForm = document.getElementById("searchForm");
const villeInput = document.querySelector('input[placeholder="ville"]');
  const monumentInput = document.querySelector(
    'input[placeholder="monument ou centre historique"]'
  );
  const resultsContainer = document.getElementById("results");
  // Gestion de la recherche
  if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const recherche = document.getElementById("recherches").value;

    if (!recherche) {
      alert("Veuillez entrer le nom d'une ville");
      return;
    }

    try {
      // Affichage d'un message de chargement
      resultsContainer.innerHTML = "<p>Recherche en cours...</p>";

      const resultats = await rechercherVilleEtMonuments(recherche);

      // Mise à jour du champ ville
      villeInput.value = resultats.ville.nom;

      if (resultats.monuments.length > 0) {
        // Mise à jour du champ monument avec le premier résultat

        // Affichage de tous les monuments
        const html = resultats.monuments
    .map(monument => `
        <div class="monument-card" data-monument="${monument.nom}">
            <h3>${monument.nom}</h3>
            <p>Période : ${monument.periode}</p>
            <p>Protection : ${monument.protection}</p>
            <p>Adresse : ${monument.adresse}</p>
            <button class="select-btn" onclick="selectMonument('${monument.nom.replace(/'/g, "\\'")}')">
                Sélectionner
            </button>
        </div>
    `)
    .join("");

        resultsContainer.innerHTML = html;
      } else {
        monumentInput.value = "";
        resultsContainer.innerHTML =
          "<p>Aucun monument trouvé pour cette ville</p>";
      }
    } catch (error) {
      console.error("Erreur:", error);
      resultsContainer.innerHTML =
        "<p>Une erreur est survenue lors de la recherche</p>";
    }
  });
  }

// Ajouter la gestion du bouton valider
const validateBtn = document.getElementById('validateBtn');
if (validateBtn) {
    validateBtn.addEventListener('click', () => {
        const selectedData = {
            ville: document.querySelector('input[placeholder="ville"]').value,
            monument: document.querySelector('input[placeholder="monument ou centre historique"]').value,
            adresse: document.querySelector('.monument-card.selected')?.querySelector('p:nth-child(4)')?.textContent.replace('Adresse : ', '') || ''
        };

        // Sauvegarder les données dans le localStorage
        localStorage.setItem('selectedTourData', JSON.stringify(selectedData));
        
        // Rediriger vers la page de commande
        window.location.href = './event.html';
    });
}

// Modifier la fonction selectMonument pour marquer la carte sélectionnée
window.selectMonument = function(nom, adresse) {
    const monumentInput = document.querySelector('input[placeholder="monument ou centre historique"]');
    if (monumentInput) {
        monumentInput.value = nom;
    }
    
    // Retirer la sélection précédente
    document.querySelectorAll('.monument-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Ajouter la classe selected à la carte cliquée
    const currentCard = document.querySelector(`[data-monument="${nom}"]`);
    if (currentCard) {
        currentCard.classList.add('selected');
    }
};
