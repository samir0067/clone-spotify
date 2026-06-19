/**
 * Jeu de données factices et local pour le clone Spotify.
 *
 * - Aucune requête réseau pour les morceaux eux-mêmes : tout est défini ici.
 * - Seules les pochettes sont chargées depuis le web via picsum.photos,
 *   un service de placeholders d'images public, fiable et sans clé API.
 *   Le `seed` (basé sur l'id unique du morceau) garantit une image
 *   déterministe et visuellement différente pour chaque pochette.
 *
 * Chaque morceau : id, title, artist, album, genre, duration (secondes), year.
 * `coverUrl` est dérivé de l'id (voir le .map en bas de fichier).
 */

const RAW_TRACKS = [
  // --- Pop ---
  { id: 1, title: 'Golden Hour', artist: 'Mira Solenne', album: 'Daylight', genre: 'Pop', duration: 213, year: 2021 },
  { id: 2, title: 'Paper Hearts', artist: 'Mira Solenne', album: 'Daylight', genre: 'Pop', duration: 198, year: 2021 },
  { id: 3, title: 'Electric Smile', artist: 'The Lanterns', album: 'Neon Youth', genre: 'Pop', duration: 224, year: 2019 },
  { id: 4, title: 'Saturday Skin', artist: 'Coco Vega', album: 'Bubblegum Sky', genre: 'Pop', duration: 187, year: 2022 },
  { id: 5, title: 'Lovesick Radio', artist: 'Coco Vega', album: 'Bubblegum Sky', genre: 'Pop', duration: 201, year: 2022 },
  { id: 6, title: 'Cherry Cola', artist: 'Halo Bright', album: 'Sweet Static', genre: 'Pop', duration: 176, year: 2020 },
  { id: 7, title: 'Midnight Drive', artist: 'Halo Bright', album: 'Sweet Static', genre: 'Pop', duration: 232, year: 2020 },
  { id: 8, title: 'Glitter & Gold', artist: 'The Lanterns', album: 'Neon Youth', genre: 'Pop', duration: 209, year: 2019 },
  { id: 9, title: 'Sunflower Eyes', artist: 'Naïa', album: 'Bloom', genre: 'Pop', duration: 195, year: 2023 },

  // --- Rap ---
  { id: 10, title: 'Concrete Crown', artist: 'D-Lowe', album: 'City Pressure', genre: 'Rap', duration: 241, year: 2021 },
  { id: 11, title: 'No Static', artist: 'D-Lowe', album: 'City Pressure', genre: 'Rap', duration: 198, year: 2021 },
  { id: 12, title: 'Marble Floors', artist: 'Kassi K', album: 'After Hours Money', genre: 'Rap', duration: 215, year: 2022 },
  { id: 13, title: 'Late Night Calls', artist: 'Kassi K', album: 'After Hours Money', genre: 'Rap', duration: 187, year: 2022 },
  { id: 14, title: 'Ground Floor', artist: 'Young Meridian', album: 'Elevation', genre: 'Rap', duration: 203, year: 2020 },
  { id: 15, title: 'Penthouse Dreams', artist: 'Young Meridian', album: 'Elevation', genre: 'Rap', duration: 226, year: 2020 },
  { id: 16, title: 'Paper Trail', artist: 'Vex', album: 'Receipts', genre: 'Rap', duration: 179, year: 2023 },
  { id: 17, title: 'Cold Shoulder', artist: 'Vex', album: 'Receipts', genre: 'Rap', duration: 192, year: 2023 },
  { id: 18, title: 'Block Party', artist: 'D-Lowe', album: 'City Pressure', genre: 'Rap', duration: 234, year: 2021 },

  // --- Rock ---
  { id: 19, title: 'Hollow Bones', artist: 'Iron Tide', album: 'Saltwater', genre: 'Rock', duration: 268, year: 2018 },
  { id: 20, title: 'Brake Lights', artist: 'Iron Tide', album: 'Saltwater', genre: 'Rock', duration: 245, year: 2018 },
  { id: 21, title: 'Paper Skies', artist: 'The Velvet Cure', album: 'Static Bloom', genre: 'Rock', duration: 287, year: 2017 },
  { id: 22, title: 'Glass Houses', artist: 'The Velvet Cure', album: 'Static Bloom', genre: 'Rock', duration: 254, year: 2017 },
  { id: 23, title: 'Wildfire', artist: 'Northpoint', album: 'Embers', genre: 'Rock', duration: 231, year: 2022 },
  { id: 24, title: 'Run Aground', artist: 'Northpoint', album: 'Embers', genre: 'Rock', duration: 276, year: 2022 },
  { id: 25, title: 'Static Hymn', artist: 'Cobalt Year', album: 'Analog Heart', genre: 'Rock', duration: 298, year: 2019 },
  { id: 26, title: 'Low Ceiling', artist: 'Cobalt Year', album: 'Analog Heart', genre: 'Rock', duration: 213, year: 2019 },
  { id: 27, title: 'Aftertaste', artist: 'Iron Tide', album: 'Saltwater', genre: 'Rock', duration: 259, year: 2018 },

  // --- Électro ---
  { id: 28, title: 'Neon Drift', artist: 'Cyberwave Systems', album: 'Grid Runner', genre: 'Électro', duration: 245, year: 2021 },
  { id: 29, title: 'Midnight Grid', artist: 'Cyberwave Systems', album: 'Grid Runner', genre: 'Électro', duration: 188, year: 2021 },
  { id: 30, title: 'Pulse Width', artist: 'Auralux', album: 'Modular', genre: 'Électro', duration: 312, year: 2020 },
  { id: 31, title: 'Afterglow', artist: 'Auralux', album: 'Modular', genre: 'Électro', duration: 264, year: 2020 },
  { id: 32, title: 'Vapor Trails', artist: 'Lune Noire', album: 'Sous la Ville', genre: 'Électro', duration: 229, year: 2023 },
  { id: 33, title: 'Glass Tunnel', artist: 'Lune Noire', album: 'Sous la Ville', genre: 'Électro', duration: 251, year: 2023 },
  { id: 34, title: 'Sodium Lights', artist: 'Retro Horizon', album: 'Overpass', genre: 'Électro', duration: 206, year: 2019 },
  { id: 35, title: 'Slow Machine', artist: 'Retro Horizon', album: 'Overpass', genre: 'Électro', duration: 287, year: 2019 },
  { id: 36, title: 'Laser Flight', artist: 'Future Kid', album: 'Arcade', genre: 'Électro', duration: 198, year: 2022 },

  // --- Jazz ---
  { id: 37, title: 'Blue Marrow', artist: 'The Ellis Quartet', album: 'Late Set', genre: 'Jazz', duration: 342, year: 2016 },
  { id: 38, title: 'Smoke & Brass', artist: 'The Ellis Quartet', album: 'Late Set', genre: 'Jazz', duration: 298, year: 2016 },
  { id: 39, title: 'Rainy Avenue', artist: 'Odette Lacroix', album: 'Nocturne', genre: 'Jazz', duration: 276, year: 2018 },
  { id: 40, title: 'Velvet Room', artist: 'Odette Lacroix', album: 'Nocturne', genre: 'Jazz', duration: 311, year: 2018 },
  { id: 41, title: 'Two A.M.', artist: 'Marcus Reed Trio', album: 'After Closing', genre: 'Jazz', duration: 264, year: 2021 },
  { id: 42, title: 'Slow Burn', artist: 'Marcus Reed Trio', album: 'After Closing', genre: 'Jazz', duration: 289, year: 2021 },
  { id: 43, title: 'Copper Light', artist: 'The Ellis Quartet', album: 'Late Set', genre: 'Jazz', duration: 305, year: 2016 },
  { id: 44, title: 'Harbor Lullaby', artist: 'Odette Lacroix', album: 'Nocturne', genre: 'Jazz', duration: 247, year: 2018 },
  { id: 45, title: 'Brass Horizon', artist: 'Marcus Reed Trio', album: 'After Closing', genre: 'Jazz', duration: 273, year: 2021 },
];

const AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5-broken.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

/**
 * Liste finale des morceaux, avec une pochette unique par morceau.
 * Le seed dérivé de l'id rend chaque image déterministe et différente.
 */
const CUSTOM_LYRICS = {
  1: [
    { time: 0, text: "🎵 (Introduction de Golden Hour)" },
    { time: 6, text: "It's like a golden hour in the afternoon..." },
    { time: 15, text: "Everything is shining, color is in bloom..." },
    { time: 24, text: "You and me together, dancing in the street..." },
    { time: 32, text: "Underneath the shadows, moving to the beat..." },
    { time: 41, text: "Oh, it's a golden hour, golden hour..." },
    { time: 50, text: "🎵 (Solo de Synthétiseur)" },
    { time: 70, text: "Nothing else matters when I'm looking at you..." },
    { time: 78, text: "The sky is so bright and the feelings are true..." },
    { time: 86, text: "We catch the sunlight in the palm of our hand..." },
    { time: 94, text: "Making memories that will never end..." },
    { time: 102, text: "Oh, it's a golden hour, golden hour..." },
    { time: 115, text: "🎵 (Outro - Douces vibrations)" }
  ],
  2: [
    { time: 0, text: "🎵 (Rythme doux - Paper Hearts)" },
    { time: 8, text: "Remember the days we drew paper hearts..." },
    { time: 18, text: "Never thought that we would drift apart..." },
    { time: 28, text: "Now they're scattered in the autumn wind..." },
    { time: 38, text: "Wondering where it all begins..." },
    { time: 48, text: "Paper hearts on the bedroom floor..." },
    { time: 58, text: "I don't think I can love you more..." },
    { time: 68, text: "But the ink is fading from the page..." },
    { time: 78, text: "We are actors on a silent stage..." },
    { time: 88, text: "🎵 (Solo Guitare acoustique)" }
  ],
  3: [
    { time: 0, text: "🎵 (Neon intro - Electric Smile)" },
    { time: 10, text: "She's got an electric smile, lights up the dark..." },
    { time: 20, text: "Every time she walks by, she leaves a spark..." },
    { time: 30, text: "We run through the city of neon lights..." },
    { time: 40, text: "Living our lives in these summer nights..." },
    { time: 50, text: "Electric smile, oh it drives me wild..." },
    { time: 60, text: "🎵 (Beat de batterie entraînant)" }
  ]
};

function generateMockLyrics(track) {
  const duration = track.duration;
  const lyrics = [];
  const lines = [
    `🎵 (Intro Instrumentale - ${track.title})`,
    "Bienvenue sur ce clone de Spotify Premium !",
    "Une expérience audio moderne, fluide et interactive.",
    `Vous écoutez actuellement "${track.title}" par ${track.artist}.`,
    `Ce morceau fait partie de l'album "${track.album}".`,
    "Les paroles défilent automatiquement en temps réel.",
    "C'est magique, n'est-ce pas ?",
    "Vous pouvez cliquer sur n'importe quelle ligne de paroles...",
    "Pour naviguer instantanément à cet endroit dans le morceau !",
    "N'hésitez pas à aimer ce morceau en cliquant sur le cœur.",
    "Ou à l'ajouter à vos playlists personnalisées.",
    "Profitez de cette incroyable ambiance musicale !",
    "Développement moderne avec React 18 et CSS Modules.",
    "L'égaliseur de fréquences est actif à l'écran.",
    `Merci d'écouter "${track.title}" de l'artiste ${track.artist} !`,
    "🎵 (Outro Instrumentale - Fin du titre)"
  ];
  
  const interval = duration / (lines.length + 1);
  for (let i = 0; i < lines.length; i++) {
    lyrics.push({
      time: Math.round((i + 1) * interval),
      text: lines[i]
    });
  }
  
  lyrics.unshift({ time: 0, text: `🎵 ${track.title} - ${track.artist}` });
  return lyrics;
}

/**
 * Liste finale des morceaux, avec une pochette unique par morceau.
 * Le seed dérivé de l'id rend chaque image déterministe et différente.
 */
export const TRACKS = RAW_TRACKS.map((track) => ({
  ...track,
  coverUrl: `https://picsum.photos/seed/spotify-${track.id}/300/300`,
  audioUrl: AUDIO_URLS[(track.id - 1) % AUDIO_URLS.length],
  lyrics: CUSTOM_LYRICS[track.id] || generateMockLyrics(track)
}));

