# 🎉 Réservations Fête d'Oursbelille — Guide de mise en ligne

Temps estimé : **10-15 minutes**. Aucune compétence technique requise.

---

## ÉTAPE 1 — Connecter Google Sheets (Apps Script)

### 1.1 — Ouvrir le script dans ton Sheet
1. Ouvre ton Google Sheet **"Dotations Fêtes Oursbelille"**
2. Dans le menu : **Extensions → Apps Script**
3. Une nouvelle fenêtre s'ouvre (éditeur de script)

### 1.2 — Coller le code
1. Sélectionne **tout le texte** dans l'éditeur (Ctrl+A)
2. Supprime-le
3. Colle le contenu du fichier **`Code.gs`** fourni
4. Clique sur **💾 Enregistrer** (icône disquette)

### 1.3 — Déployer le webhook
1. Clique sur **"Déployer"** (bouton bleu, en haut à droite)
2. Choisit **"Nouveau déploiement"**
3. Type : sélectionne **"Application Web"**
4. Paramètres :
   - Description : `Webhook Réservations`
   - Exécuter en tant que : **Moi**
   - Qui peut accéder : **N'importe qui**
5. Clique **"Déployer"**
6. ⚠️ Une fenêtre demande l'autorisation → clique **"Autoriser l'accès"** et accepte

### 1.4 — Copier l'URL
Après le déploiement, tu obtiens une URL qui ressemble à :
```
https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
```
**Copie cette URL**, tu en auras besoin dans l'étape 2.
https://script.google.com/macros/s/AKfycbz2ZHGPmaX-2LKYdkigGTub80vtceqJ9HvWlG_RZhU98qrGPQigPYvzeXpRC3_xPvV1/exec

AKfycbz2ZHGPmaX-2LKYdkigGTub80vtceqJ9HvWlG_RZhU98qrGPQigPYvzeXpRC3_xPvV1
---

## ÉTAPE 2 — Configurer la page web

### 2.1 — Coller l'URL dans index.html
1. Ouvre le fichier **`index.html`** avec un éditeur de texte (Bloc-notes, Notepad++)
2. Cherche cette ligne (ligne ~300 environ) :
   ```
   const SCRIPT_URL = "COLLE_ICI_TON_URL_APPS_SCRIPT";
   ```
3. Remplace `COLLE_ICI_TON_URL_APPS_SCRIPT` par l'URL copiée à l'étape 1.4
4. Sauvegarde le fichier

---

## ÉTAPE 3 — Mettre en ligne sur GitHub Pages

### 3.1 — Créer un compte GitHub (si pas déjà fait)
→ Va sur [github.com](https://github.com) et crée un compte gratuit

### 3.2 — Créer un nouveau dépôt
1. Clique sur le **"+"** en haut à droite → **"New repository"**
2. Nom du dépôt : `fete-oursbelille` (ou ce que tu veux)
3. Coche **"Public"**
4. Coche **"Add a README file"**
5. Clique **"Create repository"**

### 3.3 — Uploader les fichiers
1. Dans ton dépôt, clique **"Add file" → "Upload files"**
2. Glisse les 2 fichiers : **`index.html`** et **`Code.gs`**
3. Clique **"Commit changes"**

### 3.4 — Activer GitHub Pages
1. Va dans **Settings** (onglet en haut du dépôt)
2. Clique sur **"Pages"** dans le menu de gauche
3. Sous "Branch", sélectionne **main** et dossier **/ (root)**
4. Clique **"Save"**

### 3.5 — Récupérer l'URL de ta page
Après 1-2 minutes, ton site est en ligne à l'adresse :
```
https://TON-PSEUDO.github.io/fete-oursbelille/
```
Tu peux partager cette URL avec tout le comité !

---

## ✅ Test rapide

1. Ouvre l'URL GitHub Pages
2. La liste des réservations devrait se charger (vide au début)
3. Ajoute une réservation test
4. Vérifie qu'elle apparaît dans ton Google Sheet ligne 7

---

## 🔧 En cas de problème

| Symptôme | Solution |
|---|---|
| "Erreur de connexion" sur la page | L'URL Apps Script est mal collée dans index.html |
| "Erreur d'autorisation" au déploiement | Refaire le déploiement et réautoriser |
| La page ne s'affiche pas | Attendre 2 min que GitHub Pages se déploie |
| Les données n'apparaissent pas dans le Sheet | Vérifier que l'onglet s'appelle exactement "Réservations Vendredi" |

---

## 📱 Partager avec le comité

Une fois en ligne, le comité peut accéder à la page depuis :
- **Téléphone** (fonctionne parfaitement en mobile)
- **Ordinateur** (n'importe quel navigateur)
- **Tablette**

Aucune installation, aucun compte nécessaire pour l'utiliser !

---

*Généré par Claude pour le Comité des Fêtes d'Oursbelille 🎉*
