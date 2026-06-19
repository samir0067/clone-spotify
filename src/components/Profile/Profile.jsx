import React, { useState } from 'react';
import { TrackList } from '../TrackList/TrackList';
import styles from './Profile.module.css';

const PRESET_AVATARS = [
  {
    id: 'gradient-green-cyan',
    name: 'Menthe Fraîche',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%231db954;stop-opacity:1"/><stop offset="100%" style="stop-color:%2300bcd4;stop-opacity:1"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g1)"/></svg>',
  },
  {
    id: 'gradient-purple-pink',
    name: 'Néon Violet',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%238a2be2;stop-opacity:1"/><stop offset="100%" style="stop-color:%23ff007f;stop-opacity:1"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g2)"/></svg>',
  },
  {
    id: 'gradient-orange-red',
    name: 'Feu Solaire',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23ff8c00;stop-opacity:1"/><stop offset="100%" style="stop-color:%23ff0000;stop-opacity:1"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g3)"/></svg>',
  },
  {
    id: 'gradient-teal-blue',
    name: 'Abysse Bleu',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%234facfe;stop-opacity:1"/><stop offset="100%" style="stop-color:%2300f2fe;stop-opacity:1"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g4)"/></svg>',
  },
];

export function Profile({
  profile,
  onProfileUpdate,
  favoriteTracks = [],
  onTrackSelect,
  currentTrackId,
  isPlaying,
  favorites = [],
  onFavoriteToggle,
  onBrowseTracks,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editPfpUrl, setEditPfpUrl] = useState(profile.pfpUrl);
  const [dragActive, setDragActive] = useState(false);

  const initials = profile.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleOpenModal = () => {
    setEditName(profile.name);
    setEditPfpUrl(profile.pfpUrl);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onProfileUpdate({
      name: editName.trim(),
      pfpUrl: editPfpUrl,
    });
    setIsModalOpen(false);
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditPfpUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFileUpload(file);
  };

  return (
    <div className={styles.profilePage}>
      {/* Profile Header */}
      <section className={styles.profileHeader}>
        <div className={styles.avatarContainer} onClick={handleOpenModal}>
          {profile.pfpUrl ? (
            <img src={profile.pfpUrl} alt="" className={styles.profilePfp} />
          ) : (
            <div className={styles.profilePfpFallback}>
              <span>{initials}</span>
            </div>
          )}
          <div className={styles.avatarOverlay}>
            <svg viewBox="0 0 24 24" className={styles.editIcon} fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            <span>Modifier</span>
          </div>
        </div>

        <div className={styles.headerInfo}>
          <span className={styles.profileBadge}>PROFIL</span>
          <h1 className={styles.username} onClick={handleOpenModal}>
            {profile.name}
          </h1>
          <div className={styles.stats}>
            <span>{favoriteTracks.length} titre{favoriteTracks.length !== 1 ? 's' : ''} aimé{favoriteTracks.length !== 1 ? 's' : ''}</span>
          </div>
          <button className={styles.editProfileBtn} onClick={handleOpenModal}>
            Modifier le profil
          </button>
        </div>
      </section>

      {/* Favorite Tracks Grid */}
      <section className={styles.favoritesSection}>
        <h2 className={styles.sectionTitle}>Titres aimés</h2>
        {favoriteTracks.length > 0 ? (
          <TrackList
            tracks={favoriteTracks}
            onTrackSelect={onTrackSelect}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            favorites={favorites}
            onFavoriteToggle={onFavoriteToggle}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <svg viewBox="0 0 24 24" className={styles.emptyIcon} fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className={styles.emptyText}>Les titres que vous aimez s&apos;afficheront ici.</p>
            <button className={styles.browseBtn} onClick={onBrowseTracks}>
              Parcourir les morceaux
            </button>
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div className={styles.modalHeader}>
              <h2 id="modalTitle" className={styles.modalTitle}>Détails du profil</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)} aria-label="Fermer">
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.modalForm}>
              <div className={styles.modalGrid}>
                {/* Left side: Avatar editing */}
                <div className={styles.avatarEditContainer}>
                  <div
                    className={`${styles.avatarPreview} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    {editPfpUrl ? (
                      <img src={editPfpUrl} alt="" className={styles.modalPreviewPfp} />
                    ) : (
                      <div className={styles.modalPreviewFallback}>{initials}</div>
                    )}
                    <div className={styles.avatarPreviewOverlay}>
                      <svg viewBox="0 0 24 24" className={styles.cameraIcon} fill="currentColor">
                        <circle cx="12" cy="12" r="3.2"/>
                        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                      </svg>
                      <span>Sélectionner une photo</span>
                      <input
                        type="file"
                        id="pfp-upload"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <label htmlFor="pfp-upload" className={styles.uploadLabelBtn}>
                    Télécharger une photo
                  </label>
                  {editPfpUrl && (
                    <button
                      type="button"
                      className={styles.removePfpBtn}
                      onClick={() => setEditPfpUrl('')}
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>

                {/* Right side: Form Details & Presets */}
                <div className={styles.formFields}>
                  <div className={styles.formGroup}>
                    <label htmlFor="username-input" className={styles.inputLabel}>Nom</label>
                    <input
                      type="text"
                      id="username-input"
                      className={styles.textInput}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Ajouter un nom d'affichage"
                      required
                    />
                  </div>

                  <div className={styles.presetsContainer}>
                    <span className={styles.inputLabel}>Ou choisissez un avatar coloré</span>
                    <div className={styles.presetsGrid}>
                      {PRESET_AVATARS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          className={`${styles.presetBtn} ${editPfpUrl === preset.url ? styles.activePreset : ''}`}
                          onClick={() => setEditPfpUrl(preset.url)}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className={styles.presetImage} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.saveBtn}>
                  Enregistrer
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
