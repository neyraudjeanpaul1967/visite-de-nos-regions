import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        updateAuthButton(user);
    } catch (error) {
        console.error('Erreur d\'initialisation:', error.message);
    }
});

function updateAuthButton(user) {
    const authButton = document.getElementById('authButton')?.querySelector('a');
    if (!authButton) return;
    
    if (user) {
        authButton.textContent = 'Se déconnecter';
        authButton.onclick = handleLogout;
    } else {
        authButton.textContent = 'Se connecter';
        authButton.onclick = showLoginModal;
    }
}

export async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        updateAuthButton(data.user);
        return data;
    } catch (error) {
        console.error('Erreur de connexion:', error.message);
        throw error;
    }
}

export async function registerUser(email, password, nom, prenom, telephone) {
    try {
            // Création du compte utilisateur
            const { data, error } = await supabase.auth.signUp({
                email,
                password
                }
            );

            if (error) throw error;

            // Ajout dans la table visiteurs
            const { error: insertError } = await supabase
                .from('visiteurs')
                .insert([{
                    id: data.user.id,
                    nom,
                    prenom,
                    email,
                    telephone,
                }]);

            if (insertError) throw insertError;

            alert('Inscription réussie !');
            window.location.href = '/index.html';

        } catch (error) {
            console.error('Erreur:', error.message);
            alert('Erreur lors de l\'inscription: ' + error.message);
        }
}

export async function registerGuides(email, password, nom, prenom,ville,disponibilite,prix, telephone) {
    try {
            // Création du compte utilisateur
            const { data, error } = await supabase.auth.signUp({
                email,
                password
                }
            );

            if (error) throw error;

            // Ajout dans la table visiteurs
            const { error: insertError } = await supabase
                .from('guides')
                .insert([{
                    id: data.user.id,
                    nom,
                    prenom,
                    email,
                    ville,
                    disponibilite,
                    prix,
                    telephone,
                }]);

            if (insertError) throw insertError;

            alert('Inscription réussie !');
            window.location.href = '/index.html';

        } catch (error) {
            console.error('Erreur:', error.message);
            alert('Erreur lors de l\'inscription: ' + error.message);
        }
}

function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Connexion</h3>
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Mot de passe</label>
                    <input type="password" id="loginPassword" required>
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <button class="close-modal">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);
    handleModalEvents(modal);
}

async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        updateAuthButton(null);
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Erreur de déconnexion:', error.message);
    }
}

function handleModalEvents(modal) {
    const form = modal.querySelector('#loginForm');
    const closeBtn = modal.querySelector('.close-modal');

    closeBtn.onclick = () => modal.remove();

    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await loginUser(email, password);
            modal.remove();
        } catch (error) {
            alert('Erreur de connexion: ' + error.message);
        }
    };
}

async function createCommande(commandeData) {
    try {
        const { data, error } = await supabase
            .from('commandes')
            .insert([commandeData])
        if (error) throw error
        return data
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error.message)
        throw error
    }
}

export { createCommande }