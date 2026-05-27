# 🚀 Guide de déploiement Mahay Prep sur Vercel

## Étape 1 — Préparer les fichiers

Tu as reçu un dossier `mahay-prep` avec cette structure :
```
mahay-prep/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx
```

## Étape 2 — Créer un compte GitHub (gratuit)

1. Va sur github.com
2. Clique sur "Sign up"
3. Crée ton compte avec ton email andrianina@mahay-consulting.fr

## Étape 3 — Mettre les fichiers sur GitHub

1. Une fois connectée sur GitHub, clique sur le "+" en haut à droite
2. Choisis "New repository"
3. Nomme-le `mahay-prep`
4. Clique sur "Create repository"
5. Clique sur "uploading an existing file"
6. Glisse-dépose TOUS les fichiers du dossier `mahay-prep`
7. Clique sur "Commit changes"

## Étape 4 — Déployer sur Vercel

1. Va sur vercel.com
2. Clique "Sign up" → connecte-toi avec ton compte GitHub
3. Clique "Add New Project"
4. Sélectionne ton repository `mahay-prep`
5. Vercel détecte automatiquement que c'est un projet Vite/React
6. Clique "Deploy"
7. ⏳ Attends 2 minutes...
8. ✅ Ton app est en ligne ! Tu reçois une URL type : `mahay-prep.vercel.app`

## Étape 5 — Intégrer sur ton site Wix

1. Dans Wix, va sur la page où tu veux intégrer l'app
2. Clique sur "+" pour ajouter un élément
3. Cherche "HTML iFrame" ou "Embed"
4. Colle ce code en remplaçant l'URL par la tienne :

```html
<iframe 
  src="https://mahay-prep.vercel.app" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border-radius: 20px;">
</iframe>
```

5. Ajuste la hauteur (900px) selon ton besoin
6. Publie ta page Wix

## Étape 6 — Mettre à jour l'app

Quand tu veux modifier l'app :
1. Reviens ici (Claude) pour faire les modifications
2. Télécharge le nouveau fichier App.jsx
3. Sur GitHub, va dans `mahay-prep/src/App.jsx`
4. Clique sur l'icône crayon (modifier)
5. Remplace le contenu par le nouveau
6. Vercel redéploie automatiquement en 2 minutes ✅

---
📧 Pour toute question technique : note tes questions et reviens sur Claude.
