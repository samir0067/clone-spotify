import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Version RANGÉE (par défaut) :
import { App } from './App';
// Version MONOLITHIQUE (Démo 4 - Architecture) : commenter la ligne ci-dessus
// et décommenter celle-ci pour charger tout-en-un (src/AppMono.jsx).
// import { App } from './AppMono';

ReactDOM.createRoot(document.getElementById('spotify-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
