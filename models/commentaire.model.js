const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CommentaireModel = {
  // Ajouter un commentaire sur un guide
  async ajouterCommentaireGuide(commentaireData) {
    try {
      const { visiteur_id, guide_id, commentaire, note } = commentaireData;

      const { data, error } = await supabase
        .from("commentaires_guides")
        .insert([
          {
            visiteur_id,
            guide_id,
            commentaire,
            note,
            date_creation: new Date(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error("Erreur ajout commentaire guide:", error);
      return { success: false, error: error.message };
    }
  },

  // Ajouter un commentaire sur un monument
  async ajouterCommentaireMonument(commentaireData) {
    try {
      const { visiteur_id, monument_nom, commentaire, note } = commentaireData;

      const { data, error } = await supabase
        .from("commentaires_monuments")
        .insert([
          {
            visiteur_id,
            monument_nom,
            commentaire,
            note,
            date_creation: new Date(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error("Erreur ajout commentaire monument:", error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les commentaires d'un guide
  async obtenirCommentairesGuide(guide_id) {
    try {
      const { data, error } = await supabase
        .from("commentaires_guides")
        .select(
          `
          *,
          visiteurs(nom, prenom)
        `
        )
        .eq("guide_id", guide_id)
        .order("date_creation", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erreur récupération commentaires guide:", error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les commentaires d'un monument
  async obtenirCommentairesMonument(monument_nom) {
    try {
      const { data, error } = await supabase
        .from("commentaires_monuments")
        .select(
          `
          *,
          visiteurs(nom, prenom)
        `
        )
        .eq("monument_nom", monument_nom)
        .order("date_creation", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erreur récupération commentaires monument:", error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer tous les commentaires d'un visiteur
  async obtenirCommentairesVisiteur(visiteur_id) {
    try {
      // Commentaires sur les guides
      const { data: commentairesGuides, error: errorGuides } = await supabase
        .from("commentaires_guides")
        .select(
          `
          *,
          guides(nom, prenom)
        `
        )
        .eq("visiteur_id", visiteur_id)
        .order("date_creation", { ascending: false });

      // Commentaires sur les monuments
      const { data: commentairesMonuments, error: errorMonuments } =
        await supabase
          .from("commentaires_monuments")
          .select("*")
          .eq("visiteur_id", visiteur_id)
          .order("date_creation", { ascending: false });

      if (errorGuides || errorMonuments) throw errorGuides || errorMonuments;

      return {
        success: true,
        data: {
          guides: commentairesGuides || [],
          monuments: commentairesMonuments || [],
        },
      };
    } catch (error) {
      console.error("Erreur récupération commentaires visiteur:", error);
      return { success: false, error: error.message };
    }
  },

  // Calculer la note moyenne d'un guide
  async obtenirNoteMoyenneGuide(guide_id) {
    try {
      const { data, error } = await supabase
        .from("commentaires_guides")
        .select("note")
        .eq("guide_id", guide_id);

      if (error) throw error;

      if (data.length === 0) {
        return { success: true, data: { moyenne: 0, nombre_avis: 0 } };
      }

      const moyenne =
        data.reduce((sum, item) => sum + item.note, 0) / data.length;

      return {
        success: true,
        data: {
          moyenne: Math.round(moyenne * 10) / 10,
          nombre_avis: data.length,
        },
      };
    } catch (error) {
      console.error("Erreur calcul note moyenne guide:", error);
      return { success: false, error: error.message };
    }
  },

  // Calculer la note moyenne d'un monument
  async obtenirNoteMoyenneMonument(monument_nom) {
    try {
      const { data, error } = await supabase
        .from("commentaires_monuments")
        .select("note")
        .eq("monument_nom", monument_nom);

      if (error) throw error;

      if (data.length === 0) {
        return { success: true, data: { moyenne: 0, nombre_avis: 0 } };
      }

      const moyenne =
        data.reduce((sum, item) => sum + item.note, 0) / data.length;

      return {
        success: true,
        data: {
          moyenne: Math.round(moyenne * 10) / 10,
          nombre_avis: data.length,
        },
      };
    } catch (error) {
      console.error("Erreur calcul note moyenne monument:", error);
      return { success: false, error: error.message };
    }
  },
};

module.exports = CommentaireModel;
