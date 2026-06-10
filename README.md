# Spotify Clone - Projet Pédagogique

Ce projet est une application web pédagogique qui clone l'interface et le fonctionnement de base de Spotify. Il est construit avec **React 18**, **Vite** et **CSS Modules** pour le style.

---

## 📁 Structure du Projet

L'architecture suit les conventions modernes de développement React :

```text
clone-spotify/
├── eslint.config.js       # Configuration ESLint (Flat Config)
├── index.html             # Point d'entrée HTML5 (SEO & Google Fonts configurés)
├── package.json           # Dépendances et scripts npm
├── vite.config.js         # Configuration du serveur de développement et de build Vite
├── .prettierrc            # Règles de formatage de code
├── .gitignore             # Fichiers ignorés par Git
└── src/
    ├── assets/            # Ressources statiques (logos, images, SVG)
    │   ├── logo.svg       # Logo Spotify en SVG
    │   └── album-cover.png # Pochette d'album générée pour la démonstration
    ├── components/        # Composants réutilisables (un dossier par composant)
    │   └── TrackCard/     # Composant de démonstration
    │       ├── TrackCard.jsx
    │       └── TrackCard.module.css
    ├── hooks/             # Hooks personnalisés
    │   └── useAudio.js    # Hook pour contrôler la lecture audio (mock)
    ├── pages/             # Pages ou vues principales de l'application
    │   └── Home/
    │       ├── Home.jsx
    │       └── Home.module.css
    ├── styles/            # Système de style global et jetons de design (Tokens)
    │   └── global.css     # Réinitialisation, polices, thèmes et variables CSS Spotify
    ├── utils/             # Fonctions utilitaires partagées
    │   └── formatTime.js  # Formatage des durées (secondes -> mm:ss)
    ├── App.jsx            # Composant racine de l'application
    └── main.jsx           # Point d'entrée JavaScript React
```

---

## 🏷️ Conventions de Nommage & Bonnes Pratiques

- **Composants & Pages** : Nommés en `PascalCase` (ex: `TrackCard.jsx`, `Home.jsx`).
  - Chaque composant a son propre dossier contenant son code React (`.jsx`) et sa feuille de style associée (`.module.css`).
- **Fonctions & Hooks** : Nommés en `camelCase` (ex: `useAudio.js`, `formatTime.js`).
- **Style CSS** :
  - **Pas de styles inline** (sauf cas de valeurs dynamiques absolues issues du JS).
  - Utilisation systématique des **CSS Modules** pour éviter les conflits de classes.
  - Utilisation des **Design Tokens** (variables CSS globales déclarées dans [global.css](file:///Users/samir/workspace/AS-EASY/clone-spotify/src/styles/global.css)) pour conserver l'identité visuelle de Spotify :
    - `--spotify-green` (`#1DB954`) : Couleur d'accentuation / boutons de lecture.
    - `--spotify-dark-base` (`#121212`) : Couleur de fond de l'application.
    - `--spotify-dark-card` (`#181818`) : Couleur de fond des cartes.
- **Accessibilité (a11y)** :
  - Les éléments interactifs (boutons, cartes cliquables) doivent être accessibles au clavier avec `:focus-visible` et avoir des rôles/attributs ARIA explicites (ex: `aria-label`).
  - La taille minimale des cibles tactiles interactives est fixée à `24px` (idéalement `48px`).

---

## 🛠️ Lancer le Projet

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
Le projet est configuré pour tourner par défaut sur le port `3000` :
```bash
npm run dev
```
Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 3. Lancer le linter (Qualité de code)
Vérifie le respect des règles de linting ESLint :
```bash
npm run lint
```

### 4. Formater le code automatiquement
Formate tous les fichiers du projet avec Prettier :
```bash
npm run format
```

### 5. Compiler pour la production
Génère le build de production optimisé dans le dossier `dist/` :
```bash
npm run build
```

---

## 💡 Comment créer un nouveau composant ?

Pour ajouter un nouveau composant (ex: un bouton de lecture personnalisé `PlayButton`) :

1. Créez un sous-dossier dans `src/components/` : `src/components/PlayButton/`.
2. Créez le fichier de composant `PlayButton.jsx`.
3. Créez le fichier CSS Module associé `PlayButton.module.css`.

### Exemple de structure de code :

#### `PlayButton.jsx`
```javascript
import React from 'react';
import styles from './PlayButton.module.css';

export function PlayButton({ onClick, isActive }) {
  return (
    <button 
      className={`${styles.button} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-label="Lecture"
    >
      <span className={styles.icon}>▶</span>
    </button>
  );
}
```

#### `PlayButton.module.css`
```css
.button {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--spotify-green);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  min-inline-size: 48px;
  min-block-size: 48px;
}

.button:hover {
  background-color: var(--spotify-green-hover);
  transform: scale(1.04);
}

.button:focus-visible {
  outline: 2px solid var(--color-text-primary);
  outline-offset: 3px;
}
```
