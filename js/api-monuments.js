async function rechercherLieuxTouristiques(ville) {
    try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${ville}&type=municipality&limit=1`);
        const data = await response.json();

        if (!data.features.length) {
            throw new Error('Ville non trouvée');
        }

        const query = `
        [out:json][timeout:25];
        area[name="${ville}"][admin_level~"8|7|6"][boundary=administrative]->.searchArea;
        (
            node["tourism"="attraction"](area.searchArea);
            way["tourism"="attraction"](area.searchArea);
            node["historic"="monument"](area.searchArea);
            way["historic"="monument"](area.searchArea);
        );
        out body;
        >;
        out skel qt;`;

        const monumentsResponse = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });

        const monumentsData = await monumentsResponse.json();
        return formaterMonuments(monumentsData.elements);
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

function formaterMonuments(elements) {
    return elements
        .filter(el => el.tags && el.tags.name)
        .map(el => ({
            nom: el.tags.name,
            type: el.tags.historic ? 'Monument historique' : 'Site touristique',
            adresse: el.tags['addr:street'] || 'Adresse non spécifiée'
        }));
}

// Fonction principale pour rechercher les monuments
export async function rechercherMonuments(ville) {
    try {
        const query = `
        [out:json][timeout:25];
        area[name="${ville}"][admin_level~"8|7|6"][boundary=administrative]->.searchArea;
        (
            node["tourism"="attraction"](area.searchArea);
            way["tourism"="attraction"](area.searchArea);
            node["historic"="monument"](area.searchArea);
            way["historic"="monument"](area.searchArea);
        );
        out body;
        >;
        out skel qt;`;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });

        const data = await response.json();
        return formaterResultats(data.elements);
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

// Fonction pour formater les résultats
function formaterResultats(elements) {
    return elements
        .filter(el => el.tags && el.tags.name)
        .map(el => ({
            nom: el.tags.name || 'Monument sans nom',
            type: el.tags.historic ? 'Monument historique' : 'Site touristique',
            adresse: el.tags['addr:street'] || 'Adresse non spécifiée'
        }));
}

// Exporter toutes les fonctions nécessaires
export { formaterMonuments, rechercherLieuxTouristiques };


export async function rechercherVilleEtMonuments(recherche) {
    try {
        // Recherche de la ville
        const villeResponse = await fetch(`https://geo.api.gouv.fr/communes?nom=${recherche}&fields=nom,code,departement&boost=population&limit=1`);
        const villeData = await villeResponse.json();

        if (!villeData.length) {
            throw new Error('Ville non trouvée');
        }

        const ville = villeData[0];

        // Recherche des monuments
        const monumentsResponse = await fetch(`https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=${ville.nom}&rows=20`);
        const monumentsData = await monumentsResponse.json();

        return {
            ville: ville,
            monuments: monumentsData.records.map(record => ({
                nom: record.fields.tico || 'Monument sans nom',
                type: 'Monument historique',
                adresse: record.fields.adrs || 'Adresse non spécifiée',
                periode: record.fields.scle || 'Période non spécifiée',
                protection: record.fields.ppro || 'Type de protection non spécifié'
            }))
        };
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}