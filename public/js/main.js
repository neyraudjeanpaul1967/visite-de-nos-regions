import { rechercherVilleEtMonuments } from './api-monuments.js';

const searchForm = document.getElementById('searchForm');
const recherchesInput = document.getElementById('recherches');
const validateBtn = document.getElementById('validateBtn');
const villeResult = document.getElementById('villeResult');
const monumentResult = document.getElementById('monumentResult');
const resultsContainer = document.getElementById('results');

let derniereRecherche = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const recherche = recherchesInput.value.trim();
  if (!recherche) return;
  derniereRecherche = recherche;
  await afficherVilleEtMonuments(recherche);
});

validateBtn.addEventListener('click', async () => {
  if (!derniereRecherche) return;
  await afficherVilleEtMonuments(derniereRecherche);
});

async function afficherVilleEtMonuments(recherche) {
  try {
    const data = await rechercherVilleEtMonuments(recherche);
    villeResult.value = data.ville.nom;
console.log("main");

    // Affiche le premier monument dans la case monumentResult (optionnel)
    if (data.monuments.length) {
      monumentResult.value = data.monuments[0].nom;
      resultsContainer.innerHTML = '<h3>Monuments :</h3><ul>' +
        data.monuments.map(m =>
          `<li>
            <strong>${m.nom}</strong><br>
            ${m.adresse}<br>
            ${m.periode ? 'Période : ' + m.periode + '<br>' : ''}
            ${m.protection ? 'Protection : ' + m.protection : ''}
          </li>`
        ).join('') +
        '</ul>';
    } else {
      monumentResult.value = '';
      resultsContainer.innerHTML = '<p>Aucun monument trouvé pour cette ville.</p>';
    }
  } catch (error) {
    villeResult.value = '';
    monumentResult.value = '';
    resultsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}