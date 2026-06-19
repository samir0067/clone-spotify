/**
 * Données EN DUR du clone Spotify (état de départ du cours).
 *
 * Pourquoi ce fichier existe :
 *   - C'est la version « données écrites à la main » que l'app utilise au départ.
 *   - Pendant la Démo 2 (Brancher une API), on remplacera cet import par un fetch
 *     sur /tracks.json — qui contient EXACTEMENT les mêmes 12 morceaux et la même
 *     forme d'objet. Le remplacement est donc indolore.
 *
 * 100% hors-ligne : aucune URL externe.
 *   - Les pochettes sont des fichiers SVG locaux servis depuis /public/covers.
 *     Vite sert le dossier public à la racine, donc "/covers/cover-1.svg" est
 *     une URL valide, sans réseau.
 *
 * Forme d'un morceau : { id, title, artist, album, genre, duration, cover }
 *   - id       : identifiant unique (sert aussi à nommer la pochette)
 *   - title    : titre du morceau
 *   - artist   : artiste
 *   - album    : album
 *   - genre    : genre musical
 *   - duration : durée en SECONDES (formatée à l'affichage en mm:ss)
 *   - cover    : chemin de la pochette locale
 */

export const TRACKS = [
  { id: 1, title: 'Golden Hour', artist: 'Mira Solenne', album: 'Daylight', genre: 'Pop', duration: 213, cover: '/covers/cover-1.svg' },
  { id: 2, title: 'Electric Smile', artist: 'The Lanterns', album: 'Neon Youth', genre: 'Pop', duration: 224, cover: '/covers/cover-2.svg' },
  { id: 3, title: 'Midnight Drive', artist: 'Halo Bright', album: 'Sweet Static', genre: 'Pop', duration: 232, cover: '/covers/cover-3.svg' },
  { id: 4, title: 'Concrete Crown', artist: 'D-Lowe', album: 'City Pressure', genre: 'Rap', duration: 241, cover: '/covers/cover-4.svg' },
  { id: 5, title: 'Marble Floors', artist: 'Kassi K', album: 'After Hours Money', genre: 'Rap', duration: 215, cover: '/covers/cover-5.svg' },
  { id: 6, title: 'Paper Trail', artist: 'Vex', album: 'Receipts', genre: 'Rap', duration: 179, cover: '/covers/cover-6.svg' },
  { id: 7, title: 'Hollow Bones', artist: 'Iron Tide', album: 'Saltwater', genre: 'Rock', duration: 268, cover: '/covers/cover-7.svg' },
  { id: 8, title: 'Wildfire', artist: 'Northpoint', album: 'Embers', genre: 'Rock', duration: 231, cover: '/covers/cover-8.svg' },
  { id: 9, title: 'Static Hymn', artist: 'Cobalt Year', album: 'Analog Heart', genre: 'Rock', duration: 298, cover: '/covers/cover-9.svg' },
  { id: 10, title: 'Neon Drift', artist: 'Cyberwave Systems', album: 'Grid Runner', genre: 'Électro', duration: 245, cover: '/covers/cover-10.svg' },
  { id: 11, title: 'Vapor Trails', artist: 'Lune Noire', album: 'Sous la Ville', genre: 'Électro', duration: 229, cover: '/covers/cover-11.svg' },
  { id: 12, title: 'Blue Marrow', artist: 'The Ellis Quartet', album: 'Late Set', genre: 'Jazz', duration: 342, cover: '/covers/cover-12.svg' },
];
