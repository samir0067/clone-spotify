import React, { useState, useEffect } from 'react';
import styles from './ProfileModal.module.css';

// Predefined gradient choices for the avatar
const AVATAR_GRADIENTS = [
  { id: 'spotify-green', value: 'linear-gradient(135deg, #1db954 0%, #0d5c29 100%)', label: 'Vert Spotify' },
  { id: 'sunset-flame', value: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)', label: 'Feu de Bengale' },
  { id: 'royal-violet', value: 'linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)', label: 'Aurore Royale' },
  { id: 'cosmic-blue', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', label: 'Bleu Cosmique' },
  { id: 'emerald-gold', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', label: 'Émeraude Magique' }
];

// Predefined emoji choices for the avatar
const AVATAR_EMOJIS = ['🎵', '🎧', '🎤', '🎸', '🎹', '📻', '🕺', '💃', '✨', '🔥', '💖', '😎', '⚡', '💫'];

// Predefined favorite genres
const MUSIC_GENRES = ['Pop', 'Rock', 'Rap', 'Electro', 'Jazz', 'Metal', 'Classique', 'Indie'];

export function ProfileModal({ isOpen, onClose, user, onSave }) {
  // Local state to hold modifications before saving
  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_GRADIENTS[0].value);
  const [avatarEmoji, setAvatarEmoji] = useState('🎵');
  const [subscription, setSubscription] = useState('Free');
  const [favoriteGenre, setFavoriteGenre] = useState('Pop');

  // Reset local state to current user values when modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || 'Utilisateur');
      setAvatarColor(user.avatarColor || AVATAR_GRADIENTS[0].value);
      setAvatarEmoji(user.avatarEmoji || '🎵');
      setSubscription(user.subscription || 'Free');
      setFavoriteGenre(user.favoriteGenre || 'Pop');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Generate initials for preview fallback
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      avatarColor,
      avatarEmoji,
      subscription,
      favoriteGenre
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer la modale">
          &times;
        </button>

        {/* Modal Header/Banner Preview */}
        <div className={styles.profileBanner}>
          <div 
            className={styles.avatarPreview} 
            style={{ background: avatarColor }}
          >
            {avatarEmoji ? (
              <span className={styles.previewEmoji}>{avatarEmoji}</span>
            ) : (
              <span>{initials || 'U'}</span>
            )}
          </div>
          <div className={styles.bannerInfo}>
            <span className={styles.bannerSubtitle}>PROFIL UTILISATEUR</span>
            <h2 id="profile-title" className={styles.bannerTitle}>{name || 'Utilisateur'}</h2>
            <div className={styles.badgeContainer}>
              {subscription === 'Premium' ? (
                <span className={`${styles.badge} ${styles.badgePremium}`}>
                  👑 Premium
                </span>
              ) : (
                <span className={`${styles.badge} ${styles.badgeFree}`}>
                  Standard (Gratuit)
                </span>
              )}
              <span className={styles.genreBadge}>🎵 {favoriteGenre}</span>
            </div>
          </div>
        </div>

        {/* Modal Body / Edit Form */}
        <form onSubmit={handleFormSubmit} className={styles.profileForm}>
          <div className={styles.formGrid}>
            
            {/* Left Column: Form Inputs */}
            <div className={styles.formFields}>
              <div className={styles.inputGroup}>
                <label htmlFor="user-name">Nom d&apos;utilisateur</label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                  required
                  placeholder="Entrez votre nom"
                  className={styles.textInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Type d&apos;abonnement</label>
                <div className={styles.subscriptionToggle}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${subscription === 'Free' ? styles.toggleActive : ''}`}
                    onClick={() => setSubscription('Free')}
                  >
                    Gratuit
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${subscription === 'Premium' ? styles.toggleActivePremium : ''}`}
                    onClick={() => setSubscription('Premium')}
                  >
                    Premium
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Genre de musique favori</label>
                <div className={styles.genreGrid}>
                  {MUSIC_GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={`${styles.genreTag} ${favoriteGenre === genre ? styles.genreTagActive : ''}`}
                      onClick={() => setFavoriteGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Customizer & Simulated Stats */}
            <div className={styles.customizerPane}>
              <div className={styles.inputGroup}>
                <label>Dégradé d&apos;avatar</label>
                <div className={styles.gradientSelector}>
                  {AVATAR_GRADIENTS.map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      className={`${styles.gradientBubble} ${avatarColor === grad.value ? styles.gradientBubbleActive : ''}`}
                      style={{ background: grad.value }}
                      title={grad.label}
                      onClick={() => setAvatarColor(grad.value)}
                    >
                      {avatarColor === grad.value && <span className={styles.checkIcon}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Icône d&apos;avatar (Emoji)</label>
                <div className={styles.emojiGrid}>
                  {AVATAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`${styles.emojiBtn} ${avatarEmoji === emoji ? styles.emojiBtnActive : ''}`}
                      onClick={() => setAvatarEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Stats Section */}
              <div className={styles.statsSection}>
                <h3>Statistiques d&apos;écoute</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>42.8h</span>
                    <span className={styles.statLabel}>Temps d&apos;écoute</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>24</span>
                    <span className={styles.statLabel}>Titres favoris</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>156</span>
                    <span className={styles.statLabel}>Lectures</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.actionsBar}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.saveBtn}>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
