const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const VisiteurModel = {
  // Créer un nouveau visiteur
  async creerVisiteur(visiteurData) {
    try {
      const { nom, prenom, email, password, telephone, localite } =
        visiteurData;

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from("visiteurs")
        .insert([
          {
            nom,
            prenom,
            email,
            passwordn: hashedPassword,
            telephone,
            localite,
            date_inscription: new Date(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error("Erreur création visiteur:", error);
      return { success: false, error: error.message };
    }
  },

  // Vérifier si l'email existe déjà
  async verifierEmailExiste(email) {
    try {
      const { data, error } = await supabase
        .from("visiteurs")
        .select("id")
        .eq("email", email)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data !== null;
    } catch (error) {
      console.error("Erreur vérification email:", error);
      return false;
    }
  },

  // Connexion visiteur
  async connecterVisiteur(email, password) {
    try {
      const { data, error } = await supabase
        .from("visiteurs")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;

      const isValidPassword = await bcrypt.compare(password, data.passwordn);
      if (!isValidPassword) {
        return { success: false, error: "Mot de passe incorrect" };
      }

      // Ne pas renvoyer le mot de passe
      const { passwordn: _, ...visiteurSansPassword } = data;
      return { success: true, data: visiteurSansPassword };
    } catch (error) {
      console.error("Erreur connexion visiteur:", error);
      return { success: false, error: "Email ou mot de passe incorrect" };
    }
  },

  // Récupérer tous les visiteurs
  async obtenirTousLesVisiteurs() {
    try {
      const { data, error } = await supabase
        .from("visiteurs")
        .select("id, nom, prenom, email, telephone, localite, date_inscription")
        .order("nom", { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erreur récupération visiteurs:", error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer un visiteur par ID
  async obtenirVisiteurParId(id) {
    try {
      const { data, error } = await supabase
        .from("visiteurs")
        .select("id, nom, prenom, email, telephone, localite, date_inscription")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erreur récupération visiteur:", error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer les visiteurs par localité
  async obtenirVisiteursParLocalite(localite) {
    try {
      const { data, error } = await supabase
        .from("visiteurs")
        .select("id, nom, prenom, email, telephone, localite, date_inscription")
        .ilike("localite", `%${localite}%`)
        .order("nom", { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erreur récupération visiteurs par localité:", error);
      return { success: false, error: error.message };
    }
  },
};

module.exports = VisiteurModel;
