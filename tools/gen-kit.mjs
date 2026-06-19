/* eslint-disable no-undef */
// Générateur d'actifs offline pour le kit de démo.
// - Crée 12 pochettes SVG locales (aucune URL externe) dans les dossiers public/covers.
// - Écrit public/tracks.json (le fichier "type API" servi à la racine).
//
// Usage : node tools/gen-kit.mjs
// Ce script est un OUTIL de génération : il n'est PAS importé par l'application.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Source de vérité unique : 12 morceaux répartis sur 5 genres.
// Les ids 1..12 servent aussi à nommer les pochettes (cover-<id>.svg).
export const TRACKS = [
  { id: 1, title: 'Golden Hour', artist: 'Mira Solenne', album: 'Daylight', genre: 'Pop', duration: 213 },
  { id: 2, title: 'Electric Smile', artist: 'The Lanterns', album: 'Neon Youth', genre: 'Pop', duration: 224 },
  { id: 3, title: 'Midnight Drive', artist: 'Halo Bright', album: 'Sweet Static', genre: 'Pop', duration: 232 },
  { id: 4, title: 'Concrete Crown', artist: 'D-Lowe', album: 'City Pressure', genre: 'Rap', duration: 241 },
  { id: 5, title: 'Marble Floors', artist: 'Kassi K', album: 'After Hours Money', genre: 'Rap', duration: 215 },
  { id: 6, title: 'Paper Trail', artist: 'Vex', album: 'Receipts', genre: 'Rap', duration: 179 },
  { id: 7, title: 'Hollow Bones', artist: 'Iron Tide', album: 'Saltwater', genre: 'Rock', duration: 268 },
  { id: 8, title: 'Wildfire', artist: 'Northpoint', album: 'Embers', genre: 'Rock', duration: 231 },
  { id: 9, title: 'Static Hymn', artist: 'Cobalt Year', album: 'Analog Heart', genre: 'Rock', duration: 298 },
  { id: 10, title: 'Neon Drift', artist: 'Cyberwave Systems', album: 'Grid Runner', genre: 'Électro', duration: 245 },
  { id: 11, title: 'Vapor Trails', artist: 'Lune Noire', album: 'Sous la Ville', genre: 'Électro', duration: 229 },
  { id: 12, title: 'Blue Marrow', artist: 'The Ellis Quartet', album: 'Late Set', genre: 'Jazz', duration: 342 },
];

// Palette de dégradés par genre (deux teintes chacune).
const PALETTES = {
  Pop: ['#ff6f91', '#845ec2'],
  Rap: ['#f9a826', '#c70039'],
  Rock: ['#ee5253', '#341f97'],
  Électro: ['#00d2ff', '#3a47d5'],
  Jazz: ['#f6d365', '#b06ab3'],
};

// Échappe les caractères réservés XML pour les titres affichés dans le SVG.
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Construit une pochette SVG 300x300 : dégradé diagonal + grand disque translucide
// + initiale de l'artiste + titre. 100 % autonome, aucune ressource externe.
function buildCover(track) {
  const [c1, c2] = PALETTES[track.genre] || ['#1db954', '#191414'];
  const initial = escapeXml(track.artist.charAt(0).toUpperCase());
  const title = escapeXml(track.title);
  const album = escapeXml(track.album);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="g${track.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#g${track.id})"/>
  <circle cx="232" cy="70" r="120" fill="#ffffff" opacity="0.12"/>
  <circle cx="60" cy="250" r="70" fill="#000000" opacity="0.10"/>
  <text x="24" y="120" font-family="Outfit, Arial, sans-serif" font-size="150" font-weight="800" fill="#ffffff" opacity="0.85">${initial}</text>
  <text x="24" y="250" font-family="Outfit, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">${title}</text>
  <text x="24" y="278" font-family="Outfit, Arial, sans-serif" font-size="16" font-weight="500" fill="#ffffff" opacity="0.8">${album}</text>
</svg>
`;
}

// Dossiers cibles : le clone principal et le clone monolithique.
const COVER_DIRS = [join(ROOT, 'public', 'covers'), join(ROOT, 'mono', 'public', 'covers')];

for (const dir of COVER_DIRS) {
  mkdirSync(dir, { recursive: true });
  for (const track of TRACKS) {
    writeFileSync(join(dir, `cover-${track.id}.svg`), buildCover(track), 'utf8');
  }
}

// Fichier "type API" servi à la racine du clone principal.
// Forme volontairement proche d'une réponse d'API REST.
const apiPayload = TRACKS.map((t) => ({
  id: t.id,
  title: t.title,
  artist: t.artist,
  album: t.album,
  genre: t.genre,
  duration: t.duration,
  cover: `/covers/cover-${t.id}.svg`,
}));

writeFileSync(join(ROOT, 'public', 'tracks.json'), JSON.stringify(apiPayload, null, 2) + '\n', 'utf8');

console.log(`OK : ${TRACKS.length} pochettes x ${COVER_DIRS.length} dossiers + public/tracks.json`);
