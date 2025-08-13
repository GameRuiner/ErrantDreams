import React, { useState, useEffect } from "react";
import styles from "../css/start-page.module.css";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CHARACTER_URL = `${BACKEND_URL}/api/character`;

interface Character {
  id: number;
  name: string;
  faction: string;
  race: string;
  character_class: string;
  level: number;
  experience: number;
  gold: number;
  created_at: string;
}

const StartPage: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacterInfo();
  }, []);

  const fetchCharacterInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError("You must be logged in to view your character.");
        toast.error("Please log in to continue.");
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
        return;
      }

      const res = await axios.get(CHARACTER_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = res.data;

      if (data.success === true && data.character) {
        setCharacter(data.character);
        localStorage.setItem('character', JSON.stringify(data.character));
      } else {
        setError(data.message || "No character found.");
        toast.error("No character found. Please create a character first.");
        setTimeout(() => {
          window.location.href = '/faction-selection';
        }, 2000);
      }

    } catch (err: any) {
      console.error("Character fetch error:", err);
      
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('character');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      } else if (err.response?.status === 404) {
        setError("No character found. Please create a character first.");
        toast.error("No character found. Creating your first character...");
        setTimeout(() => {
          window.location.href = '/faction-selection';
        }, 2000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("Failed to load character information.");
        toast.error("Failed to load character. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('character');
    toast.success("Successfully logged out!");
    window.location.href = '/auth';
  };

  const getFactionIcon = (faction: string) => {
    return faction === 'The Crusaders' ? '🛡️' : '🌙';
  };

  const getClassIcon = (characterClass: string) => {
    const icons: Record<string, string> = {
      'Knight': '⚔️',
      'Arbalist': '🏹',
      'Skirmisher': '🗡️',
      'Blade Dancer': '🌪️',
      'Alchemist': '⚗️',
      'Mystic Poet': '📜'
    };
    return icons[characterClass] || '⚔️';
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <h2>Loading your legend...</h2>
          <p>Gathering tales of your adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>⚠️ Something went wrong</h2>
          <p>{error}</p>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.retryButton}
              onClick={fetchCharacterInfo}
            >
              Try Again
            </button>
            <button 
              className={styles.backButton}
              onClick={() => window.location.href = '/auth'}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>No Character Found</h2>
          <p>You need to create a character before entering the game.</p>
          <button 
            className={styles.createButton}
            onClick={() => window.location.href = '/faction-selection'}
          >
            Create Character
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Errant Dreams</h1>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.characterSection}>
          <div className={styles.characterHeader}>
            <div className={styles.characterIcon}>
              {getClassIcon(character.character_class)}
            </div>
            <div className={styles.characterInfo}>
              <h2 className={styles.characterName}>{character.name}</h2>
              <p className={styles.characterTitle}>
                Level {character.level} {character.race} {character.character_class}
              </p>
            </div>
            <div className={styles.factionBadge}>
              <span className={styles.factionIcon}>
                {getFactionIcon(character.faction)}
              </span>
              <span className={styles.factionName}>{character.faction}</span>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Level</span>
                <span className={styles.statValue}>{character.level}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✨</div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Experience</span>
                <span className={styles.statValue}>{character.experience.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Gold</span>
                <span className={styles.statValue}>{character.gold.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Created</span>
                <span className={styles.statValue}>
                  {new Date(character.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <h3>Choose your path</h3>
          <div className={styles.actionGrid}>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>⚔️</span>
              <span className={styles.actionLabel}>Battle</span>
              <span className={styles.actionDesc}>Engage in combat</span>
            </button>

            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🏰</span>
              <span className={styles.actionLabel}>Town</span>
              <span className={styles.actionDesc}>Visit the marketplace</span>
            </button>

            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🗺️</span>
              <span className={styles.actionLabel}>Explore</span>
              <span className={styles.actionDesc}>Discover new lands</span>
            </button>

            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🎒</span>
              <span className={styles.actionLabel}>Inventory</span>
              <span className={styles.actionDesc}>Manage your items</span>
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Welcome back, brave {character.race}! Your legend continues...</p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;