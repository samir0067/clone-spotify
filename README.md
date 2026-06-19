# Spotify Clone - Projet Pédagogique

Ce projet est une application web pédagogique qui clone l'interface et le fonctionnement de base de Spotify. Il est construit avec **React 18**, **Vite** et **CSS Modules** pour le style.

---

## 📁 Structure du Projet

L'architecture suit les conventions modernes de développement React :

```text
clone-spotify/
├── index.html             # Point d'entrée HTML5 (100% hors-ligne, aucune police distante)
├── package.json           # Dépendances et scripts npm
├── vite.config.js         # Configuration Vite (dev/build), port 3000
├── public/                # Servi à la racine du site (sans réseau)
│   ├── tracks.json        # Fichier "type API" (PAS encore branché : voir Démo 2)
│   └── covers/            # 12 pochettes SVG locales (cover-1.svg … cover-12.svg)
├── tools/
│   └── gen-kit.mjs        # Génère les pochettes + tracks.json (non importé par l'app)
├── docs/
│   ├── GUIDE-ANIMATEUR.md # Mode d'emploi des 4 démos live
│   ├── reference/CONTEXT.md  # Copie de référence du fichier de conventions (gardée de côté)
│   └── recaps/            # Récaps de tâches
└── src/
    ├── assets/            # logo.svg + album-cover.png (repli de pochette)
    ├── components/        # 1 composant = 1 dossier (.jsx + .module.css)
    │   ├── Header/        # Barre du haut
    │   ├── SearchBar/     # Champ de recherche
    │   ├── TrackList/     # Liste (grille) des morceaux
    │   ├── TrackCard/     # Carte d'un morceau
    │   └── Player/        # Lecteur (barre du bas, play/pause visuel)
    ├── hooks/
    │   └── usePlayer.js   # État du lecteur (morceau courant + play/pause)
    ├── data/
    │   └── tracks.js      # Données EN DUR (12 morceaux) — état de départ
    ├── pages/Home/        # Page principale (assemble tout + recherche)
    ├── styles/global.css  # Reset, thème sombre et Design Tokens Spotify
    ├── utils/
    │   └── formatDuration.js  # Durée en secondes -> "m:ss"
    ├── App.jsx            # Composant racine (version rangée, par défaut)
    ├── AppMono.jsx        # Version MONOLITHIQUE tout-en-un (Démo 4 - Architecture)
    └── main.jsx           # Point d'entrée React (bascule App ↔ AppMono)
```

> Notes :
> - `src/hooks/useTracks.js` n'existe pas encore — il est créé **en direct**
>   pendant la Démo 2 (Brancher une API). Voir `docs/GUIDE-ANIMATEUR.md`.
> - La version monolithique se charge en commentant une ligne dans `src/main.jsx`
>   (`./App` → `./AppMono`). Même projet, même install, même port.

---

## 🏷️ Conventions de Nommage & Bonnes Pratiques

- **Composants & Pages** : Nommés en `PascalCase` (ex: `TrackCard.jsx`, `Home.jsx`).
  - Chaque composant a son propre dossier contenant son code React (`.jsx`) et sa feuille de style associée (`.module.css`).
- **Fonctions & Hooks** : Nommés en `camelCase`, hooks préfixés par `use` (ex: `usePlayer.js`, `formatDuration.js`).
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
