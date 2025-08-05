import React, { useState } from "react";
import styles from "../css/faction-selection.module.css";
import { toast } from "react-toastify";

const FactionSelectionPage: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFactionSelect = (faction: string) => {
    setSelectedFaction(faction);
  };

  const handleConfirmSelection = async () => {
    if (!selectedFaction) {
      toast.error("Please select a faction before continuing.");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Send faction selection to backend
      toast.success(`Welcome to ${selectedFaction}! Your journey begins...`);
      
      // TODO: Navigate to game/character creation
      setTimeout(() => {
        window.location.href = '/game';
      }, 2000);
      
    } catch (err) {
      toast.error("Failed to save faction selection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectionCard}>
        <h1 className={styles.title}>Choose Your Allegiance</h1>
        <p className={styles.subtitle}>
          In this world torn by holy war, your choice will shape your destiny. 
          Choose wisely, for there is no turning back.
        </p>

        <div className={styles.factionsContainer}>
          <div 
            className={`${styles.factionCard} ${selectedFaction === 'The Crusaders' ? styles.selected : ''}`}
            onClick={() => handleFactionSelect('The Crusaders')}
          >
            <div className={styles.factionHeader}>
              <h2 className={styles.factionName}>The Crusaders</h2>
              <div className={styles.factionSymbol}>🛡️</div>
            </div>
            
            <div className={styles.factionDescription}>
              <p>
                Forged in the fires of holy wars, the Crusaders are armored knights, devout warriors, and disciplined tacticians. Backed by the power of Christian kingdoms like León, Castile, and Aragon, they march south under the banner of faith, seeking to reclaim the land and impose order through steel and scripture. Honor, hierarchy, and divine justice guide their every step.
              </p>
            </div>
          </div>

          <div 
            className={`${styles.factionCard} ${selectedFaction === 'The Moors' ? styles.selected : ''}`}
            onClick={() => handleFactionSelect('The Moors')}
          >
            <div className={styles.factionHeader}>
              <h2 className={styles.factionName}>The Moors</h2>
              <div className={styles.factionSymbol}>🌙</div>
            </div>
            
            <div className={styles.factionDescription}>
              <p>
                Masters of science, strategy, and the scimitar, the Moors are heirs to centuries of knowledge and culture. Hailing from the once-flourishing Caliphate of Córdoba, they now fight to preserve their rich traditions, defend their cities, and resist the encroaching crusade. Swift, cunning, and resourceful, the Moors turn every battle into an art form.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.selectionFooter}>
          <button 
            className={`${styles.confirmButton} ${!selectedFaction ? styles.disabled : ''}`}
            onClick={handleConfirmSelection}
            disabled={isLoading || !selectedFaction}
          >
            {isLoading ? 'Joining...' : `Pledge Allegiance to ${selectedFaction || 'Your Chosen Faction'}`}
          </button>

          <p className={styles.warningText}>
            This choice is permanent and will affect your entire journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default FactionSelectionPage;