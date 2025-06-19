import { supabase } from './supabaseClient.js'
import { getGuides } from './guides-service.js'

document.addEventListener('DOMContentLoaded', async () => {
    initializePage()
    await loadGuides()
    setupEventListeners()
})

function initializePage() {
    const savedData = JSON.parse(localStorage.getItem('selectedTourData') || '{}')
    
    if (savedData) {
        document.getElementById('ville').value = savedData.ville || ''
        document.getElementById('monument').value = savedData.monument || ''
        document.getElementById('lieu').value = savedData.adresse || ''
    }
    
    localStorage.removeItem('selectedTourData')
}

async function loadGuides() {
    const guidesSelect = document.getElementById('guideSelect')
    try {
        const guides = await getGuides()
        
        guidesSelect.innerHTML = `
            <option value="">Sélectionnez un guide</option>
            ${guides.map(guide => `
                <option value="${guide.id}" data-prix="${guide.prix}">
                    ${guide.prenom} ${guide.nom}
                </option>
            `).join('')}`
    } catch (error) {
        console.error('Erreur:', error)
    }
}

function setupEventListeners() {
    const guidesSelect = document.getElementById('guideSelect')
    const nbPersonnes = document.getElementById('nbPersonnes')
    const form = document.getElementById('commandeForm')
    
    guidesSelect.addEventListener('change', updatePrix)
    nbPersonnes.addEventListener('input', updatePrix)
    form.addEventListener('submit', handleSubmit)
}

function updatePrix() {
    const guidesSelect = document.getElementById('guideSelect')
    const selectedOption = guidesSelect.options[guidesSelect.selectedIndex]
    const nbPersonnes = parseInt(document.getElementById('nbPersonnes').value) || 0
    
    if (selectedOption && selectedOption.dataset.prix) {
        const prixParPersonne = parseFloat(selectedOption.dataset.prix)
        document.getElementById('prixPersonne').value = prixParPersonne
        document.getElementById('prixTotal').value = (prixParPersonne * nbPersonnes).toFixed(2)
    }
}

async function handleSubmit(e) {
    e.preventDefault()
    
    try {
        const formData = new FormData(e.target)
        const commande = {
            guide_id: formData.get('guide'),
            ville: formData.get('ville'),
            monument: formData.get('monument'),
            lieu: formData.get('lieu'),
            nb_personnes: parseInt(formData.get('nbPersonnes')),
            prix_total: parseFloat(document.getElementById('prixTotal').value)
        }

        const { error } = await supabase
            .from('commandes')
            .insert([commande])

        if (error) throw error
        
        alert('Réservation enregistrée avec succès !')
        window.location.href = '/index.html'
    } catch (error) {
        console.error('Erreur lors de la réservation:', error)
        alert('Erreur lors de la réservation')
    }
}
