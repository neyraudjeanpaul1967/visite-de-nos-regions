import { supabase } from './supabaseClient.js';

export async function getGuides() {
    try {
        const { data: guides, error } = await supabase
            .from('guides')
            .select('id, nom, prenom, prix')
            .ilike('disponibilite', "oui");

        if (error) throw error;
        return guides;
    } catch (error) {
        console.error('Erreur lors de la récupération des guides:', error);
        throw error;
    }
}