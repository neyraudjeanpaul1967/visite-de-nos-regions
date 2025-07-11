export async function rechercherVilleEtMonuments(recherche) {
    try {
        // Recherche de la ville
        const villeResponse = await fetch(`https://geo.api.gouv.fr/communes?nom=${recherche}&fields=nom,code,codesPostaux,departement&boost=population&limit=1`);
        const villeData = await villeResponse.json();
console.log(villeData);

        if (!villeData.length) {
            throw new Error('Ville non trouvée');
        }

        const ville = villeData[0];


        // Recherche des monuments
        const monumentsResponse = await fetch(`https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=${ville.nom}&rows=20`);
        const monumentsData = await monumentsResponse.json();
console.log(monumentsData,ville);

        return {
            ville: ville,
            monuments: monumentsData.records.map(record => ({
                nom: record.fields.titre_editorial_de_la_notice || 'Monument sans nom',
                type: 'Monument historique',
                adresse: record.fields.adresse_forme_editoriale || 'Adresse non spécifiée',
                periode: record.fields.datation_de_l_edifice || 'Période non spécifiée',
                protection: record.fields.typologie_de_la_protection || 'Type de protection non spécifié'
            }))
        };
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}